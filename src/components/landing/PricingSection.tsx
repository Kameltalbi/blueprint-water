import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function PricingSection() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  const plans = [
    {
      name: fr ? "Calculateur" : "Calculator",
      price: "0 DT",
      period: "",
      desc: fr ? "Accès immédiat, sans inscription. Calculez votre empreinte en 5 minutes." : "Instant access, no signup. Calculate your footprint in 5 minutes.",
      popular: false,
      cta: fr ? "Calculer maintenant →" : "Calculate now →",
      ctaStyle: "outline" as const,
      features: [
        { text: fr ? "Calculateur complet EV + EB + EG" : "Full calculator GW + BW + GW", included: true },
        { text: fr ? "12 secteurs d'activité" : "12 industry sectors", included: true },
        { text: fr ? "500+ matières en base de données" : "500+ materials in database", included: true },
        { text: fr ? "Résultats & score instantanés" : "Instant results & score", included: true },
        { text: fr ? "Recommandations basiques" : "Basic recommendations", included: true },
        { text: fr ? "Rapports PDF / Word certifiés" : "Certified PDF / Word reports", included: false },
        { text: fr ? "Benchmarks sectoriels détaillés" : "Detailed sector benchmarks", included: false },
        { text: fr ? "Plan d'action IA" : "AI action plan", included: false },
        { text: fr ? "Historique & suivi" : "History & tracking", included: false },
      ],
    },
    {
      name: "Pro",
      price: "99 DT",
      period: fr ? "/ mois" : "/ month",
      desc: fr ? "Pour les PME qui veulent piloter et réduire leur empreinte durablement." : "For SMEs who want to manage and sustainably reduce their footprint.",
      popular: true,
      cta: fr ? "Essai gratuit 14 jours" : "14-day free trial",
      ctaStyle: "primary" as const,
      features: [
        { text: fr ? "Tout du plan Calculateur" : "Everything in Calculator plan", included: true },
        { text: fr ? "Rapports PDF & Word certifiés" : "Certified PDF & Word reports", included: true },
        { text: fr ? "Benchmarks sectoriels complets" : "Complete sector benchmarks", included: true },
        { text: fr ? "Plan d'action IA personnalisé" : "Personalized AI action plan", included: true },
        { text: fr ? "20 produits / activités" : "20 products / activities", included: true },
        { text: fr ? "Historique 3 ans" : "3-year history", included: true },
        { text: fr ? "Suivi conformité réglementaire" : "Regulatory compliance tracking", included: true },
        { text: fr ? "Support prioritaire" : "Priority support", included: true },
        { text: fr ? "Multi-sites & équipe étendue" : "Multi-sites & extended team", included: false },
      ],
    },
    {
      name: fr ? "Entreprise" : "Enterprise",
      price: "299 DT",
      period: fr ? "/ mois" : "/ month",
      desc: fr ? "Pour les grands groupes avec plusieurs sites et équipes multiples." : "For large groups with multiple sites and teams.",
      popular: false,
      cta: fr ? "Demander une démo" : "Request a demo",
      ctaStyle: "outline" as const,
      features: [
        { text: fr ? "Tout du plan Pro" : "Everything in Pro plan", included: true },
        { text: fr ? "Sites & produits illimités" : "Unlimited sites & products", included: true },
        { text: fr ? "Équipe jusqu'à 20 utilisateurs" : "Team up to 20 users", included: true },
        { text: fr ? "Intégration ERP (SAP, Odoo)" : "ERP integration (SAP, Odoo)", included: true },
        { text: fr ? "API REST documentée" : "Documented REST API", included: true },
        { text: fr ? "Dashboard multi-sites consolidé" : "Consolidated multi-site dashboard", included: true },
        { text: fr ? "Accompagnement certification ISO" : "ISO certification support", included: true },
        { text: fr ? "Account manager dédié" : "Dedicated account manager", included: true },
      ],
    },
  ];

  return (
    <section id="tarifs" className="py-24 px-[5%] bg-card">
      <div className="mx-auto max-w-[1160px]">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
          {fr ? "Tarifs" : "Pricing"}
        </p>
        <h2 className="font-display text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-foreground leading-tight mb-3">
          {fr ? "Simple, transparent," : "Simple, transparent,"}
          <br />
          {fr ? "sans surprise" : "no surprises"}
        </h2>
        <p className="text-muted-foreground max-w-[520px] mb-12">
          {fr
            ? "Le calculateur est gratuit et sans inscription. Passez au plan Pro pour les rapports et le suivi avancé."
            : "The calculator is free with no signup. Upgrade to Pro for reports and advanced tracking."}
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
                  ⭐ {fr ? "Le plus populaire" : "Most popular"}
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
