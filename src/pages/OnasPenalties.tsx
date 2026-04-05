import { useState, useMemo } from "react";
import { useCurrency } from "@/contexts/Currency";
import { PageMeta } from "@/components/PageMeta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, FlaskConical, Info, TrendingDown } from "lucide-react";

/* ── ONAS NT 106.002 standards + penalty tariffs ── */
const ONAS_STANDARDS = [
  {
    id: "dbo5",
    name: "DBO₅",
    fullName: "Demande Biochimique en Oxygène (5 jours)",
    cMax: 30,
    unit: "mg/L",
    penaltyDtPerKg: 15,
    sector: "Tous secteurs",
    icon: "🧫",
  },
  {
    id: "dco",
    name: "DCO",
    fullName: "Demande Chimique en Oxygène",
    cMax: 90,
    unit: "mg/L",
    penaltyDtPerKg: 8,
    sector: "Tous secteurs",
    icon: "⚗️",
  },
  {
    id: "mes",
    name: "MES",
    fullName: "Matières En Suspension",
    cMax: 30,
    unit: "mg/L",
    penaltyDtPerKg: 10,
    sector: "Tous secteurs",
    icon: "🌊",
  },
  {
    id: "azote",
    name: "Azote total",
    fullName: "Azote total (NTK)",
    cMax: 30,
    unit: "mg/L",
    penaltyDtPerKg: 25,
    sector: "Agroalimentaire / IAA",
    icon: "🌿",
  },
  {
    id: "phosphore",
    name: "Phosphore",
    fullName: "Phosphore total (P)",
    cMax: 10,
    unit: "mg/L",
    penaltyDtPerKg: 50,
    sector: "Agroalimentaire / IAA",
    icon: "🔴",
  },
  {
    id: "huiles",
    name: "Huiles & Graisses",
    fullName: "Huiles minérales et végétales",
    cMax: 30,
    unit: "mg/L",
    penaltyDtPerKg: 20,
    sector: "Industrie / Hôtellerie",
    icon: "🛢️",
  },
  {
    id: "chrome",
    name: "Chrome total",
    fullName: "Chrome total (Cr)",
    cMax: 0.1,
    unit: "mg/L",
    penaltyDtPerKg: 500,
    sector: "Textile / Tannerie",
    icon: "⚙️",
  },
  {
    id: "detergents",
    name: "Détergents",
    fullName: "Agents tensioactifs anioniques",
    cMax: 5,
    unit: "mg/L",
    penaltyDtPerKg: 30,
    sector: "Textile / Chimie",
    icon: "🫧",
  },
];

interface PollutantEntry {
  concentration: string;
}

