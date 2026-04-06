import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Voice configurations for different languages
const voiceConfigs: Record<string, { voice: string; lang: string; rate: number }> = {
  en: {
    voice: "en-IN", // Indian English
    lang: "en-IN",
    rate: 0.9,
  },
  ta: {
    voice: "ta-IN", // Tamil
    lang: "ta-IN", 
    rate: 0.85,
  },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language = "en" } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const voiceConfig = voiceConfigs[language] || voiceConfigs.en;

    // Use Lovable AI to generate a more natural speech-like text
    // Then we'll return the text with SSML markers for the browser to synthesize
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a text preprocessor for text-to-speech. Your job is to:
1. Clean up the text for natural speech
2. Add natural pauses using "..." for longer pauses and "," for shorter ones
3. Keep the exact meaning but make it more speech-friendly
4. Return ONLY the processed text, nothing else
5. Maintain the same language as input (${language === "ta" ? "Tamil" : "English"})
6. Do not translate, just optimize for speech`
          },
          {
            role: "user",
            content: text
          }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      // If AI processing fails, just return original text
      console.log("AI processing failed, using original text");
      return new Response(
        JSON.stringify({ 
          processedText: text,
          language: voiceConfig.lang,
          rate: voiceConfig.rate,
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const data = await response.json();
    const processedText = data.choices?.[0]?.message?.content || text;

    return new Response(
      JSON.stringify({ 
        processedText: processedText.trim(),
        language: voiceConfig.lang,
        rate: voiceConfig.rate,
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("TTS error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
