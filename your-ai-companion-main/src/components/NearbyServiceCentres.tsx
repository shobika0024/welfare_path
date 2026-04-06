import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import ServiceCentresMap from "./ServiceCentresMap";

const NearbyServiceCentres = () => {
  const { t } = useTranslation();
  const [MapComponent, setMapComponent] = useState<React.ComponentType | null>(null);

  // Dynamically import map component on client side only to avoid SSR issues with Leaflet
  useEffect(() => {
    // We already have ServiceCentresMap as a default export, but we can also use dynamic import if needed
    // However, in this project structure, it seems standard to use dynamic import for Map tools
    import("./ServiceCentresMap").then((module) => {
      setMapComponent(() => module.default);
    });
  }, []);

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <MapPin className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            {t("serviceCentres.title")}
          </h2>
        </div>

        <div className="bg-card rounded-2xl border border-border p-1 overflow-hidden">
          {MapComponent ? (
            <MapComponent />
          ) : (
            <div className="h-[500px] bg-muted animate-pulse rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-20" />
                <p className="text-muted-foreground">{t("schemes.loadingMap")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NearbyServiceCentres;