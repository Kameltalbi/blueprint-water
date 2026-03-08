import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const stats = [
  { value: "2 847", labelFr: "Entreprises utilisatrices", labelEn: "Companies using it" },
  { value: "12", labelFr: "Secteurs couverts", labelEn: "Sectors covered" },
  { value: "500+", labelFr: "Coefficients en base", labelEn: "Coefficients in database" },
  { value: "15+", labelFr: "Pays & normes", labelEn: "Countries & standards" },
];

export function HeroSection() {
  const { t, lang } = useI18n();
  const fr = lang === "fr";

  return (
    <section className="landing-hero bg-card">
      <div className="landing-hero-bg" />

      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-primary mb-7">
          <span className="h-1.5 w-1.5 rounded-full bg-green-water" />
          {fr ? "Certifié ISO 14046 & Water Footprint Network" : "ISO 14046 & Water Footprint Network Certified"}
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          className="font-display text-[clamp(2.8rem,6vw,5rem)] font-extrabold leading-[1.1] text-foreground mb-5 text-center"
        >
          {fr ? "Mesurez votre" : "Measure your"}
          <br />
          <span className="text-primary">{fr ? "Empreinte Eau" : "Water Footprint"}</span>
          <br />
          {fr ? "en 5 minutes" : "in 5 minutes"}
        </motion.h1>

        <motion.p custom={2} variants={fadeUp} className="max-w-[580px] text-lg text-muted-foreground text-center mb-10">
          {fr
            ? "La plateforme universelle de calcul d'empreinte eau pour tous les secteurs — agriculture, industrie, agroalimentaire, énergie et bien plus."
            : "The universal water footprint calculation platform for all sectors — agriculture, industry, food processing, energy and more."}
        </motion.p>

        <motion.div custom={3} variants={fadeUp} className="flex gap-4 flex-wrap justify-center">
          <Link to="/calculateur" className="inline-flex items-center gap-2 rounded-[10px] px-8 py-3.5 font-semibold text-primary-foreground gradient-water shadow-[0_4px_20px_hsl(var(--ocean)/0.25)] hover:shadow-[0_8px_30px_hsl(var(--ocean)/0.35)] hover:-translate-y-0.5 transition-all">
            {fr ? "Calculer gratuitement" : "Calculate for free"}
          </Link>
          <a href="#fonctionnalites" className="inline-flex items-center rounded-[10px] px-8 py-3.5 font-medium border border-border text-foreground hover:border-primary hover:text-primary transition-all" style={{ backgroundColor: '#ffffff' }}>
            {fr ? "Découvrir la plateforme" : "Discover the platform"}
          </a>
        </motion.div>

        <motion.div custom={5} variants={fadeUp} className="landing-stats w-full max-w-3xl">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <span className="font-display text-[2.4rem] font-bold text-primary block leading-none">{s.value}</span>
              <span className="text-xs text-muted-foreground mt-1 block">{fr ? s.labelFr : s.labelEn}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
