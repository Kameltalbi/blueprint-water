import "leaflet/dist/leaflet.css";
import { useState, useMemo } from "react";
import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { useUserRole, useSites, useWaterConsumption } from "@/hooks/useOrgData";
import { MapPin, Info, ChevronDown, ChevronUp, Layers, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { wsiByCountry } from "@/lib/water-data";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import { HeatmapLayer } from "@/components/map/HeatmapLayer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ── Tunisian watersheds with AWARE factors ── */
const tunisianBasins = [
  { id: "medjerda",   name: "Médjerda",          coords: [36.5, 9.2]  as [number,number], wsi: 4.8, aware: 4200, label: "Critique",  crda: "Béja / Jendouba" },
  { id: "ichkeul",   name: "Ichkeul",            coords: [37.1, 9.7]  as [number,number], wsi: 4.5, aware: 3800, label: "Critique",  crda: "Bizerte" },
  { id: "capbon",    name: "Cap Bon",            coords: [36.7, 10.9] as [number,number], wsi: 4.2, aware: 2900, label: "Élevé",    crda: "Nabeul" },
  { id: "bizerte",   name: "Bizerte",           coords: [37.3, 9.9]  as [number,number], wsi: 3.2, aware: 1200, label: "Moyen",    crda: "Bizerte" },
  { id: "tunis",     name: "Grand Tunis",       coords: [36.8, 10.2] as [number,number], wsi: 4.0, aware: 2600, label: "Élevé",    crda: "Ariana / Ben Arous" },
  { id: "sahel",     name: "Sahel / Enfidha",   coords: [36.1, 10.5] as [number,number], wsi: 4.3, aware: 3200, label: "Élevé",    crda: "Sousse" },
  { id: "kairouan",  name: "Kairouan",          coords: [35.7, 10.1] as [number,number], wsi: 4.3, aware: 3500, label: "Élevé",    crda: "Kairouan" },
  { id: "sfax",      name: "Sfax",              coords: [34.7, 10.7] as [number,number], wsi: 5.0, aware: 8500, label: "Extrême", crda: "Sfax" },
  { id: "gabes",     name: "Gabès",             coords: [33.9, 9.8]  as [number,number], wsi: 4.7, aware: 5200, label: "Critique", crda: "Gabès" },
  { id: "sidi_bouzid",name: "Sidi Bouzid",     coords: [35.0, 9.5]  as [number,number], wsi: 4.9, aware: 6800, label: "Critique", crda: "Sidi Bouzid" },
  { id: "gafsa",     name: "Gafsa",             coords: [34.4, 8.8]  as [number,number], wsi: 5.0, aware: 9200, label: "Extrême", crda: "Gafsa" },
  { id: "tataouine", name: "Tataouine / Médenine",coords: [33.0, 10.4] as [number,number], wsi: 5.0, aware: 12000, label: "Extrême", crda: "Médenine / Tataouine" },
];

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

/* ── Per-layer intensity multipliers (relative to WSI baseline) ── */
// Scarcity: arid/MENA regions amplified, temperate reduced
const SCARCITY_MULT: Record<string, number> = {
  tunisie: 1.2, maroc: 1.1, algerie: 1.0, egypte: 1.4, libye: 1.3,
  jordanie: 1.5, arabie_saoudite: 1.6, inde: 1.1, chine: 0.9,
  turquie: 0.9, france: 0.5, espagne: 1.0, italie: 0.8,
  allemagne: 0.4, bresil: 0.3, usa: 0.7,
};
// AWARE: logarithmic amplification for already-stressed basins
const AWARE_MULT: Record<string, number> = {
  tunisie: 1.3, maroc: 1.2, algerie: 1.1, egypte: 1.6, libye: 1.4,
  jordanie: 1.7, arabie_saoudite: 1.8, inde: 1.3, chine: 1.0,
  turquie: 1.0, france: 0.4, espagne: 1.1, italie: 0.7,
  allemagne: 0.3, bresil: 0.25, usa: 0.65,
};

function buildHeatPoints(layer: string): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const offsets = [
    [0, 0], [3, 0], [-3, 0], [0, 4], [0, -4],
    [2, 3], [-2, 3], [2, -3], [-2, -3],
    [5, 2], [-5, 2], [5, -2], [-5, -2],
  ];
  for (const [key, data] of Object.entries(wsiByCountry)) {
    const coords = countryCoords[key];
    if (!coords) continue;
    let mult = 1;
    if (layer === "scarcity") mult = SCARCITY_MULT[key] ?? 1;
    if (layer === "aware")    mult = AWARE_MULT[key] ?? 1;
    const intensity = Math.min((data.wsi / 5) * mult, 1);
    for (const [dlat, dlng] of offsets) {
      pts.push([coords[0] + dlat, coords[1] + dlng, intensity]);
    }
  }
  return pts;
}

/* ── Per-layer gradient config ── */
const LAYER_GRADIENT: Record<string, Record<string, string>> = {
  wsi: {
    0.0: "#22c55e", 0.3: "#84cc16", 0.5: "#eab308",
    0.65: "#f97316", 0.8: "#ef4444", 1.0: "#7f1d1d",
  },
  scarcity: {
    0.0: "#bfdbfe", 0.3: "#60a5fa", 0.5: "#eab308",
    0.65: "#f97316", 0.8: "#ef4444", 1.0: "#7f1d1d",
  },
  aware: {
    0.0: "#e9d5ff", 0.3: "#a855f7", 0.5: "#eab308",
    0.65: "#f97316", 0.8: "#ef4444", 1.0: "#7f1d1d",
  },
};

