import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, CloudRain, Beaker, Loader2 } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useUserRole, useWaterConsumption } from "@/hooks/useOrgData";
import { useMemo } from "react";

function getWaterScore(total: number, employees: number) {
  const perCapita = employees > 0 ? total / employees : total;
  if (perCapita < 50) return { grade: "A", color: "text-green-water" };
  if (perCapita < 100) return { grade: "B", color: "text-blue-water" };
  if (perCapita < 200) return { grade: "C", color: "text-yellow-500" };
  return { grade: "D", color: "text-destructive" };
}

export default function Footprint() {
  const { data: role } = useUserRole();
  const { data: consumption, isLoading } = useWaterConsumption(role?.organization_id);

  const { totalBlue, totalGreen, totalGrey, totalAll, monthlyData } = useMemo(() => {
    if (!consumption || consumption.length === 0) {
      return { totalBlue: 0, totalGreen: 0, totalGrey: 0, totalAll: 0, monthlyData: [] };
    }

    let blue = 0, green = 0, grey = 0;
    const monthMap: Record<string, { blue: number; green: number; grey: number }> = {};

    for (const entry of consumption) {
      const vol = Number(entry.volume_m3) || 0;
      const src = (entry.source || "").toLowerCase();
      const date = new Date(entry.recorded_date);
      const monthKey = date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

      if (!monthMap[monthKey]) monthMap[monthKey] = { blue: 0, green: 0, grey: 0 };

      if (src.includes("pluie") || src.includes("vert")) {
        green += vol;
        monthMap[monthKey].green += vol;
      } else if (src.includes("gris") || src.includes("recycl")) {
        grey += vol;
        monthMap[monthKey].grey += vol;
      } else {
        blue += vol;
        monthMap[monthKey].blue += vol;
      }
    }

    return {
      totalBlue: blue,
      totalGreen: green,
      totalGrey: grey,
      totalAll: blue + green + grey,
      monthlyData: Object.entries(monthMap).map(([month, vals]) => ({ month, ...vals })),
    };
  }, [consumption]);

  const employees = 1; // placeholder
  const score = getWaterScore(totalAll, employees);

  const footprintCards = [
    { title: "Eau Bleue", icon: Droplets, value: totalBlue, description: "Eaux de surface et souterraines consommées", colorClass: "text-blue-water", bgClass: "bg-blue-water/10" },
    { title: "Eau Verte", icon: CloudRain, value: totalGreen, description: "Eau de pluie utilisée par les cultures", colorClass: "text-green-water", bgClass: "bg-green-water/10" },
    { title: "Eau Grise", icon: Beaker, value: totalGrey, description: "Eau nécessaire pour diluer la pollution", colorClass: "text-grey-water", bgClass: "bg-grey-water/10" },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Empreinte Eau — HydroScan" description="Visualisez la répartition de votre empreinte eau verte, bleue et grise." />
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Empreinte hydrique</h1>
        <p className="text-muted-foreground">Analyse détaillée selon la méthodologie ISO 14046</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {footprintCards.map((card) => (
          <Card key={card.title} className="shadow-card">
            <CardContent className="p-5">
              <div className={`inline-flex rounded-lg p-2 ${card.bgClass}`}>
                <card.icon className={`h-5 w-5 ${card.colorClass}`} />
              </div>
              <p className="mt-3 text-2xl font-bold">{card.value.toLocaleString("fr-FR")} m³</p>
              <p className="font-medium">{card.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total annuel", value: `${(totalAll / 1000).toFixed(1)}k m³` },
          { label: "Score", value: score.grade, className: score.color },
          { label: "Entrées", value: `${consumption?.length ?? 0}` },
        ].map((ind) => (
          <Card key={ind.label} className="shadow-card">
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">{ind.label}</p>
              <p className={`text-2xl font-bold ${ind.className ?? ""}`}>{ind.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {monthlyData.length > 0 && (
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Évolution mensuelle par catégorie</CardTitle></CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 20%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend />
                  <Bar dataKey="blue" name="Eau Bleue" fill="hsl(201, 96%, 32%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="green" name="Eau Verte" fill="hsl(142, 72%, 29%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="grey" name="Eau Grise" fill="hsl(220, 9%, 46%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
