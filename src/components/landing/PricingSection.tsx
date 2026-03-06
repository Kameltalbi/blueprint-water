import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    price: "Gratuit",
    description: "Pour découvrir la plateforme",
    highlight: false,
    features: [
      { text: "1 site", included: true },
      { text: "1 utilisateur", included: true },
      { text: "Rapports de base", included: true },
      { text: "Calculateur empreinte", included: true },
      { text: "Dashboard complet", included: false },
      { text: "Export PDF", included: false },
      { text: "Accès API", included: false },
    ],
  },
  {
    name: "Pro",
    price: "49€",
    period: "/mois",
    description: "Pour les PME engagées",
    highlight: true,
    features: [
      { text: "5 sites", included: true },
      { text: "5 utilisateurs", included: true },
      { text: "Tous les rapports", included: true },
      { text: "Dashboard complet", included: true },
      { text: "Export PDF & Excel", included: true },
      { text: "Recommandations IA", included: true },
      { text: "Accès API", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    description: "Pour les grands groupes",
    highlight: false,
    features: [
      { text: "Sites illimités", included: true },
      { text: "Utilisateurs illimités", included: true },
      { text: "Tous les rapports", included: true },
      { text: "Dashboard avancé", included: true },
      { text: "Export complet", included: true },
      { text: "Recommandations IA", included: true },
      { text: "Accès API complet", included: true },
    ],
  },
];

export function PricingSection() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`relative shadow-card transition-shadow hover:shadow-elevated ${
            plan.highlight ? "border-primary ring-2 ring-primary/20" : ""
          }`}
        >
          {plan.highlight && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
              Populaire
            </Badge>
          )}
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-3">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.period && (
                <span className="text-muted-foreground">{plan.period}</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {plan.features.map((f) => (
              <div key={f.text} className="flex items-center gap-2 text-sm">
                {f.included ? (
                  <Check className="h-4 w-4 shrink-0 text-green-water" />
                ) : (
                  <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                )}
                <span className={f.included ? "" : "text-muted-foreground/60"}>
                  {f.text}
                </span>
              </div>
            ))}
            <Button
              className="mt-4 w-full"
              variant={plan.highlight ? "default" : "outline"}
            >
              {plan.price === "Sur mesure" ? "Contacter" : "Commencer"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
