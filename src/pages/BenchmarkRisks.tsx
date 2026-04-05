import { PageMeta } from "@/components/PageMeta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, ShieldAlert, Droplets, TrendingUp, Globe2, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { loadOrgProfile } from "@/lib/org-profile";
import { useWaterConsumption, useUserRole, useSites } from "@/hooks/useOrgData";
import { useMemo } from "react";

/* ── Sector benchmarks m³/employee/year — Maghreb/Africa context ── */
const SECTOR_BENCHMARKS: Record<string, { maghreb: number; africa: number; best: number; label: string }> = {
  "Agro-alimentaire":         { maghreb: 420,  africa: 380,  best: 120, label: "Agro-alim." },
  "Textile & habillement":    { maghreb: 680,  africa: 620,  best: 180, label: "Textile" },
  "Industrie chimique":       { maghreb: 850,  africa: 790,  best: 260, label: "Chimie" },
  "Phosphate & mines":        { maghreb: 1200, africa: 1100, best: 400, label: "Mines" },
  "BTP & matériaux":          { maghreb: 310,  africa: 290,  best: 95,  label: "BTP" },
  "Huile d'olive & olives":   { maghreb: 560,  africa: 510,  best: 160, label: "Olive" },
  "Pêche & aquaculture":      { maghreb: 940,  africa: 870,  best: 280, label: "Pêche" },
  "Tourisme & hôtellerie":    { maghreb: 720,  africa: 660,  best: 200, label: "Tourisme" },
  "Agriculture & irrigation": { maghreb: 2800, africa: 2600, best: 900, label: "Agri." },
  "Papier & carton":          { maghreb: 1100, africa: 1000, best: 340, label: "Papier" },
  "Mécanique & métallurgie":  { maghreb: 290,  africa: 270,  best: 88,  label: "Mécanique" },
  "Services & bureau":        { maghreb: 45,   africa: 40,   best: 12,  label: "Services" },
  "Autre":                    { maghreb: 350,  africa: 320,  best: 100, label: "Autre" },
};

const DEFAULT_BENCHMARK = { maghreb: 400, africa: 360, best: 120, label: "Secteur" };

/* ── Risk matrix ── */
const RISKS = [
  {
    id: "regulatory",
    icon: ShieldAlert,
    color: "text-orange-500",
    bg: "bg-orange-500/10 border-orange-200",
    title: "Risque réglementaire",
    level: "Élevé",
    levelColor: "bg-orange-100 text-orange-700",
    desc: "NT 106.002 (ONAS), quotas SONEDE, normes de rejet en évolution. Amende jusqu'à 50 000 DT + suspension d'activité.",
    actions: ["Mettre en conformité DCO/DBO5", "Obtenir convention de déversement ONAS", "Auditer les seuils NT 106.002 annuellement"],
  },
  {
    id: "operational",
    icon: Droplets,
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-200",
    title: "Risque opérationnel",
    level: "Moyen",
    levelColor: "bg-blue-100 text-blue-700",
    desc: "Coupures SONEDE (délestage), dépassements de quotas industriels, pannes de forage. Impact direct sur la continuité de production.",
    actions: ["Installer une citerne tampon (3–5 j autonomie)", "Diversifier les sources (forage + réseau)", "Plan de continuité eau pour l'été"],
  },
  {
    id: "climate",
    icon: TrendingUp,
    color: "text-red-500",
    bg: "bg-red-500/10 border-red-200",
    title: "Risque climatique",
    level: "Critique",
    levelColor: "bg-red-100 text-red-700",
    desc: "La Tunisie perd ~1% de ses ressources en eau renouvelables/an. Le stress hydrique (WSI 4.2/5) devrait atteindre 4.6 d'ici 2035.",
    actions: ["Réduire l'intensité eau de 20% d'ici 2027", "Investir dans le recyclage/REUT", "Adopter des équipements haute efficacité"],
  },
  {
    id: "market",
    icon: Globe2,
    color: "text-purple-500",
    bg: "bg-purple-500/10 border-purple-200",
    title: "Risque marché / réputation",
    level: "Moyen",
    levelColor: "bg-purple-100 text-purple-700",
    desc: "Les clients européens (UE, GRI, CSRD) exigent une déclaration d'empreinte eau. Sans rapport ISO 14046, perte de marchés export.",
    actions: ["Produire un rapport GRI 303 annuel", "Afficher l'éco-score produit", "Certifier ISO 14046 d'ici 2026"],
  },
];

/* ── Regional comparison data (all sectors) ── */
const REGION_DATA = [
  { region: "Tunisie",      wsi: 4.2, avgM3: 580,  color: "#ef4444" },
  { region: "Maroc",        wsi: 3.8, avgM3: 520,  color: "#f97316" },
  { region: "Algérie",      wsi: 3.5, avgM3: 490,  color: "#f97316" },
  { region: "Égypte",       wsi: 4.5, avgM3: 640,  color: "#ef4444" },
  { region: "Afrique sub.", wsi: 2.1, avgM3: 410,  color: "#eab308" },
  { region: "Méditerranée", wsi: 2.6, avgM3: 360,  color: "#84cc16" },
];

