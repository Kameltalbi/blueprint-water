import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageMeta } from "@/components/PageMeta";
import { FileText, Download, Loader2, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUserRole, useWaterConsumption, useSites, useOrganization } from "@/hooks/useOrgData";
import { generateWaterReport } from "@/lib/generateWaterReport";

/* ── CSV export ── */
function downloadCSV(data: any[], filename: string) {
  if (!data.length) return;
  const headers = ["Date", "Volume (m³)", "Source", "Usage", "Période"];
  const rows = data.map((r) => [r.recorded_date, r.volume_m3, r.source, r.usage, r.period]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const reportTemplates = [
  {
    id: "water-footprint" as const,
    title: "Rapport Empreinte Hydrique",
    desc: "Rapport complet : consommation directe, empreinte pondérée WSI, analyse par site",
    type: "ISO 14046 | GRI 303",
    sections: ["Page de couverture", "Résumé exécutif", "Analyse par site (WSI)", "Détail des saisies", "Méthodologie"],
  },
  {
    id: "gri-303" as const,
    title: "Rapport GRI 303",
    desc: "Reporting eau conforme au standard GRI 303 — Water and Effluents",
    type: "GRI 303",
    sections: ["Indicateurs GRI 303-1", "Consommation par source", "Analyse d'impact", "Méthodologie"],
  },
  {
    id: "iso-14046" as const,
    title: "Rapport ISO 14046",
    desc: "Empreinte eau selon la norme internationale ISO 14046:2014",
    type: "ISO 14046",
    sections: ["Périmètre & objectifs", "Inventaire des flux", "Évaluation de l'impact", "Interprétation"],
  },
];

export default function Reports() {
  const [generating, setGenerating] = useState<string | null>(null);
  const { data: userRole } = useUserRole();
  const { data: consumptionData = [], isLoading } = useWaterConsumption(userRole?.organization_id);
  const { data: sites = [] } = useSites(userRole?.organization_id);
  const { data: org } = useOrganization(userRole?.organization_id);

  const orgName = org?.name || "Organisation";

  const handleCSV = () => {
    if (!consumptionData.length) { toast.info("Aucune donnée à exporter"); return; }
    downloadCSV(consumptionData, `hydroscan-export-${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success("Fichier CSV téléchargé");
  };

  const handlePDF = async (id: typeof reportTemplates[number]["id"]) => {
    if (!consumptionData.length) { toast.info("Ajoutez des données avant de générer un rapport"); return; }
    setGenerating(id);
    try {
      await new Promise((r) => setTimeout(r, 100)); // let UI update
      generateWaterReport({ orgName, consumption: consumptionData, sites, reportType: id });
      toast.success("Rapport PDF téléchargé !");
    } catch (e) {
      toast.error("Erreur lors de la génération du rapport");
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageMeta title="Rapports — HydroScan" description="Générez et exportez vos rapports d'empreinte hydrique." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Rapports & Exports</h1>
          <p className="text-muted-foreground text-sm">
            Générez des rapports structurés conformes aux normes ISO 14046 et GRI 303
          </p>
        </div>
        <Button variant="outline" className="gap-2 self-start sm:self-auto" onClick={handleCSV} disabled={isLoading}>
          <FileSpreadsheet className="h-4 w-4" />
          Export CSV brut
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Saisies disponibles", value: consumptionData.length, color: "text-primary" },
          { label: "Sites couverts", value: sites.length, color: "text-primary" },
          { label: "Volume total (m³)", value: consumptionData.reduce((s, r) => s + Number(r.volume_m3), 0).toLocaleString("fr-FR"), color: "text-primary" },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="pt-4 pb-3 text-center">
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report templates */}
      <div className="grid gap-4">
        {reportTemplates.map((report) => (
          <Card key={report.id} className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{report.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-xs">{report.type}</Badge>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => handlePDF(report.id)}
                    disabled={isLoading || generating === report.id}
                  >
                    {generating === report.id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Download className="h-3.5 w-3.5" />}
                    {generating === report.id ? "Génération..." : "Télécharger PDF"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {report.sections.map((s) => (
                  <span key={s} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {s}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Les rapports PDF sont générés localement dans votre navigateur. Aucune donnée n'est transmise à des tiers.
      </p>
    </div>
  );
}
