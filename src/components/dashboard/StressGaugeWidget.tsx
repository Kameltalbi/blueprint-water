import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, MapPin } from "lucide-react";
import { loadOrgProfile, wsiByGovernorate } from "@/lib/org-profile";
import { wsiByCountry } from "@/lib/water-data";
import { useCountryMode } from "@/contexts/CountryMode";

function getLevel(wsi: number): { label: string; color: string; bg: string; textColor: string; pct: number } {
  if (wsi >= 4.5) return { label: "Stress extrême",    color: "#ef4444", bg: "bg-red-500",    textColor: "text-red-600",    pct: 95 };
  if (wsi >= 3.5) return { label: "Stress élevé",      color: "#f97316", bg: "bg-orange-500", textColor: "text-orange-600", pct: 75 };
  if (wsi >= 2.5) return { label: "Stress moyen-élevé",color: "#eab308", bg: "bg-yellow-500", textColor: "text-yellow-600", pct: 55 };
  if (wsi >= 1.5) return { label: "Stress modéré",     color: "#84cc16", bg: "bg-lime-500",   textColor: "text-lime-600",   pct: 35 };
  return           { label: "Stress faible",           color: "#22c55e", bg: "bg-green-500",  textColor: "text-green-600",  pct: 15 };
}

export function StressGaugeWidget() {
  const { isTunisia } = useCountryMode();
  const profile = loadOrgProfile();

  let wsi = 4.2;
  let locationLabel = "Tunisie";

  if (isTunisia && profile.governorate && wsiByGovernorate[profile.governorate]) {
    wsi = wsiByGovernorate[profile.governorate];
    locationLabel = profile.governorate;
  } else if (!isTunisia && profile.country) {
    const key = profile.country.toLowerCase().replace(/é/g, "e").replace(/è/g, "e").replace(/ê/g, "e").replace(/\s/g, "_");
    wsi = wsiByCountry[key]?.wsi ?? 2.0;
    locationLabel = profile.country;
  }

  const level = getLevel(wsi);

  const segments = [
    { color: "#22c55e", label: "Faible" },
    { color: "#84cc16", label: "Modéré" },
    { color: "#eab308", label: "Moyen-élevé" },
    { color: "#f97316", label: "Élevé" },
    { color: "#ef4444", label: "Extrême" },
  ];

  const needleDeg = -90 + (wsi / 5) * 180;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-primary" />
            Stress hydrique local
          </CardTitle>
          <Badge variant="outline" className="text-xs gap-1">
            <MapPin className="h-3 w-3" />{locationLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Semi-circle gauge */}
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-20 overflow-hidden">
            {/* Arc segments */}
            <svg viewBox="0 0 100 50" className="w-full h-full">
              {segments.map((seg, i) => {
                const startAngle = (i / 5) * 180 - 180;
                const endAngle = ((i + 1) / 5) * 180 - 180;
                const r = 45, cx = 50, cy = 50;
                const toRad = (d: number) => (d * Math.PI) / 180;
                const x1 = cx + r * Math.cos(toRad(startAngle));
                const y1 = cy + r * Math.sin(toRad(startAngle));
                const x2 = cx + r * Math.cos(toRad(endAngle));
                const y2 = cy + r * Math.sin(toRad(endAngle));
                return (
                  <path
                    key={i}
                    d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                    fill={seg.color}
                    opacity={0.85}
                  />
                );
              })}
              {/* White inner circle */}
              <circle cx="50" cy="50" r="28" fill="hsl(var(--card))" />
              {/* Needle */}
              <g transform={`rotate(${needleDeg}, 50, 50)`}>
                <line x1="50" y1="50" x2="50" y2="10" stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round" />
              </g>
              <circle cx="50" cy="50" r="4" fill="hsl(var(--foreground))" />
            </svg>
          </div>
          <div className="text-center -mt-1">
            <span className={`text-2xl font-black ${level.textColor}`}>{wsi.toFixed(1)}<span className="text-sm font-normal text-muted-foreground">/5</span></span>
            <p className={`text-xs font-semibold mt-0.5 ${level.textColor}`}>{level.label}</p>
          </div>
        </div>

        {/* Scale legend */}
        <div className="flex rounded-full overflow-hidden h-2">
          {segments.map((s) => (
            <div key={s.label} className="flex-1" style={{ backgroundColor: s.color }} />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
          <span>0 Faible</span>
          <span>5 Extrême</span>
        </div>

        {/* Context */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          {wsi >= 4.5
            ? "Zone en pénurie critique — chaque m³ compte doublement."
            : wsi >= 3.5
            ? "Ressources sous forte pression — optimisation prioritaire."
            : wsi >= 2.5
            ? "Stress hydrique notable — surveillance recommandée."
            : "Zone relativement bien dotée en eau."}
        </p>
      </CardContent>
    </Card>
  );
}
