import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockBenchmark } from "@/lib/mock-data";
import { BarChart3, Trophy } from "lucide-react";

export function BenchmarkWidget() {
  const { sectorAverage, sectorBest, yourValue, sectorName, percentile } = mockBenchmark;
  const ratio = ((yourValue - sectorBest) / (sectorAverage - sectorBest)) * 100;
  const barPosition = Math.min(Math.max(ratio, 5), 95);
  const avgPosition = 100; // average is at 100% of range

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Benchmark sectoriel
          </CardTitle>
          <Badge variant="outline" className="text-xs font-normal">{sectorName}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Position */}
        <div className="text-center">
          <span className="text-3xl font-black text-primary">Top {percentile}%</span>
          <p className="text-xs text-muted-foreground mt-1">de votre secteur</p>
        </div>

        {/* Visual bar */}
        <div className="space-y-2">
          <div className="relative h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-water to-primary"
              style={{ width: `${100 - barPosition}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Trophy className="h-3 w-3 text-score-a" /> Meilleur: {sectorBest} m³/emp</span>
            <span>Moyenne: {sectorAverage} m³/emp</span>
          </div>
        </div>

        {/* Your value */}
        <div className="rounded-lg border bg-primary/5 p-3 text-center">
          <p className="text-xs text-muted-foreground">Votre intensité</p>
          <p className="text-lg font-bold">{yourValue} m³/employé</p>
          <p className="text-xs text-green-water font-medium">
            {sectorAverage - yourValue > 0
              ? `${sectorAverage - yourValue} m³ sous la moyenne`
              : `${yourValue - sectorAverage} m³ au-dessus de la moyenne`}
          </p>
        </div>

        {/* Potential */}
        <div className="rounded-lg border border-dashed border-primary/30 p-3 text-center">
          <p className="text-xs text-muted-foreground">Potentiel d'économie</p>
          <p className="text-lg font-bold text-primary">
            {((yourValue - sectorBest) * 120).toLocaleString()} m³/an
          </p>
          <p className="text-[10px] text-muted-foreground">
            Si vous atteignez le meilleur du secteur
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
