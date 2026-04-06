import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import SearchBar from "@/components/SearchBar";
import LanguageToggle from "@/components/LanguageToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.schemes"), path: "/schemes" },
    { name: t("nav.categories"), path: "/categories" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: t("nav.signedOut"),
      description: t("nav.signedOutDesc"),
    });
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-[100] bg-primary text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <div className="flex flex-col max-w-[120px]">
              <span className="text-lg font-bold text-white leading-tight">WelfarePath</span>
              <span className="text-xs text-accent leading-tight truncate">{t("nav.governmentPortal")}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-colors hover:text-accent whitespace-nowrap ${location.pathname === link.path ? "text-white" : "text-white/80"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <LanguageToggle />

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 text-white hover:text-accent hover:bg-white/10 px-3"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xl:inline text-base truncate max-w-[140px]">{t("nav.search")}</span>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 border-white/30 text-white hover:bg-white/10">
                    <User className="w-4 h-4" />
                    <span className="max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-muted-foreground text-xs">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-accent hover:bg-accent/90 text-white">
                <Link to="/login">{t("nav.login")}</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>
            <button
              className="p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar (expandable) */}
        {searchOpen && (
          <div className="mt-4 pb-2">
            <SearchBar onClose={() => setSearchOpen(false)} autoFocus />
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium ${location.pathname === link.path ? "text-accent" : "text-white/80"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                <LanguageToggle />
                {user ? (
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="border-white/30 text-white hover:bg-white/10">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("nav.logout")}
                  </Button>
                ) : (
                  <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-white">
                    <Link to="/login">{t("nav.login")}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
