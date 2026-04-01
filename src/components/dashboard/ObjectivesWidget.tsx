import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Plus, Trash2, Pencil, Check, X } from "lucide-react";

interface Objective {
  id: string;
  label: string;
  targetPct: number;
  baselineM3: number;
  year: string;
}

const STORAGE_KEY = "hs_objectives";

function loadObjectives(): Objective[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultObjectives();
  } catch { return defaultObjectives(); }
}

function defaultObjectives(): Objective[] {
  return [
    { id: "1", label: "Réduction consommation totale", targetPct: 15, baselineM3: 28000, year: "2025" },
    { id: "2", label: "Recyclage eau industrielle", targetPct: 30, baselineM3: 10000, year: "2025" },
  ];
}

function saveObjectives(objs: Objective[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(objs));
}

interface Props { totalM3: number; }

export function ObjectivesWidget({ totalM3 }: Props) {
  const [objectives, setObjectives] = useState<Objective[]>(loadObjectives);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: "", targetPct: "", baselineM3: "" });
  const [editForm, setEditForm] = useState({ label: "", targetPct: "", baselineM3: "" });

  const mutate = (next: Objective[]) => { setObjectives(next); saveObjectives(next); };

  const addObjective = () => {
    if (!form.label || !form.targetPct || !form.baselineM3) return;
    const obj: Objective = {
      id: Date.now().toString(),
      label: form.label,
      targetPct: Number(form.targetPct),
      baselineM3: Number(form.baselineM3),
      year: new Date().getFullYear().toString(),
    };
    mutate([...objectives, obj]);
    setForm({ label: "", targetPct: "", baselineM3: "" });
    setAdding(false);
  };

  const startEdit = (obj: Objective) => {
    setEditId(obj.id);
    setEditForm({ label: obj.label, targetPct: String(obj.targetPct), baselineM3: String(obj.baselineM3) });
  };

  const saveEdit = (id: string) => {
    mutate(objectives.map((o) => o.id === id
      ? { ...o, label: editForm.label, targetPct: Number(editForm.targetPct), baselineM3: Number(editForm.baselineM3) }
      : o));
    setEditId(null);
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Objectifs de réduction
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAdding(!adding)}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Progression vers vos cibles</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {objectives.map((obj) => {
          const targetM3 = obj.baselineM3 * (1 - obj.targetPct / 100);
          const progress = obj.baselineM3 > 0
            ? Math.min(Math.max(((obj.baselineM3 - totalM3) / (obj.baselineM3 - targetM3)) * 100, 0), 100)
            : 0;
          const color = progress >= 75 ? "hsl(142,72%,29%)" : progress >= 40 ? "hsl(48,96%,53%)" : "hsl(0,72%,51%)";

          return (
            <div key={obj.id} className="space-y-1.5">
              {editId === obj.id ? (
                <div className="space-y-1">
                  <Input className="h-7 text-xs" value={editForm.label} onChange={(e) => setEditForm((f) => ({ ...f, label: e.target.value }))} placeholder="Libellé" />
                  <div className="flex gap-1">
                    <Input className="h-7 text-xs" value={editForm.targetPct} onChange={(e) => setEditForm((f) => ({ ...f, targetPct: e.target.value }))} placeholder="Cible %" type="number" />
                    <Input className="h-7 text-xs" value={editForm.baselineM3} onChange={(e) => setEditForm((f) => ({ ...f, baselineM3: e.target.value }))} placeholder="Baseline m³" type="number" />
                    <Button size="icon" className="h-7 w-7" onClick={() => saveEdit(obj.id)}><Check className="h-3 w-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditId(null)}><X className="h-3 w-3" /></Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground truncate max-w-[130px]">{obj.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{Math.round(progress)}%</span>
                      <span className="text-muted-foreground">/ {obj.targetPct}% cible</span>
                      <button onClick={() => startEdit(obj)} className="ml-1 opacity-40 hover:opacity-100"><Pencil className="h-3 w-3" /></button>
                      <button onClick={() => mutate(objectives.filter((o) => o.id !== obj.id))} className="opacity-40 hover:opacity-100 text-destructive"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: color }} />
                  </div>
                  <p className="text-[0.6rem] text-muted-foreground">
                    Baseline : {obj.baselineM3.toLocaleString("fr-FR")} m³ → Cible : {Math.round(targetM3).toLocaleString("fr-FR")} m³ · Actuel : {Math.round(totalM3).toLocaleString("fr-FR")} m³
                  </p>
                </>
              )}
            </div>
          );
        })}

        {adding && (
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <p className="text-xs font-medium">Nouvel objectif</p>
            <Input className="h-7 text-xs" placeholder="ex: Réduction process industriel" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
            <div className="flex gap-2">
              <Input className="h-7 text-xs" placeholder="Cible %" type="number" value={form.targetPct} onChange={(e) => setForm((f) => ({ ...f, targetPct: e.target.value }))} />
              <Input className="h-7 text-xs" placeholder="Baseline m³" type="number" value={form.baselineM3} onChange={(e) => setForm((f) => ({ ...f, baselineM3: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="h-7 text-xs flex-1" onClick={addObjective}>Ajouter</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setAdding(false)}>Annuler</Button>
            </div>
          </div>
        )}

        {objectives.length === 0 && !adding && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Cliquez sur <strong>+</strong> pour définir votre premier objectif.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
