import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { Target, TrendingDown, Zap, Recycle, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Static recommendations based on common water-saving actions
const defaultRecommendations = [
  {
    id: 1,
    title: "Recyclage des eaux de refroidissement",
    description: "Installer un système de recirculation pour les eaux de refroidissement du processus industriel.",
    savingsM3: 3200,
    savingsCost: 8500,
    priority: "high" as const,
    category: "Recyclage",
  },
  {
    id: 2,
    title: "Irrigation goutte-à-goutte",
    description: "Remplacer l'irrigation par aspersion par un système goutte-à-goutte pour réduire la consommation.",
    savingsM3: 2800,
    savingsCost: 6200,
    priority: "high" as const,
    category: "Irrigation",
  },
  {
    id: 3,
    title: "Détection de fuites",
    description: "Installer des capteurs IoT pour la détection précoce des fuites dans le réseau de distribution.",
    savingsM3: 1500,
    savingsCost: 4000,
    priority: "medium" as const,
    category: "Maintenance",
  },
  {
    id: 4,
    title: "Traitement des eaux grises",
    description: "Mettre en place un système de traitement des eaux grises pour réutilisation dans le nettoyage.",
    savingsM3: 900,
    savingsCost: 2400,
    priority: "medium" as const,
    category: "Recyclage",
  },
];

export default function ActionPlan() {
  const { t } = useI18n();
  const [objectives, setObjectives] = useState([
    { label: "Réduction consommation totale", target: 15, current: 0, unit: "%" },
    { label: "Recyclage eau industrielle", target: 30, current: 0, unit: "%" },
  ]);
  const [completedActions, setCompletedActions] = useState<number[]>([]);
  const [showAddObj, setShowAddObj] = useState(false);
  const [newObjLabel, setNewObjLabel] = useState("");
  const [newObjTarget, setNewObjTarget] = useState("");

  const addObjective = () => {
    if (!newObjLabel.trim() || !newObjTarget) return;
    setObjectives([...objectives, {
      label: newObjLabel.trim(),
      target: parseFloat(newObjTarget),
      current: 0,
      unit: "%",
    }]);
    setNewObjLabel("");
    setNewObjTarget("");
    setShowAddObj(false);
  };

  const toggleAction = (id: number) => {
    setCompletedActions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <PageMeta title="Plan d'Action — HydroScan" description="Actions concrètes pour réduire votre empreinte eau" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("actionPlan.title")}</h1>
            <p className="text-muted-foreground">{t("actionPlan.subtitle")}</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setShowAddObj(!showAddObj)}>
            <Plus className="h-4 w-4" />
            Ajouter un objectif
          </Button>
        </div>

        {showAddObj && (
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex gap-3 items-end flex-wrap">
                <div className="space-y-1 flex-1 min-w-[200px]">
                  <Label className="text-xs">Objectif</Label>
                  <Input placeholder="ex: Réduction eau bleue" value={newObjLabel} onChange={(e) => setNewObjLabel(e.target.value)} />
                </div>
                <div className="space-y-1 w-[120px]">
                  <Label className="text-xs">Cible (%)</Label>
                  <Input type="number" placeholder="ex: 20" value={newObjTarget} onChange={(e) => setNewObjTarget(e.target.value)} />
                </div>
                <Button size="sm" onClick={addObjective}>Ajouter</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Objectifs */}
        <div className="grid gap-4 md:grid-cols-3">
          {objectives.map((obj, i) => {
            const progress = obj.target > 0 ? Math.round((obj.current / obj.target) * 100) : 0;
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
                  <p className="text-xs text-muted-foreground mt-1">{progress}% atteint</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recommandations actionnables */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("actionPlan.actions")}</h2>
          {defaultRecommendations.map((rec) => {
            const isDone = completedActions.includes(rec.id);
            const Icon = rec.category === "Recyclage" ? Recycle : rec.category === "Irrigation" ? TrendingDown : Zap;
            return (
              <Card key={rec.id} className={`flex items-start gap-4 p-4 transition-opacity ${isDone ? "opacity-50" : ""}`}>
                <div className={`rounded-lg p-2 shrink-0 ${rec.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${isDone ? "line-through" : ""}`}>{rec.title}</h3>
                    <Badge variant={rec.priority === "high" ? "destructive" : "secondary"} className="text-[10px]">
                      {rec.priority === "high" ? "Prioritaire" : "Modéré"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{rec.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-primary font-medium">-{rec.savingsM3.toLocaleString("fr-FR")} m³/an</span>
                    <span className="text-muted-foreground">-{rec.savingsCost.toLocaleString("fr-FR")} TND/an</span>
                  </div>
                </div>
                <Button
                  variant={isDone ? "default" : "outline"}
                  size="sm"
                  className="shrink-0 gap-1"
                  onClick={() => toggleAction(rec.id)}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isDone ? "Fait" : "Marquer fait"}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        <Card className="shadow-card bg-primary/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">Potentiel d'économie total</p>
                <p className="text-2xl font-bold text-primary">
                  {defaultRecommendations.reduce((s, r) => s + r.savingsM3, 0).toLocaleString("fr-FR")} m³/an
                </p>
                <p className="text-sm text-muted-foreground">
                  soit {defaultRecommendations.reduce((s, r) => s + r.savingsCost, 0).toLocaleString("fr-FR")} TND/an d'économies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
