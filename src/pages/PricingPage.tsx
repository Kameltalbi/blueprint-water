import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";
import { LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";
import { PricingSection } from "@/components/landing/PricingSection";
import hydroscanLogo from "@/assets/logo_hydroscan.png";

export default function PricingPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title={fr ? "Tarifs — HydroScan" : "Pricing — HydroScan"}
        description={fr ? "Découvrez nos plans tarifaires : Calculateur gratuit, Pro et Entreprise." : "Discover our pricing plans: Free Calculator, Pro and Enterprise."}
      />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-4 bg-card/95 backdrop-blur-xl border-b border-border">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src={hydroscanLogo} alt="HydroScan" className="h-12 object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{fr ? "Accueil" : "Home"}</Link>
          <Link to="/calculateur" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{fr ? "Calculateur" : "Calculator"}</Link>
          <Link to="/fonctionnalites" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{fr ? "Fonctionnalités" : "Features"}</Link>
          <Link to="/tarifs" className="text-sm font-medium text-primary transition-colors">{fr ? "Tarifs" : "Pricing"}</Link>
        </div>

        <div className="flex items-center gap-2">
          <LangToggle />
          <Link to="/login" className="inline-flex items-center px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg gradient-water text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-90 transition-all">
            {fr ? "Connexion" : "Login"}
          </Link>
          <Link to="/register" className="inline-flex items-center px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: '#015486' }}>
            {fr ? "Inscription" : "Sign up"}
          </Link>
        </div>
      </nav>

      <div className="pt-20">
        <PricingSection />
      </div>

      {/* ── Footer ── */}
      <footer className="bg-foreground text-primary-foreground/50 py-12 px-[5%] flex justify-between items-center flex-wrap gap-6 text-xs">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src={hydroscanLogo} alt="HydroScan" className="h-8 object-contain brightness-0 invert" />
        </Link>
        <div className="flex gap-6 flex-wrap">
          <a href="#" className="hover:text-primary-foreground transition-colors">{fr ? "Mentions légales" : "Legal"}</a>
          <a href="#" className="hover:text-primary-foreground transition-colors">{fr ? "Confidentialité" : "Privacy"}</a>
          <a href="#" className="hover:text-primary-foreground transition-colors">CGU</a>
          <a href="#" className="hover:text-primary-foreground transition-colors">Contact</a>
          <a href="#" className="hover:text-primary-foreground transition-colors">Blog</a>
          <a href="#" className="hover:text-primary-foreground transition-colors">API Docs</a>
        </div>
        <span>© 2024 HydroScan · ISO 14046</span>
      </footer>
    </div>
  );
}
