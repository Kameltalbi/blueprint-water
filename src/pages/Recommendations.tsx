import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingDown, DollarSign, Loader2 } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { useUserRole, useWaterConsumption } from "@/hooks/useOrgData";
import { useMemo } from "react";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  savingsM3: number;
  savingsCost: number;
  priority: "high" | "medium" | "low";
  category: string;
}

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

function generateRecommendations(totalM3: number, sources: Record<string, number>): Recommendation[] {
  const recs: Recommendation[] = [];
  let id = 1;

  if (totalM3 > 500) {
    recs.push({
      id: id++, title: "Recyclage des eaux de process", description: "Installer un système de recirculation pour réduire la consommation nette.",
      savingsM3: Math.round(totalM3 * 0.15), savingsCost: Math.round(totalM3 * 0.15 * 2.5), priority: "high", category: "Recyclage",
    });
  }
  if (totalM3 > 200) {
    recs.push({
      id: id++, title: "Détection de fuites IoT", description: "Capteurs connectés pour identifier les fuites en temps réel.",
      savingsM3: Math.round(totalM3 * 0.08), savingsCost: Math.round(totalM3 * 0.08 * 2.5), priority: "high", category: "Maintenance",
    });
  }
  if (sources["réseau"] > 100 || totalM3 > 300) {
    recs.push({
      id: id++, title: "Récupération d'eau de pluie", description: "Collecter les eaux pluviales pour les usages non-potables.",
      savingsM3: Math.round(totalM3 * 0.1), savingsCost: Math.round(totalM3 * 0.1 * 2.5), priority: "medium", category: "Collecte",
    });
  }
  recs.push({
    id: id++, title: "Sensibilisation du personnel", description: "Former les équipes aux gestes d'économie d'eau.",
    savingsM3: Math.round(totalM3 * 0.05), savingsCost: Math.round(totalM3 * 0.05 * 2.5), priority: "low", category: "Formation",
  });

  return recs;
}

export default function Recommendations() {
  const { data: role } = useUserRole();
  const { data: consumption, isLoading } = useWaterConsumption(role?.organization_id);

  const { recommendations, totalSavingsM3, totalSavingsCost } = useMemo(() => {
    const totalM3 = (consumption || []).reduce((s, e) => s + (Number(e.volume_m3) || 0), 0);
    const sources: Record<string, number> = {};
    for (const e of consumption || []) {
      const src = (e.source || "autre").toLowerCase();
      sources[src] = (sources[src] || 0) + (Number(e.volume_m3) || 0);
    }
    const recs = generateRecommendations(totalM3, sources);
    return {
      recommendations: recs,
      totalSavingsM3: recs.reduce((s, r) => s + r.savingsM3, 0),
      totalSavingsCost: recs.reduce((s, r) => s + r.savingsCost, 0),
    };
  }, [consumption]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Recommandations — HydroScan" description="Découvrez les recommandations personnalisées pour réduire votre empreinte eau." />
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Recommandations</h1>
        <p className="text-muted-foreground">Suggestions d'optimisation basées sur vos données réelles</p>
      </div>

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

      <div className="space-y-4">
        {recommendations.map((rec) => (
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
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                  <div className="mt-3 flex gap-6 text-sm">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="h-3.5 w-3.5 text-green-water" />
                      <strong>{rec.savingsM3.toLocaleString("fr-FR")} m³</strong>/an
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-primary" />
                      <strong>{rec.savingsCost.toLocaleString("fr-FR")} TND</strong>/an
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
