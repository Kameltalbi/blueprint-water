import { Link } from "react-router-dom";
import { Droplets, ArrowLeft } from "lucide-react";
import { LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";
import { CalculatorSection } from "@/components/landing/CalculatorSection";
import { PageMeta } from "@/components/PageMeta";
import { CalculatorSection } from "@/components/landing/CalculatorSection";

export default function CalculatorPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-card font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-4 bg-card/95 backdrop-blur-xl border-b border-border">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-foreground no-underline">
          <div className="w-9 h-9 rounded-[10px] gradient-water flex items-center justify-center text-primary-foreground text-base">
            💧
          </div>
          Hydro<em className="not-italic text-primary">Scan</em>
        </Link>

        <div className="flex items-center gap-2">
          <LangToggle />
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            {fr ? "Retour à l'accueil" : "Back to home"}
          </Link>
        </div>
      </nav>

      {/* Calculator */}
      <div className="pt-20">
        <CalculatorSection />
      </div>

      {/* CTA */}
      <section className="gradient-water py-16 px-[5%] text-center text-primary-foreground">
        <h2 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold mb-3">
          {fr ? "Besoin d'aller plus loin ?" : "Need to go further?"}
        </h2>
        <p className="opacity-85 max-w-[420px] mx-auto mb-8 text-sm">
          {fr
            ? "Accédez au tableau de bord complet pour suivre votre empreinte eau en continu."
            : "Access the full dashboard to continuously monitor your water footprint."}
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-8 py-3.5 bg-card text-primary rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          {fr ? "Accéder au tableau de bord →" : "Go to dashboard →"}
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground/50 py-8 px-[5%] flex justify-between items-center flex-wrap gap-4 text-xs">
        <Link to="/" className="flex items-center gap-2 font-display text-base font-bold text-primary-foreground no-underline">
          <div className="w-7 h-7 rounded-lg gradient-water flex items-center justify-center text-sm">💧</div>
          HydroScan
        </Link>
        <span>© 2024 HydroScan · ISO 14046</span>
      </footer>
    </div>
  );
}
