import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { PricingSection } from "@/components/landing/PricingSection";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function PricingPage() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title={t3("Tarifs — HydroScan", "Pricing — HydroScan", "الأسعار — HydroScan")}
        description={t3("Découvrez nos plans tarifaires : Calculateur gratuit, Pro et Entreprise.", "Discover our pricing plans: Free Calculator, Pro and Enterprise.", "اكتشف خططنا: الحاسبة المجانية، Pro والمؤسسة.")}
      />

      <LandingHeader activePage="tarifs" />

      <div className="pt-20">
        <PricingSection />
      </div>

      <LandingFooter />
    </div>
  );
}
