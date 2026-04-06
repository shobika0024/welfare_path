import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, signIn, signUp } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = t("login.error.emailRequired");
    } else {
      try {
        emailSchema.parse(email);
      } catch {
        newErrors.email = t("login.error.invalidEmail");
      }
    }

    if (!password) {
      newErrors.password = t("login.error.passwordRequired");
    } else {
      try {
        passwordSchema.parse(password);
      } catch {
        newErrors.password = t("login.error.passwordLength");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        
        if (error) {
          if (error.message.includes("User already registered")) {
            toast({
              variant: "destructive",
              title: "Error",
              description: t("login.error.userExists"),
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message,
            });
          }
          return;
        }

        toast({
          title: t("login.signUpSuccess"),
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{t("login.welcomeBack")}</span>
            </div>
          ),
        });
        navigate("/");
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              variant: "destructive",
              title: "Error",
              description: t("login.error.invalidCredentials"),
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Please confirm your email address.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message,
            });
          }
          return;
        }

        toast({
          title: t("login.success"),
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{t("login.welcomeBack")}</span>
            </div>
          ),
        });
        navigate("/");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t("login.error.networkError"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-2xl">W</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {t("login.title")}
                </h1>
                <p className="text-muted-foreground">
                  {t("login.subtitle")}
                </p>
              </div>

              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email">{t("login.email")}</TabsTrigger>
                  <TabsTrigger value="aadhaar">{t("login.aadhaar")}</TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("login.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("login.emailPlaceholder")}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        className={errors.email ? "border-destructive" : ""}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">{t("login.password")}</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder={t("login.passwordPlaceholder")}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        className={errors.password ? "border-destructive" : ""}
                        disabled={isLoading}
                      />
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isSignUp ? t("login.signingUp") : t("login.signingIn")}
                        </>
                      ) : (
                        isSignUp ? t("login.signUp") : t("login.signIn")
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-muted-foreground text-sm">
                      {isSignUp ? t("login.hasAccount") : t("login.noAccount")}{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setErrors({});
                        }}
                        className="text-primary hover:underline font-medium"
                      >
                        {isSignUp ? t("login.loginHere") : t("login.registerHere")}
                      </button>
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="aadhaar">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">{t("login.aadhaarNumber")}</Label>
                      <Input
                        id="aadhaar"
                        placeholder={t("login.aadhaarPlaceholder")}
                        maxLength={12}
                        pattern="[0-9]*"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {t("login.sendOtp")}
                    </Button>
                  </form>
                  <p className="mt-4 text-sm text-muted-foreground text-center">
                    Aadhaar authentication coming soon
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
