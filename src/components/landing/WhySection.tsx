import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const stats = [
  { numberKey: "why.stat1.number", labelKey: "why.stat1.label" },
  { numberKey: "why.stat2.number", labelKey: "why.stat2.label" },
  { numberKey: "why.stat3.number", labelKey: "why.stat3.label" },
  { numberKey: "why.stat4.number", labelKey: "why.stat4.label" },
];

const reasons = [
  { emoji: "💰", numberLabel: "1", titleKey: "why.reason1.title", descKey: "why.reason1.desc", highlightKey: "why.reason1.highlight", colorClass: "bg-[hsl(142,72%,29%)]/10" },
  { emoji: "⚖️", numberLabel: "2", titleKey: "why.reason2.title", descKey: "why.reason2.desc", highlightKey: "why.reason2.highlight", colorClass: "bg-[hsl(25,95%,53%)]/10" },
  { emoji: "🏦", numberLabel: "3", titleKey: "why.reason3.title", descKey: "why.reason3.desc", highlightKey: "why.reason3.highlight", colorClass: "bg-[hsl(270,70%,60%)]/10" },
  { emoji: "🏆", numberLabel: "4", titleKey: "why.reason4.title", descKey: "why.reason4.desc", highlightKey: "why.reason4.highlight", colorClass: "bg-[hsl(48,96%,53%)]/10" },
  { emoji: "⚠️", numberLabel: "5", titleKey: "why.reason5.title", descKey: "why.reason5.desc", highlightKey: "why.reason5.highlight", colorClass: "bg-destructive/10" },
  { emoji: "🌍", numberLabel: "6", titleKey: "why.reason6.title", descKey: "why.reason6.desc", highlightKey: "why.reason6.highlight", colorClass: "bg-primary/10" },
];

const roiRows = [
  { labelKey: "why.roi.row1.label", valueKey: "why.roi.row1.value", highlight: false },
  { labelKey: "why.roi.row2.label", valueKey: "why.roi.row2.value", highlight: false },
  { labelKey: "why.roi.row3.label", valueKey: "why.roi.row3.value", highlight: false },
  { labelKey: "why.roi.row4.label", valueKey: "why.roi.row4.value", highlight: true },
  { labelKey: "why.roi.row5.label", valueKey: "why.roi.row5.value", highlight: false },
  { labelKey: "why.roi.row6.label", valueKey: "why.roi.row6.value", highlight: true },
];

export function WhySection() {
  const { t } = useI18n();

  return (
    <>
      {/* Stats Bar */}
      <div className="why-stats-bar">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.numberKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="why-stat-item"
            >
              <p className="why-stat-number">{t(stat.numberKey)}</p>
              <p className="text-xs text-muted-foreground">{t(stat.labelKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why Section */}
      <section id="probleme" className="why-dark-section">
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:py-28">
          {/* Section header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="why-section-label">
              <span className="inline-block h-px w-8 bg-primary" />
              <span>{t("why.label")}</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="why-section-title">
              {t("why.title1")}
              <em className="not-italic text-primary">{t("why.titleHighlight")}</em>
            </motion.h2>
            <motion.p variants={fadeUp} className="why-section-sub">
              {t("why.subtitle")}
            </motion.p>
          </motion.div>

          {/* Reasons Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="why-reasons-grid"
          >
            {reasons.map((r) => (
              <motion.div key={r.titleKey} variants={fadeUp} className="why-reason-card group">
                <div className="why-reason-card-line" />
                <div className={`why-reason-icon ${r.colorClass}`}>
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="why-reason-number">{r.numberLabel}</span>
                </div>
                <h3 className="mt-6 font-semibold text-lg">{t(r.titleKey)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(r.descKey)}</p>
                <div className="why-reason-highlight">
                  <span className="text-xs">→</span>
                  {t(r.highlightKey)}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ROI Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="why-roi-box mt-20"
          >
            <div className="why-roi-glow" />
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent-foreground">{t("why.roi.label")}</p>
              <h3 className="mt-4 text-2xl font-bold sm:text-3xl lg:text-4xl leading-tight">{t("why.roi.title")}</h3>
              <p className="mt-5 text-muted-foreground leading-relaxed">{t("why.roi.desc")}</p>
              <Button className="mt-8 gap-2">
                {t("why.roi.cta")} <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-3">
              {roiRows.map((row, i) => (
                <div key={i}>
                  {i === 3 && <div className="my-2 h-px bg-primary/15" />}
                  <div className={`why-calc-row ${row.highlight ? "why-calc-row-highlight" : ""}`}>
                    <span className="text-sm text-muted-foreground">{t(row.labelKey)}</span>
                    <span className={`font-bold ${row.highlight ? "text-lg text-accent-foreground" : ""}`}>{t(row.valueKey)}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Pitch Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="why-pitch-box mt-20"
          >
            <div className="why-pitch-quote">"</div>
            <motion.p variants={fadeUp} className="relative z-10 text-lg font-semibold leading-relaxed sm:text-xl lg:text-2xl">
              {t("why.pitch.line1")}<br />
              {t("why.pitch.line2")}<br />
              <span className="text-primary">{t("why.pitch.line3")}</span><br />
              {t("why.pitch.line4")}<br />
              {t("why.pitch.line5")}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center gap-3">
              {["why.pitch.tag1", "why.pitch.tag2", "why.pitch.tag3", "why.pitch.tag4", "why.pitch.tag5"].map((key) => (
                <span key={key} className="why-pitch-tag">
                  <span className="font-bold text-accent-foreground">✓</span>
                  {t(key)}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
