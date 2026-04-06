import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Mic, X, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { schemesData, categories } from "@/data/schemes";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  category: string;
  type: "scheme" | "category";
  matchedOn: string;
}

interface SearchBarProps {
  className?: string;
  onClose?: () => void;
  autoFocus?: boolean;
}

const SearchBar = ({ className, onClose, autoFocus = false }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleVoiceResult = useCallback((text: string) => {
    setQuery(text);
    searchSchemes(text);
  }, []);

  const { isListening, startListening, stopListening, isSupported, transcript } = useVoiceSearch(
    i18n.language,
    handleVoiceResult
  );

  // Update query when transcript changes during listening
  useEffect(() => {
    if (isListening && transcript) {
      setQuery(transcript);
    }
  }, [transcript, isListening]);

  const searchSchemes = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search categories
    categories.forEach((cat) => {
      if (cat.name.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: cat.key,
          title: cat.name,
          category: "",
          type: "category",
          matchedOn: "Category",
        });
      }
    });

    // Search schemes
    schemesData.forEach((scheme) => {
      let matchedOn = "";

      // Match on title
      if (scheme.title.toLowerCase().includes(lowerQuery)) {
        matchedOn = "Name";
      }
      // Match on category
      else if (scheme.category.toLowerCase().includes(lowerQuery)) {
        matchedOn = "Category";
      }
      // Match on eligibility
      else if (scheme.eligibility.some((e) => e.toLowerCase().includes(lowerQuery))) {
        matchedOn = "Eligibility";
      }
      // Match on amount
      else if (scheme.amount.toLowerCase().includes(lowerQuery)) {
        matchedOn = "Amount";
      }
      // Match on description
      else if (scheme.description.toLowerCase().includes(lowerQuery)) {
        matchedOn = "Description";
      }

      if (matchedOn) {
        searchResults.push({
          id: scheme.id,
          title: scheme.title,
          category: scheme.category,
          type: "scheme",
          matchedOn,
        });
      }
    });

    setResults(searchResults.slice(0, 8));
    setIsOpen(searchResults.length > 0);
    setSelectedIndex(-1);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchSchemes(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchSchemes]);

  const handleSelect = (result: SearchResult) => {
    if (result.type === "category") {
      navigate(`/schemes?category=${result.id}`);
    } else {
      navigate(`/schemes/${result.id}`);
    }
    setQuery("");
    setIsOpen(false);
    onClose?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query.trim()) {
        navigate(`/schemes?search=${encodeURIComponent(query)}`);
        setQuery("");
        setIsOpen(false);
        onClose?.();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={t("nav.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          autoFocus={autoFocus}
          className="pl-10 pr-20 bg-background text-foreground"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {isSupported && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 transition-colors",
                isListening && "text-destructive animate-pulse"
              )}
              onClick={handleVoiceClick}
              title={t("hero.voiceSearch")}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Voice listening indicator */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex gap-1">
              <span className="w-1 h-4 bg-destructive rounded animate-pulse" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-6 bg-destructive rounded animate-pulse" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-4 bg-destructive rounded animate-pulse" style={{ animationDelay: "300ms" }} />
              <span className="w-1 h-5 bg-destructive rounded animate-pulse" style={{ animationDelay: "450ms" }} />
            </div>
            <span className="text-muted-foreground">{t("hero.listening")}</span>
            {transcript && <span className="font-medium">{transcript}</span>}
          </div>
        </div>
      )}

      {/* Search results dropdown */}
      {isOpen && !isListening && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {t("schemes.noResults")}
            </div>
          ) : (
            <ul className="py-2">
              {results.map((result, index) => (
                <li key={`${result.type}-${result.id}`}>
                  <button
                    className={cn(
                      "w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center justify-between",
                      selectedIndex === index && "bg-muted"
                    )}
                    onClick={() => handleSelect(result)}
                  >
                    <div>
                      <div className="font-medium text-foreground">{result.title}</div>
                      {result.category && (
                        <div className="text-sm text-muted-foreground">{result.category}</div>
                      )}
                    </div>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {result.type === "category" ? "Category" : result.matchedOn}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border p-2 text-xs text-muted-foreground text-center">
            Press Enter to search all schemes
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
