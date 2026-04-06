import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VoiceNarrationState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

interface NarrationContent {
  schemeName: string;
  description: string;
  eligibility: string[];
  documents: string[];
}

export const useVoiceNarration = (language: "en" | "ta" = "en") => {
  const [state, setState] = useState<VoiceNarrationState>({
    isPlaying: false,
    isLoading: false,
    error: null,
  });
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentSchemeRef = useRef<string | null>(null);
  const voicesLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      
      // Pre-load voices
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices();
        if (voices && voices.length > 0) {
          voicesLoadedRef.current = true;
        }
      };
      
      loadVoices();
      
      // Chrome needs this event
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }
    
    return () => {
      stopNarration();
    };
  }, []);

  // Stop narration when language changes
  useEffect(() => {
    if (currentSchemeRef.current) {
      stopNarration();
    }
  }, [language]);

  const getVoiceForLanguage = useCallback((lang: string): SpeechSynthesisVoice | null => {
    if (!synthRef.current) return null;
    
    const voices = synthRef.current.getVoices();
    
    if (lang === "ta") {
      // Tamil voice preferences
      const tamilVoice = voices.find(v => 
        v.lang === "ta-IN" || 
        v.lang.startsWith("ta") ||
        v.name.toLowerCase().includes("tamil")
      );
      if (tamilVoice) return tamilVoice;
      
      // Fallback to Hindi as it's closer to Tamil for Indian context
      const hindiVoice = voices.find(v => v.lang === "hi-IN" || v.lang.startsWith("hi"));
      if (hindiVoice) return hindiVoice;
    }
    
    // English (Indian) preferences
    const indianEnglishVoice = voices.find(v => 
      v.lang === "en-IN" || 
      v.name.toLowerCase().includes("india")
    );
    if (indianEnglishVoice) return indianEnglishVoice;
    
    // Fallback to any English voice
    const englishVoice = voices.find(v => v.lang.startsWith("en"));
    if (englishVoice) return englishVoice;

    // Last resort: first available voice
    return voices[0] || null;
  }, []);

  const stopNarration = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setState(prev => ({ ...prev, isPlaying: false, isLoading: false }));
  }, []);

  const speakText = useCallback(async (
    content: NarrationContent,
    schemeId: string
  ) => {
    // Check if speech synthesis is supported
    if (!synthRef.current) {
      setState(prev => ({ 
        ...prev, 
        error: "Speech not supported in this browser" 
      }));
      return;
    }

    // Stop any ongoing narration
    stopNarration();
    
    // Update current scheme reference
    currentSchemeRef.current = schemeId;

    setState({ isPlaying: false, isLoading: true, error: null });

    try {
      // Prepare the narration text based on language
      let narrationText: string;
      
      if (language === "ta") {
        narrationText = `${content.schemeName}. 
          விளக்கம்: ${content.description}. 
          யார் விண்ணப்பிக்கலாம்: ${content.eligibility.join(", ")}.
          தேவையான ஆவணங்கள்: ${content.documents.join(", ")}`;
      } else {
        narrationText = `${content.schemeName}. 
          Description: ${content.description}. 
          Who can apply: ${content.eligibility.join(", ")}.
          Required Documents: ${content.documents.join(", ")}`;
      }

      // Try to process text through AI for more natural speech
      let processedText = narrationText;
      let speechRate = language === "ta" ? 0.85 : 0.9;

      try {
        const { data, error } = await supabase.functions.invoke("text-to-speech", {
          body: { text: narrationText, language }
        });

        if (!error && data?.processedText) {
          processedText = data.processedText;
          speechRate = data.rate || speechRate;
        }
      } catch (e) {
        console.log("AI processing unavailable, using original text");
      }

      // Check if we're still on the same scheme
      if (currentSchemeRef.current !== schemeId) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Ensure voices are loaded
      let voices = synthRef.current.getVoices();
      if (voices.length === 0) {
        await new Promise<void>((resolve) => {
          const checkVoices = () => {
            voices = synthRef.current!.getVoices();
            if (voices.length > 0) {
              resolve();
            } else {
              setTimeout(checkVoices, 100);
            }
          };
          checkVoices();
          // Timeout after 2 seconds
          setTimeout(resolve, 2000);
        });
      }

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(processedText);
      utteranceRef.current = utterance;

      // Set voice based on language
      const voice = getVoiceForLanguage(language);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = language === "ta" ? "ta-IN" : "en-IN";
      }

      utterance.rate = speechRate;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Event handlers
      utterance.onstart = () => {
        if (currentSchemeRef.current === schemeId) {
          setState({ isPlaying: true, isLoading: false, error: null });
        }
      };

      utterance.onend = () => {
        if (currentSchemeRef.current === schemeId) {
          setState({ isPlaying: false, isLoading: false, error: null });
        }
      };

      utterance.onerror = (event) => {
        console.error("Speech error:", event.error);
        // Don't show error for 'canceled' which happens on stop
        if (event.error !== 'canceled' && currentSchemeRef.current === schemeId) {
          setState({ 
            isPlaying: false, 
            isLoading: false, 
            error: null // Silently fail - browser may not support
          });
        }
      };

      // Start speaking
      synthRef.current.speak(utterance);

      // Chrome bug workaround: speech can pause after 15 seconds
      // Keep it alive with periodic resume
      const keepAlive = setInterval(() => {
        if (synthRef.current && synthRef.current.speaking && !synthRef.current.paused) {
          synthRef.current.pause();
          synthRef.current.resume();
        } else if (!synthRef.current?.speaking) {
          clearInterval(keepAlive);
        }
      }, 10000);

      utterance.onend = () => {
        clearInterval(keepAlive);
        if (currentSchemeRef.current === schemeId) {
          setState({ isPlaying: false, isLoading: false, error: null });
        }
      };

    } catch (error) {
      console.error("Narration error:", error);
      setState({ 
        isPlaying: false, 
        isLoading: false, 
        error: null // Don't show technical errors to users
      });
    }
  }, [language, stopNarration, getVoiceForLanguage]);

  const toggleNarration = useCallback((
    content: NarrationContent,
    schemeId: string
  ) => {
    if (state.isPlaying && currentSchemeRef.current === schemeId) {
      stopNarration();
    } else {
      speakText(content, schemeId);
    }
  }, [state.isPlaying, speakText, stopNarration]);

  return {
    ...state,
    speakText,
    stopNarration,
    toggleNarration,
    currentSchemeId: currentSchemeRef.current,
  };
};
