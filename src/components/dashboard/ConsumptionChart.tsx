import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface ConsumptionChartProps {
  monthlyData: { month: string; volume: number }[];
}

export function ConsumptionChart({ monthlyData }: ConsumptionChartProps) {
  const hasData = monthlyData.some((d) => d.volume > 0);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Évolution mensuelle (m³)</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-72 text-muted-foreground text-sm">
            Aucune donnée disponible
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="gradVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(201, 96%, 32%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(201, 96%, 32%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(215, 12%, 50%)" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(215, 12%, 50%)" }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString("fr-FR")} m³`, "Volume"]}
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(214, 20%, 90%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="volume" stroke="hsl(201, 96%, 32%)" strokeWidth={2} fill="url(#gradVolume)" name="Volume" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
