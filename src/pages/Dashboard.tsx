import { Droplets, CloudRain, Beaker, TrendingDown, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { mockMonthlyData, mockUsageBreakdown, mockAlerts, getWaterScore } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

const totalBlue = mockMonthlyData.reduce((s, d) => s + d.blue, 0);
const totalGreen = mockMonthlyData.reduce((s, d) => s + d.green, 0);
const totalGrey = mockMonthlyData.reduce((s, d) => s + d.grey, 0);
const totalAll = totalBlue + totalGreen + totalGrey;
const employees = 120;
const score = getWaterScore(totalAll, employees);

const kpis = [
  {
    label: "Eau Bleue",
    value: `${(totalBlue / 1000).toFixed(1)}k m³`,
    icon: Droplets,
    colorClass: "text-blue-water bg-blue-water/10",
    borderClass: "border-l-4 border-l-blue-water",
    change: "-5.2%",
  },
  {
    label: "Eau Verte",
    value: `${(totalGreen / 1000).toFixed(1)}k m³`,
    icon: CloudRain,
    colorClass: "text-green-water bg-green-water/10",
    borderClass: "border-l-4 border-l-green-water",
    change: "+2.1%",
  },
  {
    label: "Eau Grise",
    value: `${(totalGrey / 1000).toFixed(1)}k m³`,
    icon: Beaker,
    colorClass: "text-grey-water bg-grey-water/10",
    borderClass: "border-l-4 border-l-grey-water",
    change: "-8.4%",
  },
  {
    label: "Par employé",
    value: `${(totalAll / employees).toFixed(0)} m³`,
    icon: Users,
    colorClass: "text-primary bg-primary/10",
    borderClass: "border-l-4 border-l-primary",
    change: "-3.1%",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre empreinte hydrique — 2024
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center rounded-xl border bg-card px-5 py-3 shadow-card">
            <span className="text-xs text-muted-foreground">Score</span>
            <span className={`text-3xl font-black ${score.color}`}>{score.grade}</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className={`shadow-card border ${kpi.borderClass}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2 ${kpi.colorClass}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    kpi.change.startsWith("-") ? "text-green-water" : "text-destructive"
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Line chart */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Consommation mensuelle (m³)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(215, 12%, 50%)" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(215, 12%, 50%)" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(214, 20%, 90%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="blue"
                    stroke="hsl(201, 96%, 32%)"
                    strokeWidth={2}
                    dot={false}
                    name="Eau Bleue"
                  />
                  <Line
                    type="monotone"
                    dataKey="green"
                    stroke="hsl(142, 72%, 29%)"
                    strokeWidth={2}
                    dot={false}
                    name="Eau Verte"
                  />
                  <Line
                    type="monotone"
                    dataKey="grey"
                    stroke="hsl(220, 9%, 46%)"
                    strokeWidth={2}
                    dot={false}
                    name="Eau Grise"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Répartition par usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockUsageBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {mockUsageBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-muted-foreground">{value}</span>
                    )}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, ""]}
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(214, 20%, 90%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Alertes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-3 rounded-lg border bg-card p-3"
              >
                <Badge
                  variant={
                    alert.type === "critical"
                      ? "destructive"
                      : alert.type === "warning"
                      ? "secondary"
                      : "outline"
                  }
                  className="shrink-0 text-xs"
                >
                  {alert.type === "critical"
                    ? "Critique"
                    : alert.type === "warning"
                    ? "Attention"
                    : "Info"}
                </Badge>
                <span className="text-sm">{alert.message}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {alert.date}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
