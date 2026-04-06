import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplyConfirmModal from "@/components/ApplyConfirmModal";
import VoiceNarrationButton from "@/components/VoiceNarrationButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  IndianRupee,
  Users,
  Clock,
  FileText,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { schemesData } from "@/data/schemes";
import { useTranslation } from "react-i18next";
import { schemeTranslations } from "@/i18n/translations";

const SchemeDetail = () => {
  const { id } = useParams();
  const scheme = schemesData.find((s) => s.id === id);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [MapComponent, setMapComponent] = useState<React.ComponentType | null>(null);
  const { t, i18n } = useTranslation();

  // Dynamically import map component on client side only
  useEffect(() => {
    import("@/components/ServiceCentresMap").then((module) => {
      setMapComponent(() => module.default);
    });
  }, []);

  const getSchemeData = (schemeId: string) => {
    const lang = i18n.language as "en" | "ta";
    return schemeTranslations[lang]?.[schemeId] || schemeTranslations.en[schemeId];
  };

  if (!scheme) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground">{t("schemes.schemeNotFound")}</h1>
            <Link to="/schemes">
              <Button className="mt-4">{t("schemes.backToSchemes")}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const translatedScheme = getSchemeData(scheme.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link
            to="/schemes"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("schemes.back")}
          </Link>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <Badge className={scheme.categoryColor}>
              {translatedScheme?.category || scheme.category}
            </Badge>
            <Badge className="bg-foreground text-background">
              {t(`common.${scheme.status.toLowerCase()}`)}
            </Badge>
          </div>

          {/* Title & Description */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {translatedScheme?.title || scheme.title}
            </h1>
            <VoiceNarrationButton
              schemeName={translatedScheme?.title || scheme.title}
              description={translatedScheme?.description || scheme.description}
              eligibility={translatedScheme?.eligibility || scheme.eligibility}
              documents={translatedScheme?.documents || scheme.documents}
              schemeId={scheme.id}
              autoPlay={true}
              variant="default"
              className="flex-shrink-0"
            />
          </div>
          <p className="text-muted-foreground mb-8">
            {translatedScheme?.description || scheme.description}
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <IndianRupee className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">{t("schemes.benefit")}</p>
              <p className="font-bold text-foreground">{translatedScheme?.amount || scheme.amount}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">{t("schemes.beneficiaries")}</p>
              <p className="font-bold text-foreground">{translatedScheme?.beneficiaries || scheme.beneficiaries}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">{t("schemes.deadline")}</p>
              <p className="font-bold text-foreground">
                {scheme.deadline === "Open" ? t("schemes.ongoing") : scheme.deadline}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">{t("schemes.documents")}</p>
              <p className="font-bold text-foreground">{scheme.documents.length}</p>
            </div>
          </div>

          {/* Eligibility & Documents */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t("schemes.eligibility")}:</h2>
              <ul className="space-y-3">
                {(translatedScheme?.eligibility || scheme.eligibility).map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-agriculture flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t("schemes.documents")}</h2>
              <ul className="space-y-3">
                {(translatedScheme?.documents || scheme.documents).map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* How to Apply */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">{t("schemes.howToApply")}</h2>
            <div className="space-y-4">
              {(translatedScheme?.howToApply || scheme.howToApply).map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-muted-foreground pt-1">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video Tutorial Section */}
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
            <div className="p-6 pb-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Video Explanation</h2>
                <p className="text-sm text-muted-foreground">Watch related tutorials and guides for {translatedScheme?.title || scheme.title}.</p>
              </div>
            </div>
            <div className="aspect-video bg-muted relative">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent((translatedScheme?.title || scheme.title) + " scheme details application process")}`}
                title="Welfare Path Application Tutorial" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>

          {/* Apply Now Button */}
          <Button
            className="w-full h-14 text-lg mb-12"
            size="lg"
            onClick={() => setShowApplyModal(true)}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            {t("schemes.apply")}
          </Button>

          {/* Nearby Service Centres Map */}
          <div className="border-t border-border pt-8">
            {MapComponent ? (
              <MapComponent />
            ) : (
              <div className="h-[400px] bg-muted rounded-xl flex items-center justify-center">
                <p className="text-muted-foreground">{t("schemes.loadingMap")}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Apply Confirmation Modal */}
      <ApplyConfirmModal
        open={showApplyModal}
        onOpenChange={setShowApplyModal}
        schemeName={translatedScheme?.title || scheme.title}
        portalName={scheme.officialPortalName}
        applyUrl={scheme.officialApplyURL}
      />
    </div>
  );
};

export default SchemeDetail;