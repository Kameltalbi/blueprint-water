import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  materials,
  materialCategories,
  wsiByCountry,
  countryOptions,
  getEquivalents,
} from "@/lib/water-data";

/* ── Data ── */
const sectorOptions = [
  { value: "agriculture", label: "🌾 Agriculture" },
  { value: "agroalimentaire", label: "🍔 Agroalimentaire" },
  { value: "textile", label: "🧵 Textile & Mode" },
  { value: "energie", label: "⚡ Énergie" },
  { value: "industrie", label: "⚙️ Industrie lourde" },
  { value: "pharma", label: "💊 Pharmacie" },
  { value: "electronique", label: "💻 Électronique" },
  { value: "automobile", label: "🚗 Automobile" },
  { value: "btp", label: "🏗️ BTP & Matériaux" },
  { value: "hotellerie", label: "🏨 Hôtellerie & Tourisme" },
  { value: "distribution", label: "🛒 Distribution" },
  { value: "collectivites", label: "🏫 Collectivités" },
];

const steps = [
  { num: 1, labelFr: "Votre activité", descFr: "Secteur, produit, volume", labelEn: "Your activity", descEn: "Sector, product, volume" },
  { num: 2, labelFr: "Matières premières", descFr: "Eau verte — fibres & ingrédients", labelEn: "Raw materials", descEn: "Green water — fibers & ingredients" },
  { num: 3, labelFr: "Processus industriels", descFr: "Eau bleue — consommation directe", labelEn: "Industrial processes", descEn: "Blue water — direct consumption" },
  { num: 4, labelFr: "Effluents & pollution", descFr: "Eau grise — impact normatif", labelEn: "Effluents & pollution", descEn: "Grey water — regulatory impact" },
  { num: 5, labelFr: "Résultats & Rapport", descFr: "Analyse + recommandations WSI", labelEn: "Results & Report", descEn: "Analysis + WSI recommendations" },
];

const defaultPollutants = [
  { name: "DQO (Colorants)", ceff: "", cnat: "0", cmax: "90" },
  { name: "DBO₅ (Détergents)", ceff: "", cnat: "0", cmax: "30" },
  { name: "Métaux lourds", ceff: "", cnat: "0", cmax: "0.5" },
];

