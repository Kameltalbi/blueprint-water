import { useState } from "react";
import { PageMeta } from "@/components/PageMeta";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { WaterMixDonut } from "@/components/dashboard/WaterMixDonut";
import { SiteBreakdownChart } from "@/components/dashboard/SiteBreakdownChart";
import { WaterHeatmap } from "@/components/dashboard/WaterHeatmap";
import { ObjectivesWidget } from "@/components/dashboard/ObjectivesWidget";
import { AlertsWidget } from "@/components/dashboard/AlertsWidget";
import { BenchmarkWidget } from "@/components/dashboard/BenchmarkWidget";
import { ConsumptionChart } from "@/components/dashboard/ConsumptionChart";
import { useUserRole, useSites, useWaterConsumption } from "@/hooks/useOrgData";
import { Loader2, Info } from "lucide-react";
import { demoConsumption, demoSites } from "@/lib/demo-data";

export default function Dashboard() {
  const [site, setSite] = useState("all");
  const [period, setPeriod] = useState("2026");
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const { data: realSites = [] } = useSites(userRole?.organization_id);
  const { data: realConsumption = [], isLoading: dataLoading } = useWaterConsumption(userRole?.organization_id);

  // Use demo data if no real data
  const isDemo = realConsumption.length === 0;
  const rawConsumption = isDemo ? demoConsumption : realConsumption;
  const sites = isDemo ? demoSites : realSites;

  // Filter consumption by selected site
  const consumption = site === "all"
    ? rawConsumption
    : rawConsumption.filter((c) => c.site_id === site);

  // Compute totals
  const totalVolume = consumption.reduce((s, c) => s + Number(c.volume_m3), 0);

  // Group by source for mix donut
  const bySource = consumption.reduce((acc: Record<string, number>, c) => {
    acc[c.source] = (acc[c.source] || 0) + Number(c.volume_m3);
    return acc;
  }, {});

  // Group by site for breakdown chart
  const bySite = consumption.reduce((acc: Record<string, number>, c) => {
    const siteObj = sites.find((s: any) => s.id === c.site_id);
    const name = siteObj ? siteObj.name : "Non assigné";
    acc[name] = (acc[name] || 0) + Number(c.volume_m3);
    return acc;
  }, {});

  // Group by month for consumption chart
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const byMonth = consumption.reduce((acc: Record<number, number>, c) => {
    const month = new Date(c.recorded_date).getMonth();
    acc[month] = (acc[month] || 0) + Number(c.volume_m3);
    return acc;
  }, {});
  const monthlyData = months.map((m, i) => ({ month: m, volume: byMonth[i] || 0 }));

  const siteList = [{ id: "all", name: "Tous les sites" }, ...sites.map((s: any) => ({ id: s.id, name: s.name }))];

  if (roleLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Tableau de bord — HydroScan" description="Suivez votre consommation d'eau et vos indicateurs de performance en temps réel." />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground text-sm">
            D'où vient votre eau, comment vous l'utilisez et quel est votre impact réel
          </p>
        </div>
        <DashboardFilters site={site} setSite={setSite} period={period} setPeriod={setPeriod} sites={siteList} />
      </div>

      <KpiCards totalVolume={totalVolume} consumption={consumption} />

      <div className="grid gap-6 lg:grid-cols-2">
        <WaterMixDonut bySource={bySource} totalVolume={totalVolume} />
        <SiteBreakdownChart bySite={bySite} />
      </div>

      <WaterHeatmap />

      <div className="grid gap-6 lg:grid-cols-3">
        <ObjectivesWidget />
        <div className="lg:col-span-2">
          <ConsumptionChart monthlyData={monthlyData} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BenchmarkWidget />
        <AlertsWidget />
      </div>
    </div>
  );
}
