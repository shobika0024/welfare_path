import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Clock, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApplyConfirmModal from "@/components/ApplyConfirmModal";
import { schemesData } from "@/data/schemes";
import { useTranslation } from "react-i18next";
import { schemeTranslations } from "@/i18n/translations";

// Featured schemes are first 4 from the data
const featuredSchemes = schemesData.slice(0, 4);

const FeaturedSchemes = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<typeof featuredSchemes[0] | null>(null);
  const { t, i18n } = useTranslation();

  const handleApplyClick = (scheme: typeof featuredSchemes[0]) => {
    setSelectedScheme(scheme);
    setShowApplyModal(true);
  };

  const getSchemeData = (schemeId: string) => {
    const lang = i18n.language as "en" | "ta";
    return schemeTranslations[lang]?.[schemeId] || schemeTranslations.en[schemeId];
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("featured.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("featured.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {featuredSchemes.map((scheme) => {
            const translatedScheme = getSchemeData(scheme.id);
            return (
              <div
                key={scheme.id}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge className={scheme.categoryColor}>{translatedScheme?.category || scheme.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {translatedScheme?.beneficiaries || scheme.beneficiaries} {t("schemes.beneficiaries")}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {translatedScheme?.title || scheme.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {translatedScheme?.description || scheme.description}
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold text-foreground mb-2">{t("schemes.eligibility")}:</h4>
                  <ul className="space-y-1">
                    {(translatedScheme?.eligibility || scheme.eligibility).slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{translatedScheme?.amount || scheme.amount}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {scheme.deadline === "Open" ? t("schemes.ongoing") : scheme.deadline}
                    </div>
                  </div>
                  <Button onClick={() => handleApplyClick(scheme)}>
                    {t("schemes.apply")}
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link to="/schemes">
            <Button variant="outline" size="lg">
              {t("featured.viewAll")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Apply Confirmation Modal */}
      {selectedScheme && (
        <ApplyConfirmModal
          open={showApplyModal}
          onOpenChange={setShowApplyModal}
          schemeName={getSchemeData(selectedScheme.id)?.title || selectedScheme.title}
          portalName={selectedScheme.officialPortalName}
          applyUrl={selectedScheme.officialApplyURL}
        />
      )}
    </section>
  );
};

export default FeaturedSchemes;