import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  { value: "agriculture",    labelFr: "🌾 Agriculture",         labelEn: "🌾 Agriculture",        labelAr: "🌾 زراعة" },
  { value: "agroalimentaire",labelFr: "🍔 Agroalimentaire",    labelEn: "🍔 Food Processing",    labelAr: "🍔 صناعة غذائية" },
  { value: "textile",        labelFr: "🧵 Textile & Mode",     labelEn: "🧵 Textile & Fashion",  labelAr: "🧵 نسيج وموضة" },
  { value: "energie",        labelFr: "⚡ Énergie",              labelEn: "⚡ Energy",               labelAr: "⚡ طاقة" },
  { value: "industrie",      labelFr: "⚙️ Industrie lourde",   labelEn: "⚙️ Heavy Industry",     labelAr: "⚙️ صناعة ثقيلة" },
  { value: "pharma",         labelFr: "💊 Pharmacie",           labelEn: "💊 Pharma",              labelAr: "💊 صيدلة" },
  { value: "electronique",   labelFr: "💻 Électronique",       labelEn: "💻 Electronics",         labelAr: "💻 إلكترونيات" },
  { value: "automobile",     labelFr: "🚗 Automobile",          labelEn: "🚗 Automotive",           labelAr: "🚗 سيارات" },
  { value: "btp",            labelFr: "🏗️ BTP & Matériaux",  labelEn: "🏗️ Construction",      labelAr: "🏗️ بناء ومواد" },
  { value: "hotellerie",     labelFr: "🏨 Hôtellerie & Tourisme",labelEn: "🏨 Hospitality",         labelAr: "🏨 ضيافة" },
  { value: "distribution",   labelFr: "🛒 Distribution",       labelEn: "🛒 Retail",               labelAr: "🛒 توزيع" },
  { value: "collectivites",  labelFr: "🏫 Collectivités",      labelEn: "🏫 Public Sector",       labelAr: "🏫 قطاع عام" },
];

const steps = [
  { num: 1, labelFr: "Votre activité", descFr: "Secteur, produit, volume", labelEn: "Your activity", descEn: "Sector, product, volume", labelAr: "نشاطك", descAr: "القطاع، المنتج، الحجم" },
  { num: 2, labelFr: "Matières premières", descFr: "Eau verte — fibres & ingrédients", labelEn: "Raw materials", descEn: "Green water — fibers & ingredients", labelAr: "المواد الخام", descAr: "الماء الأخضر — ألياف ومكونات" },
  { num: 3, labelFr: "Processus industriels", descFr: "Eau bleue — consommation directe", labelEn: "Industrial processes", descEn: "Blue water — direct consumption", labelAr: "العمليات الصناعية", descAr: "الماء الأزرق — الاستهلاك المباشر" },
  { num: 4, labelFr: "Effluents & pollution", descFr: "Eau grise — impact normatif", labelEn: "Effluents & pollution", descEn: "Grey water — regulatory impact", labelAr: "المخلفات والتلوث", descAr: "الماء الرمادي — الأثر التنظيمي" },
  { num: 5, labelFr: "Résultats & Rapport", descFr: "Analyse + recommandations WSI", labelEn: "Results & Report", descEn: "Analysis + WSI recommendations", labelAr: "النتائج والتقرير", descAr: "التحليل + توصيات WSI" },
];

const defaultPollutants = [
  { name: "DQO (Colorants)", ceff: "", cnat: "0", cmax: "90" },
  { name: "DBO₅ (Détergents)", ceff: "", cnat: "0", cmax: "30" },
  { name: "Métaux lourds", ceff: "", cnat: "0", cmax: "0.5" },
];

/* ── InfoTip ── */
function InfoTip({ text }: { text: string }) {
  return (
    <span className="relative group inline-flex items-center ml-1 align-middle cursor-help">
      <span className="text-muted-foreground/50 group-hover:text-primary text-[10px] border border-current rounded-full w-3.5 h-3.5 inline-flex items-center justify-center leading-none transition-colors">ℹ</span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-foreground text-primary-foreground text-[11px] rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed shadow-xl whitespace-normal">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
      </span>
    </span>
  );
}

