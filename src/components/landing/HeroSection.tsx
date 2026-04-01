import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Droplets } from "lucide-react";
import heroIllustration from "@/assets/hydroscan_hero_illustration.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7 } }),
};

const stats = [
  { value: "12", labelFr: "Secteurs couverts", labelEn: "Sectors covered", labelAr: "قطاعات مشمولة", icon: "🏭" },
  { value: "500+", labelFr: "Coefficients WFN", labelEn: "WFN Coefficients", labelAr: "معاملات WFN", icon: "📊" },
  { value: "15+", labelFr: "Pays & normes", labelEn: "Countries & standards", labelAr: "دول ومعايير", icon: "🌍" },
  { value: "ISO", labelFr: "14046 conforme", labelEn: "14046 compliant", labelAr: "متوافق 14046", icon: "✅" },
];

export function HeroSection() {
  const { t, lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-[hsl(var(--pale))] pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[hsl(var(--sky))]/5 blur-3xl" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center px-[5%]"
      >
        {/* ── Left: Text ── */}
        <div className="flex flex-col items-start text-left">
          <motion.div
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-primary mb-6"
          >
            <Droplets className="h-3.5 w-3.5" />
            {t3("Certifié ISO 14046 & Water Footprint Network", "ISO 14046 & Water Footprint Network Certified", "معتمد وفق ISO 14046 وشبكة البصمة المائية")}
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-extrabold leading-[1.08] text-foreground mb-6"
          >
            {t3("Mesurez votre", "Measure your", "قِس")}
            <br />
            <span className="bg-gradient-to-r from-primary to-[hsl(var(--sky))] bg-clip-text text-transparent">
              {t3("Empreinte Eau", "Water Footprint", "بصمتك المائية")}
            </span>
            <br />
            {t3("en 5 minutes", "in 5 minutes", "في 5 دقائق")}
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} className="max-w-[480px] text-base text-muted-foreground leading-relaxed mb-8">
            {t3(
              "La plateforme universelle de calcul d'empreinte eau pour tous les secteurs — agriculture, industrie, agroalimentaire, énergie et bien plus.",
              "The universal water footprint calculation platform for all sectors — agriculture, industry, food processing, energy and more.",
              "المنصة الشاملة لحساب البصمة المائية لجميع القطاعات — الزراعة، الصناعة، الغذاء، الطاقة وأكثر."
            )}
          </motion.p>

          <motion.div custom={3} variants={fadeUp} className="flex gap-3 flex-wrap">
            <Link
              to="/calculateur"
              className="group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-sm text-primary-foreground gradient-water shadow-[0_4px_20px_hsl(var(--ocean)/0.2)] hover:shadow-[0_8px_30px_hsl(var(--ocean)/0.35)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {t3("Calculer gratuitement", "Calculate for free", "احسب مجانًا")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#fonctionnalites"
              className="inline-flex items-center rounded-xl px-7 py-3.5 font-medium text-sm border-2 border-primary/20 text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
            >
              {t3("Découvrir la plateforme", "Discover the platform", "اكتشف المنصة")}
            </a>
          </motion.div>
        </div>

        {/* ── Right: Illustration ── */}
        <motion.div
          custom={2}
          variants={fadeUp}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative">
            {/* Glow behind illustration */}
            <div className="absolute inset-0 scale-90 rounded-3xl bg-gradient-to-br from-primary/10 via-[hsl(var(--sky))]/10 to-[hsl(var(--ocean))]/10 blur-2xl" />
            <img
              src={heroIllustration}
              width={1024}
              height={768}
              alt={t3("Illustration empreinte eau HydroScan", "HydroScan water footprint illustration", "توضيح البصمة المائية HydroScan")}
              className="relative w-full max-w-[580px] h-auto rounded-2xl"
            />
            {/* Animated water droplets */}
            {[
              { left: "58%", top: "38%", delay: 0, size: 6 },
              { left: "55%", top: "42%", delay: 0.4, size: 5 },
              { left: "61%", top: "40%", delay: 0.8, size: 4 },
              { left: "57%", top: "36%", delay: 1.2, size: 5 },
              { left: "60%", top: "44%", delay: 1.6, size: 3 },
            ].map((drop, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[hsl(var(--sky))]/60"
                style={{
                  left: drop.left,
                  top: drop.top,
                  width: drop.size,
                  height: drop.size,
                }}
                animate={{
                  y: [0, 60, 120],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1, 0.3],
                }}
                transition={{
                  duration: 1.8,
                  delay: drop.delay,
                  repeat: Infinity,
                  ease: "easeIn",
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Stats strip ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 mt-16 lg:mt-20 px-[5%]"
      >
        <motion.div
          custom={5}
          variants={fadeUp}
          className="mx-auto max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm py-5 px-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <span className="text-lg mb-1">{s.icon}</span>
              <span className="font-display text-2xl font-bold text-primary leading-none">{s.value}</span>
              <span className="text-[11px] text-muted-foreground text-center">{t3(s.labelFr, s.labelEn, s.labelAr)}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
