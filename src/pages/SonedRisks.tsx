import { useState, useMemo } from "react";
import { PageMeta } from "@/components/PageMeta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Info, Droplets, TrendingUp } from "lucide-react";

/* ── Tunisian seasonal restriction calendar ── */
const SEASONAL_CALENDAR = [
  { month: "Janvier",   risk: "faible",   restriction: false, note: "Période hivernale – approvisionnement normal" },
  { month: "Février",   risk: "faible",   restriction: false, note: "Recharge nappes si pluviométrie normale" },
  { month: "Mars",      risk: "modéré",   restriction: false, note: "Début de la saison agricole" },
  { month: "Avril",     risk: "modéré",   restriction: false, note: "Demande agricole en hausse" },
  { month: "Mai",       risk: "élevé",    restriction: true,  note: "SONEDE peut appliquer des quotas journaliers aux industriels" },
  { month: "Juin",      risk: "critique", restriction: true,  note: "Restrictions fréquentes – heures de pointe 7h–13h / 18h–23h" },
  { month: "Juillet",   risk: "extrême",  restriction: true,  note: "Coupures tournantes possibles – anticiper stockage 72h" },
  { month: "Août",      risk: "extrême",  restriction: true,  note: "Période la plus critique – pic touristique + sécheresse" },
  { month: "Septembre", risk: "critique", restriction: true,  note: "Retour progressif – restrictions maintenues jusqu'à mi-Sept" },
  { month: "Octobre",   risk: "modéré",   restriction: false, note: "Premières pluies d'automne" },
  { month: "Novembre",  risk: "faible",   restriction: false, note: "Nappes en recharge" },
  { month: "Décembre",  risk: "faible",   restriction: false, note: "Situation normalisée" },
];

const RISK_COLORS: Record<string, string> = {
  faible:   "bg-emerald-500",
  modéré:   "bg-amber-400",
  élevé:    "bg-orange-500",
  critique: "bg-red-500",
  extrême:  "bg-red-700",
};
const RISK_BADGE_VARIANT: Record<string, string> = {
  faible:   "bg-emerald-100 text-emerald-700 border-emerald-300",
  modéré:   "bg-amber-100 text-amber-700 border-amber-300",
  élevé:    "bg-orange-100 text-orange-700 border-orange-300",
  critique: "bg-red-100 text-red-700 border-red-300",
  extrême:  "bg-red-200 text-red-800 border-red-400",
};

/* ── Tunisian basin quota reference data ── */
const BASIN_QUOTAS = [
  { basin: "Grand Tunis",     industryM3Year: 12000, agriPct: 30, restMonths: [5,6,7,8] },
  { basin: "Cap Bon",         industryM3Year: 8000,  agriPct: 45, restMonths: [5,6,7,8,9] },
  { basin: "Médjerda",        industryM3Year: 15000, agriPct: 60, restMonths: [6,7,8] },
  { basin: "Sahel / Sousse",  industryM3Year: 9000,  agriPct: 35, restMonths: [5,6,7,8,9] },
  { basin: "Sfax",            industryM3Year: 5000,  agriPct: 25, restMonths: [4,5,6,7,8,9,10] },
  { basin: "Kairouan",        industryM3Year: 6000,  agriPct: 70, restMonths: [4,5,6,7,8,9] },
  { basin: "Sidi Bouzid",     industryM3Year: 4000,  agriPct: 80, restMonths: [4,5,6,7,8,9,10] },
  { basin: "Gafsa",           industryM3Year: 3000,  agriPct: 55, restMonths: [3,4,5,6,7,8,9,10] },
  { basin: "Gabès",           industryM3Year: 4500,  agriPct: 40, restMonths: [4,5,6,7,8,9] },
];

