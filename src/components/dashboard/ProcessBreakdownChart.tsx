import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* Colour palette per process category */
const PROCESS_COLORS: Record<string, string> = {
  "Processus industriel":    "#3b82f6",
  "Refroidissement":         "#06b6d4",
  "Nettoyage / Lavage":      "#8b5cf6",
  "Rinçage":                 "#a78bfa",
  "Chaudière / Vapeur":      "#f97316",
  "Irrigation":              "#22c55e",
  "Sanitaire":               "#84cc16",
  "Transport pneumatique":   "#eab308",
  "Autre usage":             "#94a3b8",
  /* legacy labels still in DB */
  "Processus":               "#3b82f6",
  "Lavage":                  "#8b5cf6",
  "Nettoyage":               "#8b5cf6",
};

function barColor(usage: string): string {
  return PROCESS_COLORS[usage] ?? "#64748b";
}

interface Props {
  consumption: { usage: string; volume_m3: number | string }[];
}

export function ProcessBreakdownChart({ consumption }: Props) {
  const byProcess = consumption.reduce((acc: Record<string, number>, c) => {
    const key = c.usage || "Non renseigné";
    acc[key] = (acc[key] || 0) + Number(c.volume_m3);
    return acc;
  }, {});

  const total = Object.values(byProcess).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(byProcess)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  /* Industry benchmarks (% of total) for Tunisian manufacturing SMEs */
  const BENCHMARKS: Record<string, number> = {
    "Processus industriel": 45,
    "Refroidissement": 20,
    "Nettoyage / Lavage": 15,
    "Nettoyage": 15,
    "Rinçage": 8,
    "Chaudière / Vapeur": 5,
    "Irrigation": 4,
    "Sanitaire": 3,
  };

  return (
    <Card className="shadow-card lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Consommation par processus</CardTitle>
        <CardDescription>
          Répartition de votre eau par usage opérationnel — {total > 0 ? `${total.toLocaleString("fr-FR")} m³` : "aucune donnée"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Aucune donnée — ajoutez des saisies avec un type d'usage dans <strong>Saisie des données</strong>.
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map(([usage, vol]) => {
              const pct = total > 0 ? (vol / total) * 100 : 0;
              const benchmark = BENCHMARKS[usage];
              const drift = benchmark != null ? pct - benchmark : null;
              return (
                <div key={usage}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: barColor(usage) }}
                      />
                      <span className="text-sm font-medium truncate">{usage}</span>
                      {drift !== null && Math.abs(drift) > 5 && (
                        <Badge
                          variant={drift > 0 ? "destructive" : "outline"}
                          className={`text-[0.6rem] px-1.5 py-0 h-4 shrink-0 ${drift < 0 ? "border-emerald-500 text-emerald-600" : ""}`}
                        >
                          {drift > 0 ? `+${drift.toFixed(0)}%` : `${drift.toFixed(0)}%`} vs. réf.
                        </Badge>
                      )}
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="text-sm font-bold">{pct.toFixed(1)}%</span>
                      <span className="text-xs text-muted-foreground ml-1.5">
                        {vol >= 1000 ? `${(vol / 1000).toFixed(1)}k` : vol.toLocaleString("fr-FR")} m³
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: barColor(usage) }}
                    />
                    {benchmark != null && (
                      <div
                        className="absolute top-0 h-full w-0.5 bg-foreground/30"
                        style={{ left: `${Math.min(benchmark, 100)}%` }}
                        title={`Référence secteur : ${benchmark}%`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            <p className="text-[0.65rem] text-muted-foreground pt-2 border-t border-border">
              Le trait vertical sur chaque barre indique la référence sectorielle tunisienne.
              Les badges <span className="text-destructive font-semibold">en rouge</span> signalent un usage supérieur à la moyenne.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
