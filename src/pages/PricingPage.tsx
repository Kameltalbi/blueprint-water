import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { PricingSection } from "@/components/landing/PricingSection";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function PricingPage() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title={fr ? "Tarifs — HydroScan" : "Pricing — HydroScan"}
        description={fr ? "Découvrez nos plans tarifaires : Calculateur gratuit, Pro et Entreprise." : "Discover our pricing plans: Free Calculator, Pro and Enterprise."}
      />

      <LandingHeader activePage="tarifs" />

      <div className="pt-20">
        <PricingSection />
      </div>

      <LandingFooter />
    </div>
  );
}