export default function SonedRisks() {
  const currentMonth = new Date().getMonth(); // 0-indexed
  const [consumedM3, setConsumedM3] = useState("8500");
  const [quotaM3, setQuotaM3] = useState("12000");
  const [selectedBasin, setSelectedBasin] = useState("Grand Tunis");
  const [storageM3, setStorageM3] = useState("50");
  const [dailyNeedM3, setDailyNeedM3] = useState("45");

  const consumed = parseFloat(consumedM3) || 0;
  const quota = parseFloat(quotaM3) || 0;
  const storage = parseFloat(storageM3) || 0;
  const daily = parseFloat(dailyNeedM3) || 0;

  const quotaPct = quota > 0 ? Math.min((consumed / quota) * 100, 100) : 0;
  const autonomyDays = daily > 0 ? Math.floor(storage / daily) : 0;
  const monthData = SEASONAL_CALENDAR[currentMonth];
  const nextRestrictedMonths = SEASONAL_CALENDAR.filter((_, i) => i > currentMonth && _.restriction).slice(0, 2);

  const basinData = BASIN_QUOTAS.find((b) => b.basin === selectedBasin);
  const isRestrictedNow = basinData?.restMonths.includes(currentMonth + 1) ?? false;

  const riskLevel = useMemo(() => {
    if (quotaPct >= 90 && isRestrictedNow) return "extrême";
    if (quotaPct >= 90 || (quotaPct >= 75 && isRestrictedNow)) return "critique";
    if (quotaPct >= 75 || isRestrictedNow) return "élevé";
    if (quotaPct >= 50) return "modéré";
    return "faible";
  }, [quotaPct, isRestrictedNow]);

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    if (autonomyDays < 3) recs.push("⚠ Stockage insuffisant — prévoir au minimum 3 jours d'autonomie (citerne, bâche à eau).");
    if (autonomyDays < 1) recs.push("🚨 Aucun stock d'eau opérationnel détecté — risque d'arrêt production.");
    if (quotaPct >= 80) recs.push("📉 Quota annuel presque épuisé — réduire les usages non critiques dès maintenant.");
    if (isRestrictedNow) recs.push("🕐 Période de restriction en cours — planifiez les usages intensifs la nuit (22h–6h).");
    if (currentMonth >= 4 && currentMonth <= 8) recs.push("💧 Saison sèche — activez le plan de sobriété hydrique : recirculation, REUT, réduction lavage.");
    if (basinData && basinData.agriPct > 60) recs.push("🌾 Bassin à forte pression agricole — risque de partage limité entre industrie et agriculture.");
    if (autonomyDays >= 3) recs.push("✅ Autonomie de stockage satisfaisante pour la période actuelle.");
    if (quotaPct < 50 && !isRestrictedNow) recs.push("✅ Consommation sous contrôle — continuez le suivi mensuel.");
    return recs;
  }, [quotaPct, isRestrictedNow, autonomyDays, currentMonth, basinData]);

  return (
    <>
      <PageMeta
        title="Risques opérationnels SONEDE — HydroScan"
        description="Gérez votre quota SONEDE, anticipez les restrictions saisonnières et sécurisez votre approvisionnement."
      />
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Risques opérationnels SONEDE</h1>
            <p className="text-muted-foreground text-sm">
              Suivi de quota annuel, alertes restrictions saisonnières et plan de continuité
            </p>
          </div>
          <Badge
            className={`self-start gap-1.5 text-xs border ${RISK_BADGE_VARIANT[monthData.risk]}`}
            variant="outline"
          >
            <AlertTriangle className="h-3 w-3" />
            Risque {monthData.risk} — {monthData.month}
          </Badge>
        </div>

        {/* Month alert */}
        {monthData.restriction && (
          <div className="flex items-start gap-2 rounded-lg border border-orange-300 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800 px-4 py-3 text-sm text-orange-800 dark:text-orange-300">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>{monthData.month}</strong> est une période de restriction SONEDE.{" "}
              {monthData.note}
            </span>
          </div>
        )}

        {/* KPI row */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className={quotaPct >= 80 ? "border-destructive/40 bg-destructive/5" : ""}>
            <CardHeader className="pb-2">
              <CardDescription>Quota annuel utilisé</CardDescription>
              <CardTitle className={`text-2xl ${quotaPct >= 80 ? "text-destructive" : ""}`}>
                {quotaPct.toFixed(1)}%
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={quotaPct} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {consumed.toLocaleString("fr-FR")} / {quota.toLocaleString("fr-FR")} m³
              </p>
            </CardContent>
          </Card>

          <Card className={autonomyDays < 3 ? "border-orange-400/40 bg-orange-50/40 dark:bg-orange-950/10" : ""}>
            <CardHeader className="pb-2">
              <CardDescription>Autonomie stockage</CardDescription>
              <CardTitle className={`text-2xl ${autonomyDays < 3 ? "text-orange-600" : "text-emerald-600"}`}>
                {daily > 0 ? `${autonomyDays} j` : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{storage} m³ stockés / {daily} m³/j besoins</p>
              {autonomyDays > 0 && autonomyDays < 3 && (
                <Badge className="mt-1 text-xs bg-orange-500">Insuffisant</Badge>
              )}
              {autonomyDays >= 3 && (
                <Badge className="mt-1 text-xs bg-emerald-500">Satisfaisant</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Niveau de risque global</CardDescription>
              <CardTitle className="text-2xl capitalize">{riskLevel}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`w-full h-2 rounded-full ${RISK_COLORS[riskLevel]}`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Prochaines restrictions</CardDescription>
              <CardTitle className="text-2xl">
                {nextRestrictedMonths.length > 0 ? nextRestrictedMonths[0].month : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextRestrictedMonths.map((m) => (
                <p key={m.month} className="text-xs text-muted-foreground">{m.month}</p>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Input parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="h-4 w-4 text-primary" />
              Votre situation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Bassin versant / CRDA</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedBasin}
                  onChange={(e) => {
                    setSelectedBasin(e.target.value);
                    const b = BASIN_QUOTAS.find((b) => b.basin === e.target.value);
                    if (b) setQuotaM3(String(b.industryM3Year));
                  }}
                >
                  {BASIN_QUOTAS.map((b) => (
                    <option key={b.basin} value={b.basin}>{b.basin}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Quota SONEDE alloué (m³/an)</Label>
                <Input type="number" min="0" value={quotaM3} onChange={(e) => setQuotaM3(e.target.value)} placeholder="12000" />
                <p className="text-xs text-muted-foreground">Figurant sur votre contrat de déversement</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Consommation cumulée à ce jour (m³)</Label>
                <Input type="number" min="0" value={consumedM3} onChange={(e) => setConsumedM3(e.target.value)} placeholder="8500" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Volume stocké sur site (m³)</Label>
                <Input type="number" min="0" value={storageM3} onChange={(e) => setStorageM3(e.target.value)} placeholder="50" />
                <p className="text-xs text-muted-foreground">Citernes, bâches, réservoirs tampon</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Besoin journalier minimal (m³/j)</Label>
                <Input type="number" min="0" value={dailyNeedM3} onChange={(e) => setDailyNeedM3(e.target.value)} placeholder="45" />
                <p className="text-xs text-muted-foreground">Pour maintenir la production en cas de coupure</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Seasonal calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Calendrier des risques — Tunisie</CardTitle>
            <CardDescription>
              Basé sur l'historique SONEDE des restrictions industrielles 2019–2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {SEASONAL_CALENDAR.map((m, i) => (
                <div
                  key={m.month}
                  className={`rounded-lg border p-3 ${i === currentMonth ? "border-primary ring-1 ring-primary" : "border-border"} ${m.restriction ? "bg-orange-50/50 dark:bg-orange-950/10" : "bg-muted/20"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold ${i === currentMonth ? "text-primary" : ""}`}>
                      {m.month}
                      {i === currentMonth && <span className="ml-1.5 text-xs font-normal text-primary">(maintenant)</span>}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {m.restriction ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                      <span className={`text-[0.65rem] font-medium uppercase ${RISK_BADGE_VARIANT[m.risk]} px-1.5 py-0.5 rounded border`}>
                        {m.risk}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">{m.note}</p>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 mt-4 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Source : données SONEDE et CRDA Tunisie. Les restrictions industrielles peuvent varier selon les
                décisions gouvernementales annuelles. Consultez toujours votre CRDA local pour les arrêtés en vigueur.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Basin quota table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quotas industriels de référence par bassin</CardTitle>
            <CardDescription>Volumes annuels indicatifs pour les PME industrielles — à vérifier avec votre contrat SONEDE</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bassin / CRDA</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Quota industrie réf. (m³/an)</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Part agriculture</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mois à risque</th>
                  </tr>
                </thead>
                <tbody>
                  {BASIN_QUOTAS.map((b) => (
                    <tr key={b.basin} className={`border-b last:border-0 ${b.basin === selectedBasin ? "bg-primary/5" : ""}`}>
                      <td className="px-4 py-3 font-medium">{b.basin}</td>
                      <td className="px-4 py-3 text-center">{b.industryM3Year.toLocaleString("fr-FR")}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={b.agriPct > 60 ? "destructive" : "outline"} className="text-xs">
                          {b.agriPct}%
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {b.restMonths.map((m) => SEASONAL_CALENDAR[m - 1]?.month?.substring(0, 3)).join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </>
  );
}
