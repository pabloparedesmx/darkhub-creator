
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

    // Truncate if content is too long (Gemini has token limits)
    const truncatedContent = content.length > 8000 
      ? content.substring(0, 8000) + '...'
      : content;

    console.log("Creating prompt for Gemini API");
    
    // Create a structured prompt that instructs Gemini to return a JSON response
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
    6. IMPORTANTE: Debes retornar EXCLUSIVAMENTE un objeto JSON válido con la siguiente estructura:
       { "summary": "el texto del resumen aquí" }
    7. No incluyas ningún texto adicional o explicación fuera del objeto JSON.
    `;

    console.log("Calling Gemini API with structured prompt");

    // Call Gemini API with specific configuration for JSON output
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": "AIzaSyAFtpHsblfChzk-CzYYAJe4nccpSw9IEH4",
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
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    // First check if the response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API HTTP error:", response.status, errorText);
      throw new Error(`HTTP error from Gemini API: ${response.status} ${errorText}`);
    }

    // Get full response body as text
    const responseBody = await response.text();
    console.log("Gemini API raw response:", responseBody.substring(0, 200) + "...");
    
    // Try to parse the Gemini response
    let data;
    try {
      data = JSON.parse(responseBody);
    } catch (parseError) {
      console.error("Failed to parse Gemini API response:", responseBody);
      throw new Error(`Failed to parse Gemini API response: ${parseError.message}`);
    }
    
    // Check for errors in Gemini response
    if (data.error) {
      console.error("Gemini API error:", data.error);
      throw new Error(`Error from Gemini API: ${data.error.message}`);
    }
    
    // Validate the response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error("Unexpected Gemini API response structure:", data);
      throw new Error("Unexpected response structure from Gemini API");
    }
    
    // Extract the response text
    const responseText = data.candidates[0].content.parts[0].text;
    
    if (!responseText) {
      console.error("No text in Gemini API response:", data);
      throw new Error("No text in Gemini API response");
    }

    console.log("Raw text from Gemini:", responseText.substring(0, 200) + "...");
    
    // Try to extract the JSON from the response text
    // First, we'll try to parse it directly in case it's a clean JSON string
    let summary;
    try {
      // Attempt to parse the entire response as JSON
      const jsonResponse = JSON.parse(responseText.trim());
      if (jsonResponse && jsonResponse.summary) {
        summary = jsonResponse.summary;
        console.log("Successfully extracted summary from JSON response");
      } else {
        // If we got valid JSON but no summary field
        console.error("Invalid JSON structure (no summary field):", jsonResponse);
        throw new Error("Gemini returned valid JSON but without the required summary field");
      }
    } catch (jsonError) {
      // If direct parsing fails, try to extract JSON from text
      console.log("Couldn't parse response directly as JSON, attempting to extract JSON...");
      try {
        // Look for JSON-like patterns
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          const extractedJson = JSON.parse(jsonStr);
          if (extractedJson && extractedJson.summary) {
            summary = extractedJson.summary;
            console.log("Successfully extracted JSON from text response");
          } else {
            throw new Error("Extracted JSON doesn't contain summary field");
          }
        } else {
          // If no JSON pattern found, use the whole text as summary
          console.log("No JSON found in response, using entire text as summary");
          summary = responseText.trim();
        }
      } catch (extractError) {
        console.error("Failed to extract JSON:", extractError);
        // Fall back to using the whole response as the summary
        summary = responseText.trim();
        console.log("Using full response as summary after failed JSON extraction");
      }
    }

    console.log("Final summary (first 100 chars):", summary.substring(0, 100) + "...");
    
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
