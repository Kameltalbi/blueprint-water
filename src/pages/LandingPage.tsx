import { ArrowRight, Calculator } from "lucide-react";
import hydroscanIcon from "@/assets/hydroscan-icon.png";
import hydroscanLogo from "@/assets/logo_hydroscan.png";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";
import { LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";
import { HeroSection } from "@/components/landing/HeroSection";
import { SectorsSection } from "@/components/landing/SectorsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";

import { WhySection } from "@/components/landing/WhySection";

export default function LandingPage() {
  const { t, lang } = useI18n();
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title="HydroScan — Calculez votre Empreinte Eau"
        description="Plateforme universelle de calcul d'empreinte eau pour l'agriculture, l'industrie et l'agroalimentaire. Conforme ISO 14046."
      />
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-4 bg-card/95 backdrop-blur-xl border-b border-border">
        <a href="#" className="flex items-center gap-2 no-underline">
          <img src={hydroscanLogo} alt="HydroScan" className="h-12 object-contain" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#secteurs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{fr ? "Secteurs" : "Sectors"}</a>
          <Link to="/calculateur" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{fr ? "Calculateur" : "Calculator"}</Link>
          <Link to="/fonctionnalites" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{fr ? "Fonctionnalités" : "Features"}</Link>
          <Link to="/tarifs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{fr ? "Tarifs" : "Pricing"}</Link>
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

      {/* ── Sections ── */}
      <HeroSection />
      <SectorsSection />

      {/* ── Calculator CTA (replaces inline calculator) ── */}
      <section id="calculateur" className="py-24 px-[5%] bg-background">
        <div className="mx-auto max-w-[800px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 text-green-water text-xs font-bold px-4 py-1 mb-5">
            <span>✦</span> {fr ? "100 % Gratuit · Sans inscription" : "100% Free · No signup"}
          </div>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-foreground leading-tight mb-4">
            {fr ? "Calculez votre Empreinte Eau" : "Calculate your Water Footprint"}
          </h2>
          <p className="text-muted-foreground text-sm max-w-[520px] mx-auto mb-8">
            {fr
              ? "Analyse complète Eau Verte / Bleue / Grise en 4 étapes. Résultats instantanés, conformes à ISO 14046 et Water Footprint Network."
              : "Complete Green / Blue / Grey Water analysis in 4 steps. Instant results, ISO 14046 and Water Footprint Network compliant."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/calculateur"
              className="inline-flex items-center gap-2 px-8 py-3.5 gradient-water text-primary-foreground rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <Calculator className="h-4 w-4" />
              {fr ? "Lancer le calculateur →" : "Launch calculator →"}
            </Link>
            <a
              href="#fonctionnalites"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-[10px] font-semibold text-sm hover:opacity-90 transition-all"
              style={{ backgroundColor: '#015486' }}
            >
              {fr ? "En savoir plus" : "Learn more"}
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-[480px] mx-auto">
            <div>
              <p className="font-display text-2xl font-extrabold text-primary">4</p>
              <p className="text-xs text-muted-foreground">{fr ? "Étapes simples" : "Simple steps"}</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-primary">500+</p>
              <p className="text-xs text-muted-foreground">{fr ? "Coefficients WFN" : "WFN Coefficients"}</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-primary">ISO</p>
              <p className="text-xs text-muted-foreground">14046</p>
            </div>
          </div>
        </div>
      </section>

      <WhySection />
      <FeaturesSection />

      {/* ── CTA Final ── */}
      <section className="gradient-water py-24 px-[5%] text-center text-primary-foreground">
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold mb-4">
          {fr ? "Prêt à connaître votre" : "Ready to know your"}
          <br />
          {fr ? "impact sur l'eau ?" : "water impact?"}
        </h2>
        <p className="opacity-85 max-w-[480px] mx-auto mb-10 text-sm">
          {fr
            ? "Rejoignez 2 847 entreprises qui pilotent déjà leur empreinte eau avec HydroScan."
            : "Join 2,847 companies already managing their water footprint with HydroScan."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/calculateur" className="inline-block px-8 py-3.5 text-white rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all" style={{ backgroundColor: '#015486' }}>
            💧 {fr ? "Calculer gratuitement" : "Calculate for free"}
          </Link>
          <Link to="/tarifs" className="inline-block px-8 py-3.5 border-2 border-primary-foreground/50 text-primary-foreground rounded-[10px] font-semibold text-sm hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all">
            {fr ? "Voir les plans Pro" : "See Pro plans"}
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-foreground text-primary-foreground/50 py-12 px-[5%] flex justify-between items-center flex-wrap gap-6 text-xs">
        <a href="#" className="flex items-center gap-2 no-underline">
          <img src={hydroscanLogo} alt="HydroScan" className="h-8 object-contain brightness-0 invert" />
        </a>
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
