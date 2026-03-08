import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const reports = [
  {
    id: 1,
    title: "Rapport Empreinte Hydrique — Q1 2024",
    type: "Empreinte Hydrique",
    date: "2024-03-31",
    status: "ready",
  },
  {
    id: 2,
    title: "Rapport GRI 303 — 2023",
    type: "GRI 303",
    date: "2024-01-15",
    status: "ready",
  },
  {
    id: 3,
    title: "Rapport ISO 14046 simplifié — 2023",
    type: "ISO 14046",
    date: "2024-01-15",
    status: "ready",
  },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Rapports</h1>
          <p className="text-muted-foreground">
            Générez et téléchargez vos rapports d'empreinte hydrique
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => toast.success("Génération du rapport en cours...")}
        >
          <FileText className="h-4 w-4" />
          Nouveau rapport
        </Button>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="shadow-card">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-muted-foreground">{report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{report.type}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => toast.info("Téléchargement simulé")}
                >
                  <Download className="h-3 w-3" />
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
