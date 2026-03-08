import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingDown, DollarSign, Loader2, User, Factory, Wheat, ShoppingCart, AlertTriangle, Info } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { useUserRole, useWaterConsumption, useOrganization } from "@/hooks/useOrgData";
import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { generateProfileRecommendations, detectProfile, getDominantComponent, type UserProfile, type WFRecommendation } from "@/lib/wf-recommendations";
import { WFN_DISCLAIMER } from "@/lib/wf-sustainability";

const priorityVariant = {
  high: "destructive" as const,
  medium: "secondary" as const,
  low: "outline" as const,
};
const priorityLabel = {
  high: "Priorité haute",
  medium: "Priorité moyenne",
  low: "Priorité basse",
};

const profileLabels: Record<UserProfile, { label: string; icon: typeof Factory }> = {
  enterprise: { label: "Entreprise", icon: Factory },
  agriculture: { label: "Agriculture", icon: Wheat },
  consumer: { label: "Consommateur", icon: ShoppingCart },
};

const componentLabel: Record<string, string> = {
  blue: "Eau Bleue",
  green: "Eau Verte",
  grey: "Eau Grise",
};

const COST_PER_M3 = 2.5; // TND/m³

export default function Recommendations() {
  const { data: role } = useUserRole();
  const { data: consumption, isLoading } = useWaterConsumption(role?.organization_id);
  const { data: org } = useOrganization(role?.organization_id);

  const detectedProfile = detectProfile(org?.sector);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const profile = activeProfile ?? detectedProfile;

  const { recommendations, totalM3, breakdown, dominant } = useMemo(() => {
    let blue = 0, green = 0, grey = 0;
    for (const e of consumption || []) {
      const vol = Number(e.volume_m3) || 0;
      const src = (e.source || "").toLowerCase();
      if (src.includes("pluie") || src.includes("vert")) green += vol;
      else if (src.includes("gris") || src.includes("recycl")) grey += vol;
      else blue += vol;
    }
    const totalM3 = blue + green + grey;
    const bd = { blue, green, grey };
    const recs = generateProfileRecommendations(totalM3, bd, profile);
    return { recommendations: recs, totalM3, breakdown: bd, dominant: getDominantComponent(bd) };
  }, [consumption, profile]);

  const totalSavingsM3 = recommendations.reduce((s, r) => s + Math.round(totalM3 * r.savingsPercent / 100), 0);
  const totalSavingsCost = Math.round(totalSavingsM3 * COST_PER_M3);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Recommandations — HydroScan" description="Recommandations WFN personnalisées par profil pour réduire votre empreinte eau." />
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Recommandations</h1>
        <p className="text-muted-foreground">
          Suggestions basées sur le <strong>Water Footprint Assessment Manual</strong> (WFN, 2011)
        </p>
      </div>

      {/* Profile selector */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Profil détecté : <Badge variant="secondary">{profileLabels[detectedProfile].label}</Badge></span>
            {org?.sector && <span className="text-xs text-muted-foreground">({org.sector})</span>}
          </div>
          <Tabs value={profile} onValueChange={(v) => setActiveProfile(v as UserProfile)}>
            <TabsList className="grid w-full grid-cols-3">
              {(Object.keys(profileLabels) as UserProfile[]).map(p => {
                const { label, icon: Icon } = profileLabels[p];
                return (
                  <TabsTrigger key={p} value={p} className="gap-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Component dominante */}
      <div className="flex items-center gap-2 text-sm">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <span>Composante dominante : <strong>{componentLabel[dominant]}</strong> — recommandations priorisées en conséquence</span>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-card gradient-water">
          <CardContent className="p-5 text-primary-foreground">
            <TrendingDown className="h-6 w-6" />
            <p className="mt-2 text-3xl font-bold">{totalSavingsM3.toLocaleString("fr-FR")} m³</p>
            <p className="text-sm opacity-90">Économies potentielles annuelles</p>
          </CardContent>
        </Card>
        <Card className="shadow-card gradient-water">
          <CardContent className="p-5 text-primary-foreground">
            <DollarSign className="h-6 w-6" />
            <p className="mt-2 text-3xl font-bold">{totalSavingsCost.toLocaleString("fr-FR")} TND</p>
            <p className="text-sm opacity-90">Économies financières estimées</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations list */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const savingsM3 = Math.round(totalM3 * rec.savingsPercent / 100);
          const savingsCost = Math.round(savingsM3 * COST_PER_M3);
          return (
            <Card key={rec.id} className="shadow-card">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                    <Lightbulb className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{rec.title}</h3>
                      <Badge variant={priorityVariant[rec.priority]}>{priorityLabel[rec.priority]}</Badge>
                      <Badge variant="outline">{rec.category}</Badge>
                      <Badge variant="outline" className="text-xs">{componentLabel[rec.component]}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                    <div className="mt-3 flex gap-6 text-sm">
                      <span className="flex items-center gap-1">
                        <TrendingDown className="h-3.5 w-3.5 text-green-water" />
                        <strong>{savingsM3.toLocaleString("fr-FR")} m³</strong>/an ({rec.savingsPercent}%)
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-primary" />
                        <strong>{savingsCost.toLocaleString("fr-FR")} TND</strong>/an
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* WFN Disclaimer */}
      <Card className="shadow-card border-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Limites méthodologiques (WFN Manual)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-1">
            {WFN_DISCLAIMER.map((d, i) => (
              <li key={i} className="text-xs text-muted-foreground">• {d}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
