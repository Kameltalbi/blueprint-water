import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { Target, TrendingDown, Zap, Recycle, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { useUserRole, useWaterConsumption } from "@/hooks/useOrgData";

export default function ActionPlan() {
  const { t } = useI18n();
  const { data: role } = useUserRole();
  const { data: consumption, isLoading } = useWaterConsumption(role?.organization_id);

  const totalM3 = useMemo(() => (consumption || []).reduce((s, e) => s + (Number(e.volume_m3) || 0), 0), [consumption]);

  const recommendations = useMemo(() => {
    const recs = [];
    let id = 1;
    if (totalM3 > 500) recs.push({ id: id++, title: "Recyclage des eaux de refroidissement", description: "Installer un système de recirculation pour les eaux de refroidissement.", savingsM3: Math.round(totalM3 * 0.15), savingsCost: Math.round(totalM3 * 0.15 * 2.5), priority: "high" as const, category: "Recyclage" });
    if (totalM3 > 200) recs.push({ id: id++, title: "Détection de fuites", description: "Capteurs IoT pour la détection précoce des fuites.", savingsM3: Math.round(totalM3 * 0.08), savingsCost: Math.round(totalM3 * 0.08 * 2.5), priority: "high" as const, category: "Maintenance" });
    recs.push({ id: id++, title: "Traitement des eaux grises", description: "Réutilisation des eaux grises pour le nettoyage.", savingsM3: Math.round(totalM3 * 0.06), savingsCost: Math.round(totalM3 * 0.06 * 2.5), priority: "medium" as const, category: "Recyclage" });
    recs.push({ id: id++, title: "Sensibilisation", description: "Former le personnel aux gestes d'économie.", savingsM3: Math.round(totalM3 * 0.04), savingsCost: Math.round(totalM3 * 0.04 * 2.5), priority: "medium" as const, category: "Formation" });
    return recs;
  }, [totalM3]);

  const [objectives, setObjectives] = useState(() => {
    try {
      const saved = localStorage.getItem("hs_ap_objectives");
      return saved ? JSON.parse(saved) : [
        { label: "Réduction consommation totale", target: 15, baselineM3: 28000, unit: "%" },
        { label: "Recyclage eau industrielle", target: 30, baselineM3: 10000, unit: "%" },
      ];
    } catch { return []; }
  });
  const [completedActions, setCompletedActions] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("hs_ap_done");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showAddObj, setShowAddObj] = useState(false);
  const [newObjLabel, setNewObjLabel] = useState("");
  const [newObjTarget, setNewObjTarget] = useState("");
  const [newObjBaseline, setNewObjBaseline] = useState("");

  const saveObjectives = (objs: typeof objectives) => {
    setObjectives(objs);
    localStorage.setItem("hs_ap_objectives", JSON.stringify(objs));
  };

  const addObjective = () => {
    if (!newObjLabel.trim() || !newObjTarget) return;
    saveObjectives([...objectives, {
      label: newObjLabel.trim(),
      target: parseFloat(newObjTarget),
      baselineM3: parseFloat(newObjBaseline) || totalM3 || 10000,
      unit: "%",
    }]);
    setNewObjLabel(""); setNewObjTarget(""); setNewObjBaseline("");
    setShowAddObj(false);
  };

  const toggleAction = (id: number) => {
    setCompletedActions((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("hs_ap_done", JSON.stringify(next));
      return next;
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <PageMeta title="Plan d'Action — HydroScan" description="Actions concrètes pour réduire votre empreinte eau" />
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("actionPlan.title")}</h1>
            <p className="text-muted-foreground">{t("actionPlan.subtitle")}</p>
          </div>
          <Button variant="outline" className="gap-2 self-start sm:self-auto" onClick={() => setShowAddObj(!showAddObj)}>
            <Plus className="h-4 w-4" /> Ajouter un objectif
          </Button>
        </div>

        {showAddObj && (
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="grid gap-3 sm:flex sm:items-end sm:flex-wrap">
                <div className="space-y-1 sm:flex-1 sm:min-w-[200px]">
                  <Label className="text-xs">Objectif</Label>
                  <Input placeholder="ex: Réduction eau bleue" value={newObjLabel} onChange={(e) => setNewObjLabel(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:contents">
                  <div className="space-y-1">
                    <Label className="text-xs">Cible (%)</Label>
                    <Input type="number" placeholder="ex: 20" value={newObjTarget} onChange={(e) => setNewObjTarget(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Baseline (m³)</Label>
                    <Input type="number" placeholder={String(Math.round(totalM3) || 10000)} value={newObjBaseline} onChange={(e) => setNewObjBaseline(e.target.value)} />
                  </div>
                </div>
                <Button size="sm" className="w-full sm:w-auto" onClick={addObjective}>Ajouter</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {objectives.map((obj: any, i: number) => {
            const baseline = obj.baselineM3 || 1;
            const targetM3 = baseline * (1 - obj.target / 100);
            const reduction = baseline - totalM3;
            const needed = baseline - targetM3;
            const progress = needed > 0 ? Math.min(Math.max(Math.round((reduction / needed) * 100), 0), 100) : 0;
            const color = progress >= 75 ? "bg-emerald-500" : progress >= 40 ? "bg-amber-400" : "bg-destructive";
            return (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardDescription className="flex-1">{obj.label}</CardDescription>
                    <button
                      onClick={() => saveObjectives(objectives.filter((_: any, j: number) => j !== i))}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <span className="text-xs">✕</span>
                    </button>
                  </div>
                  <CardTitle className="text-xl">{progress}% <span className="text-sm font-normal text-muted-foreground">/ {obj.target}% cible</span></CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <Progress value={progress} className={`h-2 [&>div]:${color}`} />
                  <p className="text-xs text-muted-foreground">
                    Baseline : {(obj.baselineM3 || 0).toLocaleString("fr-FR")} m³ · Actuel : {Math.round(totalM3).toLocaleString("fr-FR")} m³
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t("actionPlan.actions")}</h2>
          {recommendations.map((rec) => {
            const isDone = completedActions.includes(rec.id);
            const Icon = rec.category === "Recyclage" ? Recycle : rec.category === "Formation" ? Zap : TrendingDown;
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
                <Button variant={isDone ? "default" : "outline"} size="sm" className="shrink-0 gap-1" onClick={() => toggleAction(rec.id)}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> {isDone ? "Fait" : "Marquer fait"}
                </Button>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-card bg-primary/5 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">Potentiel d'économie total</p>
                <p className="text-2xl font-bold text-primary">{recommendations.reduce((s, r) => s + r.savingsM3, 0).toLocaleString("fr-FR")} m³/an</p>
                <p className="text-sm text-muted-foreground">soit {recommendations.reduce((s, r) => s + r.savingsCost, 0).toLocaleString("fr-FR")} TND/an d'économies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
