import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageMeta } from "@/components/PageMeta";
import { FileText, Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

function downloadCSV(data: any[], filename: string) {
  if (!data.length) return;
  const headers = ["Date", "Volume (m³)", "Source", "Usage", "Période"];
  const rows = data.map((r) => [r.recorded_date, r.volume_m3, r.source, r.usage, r.period]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generatePDFContent(data: any[], title: string) {
  const totalVolume = data.reduce((sum, r) => sum + Number(r.volume_m3), 0);
  const sourceBreakdown = data.reduce((acc: Record<string, number>, r) => {
    acc[r.source] = (acc[r.source] || 0) + Number(r.volume_m3);
    return acc;
  }, {});

  let html = `<!DOCTYPE html><html><head><title>${title}</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a1a; }
      h1 { color: #0e7490; border-bottom: 2px solid #0e7490; padding-bottom: 8px; }
      h2 { color: #374151; margin-top: 24px; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; font-size: 14px; }
      th { background: #f3f4f6; font-weight: 600; }
      .summary { background: #f0fdfa; padding: 16px; border-radius: 8px; margin: 16px 0; }
      .summary strong { color: #0e7490; }
    </style></head><body>`;
  html += `<h1>${title}</h1>`;
  html += `<p>Généré le ${new Date().toLocaleDateString("fr-FR")}</p>`;
  html += `<div class="summary"><strong>Volume total :</strong> ${totalVolume.toLocaleString("fr-FR")} m³</div>`;
  html += `<h2>Répartition par source</h2><table><thead><tr><th>Source</th><th>Volume (m³)</th></tr></thead><tbody>`;
  Object.entries(sourceBreakdown).forEach(([source, vol]) => {
    html += `<tr><td>${source}</td><td>${(vol as number).toLocaleString("fr-FR")}</td></tr>`;
  });
  html += `</tbody></table>`;
  html += `<h2>Détail des saisies</h2><table><thead><tr><th>Date</th><th>Volume</th><th>Source</th><th>Usage</th><th>Période</th></tr></thead><tbody>`;
  data.forEach((r) => {
    html += `<tr><td>${r.recorded_date}</td><td>${r.volume_m3}</td><td>${r.source}</td><td>${r.usage}</td><td>${r.period}</td></tr>`;
  });
  html += `</tbody></table></body></html>`;

  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    w.print();
  }
}

const reportTemplates = [
  { id: "water-footprint", title: "Rapport Empreinte Hydrique", type: "Empreinte Hydrique" },
  { id: "gri-303", title: "Rapport GRI 303", type: "GRI 303" },
  { id: "iso-14046", title: "Rapport ISO 14046 simplifié", type: "ISO 14046" },
];

export default function Reports() {
  const { user } = useAuth();

  const { data: userRole } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("organization_id")
        .eq("user_id", user!.id)
        .limit(1)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: consumptionData = [], isLoading } = useQuery({
    queryKey: ["waterConsumptionAll", userRole?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("water_consumption")
        .select("*")
        .eq("organization_id", userRole!.organization_id)
        .order("recorded_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userRole?.organization_id,
  });

  const handleCSV = () => {
    if (!consumptionData.length) {
      toast.info("Aucune donnée à exporter");
      return;
    }
    downloadCSV(consumptionData, `hydroscan-export-${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success("Fichier CSV téléchargé");
  };

  const handlePDF = (title: string) => {
    if (!consumptionData.length) {
      toast.info("Aucune donnée à exporter");
      return;
    }
    generatePDFContent(consumptionData, title);
  };

  return (
    <div className="space-y-6">
      <PageMeta title="Rapports — HydroScan" description="Générez et exportez vos rapports d'empreinte hydrique." />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Rapports</h1>
          <p className="text-muted-foreground">
            Générez et téléchargez vos rapports d'empreinte hydrique
          </p>
        </div>
        <Button className="gap-2" onClick={handleCSV}>
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      <div className="grid gap-4">
        {reportTemplates.map((report) => (
          <Card key={report.id} className="shadow-card">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {consumptionData.length} saisie(s) disponible(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{report.type}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handlePDF(report.title)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
