import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { mockMonthlyData } from "@/lib/mock-data";

export function ConsumptionChart() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Évolution mensuelle (m³)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockMonthlyData}>
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(201, 96%, 32%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(201, 96%, 32%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 72%, 29%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 72%, 29%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradGrey" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220, 9%, 46%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(220, 9%, 46%)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Legend iconSize={8} formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
              <Area type="monotone" dataKey="blue" stroke="hsl(201, 96%, 32%)" strokeWidth={2} fill="url(#gradBlue)" name="Eau Bleue" />
              <Area type="monotone" dataKey="green" stroke="hsl(142, 72%, 29%)" strokeWidth={2} fill="url(#gradGreen)" name="Eau Verte" />
              <Area type="monotone" dataKey="grey" stroke="hsl(220, 9%, 46%)" strokeWidth={2} fill="url(#gradGrey)" name="Eau Grise" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
