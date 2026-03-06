import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export function PricingSection() {
  const { t } = useI18n();

  const plans = [
    {
      name: "Starter",
      price: t("pricing.title") === "Pricing" ? "Free" : "Gratuit",
      description: t("pricing.starter"),
      highlight: false,
      features: [
        { text: "1 site", included: true },
        { text: "1 " + (t("pricing.title") === "Pricing" ? "user" : "utilisateur"), included: true },
        { text: t("pricing.title") === "Pricing" ? "Basic reports" : "Rapports de base", included: true },
        { text: t("pricing.title") === "Pricing" ? "Footprint calculator" : "Calculateur empreinte", included: true },
        { text: t("pricing.title") === "Pricing" ? "Full dashboard" : "Dashboard complet", included: false },
        { text: "Export PDF", included: false },
        { text: t("pricing.title") === "Pricing" ? "API access" : "Accès API", included: false },
      ],
    },
    {
      name: "Pro",
      price: "49€",
      period: "/" + (t("pricing.title") === "Pricing" ? "mo" : "mois"),
      description: t("pricing.pro"),
      highlight: true,
      features: [
        { text: "5 sites", included: true },
        { text: "5 " + (t("pricing.title") === "Pricing" ? "users" : "utilisateurs"), included: true },
        { text: t("pricing.title") === "Pricing" ? "All reports" : "Tous les rapports", included: true },
        { text: t("pricing.title") === "Pricing" ? "Full dashboard" : "Dashboard complet", included: true },
        { text: "Export PDF & Excel", included: true },
        { text: t("pricing.title") === "Pricing" ? "AI recommendations" : "Recommandations IA", included: true },
        { text: t("pricing.title") === "Pricing" ? "API access" : "Accès API", included: false },
      ],
    },
    {
      name: "Enterprise",
      price: t("pricing.custom"),
      description: t("pricing.enterprise"),
      highlight: false,
      features: [
        { text: t("pricing.title") === "Pricing" ? "Unlimited sites" : "Sites illimités", included: true },
        { text: t("pricing.title") === "Pricing" ? "Unlimited users" : "Utilisateurs illimités", included: true },
        { text: t("pricing.title") === "Pricing" ? "All reports" : "Tous les rapports", included: true },
        { text: t("pricing.title") === "Pricing" ? "Advanced dashboard" : "Dashboard avancé", included: true },
        { text: t("pricing.title") === "Pricing" ? "Full export" : "Export complet", included: true },
        { text: t("pricing.title") === "Pricing" ? "AI recommendations" : "Recommandations IA", included: true },
        { text: t("pricing.title") === "Pricing" ? "Full API access" : "Accès API complet", included: true },
      ],
    },
  ];

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
              {t("pricing.popular")}
            </Badge>
          )}
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-3">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
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
                <span className={f.included ? "" : "text-muted-foreground/60"}>{f.text}</span>
              </div>
            ))}
            <Button className="mt-4 w-full" variant={plan.highlight ? "default" : "outline"}>
              {plan.price === t("pricing.custom") ? t("pricing.contact") : t("pricing.start")}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
