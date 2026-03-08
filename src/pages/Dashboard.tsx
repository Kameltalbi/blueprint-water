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
            D'où vient votre eau, comment vous l'utilisez et quel est votre impact réel
          </p>
        </div>
        <DashboardFilters site={site} setSite={setSite} period={period} setPeriod={setPeriod} />
      </div>

      {/* Row 1: KPIs — Empreinte totale, Stress, Intensité, Économie */}
      <KpiCards />

      {/* Row 2: Mix Empreinte (Donut) + Top contributeurs par site */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WaterMixDonut />
        <SiteBreakdownChart />
      </div>

      {/* Row 3: Carte stress hydrique pleine largeur */}
      <WaterHeatmap />

      {/* Row 4: Jauges objectifs + Évolution mensuelle */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ObjectivesWidget />
        <div className="lg:col-span-2">
          <ConsumptionChart />
        </div>
      </div>

      {/* Row 5: Benchmark + Alertes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BenchmarkWidget />
        <AlertsWidget />
      </div>
    </div>
  );
}
