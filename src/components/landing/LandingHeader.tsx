import { Link } from "react-router-dom";
import { LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";
import hydroscanLogo from "@/assets/logo_hydroscan.png";

interface LandingHeaderProps {
  activePage?: "home" | "calculateur" | "fonctionnalites" | "tarifs";
}

export function LandingHeader({ activePage = "home" }: LandingHeaderProps) {
  const { lang } = useI18n();
  const fr = lang === "fr";

  const navLinks = [
    { to: "/fonctionnalites", labelFr: "Fonctionnalités", labelEn: "Features", key: "fonctionnalites" as const },
    { to: "/tarifs", labelFr: "Tarifs", labelEn: "Pricing", key: "tarifs" as const },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-4 bg-card/95 backdrop-blur-xl border-b border-border">
      <Link to="/" className="flex items-center gap-2 no-underline">
        <img src={hydroscanLogo} alt="HydroScan" className="h-12 object-contain" />
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.key}
            to={link.to}
            className={`text-sm font-medium transition-colors ${
              activePage === link.key
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {fr ? link.labelFr : link.labelEn}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <LangToggle />
        <Link
          to="/login"
          className="inline-flex items-center px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg gradient-water text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-90 transition-all"
        >
          {fr ? "Connexion" : "Login"}
        </Link>
        <Link
          to="/register"
          className="inline-flex items-center px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-all"
          style={{ backgroundColor: "#015486" }}
        >
          {fr ? "Inscription" : "Sign up"}
        </Link>
      </div>
    </nav>
  );
}
