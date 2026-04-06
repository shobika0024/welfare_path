import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceNarration } from "@/hooks/useVoiceNarration";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

interface VoiceNarrationButtonProps {
  schemeName: string;
  description: string;
  eligibility: string[];
  documents: string[];
  schemeId: string;
  autoPlay?: boolean;
  variant?: "default" | "icon";
  className?: string;
}

const VoiceNarrationButton = ({
  schemeName,
  description,
  eligibility,
  documents,
  schemeId,
  autoPlay = false,
  variant = "default",
  className = "",
}: VoiceNarrationButtonProps) => {
  const { i18n } = useTranslation();
  const language = i18n.language as "en" | "ta";
  const prevLanguageRef = useRef(language);
  const wasPlayingRef = useRef(false);
  
  const { 
    isPlaying, 
    isLoading, 
    toggleNarration, 
    stopNarration,
    speakText 
  } = useVoiceNarration(language);

  const content = {
    schemeName,
    description,
    eligibility,
    documents,
  };

  // Handle language change - restart narration in new language if was playing
  useEffect(() => {
    if (prevLanguageRef.current !== language) {
      const wasPlaying = wasPlayingRef.current;
      prevLanguageRef.current = language;
      
      if (wasPlaying) {
        // Small delay to let the hook reinitialize with new language
        const timer = setTimeout(() => {
          speakText(content, schemeId);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [language, schemeId, speakText]);

  // Track playing state for language switches
  useEffect(() => {
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Stop narration when scheme changes (unmount)
  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, [schemeId, stopNarration]);

  const handleClick = () => {
    toggleNarration(content, schemeId);
  };

  const buttonLabel = isPlaying 
    ? (language === "ta" ? "நிறுத்து" : "Stop")
    : (language === "ta" ? "கேளுங்கள்" : "Listen");

  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        disabled={isLoading}
        className={`relative ${className}`}
        aria-label={buttonLabel}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
        {isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={isPlaying ? "default" : "outline"}
      onClick={handleClick}
      disabled={isLoading}
      className={`gap-2 ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {language === "ta" ? "ஏற்றுகிறது..." : "Loading..."}
        </>
      ) : isPlaying ? (
        <>
          <VolumeX className="h-4 w-4" />
          {buttonLabel}
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground"></span>
          </span>
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4" />
          {buttonLabel}
        </>
      )}
    </Button>
  );
};

export default VoiceNarrationButton;
