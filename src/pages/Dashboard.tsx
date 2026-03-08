import { useState } from "react";
import { PageMeta } from "@/components/PageMeta";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { ConsumptionChart } from "@/components/dashboard/ConsumptionChart";
import { UsagePieChart } from "@/components/dashboard/UsagePieChart";
import { BenchmarkWidget } from "@/components/dashboard/BenchmarkWidget";
import { ObjectivesWidget } from "@/components/dashboard/ObjectivesWidget";
import { AlertsWidget } from "@/components/dashboard/AlertsWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WaterHeatmap } from "@/components/dashboard/WaterHeatmap";

export default function Dashboard() {
  const [site, setSite] = useState("all");
  const [period, setPeriod] = useState("2026");

  return (
    <div className="space-y-6">
      <PageMeta title="Tableau de bord — HydroScan" description="Suivez votre consommation d'eau et vos indicateurs de performance en temps réel." />
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground text-sm">
            Vue d'ensemble de votre empreinte hydrique
          </p>
        </div>
        <DashboardFilters site={site} setSite={setSite} period={period} setPeriod={setPeriod} />
      </div>

      {/* KPIs */}
      <KpiCards />

      {/* Charts + Benchmark */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ConsumptionChart />
        </div>
        <UsagePieChart />
      </div>

      {/* Heatmap + Benchmark */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WaterHeatmap />
        <BenchmarkWidget />
      </div>

      {/* Objectives + Alerts + Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ObjectivesWidget />
        <AlertsWidget />
        <QuickActions />
      </div>
    </div>
  );
}
