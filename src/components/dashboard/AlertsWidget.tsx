import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Info, AlertOctagon } from "lucide-react";
import { mockAlerts } from "@/lib/mock-data";

const iconMap = {
  critical: AlertOctagon,
  warning: AlertTriangle,
  info: Info,
};

const badgeMap = {
  critical: { variant: "destructive" as const, label: "Critique" },
  warning: { variant: "secondary" as const, label: "Attention" },
  info: { variant: "outline" as const, label: "Info" },
};

export function AlertsWidget() {
  const criticalCount = mockAlerts.filter((a) => a.type === "critical").length;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Alertes récentes
          </CardTitle>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="text-[10px]">
              {criticalCount} critique{criticalCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {mockAlerts.map((alert) => {
            const Icon = iconMap[alert.type];
            const badge = badgeMap[alert.type];
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                  alert.type === "critical"
                    ? "border-destructive/30 bg-destructive/5"
                    : "bg-card"
                }`}
              >
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${
                  alert.type === "critical" ? "text-destructive" :
                  alert.type === "warning" ? "text-score-d" : "text-primary"
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
