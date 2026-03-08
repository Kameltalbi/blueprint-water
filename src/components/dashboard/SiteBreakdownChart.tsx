import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Building2 } from "lucide-react";

interface SiteBreakdownChartProps {
  bySite: Record<string, number>;
}

const COLORS = [
  "hsl(201, 96%, 32%)",
  "hsl(201, 70%, 45%)",
  "hsl(201, 60%, 55%)",
  "hsl(201, 50%, 65%)",
  "hsl(201, 40%, 75%)",
];

export function SiteBreakdownChart({ bySite }: SiteBreakdownChartProps) {
  const siteData = Object.entries(bySite)
    .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))
    .sort((a, b) => b.value - a.value);

  const totalSite = siteData.reduce((s, d) => s + d.value, 0);

  if (siteData.length === 0) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Analyse par Site
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-56 text-muted-foreground text-sm">
          Aucune donnée disponible
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Analyse par Site
        </CardTitle>
        <p className="text-xs text-muted-foreground">Consommation par lieu</p>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={siteData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis
                type="number"
                tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toLocaleString("fr-FR")} m³`, "Volume"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                {siteData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {siteData.map((site) => (
            <div key={site.name} className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: site.color }} />
              <span className="text-muted-foreground">{site.name}</span>
              <span className="font-semibold">{totalSite > 0 ? ((site.value / totalSite) * 100).toFixed(0) : 0}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