/* ── Component ── */
export function CalculatorSection() {
  const { lang } = useI18n();
  const t3 = (fr: string, en: string, ar: string) => lang === "fr" ? fr : lang === "ar" ? ar : en;
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [matCategory, setMatCategory] = useState("");
  const [confirmRestart, setConfirmRestart] = useState(false);
  const navigate = useNavigate();

  const sectorToCategoryMap: Record<string, string> = {
    agriculture: "agriculture",
    agroalimentaire: "elevage",
    textile: "textile",
    energie: "energie",
    industrie: "btp",
    btp: "btp",
    pharma: "energie",
    hotellerie: "agriculture",
    distribution: "agriculture",
    collectivites: "btp",
    electronique: "btp",
    automobile: "btp",
  };

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

  const equivalents = useMemo(() => getEquivalents(total, lang), [total, lang]);

  const getScore = () => {
    const adjusted = perUnit * (wsiFactor / 2);
    if (adjusted < 500) return { grade: "A", color: "bg-emerald-100 text-emerald-700", label: t3("Excellent — performance exemplaire", "Excellent — exemplary performance", "ممتاز — أداء مثالي") };
    if (adjusted < 2000) return { grade: "B", color: "bg-sky-100 text-primary", label: t3("Bon — supérieur à la moyenne sectorielle", "Good — above sector average", "جيد — فوق متوسط القطاع") };
    if (adjusted < 5000) return { grade: "C", color: "bg-amber-100 text-amber-700", label: t3("Moyen — potentiel d'amélioration significatif", "Average — significant improvement potential", "متوسط — إمكانية تحسين كبيرة") };
    return { grade: "D", color: "bg-red-100 text-destructive", label: t3("Critique — action urgente recommandée", "Critical — urgent action recommended", "حرج — إجراء عاجل موصى به") };
  };
  const score = getScore();

  const alerts = useMemo(() => {
    const a: { title: string; desc: string }[] = [];
    // WSI alert
    if (wsiFactor >= 3.5) {
      a.push({
        title: t3("🌍 Zone de stress hydrique extrême", "🌍 Extreme water stress zone", "🌍 منطقة إجهاد مائي شديد"),
        desc: t3(
          `Indice WSI de ${wsiFactor}/5 — chaque litre économisé a un impact ${Math.round(wsiFactor / 1.5)}× supérieur ici`,
          `WSI index ${wsiFactor}/5 — every liter saved has ${Math.round(wsiFactor / 1.5)}× more impact here`,
          `مؤشر WSI ${wsiFactor}/5 — كل لتر موفر له تأثير أكبر ${Math.round(wsiFactor / 1.5)} مرة هنا`
        ),
      });
    }
    pollutants.forEach((p) => {
      const ceff = parseFloat(p.ceff) || 0;
      const cmax = parseFloat(p.cmax) || 0;
      if (ceff > cmax && cmax > 0) {
        a.push({
          title: `⚠️ ${p.name}`,
          desc: t3(`Concentration (${ceff} mg/L) dépasse la norme (${cmax} mg/L)`, `Concentration (${ceff} mg/L) exceeds norm (${cmax} mg/L)`, `التركيز (${ceff} mg/L) يتجاوز المعيار (${cmax} mg/L)`),
        });
      }
    });
    return a;
  }, [pollutants, lang, wsiFactor]);

  const recos = useMemo(() => {
    const r: { icon: string; title: string; desc: string; level: string }[] = [];
    if (greenWater > blueWater && greenWater > 0) r.push({ icon: "🌱", title: t3("Fibres alternatives", "Alternative fibers", "ألياف بديلة"), desc: t3("Substituez par des matières à faible empreinte (lin, recyclé)", "Switch to low-footprint materials (linen, recycled)", "استبدل بمواد ذات بصمة منخفضة (كتان، معاد تدوير)"), level: "high" });
    if (blueWater > 500) r.push({ icon: "♻️", title: t3("Recyclage des eaux de process", "Process water recycling", "إعادة تدوير مياه العمليات"), desc: t3("Réutilisez les eaux de rinçage et de refroidissement", "Reuse rinse and cooling water", "أعد استخدام مياه الشطف والتبريد"), level: "medium" });
    if (greyWater > 200) r.push({ icon: "🧪", title: t3("Optimisation du traitement", "Treatment optimization", "تحسين المعالجة"), desc: t3("Améliorez le traitement des effluents avant rejet", "Improve effluent treatment before discharge", "حسّن معالجة المخلفات قبل التصريف"), level: "low" });
    if (wsiFactor >= 3) r.push({ icon: "💧", title: t3("Récupération des eaux pluviales", "Rainwater harvesting", "تجميع مياه الأمطار"), desc: t3("Captez et stockez l'eau de pluie pour les processus non-critiques", "Capture rainwater for non-critical processes", "اجمع مياه الأمطار للعمليات غير الحساسة"), level: "high" });
    if (r.length === 0) r.push({ icon: "✅", title: t3("Bonne performance", "Good performance", "أداء جيد"), desc: t3("Continuez à surveiller vos indicateurs", "Keep monitoring your indicators", "واصل مراقبة مؤشراتك"), level: "low" });
    return r;
  }, [greenWater, blueWater, greyWater, lang, wsiFactor]);

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
              <span>✦</span> {t3("100 % Gratuit · Sans inscription", "100% Free · No signup", "100% مجاني · بدون تسجيل")}
            </div>
            <h2 className="font-display text-[2.1rem] font-extrabold text-foreground leading-tight mb-3">
              {t3("Calculateur", "Water Footprint", "حاسبة")}
              <br />
              {t3("d'Empreinte Eau", "Calculator", "البصمة المائية")}
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              {t3(
                "Obtenez votre analyse complète Eau Verte / Bleue / Grise en 4 étapes avec pondération WSI locale.",
                "Get your complete Green / Blue / Grey Water analysis in 4 steps with local WSI weighting.",
                "احصل على تحليلك الكامل للمياه الخضراء/الزرقاء/الرمادية في 4 خطوات مع ترجيح WSI المحلي."
              )}
            </p>
            <div className="flex items-center gap-2 text-xs bg-primary/5 border border-primary/10 rounded-lg p-3 mb-8">
              <span className="text-lg">🗂️</span>
              <span className="text-muted-foreground">
                {t3(`${materials.length} matériaux · Sources WFN & Ecoinvent · ${Object.keys(wsiByCountry).length} pays WSI`, `${materials.length} materials · WFN & Ecoinvent sources · ${Object.keys(wsiByCountry).length} WSI countries`, `${materials.length} مادة · مصادر WFN & Ecoinvent · ${Object.keys(wsiByCountry).length} دولة WSI`)}
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
                      {t3(s.labelFr, s.labelEn, s.labelAr)}
                    </strong>
                    <span className="text-xs text-muted-foreground">{t3(s.descFr, s.descEn, s.descAr)}</span>
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
                  🏭 {t3("Décrivez votre activité", "Describe your activity", "صف نشاطك")} <span className="text-xs font-sans font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">1 / 4</span>
                </h3>
                <p className="text-xs text-muted-foreground">{t3("Un ordre de grandeur suffit — pas besoin de données précises.", "An approximation is enough — no exact data needed.", "تقدير تقريبي يكفي — لا حاجة لبيانات دقيقة.")}</p>
                <div className="landing-field">
                  <label>{t3("Secteur d'activité", "Industry sector", "القطاع")} *<InfoTip text={t3("Sélectionnez votre secteur d'activité", "Select your industry sector", "اختر قطاعك")} /></label>
                  <select value={sector} onChange={(e) => setSector(e.target.value)}>
                    <option value="">{t3("— Sélectionnez votre secteur —", "— Select your sector —", "— اختر قطاعك —")}</option>
                    {sectorOptions.map((s) => <option key={s.value} value={s.value}>{t3(s.labelFr, s.labelEn, s.labelAr)}</option>)}
                  </select>
                </div>
                <div className="landing-field">
                  <label>{t3("Produit analysé", "Product analyzed", "المنتج المحلل")}<InfoTip text={t3("Apparaîtra dans vos résultats.", "Will appear in your results.", "سيظهر في نتائجك.")} /></label>
                  <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder={t3("ex: T-shirt coton, Fromage, Ciment...", "e.g. Cotton t-shirt, Cheese, Cement...", "مثال: قميص قطني، جبن، إسمنت...")} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="landing-field">
                    <label>{t3("Volume / an", "Volume / year", "الحجم / سنة")} *<InfoTip text={t3("Un ordre de grandeur suffit.", "An approximation is fine.", "تقدير تقريبي يكفي.")} /></label>
                    <input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="ex: 50000" />
                  </div>
                  <div className="landing-field">
                    <label>{t3("Unité", "Unit", "الوحدة")}</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                      <option value="units">{t3("Unités", "Units", "وحدات")}</option>
                      <option value="kg">{t3("Kilogrammes", "Kilograms", "كيلوغرامات")}</option>
                      <option value="tonnes">Tonnes</option>
                      <option value="litres">{t3("Litres", "Liters", "لترات")}</option>
                      <option value="m2">m²</option>
                    </select>
                  </div>
                </div>
                <div className="landing-field">
                  <label>{t3("Pays de production", "Production country", "بلد الإنتاج")} *<InfoTip text={t3("Influence les calculs selon la disponibilité locale de l'eau.", "Affects calculations based on local water availability.", "يؤثر على الحسابات بناءً على توفر المياه المحلي.")} /></label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    {countryOptions.map((c) => (
                      <option key={c} value={c.toLowerCase().replace(/[\s'é]/g, (ch) => ch === "é" ? "e" : ch === " " ? "_" : "")}>{c}</option>
                    ))}
                  </select>
                </div>
                {/* Water scarcity context */}
                <div className={`flex items-center gap-3 rounded-lg p-3 text-xs border ${
                  wsiFactor >= 3.5 ? "bg-red-50 border-red-200 text-destructive" :
                  wsiFactor >= 2.5 ? "bg-amber-50 border-amber-200 text-amber-700" :
                  "bg-emerald-50 border-emerald-200 text-green-water"
                }`}>
                  <span className="text-lg">💧</span>
                  <div>
                    <strong>WSI {wsiFactor}/5 — {t3(wsiData.label, wsiData.labelEn, wsiData.labelAr)}</strong>
                    {" — "}
                    {t3(
                      `Chaque litre économisé ici a un impact ${wsiFactor >= 3.5 ? "critique" : wsiFactor >= 2.5 ? "important" : "positif"}`,
                      `Every liter saved here has a ${wsiFactor >= 3.5 ? "critical" : wsiFactor >= 2.5 ? "significant" : "positive"} impact`,
                      `كل لتر موفر هنا له تأثير ${wsiFactor >= 3.5 ? "بالغ" : wsiFactor >= 2.5 ? "مهم" : "إيجابي"}`
                    )}
                    <span className="block mt-1 opacity-70">{t3("WSI (Water Stress Index) = indice de stress hydrique local (0 = abondant · 5 = extrême)", "WSI (Water Stress Index) = local water stress index (0 = abundant · 5 = extreme)", "WSI = مؤشر الإجهاد المائي المحلي (0 = وفير · 5 = شديد)")}</span>
                  </div>
                </div>
                {(!sector || !volume) && (
                  <p className="text-xs text-destructive">
                    {t3("⚠ Veuillez renseigner votre secteur et votre volume de production pour continuer.", "⚠ Please fill in your sector and production volume to continue.", "⚠ يرجى تحديد قطاعك وحجم الإنتاج للمتابعة.")}
                  </p>
                )}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      if (sectorToCategoryMap[sector]) setMatCategory(sectorToCategoryMap[sector]);
                      setStep(1);
                    }}
                    disabled={!sector || !volume}
                    className="flex-1 gradient-water text-primary-foreground rounded-lg py-3 font-semibold text-sm disabled:opacity-40 transition-all hover:opacity-90"
                  >
                    {t3("Étape suivante →", "Next step →", "الخطوة التالية ←")}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  🌿 {t3("Vos matières premières", "Your raw materials", "موادك الخام")} <span className="text-xs font-sans font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">2 / 4</span>
                </h3>
                <p className="text-xs text-muted-foreground">{t3("La plus grande part de l'empreinte est souvent cachée dans les matières premières.", "The largest share of the footprint is often hidden in raw materials.", "الجزء الأكبر من البصمة غالبًا مخفي في المواد الخام.")}</p>
                {/* Category filter */}
                <div className="landing-field">
                  <label>{t3("Filtrer par catégorie", "Filter by category", "تصفية حسب الفئة")}</label>
                  <select value={matCategory} onChange={(e) => setMatCategory(e.target.value)}>
                    <option value="">{t3("— Tous les matériaux —", "— All materials —", "— جميع المواد —")}</option>
                    {materialCategories.map((c) => <option key={c.value} value={c.value}>{t3(c.label, c.labelEn, c.labelAr)}</option>)}
                  </select>
                </div>
                <div className="landing-field">
                  <label>{t3("Matière principale", "Main material", "المادة الرئيسية")} *</label>
                  <select value={mat1} onChange={(e) => setMat1(e.target.value)}>
                    <option value="">{t3("— Sélectionnez —", "— Select —", "— اختر —")}</option>
                    {filteredMaterials.map((m) => <option key={m.value} value={m.value}>{m.label} ({fmt(m.coeff)} L/kg)</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="landing-field">
                    <label>{t3("Quantité (kg/an)", "Quantity (kg/year)", "الكمية (كغ/سنة)")} *<InfoTip text={t3("Estimez à partir de vos achats annuels si besoin.", "Estimate from annual purchases if needed.", "قدّر من مشترياتك السنوية إذا لزم.")} /></label>
                    <input type="number" value={mat1Qty} onChange={(e) => setMat1Qty(e.target.value)} placeholder="ex: 10000" />
                  </div>
                  <div className="landing-field">
                    <label>{t3("Eau contenue (L/kg)", "Water content (L/kg)", "الماء المحتوى (ل/كغ)")}<InfoTip text={t3("Calculé automatiquement selon la matière choisie.", "Auto-calculated based on the chosen material.", "يُحسب تلقائيًا بناءً على المادة المختارة.")} /></label>
                    <input readOnly value={mat1Coeff ? fmt(mat1Coeff) : "—"} className="bg-yellow-50 border-yellow-200" />
                  </div>
                </div>
                <div className="landing-field">
                  <label>{t3("Matière secondaire (optionnel)", "Secondary material (optional)", "المادة الثانوية (اختياري)")}</label>
                  <select value={mat2} onChange={(e) => setMat2(e.target.value)}>
                    <option value="">{t3("— Aucune —", "— None —", "— لا شيء —")}</option>
                    {materials.map((m) => <option key={m.value} value={m.value}>{m.label} ({fmt(m.coeff)} L/kg)</option>)}
                  </select>
                </div>
                {mat2 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="landing-field">
                      <label>{t3("Quantité mat. secondaire (kg/an)", "Secondary material qty (kg/year)", "كمية المادة الثانوية (كغ/سنة)")}</label>
                      <input type="number" value={mat2Qty} onChange={(e) => setMat2Qty(e.target.value)} />
                    </div>
                    <div className="landing-field">
                      <label>{t3("Eau contenue (L/kg)", "Water content (L/kg)", "الماء المحتوى (ل/كغ)")}</label>
                      <input readOnly value={mat2Coeff ? fmt(mat2Coeff) : "—"} className="bg-yellow-50 border-yellow-200" title={t3("Valeur de référence internationale — non modifiable", "International reference value — read-only", "قيمة مرجعية دولية — للقراءة فقط")} />
                    </div>
                  </div>
                )}
                <div className="text-sm font-semibold text-primary mt-2 bg-primary/5 border border-primary/10 rounded-lg p-3">
                  💧 {t3("Eau liée à vos matières", "Water from your materials", "الماء المرتبط بموادك")} : <span className="text-lg">{greenWater > 0 ? `${fmt(greenWater)} m³/an` : "—"}</span>
                </div>
                <div className="flex justify-between gap-3 pt-2">
                  <button onClick={() => setStep(0)} className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:border-primary hover:text-primary transition-all">
                    ← {t3("Retour", "Back", "رجوع")}
                  </button>
                  <button onClick={() => setStep(2)} className="flex-1 gradient-water text-primary-foreground rounded-lg py-2.5 font-semibold text-sm hover:opacity-90 transition-all">
                    {t3("Étape suivante →", "Next step →", "الخطوة التالية ←")}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  💧 {t3("Eau utilisée dans votre usine", "Water used in your facility", "الماء المستخدم في منشأتك")} <span className="text-xs font-sans font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">3 / 4</span>
                </h3>
                <p className="text-xs text-muted-foreground">{t3("Laissez à 0 les postes que vous ne connaissez pas.", "Leave at 0 any figures you don't have.", "اترك 0 للبنود التي لا تعرفها.")}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="landing-field">
                    <label>{t3("Réseau public (m³/an)", "Public network (m³/year)", "شبكة عامة (م³/سنة)")}<InfoTip text={t3("Eau facturée par votre fournisseur municipal.", "Water billed by your public water supplier.", "الماء المفوتر من مزودك البلدي.")} /></label>
                    <input type="number" value={blueNetwork} onChange={(e) => setBlueNetwork(e.target.value)} placeholder="0" />
                  </div>
                  <div className="landing-field">
                    <label>{t3("Puits / forage (m³/an)", "Well / borehole (m³/year)", "بئر / حفر (م³/سنة)")}<InfoTip text={t3("Eau pompée directement depuis le sol.", "Water pumped directly from the ground.", "الماء المضخوخ مباشرة من الأرض.")} /></label>
                    <input type="number" value={blueWell} onChange={(e) => setBlueWell(e.target.value)} placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="landing-field">
                    <label>{t3("Eau procédé (m³/an)", "Process water (m³/year)", "ماء العمليات (م³/سنة)")}<InfoTip text={t3("Eau incorporée dans le produit fini : cuisson, trempage...", "Water incorporated into the finished product: cooking, soaking...", "الماء المدمج في المنتج النهائي: طبخ، نقع...")} /></label>
                    <input type="number" value={blueProcess} onChange={(e) => setBlueProcess(e.target.value)} placeholder="0" />
                  </div>
                  <div className="landing-field">
                    <label>{t3("Vapeur / chaudières (m³/an)", "Steam / boilers (m³/year)", "بخار / مراجل (م³/سنة)")}<InfoTip text={t3("Eau transformée en vapeur pour vos équipements thermiques.", "Water converted to steam for your thermal equipment.", "الماء المحول إلى بخار للمعدات الحرارية.")} /></label>
                    <input type="number" value={blueSteam} onChange={(e) => setBlueSteam(e.target.value)} placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="landing-field">
                    <label>{t3("Eau restituée (m³/an)", "Water returned (m³/year)", "الماء المُعاد (م³/سنة)")}<InfoTip text={t3("Eau rejetée après traitement — sera déduite du total.", "Water discharged after treatment — will be deducted.", "الماء المصروف بعد المعالجة — سيُطرح من الإجمالي.")} /></label>
                    <input type="number" value={blueReturned} onChange={(e) => setBlueReturned(e.target.value)} placeholder="0" />
                  </div>
                  <div className="landing-field">
                    <label>{t3("Eau recyclée (m³/an)", "Recycled water (m³/year)", "الماء المعاد تدويره (م³/سنة)")}<InfoTip text={t3("Eau réutilisée en interne — sera déduite du total.", "Internally reused water — will be deducted.", "الماء المعاد استخدامه داخليًا — سيُطرح من الإجمالي.")} /></label>
                    <input type="number" value={blueRecycled} onChange={(e) => setBlueRecycled(e.target.value)} placeholder="0" />
                  </div>
                </div>
                <div className="text-sm font-semibold text-primary mt-2 bg-primary/5 border border-primary/10 rounded-lg p-3">
                  💧 {t3("Consommation directe estimée", "Estimated direct water use", "الاستهلاك المباشر المقدر")} : <span className="text-lg">{blueWater !== 0 ? `${fmt(blueWater)} m³/an` : "—"}</span>
                </div>
                <div className="flex justify-between gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:border-primary hover:text-primary transition-all">
                    ← {t3("Retour", "Back", "رجوع")}
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 gradient-water text-primary-foreground rounded-lg py-2.5 font-semibold text-sm hover:opacity-90 transition-all">
                    {t3("Étape suivante →", "Next step →", "الخطوة التالية ←")}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="font-display text-xl font-bold flex items-center gap-2">
                  🌊 {t3("Vos rejets dans l'eau", "Your water discharges", "مخلفاتك المائية")} <span className="text-xs font-sans font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">4 / 4</span>
                </h3>
                <p className="text-xs text-muted-foreground">{t3("Valeurs issues de vos analyses labo. Sans analyses, laissez à 0.", "Values from your lab analysis. No data? Leave at 0.", "قيم من تحليلات مختبرك. لا بيانات؟ اترك 0.")}</p>
                <div className="landing-field">
                  <label>{t3("Volume effluents rejetés (m³/an)", "Effluents discharged (m³/year)", "حجم المخلفات المصروفة (م³/سنة)")}</label>
                  <input type="number" value={effluentVol} onChange={(e) => setEffluentVol(e.target.value)} placeholder="ex: 5000" />
                </div>

                <div className="grid gap-1.5 text-xs font-semibold text-muted-foreground" style={{ gridTemplateColumns: "1.6fr 1fr 1fr 1fr" }}>
                  <span>{t3("Substance", "Substance", "المادة")}</span>
                  <span>{t3("Votre mesure (mg/L)", "Your measure (mg/L)", "قياسك (mg/L)")}</span>
                  <span>{t3("Naturel", "Natural", "طبيعي")}</span>
                  <span>{t3("Limite", "Limit", "الحد")}</span>
                </div>
                {pollutants.map((p, i) => (
                  <div key={i} className="landing-poll-row">
                    <label>{p.name}</label>
                    <input type="number" value={p.ceff} onChange={(e) => updatePollutant(i, "ceff", e.target.value)} placeholder="0" />
                    <input className="norm-input bg-yellow-50 border-yellow-200" value={p.cnat} readOnly title={t3("Concentration naturelle de référence (pré-remplie)", "Natural reference concentration (pre-filled)", "التركيز الطبيعي المرجعي (مملوء مسبقًا)")} />
                    <input className="norm-input bg-yellow-50 border-yellow-200" value={p.cmax} readOnly title={t3("Norme réglementaire maximale (pré-remplie)", "Maximum regulatory norm (pre-filled)", "الحد التنظيمي الأقصى (مملوء مسبقًا)")} />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground italic">{t3("🟡 Cases jaunes = normes pré-remplies. Saisissez seulement votre mesure.", "🟡 Yellow = pre-filled norms. Only enter your measurement.", "🟡 الخانات الصفراء = معايير مملوءة مسبقًا. أدخل قياسك فقط.")}</p>
                <div className="text-sm font-semibold text-primary mt-2 bg-primary/5 border border-primary/10 rounded-lg p-3">
                  💧 {t3("Impact des rejets estimé", "Estimated discharge impact", "تأثير المخلفات المقدر")} : <span className="text-lg">{greyWater > 0 ? `${fmt(greyWater)} m³/an` : "—"}</span>
                </div>
                <div className="flex justify-between gap-3 pt-2">
                  <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:border-primary hover:text-primary transition-all">
                    ← {t3("Retour", "Back", "رجوع")}
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 rounded-lg py-2.5 font-semibold text-sm text-primary-foreground hover:opacity-90 transition-all"
                    style={{ background: "linear-gradient(135deg, #059669, hsl(163 100% 39%))" }}
                  >
                    🔍 {t3("Calculer mon empreinte", "Calculate my footprint", "احسب بصمتي")}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5 — Results */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <h3 className="font-display text-xl font-bold">📊 {t3("Votre Empreinte Eau", "Your Water Footprint", "بصمتك المائية")}</h3>
                {product && (
                  <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                    📋 {t3("Analyse pour", "Analysis for", "تحليل لـ")} : <strong>{product}</strong>
                    {volume && <> · {volume} {unit}/{t3("an", "year", "سنة")}</>}
                    {" · "}{country.charAt(0).toUpperCase() + country.replace(/_/g, " ").slice(1)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">{t3("Votre consommation d'eau ventilée par source, pondérée par la rarité locale", "Your water consumption broken down by source, weighted by local scarcity", "استهلاكك المائي مصنفًا حسب المصدر ومرجحًا بالشح المحلي")}</p>

                {/* 3 cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="landing-rcard green">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-green-water mb-1">🌿 {t3("Matières premières", "Raw materials", "المواد الخام")}</p>
                    <span className="font-display text-2xl font-bold block">{fmt(greenWater)}</span>
                    <span className="text-xs text-muted-foreground">m³/an</span>
                  </div>
                  <div className="landing-rcard blue">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-primary mb-1">🏭 {t3("Processus direct", "Direct process", "العمليات المباشرة")}</p>
                    <span className="font-display text-2xl font-bold block">{fmt(blueWater)}</span>
                    <span className="text-xs text-muted-foreground">m³/an</span>
                  </div>
                  <div className="landing-rcard grey">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-grey-water mb-1">🌊 {t3("Rejets", "Discharges", "المخلفات")}</p>
                    <span className="font-display text-2xl font-bold block">{fmt(greyWater)}</span>
                    <span className="text-xs text-muted-foreground">m³/an</span>
                  </div>
                </div>

                {/* Total bar */}
                <div className="gradient-water rounded-xl p-5 flex justify-between items-center flex-wrap gap-4 text-primary-foreground">
                  <div>
                    <p className="text-xs opacity-80">{t3("Empreinte Eau Totale", "Total Water Footprint", "إجمالي البصمة المائية")}</p>
                    <span className="font-display text-4xl font-extrabold">{fmt(total)}</span>
                    <span className="text-sm opacity-75 ml-1">m³ / an</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80">{t3("Par unité produite", "Per unit produced", "لكل وحدة منتجة")}</p>
                    <span className="font-display text-2xl font-bold">{fmt(perUnit)}</span>
                    <span className="text-sm opacity-75 ml-1">L / {unit}</span>
                  </div>
                </div>
                <div className={`rounded-xl p-4 border ${wsiFactor >= 3.5 ? "bg-red-50 border-red-200" : wsiFactor >= 2.5 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold">{t3("Impact ajusté selon la rarité locale", "Impact adjusted for local scarcity", "التأثير مُعدَّل وفق الشح المحلي")}</p>
                      <span className="font-display text-xl font-bold">{fmt(totalWeighted)} m³<sub>eq</sub></span>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{t3(`Facteur rarité × ${wsiFactor}`, `Scarcity factor × ${wsiFactor}`, `عامل الشح × ${wsiFactor}`)}</p>
                      <p>{wsiFactor >= 3.5 ? t3("Eau très rare ici", "Very scarce water here", "الماء نادر جدًا هنا") : wsiFactor >= 2.5 ? t3("Eau sous tension", "Water under pressure", "الماء تحت ضغط") : t3("Eau disponible", "Water available", "الماء متاح")}</p>
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
                    <strong className="text-sm">{t3("Score de performance globale", "Overall performance score", "درجة الأداء الإجمالي")}</strong>
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
                <p className="text-sm font-bold mt-4">💡 {t3("Recommandations prioritaires", "Priority recommendations", "التوصيات ذات الأولوية")}</p>
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
                        if (error) toast.error(t3("Erreur lors de la sauvegarde", "Error saving results", "خطأ في الحفظ"));
                        else toast.success(t3("Résultats sauvegardés !", "Results saved!", "تم حفظ النتائج!"));
                      }}
                      disabled={saving}
                      className="px-5 py-2.5 rounded-lg gradient-water text-primary-foreground text-xs font-semibold flex items-center gap-1.5"
                    >
                      {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                      💾 {t3("Sauvegarder", "Save", "حفظ")}
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/pricing")}
                    className="px-5 py-2.5 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary/5 transition-colors"
                  >
                    📄 {t3("Rapport complet (Pro)", "Full report (Pro)", "تقرير كامل (Pro)")}
                  </button>
                  {!user && (
                    <button
                      onClick={() => navigate("/auth")}
                      className="px-5 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                    >
                      💾 {t3("Créer un compte pour sauvegarder", "Create account to save results", "أنشئ حسابًا للحفظ")}
                    </button>
                  )}
                  <button onClick={() => window.print()} className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground text-xs font-semibold">
                    🖨️ {t3("Imprimer", "Print", "طباعة")}
                  </button>
                </div>
                {confirmRestart ? (
                  <div className="flex items-center justify-center gap-3 text-xs mt-2">
                    <span className="text-muted-foreground">{t3("Effacer toutes les données ?", "Clear all data?", "مسح كل البيانات؟")}</span>
                    <button onClick={() => { restart(); setConfirmRestart(false); }} className="text-destructive font-bold underline">
                      {t3("Oui, recommencer", "Yes, restart", "نعم، ابدأ من جديد")}
                    </button>
                    <button onClick={() => setConfirmRestart(false)} className="text-muted-foreground underline">
                      {t3("Annuler", "Cancel", "إلغاء")}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmRestart(true)} className="block w-full text-center text-xs text-muted-foreground underline hover:text-primary mt-2">
                    ↺ {t3("Nouveau calcul", "New calculation", "حساب جديد")}
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
