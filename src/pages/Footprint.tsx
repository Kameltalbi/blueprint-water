import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, CloudRain, Beaker } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { mockMonthlyData, getWaterScore } from "@/lib/mock-data";

const totalBlue = mockMonthlyData.reduce((s, d) => s + d.blue, 0);
const totalGreen = mockMonthlyData.reduce((s, d) => s + d.green, 0);
const totalGrey = mockMonthlyData.reduce((s, d) => s + d.grey, 0);
const totalAll = totalBlue + totalGreen + totalGrey;
const employees = 120;
const revenue = 2400000;
const score = getWaterScore(totalAll, employees);

const footprintCards = [
  {
    title: "Eau Bleue",
    icon: Droplets,
    value: totalBlue,
    description: "Eaux de surface et souterraines consommées",
    colorClass: "text-blue-water",
    bgClass: "bg-blue-water/10",
  },
  {
    title: "Eau Verte",
    icon: CloudRain,
    value: totalGreen,
    description: "Eau de pluie utilisée par les cultures",
    colorClass: "text-green-water",
    bgClass: "bg-green-water/10",
  },
  {
    title: "Eau Grise",
    icon: Beaker,
    value: totalGrey,
    description: "Eau nécessaire pour diluer la pollution",
    colorClass: "text-grey-water",
    bgClass: "bg-grey-water/10",
  },
];

export default function Footprint() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Empreinte hydrique</h1>
        <p className="text-muted-foreground">
          Analyse détaillée selon la méthodologie ISO 14046
        </p>
      </div>

      {/* Footprint breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        {footprintCards.map((card) => (
          <Card key={card.title} className="shadow-card">
            <CardContent className="p-5">
              <div className={`inline-flex rounded-lg p-2 ${card.bgClass}`}>
                <card.icon className={`h-5 w-5 ${card.colorClass}`} />
              </div>
              <p className="mt-3 text-2xl font-bold">
                {card.value.toLocaleString("fr-FR")} m³
              </p>
              <p className="font-medium">{card.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Indicators */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total annuel", value: `${(totalAll / 1000).toFixed(1)}k m³` },
          { label: "Par employé", value: `${(totalAll / employees).toFixed(0)} m³` },
          { label: "Par M€ de CA", value: `${((totalAll / revenue) * 1000000).toFixed(0)} m³/M€` },
          { label: "Score", value: score.grade, className: score.color },
        ].map((ind) => (
          <Card key={ind.label} className="shadow-card">
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">{ind.label}</p>
              <p className={`text-2xl font-bold ${ind.className ?? ""}`}>{ind.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar chart comparison */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Évolution mensuelle par catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(214, 20%, 90%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Bar dataKey="blue" name="Eau Bleue" fill="hsl(201, 96%, 32%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="green" name="Eau Verte" fill="hsl(142, 72%, 29%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="grey" name="Eau Grise" fill="hsl(220, 9%, 46%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
