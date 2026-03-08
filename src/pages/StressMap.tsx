import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WaterHeatmap } from "@/components/dashboard/WaterHeatmap";

export default function StressMap() {
  const { t } = useI18n();

  return (
    <>
      <PageMeta title="Carte d'Impact — HydroScan" description="Visualisez le stress hydrique de vos sites" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("stressMap.title")}</h1>
          <p className="text-muted-foreground">{t("stressMap.subtitle")}</p>
        </div>
        <WaterHeatmap />
      </div>
    </>
  );
}
