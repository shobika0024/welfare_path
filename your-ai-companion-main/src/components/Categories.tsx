import { Link } from "react-router-dom";
import { Sprout, GraduationCap, Heart, Baby, Home, Users, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface Category {
  icon: LucideIcon;
  nameKey: string;
  key: string;
  descriptionKey: string;
  schemeCount: number;
  iconClass: string;
  bgClass: string;
  popularSchemes: string[];
}

const categoriesData: Category[] = [
  {
    icon: Sprout,
    nameKey: "categories.agriculture",
    key: "agriculture",
    descriptionKey: "categories.descriptions.agriculture",
    schemeCount: 45,
    iconClass: "icon-agriculture",
    bgClass: "bg-icon-agriculture",
    popularSchemes: ["PM Kisan", "Crop Insurance"],
  },
  {
    icon: GraduationCap,
    nameKey: "categories.education",
    key: "education",
    descriptionKey: "categories.descriptions.education",
    schemeCount: 32,
    iconClass: "icon-education",
    bgClass: "bg-icon-education",
    popularSchemes: ["National Scholarship", "PM Vidya Lakshmi"],
  },
  {
    icon: Heart,
    nameKey: "categories.healthcare",
    key: "healthcare",
    descriptionKey: "categories.descriptions.healthcare",
    schemeCount: 28,
    iconClass: "icon-healthcare",
    bgClass: "bg-icon-healthcare",
    popularSchemes: ["Ayushman Bharat", "PMJAY"],
  },
  {
    icon: Baby,
    nameKey: "categories.women",
    key: "women",
    descriptionKey: "categories.descriptions.women",
    schemeCount: 24,
    iconClass: "icon-women",
    bgClass: "bg-icon-women",
    popularSchemes: ["PM Matru Vandana", "Beti Bachao"],
  },
  {
    icon: Users,
    nameKey: "categories.senior",
    key: "senior",
    descriptionKey: "categories.descriptions.senior",
    schemeCount: 18,
    iconClass: "icon-senior",
    bgClass: "bg-icon-senior",
    popularSchemes: ["Old Age Pension", "Senior Care"],
  },
  {
    icon: Home,
    nameKey: "categories.housing",
    key: "housing",
    descriptionKey: "categories.descriptions.housing",
    schemeCount: 22,
    iconClass: "icon-housing",
    bgClass: "bg-icon-housing",
    popularSchemes: ["PM Awas Yojana", "Housing Subsidy"],
  },
];

const Categories = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("categories.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("categories.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.key}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${category.bgClass} flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${category.iconClass}`} />
                  </div>
                  <Badge variant="secondary" className="bg-agriculture text-primary-foreground">
                    {category.schemeCount} {t("categories.schemes")}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(category.nameKey)}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t(category.descriptionKey)}
                </p>

                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">{t("categories.popularSchemes")}:</p>
                  <div className="flex flex-wrap gap-2">
                    {category.popularSchemes.map((scheme, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {scheme}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-xs">
                      +2 {t("categories.more")}
                    </Badge>
                  </div>
                </div>

                <Link to={`/schemes?category=${category.key}`}>
                  <Button className="w-full">
                    {t("categories.viewSchemes")}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;