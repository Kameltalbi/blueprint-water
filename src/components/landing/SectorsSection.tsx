import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const sectors = [
  { emoji: "🌾", nameFr: "Agriculture", nameEn: "Agriculture", nameAr: "الزراعة", descFr: "Irrigation, élevage, cultures", descEn: "Irrigation, livestock, crops", descAr: "ري، ماشية، محاصيل" },
  { emoji: "🍔", nameFr: "Agroalimentaire", nameEn: "Food Processing", nameAr: "الغذاء", descFr: "Transformation, boissons", descEn: "Processing, beverages", descAr: "تحويل، مشروبات" },
  { emoji: "🧵", nameFr: "Textile & Mode", nameEn: "Textile & Fashion", nameAr: "النسيج والموضة", descFr: "Confection, teinture, cuir", descEn: "Manufacturing, dyeing, leather", descAr: "خياطة، صباغة، جلود" },
  { emoji: "⚡", nameFr: "Énergie", nameEn: "Energy", nameAr: "الطاقة", descFr: "Thermique, nucléaire", descEn: "Thermal, nuclear", descAr: "حرارية، نووية" },
  { emoji: "⚙️", nameFr: "Industrie lourde", nameEn: "Heavy Industry", nameAr: "الصناعة الثقيلة", descFr: "Chimie, sidérurgie, ciment", descEn: "Chemistry, steel, cement", descAr: "كيمياء، صلب، إسمنت" },
  { emoji: "💊", nameFr: "Pharmacie", nameEn: "Pharma", nameAr: "الصيدلة", descFr: "Médicaments, cosmétiques", descEn: "Drugs, cosmetics", descAr: "أدوية، مستحضرات" },
  { emoji: "💻", nameFr: "Électronique", nameEn: "Electronics", nameAr: "الإلكترونيات", descFr: "Semi-conducteurs, PCB", descEn: "Semiconductors, PCB", descAr: "أشباه موصلات، دوائر" },
  { emoji: "🚗", nameFr: "Automobile", nameEn: "Automotive", nameAr: "السيارات", descFr: "Peinture, usinage, fonderie", descEn: "Painting, machining, foundry", descAr: "طلاء، تشكيل، صهر" },
  { emoji: "🏗️", nameFr: "BTP & Matériaux", nameEn: "Construction", nameAr: "البناء والمواد", descFr: "Béton, céramique, verre", descEn: "Concrete, ceramics, glass", descAr: "خرسانة، سيراميك، زجاج" },
  { emoji: "🏨", nameFr: "Hôtellerie", nameEn: "Hospitality", nameAr: "الضيافة", descFr: "Hôtels, restaurants, spas", descEn: "Hotels, restaurants, spas", descAr: "فنادق، مطاعم، سبا" },
  { emoji: "🛒", nameFr: "Distribution", nameEn: "Retail", nameAr: "التوزيع", descFr: "Supply chain, entrepôts", descEn: "Supply chain, warehouses", descAr: "سلسلة توريد، مستودعات" },
  { emoji: "🏫", nameFr: "Collectivités", nameEn: "Public Sector", nameAr: "القطاع العام", descFr: "Villes, hôpitaux, universités", descEn: "Cities, hospitals, universities", descAr: "مدن، مستشفيات، جامعات" },
];

export function SectorsSection() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;

  return (
    <section id="secteurs" className="py-24 px-[5%]" style={{ background: "hsl(var(--pale))" }}>
      <div className="mx-auto max-w-[1160px]">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
          {t3("Couverture universelle", "Universal coverage", "تغطية شاملة")}
        </p>
        <h2 className="font-display text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-foreground leading-tight mb-3">
          {t3("Tous les secteurs,", "All sectors,", "جميع القطاعات،")}
          <br />
          {t3("une seule plateforme", "one single platform", "منصة واحدة")}
        </h2>
        <p className="text-muted-foreground max-w-[520px] mb-12">
          {t3(
            "Notre moteur de calcul s'adapte automatiquement aux spécificités de chaque secteur d'activité.",
            "Our calculation engine automatically adapts to each industry's specificities.",
            "يتكيف محرك الحساب لدينا تلقائيًا مع خصائص كل قطاع."
          )}
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
              <span className="font-bold text-sm text-foreground">{t3(s.nameFr, s.nameEn, s.nameAr)}</span>
              <span className="text-xs text-muted-foreground">{t3(s.descFr, s.descEn, s.descAr)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
