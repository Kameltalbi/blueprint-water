import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { mockMonthlyData } from "@/lib/mock-data";
import { Droplets } from "lucide-react";
import { useState } from "react";

const totalBlue = mockMonthlyData.reduce((s, d) => s + d.blue, 0);
const totalGreen = mockMonthlyData.reduce((s, d) => s + d.green, 0);
const totalGrey = mockMonthlyData.reduce((s, d) => s + d.grey, 0);
const totalAll = totalBlue + totalGreen + totalGrey;

const data = [
  { name: "Eau Bleue", value: totalBlue, fill: "hsl(201, 96%, 32%)", percent: ((totalBlue / totalAll) * 100).toFixed(1) },
  { name: "Eau Verte", value: totalGreen, fill: "hsl(142, 72%, 29%)", percent: ((totalGreen / totalAll) * 100).toFixed(1) },
  { name: "Eau Grise", value: totalGrey, fill: "hsl(220, 9%, 46%)", percent: ((totalGrey / totalAll) * 100).toFixed(1) },
];

// Simulated drill-down data
const drillDown: Record<string, { name: string; value: number }[]> = {
  "Eau Bleue": [
    { name: "Réseau SONEDE", value: 9500 },
    { name: "Forage privé", value: 5200 },
    { name: "Dessalement", value: 4100 },
  ],
  "Eau Verte": [
    { name: "Irrigation cultures", value: 7800 },
    { name: "Pluie directe", value: 5280 },
  ],
  "Eau Grise": [
    { name: "Rejets industriels", value: 3200 },
    { name: "Eaux sanitaires", value: 2245 },
  ],
};

export function WaterMixDonut() {
  const [selected, setSelected] = useState<string | null>(null);
  const details = selected ? drillDown[selected] : null;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Droplets className="h-4 w-4 text-primary" />
          Mix de l'Empreinte
        </CardTitle>
        <p className="text-xs text-muted-foreground">Répartition Bleue / Verte / Grise — cliquez pour détailler</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                cursor="pointer"
                onClick={(_, index) => {
                  const name = data[index].name;
                  setSelected(selected === name ? null : name);
                }}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.fill}
                    opacity={selected && selected !== entry.name ? 0.3 : 1}
                    stroke={selected === entry.name ? entry.fill : "transparent"}
                    strokeWidth={selected === entry.name ? 3 : 0}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString("fr-FR")} m³`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconSize={8}
                formatter={(value, entry: any) => {
                  const d = data.find((x) => x.name === value);
                  return (
                    <span className="text-xs text-muted-foreground">
                      {value} ({d?.percent}%)
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Drill-down details */}
        {details && (
          <div className="mt-4 space-y-2 rounded-lg border bg-muted/30 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-xs font-semibold text-foreground">{selected} — Détail des sources</p>
            {details.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-medium">{d.value.toLocaleString("fr-FR")} m³</span>
              </div>
            ))}
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-primary hover:underline mt-1"
            >
              ← Retour à la vue globale
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
