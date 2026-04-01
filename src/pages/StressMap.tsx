import "leaflet/dist/leaflet.css";
import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { useUserRole, useSites, useWaterConsumption } from "@/hooks/useOrgData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { wsiByCountry } from "@/lib/water-data";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";

/* ── Country coordinates for WSI visualization ── */
const countryCoords: Record<string, [number, number]> = {
  tunisie:         [33.8, 9.5],
  maroc:           [31.8, -7.0],
  algerie:         [28.0,  3.0],
  arabie_saoudite: [24.0, 45.0],
  egypte:          [26.0, 30.0],
  libye:           [27.0, 17.0],
  jordanie:        [31.0, 36.0],
  inde:            [20.0, 77.0],
  chine:           [35.0,105.0],
  turquie:         [39.0, 35.0],
  france:          [46.0,  2.0],
  espagne:         [40.0, -4.0],
  italie:          [42.0, 12.0],
  allemagne:       [51.0, 10.0],
  bresil:          [-15.0,-50.0],
  usa:             [38.0,-97.0],
};

/* ── Helpers ── */
function wsiColor(wsi: number): string {
  if (wsi >= 4.5) return "#ef4444";
  if (wsi >= 3.5) return "#f97316";
  if (wsi >= 2.5) return "#f59e0b";
  if (wsi >= 1.5) return "#84cc16";
  return "#22c55e";
}

function wsiTailwind(wsi: number): string {
  if (wsi >= 4) return "bg-red-500";
  if (wsi >= 3) return "bg-orange-500";
  if (wsi >= 2) return "bg-amber-400";
  return "bg-emerald-400";
}

function wsiTextColor(wsi: number): string {
  if (wsi >= 4) return "text-red-600";
  if (wsi >= 3) return "text-orange-600";
  if (wsi >= 2) return "text-amber-600";
  return "text-emerald-600";
}

/* ── Match site location text to a country key ── */
function matchCountry(location: string): string | null {
  const loc = location.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const aliases: Record<string, string> = {
    tunisie: "tunisie", tunisia: "tunisie",
    maroc: "maroc", morocco: "maroc",
    algerie: "algerie", algeria: "algerie",
    egypte: "egypte", egypt: "egypte",
    libye: "libye", libya: "libye",
    jordanie: "jordanie", jordan: "jordanie",
    france: "france",
    espagne: "espagne", spain: "espagne",
    italie: "italie", italy: "italie",
    allemagne: "allemagne", germany: "allemagne",
    inde: "inde", india: "inde",
    chine: "chine", china: "chine",
    turquie: "turquie", turkey: "turquie",
    bresil: "bresil", brazil: "bresil",
    usa: "usa", "etats-unis": "usa",
    arabie: "arabie_saoudite", "saudi": "arabie_saoudite",
  };
  for (const [key, val] of Object.entries(aliases)) {
    if (loc.includes(key)) return val;
  }
  return null;
}

