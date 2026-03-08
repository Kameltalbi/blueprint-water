/**
 * WFN Manual-based recommendations engine
 * Generates context-aware recommendations by:
 *   - User profile (enterprise, agriculture, consumer)
 *   - Dominant water component (blue/green/grey)
 *   - Volume thresholds
 */

export type UserProfile = "enterprise" | "agriculture" | "consumer";
export type WaterComponent = "blue" | "green" | "grey";

export interface WFRecommendation {
  id: number;
  title: string;
  description: string;
  savingsPercent: number;
  priority: "high" | "medium" | "low";
  category: string;
  profile: UserProfile;
  component: WaterComponent;
}

const RECS_DB: Omit<WFRecommendation, "id">[] = [
  // ── ENTERPRISE — Blue ──
  { title: "Recyclage en circuit fermé", description: "Recirculer 100% des eaux de process pour éliminer la consommation nette (WFN: réduire l'empreinte bleue opérationnelle).", savingsPercent: 15, priority: "high", category: "Recyclage", profile: "enterprise", component: "blue" },
  { title: "Refroidissement en circuit fermé", description: "Remplacer le refroidissement à eau ouverte par un circuit fermé avec tour de refroidissement.", savingsPercent: 10, priority: "high", category: "Process", profile: "enterprise", component: "blue" },
  { title: "Captation de vapeur", description: "Capturer la vapeur évaporée dans les procédés pour réutilisation (réduction de l'évaporation bleue).", savingsPercent: 5, priority: "medium", category: "Process", profile: "enterprise", component: "blue" },
  { title: "Détection de fuites IoT", description: "Capteurs connectés pour identifier les fuites en temps réel — réduire les flux de retour perdus.", savingsPercent: 8, priority: "high", category: "Maintenance", profile: "enterprise", component: "blue" },
  { title: "Benchmarking inter-sites", description: "Comparer la performance hydrique entre sites pour identifier les meilleures pratiques internes.", savingsPercent: 5, priority: "medium", category: "Gestion", profile: "enterprise", component: "blue" },

  // ── ENTERPRISE — Grey ──
  { title: "Traitement des eaux usées", description: "Traiter les effluents avant rejet pour réduire la charge polluante L et ainsi l'empreinte grise (WF_gris = L/(Cmax-Cnat)).", savingsPercent: 20, priority: "high", category: "Pollution", profile: "enterprise", component: "grey" },
  { title: "Recyclage des produits chimiques", description: "Récupérer et recycler les produits chimiques pour réduire la concentration des effluents.", savingsPercent: 12, priority: "high", category: "Pollution", profile: "enterprise", component: "grey" },
  { title: "Récupération de chaleur effluents", description: "Récupérer la chaleur des effluents chauds — réduit la pollution thermique.", savingsPercent: 3, priority: "low", category: "Énergie", profile: "enterprise", component: "grey" },

  // ── ENTERPRISE — Supply chain ──
  { title: "Objectifs fournisseurs", description: "Fixer des objectifs de réduction de l'empreinte eau avec vos fournisseurs (WFN: chaîne d'approvisionnement).", savingsPercent: 10, priority: "medium", category: "Supply Chain", profile: "enterprise", component: "green" },
  { title: "Transparence RSE", description: "Divulguer l'empreinte eau opérationnelle ET chaîne d'approvisionnement dans les rapports RSE.", savingsPercent: 0, priority: "medium", category: "Reporting", profile: "enterprise", component: "green" },

  // ── AGRICULTURE — Green ──
  { title: "Amélioration des rendements/ha", description: "Augmenter la productivité par hectare = même eau de pluie pour plus de production (WFN: réduire WF_vert).", savingsPercent: 15, priority: "high", category: "Rendement", profile: "agriculture", component: "green" },
  { title: "Paillage du sol (mulching)", description: "Réduire l'évaporation improductive du sol — conservation de l'eau verte.", savingsPercent: 10, priority: "medium", category: "Sol", profile: "agriculture", component: "green" },

  // ── AGRICULTURE — Blue ──
  { title: "Irrigation goutte-à-goutte", description: "Passer au goutte-à-goutte pour minimiser l'évaporation bleue et les flux de retour perdus.", savingsPercent: 25, priority: "high", category: "Irrigation", profile: "agriculture", component: "blue" },
  { title: "Irrigation déficitaire", description: "Appliquer un stress hydrique contrôlé pour réduire la consommation bleue sans perte significative de rendement.", savingsPercent: 15, priority: "medium", category: "Irrigation", profile: "agriculture", component: "blue" },
  { title: "Variété adaptée au climat", description: "Choisir des variétés cultivars mieux adaptées au climat local pour réduire les besoins en irrigation.", savingsPercent: 10, priority: "medium", category: "Sélection", profile: "agriculture", component: "blue" },

  // ── AGRICULTURE — Grey ──
  { title: "Réduction engrais/pesticides", description: "Réduire les intrants chimiques artificiels — réduit la fraction de lixiviation α (WF_gris = α×Application/(Cmax-Cnat)).", savingsPercent: 20, priority: "high", category: "Pollution", profile: "agriculture", component: "grey" },
  { title: "Agriculture biologique", description: "Passer au bio pour éliminer les polluants de synthèse et réduire drastiquement l'empreinte grise.", savingsPercent: 30, priority: "high", category: "Conversion", profile: "agriculture", component: "grey" },

  // ── CONSUMER ──
  { title: "Réduire la consommation de viande", description: "Impact maximal : le bœuf = 15 400 L/kg vs légumineuses ~4 000 L/kg (WFN: priorité haute consommateur).", savingsPercent: 25, priority: "high", category: "Alimentation", profile: "consumer", component: "green" },
  { title: "Produits hors zones de stress", description: "Choisir des produits dont la production est hors des zones de stress hydrique (WSI < 2).", savingsPercent: 10, priority: "medium", category: "Consommation", profile: "consumer", component: "blue" },
  { title: "Privilégier les fibres à faible WF", description: "Remplacer le coton (8 200 L/kg) par du lin (1 500 L/kg) ou polyester recyclé.", savingsPercent: 8, priority: "medium", category: "Textile", profile: "consumer", component: "green" },
  { title: "Réduire le gaspillage alimentaire", description: "Chaque kg de nourriture gaspillé = son empreinte eau complète perdue.", savingsPercent: 5, priority: "low", category: "Alimentation", profile: "consumer", component: "green" },
];

