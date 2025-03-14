
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

    const data = await response.json();
    
    // Check for errors in Gemini response
    if (data.error) {
      console.error("Gemini API error:", data.error);
      throw new Error(`Error from Gemini API: ${data.error.message}`);
    }
    
    // Extract the summary text
    const summary = data.candidates[0].content.parts[0].text;

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
