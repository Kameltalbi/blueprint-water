import { Calculator } from "lucide-react";
import hydroscanLogo from "@/assets/logo_hydroscan.png";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { SectorsSection } from "@/components/landing/SectorsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WhySection } from "@/components/landing/WhySection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { ProductPreviewSection } from "@/components/landing/ProductPreviewSection";
import { EcosystemSection } from "@/components/landing/EcosystemSection";

export default function LandingPage() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  return (
    <div className="min-h-screen bg-card font-sans">
      <PageMeta
        title="HydroScan — Calculez votre Empreinte Eau"
        description="Plateforme universelle de calcul d'empreinte eau pour l'agriculture, l'industrie et l'agroalimentaire. Conforme ISO 14046."
      />

      <LandingHeader activePage="home" />

      {/* ── Sections ── */}
      <HeroSection />
      <SocialProofSection />
      <ProductPreviewSection />
      <SectorsSection />

      {/* ── Calculator CTA ── */}
      <section id="calculateur" className="py-24 px-[5%] bg-background">
        <div className="mx-auto max-w-[800px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 text-green-water text-xs font-bold px-4 py-1 mb-5">
            <span>✦</span> {t3("100 % Gratuit · Sans inscription", "100% Free · No signup", "100% مجاني · بدون تسجيل")}
          </div>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-foreground leading-tight mb-4">
            {t3("Calculez votre Empreinte Eau", "Calculate your Water Footprint", "احسب بصمتك المائية")}
          </h2>
          <p className="text-muted-foreground text-sm max-w-[520px] mx-auto mb-8">
            {t3(
              "Analyse complète Eau Verte / Bleue / Grise en 4 étapes. Résultats instantanés, conformes à ISO 14046 et Water Footprint Network.",
              "Complete Green / Blue / Grey Water analysis in 4 steps. Instant results, ISO 14046 and Water Footprint Network compliant.",
              "تحليل كامل للمياه الخضراء والزرقاء والرمادية في 4 خطوات. نتائج فورية متوافقة مع ISO 14046."
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/calculateur"
              className="inline-flex items-center gap-2 px-8 py-3.5 gradient-water text-primary-foreground rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              <Calculator className="h-4 w-4" />
              {t3("Lancer le calculateur →", "Launch calculator →", "تشغيل الآلة الحاسبة ←")}
            </Link>
            <Link
              to="/fonctionnalites"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-[10px] font-semibold text-sm hover:opacity-90 transition-all"
              style={{ backgroundColor: '#015486' }}
            >
              {t3("En savoir plus", "Learn more", "اعرف أكثر")}
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-[480px] mx-auto">
            <div>
              <p className="font-display text-2xl font-extrabold text-primary">4</p>
              <p className="text-xs text-muted-foreground">{t3("Étapes simples", "Simple steps", "خطوات بسيطة")}</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-primary">500+</p>
              <p className="text-xs text-muted-foreground">{t3("Coefficients WFN", "WFN Coefficients", "معاملات WFN")}</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-primary">ISO</p>
              <p className="text-xs text-muted-foreground">14046</p>
            </div>
          </div>
        </div>
      </section>

      <EcosystemSection />
      <WhySection />
      <FeaturesSection />

      {/* ── CTA Final ── */}
      <section className="gradient-water py-24 px-[5%] text-center text-primary-foreground">
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold mb-4">
          {t3("Prêt à connaître votre", "Ready to know your", "هل أنت مستعد لمعرفة")}
          <br />
          {t3("impact sur l'eau ?", "water impact?", "أثرك على المياه؟")}
        </h2>
        <p className="opacity-85 max-w-[480px] mx-auto mb-10 text-sm">
          {t3(
            "Commencez dès maintenant à piloter votre empreinte eau avec HydroScan.",
            "Start managing your water footprint with HydroScan today.",
            "ابدأ الآن في إدارة بصمتك المائية مع HydroScan."
          )}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/calculateur" className="inline-block px-8 py-3.5 text-white rounded-[10px] font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all" style={{ backgroundColor: '#015486' }}>
            💧 {t3("Calculer gratuitement", "Calculate for free", "احسب مجانًا")}
          </Link>
          <Link to="/tarifs" className="inline-block px-8 py-3.5 border-2 border-primary-foreground/50 text-primary-foreground rounded-[10px] font-semibold text-sm hover:border-primary-foreground hover:bg-primary-foreground/10 transition-all">
            {t3("Voir les plans Pro", "See Pro plans", "عرض الخطط الاحترافية")}
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
