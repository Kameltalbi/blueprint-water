import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { WaterHeatmap } from "@/components/dashboard/WaterHeatmap";
import { useUserRole, useSites, useWaterConsumption } from "@/hooks/useOrgData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function StressMap() {
  const { t } = useI18n();
  const { data: userRole } = useUserRole();
  const { data: sites = [] } = useSites(userRole?.organization_id);
  const { data: consumption = [] } = useWaterConsumption(userRole?.organization_id);

  // Fetch WSI data from Supabase
  const { data: wsiData = [], isLoading } = useQuery({
    queryKey: ["waterStressIndices"],
    queryFn: async () => {
      const { data } = await supabase.from("water_stress_indices").select("*");
      return data || [];
    },
  });

  // Map sites to their consumption and WSI
  const siteAnalysis = sites.map((site: any) => {
    const siteConsumption = consumption.filter((c) => c.site_id === site.id);
    const totalVolume = siteConsumption.reduce((s, c) => s + Number(c.volume_m3), 0);
    // Try to match site location to WSI data
    const wsi = wsiData.find((w: any) =>
      site.location?.toLowerCase().includes(w.region_name.toLowerCase()) ||
      site.location?.toLowerCase().includes(w.country.toLowerCase())
    );
    return {
      name: site.name,
      location: site.location || "—",
      volume: totalVolume,
      wsiScore: wsi?.wsi_score || 2,
      country: wsi?.country || "—",
    };
  });

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

  return (
    <>
      <PageMeta title="Carte d'Impact — HydroScan" description="Visualisez le stress hydrique de vos sites" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("stressMap.title")}</h1>
          <p className="text-muted-foreground">{t("stressMap.subtitle")}</p>
        </div>

        {/* Sites stress analysis */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-primary" />
              Stress hydrique par site
            </CardTitle>
            <p className="text-xs text-muted-foreground">Impact pondéré par le stress hydrique local de chaque site</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : siteAnalysis.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Ajoutez des sites dans l'onglet Organisation pour voir l'analyse de stress.
              </p>
            ) : (
              <>
                {siteAnalysis.sort((a, b) => b.wsiScore - a.wsiScore).map((item) => {
                  const weightedImpact = Math.round(item.volume * (item.wsiScore / 2));
                  const maxImpact = Math.max(...siteAnalysis.map((s) => Math.round(s.volume * (s.wsiScore / 2))), 1);
                  const barWidth = Math.min((weightedImpact / maxImpact) * 100, 100);

                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${getHeatColor(item.wsiScore)}`} />
                          <span className="text-xs font-semibold">{item.name}</span>
                          <span className="text-[0.6rem] text-muted-foreground">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${getTextColor(item.wsiScore)}`}>
                            {weightedImpact > 0 ? `${weightedImpact.toLocaleString("fr-FR")} m³eq` : "—"}
                          </span>
                          <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                            WSI {item.wsiScore}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getHeatColor(item.wsiScore)}`}
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
              </>
            )}
          </CardContent>
        </Card>

        {/* Global heatmap */}
        <WaterHeatmap />
      </div>
    </>
  );
}
