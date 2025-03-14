
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content } = await req.json();
    
    if (!content || content.trim() === '') {
      throw new Error('No content provided for summarization');
    }

    // Strip HTML tags if present (simple implementation)
    const plainContent = content.replace(/<[^>]*>?/gm, '');
    
    // Truncate if content is too long (Gemini has token limits)
    const truncatedContent = plainContent.length > 8000 
      ? plainContent.substring(0, 8000) + '...'
      : plainContent;

    console.log(`Processing request to summarize content for "${title}". Content length: ${plainContent.length} chars`);
    
    // Create a structured prompt that explicitly instructs Gemini to return a JSON response
    const prompt = `
    Título del curso: "${title}"
    
    Contenido a resumir:
    ${truncatedContent}
    
    Instrucciones:
    1. Genera un resumen conciso y claro del contenido anterior en español.
    2. El resumen debe tener entre 3-5 párrafos.
    3. Destaca los puntos clave y las ideas principales.
    4. Usa un tono profesional pero accesible.
    5. Evita repeticiones y contenido irrelevante.
    6. IMPORTANTE: Tu respuesta DEBE ser EXCLUSIVAMENTE un objeto JSON con la siguiente estructura: 
       { "summary": "el texto del resumen aquí" }
    7. No incluyas explicaciones, comentarios, o cualquier texto que NO sea parte del objeto JSON.
    8. No uses acentos, comillas o caracteres especiales en las claves del JSON (solo en los valores).
    `;

    // Use the correct API endpoint for gemini-pro model
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    const apiKey = "AIzaSyAFtpHsblfChzk-CzYYAJe4nccpSw9IEH4";

    console.log(`Calling Gemini API at: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4, // Lower temperature for more deterministic JSON output
          maxOutputTokens: 800,
        },
      }),
    });

    // Log response status for debugging
    console.log(`Gemini API response status: ${response.status}`);

    // First check if the response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API HTTP error:", response.status, errorText);
      throw new Error(`HTTP error from Gemini API: ${response.status} ${errorText}`);
    }

    // Get full response body as text for debugging
    const responseText = await response.text();
    console.log("Gemini API raw response first 200 chars:", responseText.substring(0, 200));
    
    // Try to parse the Gemini response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Gemini API response:", parseError.message);
      throw new Error(`Failed to parse Gemini API response: ${parseError.message}`);
    }
    
    // Check for errors in Gemini response
    if (data.error) {
      console.error("Gemini API error:", data.error);
      throw new Error(`Error from Gemini API: ${data.error.message}`);
    }
    
    // Validate the response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error("Unexpected Gemini API response structure:", JSON.stringify(data));
      throw new Error("Unexpected response structure from Gemini API");
    }
    
    // Extract the response text
    const modelResponseText = data.candidates[0].content.parts[0].text;
    
    if (!modelResponseText) {
      console.error("No text in Gemini API response:", JSON.stringify(data));
      throw new Error("No text in Gemini API response");
    }

    console.log("Model response text first 100 chars:", modelResponseText.substring(0, 100));
    
    // Improved JSON extraction from the model response
    let summary;
    try {
      // Clean the response text to increase chances of valid JSON
      const cleanedText = modelResponseText.trim()
        .replace(/^```json/, '') // Remove potential Markdown JSON code block start
        .replace(/```$/, '')     // Remove potential Markdown code block end
        .trim();
      
      // Attempt to parse as JSON
      const jsonResponse = JSON.parse(cleanedText);
      
      if (jsonResponse && jsonResponse.summary) {
        summary = jsonResponse.summary;
        console.log("Successfully extracted summary from JSON");
      } else {
        // If we got valid JSON but no summary field
        console.error("Invalid JSON structure (no summary field):", jsonResponse);
        throw new Error("Gemini returned valid JSON but without the required summary field");
      }
    } catch (jsonError) {
      console.error("Couldn't parse response as JSON:", jsonError.message);
      
      // More aggressive JSON extraction with regex
      const jsonMatch = modelResponseText.match(/\{[\s\S]*"summary"[\s\S]*:[\s\S]*"[\s\S]*"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          if (extractedJson && extractedJson.summary) {
            summary = extractedJson.summary;
            console.log("Successfully extracted JSON using regex");
          } else {
            throw new Error("Extracted JSON doesn't contain summary field");
          }
        } catch (extractError) {
          console.error("Failed to extract JSON with regex:", extractError.message);
          // Last resort - try to find any text that looks like a summary
          if (modelResponseText.length > 50 && !modelResponseText.includes('```') && !modelResponseText.includes('{"summary":')) {
            summary = modelResponseText.trim();
            console.log("Using full response as summary after failed JSON extraction");
          } else {
            throw new Error("Could not extract valid summary from Gemini response");
          }
        }
      } else {
        // If no JSON pattern found, check if the text itself looks like a summary
        if (modelResponseText.length > 50 && !modelResponseText.includes('```')) {
          summary = modelResponseText.trim();
          console.log("No JSON found, using entire text as summary");
        } else {
          throw new Error("Could not find summary content in Gemini response");
        }
      }
    }

    console.log("Final summary length:", summary.length);
    
    // Return the summary as JSON
    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in summarize-with-gemini function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