function RiskCard({ risk }: { risk: typeof RISKS[0] }) {
  return (
    <Card className={`border ${risk.bg}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <risk.icon className={`h-4 w-4 ${risk.color}`} />
            {risk.title}
          </CardTitle>
          <Badge className={`text-xs shrink-0 ${risk.levelColor} border-0`}>{risk.level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">{risk.desc}</p>
        <div className="space-y-1">
          {risk.actions.map((a) => (
            <div key={a} className="flex items-start gap-1.5 text-xs">
              <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
              <span>{a}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function BenchmarkRisks() {
  const { data: role } = useUserRole();
  const { data: consumption = [] } = useWaterConsumption(role?.organization_id);
  const { data: sites = [] } = useSites(role?.organization_id);
  const profile = loadOrgProfile();

  const bench = SECTOR_BENCHMARKS[profile.sector] ?? DEFAULT_BENCHMARK;

  const totalM3 = useMemo(() =>
    consumption.reduce((s, c) => s + Number(c.volume_m3), 0),
    [consumption]
  );

  const employeeCount = Math.max(sites.length * 25, 10);
  const yourIntensity = employeeCount > 0 ? Math.round(totalM3 / employeeCount) : 0;

  const vsmaghreb = bench.maghreb > 0 ? Math.round(((yourIntensity - bench.maghreb) / bench.maghreb) * 100) : 0;
  const percentile = yourIntensity <= bench.best ? 5 :
    yourIntensity <= bench.maghreb * 0.7 ? 20 :
    yourIntensity <= bench.maghreb ? 40 :
    yourIntensity <= bench.maghreb * 1.3 ? 65 : 85;

  const maxBar = Math.max(...REGION_DATA.map((r) => r.avgM3)) * 1.2;

  return (
    <div className="space-y-6">
      <PageMeta title="Benchmark & Risques — HydroScan" description="Positionnez-vous par rapport aux moyennes sectorielles et identifiez vos risques eau." />

      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Benchmark & Risques</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Positionnement sectoriel Maghreb/Afrique et analyse des risques liés à l'eau.
        </p>
      </div>

      {/* Sector KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className={yourIntensity <= bench.maghreb ? "border-emerald-500/40 bg-emerald-500/5" : "border-orange-500/40 bg-orange-500/5"}>
          <CardHeader className="pb-1">
            <CardDescription className="text-xs">Votre intensité eau</CardDescription>
            <CardTitle className="text-3xl font-black">{yourIntensity.toLocaleString("fr-FR")}<span className="text-sm font-normal text-muted-foreground ml-1">m³/emp.</span></CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={yourIntensity <= bench.maghreb ? "bg-emerald-100 text-emerald-700 border-0" : "bg-orange-100 text-orange-700 border-0"}>
              {vsmaghreb > 0 ? `+${vsmaghreb}%` : `${vsmaghreb}%`} vs moyenne Maghreb
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardDescription className="text-xs">Moyenne secteur Maghreb</CardDescription>
            <CardTitle className="text-3xl font-black">{bench.maghreb.toLocaleString("fr-FR")}<span className="text-sm font-normal text-muted-foreground ml-1">m³/emp.</span></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{profile.sector || "Tous secteurs"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardDescription className="text-xs">Percentile secteur</CardDescription>
            <CardTitle className="text-3xl font-black text-primary">Top {percentile}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Meilleur du secteur : {bench.best} m³/emp.</p>
          </CardContent>
        </Card>
      </div>

      {/* Benchmark bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Positionnement sectoriel — {profile.sector || "Secteur non renseigné"}
          </CardTitle>
          <CardDescription>Intensité eau (m³/employé/an) — source WFN + données MENA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Votre entreprise", value: yourIntensity, color: "bg-primary", bold: true },
            { label: `Moyenne Maghreb (${bench.label})`, value: bench.maghreb, color: "bg-orange-400", bold: false },
            { label: `Moyenne Afrique (${bench.label})`, value: bench.africa, color: "bg-amber-400", bold: false },
            { label: "Meilleur de classe", value: bench.best, color: "bg-emerald-500", bold: false },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={item.bold ? "font-semibold" : "text-muted-foreground"}>{item.label}</span>
                <span className={item.bold ? "font-bold" : ""}>{item.value.toLocaleString("fr-FR")} m³/emp.</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${item.color}`}
                  style={{ width: `${Math.min((item.value / (bench.maghreb * 2)) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2 flex items-start gap-1">
            <Info className="h-3 w-3 shrink-0 mt-0.5" />
            L'intensité est calculée sur la base de {employeeCount} employés estimés ({sites.length} site{sites.length > 1 ? "s" : ""}). Affinez dans Paramètres → Organisation.
          </p>
        </CardContent>
      </Card>

      {/* Regional comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-primary" />
            Contexte régional — Stress hydrique & intensité eau
          </CardTitle>
          <CardDescription>Toutes industries confondues — indice WSI WRI Aqueduct 2023</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {REGION_DATA.map((r) => (
            <div key={r.region} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground w-28">{r.region}</span>
                <span className="text-muted-foreground">WSI {r.wsi.toFixed(1)}</span>
                <span className="font-medium">{r.avgM3} m³/emp.</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(r.avgM3 / maxBar) * 100}%`, backgroundColor: r.color }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risk matrix */}
      <div>
        <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Matrice des risques eau
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {RISKS.map((r) => <RiskCard key={r.id} risk={r} />)}
        </div>
      </div>

      {/* Improvement potential */}
      {yourIntensity > bench.best && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Potentiel d'amélioration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3 text-center">
              {[
                { label: "Pour atteindre la moyenne Maghreb", saving: Math.max(0, yourIntensity - bench.maghreb) * employeeCount, target: bench.maghreb },
                { label: "Pour atteindre la moyenne Afrique", saving: Math.max(0, yourIntensity - bench.africa) * employeeCount, target: bench.africa },
                { label: "Pour atteindre le meilleur de classe", saving: Math.max(0, yourIntensity - bench.best) * employeeCount, target: bench.best },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border bg-background p-3 space-y-1">
                  <p className="text-xs text-muted-foreground leading-tight">{item.label}</p>
                  <p className="text-lg font-bold text-primary">{item.saving.toLocaleString("fr-FR")} m³/an</p>
                  <p className="text-xs text-muted-foreground">cible : {item.target} m³/emp.</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
