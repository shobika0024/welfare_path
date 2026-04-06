import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-12 text-white" style={{ background: 'linear-gradient(135deg, hsl(215 70% 18%) 0%, hsl(215 60% 22%) 100%)' }}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">WelfarePath</span>
                <span className="text-xs text-white/70">{t("nav.governmentPortal")}</span>
              </div>
            </div>
            <p className="text-white/80 text-sm">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/schemes" className="text-white/80 hover:text-white text-sm transition-colors">
                  {t("footer.allSchemes")}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-white/80 hover:text-white text-sm transition-colors">
                  {t("nav.categories")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white text-sm transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white text-sm transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t("footer.support")}</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>{t("footer.helpline")}: 1800-123-4567</li>
              <li>{t("footer.email")}: help@welfarepath.gov.in</li>
              <li>{t("footer.timing")}</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 text-center text-sm text-white/70">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;