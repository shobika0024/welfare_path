import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import SearchBar from "./SearchBar";

const Hero = () => {
  const { t } = useTranslation();

  const stats = [
    { value: "500+", label: t("hero.stats.schemesAvailable") },
    { value: "10 Cr+", label: t("hero.stats.citizensBenefited") },
    { value: "28", label: t("hero.stats.statesCovered") },
    { value: "50+", label: t("hero.stats.categoriesCount") },
  ];

  return (
    <section className="relative bg-[hsl(var(--hero-bg))] py-16 md:py-24" style={{background: 'linear-gradient(135deg, hsl(215 70% 18%) 0%, hsl(215 60% 25%) 100%)'}}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t("hero.title")}
            <br />
            <span className="text-accent">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="text-white/90 text-lg mb-8">
            {t("hero.subtitle")}
          </p>

          {/* Search Bar with NLP Voice Integration */}
          <div className="max-w-2xl mx-auto mb-12 text-left">
            <SearchBar className="h-12 w-full text-lg shadow-lg [&_input]:h-12" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;