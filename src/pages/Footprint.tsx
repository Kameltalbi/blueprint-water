import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, CloudRain, Beaker, Loader2, AlertTriangle, ShieldCheck, ShieldAlert, Info } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, ReferenceLine,
} from "recharts";
import { useUserRole, useWaterConsumption, useOrganization } from "@/hooks/useOrgData";
import { useMemo } from "react";
import { assessSustainability, WFN_DISCLAIMER, type SustainabilityAssessment } from "@/lib/wf-sustainability";
import { wsiByCountry } from "@/lib/water-data";

function getWaterScore(total: number, employees: number) {
  const perCapita = employees > 0 ? total / employees : total;
  if (perCapita < 50) return { grade: "A", color: "text-green-water" };
  if (perCapita < 100) return { grade: "B", color: "text-blue-water" };
  if (perCapita < 200) return { grade: "C", color: "text-yellow-500" };
  return { grade: "D", color: "text-destructive" };
}

function getStatusBadge(status: SustainabilityAssessment["overallStatus"]) {
  switch (status) {
    case "sustainable": return { label: "Soutenable", variant: "default" as const, icon: ShieldCheck, color: "text-green-water" };
    case "moderate": return { label: "Modéré", variant: "secondary" as const, icon: ShieldAlert, color: "text-yellow-500" };
    case "unsustainable": return { label: "Insoutenable", variant: "destructive" as const, icon: AlertTriangle, color: "text-destructive" };
  }
}

