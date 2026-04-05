import { useState } from "react";
import { PageMeta } from "@/components/PageMeta";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { WaterMixDonut } from "@/components/dashboard/WaterMixDonut";
import { ProcessBreakdownChart } from "@/components/dashboard/ProcessBreakdownChart";
import { SiteBreakdownChart } from "@/components/dashboard/SiteBreakdownChart";
import { WaterHeatmap } from "@/components/dashboard/WaterHeatmap";
import { ObjectivesWidget } from "@/components/dashboard/ObjectivesWidget";
import { AlertsWidget } from "@/components/dashboard/AlertsWidget";
import { BenchmarkWidget } from "@/components/dashboard/BenchmarkWidget";
import { ConsumptionChart } from "@/components/dashboard/ConsumptionChart";
import { DataCompletenessWidget } from "@/components/dashboard/DataCompletenessWidget";
import { EfficiencyWidget } from "@/components/dashboard/EfficiencyWidget";
import { StressGaugeWidget } from "@/components/dashboard/StressGaugeWidget";
import { OnboardingTutorial, useShouldShowTutorial } from "@/components/OnboardingTutorial";
import { useUserRole, useSites, useWaterConsumption } from "@/hooks/useOrgData";
import { Loader2, Info } from "lucide-react";
import { demoConsumption, demoSites, demoPrevConsumption } from "@/lib/demo-data";

/* ── Helper: extract year from period string ── */
function yearFromPeriod(period: string): string {
  const match = period.match(/(\d{4})/);
  return match ? match[1] : new Date().getFullYear().toString();
}

function monthlyBreakdown(data: any[], year: string) {
  const labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const byMonth: Record<number, number> = {};
  for (const c of data) {
    if (!c.recorded_date?.startsWith(year)) continue;
    const m = new Date(c.recorded_date).getMonth();
    byMonth[m] = (byMonth[m] || 0) + Number(c.volume_m3);
  }
  return labels.map((m, i) => ({ month: m, volume: byMonth[i] || 0 }));
}

export default function Dashboard() {
  const [site, setSite] = useState("all");
  const [period, setPeriod] = useState("2026");
  const [showTutorial, setShowTutorial] = useState(() => useShouldShowTutorial());
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const { data: realSites = [] } = useSites(userRole?.organization_id);
  const { data: realConsumption = [], isLoading: dataLoading } = useWaterConsumption(userRole?.organization_id);

  const isDemo = realConsumption.length === 0;
  const allConsumption = isDemo ? [...demoConsumption, ...demoPrevConsumption] : realConsumption;
  const sites = isDemo ? demoSites : realSites;

  const year = yearFromPeriod(period);
  const prevYear = String(Number(year) - 1);

  // Filter by site and current year
  const filtered = (site === "all" ? allConsumption : allConsumption.filter((c) => c.site_id === site))
    .filter((c) => c.recorded_date?.startsWith(year));

  // All consumption for alerts and completeness (current year, all sites)
  const yearConsumption = allConsumption.filter((c) => c.recorded_date?.startsWith(year));

  const totalVolume = filtered.reduce((s, c) => s + Number(c.volume_m3), 0);

  const bySource = filtered.reduce((acc: Record<string, number>, c) => {
    acc[c.source] = (acc[c.source] || 0) + Number(c.volume_m3);
    return acc;
  }, {});

  const bySite = filtered.reduce((acc: Record<string, number>, c) => {
    const siteObj = sites.find((s: any) => s.id === c.site_id);
    const name = siteObj ? siteObj.name : "Non assigné";
    acc[name] = (acc[name] || 0) + Number(c.volume_m3);
    return acc;
  }, {});

  const monthlyData = monthlyBreakdown(site === "all" ? allConsumption : allConsumption.filter((c) => c.site_id === site), year);
  const prevYearData = monthlyBreakdown(site === "all" ? allConsumption : allConsumption.filter((c) => c.site_id === site), prevYear);

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

      {isDemo && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm text-primary">
          <Info className="h-4 w-4 shrink-0" />
          <span>Données de démonstration — Ajoutez vos propres données via <strong>Consommation Directe</strong> pour voir vos vrais indicateurs.</span>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground text-sm">
            D'où vient votre eau, comment vous l'utilisez et quel est votre impact réel
          </p>
        </div>
        <DashboardFilters site={site} setSite={setSite} period={period} setPeriod={setPeriod} sites={siteList} />
      </div>

      <KpiCards totalVolume={totalVolume} consumption={filtered} />

      <div className="grid gap-6 lg:grid-cols-3">
        <WaterMixDonut bySource={bySource} totalVolume={totalVolume} />
        <ProcessBreakdownChart consumption={filtered} />
        <StressGaugeWidget />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SiteBreakdownChart bySite={bySite} />
      </div>

      <WaterHeatmap />

      <div className="grid gap-6 lg:grid-cols-3">
        <ObjectivesWidget totalM3={totalVolume} />
        <div className="lg:col-span-2">
          <ConsumptionChart monthlyData={monthlyData} prevYearData={prevYearData} year={year} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <DataCompletenessWidget consumption={yearConsumption} sitesCount={sites.length} year={year} />
        <BenchmarkWidget />
        <AlertsWidget consumption={allConsumption} year={year} />
        <EfficiencyWidget totalVolume={totalVolume} period={period} />
      </div>
      {showTutorial && <OnboardingTutorial onClose={() => setShowTutorial(false)} />}
    </div>
  );
}
