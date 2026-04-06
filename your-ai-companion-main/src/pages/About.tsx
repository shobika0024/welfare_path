import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Eye, Users, TrendingUp, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.title")}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t("about.subtitle")}
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-card rounded-lg border border-border p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">{t("about.mission.title")}</h2>
              </div>
              <p className="text-muted-foreground">
                {t("about.mission.description")}
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">{t("about.vision.title")}</h2>
              </div>
              <p className="text-muted-foreground">
                {t("about.vision.description")}
              </p>
            </div>
          </div>

          {/* Impact Section */}
          <div className="bg-primary rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground text-center mb-8">
              {t("about.impact.title")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground">500+</div>
                <div className="text-primary-foreground/80 text-sm">{t("about.impact.schemesListed")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground">10 Cr+</div>
                <div className="text-primary-foreground/80 text-sm">{t("about.impact.citizensHelped")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground">28</div>
                <div className="text-primary-foreground/80 text-sm">{t("about.impact.statesCovered")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground">₹50K Cr</div>
                <div className="text-primary-foreground/80 text-sm">{t("about.impact.benefitsDisbursed")}</div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              {t("about.values.title")}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t("about.values.citizenFirst.title")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("about.values.citizenFirst.description")}
                </p>
              </div>
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t("about.values.transparency.title")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("about.values.transparency.description")}
                </p>
              </div>
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t("about.values.accessibility.title")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("about.values.accessibility.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;