export default function Footprint() {
  const { data: role } = useUserRole();
  const { data: consumption, isLoading } = useWaterConsumption(role?.organization_id);
  const { data: org } = useOrganization(role?.organization_id);

  const { totalBlue, totalGreen, totalGrey, totalAll, monthlyData } = useMemo(() => {
    if (!consumption || consumption.length === 0) {
      return { totalBlue: 0, totalGreen: 0, totalGrey: 0, totalAll: 0, monthlyData: [] };
    }

    let blue = 0, green = 0, grey = 0;
    const monthMap: Record<string, { blue: number; green: number; grey: number }> = {};

    for (const entry of consumption) {
      const vol = Number(entry.volume_m3) || 0;
      const src = (entry.source || "").toLowerCase();
      const date = new Date(entry.recorded_date);
      const monthKey = date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

      if (!monthMap[monthKey]) monthMap[monthKey] = { blue: 0, green: 0, grey: 0 };

      if (src.includes("pluie") || src.includes("vert")) {
        green += vol;
        monthMap[monthKey].green += vol;
      } else if (src.includes("gris") || src.includes("recycl")) {
        grey += vol;
        monthMap[monthKey].grey += vol;
      } else {
        blue += vol;
        monthMap[monthKey].blue += vol;
      }
    }

    return {
      totalBlue: blue,
      totalGreen: green,
      totalGrey: grey,
      totalAll: blue + green + grey,
      monthlyData: Object.entries(monthMap).map(([month, vals]) => ({ month, ...vals })),
    };
  }, [consumption]);

  // WSI from org country
  const wsi = useMemo(() => {
    const country = (org?.country || "tunisie").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_");
    return wsiByCountry[country]?.wsi ?? wsiByCountry["autre"].wsi;
  }, [org?.country]);

  // Sustainability assessment (WFN monthly hotspot analysis)
  const sustainability = useMemo(() => {
    if (monthlyData.length === 0) return null;
    const usesGroundwater = (consumption || []).some(e =>
      (e.source || "").toLowerCase().includes("souterrain") || (e.source || "").toLowerCase().includes("forage")
    );
    return assessSustainability(monthlyData, wsi, usesGroundwater);
  }, [monthlyData, wsi, consumption]);

  const employees = 1;
  const score = getWaterScore(totalAll, employees);

  const footprintCards = [
    { title: "Eau Bleue", icon: Droplets, value: totalBlue, description: "Eaux de surface et souterraines consommées (WF_bleu)", colorClass: "text-blue-water", bgClass: "bg-blue-water/10" },
    { title: "Eau Verte", icon: CloudRain, value: totalGreen, description: "Eau de pluie par évapotranspiration (WF_vert)", colorClass: "text-green-water", bgClass: "bg-green-water/10" },
    { title: "Eau Grise", icon: Beaker, value: totalGrey, description: "Volume pour diluer la pollution: L/(Cmax−Cnat)", colorClass: "text-grey-water", bgClass: "bg-grey-water/10" },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const statusBadge = sustainability ? getStatusBadge(sustainability.overallStatus) : null;

  return (
    <div className="space-y-6">
      <PageMeta title="Empreinte Eau — HydroScan" description="Visualisez la répartition de votre empreinte eau verte, bleue et grise selon le WFN Manual." />
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Empreinte hydrique</h1>
        <p className="text-muted-foreground">Analyse selon la méthodologie WFN / ISO 14046</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {footprintCards.map((card) => (
          <Card key={card.title} className="shadow-card">
            <CardContent className="p-5">
              <div className={`inline-flex rounded-lg p-2 ${card.bgClass}`}>
                <card.icon className={`h-5 w-5 ${card.colorClass}`} />
              </div>
              <p className="mt-3 text-2xl font-bold">{card.value.toLocaleString("fr-FR")} m³</p>
              <p className="font-medium">{card.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sustainability Assessment */}
      {sustainability && statusBadge && (
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <statusBadge.icon className={`h-5 w-5 ${statusBadge.color}`} />
              Évaluation de la durabilité (Phase 3 WFN)
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Pénurie bleue max (WS)</p>
                <p className={`text-xl font-bold ${sustainability.maxWsBlue > 1 ? "text-destructive" : "text-green-water"}`}>
                  {sustainability.maxWsBlue.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{sustainability.maxWsBlue > 1 ? "Hotspot !" : "< seuil"}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Pollution max (WPL)</p>
                <p className={`text-xl font-bold ${sustainability.maxWpl > 1 ? "text-destructive" : "text-green-water"}`}>
                  {sustainability.maxWpl.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{sustainability.maxWpl > 1 ? "Hotspot !" : "< seuil"}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Mois critiques</p>
                <p className={`text-xl font-bold ${sustainability.hotspotCount > 0 ? "text-destructive" : "text-green-water"}`}>
                  {sustainability.hotspotCount} / {sustainability.hotspots.length}
                </p>
                <p className="text-xs text-muted-foreground">WSI zone : {wsi}</p>
              </div>
            </div>

            {sustainability.alerts.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-border">
                {sustainability.alerts.map((alert, i) => (
                  <p key={i} className="text-sm">{alert}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total annuel", value: `${(totalAll / 1000).toFixed(1)}k m³` },
          { label: "Score", value: score.grade, className: score.color },
          { label: "Entrées", value: `${consumption?.length ?? 0}` },
        ].map((ind) => (
          <Card key={ind.label} className="shadow-card">
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">{ind.label}</p>
              <p className={`text-2xl font-bold ${ind.className ?? ""}`}>{ind.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {monthlyData.length > 0 && (
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Évolution mensuelle par catégorie</CardTitle></CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 20%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend />
                  <Bar dataKey="blue" name="Eau Bleue" fill="hsl(201, 96%, 32%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="green" name="Eau Verte" fill="hsl(142, 72%, 29%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="grey" name="Eau Grise" fill="hsl(220, 9%, 46%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hotspot monthly chart */}
      {sustainability && sustainability.hotspots.length > 0 && (
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Analyse mensuelle des hotspots (WFN Phase 3)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sustainability.hotspots}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(214, 20%, 90%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend />
                  <ReferenceLine y={1} stroke="hsl(0, 72%, 51%)" strokeDasharray="5 5" label={{ value: "Seuil hotspot", fill: "hsl(0, 72%, 51%)", fontSize: 11 }} />
                  <Line type="monotone" dataKey="wsBlue" name="Pénurie bleue (WS)" stroke="hsl(201, 96%, 32%)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="wpl" name="Pollution (WPL)" stroke="hsl(220, 9%, 46%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              WS &gt; 1 = la demande en eau bleue dépasse la disponibilité. WPL &gt; 1 = la capacité d'assimilation du milieu est dépassée.
            </p>
          </CardContent>
        </Card>
      )}

      {/* WFN Disclaimer */}
      <Card className="shadow-card border-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            Limites méthodologiques (WFN Manual, 2011)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-1">
            {WFN_DISCLAIMER.map((d, i) => (
              <li key={i} className="text-xs text-muted-foreground">• {d}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
