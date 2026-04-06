import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { schemesData } from '@/data/schemes';
import { schemeTranslations } from '@/i18n/translations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { i18n } = useTranslation();

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim()) return;

    // Initialize speech synthesis loudly in the same event loop to bypass browser autoplay policy
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const initUtterance = new SpeechSynthesisUtterance('');
      initUtterance.volume = 0;
      window.speechSynthesis.speak(initUtterance);
    }

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input })
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      const predictedCategory = data.category;
      
      let matchingSchemes = schemesData.filter(scheme => {
        if (predictedCategory === 'Farmer') return scheme.categoryKey === 'agriculture';
        if (predictedCategory === 'Student') return scheme.categoryKey === 'education';
        if (predictedCategory === 'Pregnant') return scheme.title.toLowerCase().includes('maternity') || scheme.description.toLowerCase().includes('pregnant') || scheme.categoryKey === 'healthcare';
        return false;
      });

      const isTamil = i18n.language === 'ta';
      let responseText = isTamil 
        ? "தயவுசெய்து மேலும் விவரங்களை வழங்கவும். தொடர்புடைய திட்டங்களை என்னால் கண்டுபிடிக்க முடியவில்லை." 
        : "Please provide more details. I couldn't find specific schemes for those keywords.";

      if (matchingSchemes.length > 0) {
        const catTa = predictedCategory === 'Farmer' ? 'விவசாயி' : predictedCategory === 'Student' ? 'மாணவர்' : 'கர்ப்பிணி';
        const displayCat = isTamil ? catTa : predictedCategory;
        
        responseText = isTamil 
          ? `எங்கள் AI மாதிரி உங்கள் கோரிக்கையை இவ்வாறு அறிந்துள்ளது: **${displayCat}**.\n\nபரிந்துரைக்கப்படும் திட்டங்கள் இங்கே:\n\n`
          : `Our Machine Learning model classified your request as: **${displayCat}**.\n\nHere are the recommended schemes:\n\n`;
          
        matchingSchemes.slice(0, 5).forEach((scheme, index) => {
          const title = isTamil ? (schemeTranslations.ta[scheme.id]?.title || scheme.title) : scheme.title;
          responseText += `${index + 1}. ${title}\n`;
        });
        
        if (matchingSchemes.length > 5) {
          responseText += isTamil
            ? `\n...மற்றும் ${matchingSchemes.length - 5} மேல். இவற்றை நீங்கள் திட்டங்கள் பக்கத்தில் முழுமையாக தேடலாம்!`
            : `\n...and ${matchingSchemes.length - 5} more. You can search these in the Library!`;
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);

      // --- Text-To-Speech (Voice Output) ---
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Setup new utterance
        const utterance = new SpeechSynthesisUtterance(responseText);
        // Clean out markdown asterisks so the voice doesn't spell them out
        utterance.text = responseText.replace(/\*\*/g, '');
        utterance.lang = isTamil ? 'ta-IN' : 'en-IN';
        
        // Optional: fine-tune pitch/rate
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('ML API Error:', error);
      const isTamil = i18n.language === 'ta';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: isTamil ? "மன்னிக்கவும், AI மாடல் சேவை தற்போது முடங்கியுள்ளது." : "Sorry, the Machine Learning prediction server is currently offline. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
