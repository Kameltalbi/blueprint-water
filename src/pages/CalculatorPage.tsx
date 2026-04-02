import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { CalculatorSection } from "@/components/landing/CalculatorSection";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { PageMeta } from "@/components/PageMeta";

export default function CalculatorPage() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta title="Calculateur d'Empreinte Eau — HydroScan" description="Calculez gratuitement votre empreinte eau verte, bleue et grise en 4 étapes. Conforme ISO 14046." />

      <LandingHeader activePage="calculateur" />

      <div className="pt-20">
        <CalculatorSection />
      </div>

      {/* CTA */}
      <section className="gradient-water py-16 px-[5%] text-center text-primary-foreground">
        <h2 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold mb-3">
          {t3("Besoin d'aller plus loin ?", "Need to go further?", "هل تحتاج إلى المزيد؟")}
        </h2>
        <p className="opacity-85 max-w-[420px] mx-auto mb-8 text-sm">
          {t3("Accédez au tableau de bord complet pour suivre votre empreinte eau en continu.", "Access the full dashboard to continuously monitor your water footprint.", "ادخل إلى لوحة التحكم الكاملة لمتابعة بصمتك المائية باستمرار.")}
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-8 py-3.5 text-white rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
          style={{ backgroundColor: '#015486' }}
        >
          {t3("Accéder au tableau de bord →", "Go to dashboard →", "انتقل إلى لوحة التحكم ←")}
        </Link>
      </section>

      <LandingFooter />
    </div>
  );
}
