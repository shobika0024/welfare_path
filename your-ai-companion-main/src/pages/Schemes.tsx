import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, Clock, Eye, ExternalLink, Mic } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { schemesData, categories } from "@/data/schemes";
import { useTranslation } from "react-i18next";
import { schemeTranslations, categoryKeyMap } from "@/i18n/translations";

const Schemes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [isListening, setIsListening] = useState(false);
  const { t, i18n } = useTranslation();

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === "ta" ? "ta-IN" : "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Update category from URL params on load
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Update URL when category changes
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", value);
    }
    setSearchParams(searchParams);
  };

  const getSchemeData = (schemeId: string) => {
    const lang = i18n.language as "en" | "ta";
    return schemeTranslations[lang]?.[schemeId] || schemeTranslations.en[schemeId];
  };

  const filteredSchemes = schemesData.filter((scheme) => {
    const translatedScheme = getSchemeData(scheme.id);
    const title = (translatedScheme?.title || scheme.title).toLowerCase();
    const description = (translatedScheme?.description || scheme.description).toLowerCase();

    let matchesSearch = true;
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      // 1. Exact Substring Match
      matchesSearch = title.includes(searchLower) || description.includes(searchLower);

      // 2. Tokenization & Keyword Extraction (NLP feature)
      if (!matchesSearch) {
        // Remove punctuation and tokenize
        const tokens = searchLower.replace(/[.,!?]/g, '').split(/\s+/);
        // Extract keywords by removing noise words
        const stopWords = ['i', 'am', 'a', 'an', 'the', 'want', 'need', 'give', 'me', 'some', 'is', 'for', 'to', 'of', 'can', 'you', 'show'];
        const keywords = tokens.filter(word => !stopWords.includes(word) && word.length > 2);
        
        if (keywords.length > 0) {
          // If any extracted keyword matches title, description, or common aliases
          matchesSearch = keywords.some(keyword => 
            title.includes(keyword) || 
            description.includes(keyword) ||
            (keyword === 'farmer' && (title.includes('kisan') || title.includes('agriculture'))) ||
            (keyword === 'student' && title.includes('scholarship')) ||
            (keyword === 'pregnant' && title.includes('maternity'))
          );
        }
      }
    }

    const matchesCategory = selectedCategory === "all" ||
      scheme.categoryKey === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get active category name for display
  const getActiveCategoryName = () => {
    if (selectedCategory === "all") return t("categories.all");
    const categoryKey = categoryKeyMap[selectedCategory];
    return categoryKey ? t(categoryKey) : selectedCategory;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t("schemes.title")}
            </h1>
            <p className="text-muted-foreground">
              {selectedCategory !== "all"
                ? `${t("schemes.showingIn")} ${getActiveCategoryName()}`
                : t("schemes.subtitle")}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder={t("schemes.searchPlaceholder")}
                className="pl-10 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={startListening}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? "text-red-500 animate-pulse bg-red-100 dark:bg-red-900/30" : "text-muted-foreground hover:bg-muted"
                  }`}
                title="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("categories.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("categories.all")}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.key} value={cat.key}>
                      {t(categoryKeyMap[cat.key] || cat.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            {t("schemes.showing")} {filteredSchemes.length} {t("schemes.of")} {schemesData.length} {t("nav.schemes").toLowerCase()}
          </p>

          {/* Schemes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => {
              const translatedScheme = getSchemeData(scheme.id);
              return (
                <div
                  key={scheme.id}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={scheme.categoryColor}>
                      {translatedScheme?.category || scheme.category}
                    </Badge>
                    <Badge className="bg-agriculture text-white">{t(`common.${scheme.status.toLowerCase()}`)}</Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {translatedScheme?.title || scheme.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {translatedScheme?.description || scheme.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Users className="w-4 h-4" />
                    <span>{translatedScheme?.beneficiaries || scheme.beneficiaries} {t("schemes.beneficiaries")}</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-1">{t("schemes.eligibility")}:</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {(translatedScheme?.eligibility || scheme.eligibility)[0]}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-lg font-bold text-foreground">{translatedScheme?.amount || scheme.amount}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {scheme.deadline === "Open" ? t("schemes.ongoing") : scheme.deadline}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/schemes/${scheme.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          {t("schemes.viewDetails")}
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => window.open(scheme.officialApplyURL, "_blank")}
                        title={`Apply on ${scheme.officialPortalName}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSchemes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("schemes.noResults")}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  handleCategoryChange("all");
                }}
              >
                {t("schemes.clearFilters")}
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schemes;