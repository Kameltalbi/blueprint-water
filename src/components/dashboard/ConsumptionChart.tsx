import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface ConsumptionChartProps {
  monthlyData: { month: string; volume: number }[];
  prevYearData?: { month: string; volume: number }[];
  year?: string;
}

export function ConsumptionChart({ monthlyData, prevYearData = [], year = "2026" }: ConsumptionChartProps) {
  const prevYear = String(Number(year) - 1);
  const combined = monthlyData.map((d, i) => ({
    month: d.month,
    [year]: d.volume,
    [prevYear]: prevYearData[i]?.volume ?? 0,
  }));

  const totalCurrent = monthlyData.reduce((s, d) => s + d.volume, 0);
  const totalPrev = prevYearData.reduce((s, d) => s + d.volume, 0);
  const hasData = totalCurrent > 0 || totalPrev > 0;

  const delta = totalPrev > 0 ? ((totalCurrent - totalPrev) / totalPrev) * 100 : null;
  const isDown = delta !== null && delta < 0;
  const isUp = delta !== null && delta > 0;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Évolution mensuelle (m³)</CardTitle>
          {delta !== null && (
            <Badge
              variant={isDown ? "default" : "secondary"}
              className={`text-xs gap-1 ${isDown ? "bg-emerald-600 text-white" : isUp ? "bg-destructive/10 text-destructive" : ""}`}
            >
              {isDown ? <TrendingDown className="h-3 w-3" /> : isUp ? <TrendingUp className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {delta > 0 ? "+" : ""}{delta.toFixed(1)}% vs {prevYear}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Comparaison {year} vs {prevYear}</p>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-72 text-muted-foreground text-sm">
            Aucune donnée disponible
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={combined}>
                <defs>
                  <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(201, 96%, 32%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(201, 96%, 32%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [`${value.toLocaleString("fr-FR")} m³`, name]}
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey={year} stroke="hsl(201, 96%, 32%)" strokeWidth={2} fill="url(#gradCurrent)" name={year} />
                <Line type="monotone" dataKey={prevYear} stroke="hsl(215, 12%, 65%)" strokeWidth={1.5} strokeDasharray="5 3" dot={false} name={prevYear} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
