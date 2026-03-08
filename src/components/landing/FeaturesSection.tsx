import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const features = [
  { icon: "🎯", titleFr: "Calcul ISO 14046", titleEn: "ISO 14046 Calculation", descFr: "Méthodologie conforme à la norme internationale. Eau Verte, Bleue et Grise calculées selon le Water Footprint Network.", descEn: "Methodology compliant with international standard. Green, Blue and Grey Water calculated per WFN." },
  { icon: "⚡", titleFr: "Résultats instantanés", titleEn: "Instant results", descFr: "Obtenez votre empreinte en quelques minutes, sans traitement manuel ni attente.", descEn: "Get your footprint in minutes, no manual processing or waiting." },
  { icon: "📊", titleFr: "Benchmarks sectoriels", titleEn: "Sector benchmarks", descFr: "Comparez-vous aux meilleures pratiques grâce à notre base de données anonymisée par secteur et par région.", descEn: "Compare with best practices through our anonymized database by sector and region." },
  { icon: "📄", titleFr: "Rapports professionnels", titleEn: "Professional reports", descFr: "Générez des rapports Word et PDF prêts à soumettre à vos clients, partenaires ou auditeurs certifiés.", descEn: "Generate Word and PDF reports ready to submit to clients, partners or certified auditors." },
  { icon: "🗺️", titleFr: "Plan d'action IA", titleEn: "AI action plan", descFr: "Recommandations personnalisées priorisées par impact, coût et délai de mise en œuvre.", descEn: "Personalized recommendations prioritized by impact, cost and implementation time." },
  { icon: "⚖️", titleFr: "Conformité réglementaire", titleEn: "Regulatory compliance", descFr: "Suivi en temps réel de votre conformité aux normes locales et internationales (ANPE, UE, ISO 14001).", descEn: "Real-time compliance tracking with local and international standards (ANPE, EU, ISO 14001)." },
];

export function FeaturesSection() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  return (
    <section id="fonctionnalites" className="py-24 px-[5%]" style={{ background: "hsl(var(--pale))" }}>
      <div className="mx-auto max-w-[1160px]">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
          {fr ? "Fonctionnalités" : "Features"}
        </p>
        <h2 className="font-display text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-foreground leading-tight mb-3">
          {fr ? "Tout ce dont vous avez" : "Everything you need"}
          <br />
          {fr ? "besoin pour mesurer & agir" : "to measure & act"}
        </h2>
        <p className="text-muted-foreground max-w-[520px] mb-12">
          {fr
            ? "De l'analyse rapide au rapport ISO certifié, HydroScan couvre l'ensemble de vos besoins environnementaux."
            : "From quick analysis to certified ISO reports, HydroScan covers all your environmental needs."}
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-5"
        >
          {features.map((f) => (
            <motion.div key={f.titleFr} variants={fadeUp} className="landing-feat">
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-xl mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-sm text-foreground mb-2">{fr ? f.titleFr : f.titleEn}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{fr ? f.descFr : f.descEn}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
