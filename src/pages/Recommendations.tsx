import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingDown, DollarSign } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { mockRecommendations } from "@/lib/mock-data";

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

export default function Recommendations() {
  return (
    <div className="space-y-6">
      <PageMeta title="Recommandations — HydroScan" description="Découvrez les recommandations personnalisées pour réduire votre empreinte eau." />
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Recommandations IA</h1>
        <p className="text-muted-foreground">
          Suggestions d'optimisation basées sur l'analyse de vos données
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-card gradient-water">
          <CardContent className="p-5 text-primary-foreground">
            <TrendingDown className="h-6 w-6" />
            <p className="mt-2 text-3xl font-bold">
              {mockRecommendations.reduce((s, r) => s + r.savingsM3, 0).toLocaleString("fr-FR")} m³
            </p>
            <p className="text-sm opacity-90">Économies potentielles annuelles</p>
          </CardContent>
        </Card>
        <Card className="shadow-card gradient-water">
          <CardContent className="p-5 text-primary-foreground">
            <DollarSign className="h-6 w-6" />
            <p className="mt-2 text-3xl font-bold">
              {mockRecommendations.reduce((s, r) => s + r.savingsCost, 0).toLocaleString("fr-FR")} TND
            </p>
            <p className="text-sm opacity-90">Économies financières estimées</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations list */}
      <div className="space-y-4">
        {mockRecommendations.map((rec) => (
          <Card key={rec.id} className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <Lightbulb className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{rec.title}</h3>
                    <Badge variant={priorityVariant[rec.priority]}>
                      {priorityLabel[rec.priority]}
                    </Badge>
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
