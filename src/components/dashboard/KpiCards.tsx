import { Droplets, AlertTriangle, Gauge, TrendingDown, TrendingUp, Waves } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KpiCardsProps {
  totalVolume: number;
  consumption: any[];
}

function getWaterScore(totalM3: number): { grade: string; color: string } {
  if (totalM3 === 0) return { grade: "—", color: "text-muted-foreground" };
  if (totalM3 < 5000) return { grade: "A", color: "text-score-a" };
  if (totalM3 < 15000) return { grade: "B", color: "text-score-b" };
  if (totalM3 < 30000) return { grade: "C", color: "text-score-c" };
  if (totalM3 < 50000) return { grade: "D", color: "text-score-d" };
  return { grade: "E", color: "text-score-e" };
}

export function KpiCards({ totalVolume, consumption }: KpiCardsProps) {
  const score = getWaterScore(totalVolume);
  const entryCount = consumption.length;

  // Group by source type for breakdown
  const bySource = consumption.reduce((acc: Record<string, number>, c) => {
    acc[c.source] = (acc[c.source] || 0) + Number(c.volume_m3);
    return acc;
  }, {});

  const topSource = Object.entries(bySource).sort((a, b) => (b[1] as number) - (a[1] as number))[0];

  const kpis = [
    {
      label: "Volume Total",
      value: totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume.toLocaleString("fr-FR"),
      unit: "m³",
      icon: Droplets,
      colorClass: "text-primary bg-primary/10",
      borderClass: "border-l-4 border-l-primary",
      sub: `${entryCount} saisie${entryCount > 1 ? "s" : ""} enregistrée${entryCount > 1 ? "s" : ""}`,
    },
    {
      label: "Source Principale",
      value: topSource ? topSource[0].split(" ")[0] : "—",
      unit: "",
      icon: Waves,
      colorClass: "text-primary bg-primary/10",
      borderClass: "border-l-4 border-l-primary",
      sub: topSource ? `${Number(topSource[1]).toLocaleString("fr-FR")} m³` : "Aucune donnée",
    },
    {
      label: "Moyenne / saisie",
      value: entryCount > 0 ? Math.round(totalVolume / entryCount).toLocaleString("fr-FR") : "—",
      unit: entryCount > 0 ? "m³" : "",
      icon: Gauge,
      colorClass: "text-primary bg-primary/10",
      borderClass: "border-l-4 border-l-primary",
      sub: "par entrée",
    },
    {
      label: "Sources Distinctes",
      value: Object.keys(bySource).length.toString(),
      unit: "",
      icon: AlertTriangle,
      colorClass: "text-amber-600 bg-amber-100",
      borderClass: "border-l-4 border-l-amber-400",
      sub: "types de sources",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Card className="shadow-card border bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
          <span className="text-xs text-muted-foreground mb-1">Score global</span>
          <span className={`text-5xl font-black ${score.color}`}>{score.grade}</span>
          <span className="text-xs text-muted-foreground mt-1">
            {totalVolume.toLocaleString("fr-FR")} m³ total
          </span>
        </CardContent>
      </Card>

      {kpis.map((kpi) => (
        <Card key={kpi.label} className={`shadow-card border ${kpi.borderClass}`}>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${kpi.colorClass}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">
                {kpi.value} <span className="text-sm font-normal text-muted-foreground">{kpi.unit}</span>
              </p>
              <p className="text-xs font-medium text-foreground mt-0.5">{kpi.label}</p>
              <p className="text-[0.65rem] text-muted-foreground mt-0.5">{kpi.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
