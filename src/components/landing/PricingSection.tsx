import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function PricingSection() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  const plans = [
    {
      name: t3("Calculateur", "Calculator", "آلة حاسبة"),
      price: "0 DT",
      period: "",
      desc: t3("Accès immédiat, sans inscription. Calculez votre empreinte en 5 minutes.", "Instant access, no signup. Calculate your footprint in 5 minutes.", "وصول فوري بدون تسجيل. احسب بصمتك في 5 دقائق."),
      popular: false,
      cta: t3("Calculer maintenant →", "Calculate now →", "احسب الآن ←"),
      ctaStyle: "outline" as const,
      features: [
        { text: t3("Calculateur complet EV + EB + EG", "Full calculator GW + BW + GW", "حاسبة كاملة EV + EB + EG"), included: true },
        { text: t3("12 secteurs d'activité", "12 industry sectors", "12 قطاعًا"), included: true },
        { text: t3("500+ matières en base de données", "500+ materials in database", "+500 مادة في قاعدة البيانات"), included: true },
        { text: t3("Résultats & score instantanés", "Instant results & score", "نتائج وتقييم فوري"), included: true },
        { text: t3("Recommandations basiques", "Basic recommendations", "توصيات أساسية"), included: true },
        { text: t3("Rapports PDF / Word certifiés", "Certified PDF / Word reports", "تقارير PDF معتمدة"), included: false },
        { text: t3("Benchmarks sectoriels détaillés", "Detailed sector benchmarks", "معايير قطاعية مفصلة"), included: false },
        { text: t3("Plan d'action IA", "AI action plan", "خطة عمل ذكية"), included: false },
        { text: t3("Historique & suivi", "History & tracking", "سجل وتتبع"), included: false },
      ],
    },
    {
      name: "Pro",
      price: "99 DT",
      period: t3("/ mois", "/ month", "/ شهر"),
      desc: t3("Pour les PME qui veulent piloter et réduire leur empreinte durablement.", "For SMEs who want to manage and sustainably reduce their footprint.", "للمؤسسات الصغيرة التي تريد إدارة بصمتها وتخفيضها."),
      popular: true,
      cta: t3("Essai gratuit 14 jours", "14-day free trial", "تجربة مجانية 14 يومًا"),
      ctaStyle: "primary" as const,
      features: [
        { text: t3("Tout du plan Calculateur", "Everything in Calculator plan", "كل ميزات خطة الآلة الحاسبة"), included: true },
        { text: t3("Rapports PDF & Word certifiés", "Certified PDF & Word reports", "تقارير PDF وWord معتمدة"), included: true },
        { text: t3("Benchmarks sectoriels complets", "Complete sector benchmarks", "معايير قطاعية كاملة"), included: true },
        { text: t3("Plan d'action IA personnalisé", "Personalized AI action plan", "خطة عمل ذكية مخصصة"), included: true },
        { text: t3("20 produits / activités", "20 products / activities", "20 منتجًا / نشاطًا"), included: true },
        { text: t3("Historique 3 ans", "3-year history", "سجل 3 سنوات"), included: true },
        { text: t3("Suivi conformité réglementaire", "Regulatory compliance tracking", "تتبع الامتثال التنظيمي"), included: true },
        { text: t3("Support prioritaire", "Priority support", "دعم ذو أولوية"), included: true },
        { text: t3("Multi-sites & équipe étendue", "Multi-sites & extended team", "مواقع متعددة وفريق موسع"), included: false },
      ],
    },
    {
      name: t3("Entreprise", "Enterprise", "مؤسسة"),
      price: "299 DT",
      period: t3("/ mois", "/ month", "/ شهر"),
      desc: t3("Pour les grands groupes avec plusieurs sites et équipes multiples.", "For large groups with multiple sites and teams.", "للمجموعات الكبيرة ذات مواقع وفرق متعددة."),
      popular: false,
      cta: t3("Demander une démo", "Request a demo", "طلب عرض توضيحي"),
      ctaStyle: "outline" as const,
      features: [
        { text: t3("Tout du plan Pro", "Everything in Pro plan", "كل ميزات خطة Pro"), included: true },
        { text: t3("Sites & produits illimités", "Unlimited sites & products", "مواقع ومنتجات غير محدودة"), included: true },
        { text: t3("Équipe jusqu'à 20 utilisateurs", "Team up to 20 users", "فريق حتى 20 مستخدمًا"), included: true },
        { text: t3("Intégration ERP (SAP, Odoo)", "ERP integration (SAP, Odoo)", "تكامل ERP (SAP، Odoo)"), included: true },
        { text: t3("API REST documentée", "Documented REST API", "API REST موثقة"), included: true },
        { text: t3("Dashboard multi-sites consolidé", "Consolidated multi-site dashboard", "لوحة موحدة متعددة المواقع"), included: true },
        { text: t3("Accompagnement certification ISO", "ISO certification support", "دعم شهادة ISO"), included: true },
        { text: t3("Account manager dédié", "Dedicated account manager", "مدير حساب مخصص"), included: true },
      ],
    },
  ];

  return (
    <section id="tarifs" className="py-24 px-[5%] bg-card">
      <div className="mx-auto max-w-[1160px]">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
          {t3("Tarifs", "Pricing", "الأسعار")}
        </p>
        <h2 className="font-display text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-foreground leading-tight mb-3">
          {t3("Simple, transparent,", "Simple, transparent,", "بسيط، شفاف،")}
          <br />
          {t3("sans surprise", "no surprises", "بدون مفاجآت")}
        </h2>
        <p className="text-muted-foreground max-w-[520px] mb-12">
          {t3(
            "Le calculateur est gratuit et sans inscription. Passez au plan Pro pour les rapports et le suivi avancé.",
            "The calculator is free with no signup. Upgrade to Pro for reports and advanced tracking.",
            "الحاسبة مجانية بدون تسجيل. انتقل إلى Pro للتقارير والتتبع المتقدم."
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`landing-price-card ${plan.popular ? "popular" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 gradient-water text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  ⭐ {t3("Le plus populaire", "Most popular", "الأكثر شيوعًا")}
                </div>
              )}
              <p className="font-bold text-foreground mb-1">{plan.name}</p>
              <p className="font-display text-4xl font-extrabold text-primary leading-none my-2">
                {plan.price} <span className="font-sans text-sm text-muted-foreground font-normal">{plan.period}</span>
              </p>
              <p className="text-xs text-muted-foreground pb-5 mb-5 border-b border-border">{plan.desc}</p>
              <ul className="flex flex-col gap-2 mb-7">
                {plan.features.map((f) => (
                  <li key={f.text} className={`text-xs flex gap-2 ${f.included ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                    <span className={`flex-shrink-0 font-bold ${f.included ? "text-green-water" : ""}`}>
                      {f.included ? "✓" : "×"}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
                plan.ctaStyle === "primary"
                  ? "gradient-water text-primary-foreground hover:opacity-90"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