export default function OnasPenalties() {
  const { format, symbol } = useCurrency();
  const [volumeJour, setVolumeJour] = useState("50");
  const [joursAn, setJoursAn] = useState("250");
  const [entries, setEntries] = useState<Record<string, PollutantEntry>>(
    Object.fromEntries(ONAS_STANDARDS.map((p) => [p.id, { concentration: "" }]))
  );
  const [showDetails, setShowDetails] = useState(false);

  const volJour = parseFloat(volumeJour) || 0;
  const jours = parseFloat(joursAn) || 250;

  const results = useMemo(() => {
    return ONAS_STANDARDS.map((pol) => {
      const cEff = parseFloat(entries[pol.id]?.concentration || "0") || 0;
      const excess = Math.max(0, cEff - pol.cMax);
      const dailyExcessLoad = (excess * volJour) / 1000; // kg/jour
      const annualExcessLoad = dailyExcessLoad * jours; // kg/an
      const annualPenalty = annualExcessLoad * pol.penaltyDtPerKg; // DT/an
      const ratio = pol.cMax > 0 ? (cEff / pol.cMax) * 100 : 0;
      const status: "ok" | "warning" | "critical" =
        cEff === 0 ? "ok" : excess > pol.cMax ? "critical" : excess > 0 ? "warning" : "ok";
      return { ...pol, cEff, excess, dailyExcessLoad, annualExcessLoad, annualPenalty, ratio, status };
    });
  }, [entries, volJour, jours]);

  const totalAnnualPenalty = results.reduce((s, r) => s + r.annualPenalty, 0);
  const totalAnnualExcessLoad = results.reduce((s, r) => s + r.annualExcessLoad, 0);
  const nonCompliantCount = results.filter((r) => r.status !== "ok" && r.cEff > 0).length;
  const filledCount = results.filter((r) => r.cEff > 0).length;

  const worstPollutant = results
    .filter((r) => r.annualPenalty > 0)
    .sort((a, b) => b.annualPenalty - a.annualPenalty)[0];

  function statusBadge(r: (typeof results)[0]) {
    if (r.cEff === 0) return <Badge variant="outline" className="text-xs text-muted-foreground">Non renseigné</Badge>;
    if (r.status === "ok") return <Badge className="text-xs bg-emerald-500 hover:bg-emerald-600">Conforme</Badge>;
    if (r.status === "warning") return <Badge variant="destructive" className="text-xs">Dépassement +{Math.round((r.cEff / r.cMax - 1) * 100)}%</Badge>;
    return <Badge variant="destructive" className="text-xs">Critique ×{(r.cEff / r.cMax).toFixed(1)}</Badge>;
  }

  return (
    <>
      <PageMeta
        title="Pénalités ONAS — HydroScan"
        description="Simulez vos pénalités ONAS selon la norme NT 106.002 et identifiez vos polluants critiques."
      />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Pénalités ONAS</h1>
            <p className="text-muted-foreground text-sm">
              Simulateur basé sur la norme tunisienne NT 106.002 — Rejets d'eaux usées industrielles
            </p>
          </div>
          <Badge variant="outline" className="self-start gap-1.5 text-xs border-primary/40 text-primary">
            <Info className="h-3 w-3" /> NT 106.002 (INNORPI Tunisie)
          </Badge>
        </div>

        {/* KPI Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className={totalAnnualPenalty > 0 ? "border-destructive/40 bg-destructive/5" : ""}>
            <CardHeader className="pb-2">
              <CardDescription>Pénalité estimée / an</CardDescription>
              <CardTitle className={`text-2xl ${totalAnnualPenalty > 0 ? "text-destructive" : ""}`}>
                {totalAnnualPenalty > 0
                  ? format(Math.round(totalAnnualPenalty))
                  : filledCount === 0 ? "—" : `0 ${symbol} ✓`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {totalAnnualPenalty > 0
                  ? `${format(Math.round(totalAnnualPenalty / 12))}/mois`
                  : "Renseignez les concentrations"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Charge polluante excess.</CardDescription>
              <CardTitle className="text-2xl">
                {totalAnnualExcessLoad > 0
                  ? `${Math.round(totalAnnualExcessLoad).toLocaleString("fr-FR")} kg/an`
                  : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">au-dessus des seuils NT 106.002</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Polluants hors norme</CardDescription>
              <CardTitle className={`text-2xl ${nonCompliantCount > 0 ? "text-orange-500" : ""}`}>
                {filledCount > 0 ? `${nonCompliantCount} / ${filledCount}` : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nonCompliantCount === 0 && filledCount > 0 && (
                <Badge className="text-xs bg-emerald-500">Tous conformes</Badge>
              )}
              {nonCompliantCount > 0 && (
                <Badge variant="destructive" className="text-xs">{nonCompliantCount} dépassement(s)</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Polluant le plus coûteux</CardDescription>
              <CardTitle className="text-2xl truncate">
                {worstPollutant ? worstPollutant.name : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {worstPollutant && (
                <p className="text-xs text-destructive font-medium">
                  {format(Math.round(worstPollutant.annualPenalty))}/an
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Volume settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              Paramètres de rejet
            </CardTitle>
            <CardDescription>
              Volume journalier déversé vers l'égout ONAS ou milieu naturel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Volume rejeté / jour (m³/j)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="ex: 50"
                  value={volumeJour}
                  onChange={(e) => setVolumeJour(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Débit moyen journalier des eaux usées</p>
              </div>
              <div className="space-y-2">
                <Label>Jours de production / an</Label>
                <Input
                  type="number"
                  min="1"
                  max="365"
                  placeholder="ex: 250"
                  value={joursAn}
                  onChange={(e) => setJoursAn(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Nombre de jours d'activité effective</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex flex-col justify-center">
                <p className="text-xs font-semibold text-primary mb-1">Volume annuel calculé</p>
                <p className="text-2xl font-bold">
                  {(volJour * jours).toLocaleString("fr-FR")} m³/an
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(volJour * jours * 12 / jours).toFixed(0)} m³/mois en moyenne
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pollutant concentration inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Concentrations mesurées — NT 106.002
            </CardTitle>
            <CardDescription>
              Saisissez les concentrations de votre dernier auto-contrôle ou analyse ONAS.
              Laissez vide si le polluant ne s'applique pas à votre activité.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Polluant</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Secteur</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Seuil NT 106.002</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground w-36">Concentration mesurée</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Statut</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Pénalité/an</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((pol) => (
                    <tr key={pol.id} className={`border-b last:border-0 ${pol.status !== "ok" && pol.cEff > 0 ? "bg-destructive/5" : ""}`}>
                      <td className="px-4 py-3">
                        <span className="mr-1.5">{pol.icon}</span>
                        <span className="font-medium">{pol.name}</span>
                        <p className="text-xs text-muted-foreground">{pol.fullName}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{pol.sector}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className="text-xs font-mono">
                          ≤ {pol.cMax} {pol.unit}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="—"
                            className="h-8 text-center text-sm w-24"
                            value={entries[pol.id]?.concentration || ""}
                            onChange={(e) =>
                              setEntries((prev) => ({
                                ...prev,
                                [pol.id]: { concentration: e.target.value },
                              }))
                            }
                          />
                          <span className="text-xs text-muted-foreground">{pol.unit}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{statusBadge(pol)}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {pol.annualPenalty > 0 ? (
                          <span className="text-destructive">
                            {format(Math.round(pol.annualPenalty))}
                          </span>
                        ) : pol.cEff > 0 ? (
                          <span className="text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> 0 {symbol}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {totalAnnualPenalty > 0 && (
                  <tfoot>
                    <tr className="bg-destructive/10 border-t-2 border-destructive/30">
                      <td colSpan={5} className="px-4 py-3 font-bold text-right text-destructive">
                        Total pénalités estimées / an
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-destructive text-base">
                        {format(Math.round(totalAnnualPenalty))}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tariff reference */}
        <div className="flex items-start gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground gap-1"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Info className="h-3.5 w-3.5" />
            {showDetails ? "Masquer" : "Afficher"} les tarifs de référence ONAS
          </Button>
        </div>

        {showDetails && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Tarifs pénalité ONAS de référence (DT/kg excès)</CardTitle>
              <CardDescription className="text-xs">
                Basés sur les grilles tarifaires ONAS 2024. Ces tarifs peuvent varier selon le contrat de déversement.
                Vérifiez votre convention ONAS pour les montants applicables à votre établissement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {ONAS_STANDARDS.map((p) => (
                  <div key={p.id} className="rounded-lg border border-border bg-muted/30 px-3 py-2 flex justify-between items-center">
                    <span className="text-sm font-medium">{p.icon} {p.name}</span>
                    <span className="text-xs font-mono text-primary">{p.penaltyDtPerKg} DT/kg</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {totalAnnualPenalty > 0 && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-primary" />
                Leviers de réduction prioritaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results
                .filter((r) => r.annualPenalty > 0)
                .sort((a, b) => b.annualPenalty - a.annualPenalty)
                .slice(0, 3)
                .map((r, i) => (
                  <div key={r.id} className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
                    <span className="font-display text-2xl font-extrabold text-primary/30 leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-semibold text-sm">{r.icon} Réduire {r.name} de {r.cEff} → ≤ {r.cMax} {r.unit}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Économie potentielle :{" "}
                        <span className="font-medium text-emerald-600">
                          {Math.round(r.annualPenalty).toLocaleString("fr-FR")} DT/an
                        </span>
                        {" "}— Charge excédentaire : {r.annualExcessLoad.toFixed(0)} kg/an
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {r.id === "dbo5" && "→ Prétraitement biologique, filière anaérobie, bassin tampon"}
                        {r.id === "dco" && "→ Coagulation-floculation, traitement physico-chimique"}
                        {r.id === "mes" && "→ Décanteur primaire, filtre à sable, dégrillage fin"}
                        {r.id === "azote" && "→ Nitrification/dénitrification, stripping à l'air"}
                        {r.id === "phosphore" && "→ Précipitation chimique (chaux / sulfate d'aluminium)"}
                        {r.id === "huiles" && "→ Séparateur d'huiles, dégraisseur, flottation DAF"}
                        {r.id === "chrome" && "→ Réduction Cr(VI)→Cr(III), précipitation hydroxyde"}
                        {r.id === "detergents" && "→ Substitution produits, récupération bains de lavage"}
                      </p>
                    </div>
                  </div>
                ))}
              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                💡 Une réduction combinée de toutes les non-conformités permettrait d'économiser{" "}
                <strong className="text-foreground">
                  {Math.round(totalAnnualPenalty).toLocaleString("fr-FR")} DT/an
                </strong>{" "}
                et de réduire votre empreinte eau grise de{" "}
                <strong className="text-foreground">
                  {Math.round(results.reduce((s, r) => s + r.annualExcessLoad, 0)).toLocaleString("fr-FR")} kg/an
                </strong>{" "}
                de charge polluante.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
