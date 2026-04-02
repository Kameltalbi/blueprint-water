import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Minus, Gauge, Pencil } from "lucide-react";

interface EfficiencyRecord {
  period: string;
  units: number;
  unitName: string;
  litersPerUnit: number;
}

const LS_KEY = "hydroscan_efficiency_records";

function loadRecords(): EfficiencyRecord[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecords(records: EfficiencyRecord[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(records));
}

interface Props {
  totalVolume: number; // m³ for selected period
  period: string;
}

export function EfficiencyWidget({ totalVolume, period }: Props) {
  const [records, setRecords] = useState<EfficiencyRecord[]>(loadRecords);
  const [editing, setEditing] = useState(false);
  const [units, setUnits] = useState("");
  const [unitName, setUnitName] = useState("kg");

  const current = records.find((r) => r.period === period);
  const prevPeriod = records.find((r) => r.period !== period);

  const totalLiters = totalVolume * 1000;

  useEffect(() => {
    if (current) {
      setUnits(String(current.units));
      setUnitName(current.unitName);
    }
  }, [period]);

  function save() {
    const u = parseFloat(units);
    if (!u || u <= 0) return;
    const lpu = totalLiters / u;
    const updated = records.filter((r) => r.period !== period);
    const newRec: EfficiencyRecord = { period, units: u, unitName, litersPerUnit: lpu };
    const next = [newRec, ...updated].slice(0, 12); // keep last 12 periods
    setRecords(next);
    saveRecords(next);
    setEditing(false);
  }

  const lpu = current ? current.litersPerUnit : totalLiters > 0 && current ? 0 : null;
  const prevLpu = prevPeriod?.litersPerUnit ?? null;

  const drift =
    lpu !== null && prevLpu !== null && prevLpu > 0
      ? ((lpu - prevLpu) / prevLpu) * 100
      : null;

  const driftStatus =
    drift === null ? "neutral"
    : drift <= -5 ? "better"
    : drift <= 5 ? "stable"
    : drift <= 15 ? "warning"
    : "alert";

  const driftConfig = {
    better: { label: `↓ ${Math.abs(drift ?? 0).toFixed(1)}% vs période préc.`, color: "bg-emerald-500", Icon: TrendingDown },
    stable: { label: `≈ stable vs période préc.`, color: "bg-primary", Icon: Minus },
    warning: { label: `↑ +${(drift ?? 0).toFixed(1)}% — surveiller`, color: "bg-amber-500", Icon: TrendingUp },
    alert: { label: `⚠ +${(drift ?? 0).toFixed(1)}% — dérive significative`, color: "bg-destructive", Icon: TrendingUp },
    neutral: { label: "", color: "bg-muted", Icon: Gauge },
  }[driftStatus];

  return (
    <Card className="shadow-card border-l-4 border-l-emerald-500">
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
        <div>
          <CardDescription>Efficacité hydrique</CardDescription>
          <CardTitle className="text-base mt-0.5">Litres / unité produite</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground"
          onClick={() => setEditing(!editing)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {editing || !current ? (
          <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground font-medium">
              Saisir la production — <span className="text-primary">{period}</span>
            </p>
            <div className="grid gap-2 grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Unités produites</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="ex: 50000"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Unité</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm h-8"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                >
                  <option value="kg">kg</option>
                  <option value="tonne">tonne</option>
                  <option value="pièce">pièce</option>
                  <option value="L (produit)">L produit</option>
                  <option value="m²">m²</option>
                  <option value="boîte">boîte</option>
                  <option value="caisse">caisse</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="h-7 text-xs" onClick={save} disabled={!units}>
                Enregistrer
              </Button>
              {current && (
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditing(false)}>
                  Annuler
                </Button>
              )}
            </div>
            {totalVolume === 0 && (
              <p className="text-xs text-muted-foreground">
                Aucune consommation enregistrée pour cette période.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">
                {current.litersPerUnit >= 1000
                  ? `${(current.litersPerUnit / 1000).toFixed(1)}k`
                  : Math.round(current.litersPerUnit).toLocaleString("fr-FR")}
              </span>
              <span className="text-sm text-muted-foreground mb-1">
                L / {current.unitName}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {current.units.toLocaleString("fr-FR")} {current.unitName}s produites · {Math.round(totalLiters).toLocaleString("fr-FR")} L
            </p>
            {drift !== null && (
              <Badge className={`text-xs gap-1 ${driftConfig.color}`}>
                <driftConfig.Icon className="h-3 w-3" />
                {driftConfig.label}
              </Badge>
            )}
            {driftStatus === "alert" && (
              <p className="text-xs text-destructive font-medium pt-1">
                Consommation par unité en hausse de +{(drift ?? 0).toFixed(1)}%. Vérifiez les fuites ou dérives procédés.
              </p>
            )}
          </>
        )}

        {records.length > 1 && (
          <div className="pt-1 border-t border-border">
            <p className="text-[0.65rem] text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Historique</p>
            <div className="space-y-0.5">
              {records.slice(0, 4).map((r) => (
                <div key={r.period} className="flex justify-between text-xs">
                  <span className={`text-muted-foreground ${r.period === period ? "font-semibold text-foreground" : ""}`}>
                    {r.period}
                  </span>
                  <span className={r.period === period ? "font-semibold" : "text-muted-foreground"}>
                    {Math.round(r.litersPerUnit).toLocaleString("fr-FR")} L/{r.unitName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
