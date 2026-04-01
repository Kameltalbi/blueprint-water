/**
 * Water Footprint Reference Data
 * Sources: Water Footprint Network (WFN), Ecoinvent, Aqueduct/WRI
 */

/* ── WSI — Water Stress Index by country (Aqueduct/WRI) ── */
export const wsiByCountry: Record<string, { wsi: number; label: string; labelEn: string }> = {
  tunisie:        { wsi: 4.2, label: "Stress extrême",    labelEn: "Extreme stress" },
  maroc:          { wsi: 3.8, label: "Stress extrême",    labelEn: "Extreme stress" },
  algerie:        { wsi: 3.5, label: "Stress élevé",      labelEn: "High stress" },
  arabie_saoudite:{ wsi: 5.0, label: "Stress extrême",    labelEn: "Extreme stress" },
  egypte:         { wsi: 4.5, label: "Stress extrême",    labelEn: "Extreme stress" },
  libye:          { wsi: 4.8, label: "Stress extrême",    labelEn: "Extreme stress" },
  jordanie:       { wsi: 4.7, label: "Stress extrême",    labelEn: "Extreme stress" },
  inde:           { wsi: 3.9, label: "Stress élevé",      labelEn: "High stress" },
  chine:          { wsi: 2.8, label: "Stress moyen-élevé",labelEn: "Medium-high stress" },
  turquie:        { wsi: 3.2, label: "Stress élevé",      labelEn: "High stress" },
  france:         { wsi: 1.5, label: "Stress faible",     labelEn: "Low stress" },
  espagne:        { wsi: 2.9, label: "Stress moyen-élevé",labelEn: "Medium-high stress" },
  italie:         { wsi: 2.4, label: "Stress moyen",      labelEn: "Medium stress" },
  allemagne:      { wsi: 1.2, label: "Stress faible",     labelEn: "Low stress" },
  bresil:         { wsi: 1.3, label: "Stress faible",     labelEn: "Low stress" },
  usa:            { wsi: 2.1, label: "Stress moyen",      labelEn: "Medium stress" },
  autre:          { wsi: 2.0, label: "Stress moyen",      labelEn: "Medium stress" },
};

export const countryOptions = [
  "Tunisie", "Maroc", "Algérie", "Arabie Saoudite", "Égypte", "Libye", "Jordanie",
  "France", "Espagne", "Italie", "Allemagne",
  "Inde", "Chine", "Turquie", "Brésil", "USA", "Autre",
];

/* ── Materials — 50+ with WFN/Ecoinvent coefficients (L/kg) ── */
export interface Material {
  value: string;
  label: string;
  coeff: number;            // L/kg total water footprint
  category: string;
  source: string;           // WFN or Ecoinvent
}

