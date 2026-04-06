import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("contact.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("contact.subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2 bg-card rounded-lg border border-border p-8">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t("contact.form.title")}
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                {t("contact.form.subtitle")}
              </p>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("contact.form.firstName")}</Label>
                    <Input id="firstName" placeholder={t("contact.form.firstName")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("contact.form.lastName")}</Label>
                    <Input id="lastName" placeholder={t("contact.form.lastName")} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.form.email")}</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("contact.form.phone")}</Label>
                    <Input id="phone" placeholder="+91 9876543210" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">{t("contact.form.category")}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("contact.form.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">{t("contact.form.general")}</SelectItem>
                      <SelectItem value="schemes">{t("contact.form.schemeRelated")}</SelectItem>
                      <SelectItem value="application">{t("contact.form.applicationHelp")}</SelectItem>
                      <SelectItem value="technical">{t("contact.form.technical")}</SelectItem>
                      <SelectItem value="feedback">{t("contact.form.feedback")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{t("contact.form.subject")}</Label>
                  <Input id="subject" placeholder={t("contact.form.subjectPlaceholder")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t("contact.form.message")}</Label>
                  <Textarea
                    id="message"
                    placeholder={t("contact.form.messagePlaceholder")}
                    className="min-h-[120px]"
                  />
                </div>

                <Button type="submit" className="w-full">
                  {t("contact.form.send")}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-agriculture/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-agriculture" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t("contact.info.helpline")}</h3>
                  </div>
                </div>
                <p className="text-primary font-medium">1800-123-4567</p>
                <p className="text-muted-foreground text-sm">{t("contact.info.tollFree")}</p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-education/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-education" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t("contact.info.emailSupport")}</h3>
                  </div>
                </div>
                <p className="text-primary font-medium">help@welfarepath.gov.in</p>
                <p className="text-muted-foreground text-sm">{t("contact.info.responseTime")}</p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-healthcare/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-healthcare" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t("contact.info.headOffice")}</h3>
                  </div>
                </div>
                <p className="text-primary font-medium">{t("contact.info.government")}</p>
                <p className="text-muted-foreground text-sm">{t("contact.info.newDelhi")}</p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-housing/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-housing" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t("contact.info.officeHours")}</h3>
                  </div>
                </div>
                <p className="text-primary font-medium">{t("contact.info.monFri")}</p>
                <p className="text-muted-foreground text-sm">{t("contact.info.sat")}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;