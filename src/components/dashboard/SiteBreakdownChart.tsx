import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Building2 } from "lucide-react";

const siteData = [
  { name: "Usine Sfax", value: 7200, color: "hsl(201, 96%, 32%)" },
  { name: "Usine Nabeul", value: 5800, color: "hsl(201, 70%, 45%)" },
  { name: "Entrepôt Sousse", value: 3100, color: "hsl(201, 60%, 55%)" },
  { name: "Bureau Tunis", value: 1900, color: "hsl(201, 50%, 65%)" },
];

const totalSite = siteData.reduce((s, d) => s + d.value, 0);

export function SiteBreakdownChart() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Analyse par Site
        </CardTitle>
        <p className="text-xs text-muted-foreground">Consommation par lieu — identifiez les sites les plus gourmands</p>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={siteData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis
                type="number"
                tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
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
        {/* Percentage labels */}
        <div className="mt-3 flex flex-wrap gap-3">
          {siteData.map((site) => (
            <div key={site.name} className="flex items-center gap-1.5 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: site.color }} />
              <span className="text-muted-foreground">{site.name}</span>
              <span className="font-semibold">{((site.value / totalSite) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
