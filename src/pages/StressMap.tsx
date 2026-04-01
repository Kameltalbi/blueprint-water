import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { useUserRole, useSites, useWaterConsumption } from "@/hooks/useOrgData";
import { MapPin, Info, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { wsiByCountry } from "@/lib/water-data";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import { HeatmapLayer } from "@/components/map/HeatmapLayer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

/* ── Heatmap data: spread points around each country centre ── */
function buildHeatPoints(): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const offsets = [
    [0, 0], [3, 0], [-3, 0], [0, 4], [0, -4],
    [2, 3], [-2, 3], [2, -3], [-2, -3],
    [5, 2], [-5, 2], [5, -2], [-5, -2],
  ];
  for (const [key, data] of Object.entries(wsiByCountry)) {
    const coords = countryCoords[key];
    if (!coords) continue;
    const intensity = Math.min(data.wsi / 5, 1);
    for (const [dlat, dlng] of offsets) {
      pts.push([coords[0] + dlat, coords[1] + dlng, intensity]);
    }
  }
  return pts;
}

const HEAT_POINTS = buildHeatPoints();

const LAYER_INFO: Record<string, { title: string; body: string }> = {
  wsi: {
    title: "Indice de Stress Hydrique (WSI)",
    body: "L'indice WSI mesure la pression sur les ressources en eau douce dans chaque région. Il combine la demande en eau, la disponibilité saisonnière et la variabilité interannuelle. Source : Aqueduct / WRI.",
  },
  scarcity: {
    title: "Rareté de l'eau bleue",
    body: "La rareté de l'eau bleue représente le ratio entre la demande d'eau annuelle et la disponibilité. Les valeurs élevées indiquent une concurrence intense entre les usages agricoles, industriels et domestiques.",
  },
  aware: {
    title: "Facteur AWARE",
    body: "AWARE (Available WAter REmaining) quantifie la privation potentielle en eau relative entre les bassins versants. Utilisé dans les analyses de cycle de vie (ACV) selon la norme ISO 14046.",
  },
};

