import { Droplets, CloudRain, Beaker, Users, TrendingDown, TrendingUp, Gauge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockMonthlyData, mockIntensity, getWaterScore } from "@/lib/mock-data";

const totalBlue = mockMonthlyData.reduce((s, d) => s + d.blue, 0);
const totalGreen = mockMonthlyData.reduce((s, d) => s + d.green, 0);
const totalGrey = mockMonthlyData.reduce((s, d) => s + d.grey, 0);
const totalAll = totalBlue + totalGreen + totalGrey;
const employees = 120;

const kpis = [
  {
    label: "Eau Bleue",
    value: `${(totalBlue / 1000).toFixed(1)}k m³`,
    icon: Droplets,
    colorClass: "text-blue-water bg-blue-water/10",
    borderClass: "border-l-4 border-l-blue-water",
    change: -5.2,
  },
  {
    label: "Eau Verte",
    value: `${(totalGreen / 1000).toFixed(1)}k m³`,
    icon: CloudRain,
    colorClass: "text-green-water bg-green-water/10",
    borderClass: "border-l-4 border-l-green-water",
    change: 2.1,
  },
  {
    label: "Eau Grise",
    value: `${(totalGrey / 1000).toFixed(1)}k m³`,
    icon: Beaker,
    colorClass: "text-grey-water bg-grey-water/10",
    borderClass: "border-l-4 border-l-grey-water",
    change: -8.4,
  },
  {
    label: "Par employé",
    value: `${(totalAll / employees).toFixed(0)} m³`,
    icon: Users,
    colorClass: "text-primary bg-primary/10",
    borderClass: "border-l-4 border-l-primary",
    change: -3.1,
  },
  {
    label: "Intensité hydrique",
    value: `${mockIntensity.current} ${mockIntensity.unit}`,
    icon: Gauge,
    colorClass: "text-primary bg-primary/10",
    borderClass: "border-l-4 border-l-primary",
    change: mockIntensity.change,
  },
];

export function KpiCards() {
  const score = getWaterScore(totalAll, employees);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {/* Score card */}
      <Card className="shadow-card border bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-5 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-muted-foreground mb-1">Score global</span>
          <span className={`text-5xl font-black ${score.color}`}>{score.grade}</span>
          <span className="text-xs text-muted-foreground mt-1">
            {totalAll.toLocaleString()} m³ total
          </span>
        </CardContent>
      </Card>

      {/* KPI cards */}
      {kpis.map((kpi) => (
        <Card key={kpi.label} className={`shadow-card border ${kpi.borderClass}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${kpi.colorClass}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                kpi.change < 0 ? "text-green-water" : "text-destructive"
              }`}>
                {kpi.change < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {kpi.change > 0 ? "+" : ""}{kpi.change}%
              </span>
            </div>
            <div className="mt-2">
              <p className="text-xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
