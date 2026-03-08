import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calculator, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: "Saisir des données", icon: Plus, path: "/data-entry", variant: "default" as const },
    { label: "Calculer empreinte", icon: Calculator, path: "/footprint", variant: "outline" as const },
    { label: "Générer rapport", icon: FileText, path: "/reports", variant: "outline" as const },
    { label: "Voir recommandations", icon: Lightbulb, path: "/recommendations", variant: "outline" as const },
  ];

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((a) => (
            <Button
              key={a.label}
              variant={a.variant}
              size="sm"
              className="h-auto py-3 flex-col gap-1.5 text-xs"
              onClick={() => navigate(a.path)}
            >
              <a.icon className="h-4 w-4" />
              {a.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
