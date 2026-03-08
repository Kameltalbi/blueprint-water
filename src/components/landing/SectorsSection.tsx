import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const sectors = [
  { emoji: "🌾", nameFr: "Agriculture", nameEn: "Agriculture", descFr: "Irrigation, élevage, cultures", descEn: "Irrigation, livestock, crops" },
  { emoji: "🍔", nameFr: "Agroalimentaire", nameEn: "Food Processing", descFr: "Transformation, boissons", descEn: "Processing, beverages" },
  { emoji: "🧵", nameFr: "Textile & Mode", nameEn: "Textile & Fashion", descFr: "Confection, teinture, cuir", descEn: "Manufacturing, dyeing, leather" },
  { emoji: "⚡", nameFr: "Énergie", nameEn: "Energy", descFr: "Thermique, nucléaire", descEn: "Thermal, nuclear" },
  { emoji: "⚙️", nameFr: "Industrie lourde", nameEn: "Heavy Industry", descFr: "Chimie, sidérurgie, ciment", descEn: "Chemistry, steel, cement" },
  { emoji: "💊", nameFr: "Pharmacie", nameEn: "Pharma", descFr: "Médicaments, cosmétiques", descEn: "Drugs, cosmetics" },
  { emoji: "💻", nameFr: "Électronique", nameEn: "Electronics", descFr: "Semi-conducteurs, PCB", descEn: "Semiconductors, PCB" },
  { emoji: "🚗", nameFr: "Automobile", nameEn: "Automotive", descFr: "Peinture, usinage, fonderie", descEn: "Painting, machining, foundry" },
  { emoji: "🏗️", nameFr: "BTP & Matériaux", nameEn: "Construction", descFr: "Béton, céramique, verre", descEn: "Concrete, ceramics, glass" },
  { emoji: "🏨", nameFr: "Hôtellerie", nameEn: "Hospitality", descFr: "Hôtels, restaurants, spas", descEn: "Hotels, restaurants, spas" },
  { emoji: "🛒", nameFr: "Distribution", nameEn: "Retail", descFr: "Supply chain, entrepôts", descEn: "Supply chain, warehouses" },
  { emoji: "🏫", nameFr: "Collectivités", nameEn: "Public Sector", descFr: "Villes, hôpitaux, universités", descEn: "Cities, hospitals, universities" },
];

export function SectorsSection() {
  const { lang } = useI18n();
  const fr = lang === "fr";

  return (
    <section id="secteurs" className="py-24 px-[5%]" style={{ background: "hsl(var(--pale))" }}>
      <div className="mx-auto max-w-[1160px]">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
          {fr ? "Couverture universelle" : "Universal coverage"}
        </p>
        <h2 className="font-display text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-foreground leading-tight mb-3">
          {fr ? "Tous les secteurs," : "All sectors,"}
          <br />
          {fr ? "une seule plateforme" : "one single platform"}
        </h2>
        <p className="text-muted-foreground max-w-[520px] mb-12">
          {fr
            ? "Notre moteur de calcul s'adapte automatiquement aux spécificités de chaque secteur d'activité."
            : "Our calculation engine automatically adapts to each industry's specificities."}
        </p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
          {sectors.map((s, i) => (
            <motion.div
              key={s.nameFr}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="landing-sc-card"
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="font-bold text-sm text-foreground">{fr ? s.nameFr : s.nameEn}</span>
              <span className="text-xs text-muted-foreground">{fr ? s.descFr : s.descEn}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
