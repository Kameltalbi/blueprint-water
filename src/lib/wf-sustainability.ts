/**
 * Water Footprint Sustainability Analysis (WFN Manual)
 * 
 * Monthly hotspot detection:
 * - Water Scarcity (WS_blue) = ΣWF_blue / WA_blue
 * - Water Pollution Level (WPL) = ΣWF_grey / R_act
 * 
 * Grey water formula:
 * - WF_grey = L / (Cmax - Cnat)  where L = Ceff × V_eff
 * - Retain ONLY the critical pollutant (highest WF_grey)
 */

export interface MonthlyHotspot {
  month: string;
  blue: number;
  green: number;
  grey: number;
  wsBlue: number;    // Water Scarcity index (>1 = hotspot)
  wpl: number;       // Water Pollution Level (>1 = hotspot)
  isHotspot: boolean;
  hotspotType: ("scarcity" | "pollution")[];
}

export interface GreyWaterCalc {
  pollutant: string;
  cEff: number;       // concentration in effluent (mg/L)
  cMax: number;       // max acceptable (mg/L)
  cNat: number;       // natural concentration (mg/L)
  volumeEffluent: number; // m³
  loadKg: number;     // L = Ceff × V_eff / 1000
  wfGrey: number;     // m³
}

// Default reference values per WSI zone (m³/month available blue water per unit)
// These are simplified reference benchmarks for enterprise-level analysis
function getMonthlyBlueAvailability(wsi: number, totalBlueAnnual: number): number {
  // Higher WSI = less available water relative to demand
  // WA_blue approximated from WSI: if WSI=1 → WA ≈ demand, WSI>1 → WA < demand
  const monthlyDemand = totalBlueAnnual / 12;
  if (wsi <= 0) return monthlyDemand * 10; // unlimited
  return monthlyDemand / wsi;
}

function getMonthlyRunoff(wsi: number, totalGreyAnnual: number): number {
  const monthlyGrey = totalGreyAnnual / 12;
  if (wsi <= 0) return monthlyGrey * 10;
  // In stressed areas, assimilative capacity is lower
  return monthlyGrey / (wsi * 0.5);
}

export function computeMonthlyHotspots(
  monthlyData: { month: string; blue: number; green: number; grey: number }[],
  wsi: number,
): MonthlyHotspot[] {
  const totalBlue = monthlyData.reduce((s, m) => s + m.blue, 0);
  const totalGrey = monthlyData.reduce((s, m) => s + m.grey, 0);

  return monthlyData.map(m => {
    const waBlue = getMonthlyBlueAvailability(wsi, totalBlue);
    const runoff = getMonthlyRunoff(wsi, totalGrey);

    const wsBlue = waBlue > 0 ? m.blue / waBlue : 0;
    const wpl = runoff > 0 ? m.grey / runoff : 0;

    const hotspotType: ("scarcity" | "pollution")[] = [];
    if (wsBlue > 1) hotspotType.push("scarcity");
    if (wpl > 1) hotspotType.push("pollution");

    return {
      ...m,
      wsBlue: Math.round(wsBlue * 100) / 100,
      wpl: Math.round(wpl * 100) / 100,
      isHotspot: hotspotType.length > 0,
      hotspotType,
    };
  });
}

/**
 * Precise grey water calculation per pollutant
 * WF_grey = L / (Cmax - Cnat)
 * where L = Ceff × V_effluent (converted to m³)
 * Returns only the CRITICAL pollutant (highest WF_grey) per WFN rules
 */
export function computeGreyWater(
  pollutants: { name: string; cEff: number; cMax: number; cNat: number }[],
  volumeEffluentM3: number,
): GreyWaterCalc | null {
  if (!pollutants.length || volumeEffluentM3 <= 0) return null;

  const results: GreyWaterCalc[] = pollutants
    .filter(p => p.cMax > p.cNat && p.cEff > 0)
    .map(p => {
      const loadKg = (p.cEff * volumeEffluentM3) / 1000; // mg/L × m³ / 1000 = kg
      const wfGrey = (p.cEff * volumeEffluentM3) / (p.cMax - p.cNat); // m³
      return {
        pollutant: p.name,
        cEff: p.cEff,
        cMax: p.cMax,
        cNat: p.cNat,
        volumeEffluent: volumeEffluentM3,
        loadKg: Math.round(loadKg * 100) / 100,
        wfGrey: Math.round(wfGrey * 100) / 100,
      };
    });

  if (!results.length) return null;

  // WFN Rule: retain ONLY the critical pollutant (highest WF_grey)
  return results.reduce((max, r) => r.wfGrey > max.wfGrey ? r : max);
}

/** Sustainability assessment summary */
export interface SustainabilityAssessment {
  hotspots: MonthlyHotspot[];
  hotspotCount: number;
  maxWsBlue: number;
  maxWpl: number;
  overallStatus: "sustainable" | "moderate" | "unsustainable";
  alerts: string[];
}

export function assessSustainability(
  monthlyData: { month: string; blue: number; green: number; grey: number }[],
  wsi: number,
  usesGroundwater?: boolean,
): SustainabilityAssessment {
  const hotspots = computeMonthlyHotspots(monthlyData, wsi);
  const hotspotCount = hotspots.filter(h => h.isHotspot).length;
  const maxWsBlue = Math.max(...hotspots.map(h => h.wsBlue), 0);
  const maxWpl = Math.max(...hotspots.map(h => h.wpl), 0);

  const alerts: string[] = [];

  if (usesGroundwater) {
    alerts.push("⚠️ Utilisation d'eaux souterraines fossiles détectée — TOUJOURS considéré comme insoutenable (WFN Manual).");
  }

  if (hotspotCount > 0) {
    alerts.push(`🔴 ${hotspotCount} mois identifié(s) comme hotspot(s) de stress hydrique.`);
  }

  if (maxWsBlue > 1.5) {
    alerts.push("🔴 Pénurie bleue critique : la demande dépasse largement la disponibilité dans cette zone.");
  } else if (maxWsBlue > 1) {
    alerts.push("🟡 Pénurie bleue modérée : la demande approche la capacité disponible.");
  }

  if (maxWpl > 1) {
    alerts.push("🔴 Niveau de pollution élevé : la capacité d'assimilation du milieu est dépassée.");
  }

  let overallStatus: "sustainable" | "moderate" | "unsustainable" = "sustainable";
  if (usesGroundwater || maxWsBlue > 1.5 || maxWpl > 1.5) overallStatus = "unsustainable";
  else if (maxWsBlue > 0.8 || maxWpl > 0.8 || hotspotCount > 2) overallStatus = "moderate";

  return { hotspots, hotspotCount, maxWsBlue, maxWpl, overallStatus, alerts };
}

/** WFN Manual disclaimer */
export const WFN_DISCLAIMER = [
  "L'empreinte eau ne traite PAS des inondations ni de l'accès à l'eau potable.",
  "L'empreinte eau NE REMPLACE PAS une évaluation complète des risques (climat, biodiversité, sols).",
  "Les résultats doivent être combinés avec d'autres indicateurs environnementaux avant toute décision.",
  "L'offsetting est un dernier recours — toujours réduire au maximum avant de compenser.",
  "Ne jamais évaluer la pénurie hydrique uniquement sur base annuelle (WFN: analyse mensuelle requise).",
];
