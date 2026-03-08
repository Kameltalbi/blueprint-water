import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { wsiByCountry } from "@/lib/water-data";
import { MapPin } from "lucide-react";

// Simulated material sourcing data (would come from DB in production)
const sourcingData = [
  { country: "tunisie", material: "Olives", volume: 3200, label: "Tunisie" },
  { country: "maroc", material: "Phosphate", volume: 1800, label: "Maroc" },
  { country: "turquie", material: "Coton", volume: 5400, label: "Turquie" },
  { country: "france", material: "Blé", volume: 900, label: "France" },
  { country: "inde", material: "Coton bio", volume: 4100, label: "Inde" },
  { country: "chine", material: "Polyester", volume: 320, label: "Chine" },
  { country: "algerie", material: "Ciment", volume: 2100, label: "Algérie" },
  { country: "espagne", material: "Oranges", volume: 750, label: "Espagne" },
];

function getHeatColor(wsi: number) {
  if (wsi >= 4) return "bg-red-500";
  if (wsi >= 3) return "bg-orange-500";
  if (wsi >= 2) return "bg-amber-400";
  return "bg-emerald-400";
}

function getTextColor(wsi: number) {
  if (wsi >= 4) return "text-red-600";
  if (wsi >= 3) return "text-orange-600";
  if (wsi >= 2) return "text-amber-600";
  return "text-emerald-600";
}

export function WaterHeatmap() {
  const sorted = [...sourcingData].sort((a, b) => {
    const wsiA = wsiByCountry[a.country]?.wsi || 2;
    const wsiB = wsiByCountry[b.country]?.wsi || 2;
    return wsiB - wsiA;
  });

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4 text-primary" />
          Impact géographique (WSI)
        </CardTitle>
        <p className="text-xs text-muted-foreground">Impact pondéré par le stress hydrique local</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {sorted.map((item) => {
          const wsi = wsiByCountry[item.country]?.wsi || 2;
          const wsiLabel = wsiByCountry[item.country]?.label || "Moyen";
          const weightedImpact = Math.round(item.volume * (wsi / 2));
          const maxImpact = 12000; // for bar width
          const barWidth = Math.min((weightedImpact / maxImpact) * 100, 100);

          return (
            <div key={item.country} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${getHeatColor(wsi)}`} />
                  <span className="text-xs font-semibold">{item.label}</span>
                  <span className="text-[0.6rem] text-muted-foreground">{item.material}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${getTextColor(wsi)}`}>
                    {weightedImpact.toLocaleString("fr-FR")} m³<sub>eq</sub>
                  </span>
                  <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    WSI {wsi}
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getHeatColor(wsi)}`}
                  style={{ width: `${barWidth}%`, opacity: 0.7 }}
                />
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Faible</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Moyen</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Élevé</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Extrême</span>
          </div>
          <span className="text-[0.6rem]">Source: Aqueduct/WRI</span>
        </div>
      </CardContent>
    </Card>
  );
}
