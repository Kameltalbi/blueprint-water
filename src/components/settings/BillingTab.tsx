import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard, Download, Zap } from "lucide-react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "Gratuit",
    features: ["1 site", "Saisie manuelle", "Rapport PDF basique", "Support email"],
    cta: "Plan actuel",
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "290 DT/mois",
    features: ["5 sites", "Chaîne logistique (achats)", "Rapports GRI 303 + ISO 14046", "Benchmark sectoriel", "Support prioritaire"],
    cta: "Passer au Pro",
    current: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Sur devis",
    features: ["Sites illimités", "API compteurs connectés", "Tableau de bord multi-entités", "Audit & certification", "Account manager dédié"],
    cta: "Nous contacter",
    current: false,
  },
];

const INVOICES = [
  { id: "INV-2026-03", date: "01/03/2026", amount: "0 DT", status: "Payée" },
  { id: "INV-2026-02", date: "01/02/2026", amount: "0 DT", status: "Payée" },
  { id: "INV-2026-01", date: "01/01/2026", amount: "0 DT", status: "Payée" },
];

export default function BillingTab() {
  return (
    <div className="space-y-6 pt-4">
      {/* Current plan */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-4 flex items-center gap-4">
          <Zap className="h-8 w-8 text-primary shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Plan Starter — Actif</p>
            <p className="text-sm text-muted-foreground">Renouvelé automatiquement · Gratuit</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20">Actif</Badge>
        </CardContent>
      </Card>

      {/* Plans */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Choisir un plan</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <Card key={plan.id} className={plan.current ? "border-primary/40 bg-primary/5" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  {plan.current && <Badge variant="outline" className="text-xs">Actuel</Badge>}
                </div>
                <CardDescription className="text-lg font-bold text-foreground">{plan.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.current ? "outline" : "default"}
                  size="sm"
                  className={`w-full ${!plan.current ? "gradient-water text-primary-foreground" : ""}`}
                  disabled={plan.current}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          <CreditCard className="inline h-3.5 w-3.5 mr-1" />
          Historique de facturation
        </h3>
        <Card>
          <CardContent className="pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left text-xs font-semibold text-muted-foreground">Facture</th>
                  <th className="pb-2 text-left text-xs font-semibold text-muted-foreground">Date</th>
                  <th className="pb-2 text-right text-xs font-semibold text-muted-foreground">Montant</th>
                  <th className="pb-2 text-right text-xs font-semibold text-muted-foreground">Statut</th>
                  <th className="pb-2 text-right text-xs font-semibold text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0">
                    <td className="py-2.5 font-mono text-xs">{inv.id}</td>
                    <td className="py-2.5 text-muted-foreground text-xs">{inv.date}</td>
                    <td className="py-2.5 text-right">{inv.amount}</td>
                    <td className="py-2.5 text-right">
                      <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">{inv.status}</Badge>
                    </td>
                    <td className="py-2.5 text-right">
                      <button className="text-xs text-primary hover:underline flex items-center gap-0.5 ml-auto">
                        <Download className="h-3 w-3" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
