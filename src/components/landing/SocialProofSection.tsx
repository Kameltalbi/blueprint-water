import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { ShieldCheck } from "lucide-react";

const sectors = [
  { name: "Agroalimentaire", icon: "🌾" },
  { name: "Industrie", icon: "🏭" },
  { name: "Agriculture", icon: "🌿" },
  { name: "Énergie", icon: "⚡" },
  { name: "Textile", icon: "🧵" },
  { name: "Pharmaceutique", icon: "💊" },
  { name: "Chimie", icon: "🔬" },
  { name: "Construction", icon: "🏗️" },
  { name: "Mines", icon: "⛏️" },
  { name: "Tourisme", icon: "🏨" },
];

const compliance = [
  { label: "ISO 14046", sub: "Water Footprint" },
  { label: "GRI 303", sub: "Water & Effluents" },
  { label: "WFN", sub: "Water Footprint Network" },
  { label: "CSRD", sub: "EU Sustainability Reporting" },
  { label: "CDP", sub: "Water Security" },
];

export function SocialProofSection() {
  const { lang } = useI18n();
  const fr = lang !== "en";

  return (
    <section className="py-16 px-[5%] bg-background border-y border-border/50">
      <div className="mx-auto max-w-[1200px] space-y-12">

        {/* Compliance badges */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            {fr ? "Conformité aux standards internationaux" : "Compliant with international standards"}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {compliance.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center rounded-xl border-2 border-primary/15 bg-primary/5 px-6 py-3 text-center hover:border-primary/30 hover:bg-primary/10 transition-colors"
              >
                <span className="text-sm font-black text-primary tracking-tight">{badge.label}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">{badge.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Sector badges */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6"
          >
            {fr ? "Secteurs couverts" : "Sectors covered"}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {sectors.map((s) => (
              <span
                key={s.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
              >
                {s.icon} {s.name}
              </span>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
