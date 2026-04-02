import { useState, useMemo } from "react";
import { PageMeta } from "@/components/PageMeta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, Droplets, Sun, FlaskConical, Info } from "lucide-react";

/* ── helpers ── */
function fmt(n: number, decimals = 0) {
  return n.toLocaleString("fr-FR", { maximumFractionDigits: decimals });
}
function PaybackBar({ years, maxYears = 15 }: { years: number; maxYears?: number }) {
  const pct = Math.min((years / maxYears) * 100, 100);
  const color = years <= 3 ? "bg-emerald-500" : years <= 6 ? "bg-amber-400" : years <= 10 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="h-3 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0 an</span><span>{maxYears} ans</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP — Station d'épuration interne
───────────────────────────────────────────── */
function StepSimulator() {
  const [volumeM3Day, setVolumeM3Day]   = useState("80");
  const [daysYear, setDaysYear]         = useState("250");
  const [onasTariff, setOnasTariff]     = useState("4.5");      // DT/m³
  const [penaltyYear, setPenaltyYear]   = useState("45000");    // DT/an current
  const [stepCost, setStepCost]         = useState("280000");   // DT investissement
  const [opexYear, setOpexYear]         = useState("18000");    // DT/an opex STEP
  const [reutPct, setReutPct]           = useState("60");       // % eau traitée réutilisable

  const r = useMemo(() => {
    const vol = parseFloat(volumeM3Day) || 0;
    const days = parseFloat(daysYear) || 250;
    const tariff = parseFloat(onasTariff) || 4.5;
    const penalty = parseFloat(penaltyYear) || 0;
    const invest = parseFloat(stepCost) || 0;
    const opex = parseFloat(opexYear) || 0;
    const reut = (parseFloat(reutPct) || 0) / 100;

    const annualVol = vol * days;
    const onasSavings = annualVol * tariff;               // économie redevance ONAS
    const reutVolume = annualVol * reut;                   // m³ réutilisés
    const reutSavings = reutVolume * tariff;               // économie SONEDE sur eau réutilisée
    const totalAnnualSavings = onasSavings + penalty + reutSavings - opex;
    const payback = totalAnnualSavings > 0 ? invest / totalAnnualSavings : Infinity;
    const npv10 = totalAnnualSavings * 7.722 - invest;    // VAN 10 ans, taux 5%

    return { annualVol, onasSavings, reutVolume, reutSavings, totalAnnualSavings, payback, npv10 };
  }, [volumeM3Day, daysYear, onasTariff, penaltyYear, stepCost, opexYear, reutPct]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              Paramètres STEP
            </CardTitle>
            <CardDescription>Station d'épuration interne avec possibilité de REUT</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Volume d'eaux usées (m³/j)</Label>
                <Input type="number" min="0" value={volumeM3Day} onChange={e => setVolumeM3Day(e.target.value)} placeholder="80" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Jours de production / an</Label>
                <Input type="number" min="1" max="365" value={daysYear} onChange={e => setDaysYear(e.target.value)} placeholder="250" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tarif ONAS actuel (DT/m³)</Label>
                <Input type="number" step="0.1" min="0" value={onasTariff} onChange={e => setOnasTariff(e.target.value)} placeholder="4.5" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Pénalités ONAS actuelles (DT/an)</Label>
                <Input type="number" min="0" value={penaltyYear} onChange={e => setPenaltyYear(e.target.value)} placeholder="45000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Coût investissement STEP (DT)</Label>
                <Input type="number" min="0" value={stepCost} onChange={e => setStepCost(e.target.value)} placeholder="280000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Coût exploitation STEP (DT/an)</Label>
                <Input type="number" min="0" value={opexYear} onChange={e => setOpexYear(e.target.value)} placeholder="18000" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Taux de réutilisation eau traitée (%)</Label>
                <Input type="number" min="0" max="100" value={reutPct} onChange={e => setReutPct(e.target.value)} placeholder="60" />
                <p className="text-xs text-muted-foreground">Part de l'eau traitée qui peut remplacer l'eau SONEDE (irrigation, refroidissement…)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Card className={r.payback <= 5 ? "border-emerald-500/40 bg-emerald-500/5" : r.payback <= 10 ? "border-amber-500/40 bg-amber-500/5" : "border-destructive/30"}>
            <CardHeader className="pb-2">
              <CardDescription>Retour sur investissement</CardDescription>
              <CardTitle className="text-3xl">
                {r.payback === Infinity ? "∞" : `${r.payback.toFixed(1)} ans`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaybackBar years={r.payback === Infinity ? 15 : r.payback} />
              <Badge className={`mt-2 text-xs ${r.payback <= 5 ? "bg-emerald-500" : r.payback <= 10 ? "bg-amber-500" : "bg-destructive"}`}>
                {r.payback <= 3 ? "Excellent ROI" : r.payback <= 5 ? "Bon ROI" : r.payback <= 10 ? "ROI acceptable" : "ROI long"}
              </Badge>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-1">
                <CardDescription className="text-xs">Économies totales / an</CardDescription>
                <CardTitle className="text-xl text-emerald-600">{fmt(r.totalAnnualSavings)} DT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">net des charges exploitation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardDescription className="text-xs">VAN à 10 ans (taux 5%)</CardDescription>
                <CardTitle className={`text-xl ${r.npv10 >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                  {fmt(r.npv10)} DT
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{r.npv10 >= 0 ? "Projet rentable" : "Projet à réévaluer"}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Détail des économies annuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-xs">
                <tbody className="space-y-1">
                  {[
                    ["Suppression redevance ONAS", r.onasSavings, "emerald"],
                    ["Réduction pénalités ONAS", parseFloat(penaltyYear) || 0, "emerald"],
                    ["Eau SONEDE économisée (REUT)", r.reutSavings, "emerald"],
                    ["- Charges exploitation STEP", -(parseFloat(opexYear) || 0), "red"],
                  ].map(([label, val, color]) => (
                    <tr key={String(label)} className="border-b last:border-0">
                      <td className="py-1.5 text-muted-foreground">{String(label)}</td>
                      <td className={`py-1.5 text-right font-medium ${color === "red" ? "text-destructive" : "text-emerald-600"}`}>
                        {Number(val) >= 0 ? "+" : ""}{fmt(Number(val))} DT
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="pt-2">Total net</td>
                    <td className={`pt-2 text-right ${r.totalAnnualSavings >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                      {fmt(r.totalAnnualSavings)} DT/an
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-3 border-t pt-2">
                Volume REUT : <strong>{fmt(r.reutVolume)} m³/an</strong> récupérés sur{" "}
                <strong>{fmt(r.annualVol)} m³/an</strong> traités
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   REUT — Réutilisation eaux traitées existantes
───────────────────────────────────────────── */
function ReutSimulator() {
  const [volumeReut, setVolumeReut]     = useState("5000");   // m³/an disponibles
  const [sonesPrice, setSonesPrice]     = useState("2.8");    // DT/m³ SONEDE actuel
  const [reutCost, setReutCost]         = useState("0.4");    // DT/m³ traitement supplémentaire
  const [investReut, setInvestReut]     = useState("35000");  // DT réseau distribution REUT
  const [usageType, setUsageType]       = useState("irrigation");

  const usageEfficiency: Record<string, number> = {
    irrigation: 1.0, refroidissement: 0.9, nettoyage: 0.85, wc: 1.0, autre: 0.7,
  };

  const r = useMemo(() => {
    const vol = parseFloat(volumeReut) || 0;
    const sonede = parseFloat(sonesPrice) || 0;
    const reutC = parseFloat(reutCost) || 0;
    const invest = parseFloat(investReut) || 0;
    const eff = usageEfficiency[usageType] ?? 0.8;

    const effectiveVol = vol * eff;
    const annualSaving = effectiveVol * (sonede - reutC);
    const payback = annualSaving > 0 ? invest / annualSaving : Infinity;
    const co2Saved = effectiveVol * 0.00055;   // tCO2 (énergie pompage SONEDE)

    return { effectiveVol, annualSaving, payback, co2Saved };
  }, [volumeReut, sonesPrice, reutCost, investReut, usageType]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              Paramètres REUT
            </CardTitle>
            <CardDescription>Réutilisation d'eaux usées traitées déjà disponibles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Volume d'eau traitée disponible (m³/an)</Label>
                <Input type="number" min="0" value={volumeReut} onChange={e => setVolumeReut(e.target.value)} placeholder="5000" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tarif SONEDE actuel (DT/m³)</Label>
                <Input type="number" step="0.1" min="0" value={sonesPrice} onChange={e => setSonesPrice(e.target.value)} placeholder="2.8" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Coût traitement REUT additionnel (DT/m³)</Label>
                <Input type="number" step="0.05" min="0" value={reutCost} onChange={e => setReutCost(e.target.value)} placeholder="0.4" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Investissement réseau REUT (DT)</Label>
                <Input type="number" min="0" value={investReut} onChange={e => setInvestReut(e.target.value)} placeholder="35000" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Usage prévu de l'eau REUT</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={usageType}
                  onChange={e => setUsageType(e.target.value)}
                >
                  <option value="irrigation">Irrigation (100% efficacité)</option>
                  <option value="refroidissement">Refroidissement (90%)</option>
                  <option value="nettoyage">Nettoyage / lavage (85%)</option>
                  <option value="wc">Chasses d'eau WC (100%)</option>
                  <option value="autre">Autre usage (70%)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className={r.payback <= 3 ? "border-emerald-500/40 bg-emerald-500/5" : ""}>
            <CardHeader className="pb-2">
              <CardDescription>Retour sur investissement</CardDescription>
              <CardTitle className="text-3xl">
                {r.payback === Infinity ? "∞" : `${r.payback.toFixed(1)} ans`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaybackBar years={r.payback === Infinity ? 15 : r.payback} />
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-1">
                <CardDescription className="text-xs">Économie annuelle</CardDescription>
                <CardTitle className="text-lg text-emerald-600">{fmt(r.annualSaving)} DT</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardDescription className="text-xs">Volume substitué</CardDescription>
                <CardTitle className="text-lg">{fmt(r.effectiveVol)} m³</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardDescription className="text-xs">CO₂ évité / an</CardDescription>
                <CardTitle className="text-lg text-emerald-600">{r.co2Saved.toFixed(1)} tCO₂</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Collecte eau de pluie
───────────────────────────────────────────── */
function RainwaterSimulator() {
  const [roofArea, setRoofArea]         = useState("2000");  // m²
  const [rainfall, setRainfall]         = useState("450");   // mm/an (Tunis ~480, Sfax ~220)
  const [runoffCoeff, setRunoffCoeff]   = useState("0.80");  // coefficient ruissellement
  const [tankVolume, setTankVolume]     = useState("200");   // m³ cuve
  const [investCost, setInvestCost]     = useState("45000"); // DT
  const [sonesPrice, setSonesPrice2]    = useState("2.8");   // DT/m³
  const [city, setCity]                 = useState("tunis");

  const cityRainfall: Record<string, number> = {
    tunis: 480, bizerte: 610, nabeul: 520, sousse: 310,
    sfax: 220, gabes: 180, gafsa: 160, kairouan: 280, sidi_bouzid: 250,
  };

  const effectiveRainfall = city !== "custom" ? cityRainfall[city] : parseFloat(rainfall) || 0;

  const r = useMemo(() => {
    const area = parseFloat(roofArea) || 0;
    const rain = effectiveRainfall;
    const coeff = parseFloat(runoffCoeff) || 0.8;
    const tank = parseFloat(tankVolume) || 0;
    const invest = parseFloat(investCost) || 0;
    const price = parseFloat(sonesPrice) || 0;

    const rawVolume = (area * rain * coeff) / 1000;            // m³/an brut
    const usableVolume = Math.min(rawVolume, tank * 12);        // limité par capacité stockage
    const annualSaving = usableVolume * price;
    const payback = annualSaving > 0 ? invest / annualSaving : Infinity;
    const waterStressSaved = usableVolume;                      // m³ prélevés en moins

    return { rawVolume, usableVolume, annualSaving, payback, waterStressSaved };
  }, [roofArea, effectiveRainfall, runoffCoeff, tankVolume, investCost, sonesPrice]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              Paramètres collecte eau de pluie
            </CardTitle>
            <CardDescription>Toiture, bassins de rétention, citerne</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Ville / région (pluviométrie moyenne)</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                >
                  <option value="bizerte">Bizerte — 610 mm/an</option>
                  <option value="nabeul">Nabeul / Cap Bon — 520 mm/an</option>
                  <option value="tunis">Tunis — 480 mm/an</option>
                  <option value="kairouan">Kairouan — 280 mm/an</option>
                  <option value="sidi_bouzid">Sidi Bouzid — 250 mm/an</option>
                  <option value="sousse">Sousse / Sahel — 310 mm/an</option>
                  <option value="sfax">Sfax — 220 mm/an</option>
                  <option value="gabes">Gabès — 180 mm/an</option>
                  <option value="gafsa">Gafsa — 160 mm/an</option>
                  <option value="custom">Saisie manuelle</option>
                </select>
              </div>
              {city === "custom" && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">Pluviométrie annuelle (mm/an)</Label>
                  <Input type="number" min="0" value={rainfall} onChange={e => setRainfall(e.target.value)} placeholder="450" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs">Surface collectrice (m²)</Label>
                <Input type="number" min="0" value={roofArea} onChange={e => setRoofArea(e.target.value)} placeholder="2000" />
                <p className="text-xs text-muted-foreground">Toiture + aires imperméabilisées</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Coeff. de ruissellement</Label>
                <Input type="number" step="0.05" min="0" max="1" value={runoffCoeff} onChange={e => setRunoffCoeff(e.target.value)} placeholder="0.80" />
                <p className="text-xs text-muted-foreground">Toiture zinc ≈ 0.90 · Béton ≈ 0.85 · Gravier ≈ 0.60</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Capacité de stockage (m³)</Label>
                <Input type="number" min="0" value={tankVolume} onChange={e => setTankVolume(e.target.value)} placeholder="200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tarif SONEDE (DT/m³)</Label>
                <Input type="number" step="0.1" min="0" value={sonesPrice} onChange={e => setSonesPrice2(e.target.value)} placeholder="2.8" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Coût installation (citerne + réseau) (DT)</Label>
                <Input type="number" min="0" value={investCost} onChange={e => setInvestCost(e.target.value)} placeholder="45000" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className={r.payback <= 5 ? "border-emerald-500/40 bg-emerald-500/5" : ""}>
            <CardHeader className="pb-2">
              <CardDescription>Retour sur investissement</CardDescription>
              <CardTitle className="text-3xl">
                {r.payback === Infinity ? "∞" : `${r.payback.toFixed(1)} ans`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaybackBar years={r.payback === Infinity ? 15 : r.payback} />
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-1">
                <CardDescription className="text-xs">Volume récupérable / an</CardDescription>
                <CardTitle className="text-lg">{fmt(r.usableVolume)} m³</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">sur {fmt(r.rawVolume)} m³ bruts collectés</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardDescription className="text-xs">Économie SONEDE / an</CardDescription>
                <CardTitle className="text-lg text-emerald-600">{fmt(r.annualSaving)} DT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{fmt(r.waterStressSaved)} m³ de moins prélevés</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-primary" />
                Contexte : pluviométrie {city !== "custom" ? `${effectiveRainfall} mm/an` : `${rainfall} mm/an`}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>• Pluviométrie tunisienne : 160 mm (Gafsa) à 610 mm/an (Bizerte)</p>
              <p>• Variabilité saisonnière forte : 70% des pluies en Oct–Mars</p>
              <p>• Stockage dimensionné sur la saison sèche (Juin–Sept : quasi 0 mm)</p>
              <p>• Usage recommandé : irrigation, lavage véhicules, refroidissement, WC</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function RoiSimulator() {
  return (
    <>
      <PageMeta
        title="Simulateur ROI eau — HydroScan"
        description="Calculez le retour sur investissement de votre STEP, REUT ou collecte d'eau de pluie."
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Simulateur ROI Investissements Eau</h1>
            <p className="text-muted-foreground text-sm">
              Évaluez la rentabilité de vos projets d'économie d'eau avant de les soumettre à votre direction ou bailleur de fonds
            </p>
          </div>
          <Badge variant="outline" className="self-start gap-1.5 text-xs border-primary/40 text-primary">
            <TrendingDown className="h-3 w-3" /> Adapté au contexte tunisien
          </Badge>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Ces simulations sont des estimations prévisionnelles basées sur les paramètres saisis.
            Les résultats peuvent être exportés pour vos dossiers de financement (BERD, AFD, AMEN Bank ligne verte, FODEP).
          </span>
        </div>

        <Tabs defaultValue="step">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="step" className="gap-1.5 text-xs sm:text-sm">
              <FlaskConical className="h-4 w-4 shrink-0" />
              <span>STEP Interne</span>
            </TabsTrigger>
            <TabsTrigger value="reut" className="gap-1.5 text-xs sm:text-sm">
              <Droplets className="h-4 w-4 shrink-0" />
              <span>REUT</span>
            </TabsTrigger>
            <TabsTrigger value="rainwater" className="gap-1.5 text-xs sm:text-sm">
              <Sun className="h-4 w-4 shrink-0" />
              <span>Eau de pluie</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step" className="mt-4">
            <StepSimulator />
          </TabsContent>
          <TabsContent value="reut" className="mt-4">
            <ReutSimulator />
          </TabsContent>
          <TabsContent value="rainwater" className="mt-4">
            <RainwaterSimulator />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
