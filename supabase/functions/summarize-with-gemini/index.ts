
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

    // Create a prompt for Gemini
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
    `;

    console.log("Calling Gemini API with prompt:", prompt.substring(0, 100) + "...");

    // Call Gemini API
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

    // Try to parse the JSON response
    let data;
    try {
      data = await response.json();
      console.log("Gemini API response received:", JSON.stringify(data).substring(0, 200) + "...");
    } catch (parseError) {
      const responseText = await response.text();
      console.error("Failed to parse Gemini API response:", responseText);
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
    
    // Extract the summary text
    const summary = data.candidates[0].content.parts[0].text;
    
    if (!summary) {
      console.error("No summary text in Gemini API response:", data);
      throw new Error("No summary text in Gemini API response");
    }

    console.log("Successfully generated summary, returning response");
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