/* ── Component ── */
export function CalculatorSection() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [matCategory, setMatCategory] = useState("");

  const [step, setStep] = useState(0);

  // Step 1
  const [sector, setSector] = useState("");
  const [product, setProduct] = useState("");
  const [volume, setVolume] = useState("");
  const [unit, setUnit] = useState("kg");
  const [country, setCountry] = useState("tunisie");

  // Step 2
  const [mat1, setMat1] = useState("");
  const [mat1Qty, setMat1Qty] = useState("");
  const [mat2, setMat2] = useState("");
  const [mat2Qty, setMat2Qty] = useState("");

  // Step 3
  const [blueNetwork, setBlueNetwork] = useState("");
  const [blueWell, setBlueWell] = useState("");
  const [blueProcess, setBlueProcess] = useState("");
  const [blueSteam, setBlueSteam] = useState("");
  const [blueReturned, setBlueReturned] = useState("");
  const [blueRecycled, setBlueRecycled] = useState("");

  // Step 4
  const [effluentVol, setEffluentVol] = useState("");
  const [pollutants, setPollutants] = useState(defaultPollutants);

  // Filtered materials by category
  const filteredMaterials = matCategory
    ? materials.filter((m) => m.category === matCategory)
    : materials;

  const mat1Coeff = materials.find((m) => m.value === mat1)?.coeff ?? 0;
  const mat2Coeff = materials.find((m) => m.value === mat2)?.coeff ?? 0;

  // WSI factor
  const countryKey = country.toLowerCase().replace(/[\s'é]/g, (c) => c === "é" ? "e" : c === " " ? "_" : "");
  const wsiData = wsiByCountry[countryKey] || wsiByCountry["autre"];
  const wsiFactor = wsiData.wsi;

  const greenWater = useMemo(() => {
    const q1 = parseFloat(mat1Qty) || 0;
    const q2 = parseFloat(mat2Qty) || 0;
    return Math.round((q1 * mat1Coeff + q2 * mat2Coeff) / 1000);
  }, [mat1Qty, mat1Coeff, mat2Qty, mat2Coeff]);

  const blueWater = useMemo(() => {
    const vals = [blueNetwork, blueWell, blueProcess, blueSteam].map((v) => parseFloat(v) || 0);
    const deductions = [blueReturned, blueRecycled].map((v) => parseFloat(v) || 0);
    return Math.round(vals.reduce((a, b) => a + b, 0) - deductions.reduce((a, b) => a + b, 0));
  }, [blueNetwork, blueWell, blueProcess, blueSteam, blueReturned, blueRecycled]);

  const greyWater = useMemo(() => {
    const vol = parseFloat(effluentVol) || 0;
    let maxGrey = 0;
    pollutants.forEach((p) => {
      const ceff = parseFloat(p.ceff) || 0;
      const cnat = parseFloat(p.cnat) || 0;
      const cmax = parseFloat(p.cmax) || 1;
      if (cmax > cnat && ceff > 0) {
        const eg = (vol * (ceff - cnat)) / (cmax - cnat);
        if (eg > maxGrey) maxGrey = eg;
      }
    });
    return Math.round(maxGrey);
  }, [effluentVol, pollutants]);

  const total = greenWater + blueWater + greyWater;
  const totalWeighted = Math.round(total * (wsiFactor / 2)); // WSI-weighted
  const vol = parseFloat(volume) || 1;
  const perUnit = total > 0 ? Math.round((total * 1000) / vol) : 0;

  const equivalents = useMemo(() => getEquivalents(total, fr), [total, fr]);

  const getScore = () => {
    const adjusted = perUnit * (wsiFactor / 2);
    if (adjusted < 500) return { grade: "A", color: "bg-emerald-100 text-emerald-700", label: fr ? "Excellent — performance exemplaire" : "Excellent — exemplary performance" };
    if (adjusted < 2000) return { grade: "B", color: "bg-sky-100 text-primary", label: fr ? "Bon — supérieur à la moyenne sectorielle" : "Good — above sector average" };
    if (adjusted < 5000) return { grade: "C", color: "bg-amber-100 text-amber-700", label: fr ? "Moyen — potentiel d'amélioration significatif" : "Average — significant improvement potential" };
    return { grade: "D", color: "bg-red-100 text-destructive", label: fr ? "Critique — action urgente recommandée" : "Critical — urgent action recommended" };
  };
  const score = getScore();

  const alerts = useMemo(() => {
    const a: { title: string; desc: string }[] = [];
    // WSI alert
    if (wsiFactor >= 3.5) {
      a.push({
        title: fr ? "🌍 Zone de stress hydrique extrême" : "🌍 Extreme water stress zone",
        desc: fr
          ? `Indice WSI de ${wsiFactor}/5 — chaque litre économisé a un impact ${Math.round(wsiFactor / 1.5)}× supérieur ici`
          : `WSI index ${wsiFactor}/5 — every liter saved has ${Math.round(wsiFactor / 1.5)}× more impact here`,
      });
    }
    pollutants.forEach((p) => {
      const ceff = parseFloat(p.ceff) || 0;
      const cmax = parseFloat(p.cmax) || 0;
      if (ceff > cmax && cmax > 0) {
        a.push({
          title: `⚠️ ${p.name}`,
          desc: fr ? `Concentration (${ceff} mg/L) dépasse la norme (${cmax} mg/L)` : `Concentration (${ceff} mg/L) exceeds norm (${cmax} mg/L)`,
        });
      }
    });
    return a;
  }, [pollutants, fr, wsiFactor]);

  const recos = useMemo(() => {
    const r: { icon: string; title: string; desc: string; level: string }[] = [];
    if (greenWater > blueWater && greenWater > 0) r.push({ icon: "🌱", title: fr ? "Fibres alternatives" : "Alternative fibers", desc: fr ? "Substituez par des matières à faible empreinte (lin, recyclé)" : "Switch to low-footprint materials (linen, recycled)", level: "high" });
    if (blueWater > 500) r.push({ icon: "♻️", title: fr ? "Recyclage des eaux de process" : "Process water recycling", desc: fr ? "Réutilisez les eaux de rinçage et de refroidissement" : "Reuse rinse and cooling water", level: "medium" });
    if (greyWater > 200) r.push({ icon: "🧪", title: fr ? "Optimisation du traitement" : "Treatment optimization", desc: fr ? "Améliorez le traitement des effluents avant rejet" : "Improve effluent treatment before discharge", level: "low" });
    if (wsiFactor >= 3) r.push({ icon: "💧", title: fr ? "Récupération des eaux pluviales" : "Rainwater harvesting", desc: fr ? "Captez et stockez l'eau de pluie pour les processus non-critiques" : "Capture rainwater for non-critical processes", level: "high" });
    if (r.length === 0) r.push({ icon: "✅", title: fr ? "Bonne performance" : "Good performance", desc: fr ? "Continuez à surveiller vos indicateurs" : "Keep monitoring your indicators", level: "low" });
    return r;
  }, [greenWater, blueWater, greyWater, fr, wsiFactor]);

  const restart = () => {
    setStep(0);
    setSector(""); setProduct(""); setVolume(""); setUnit("kg"); setCountry("tunisie");
    setMat1(""); setMat1Qty(""); setMat2(""); setMat2Qty(""); setMatCategory("");
    setBlueNetwork(""); setBlueWell(""); setBlueProcess(""); setBlueSteam("");
    setBlueReturned(""); setBlueRecycled("");
    setEffluentVol(""); setPollutants(defaultPollutants);
  };

  const updatePollutant = (index: number, field: string, value: string) => {
    setPollutants((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const fmt = (n: number) => n.toLocaleString("fr-FR");

  return (
    <section id="calculateur" className="py-24 px-[5%] bg-card">
      <div className="mx-auto max-w-[1160px]">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] items-start">
          {/* Left info */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 text-green-water text-xs font-bold px-4 py-1 mb-5">
              <span>✦</span> {fr ? "100 % Gratuit · Sans inscription" : "100% Free · No signup"}
            </div>
            <h2 className="font-display text-[2.1rem] font-extrabold text-foreground leading-tight mb-3">
              {fr ? "Calculateur" : "Water Footprint"}
              <br />
              {fr ? "d'Empreinte Eau" : "Calculator"}
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              {fr
                ? "Obtenez votre analyse complète Eau Verte / Bleue / Grise en 4 étapes avec pondération WSI locale."
                : "Get your complete Green / Blue / Grey Water analysis in 4 steps with local WSI weighting."}
            </p>
            <div className="flex items-center gap-2 text-xs bg-primary/5 border border-primary/10 rounded-lg p-3 mb-8">
              <span className="text-lg">🗂️</span>
              <span className="text-muted-foreground">
                {fr ? `${materials.length} matériaux · Sources WFN & Ecoinvent · ${Object.keys(wsiByCountry).length} pays WSI` : `${materials.length} materials · WFN & Ecoinvent sources · ${Object.keys(wsiByCountry).length} WSI countries`}
              </span>
            </div>

            <div className="flex flex-col">
              {steps.map((s, i) => (
                <div
                  key={s.num}
                  className={`flex gap-4 items-start py-3.5 ${i < steps.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold border ${
                    step === i
                      ? "gradient-water text-primary-foreground border-transparent"
                      : step > i
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-background border-border text-muted-foreground"
                  }`}>
                    {step > i ? "✓" : s.num}
                  </div>
                  <div>
                    <strong className={`text-sm block ${step === i ? "text-primary" : "text-foreground"}`}>
                      {fr ? s.labelFr : s.labelEn}
                    </strong>
                    <span className="text-xs text-muted-foreground">{fr ? s.descFr : s.descEn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div className="landing-form-card">
            {/* Progress bar */}
            <div className="flex gap-1.5 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`landing-prog-seg ${step > i ? "done" : step === i ? "active" : ""}`}
                />
              ))}
            </div>

            {/* Step 1 */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  🏭 {fr ? "Votre activité" : "Your activity"} <span className="text-xs font-sans font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">1 / 4</span>
                </h3>
                <div className="landing-field">
                  <label>{fr ? "Secteur d'activité" : "Industry sector"} *</label>
                  <select value={sector} onChange={(e) => setSector(e.target.value)}>
                    <option value="">{fr ? "— Sélectionnez votre secteur —" : "— Select your sector —"}</option>
                    {sectorOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="landing-field">
                  <label>{fr ? "Produit ou activité analysé(e)" : "Product or activity analyzed"} *</label>
                  <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder={fr ? "ex: T-shirt coton, Fromage, Ciment..." : "e.g. Cotton t-shirt, Cheese, Cement..."} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="landing-field">
                    <label>{fr ? "Volume de production / an" : "Production volume / year"} *</label>
                    <input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="ex: 50000" />
                  </div>
                  <div className="landing-field">
                    <label>{fr ? "Unité" : "Unit"}</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                      <option value="units">{fr ? "Unités" : "Units"}</option>
                      <option value="kg">{fr ? "Kilogrammes" : "Kilograms"}</option>
                      <option value="tonnes">Tonnes</option>
                      <option value="litres">{fr ? "Litres" : "Liters"}</option>
                      <option value="m2">m²</option>
                    </select>
                  </div>
                </div>
                <div className="landing-field">
                  <label>{fr ? "Pays de production" : "Production country"} *</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    {countryOptions.map((c) => (
                      <option key={c} value={c.toLowerCase().replace(/[\s'é]/g, (ch) => ch === "é" ? "e" : ch === " " ? "_" : "")}>{c}</option>
                    ))}
                  </select>
                </div>
                {/* WSI indicator */}
                <div className={`flex items-center gap-3 rounded-lg p-3 text-xs border ${
                  wsiFactor >= 3.5 ? "bg-red-50 border-red-200 text-destructive" :
                  wsiFactor >= 2.5 ? "bg-amber-50 border-amber-200 text-amber-700" :
                  "bg-emerald-50 border-emerald-200 text-green-water"
                }`}>
                  <span className="text-lg">💧</span>
                  <div>
                    <strong>WSI {wsiFactor}/5</strong> — {fr ? wsiData.label : wsiData.labelEn}
                    <span className="block text-[0.65rem] opacity-75">{fr ? "Source : Aqueduct / World Resources Institute" : "Source: Aqueduct / World Resources Institute"}</span>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => setStep(1)} disabled={!sector || !volume} className="flex-1 gradient-water text-primary-foreground rounded-lg py-3 font-semibold text-sm disabled:opacity-40 transition-all hover:opacity-90">
                    {fr ? "Étape suivante →" : "Next step →"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  🟢 {fr ? "Eau Verte — Matières premières" : "Green Water — Raw materials"} <span className="text-xs font-sans font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">2 / 4</span>
                </h3>
                <p className="text-xs text-muted-foreground bg-primary/5 border border-primary/10 rounded-lg p-3">
                  {fr ? `${materials.length} matériaux disponibles · Coefficients WFN & Ecoinvent appliqués automatiquement.` : `${materials.length} materials available · WFN & Ecoinvent coefficients applied automatically.`}
                </p>
                {/* Category filter */}
                <div className="landing-field">
                  <label>{fr ? "Filtrer par catégorie" : "Filter by category"}</label>
                  <select value={matCategory} onChange={(e) => setMatCategory(e.target.value)}>
                    <option value="">{fr ? "— Tous les matériaux —" : "— All materials —"}</option>
                    {materialCategories.map((c) => <option key={c.value} value={c.value}>{fr ? c.label : c.labelEn}</option>)}
                  </select>
                </div>
                <div className="landing-field">
                  <label>{fr ? "Matière principale" : "Main material"} *</label>
                  <select value={mat1} onChange={(e) => setMat1(e.target.value)}>
                    <option value="">{fr ? "— Sélectionnez —" : "— Select —"}</option>
                    {filteredMaterials.map((m) => <option key={m.value} value={m.value}>{m.label} ({fmt(m.coeff)} L/kg) · {m.source}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="landing-field">
                    <label>{fr ? "Quantité (kg/an)" : "Quantity (kg/year)"} *</label>
                    <input type="number" value={mat1Qty} onChange={(e) => setMat1Qty(e.target.value)} placeholder="ex: 10000" />
                  </div>
                  <div className="landing-field">
                    <label>{fr ? "Coeff. eau verte (L/kg)" : "Green water coeff. (L/kg)"}</label>
                    <input readOnly value={mat1Coeff ? fmt(mat1Coeff) : "—"} className="bg-muted/50" />
                  </div>
                </div>
                <div className="landing-field">
                  <label>{fr ? "Matière secondaire (optionnel)" : "Secondary material (optional)"}</label>
                  <select value={mat2} onChange={(e) => setMat2(e.target.value)}>
                    <option value="">{fr ? "— Aucune —" : "— None —"}</option>
                    {materials.map((m) => <option key={m.value} value={m.value}>{m.label} ({fmt(m.coeff)} L/kg)</option>)}
                  </select>
                </div>
                {mat2 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="landing-field">
                      <label>{fr ? "Quantité mat. secondaire (kg/an)" : "Secondary material qty (kg/year)"}</label>
                      <input type="number" value={mat2Qty} onChange={(e) => setMat2Qty(e.target.value)} />
                    </div>
                    <div className="landing-field">
                      <label>{fr ? "Coeff. (L/kg)" : "Coeff. (L/kg)"}</label>
                      <input readOnly value={mat2Coeff ? fmt(mat2Coeff) : "—"} className="bg-muted/50" />
                    </div>
                  </div>
                )}
                <div className="text-sm font-semibold text-primary mt-2">
                  💧 {fr ? "Eau Verte estimée" : "Estimated Green Water"} : {greenWater > 0 ? `${fmt(greenWater)} m³/an` : "— m³/an"}
                </div>
                <div className="flex justify-between gap-3 pt-2">
                  <button onClick={() => setStep(0)} className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:border-primary hover:text-primary transition-all">
                    ← {fr ? "Retour" : "Back"}
                  </button>
                  <button onClick={() => setStep(2)} className="flex-1 gradient-water text-primary-foreground rounded-lg py-2.5 font-semibold text-sm hover:opacity-90 transition-all">
                    {fr ? "Étape suivante →" : "Next step →"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  🔵 {fr ? "Eau Bleue — Processus industriels" : "Blue Water — Industrial processes"} <span className="text-xs font-sans font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">3 / 4</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  {fr ? "Consommation directe par poste. Eau recyclée/restituée = déduite automatiquement." : "Direct consumption per post. Recycled/returned water = deducted automatically."}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="landing-field">
                    <label>{fr ? "Eau réseau / ville (m³/an)" : "Network / city water (m³/year)"}</label>
                    <input type="number" value={blueNetwork} onChange={(e) => setBlueNetwork(e.target.value)} />
                  </div>
                  <div className="landing-field">
                    <label>{fr ? "Eau forage / puits (m³/an)" : "Well / borehole water (m³/year)"}</label>
                    <input type="number" value={blueWell} onChange={(e) => setBlueWell(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="landing-field">
                    <label>{fr ? "Processus principal (m³/an)" : "Main process (m³/year)"}</label>
                    <input type="number" value={blueProcess} onChange={(e) => setBlueProcess(e.target.value)} />
                  </div>
                  <div className="landing-field">
                    <label>{fr ? "Vapeur / chaudières (m³/an)" : "Steam / boilers (m³/year)"}</label>
                    <input type="number" value={blueSteam} onChange={(e) => setBlueSteam(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="landing-field">
                    <label>{fr ? "Eau restituée après traitement (m³/an)" : "Returned after treatment (m³/year)"}</label>
                    <input type="number" value={blueReturned} onChange={(e) => setBlueReturned(e.target.value)} />
                  </div>
                  <div className="landing-field">
                    <label>{fr ? "Eau recyclée en interne (m³/an)" : "Internally recycled water (m³/year)"}</label>
                    <input type="number" value={blueRecycled} onChange={(e) => setBlueRecycled(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-between gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:border-primary hover:text-primary transition-all">
                    ← {fr ? "Retour" : "Back"}
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 gradient-water text-primary-foreground rounded-lg py-2.5 font-semibold text-sm hover:opacity-90 transition-all">
                    {fr ? "Étape suivante →" : "Next step →"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  ⚫ {fr ? "Eau Grise — Effluents" : "Grey Water — Effluents"} <span className="text-xs font-sans font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">4 / 4</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  {fr ? "Résultats d'analyses laboratoire. Normes pré-remplies selon votre pays." : "Lab analysis results. Norms pre-filled per country."}
                </p>
                <div className="landing-field">
                  <label>{fr ? "Volume total effluents rejetés (m³/an)" : "Total effluents discharged (m³/year)"}</label>
                  <input type="number" value={effluentVol} onChange={(e) => setEffluentVol(e.target.value)} placeholder="ex: 5000" />
                </div>

                <div className="grid gap-1.5 text-xs font-semibold text-muted-foreground" style={{ gridTemplateColumns: "1.6fr 1fr 1fr 1fr" }}>
                  <span>{fr ? "Polluant" : "Pollutant"}</span>
                  <span>Ceff (mg/L)</span>
                  <span>Cnat</span>
                  <span>{fr ? "Norme max" : "Max norm"}</span>
                </div>
                {pollutants.map((p, i) => (
                  <div key={i} className="landing-poll-row">
                    <label>{p.name}</label>
                    <input type="number" value={p.ceff} onChange={(e) => updatePollutant(i, "ceff", e.target.value)} placeholder="0" />
                    <input className="norm-input" value={p.cnat} readOnly />
                    <input className="norm-input" value={p.cmax} readOnly />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground italic">
                  {fr ? "Cases jaunes = valeurs normatives pré-remplies. Modifiez selon votre pays." : "Yellow cells = pre-filled norms. Modify per country."}
                </p>
                <div className="flex justify-between gap-3 pt-2">
                  <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:border-primary hover:text-primary transition-all">
                    ← {fr ? "Retour" : "Back"}
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 rounded-lg py-2.5 font-semibold text-sm text-primary-foreground hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(135deg, #059669, hsl(163 100% 39%))" }}
                  >
                    🔍 {fr ? "Calculer mon empreinte" : "Calculate my footprint"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5 — Results */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="font-display text-xl font-bold">📊 {fr ? "Votre Empreinte Eau" : "Your Water Footprint"}</h3>
                <p className="text-xs text-muted-foreground">{fr ? "Résultats selon ISO 14046 — pondérés par l'indice WSI local" : "Results per ISO 14046 — weighted by local WSI index"}</p>

                {/* 3 cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="landing-rcard green">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-water mb-1">🟢 {fr ? "Eau Verte" : "Green"}</p>
                    <span className="font-display text-2xl font-bold block">{fmt(greenWater)}</span>
                    <span className="text-xs text-muted-foreground">m³/an</span>
                  </div>
                  <div className="landing-rcard blue">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-primary mb-1">🔵 {fr ? "Eau Bleue" : "Blue"}</p>
                    <span className="font-display text-2xl font-bold block">{fmt(blueWater)}</span>
                    <span className="text-xs text-muted-foreground">m³/an</span>
                  </div>
                  <div className="landing-rcard grey">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-grey-water mb-1">⚫ {fr ? "Eau Grise" : "Grey"}</p>
                    <span className="font-display text-2xl font-bold block">{fmt(greyWater)}</span>
                    <span className="text-xs text-muted-foreground">m³/an</span>
                  </div>
                </div>

                {/* Total bar */}
                <div className="gradient-water rounded-xl p-5 flex justify-between items-center flex-wrap gap-4 text-primary-foreground">
                  <div>
                    <p className="text-xs opacity-80">{fr ? "Empreinte Eau Totale" : "Total Water Footprint"}</p>
                    <span className="font-display text-4xl font-extrabold">{fmt(total)}</span>
                    <span className="text-sm opacity-75 ml-1">m³ / an</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">{fr ? "Par unité produite" : "Per unit produced"}</p>
                    <span className="font-display text-2xl font-bold">{fmt(perUnit)}</span>
                    <span className="text-sm opacity-75 ml-1">L / {unit}</span>
                  </div>
                </div>

                {/* WSI weighted impact */}
                <div className={`rounded-xl p-4 border ${wsiFactor >= 3.5 ? "bg-red-50 border-red-200" : wsiFactor >= 2.5 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold">{fr ? "Impact pondéré WSI" : "WSI-weighted impact"}</p>
                      <span className="font-display text-xl font-bold">{fmt(totalWeighted)} m³<sub>eq</sub></span>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>WSI × {wsiFactor}</p>
                      <p>{fr ? wsiData.label : wsiData.labelEn}</p>
                    </div>
                  </div>
                </div>

                {/* Concrete equivalents */}
                <div className="grid grid-cols-2 gap-3">
                  {equivalents.map((eq, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                      <span className="text-2xl">{eq.icon}</span>
                      <div>
                        <span className="font-display text-lg font-bold block leading-tight">{eq.value}</span>
                        <span className="text-[0.65rem] text-muted-foreground">{eq.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Score */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-display text-3xl font-extrabold ${score.color}`}>
                    {score.grade}
                  </div>
                  <div>
                    <strong className="text-sm">{fr ? "Score de performance (ajusté WSI)" : "Performance score (WSI-adjusted)"}</strong>
                    <span className="text-xs text-muted-foreground block">{score.label}</span>
                  </div>
                </div>

                {/* Alerts */}
                {alerts.length > 0 && alerts.map((a, i) => (
                  <div key={i} className="bg-red-50 border border-red-200 border-l-[3px] border-l-destructive rounded-lg p-3 text-xs">
                    <strong className="text-destructive block mb-0.5">{a.title}</strong>
                    {a.desc}
                  </div>
                ))}

                {/* Recommendations */}
                <p className="text-sm font-bold mt-4">💡 {fr ? "Recommandations prioritaires" : "Priority recommendations"}</p>
                {recos.map((r, i) => (
                  <div key={i} className={`landing-reco ${r.level}`}>
                    <span className="text-base flex-shrink-0">{r.icon}</span>
                    <div>
                      <strong className="text-xs text-foreground block">{r.title}</strong>
                      <span className="text-xs text-muted-foreground">{r.desc}</span>
                    </div>
                  </div>
                ))}

                {/* Actions */}
                <div className="flex gap-3 flex-wrap justify-center pt-4">
                  {user && (
                    <button
                      onClick={async () => {
                        setSaving(true);
                        const { error } = await supabase.from("calculator_results" as any).insert({
                          user_id: user.id,
                          sector,
                          product,
                          volume: parseFloat(volume) || 0,
                          unit,
                          country,
                          green_water: greenWater,
                          blue_water: blueWater,
                          grey_water: greyWater,
                          total,
                          per_unit: perUnit,
                          score: score.grade,
                        });
                        setSaving(false);
                        if (error) toast.error(fr ? "Erreur lors de la sauvegarde" : "Error saving results");
                        else toast.success(fr ? "Résultats sauvegardés !" : "Results saved!");
                      }}
                      disabled={saving}
                      className="px-5 py-2.5 rounded-lg gradient-water text-primary-foreground text-xs font-semibold flex items-center gap-1.5"
                    >
                      {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                      💾 {fr ? "Sauvegarder" : "Save"}
                    </button>
                  )}
                  <button className="px-5 py-2.5 rounded-lg border border-primary text-primary text-xs font-semibold">
                    📄 {fr ? "Rapport complet (Pro)" : "Full report (Pro)"}
                  </button>
                  <button onClick={() => window.print()} className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground text-xs font-semibold">
                    🖨️ {fr ? "Imprimer" : "Print"}
                  </button>
                </div>
                <button onClick={restart} className="block w-full text-center text-xs text-muted-foreground underline hover:text-primary mt-2">
                  ↺ {fr ? "Nouveau calcul" : "New calculation"}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