interface WaterBreakdown {
  blue: number;
  green: number;
  grey: number;
}

export function detectProfile(sector?: string | null): UserProfile {
  if (!sector) return "enterprise";
  const s = sector.toLowerCase();
  if (s.includes("agri") || s.includes("élevage") || s.includes("ferme")) return "agriculture";
  if (s.includes("consomm") || s.includes("particulier")) return "consumer";
  return "enterprise";
}

export function getDominantComponent(breakdown: WaterBreakdown): WaterComponent {
  const { blue, green, grey } = breakdown;
  if (green >= blue && green >= grey) return "green";
  if (grey >= blue && grey >= green) return "grey";
  return "blue";
}

export function generateProfileRecommendations(
  totalM3: number,
  breakdown: WaterBreakdown,
  profile: UserProfile,
): WFRecommendation[] {
  const dominant = getDominantComponent(breakdown);

  // Filter: match profile, prioritize dominant component
  const matching = RECS_DB
    .filter(r => r.profile === profile)
    .sort((a, b) => {
      // Dominant component first
      const aMatch = a.component === dominant ? 0 : 1;
      const bMatch = b.component === dominant ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      // Then by priority
      const prio = { high: 0, medium: 1, low: 2 };
      return prio[a.priority] - prio[b.priority];
    });

  // Only relevant recs based on volume thresholds
  return matching
    .filter(r => {
      if (totalM3 < 50 && r.savingsPercent > 20) return true; // always show high impact
      if (totalM3 < 100 && r.priority === "low") return false;
      return true;
    })
    .map((r, i) => ({
      ...r,
      id: i + 1,
    }));
}