export default function StressMap() {
  const { t } = useI18n();
  const { data: userRole } = useUserRole();
  const { data: sites = [] } = useSites(userRole?.organization_id);
  const { data: consumption = [] } = useWaterConsumption(userRole?.organization_id);
  const [selectedLayer, setSelectedLayer] = useState("wsi");
  const [showInfo, setShowInfo] = useState(true);

  /* ── Per-site analysis ── */
  const siteAnalysis = sites.map((site: any) => {
    const siteConsumption = consumption.filter((c: any) => c.site_id === site.id);
    const totalVolume = siteConsumption.reduce((s: number, c: any) => s + Number(c.volume_m3), 0);
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

  const info = LAYER_INFO[selectedLayer];

  return (
    <>
      <PageMeta title="Carte de Stress Hydrique — HydroScan" description="Visualisez le stress hydrique mondial et l'impact de vos sites" />

      {/* Break out of AppLayout p-6 padding to go full height */}
      <div className="-mx-6 -my-6 flex" style={{ height: "calc(100vh - 3.5rem)" }}>

        {/* ── LEFT PANEL ── */}
        <div className="w-72 shrink-0 flex flex-col bg-card border-r border-border overflow-y-auto z-10">

          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <h1 className="font-display text-base font-bold">{t("stressMap.title")}</h1>
            <p className="text-[0.7rem] text-muted-foreground mt-0.5">{t("stressMap.subtitle")}</p>
          </div>

          {/* Layer selector */}
          <div className="px-4 py-3 border-b border-border space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wide">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Quel aspect souhaitez-vous voir ?
            </div>
            <Select value={selectedLayer} onValueChange={setSelectedLayer}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wsi">Stress Hydrique (WSI)</SelectItem>
                <SelectItem value="scarcity">Rareté eau bleue</SelectItem>
                <SelectItem value="aware">Facteur AWARE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* What am I seeing */}
          <div className="px-4 py-3 border-b border-border">
            <button
              className="flex items-center justify-between w-full text-xs font-bold text-primary uppercase tracking-wide"
              onClick={() => setShowInfo(!showInfo)}
            >
              <span className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                Qu'est-ce que je vois ?
              </span>
              {showInfo ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            {showInfo && (
              <div className="mt-2 space-y-1.5">
                <p className="text-xs font-semibold text-foreground">{info.title}</p>
                <p className="text-[0.7rem] text-muted-foreground leading-relaxed">{info.body}</p>
                <a
                  href="https://www.wri.org/aqueduct"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.7rem] text-primary hover:underline"
                >
                  Aqueduct / WRI
                </a>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Légende</p>
            <div
              className="h-3 rounded-sm w-full mb-1"
              style={{ background: "linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, #ef4444, #7f1d1d)" }}
            />
            <div className="flex justify-between text-[0.6rem] text-muted-foreground">
              <span>Risque très faible</span>
              <span>Risque extrême</span>
            </div>
            <div className="mt-2 space-y-1">
              {[
                { color: "#22c55e", label: "< 1.5 — Faible" },
                { color: "#84cc16", label: "1.5–2.5 — Modéré" },
                { color: "#eab308", label: "2.5–3.5 — Moyen" },
                { color: "#f97316", label: "3.5–4.5 — Élevé" },
                { color: "#ef4444", label: "> 4.5 — Extrême" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color, opacity: 0.85 }} />
                  <span className="text-[0.68rem] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-[0.6rem] text-muted-foreground mt-2 opacity-60">Source : Aqueduct / WRI</p>
          </div>

          {/* Site analysis */}
          <div className="px-4 py-3 flex-1">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold">Vos sites</p>
            </div>
            {siteAnalysis.length === 0 ? (
              <p className="text-[0.7rem] text-muted-foreground">
                Ajoutez des sites dans <strong>Sites & Localisation</strong> pour voir l'analyse.
              </p>
            ) : (
              <div className="space-y-3">
                {siteAnalysis.sort((a, b) => b.wsiScore - a.wsiScore).map((item) => {
                  const weightedImpact = Math.round(item.volume * (item.wsiScore / 2));
                  const maxImpact = Math.max(...siteAnalysis.map((s) => Math.round(s.volume * (s.wsiScore / 2))), 1);
                  const barWidth = Math.min((weightedImpact / maxImpact) * 100, 100);
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${wsiTailwind(item.wsiScore)}`} />
                          <span className="text-[0.7rem] font-semibold truncate max-w-[100px]">{item.name}</span>
                        </div>
                        <span className={`text-[0.65rem] font-bold ${wsiTextColor(item.wsiScore)}`}>
                          WSI {item.wsiScore}
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${wsiTailwind(item.wsiScore)}`}
                          style={{ width: `${barWidth}%`, opacity: 0.8 }}
                        />
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[0.6rem] text-muted-foreground">{item.location}</span>
                        <span className="text-[0.6rem] text-muted-foreground">
                          {weightedImpact > 0 ? `${weightedImpact.toLocaleString("fr-FR")} m³eq` : "—"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Your site marker legend */}
          {siteAnalysis.length > 0 && (
            <div className="px-4 py-2 border-t border-border">
              <div className="flex items-center gap-2 text-[0.65rem] text-muted-foreground">
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-primary border-2 border-white shadow" />
                Vos sites de production
              </div>
            </div>
          )}
        </div>

        {/* ── MAP ── */}
        <div className="flex-1 relative">
          <MapContainer
            center={[25, 20]}
            zoom={3}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
            zoomControl
          >
            {/* Dark basemap — best contrast for heatmap */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            />

            {/* Heatmap layer */}
            <HeatmapLayer points={HEAT_POINTS} radius={50} blur={35} maxZoom={5} />

            {/* Labels on top */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
              attribution=""
              opacity={0.8}
            />

            {/* User site markers */}
            {siteAnalysis.filter((s) => s.coords).map((site) => (
              <CircleMarker
                key={site.name}
                center={site.coords!}
                radius={9}
                pathOptions={{
                  color: "#ffffff",
                  fillColor: wsiColor(site.wsiScore),
                  fillOpacity: 1,
                  weight: 2.5,
                }}
              >
                <Tooltip direction="top" offset={[0, -6]}>
                  <span className="text-xs font-bold">{site.name}</span>
                </Tooltip>
                <Popup>
                  <div className="text-sm space-y-1 min-w-[160px]">
                    <p className="font-semibold">{site.name}</p>
                    <p className="text-xs text-gray-500">{site.location}</p>
                    <p>WSI : <strong>{site.wsiScore}/5</strong> — {site.label}</p>
                    {site.volume > 0 && (
                      <p>Conso : <strong>{site.volume.toLocaleString("fr-FR")} m³</strong></p>
                    )}
                    {site.volume > 0 && (
                      <p className="text-xs text-gray-400">Impact pondéré : {Math.round(site.volume * (site.wsiScore / 2)).toLocaleString("fr-FR")} m³eq</p>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  );
}
