import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Droplets } from "lucide-react";

interface WaterMixDonutProps {
  bySource: Record<string, number>;
  totalVolume: number;
}

const COLORS = [
  "hsl(201, 96%, 32%)",
  "hsl(142, 72%, 29%)",
  "hsl(220, 9%, 46%)",
  "hsl(48, 96%, 53%)",
  "hsl(201, 70%, 55%)",
];

export function WaterMixDonut({ bySource, totalVolume }: WaterMixDonutProps) {
  const data = Object.entries(bySource).map(([name, value], i) => ({
    name,
    value,
    fill: COLORS[i % COLORS.length],
    percent: totalVolume > 0 ? ((value / totalVolume) * 100).toFixed(1) : "0",
  }));

  if (data.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Droplets className="h-4 w-4 text-primary" />
            Mix par Source
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Aucune donnée disponible
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Droplets className="h-4 w-4 text-primary" />
          Mix par Source
        </CardTitle>
        <p className="text-xs text-muted-foreground">Répartition par source d'approvisionnement</p>
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
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
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
                formatter={(value) => {
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
      </CardContent>
    </Card>
  );
}
