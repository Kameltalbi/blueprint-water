/**
 * Org profile — persisted in localStorage.
 * Captures sector, governorate, functional unit from onboarding.
 */

export interface OrgProfile {
  sector: string;
  governorate: string;
  country: string;
  functionalUnit: string;
  functionalUnitQty: string;
}

const LS_KEY = "hs_org_profile";

export function loadOrgProfile(): OrgProfile {
  try {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? JSON.parse(stored) : emptyProfile();
  } catch {
    return emptyProfile();
  }
}

export function saveOrgProfile(p: Partial<OrgProfile>) {
  const current = loadOrgProfile();
  localStorage.setItem(LS_KEY, JSON.stringify({ ...current, ...p }));
}

export function emptyProfile(): OrgProfile {
  return { sector: "", governorate: "", country: "Tunisie", functionalUnit: "", functionalUnitQty: "" };
}

export const SECTORS = [
  "Agro-alimentaire",
  "Textile & habillement",
  "Industrie chimique",
  "Phosphate & mines",
  "BTP & matériaux",
  "Huile d'olive & olives",
  "Pêche & aquaculture",
  "Tourisme & hôtellerie",
  "Agriculture & irrigation",
  "Papier & carton",
  "Mécanique & métallurgie",
  "Services & bureau",
  "Autre",
];

export const GOVERNORATES_TN = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa",
  "Jendouba", "Kairouan", "Kasserine", "Kébili", "Le Kef",
  "Mahdia", "La Manouba", "Médenine", "Monastir", "Nabeul",
  "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine",
  "Tozeur", "Tunis", "Zaghouan",
];

/** WSI (0–5) per Tunisian governorate based on CRDA/AWARE data */
export const wsiByGovernorate: Record<string, number> = {
  "Ariana": 4.0, "Béja": 3.8, "Ben Arous": 4.0, "Bizerte": 3.7,
  "Gabès": 4.7, "Gafsa": 4.9, "Jendouba": 3.6, "Kairouan": 4.5,
  "Kasserine": 4.3, "Kébili": 4.9, "Le Kef": 3.7, "Mahdia": 4.4,
  "La Manouba": 4.0, "Médenine": 4.8, "Monastir": 4.4, "Nabeul": 4.2,
  "Sfax": 4.8, "Sidi Bouzid": 4.6, "Siliana": 3.9, "Sousse": 4.3,
  "Tataouine": 4.9, "Tozeur": 4.9, "Tunis": 4.0, "Zaghouan": 4.1,
};
