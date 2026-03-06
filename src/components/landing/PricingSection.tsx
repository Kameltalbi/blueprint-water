import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export function PricingSection() {
  const { t, lang } = useI18n();
  const fr = lang === "fr";

  const plans = [
    {
      name: "Starter",
      description: fr
        ? "Pour démarrer la mesure de votre empreinte eau"
        : "Start measuring your water footprint",
      highlight: false,
      cta: fr ? "Demander une démo" : "Request a demo",
      features: fr
        ? ["1 site", "1 utilisateur", "Tableau de bord consommation", "Calcul empreinte eau (bleue, verte, grise)", "Graphiques essentiels", "Export données"]
        : ["1 site", "1 user", "Consumption dashboard", "Water footprint calculation (blue, green, grey)", "Essential charts", "Data export"],
    },
    {
      name: "Pro",
      description: fr
        ? "Pour optimiser la gestion de l'eau"
        : "Optimize your water management",
      highlight: true,
      cta: fr ? "Nous contacter" : "Contact us",
      features: fr
        ? ["Jusqu'à 5 sites", "Jusqu'à 5 utilisateurs", "Comparaison multisites", "Alertes de consommation", "Benchmark sectoriel", "Recommandations d'optimisation", "Rapports PDF"]
        : ["Up to 5 sites", "Up to 5 users", "Multi-site comparison", "Consumption alerts", "Industry benchmark", "Optimization recommendations", "PDF reports"],
    },
    {
      name: "Enterprise",
      description: fr
        ? "Pour les organisations multisites et groupes industriels"
        : "For multi-site organizations and industrial groups",
      highlight: false,
      cta: fr ? "Parler à un expert" : "Talk to an expert",
      features: fr
        ? ["Sites illimités", "Utilisateurs illimités", "Accès API complet", "Reporting ESG avancé", "Intégration ERP", "Support dédié", "Accompagnement personnalisé"]
        : ["Unlimited sites", "Unlimited users", "Full API access", "Advanced ESG reporting", "ERP integration", "Dedicated support", "Personalized onboarding"],
    },
  ];

  return (
    <div className="space-y-8">
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
                {fr ? "Plan recommandé" : "Recommended"}
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-green-water" />
                  <span>{f}</span>
                </div>
              ))}
              <Button
                className="mt-4 w-full"
                variant={plan.highlight ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {fr
          ? "Les tarifs sont adaptés selon la taille de votre organisation, le nombre de sites et les fonctionnalités requises."
          : "Pricing is adapted to your organization's size, number of sites, and required features."}
      </p>
    </div>
  );
}
