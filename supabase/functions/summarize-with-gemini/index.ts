
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
    
    if (!title || !content) {
      console.error("Missing title or content in request");
      return new Response(JSON.stringify({ error: 'Missing title or content' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Strip HTML tags if present (simple implementation)
    const plainContent = content.replace(/<[^>]*>?/gm, '');
    
    // Truncate if content is too long (Gemini has token limits)
    const truncatedContent = plainContent.length > 8000 
      ? plainContent.substring(0, 8000) + '...'
      : plainContent;

    console.log(`Processing request to summarize content for "${title}". Content length after processing: ${truncatedContent.length} chars`);
    
    // API Key - hardcoded for simplicity but consider using Deno.env
    const apiKey = "AIzaSyAFtpHsblfChzk-CzYYAJe4nccpSw9IEH4";
    
    // Use the correct API endpoint for gemini-pro model
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    console.log(`Calling Gemini API at: ${apiUrl}`);

    // Create a simplified, more direct prompt
    const prompt = `
    Título del curso: "${title}"
    
    Contenido a resumir:
    ${truncatedContent}
    
    Por favor, genera un resumen conciso en español de 3-5 párrafos que capture los puntos clave de este contenido. El resumen debe ser claro, bien estructurado y fácil de entender.
    `;

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
          temperature: 0.4,
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
      return new Response(JSON.stringify({ error: `Error from Gemini API: ${response.status} - ${errorText}` }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get full response data
    const data = await response.json();
    console.log("Gemini API response structure:", JSON.stringify(data).substring(0, 200) + "...");
    
    // Validate the response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error("Unexpected Gemini API response structure:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Unexpected response structure from Gemini API" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Extract the text content directly
    const summary = data.candidates[0].content.parts[0].text;
    
    if (!summary) {
      console.error("No text content in Gemini API response");
      return new Response(JSON.stringify({ error: "No summary content in response" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Successfully generated summary, length:", summary.length);
    
    // Return the summary directly
    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in summarize-with-gemini function:', error);
    return new Response(JSON.stringify({ error: error.message || "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
