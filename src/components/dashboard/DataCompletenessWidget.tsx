import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Circle } from "lucide-react";

interface Props {
  consumption: { recorded_date: string; site_id?: string | null; source: string }[];
  sitesCount: number;
  year: string;
}

export function DataCompletenessWidget({ consumption, sitesCount, year }: Props) {
  // Months covered in the selected year
  const coveredMonths = new Set(
    consumption
      .filter((c) => c.recorded_date?.startsWith(year))
      .map((c) => c.recorded_date?.slice(0, 7))
  );

  const monthsWithData = coveredMonths.size;
  const totalMonths = 12;
  const monthPct = Math.round((monthsWithData / totalMonths) * 100);

  // Site assignment coverage
  const withSite = consumption.filter((c) => c.site_id).length;
  const sitePct = consumption.length > 0 ? Math.round((withSite / consumption.length) * 100) : 0;

  // Source diversity (at least 2 sources = good)
  const sources = new Set(consumption.map((c) => c.source));
  const sourcePct = Math.min(Math.round((sources.size / 3) * 100), 100);

  const overall = Math.round((monthPct + sitePct + sourcePct) / 3);

  const checks = [
    { label: "Couverture mensuelle", pct: monthPct, detail: `${monthsWithData}/12 mois renseignés` },
    { label: "Sites assignés", pct: sitePct, detail: sitesCount > 0 ? `${sitePct}% des saisies liées à un site` : "Aucun site créé" },
    { label: "Diversité des sources", pct: sourcePct, detail: `${sources.size} source(s) saisie(s)` },
  ];

  const scoreColor =
    overall >= 80 ? "text-emerald-600" :
    overall >= 50 ? "text-amber-500" :
    "text-destructive";

  const ringColor =
    overall >= 80 ? "stroke-emerald-500" :
    overall >= 50 ? "stroke-amber-400" :
    "stroke-destructive";

  const circumference = 2 * Math.PI * 28;
  const dash = (overall / 100) * circumference;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Complétude des données
        </CardTitle>
        <p className="text-xs text-muted-foreground">Qualité du reporting — {year}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ring score */}
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
              <circle
                cx="36" cy="36" r="28"
                fill="none"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={circumference / 4}
                className={ringColor}
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-lg font-black ${scoreColor}`}>
              {overall}%
            </span>
          </div>
          <div className="flex-1 space-y-1">
            <p className={`text-sm font-semibold ${scoreColor}`}>
              {overall >= 80 ? "Données complètes ✓" : overall >= 50 ? "Complétude partielle" : "Données insuffisantes"}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {overall >= 80
                ? "Votre reporting est conforme pour les normes CSRD / GRI 303."
                : overall >= 50
                ? "Complétez les mois manquants pour un reporting conforme."
                : "Ajoutez des données pour activer l'analyse d'impact."}
            </p>
          </div>
        </div>

        {/* Checks */}
        <div className="space-y-2">
          {checks.map((c) => (
            <div key={c.label} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs min-w-0">
                <div className="flex items-center gap-1.5 shrink-0">
                  {c.pct >= 75 ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : c.pct >= 40 ? (
                    <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                  <span className="font-medium">{c.label}</span>
                </div>
                <span className="text-muted-foreground truncate text-right">{c.detail}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    c.pct >= 75 ? "bg-emerald-500" : c.pct >= 40 ? "bg-amber-400" : "bg-destructive"
                  }`}
                  style={{ width: `${c.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
