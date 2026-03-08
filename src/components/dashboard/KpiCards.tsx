import { Droplets, AlertTriangle, Gauge, TrendingDown, TrendingUp, Waves } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockMonthlyData, mockIntensity, getWaterScore } from "@/lib/mock-data";

const totalBlue = mockMonthlyData.reduce((s, d) => s + d.blue, 0);
const totalGreen = mockMonthlyData.reduce((s, d) => s + d.green, 0);
const totalGrey = mockMonthlyData.reduce((s, d) => s + d.grey, 0);
const totalAll = totalBlue + totalGreen + totalGrey;
const employees = 120;

// Simulated WSI moyen pondéré des sites
const avgStress = 3.8;
// Économie par rapport à l'année précédente
const savingsM3 = 2340;
const savingsPercent = -12.1;

const kpis = [
  {
    label: "Empreinte Totale",
    value: `${(totalAll / 1000).toFixed(1)}k`,
    unit: "m³",
    icon: Droplets,
    colorClass: "text-primary bg-primary/10",
    borderClass: "border-l-4 border-l-primary",
    sub: `Bleue ${(totalBlue / 1000).toFixed(1)}k · Verte ${(totalGreen / 1000).toFixed(1)}k · Grise ${(totalGrey / 1000).toFixed(1)}k`,
  },
  {
    label: "Indice Stress Moyen",
    value: avgStress.toFixed(1),
    unit: "/ 5",
    icon: AlertTriangle,
    colorClass: avgStress >= 3.5 ? "text-destructive bg-destructive/10" : "text-amber-600 bg-amber-100",
    borderClass: avgStress >= 3.5 ? "border-l-4 border-l-destructive" : "border-l-4 border-l-amber-400",
    sub: avgStress >= 3.5 ? "Zone de stress élevé" : "Zone de stress modéré",
  },
  {
    label: "Intensité Hydrique",
    value: mockIntensity.current.toString(),
    unit: mockIntensity.unit,
    icon: Gauge,
    colorClass: "text-primary bg-primary/10",
    borderClass: "border-l-4 border-l-primary",
    change: mockIntensity.change,
    sub: `vs ${mockIntensity.previous} précédemment`,
  },
  {
    label: "Économie Réalisée",
    value: `${(savingsM3 / 1000).toFixed(1)}k`,
    unit: "m³",
    icon: Waves,
    colorClass: "text-green-water bg-green-water/10",
    borderClass: "border-l-4 border-l-green-water",
    change: savingsPercent,
    sub: "vs année précédente",
  },
];

export function KpiCards() {
  const score = getWaterScore(totalAll, employees);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* Score card */}
      <Card className="shadow-card border bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
          <span className="text-xs text-muted-foreground mb-1">Score global</span>
          <span className={`text-5xl font-black ${score.color}`}>{score.grade}</span>
          <span className="text-xs text-muted-foreground mt-1">
            {totalAll.toLocaleString("fr-FR")} m³ total
          </span>
        </CardContent>
      </Card>

      {/* KPI cards */}
      {kpis.map((kpi) => (
        <Card key={kpi.label} className={`shadow-card border ${kpi.borderClass}`}>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${kpi.colorClass}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
              {"change" in kpi && kpi.change !== undefined && (
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                  kpi.change < 0 ? "text-green-water" : "text-destructive"
                }`}>
                  {kpi.change < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  {kpi.change > 0 ? "+" : ""}{kpi.change}%
                </span>
              )}
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
