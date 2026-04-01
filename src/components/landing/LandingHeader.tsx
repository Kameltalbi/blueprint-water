import { useState } from "react";
import { Link } from "react-router-dom";
import { LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";
import hydroscanLogo from "@/assets/logo_hydroscan.png";
import { Menu, X } from "lucide-react";

interface LandingHeaderProps {
  activePage?: "home" | "calculateur" | "fonctionnalites" | "tarifs" | "apropos" | "ressources" | "contact";
}

export function LandingHeader({ activePage = "home" }: LandingHeaderProps) {
  const { lang } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  const navLinks = [
    { to: "/a-propos", label: t3("À propos", "About", "حولنا"), key: "apropos" as const },
    { to: "/fonctionnalites", label: t3("Fonctionnalités", "Features", "الميزات"), key: "fonctionnalites" as const },
    { to: "/tarifs", label: t3("Tarifs", "Pricing", "الأسعار"), key: "tarifs" as const },
    { to: "/ressources", label: t3("Ressources", "Resources", "الموارد"), key: "ressources" as const },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-4 bg-card/95 backdrop-blur-xl border-b border-border">
        <Link to="/" className="flex items-center gap-2 no-underline" onClick={() => setMobileOpen(false)}>
          <img src={hydroscanLogo} alt="HydroScan" className="h-12 object-contain" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                activePage === link.key ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LangToggle />
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center px-5 py-2 rounded-lg gradient-water text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all"
          >
            {t3("Connexion", "Login", "دخول")}
          </Link>
          <Link
            to="/register"
            className="hidden sm:inline-flex items-center px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-all"
            style={{ backgroundColor: "#015486" }}
          >
            {t3("Inscription", "Sign up", "تسجيل")}
          </Link>
          {/* Hamburger — mobile only */}
          <button
            className="flex md:hidden items-center justify-center h-9 w-9 rounded-lg border border-border hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          {/* Panel */}
          <div className="absolute top-[73px] left-0 right-0 bg-card border-b border-border shadow-xl">
            <div className="flex flex-col px-[5%] py-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activePage === link.key
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg gradient-water text-primary-foreground text-sm font-semibold"
                >
                  {t3("Connexion", "Login", "دخول")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg text-white text-sm font-semibold"
                  style={{ backgroundColor: "#015486" }}
                >
                  {t3("Inscription", "Sign up", "تسجيل")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
