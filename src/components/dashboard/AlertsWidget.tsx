import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Info, AlertOctagon } from "lucide-react";

type AlertType = "critical" | "warning" | "info";
interface Alert { id: number; type: AlertType; message: string; date: string; }

interface Props {
  consumption: { recorded_date: string; volume_m3: number; site_id?: string | null }[];
  year: string;
}

function generateAlerts(consumption: Props["consumption"], year: string): Alert[] {
  const alerts: Alert[] = [];
  let id = 1;
  const today = new Date().toISOString().slice(0, 10);

  // Group by month for current year
  const byMonth: Record<number, number> = {};
  for (const c of consumption) {
    if (!c.recorded_date?.startsWith(year)) continue;
    const m = new Date(c.recorded_date).getMonth();
    byMonth[m] = (byMonth[m] || 0) + Number(c.volume_m3);
  }

  const months = Object.entries(byMonth).sort(([a], [b]) => Number(a) - Number(b));

  // Alert: consecutive month spike > 20%
  for (let i = 1; i < months.length; i++) {
    const prev = Number(months[i - 1][1]);
    const curr = Number(months[i][1]);
    if (prev > 0 && (curr - prev) / prev > 0.2) {
      const pct = Math.round(((curr - prev) / prev) * 100);
      alerts.push({ id: id++, type: "warning", message: `Hausse de ${pct}% vs mois précédent (mois ${Number(months[i][0]) + 1})`, date: today });
    }
  }

  // Alert: entries without site_id
  const noSite = consumption.filter((c) => !c.site_id && c.recorded_date?.startsWith(year)).length;
  if (noSite > 0) {
    alerts.push({ id: id++, type: "info", message: `${noSite} saisie(s) non associée(s) à un site — vérifiez les affectations`, date: today });
  }

  // Alert: no data for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear().toString();
  if (year === currentYear && !byMonth[currentMonth]) {
    alerts.push({ id: id++, type: "warning", message: `Aucune donnée saisie pour le mois en cours`, date: today });
  }

  // Alert: very high single entry (> 2× average)
  const allVols = consumption.filter((c) => c.recorded_date?.startsWith(year)).map((c) => Number(c.volume_m3));
  if (allVols.length > 2) {
    const avg = allVols.reduce((s, v) => s + v, 0) / allVols.length;
    const hasSpike = allVols.some((v) => v > avg * 2.5);
    if (hasSpike) alerts.push({ id: id++, type: "critical", message: `Valeur anormalement élevée détectée — vérifiez vos saisies`, date: today });
  }

  // Info: report available
  if (consumption.filter((c) => c.recorded_date?.startsWith(year)).length >= 6) {
    alerts.push({ id: id++, type: "info", message: `Rapport ${year} disponible — données suffisantes pour l'export`, date: today });
  }

  // No alerts
  if (alerts.length === 0) {
    alerts.push({ id: id++, type: "info", message: `Aucune anomalie détectée — données conformes`, date: today });
  }

  return alerts.slice(0, 5);
}

const iconMap = { critical: AlertOctagon, warning: AlertTriangle, info: Info };
const badgeMap = {
  critical: { variant: "destructive" as const, label: "Critique" },
  warning: { variant: "secondary" as const, label: "Attention" },
  info: { variant: "outline" as const, label: "Info" },
};

export function AlertsWidget({ consumption, year }: Props) {
  const alerts = useMemo(() => generateAlerts(consumption, year), [consumption, year]);
  const criticalCount = alerts.filter((a) => a.type === "critical").length;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Alertes intelligentes
          </CardTitle>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-[10px]">
              {criticalCount} critique{criticalCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Détection automatique — {year}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {alerts.map((alert) => {
            const Icon = iconMap[alert.type];
            const badge = badgeMap[alert.type];
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  alert.type === "critical" ? "border-destructive/30 bg-destructive/5" : "bg-card"
                }`}
              >
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${
                  alert.type === "critical" ? "text-destructive" :
                  alert.type === "warning" ? "text-amber-500" : "text-primary"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant={badge.variant} className="text-[10px] h-5">{badge.label}</Badge>
                    <span className="text-[10px] text-muted-foreground">{alert.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