export const materials: Material[] = [
  // Agriculture — Céréales & cultures
  { value: "ble", label: "Blé", coeff: 1830, category: "agriculture", source: "WFN" },
  { value: "mais", label: "Maïs", coeff: 1220, category: "agriculture", source: "WFN" },
  { value: "riz", label: "Riz", coeff: 1670, category: "agriculture", source: "WFN" },
  { value: "orge", label: "Orge", coeff: 1420, category: "agriculture", source: "WFN" },
  { value: "sorgho", label: "Sorgho", coeff: 3048, category: "agriculture", source: "WFN" },
  { value: "soja", label: "Soja", coeff: 2145, category: "agriculture", source: "WFN" },
  { value: "arachide", label: "Arachide", coeff: 3100, category: "agriculture", source: "WFN" },
  { value: "tournesol", label: "Tournesol", coeff: 3366, category: "agriculture", source: "WFN" },
  { value: "olives", label: "Olives", coeff: 3015, category: "agriculture", source: "WFN" },
  { value: "dattes", label: "Dattes", coeff: 2277, category: "agriculture", source: "WFN" },
  { value: "tomates", label: "Tomates", coeff: 214, category: "agriculture", source: "WFN" },
  { value: "pommes_terre", label: "Pommes de terre", coeff: 287, category: "agriculture", source: "WFN" },
  { value: "oranges", label: "Oranges", coeff: 560, category: "agriculture", source: "WFN" },
  { value: "raisin", label: "Raisin", coeff: 608, category: "agriculture", source: "WFN" },
  { value: "cafe", label: "Café", coeff: 15897, category: "agriculture", source: "WFN" },
  { value: "cacao", label: "Cacao", coeff: 17196, category: "agriculture", source: "WFN" },
  { value: "sucre_canne", label: "Sucre (canne)", coeff: 1782, category: "agriculture", source: "WFN" },
  { value: "tabac", label: "Tabac", coeff: 2925, category: "agriculture", source: "WFN" },

  // Élevage & produits animaux
  { value: "boeuf", label: "Bœuf", coeff: 15400, category: "elevage", source: "WFN" },
  { value: "agneau", label: "Agneau / Mouton", coeff: 10412, category: "elevage", source: "WFN" },
  { value: "poulet", label: "Poulet", coeff: 4325, category: "elevage", source: "WFN" },
  { value: "porc", label: "Porc", coeff: 5990, category: "elevage", source: "WFN" },
  { value: "lait", label: "Lait", coeff: 1020, category: "elevage", source: "WFN" },
  { value: "fromage", label: "Fromage", coeff: 5605, category: "elevage", source: "WFN" },
  { value: "oeufs", label: "Œufs", coeff: 3265, category: "elevage", source: "WFN" },
  { value: "beurre", label: "Beurre", coeff: 5553, category: "elevage", source: "WFN" },
  { value: "cuir", label: "Cuir (bovin)", coeff: 17093, category: "elevage", source: "WFN" },

  // Textile & fibres
  { value: "coton", label: "Coton conventionnel", coeff: 8200, category: "textile", source: "WFN" },
  { value: "coton_bio", label: "Coton biologique", coeff: 6000, category: "textile", source: "WFN" },
  { value: "lin", label: "Lin", coeff: 1500, category: "textile", source: "WFN" },
  { value: "laine", label: "Laine", coeff: 50500, category: "textile", source: "WFN" },
  { value: "soie", label: "Soie", coeff: 70000, category: "textile", source: "WFN" },
  { value: "chanvre", label: "Chanvre", coeff: 2400, category: "textile", source: "Ecoinvent" },
  { value: "jute", label: "Jute", coeff: 3685, category: "textile", source: "WFN" },
  { value: "polyester", label: "Polyester", coeff: 71, category: "textile", source: "Ecoinvent" },
  { value: "nylon", label: "Nylon", coeff: 250, category: "textile", source: "Ecoinvent" },
  { value: "viscose", label: "Viscose / Rayonne", coeff: 4200, category: "textile", source: "Ecoinvent" },

  // Construction & BTP (Afrique du Nord)
  { value: "ciment", label: "Ciment Portland", coeff: 1360, category: "btp", source: "Ecoinvent" },
  { value: "beton", label: "Béton", coeff: 170, category: "btp", source: "Ecoinvent" },
  { value: "acier", label: "Acier", coeff: 10850, category: "btp", source: "Ecoinvent" },
  { value: "aluminium", label: "Aluminium", coeff: 16500, category: "btp", source: "Ecoinvent" },
  { value: "brique", label: "Brique cuite", coeff: 550, category: "btp", source: "Ecoinvent" },
  { value: "verre", label: "Verre plat", coeff: 780, category: "btp", source: "Ecoinvent" },
  { value: "bois_construction", label: "Bois de construction", coeff: 3000, category: "btp", source: "WFN" },
  { value: "platre", label: "Plâtre", coeff: 350, category: "btp", source: "Ecoinvent" },
  { value: "ceramique", label: "Carrelage céramique", coeff: 620, category: "btp", source: "Ecoinvent" },
  { value: "pvc", label: "PVC (tuyaux)", coeff: 195, category: "btp", source: "Ecoinvent" },
  { value: "cuivre", label: "Cuivre", coeff: 9500, category: "btp", source: "Ecoinvent" },
  { value: "sable", label: "Sable", coeff: 25, category: "btp", source: "Ecoinvent" },
  { value: "gravier", label: "Gravier", coeff: 35, category: "btp", source: "Ecoinvent" },

  // Énergie & chimie
  { value: "petrole", label: "Pétrole brut", coeff: 1058, category: "energie", source: "Ecoinvent" },
  { value: "gaz_naturel", label: "Gaz naturel (m³→kg)", coeff: 109, category: "energie", source: "Ecoinvent" },
  { value: "bioethanol", label: "Bioéthanol", coeff: 2570, category: "energie", source: "WFN" },
  { value: "huile_olive", label: "Huile d'olive", coeff: 14430, category: "energie", source: "WFN" },
  { value: "phosphate", label: "Phosphate (engrais)", coeff: 820, category: "energie", source: "Ecoinvent" },
  { value: "papier", label: "Papier / Carton", coeff: 2600, category: "energie", source: "WFN" },
  { value: "plastique_pe", label: "Plastique PE/PP", coeff: 185, category: "energie", source: "Ecoinvent" },
  { value: "caoutchouc", label: "Caoutchouc naturel", coeff: 17000, category: "energie", source: "WFN" },
];

export const materialCategories = [
  { value: "agriculture", label: "🌾 Agriculture & Cultures", labelEn: "🌾 Agriculture & Crops" },
  { value: "elevage", label: "🐄 Élevage & Produits animaux", labelEn: "🐄 Livestock & Animal products" },
  { value: "textile", label: "🧵 Textile & Fibres", labelEn: "🧵 Textile & Fibers" },
  { value: "btp", label: "🏗️ Construction & BTP", labelEn: "🏗️ Construction & Building" },
  { value: "energie", label: "⚡ Énergie & Chimie", labelEn: "⚡ Energy & Chemicals" },
];

/* ── Concrete equivalents ── */
export function getEquivalents(totalM3: number, lang: string) {
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;
  const bottles = Math.round(totalM3 * 1000 / 1.5);       // bouteilles 1.5L
  const pools = (totalM3 / 2500).toFixed(1);                // piscine olympique = 2500 m³
  const showers = Math.round(totalM3 * 1000 / 60);          // douche ≈ 60L
  const daysPerPerson = Math.round(totalM3 * 1000 / 150);   // conso domestique ≈ 150L/jour

  return [
    { icon: "🧴", value: bottles.toLocaleString("fr-FR"), label: t3("bouteilles de 1,5L", "1.5L bottles", "زجاجة 1.5 لتر") },
    { icon: "🏊", value: pools, label: t3("piscines olympiques", "Olympic pools", "حمام سباحة أولمبي") },
    { icon: "🚿", value: showers.toLocaleString("fr-FR"), label: t3("douches (5 min)", "showers (5 min)", "دشة (5 دقائق)") },
    { icon: "👤", value: daysPerPerson.toLocaleString("fr-FR"), label: t3("jours conso. 1 personne", "days for 1 person", "يوم لشخص واحد") },
  ];
}
