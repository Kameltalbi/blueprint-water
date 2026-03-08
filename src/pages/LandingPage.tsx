import { Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";
import { HeroSection } from "@/components/landing/HeroSection";
import { SectorsSection } from "@/components/landing/SectorsSection";
import { CalculatorSection } from "@/components/landing/CalculatorSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { WhySection } from "@/components/landing/WhySection";

export default function LandingPage() {
  const { t, lang } = useI18n();
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-card font-sans">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-4 bg-card/95 backdrop-blur-xl border-b border-border">
        <a href="#" className="flex items-center gap-2 font-display text-xl font-extrabold text-foreground no-underline">
          <div className="w-9 h-9 rounded-[10px] gradient-water flex items-center justify-center text-primary-foreground text-base">
            💧
          </div>
          Hydro<em className="not-italic text-primary">Scan</em>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#secteurs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{fr ? "Secteurs" : "Sectors"}</a>
          <a href="#calculateur" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{fr ? "Calculateur" : "Calculator"}</a>
          <a href="#fonctionnalites" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{fr ? "Fonctionnalités" : "Features"}</a>
          <a href="#tarifs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{fr ? "Tarifs" : "Pricing"}</a>
        </div>

        <div className="flex items-center gap-2">
          <LangToggle />
          <Link to="/dashboard" className="hidden sm:inline-flex items-center px-5 py-2 rounded-lg gradient-water text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all">
            {fr ? "Calculer gratuitement →" : "Calculate for free →"}
          </Link>
        </div>
      </nav>

      {/* ── Sections ── */}
      <HeroSection />
      <SectorsSection />
      <CalculatorSection />
      <WhySection />
      <FeaturesSection />
      <PricingSection />

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
          <a href="#calculateur" className="inline-block px-8 py-3.5 bg-card text-primary rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all">
            💧 {fr ? "Calculer gratuitement" : "Calculate for free"}
          </a>
          <a href="#tarifs" className="inline-block px-8 py-3.5 border-2 border-primary-foreground/50 text-primary-foreground rounded-[10px] font-semibold text-sm hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all">
            {fr ? "Voir les plans Pro" : "See Pro plans"}
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-foreground text-primary-foreground/50 py-12 px-[5%] flex justify-between items-center flex-wrap gap-6 text-xs">
        <a href="#" className="flex items-center gap-2 font-display text-base font-bold text-primary-foreground no-underline">
          <div className="w-7 h-7 rounded-lg gradient-water flex items-center justify-center text-sm">💧</div>
          HydroScan
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
