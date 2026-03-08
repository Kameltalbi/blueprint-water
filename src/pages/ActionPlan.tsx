import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { Target, TrendingDown, Zap, Recycle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockRecommendations, mockObjectives } from "@/lib/mock-data";

export default function ActionPlan() {
  const { t } = useI18n();

  return (
    <>
      <PageMeta title="Plan d'Action — HydroScan" description="Actions concrètes pour réduire votre empreinte eau" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("actionPlan.title")}</h1>
          <p className="text-muted-foreground">{t("actionPlan.subtitle")}</p>
        </div>

        {/* Objectifs */}
        <div className="grid gap-4 md:grid-cols-3">
          {mockObjectives.map((obj, i) => {
            const progress = typeof obj.current === "number" && typeof obj.target === "number"
              ? Math.round((Math.abs(obj.current) / Math.abs(obj.target)) * 100)
              : 0;
            return (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardDescription>{obj.label}</CardDescription>
                  <CardTitle className="text-xl">
                    {obj.current}{obj.unit} <span className="text-sm font-normal text-muted-foreground">/ {obj.target}{obj.unit}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recommandations actionnables */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("actionPlan.actions")}</h2>
          {mockRecommendations.map((rec) => {
            const icon = rec.category === "Recyclage" ? Recycle : rec.category === "Irrigation" ? TrendingDown : Zap;
            const Icon = icon;
            return (
              <Card key={rec.id} className="flex items-start gap-4 p-4">
                <div className={`rounded-lg p-2 shrink-0 ${rec.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{rec.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-primary font-medium">-{rec.savingsM3.toLocaleString("fr-FR")} m³/an</span>
                    <span className="text-muted-foreground">-{rec.savingsCost.toLocaleString("fr-FR")} TND/an</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
