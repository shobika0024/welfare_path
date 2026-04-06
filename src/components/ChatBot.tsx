import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Trash2, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatbot } from '@/hooks/useChatbot';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { cn } from '@/lib/utils';

const ChatBot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isVoiceReplyEnabled, setIsVoiceReplyEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, isLoading, sendMessage, clearMessages } = useChatbot();

  const handleVoiceResult = useCallback((text: string) => {
    setInput(text);
    if (text.trim() && !isLoading) {
      sendMessage(text, isVoiceReplyEnabled);
      setInput('');
    }
  }, [sendMessage, isLoading, isVoiceReplyEnabled]);

  const { isListening, transcript, startListening, stopListening } = useVoiceSearch(
    i18n.language.startsWith('ta') ? 'ta-IN' : 'en-IN',
    handleVoiceResult
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input, isVoiceReplyEnabled);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const greetingMessage = i18n.language === 'ta'
    ? 'வணக்கம்! 👋 நான் உங்கள் நலவாழ்வு உதவியாளர். நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?\n\nநீங்கள் என்னிடம் கேட்கலாம்:\n• "நான் ஒரு விவசாயி, எனக்கு என்ன உதவி கிடைக்கும்?"\n• "கல்வி உதவித்தொகை பற்றி சொல்லுங்கள்"\n• "சுகாதார காப்பீடு எவ்வாறு பெறுவது?"'
    : 'Hello! 👋 I\'m your Welfare Path Assistant. How can I help you today?\n\nYou can ask me:\n• "I\'m a farmer, what help is available for me?"\n• "Tell me about education scholarships"\n• "How can I get health insurance?"';

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110",
          isOpen && "hidden"
        )}
        aria-label={t('chatbot.open', 'Open chat assistant')}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  {i18n.language === 'ta' ? 'நலவாழ்வு உதவியாளர்' : 'Welfare Assistant'}
                </h3>
                <p className="text-xs opacity-80">
                  {i18n.language === 'ta' ? 'AI மூலம் இயக்கப்படுகிறது' : 'Powered by AI'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => {
                  setIsVoiceReplyEnabled(!isVoiceReplyEnabled);
                  if (isVoiceReplyEnabled && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                title={isVoiceReplyEnabled ? (i18n.language === 'ta' ? 'குரல் பதிலை முடக்கு' : 'Disable voice reply') : (i18n.language === 'ta' ? 'குரல் பதிலை இயக்கு' : 'Enable voice reply')}
                aria-label={t('chatbot.toggleVoiceReply', 'Toggle voice reply')}
              >
                {isVoiceReplyEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-70" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={clearMessages}
                aria-label={t('chatbot.clear', 'Clear chat')}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
                aria-label={t('common.close', 'Close')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {/* Greeting */}
            {messages.length === 0 && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-background border border-border rounded-2xl rounded-tl-sm p-3 max-w-[85%] shadow-sm">
                  <p className="text-sm whitespace-pre-line">{greetingMessage}</p>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-3", msg.role === 'user' && "flex-row-reverse")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-primary/10"
                )}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                </div>
                <div className={cn(
                  "rounded-2xl p-3 max-w-[85%] shadow-sm",
                  msg.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-background border border-border rounded-tl-sm"
                )}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-background border border-border rounded-2xl rounded-tl-sm p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {i18n.language === 'ta' ? 'சிந்திக்கிறது...' : 'Thinking...'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-background shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={i18n.language === 'ta' ? 'உங்கள் கேள்வியை உள்ளிடுக...' : 'Type your question...'}
                  className="w-full px-4 py-2.5 pr-10 rounded-full border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={toggleVoice}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors",
                    isListening ? "bg-red-500 text-white" : "text-muted-foreground hover:text-primary"
                  )}
                  aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="rounded-full w-10 h-10 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {isListening && (
              <p className="text-xs text-center text-muted-foreground mt-2 animate-pulse">
                {i18n.language === 'ta' ? '🎤 கேட்கிறது...' : '🎤 Listening...'}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