export default function StressMap() {
  const { t } = useI18n();
  const { data: userRole } = useUserRole();
  const { data: sites = [] } = useSites(userRole?.organization_id);
  const { data: consumption = [] } = useWaterConsumption(userRole?.organization_id);

  /* ── Per-site analysis ── */
  const siteAnalysis = sites.map((site: any) => {
    const siteConsumption = consumption.filter((c) => c.site_id === site.id);
    const totalVolume = siteConsumption.reduce((s, c) => s + Number(c.volume_m3), 0);
    const countryKey = matchCountry(site.location || "");
    const wsiEntry = countryKey ? wsiByCountry[countryKey] : null;
    const coords = countryKey ? countryCoords[countryKey] : null;
    return {
      name: site.name,
      location: site.location || "—",
      volume: totalVolume,
      wsiScore: wsiEntry?.wsi ?? 2,
      label: wsiEntry?.label ?? "—",
      coords,
    };
  });

  return (
    <>
      <PageMeta title="Carte de Stress Hydrique — HydroScan" description="Visualisez le stress hydrique mondial et l'impact de vos sites" />
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{t("stressMap.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("stressMap.subtitle")}</p>
        </div>

        {/* ── Interactive Map ── */}
        <Card className="shadow-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-primary" />
              Carte mondiale du stress hydrique
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Cercles = indice WSI par pays (Aqueduct/WRI) · Marqueurs blancs = vos sites
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div style={{ height: 420 }}>
              <MapContainer
                center={[25, 20]}
                zoom={3}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* WSI circles per country */}
                {Object.entries(wsiByCountry).map(([key, data]) => {
                  const coords = countryCoords[key];
                  if (!coords) return null;
                  return (
                    <CircleMarker
                      key={key}
                      center={coords}
                      radius={data.wsi * 8}
                      pathOptions={{
                        color: wsiColor(data.wsi),
                        fillColor: wsiColor(data.wsi),
                        fillOpacity: 0.45,
                        weight: 1.5,
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -4]}>
                        <div className="text-xs font-medium">
                          <strong>{key.replace("_", " ").replace(/^\w/, c => c.toUpperCase())}</strong>
                          <br />WSI {data.wsi}/5 — {data.label}
                        </div>
                      </Tooltip>
                      <Popup>
                        <div className="text-sm space-y-1 min-w-[160px]">
                          <p className="font-semibold capitalize">{key.replace("_", " ")}</p>
                          <p>WSI : <strong>{data.wsi}/5</strong></p>
                          <p className="text-xs text-gray-500">{data.label}</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}

                {/* User site markers */}
                {siteAnalysis.filter(s => s.coords).map((site) => (
                  <CircleMarker
                    key={site.name}
                    center={site.coords!}
                    radius={10}
                    pathOptions={{
                      color: "#ffffff",
                      fillColor: wsiColor(site.wsiScore),
                      fillOpacity: 1,
                      weight: 2.5,
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -6]} permanent={false}>
                      <span className="text-xs font-bold">{site.name}</span>
                    </Tooltip>
                    <Popup>
                      <div className="text-sm space-y-1 min-w-[160px]">
                        <p className="font-semibold">{site.name}</p>
                        <p className="text-xs text-gray-500">{site.location}</p>
                        <p>WSI : <strong>{site.wsiScore}/5</strong> — {site.label}</p>
                        {site.volume > 0 && (
                          <p>Consommation : <strong>{site.volume.toLocaleString("fr-FR")} m³</strong></p>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground px-1">
          {[
            { color: "bg-emerald-500", label: "Faible (< 1.5)" },
            { color: "bg-lime-500",    label: "Modéré (1.5–2.5)" },
            { color: "bg-amber-400",   label: "Moyen (2.5–3.5)" },
            { color: "bg-orange-500",  label: "Élevé (3.5–4.5)" },
            { color: "bg-red-500",     label: "Extrême (> 4.5)" },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${color} opacity-70`} />
              {label}
            </span>
          ))}
          <span className="ml-auto opacity-50">Source : Aqueduct / WRI</span>
        </div>

        {/* ── Per-site analysis ── */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-primary" />
              Analyse par site
            </CardTitle>
            <p className="text-xs text-muted-foreground">Impact pondéré = volume × WSI local</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {siteAnalysis.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Ajoutez des sites dans <strong>Sites & Localisation</strong> pour voir l'analyse.
              </p>
            ) : (
              <>
                {siteAnalysis.sort((a, b) => b.wsiScore - a.wsiScore).map((item) => {
                  const weightedImpact = Math.round(item.volume * (item.wsiScore / 2));
                  const maxImpact = Math.max(...siteAnalysis.map((s) => Math.round(s.volume * (s.wsiScore / 2))), 1);
                  const barWidth = Math.min((weightedImpact / maxImpact) * 100, 100);
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${wsiTailwind(item.wsiScore)}`} />
                          <span className="text-xs font-semibold">{item.name}</span>
                          <span className="text-[0.65rem] text-muted-foreground">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${wsiTextColor(item.wsiScore)}`}>
                            {weightedImpact > 0 ? `${weightedImpact.toLocaleString("fr-FR")} m³eq` : "—"}
                          </span>
                          <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                            WSI {item.wsiScore}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${wsiTailwind(item.wsiScore)}`}
                          style={{ width: `${barWidth}%`, opacity: 0.75 }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-border text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Faible</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Moyen</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Élevé</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Extrême</span>
                  </div>
                  <span className="text-[0.6rem]">Source: Aqueduct/WRI</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