const LAYER_LEGEND: Record<string, { color: string; label: string }[]> = {
  wsi: [
    { color: "#22c55e", label: "< 1.5 — Faible" },
    { color: "#84cc16", label: "1.5–2.5 — Modéré" },
    { color: "#eab308", label: "2.5–3.5 — Moyen" },
    { color: "#f97316", label: "3.5–4.5 — Élevé" },
    { color: "#ef4444", label: "> 4.5 — Extrême" },
  ],
  scarcity: [
    { color: "#bfdbfe", label: "< 0.1 — Négligeable" },
    { color: "#60a5fa", label: "0.1–0.4 — Faible" },
    { color: "#eab308", label: "0.4–1.0 — Modéré" },
    { color: "#f97316", label: "1.0–2.0 — Élevé" },
    { color: "#ef4444", label: "> 2.0 — Extrême" },
  ],
  aware: [
    { color: "#e9d5ff", label: "< 1 — Référence" },
    { color: "#a855f7", label: "1–10 — Faible" },
    { color: "#eab308", label: "10–100 — Moyen" },
    { color: "#f97316", label: "100–1000 — Élevé" },
    { color: "#ef4444", label: "> 1000 — Extrême" },
  ],
};

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
  const navigate = useNavigate();
  const { data: userRole } = useUserRole();
  const { data: sites = [] } = useSites(userRole?.organization_id);
  const { data: consumption = [] } = useWaterConsumption(userRole?.organization_id);
  const [selectedLayer, setSelectedLayer] = useState("wsi");
  const [showInfo, setShowInfo] = useState(true);
  const [showTunisiaBasins, setShowTunisiaBasins] = useState(false);

  const heatPoints = useMemo(() => buildHeatPoints(selectedLayer), [selectedLayer]);
  const heatGradient = LAYER_GRADIENT[selectedLayer];
  const legendItems = LAYER_LEGEND[selectedLayer];

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
                <SelectItem value="tunisia-aware">Bassins versants tunisiens (AWARE)</SelectItem>
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
              {legendItems.map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color, opacity: 0.85 }} />
                  <span className="text-[0.68rem] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            <p className="text-[0.6rem] text-muted-foreground mt-2 opacity-60">Source : Aqueduct / WRI</p>
          </div>

          {/* ── Tunisia basins panel ── */}
          <div className="px-4 py-3 border-b border-border">
            <button
              className="flex items-center justify-between w-full text-xs font-bold text-orange-500 uppercase tracking-wide"
              onClick={() => setShowTunisiaBasins(!showTunisiaBasins)}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Bassins versants tunisiens
              </span>
              {showTunisiaBasins ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            {showTunisiaBasins && (
              <div className="mt-2 space-y-1.5">
                {tunisianBasins.sort((a,b) => b.wsi - a.wsi).map((b) => (
                  <div key={b.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${wsiTailwind(b.wsi)}`} />
                      <span className="text-[0.68rem] font-medium truncate max-w-[100px]">{b.name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[0.65rem] font-bold ${wsiTextColor(b.wsi)}`}>WSI {b.wsi}</span>
                      <p className="text-[0.58rem] text-muted-foreground">AWARE ×{b.aware.toLocaleString("fr-FR")}</p>
                    </div>
                  </div>
                ))}
                <p className="text-[0.6rem] text-muted-foreground mt-1 opacity-70">Sources : CRDA / Ministère Agriculture Tunisie · AWARE WFN</p>
              </div>
            )}
          </div>

          {/* Site analysis */}
          <div className="px-4 py-3 flex-1">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold">Vos sites</p>
            </div>
            {siteAnalysis.length === 0 ? (
              <div className="space-y-2">
                <p className="text-[0.7rem] text-muted-foreground">
                  Aucun site enregistré. Ajoutez vos sites de production pour voir l'analyse WSI.
                </p>
                <button
                  onClick={() => navigate("/organization")}
                  className="flex items-center gap-1.5 text-[0.7rem] text-primary hover:underline font-medium"
                >
                  <ExternalLink className="h-3 w-3" />
                  Sites & Localisation
                </button>
                <p className="text-[0.6rem] text-muted-foreground opacity-70">
                  💡 Dans le champ localisation, indiquez le pays (ex: <em>Sfax, Tunisie</em>)
                </p>
              </div>
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
            <HeatmapLayer points={heatPoints} radius={50} blur={35} maxZoom={5} gradient={heatGradient} />

            {/* Labels on top */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
              attribution=""
              opacity={0.8}
            />

            {/* Tunisian basin markers — always visible when showTunisiaBasins */}
            {showTunisiaBasins && tunisianBasins.map((basin) => (
              <CircleMarker
                key={basin.id}
                center={basin.coords}
                radius={7}
                pathOptions={{
                  color: "#f97316",
                  fillColor: wsiColor(basin.wsi),
                  fillOpacity: 0.85,
                  weight: 2,
                }}
              >
                <Tooltip direction="top" offset={[0, -6]}>
                  <span className="text-xs font-bold">{basin.name}</span>
                </Tooltip>
                <Popup>
                  <div className="text-sm space-y-1 min-w-[180px]">
                    <p className="font-bold">{basin.name}</p>
                    <p className="text-xs text-gray-500">CRDA : {basin.crda}</p>
                    <p>WSI : <strong style={{color: wsiColor(basin.wsi)}}>{basin.wsi}/5</strong> — {basin.label}</p>
                    <p>Facteur AWARE : <strong>×{basin.aware.toLocaleString("fr-FR")}</strong></p>
                    <p className="text-xs text-gray-400">1 m³ consommé ici = {basin.aware.toLocaleString("fr-FR")} m³eq d'impact relatif</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

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
