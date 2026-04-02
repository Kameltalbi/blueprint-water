import { useState, useMemo } from "react";
import { PageMeta } from "@/components/PageMeta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplets, Leaf, FlaskConical, Search, Info } from "lucide-react";

/* ── Water footprint reference database ── */
/* Sources: Water Footprint Network (WFN) global averages + Tunisia-specific adjustments
   Values in m³ / tonne unless unit noted */
interface ProductWF {
  id: string;
  name: string;
  category: string;
  unit: string;       // tonne, kg, pièce, litre
  green: number;      // m³ / unit
  blue: number;       // m³ / unit
  grey: number;       // m³ / unit
  tuniNote?: string;  // Tunisia-specific context
  source: string;
}

const PRODUCTS: ProductWF[] = [
  /* ── Agriculture Tunisienne ── */
  { id: "olive_oil",    name: "Huile d'olive",      category: "Agri-alimentaire", unit: "tonne", green: 3015, blue: 1419, grey: 214,  tuniNote: "Tunisie : 90% Blue Water (irrigation intensive en été)", source: "WFN 2011 — Tunisie 4e prod. mondial" },
  { id: "olives",       name: "Olives (fruit)",     category: "Agri-alimentaire", unit: "tonne", green: 1770, blue: 830,  grey: 125,  tuniNote: "Majorité green water en zones pluviales (Sfax sans irrigation)", source: "WFN 2011" },
  { id: "dates",        name: "Dattes",             category: "Agri-alimentaire", unit: "tonne", green: 720,  blue: 2195, grey: 87,   tuniNote: "Très forte Blue Water — irrigation en zones arides (Tozeur, Kébili)", source: "WFN 2011 + CRDA Kébili" },
  { id: "tomatoes",     name: "Tomates",            category: "Agri-alimentaire", unit: "tonne", green: 63,   blue: 121,  grey: 16,   tuniNote: "Système irrigué serres plastiques — Blue Water dominante", source: "WFN 2011" },
  { id: "wheat",        name: "Blé dur",            category: "Agri-alimentaire", unit: "tonne", green: 1334, blue: 342,  grey: 102,  tuniNote: "Nord Tunisie : green water (pluie) plus élevée", source: "WFN 2011" },
  { id: "barley",       name: "Orge",               category: "Agri-alimentaire", unit: "tonne", green: 1073, blue: 145,  grey: 79,   source: "WFN 2011" },
  { id: "potatoes",     name: "Pommes de terre",    category: "Agri-alimentaire", unit: "tonne", green: 105,  blue: 133,  grey: 45,   source: "WFN 2011" },
  { id: "citrus",       name: "Agrumes (Cap Bon)",  category: "Agri-alimentaire", unit: "tonne", green: 220,  blue: 460,  grey: 55,   tuniNote: "Cap Bon : irrigation intensive printemps-été", source: "WFN 2011 + CRDA Nabeul" },
  { id: "peppers",      name: "Poivrons/Piments",   category: "Agri-alimentaire", unit: "tonne", green: 145,  blue: 295,  grey: 36,   source: "WFN 2011" },
  { id: "watermelon",   name: "Pastèque",           category: "Agri-alimentaire", unit: "tonne", green: 100,  blue: 145,  grey: 28,   source: "WFN 2011" },
  /* ── Industrie agroalimentaire ── */
  { id: "pasta",        name: "Pâtes alimentaires", category: "Industrie", unit: "tonne", green: 1450, blue: 385,  grey: 110,  source: "WFN 2011" },
  { id: "canned_tuna",  name: "Thon en conserve",  category: "Industrie", unit: "tonne", green: 0,    blue: 520,  grey: 130,  tuniNote: "Tunisie : 1er exportateur mondial thon en boîte (Sfax)", source: "WFN 2011 — Sfax" },
  { id: "olive_oil_can",name: "Huile d'olive en bouteille",category: "Industrie", unit: "litre", green: 3.0, blue: 1.4, grey: 0.21, tuniNote: "Inclut l'eau de nettoyage des lignes d'embouteillage", source: "WFN 2011 adapté" },
  { id: "harissa",      name: "Harissa (pot 135g)", category: "Industrie", unit: "pièce", green: 0.045, blue: 0.089, grey: 0.011, tuniNote: "Principalement Blue Water irrigation piments", source: "Estimation WFN" },
  { id: "couscous",     name: "Couscous",           category: "Industrie", unit: "tonne", green: 1450, blue: 390,  grey: 112,  source: "WFN 2011" },
  /* ── Textile ── */
  { id: "cotton_shirt", name: "T-shirt coton",      category: "Textile",   unit: "pièce", green: 1.5, blue: 5.5, grey: 2.0, tuniNote: "Industrie textile tunisienne : ~200 000 travailleurs", source: "WFN 2011 — Monastir/Sahel" },
  { id: "jeans",        name: "Jean (500g coton)",  category: "Textile",   unit: "pièce", green: 3.5, blue: 6.5, grey: 1.5, source: "WFN 2011" },
  { id: "cotton_raw",   name: "Coton (fibre brute)","category": "Textile", unit: "tonne", green: 6003, blue: 2535, grey: 979,  source: "WFN 2011" },
  /* ── Ciment / Construction ── */
  { id: "cement",       name: "Ciment",             category: "Industrie", unit: "tonne", green: 0,    blue: 2.6,  grey: 0.4,  tuniNote: "Tunisie : 10 cimenteries, ~12M t/an", source: "WFN adapt. ECOINVENT" },
  { id: "bricks",       name: "Briques (1000 pcs)", category: "Industrie", unit: "pièce", green: 0, blue: 2.1, grey: 0.3,  source: "Estimation" },
  /* ── Énergie ── */
  { id: "electricity",  name: "Électricité (STEG)", category: "Énergie",   unit: "MWh",   green: 0,    blue: 1.6,  grey: 0.8,  tuniNote: "Mix thermique tunisien + refroidissement turbines", source: "WFN 2011 — STEG" },
  /* ── Cuir / Chaussures ── */
  { id: "leather_shoe", name: "Chaussure cuir",     category: "Textile",   unit: "pièce", green: 4.8, blue: 3.6, grey: 1.2,  tuniNote: "Tanneries Megrine/Ariana : forte consommation eau grise", source: "WFN 2011" },
];

const CATEGORIES = ["Tous", "Agri-alimentaire", "Industrie", "Textile", "Énergie"];

function WaterBar({ green, blue, grey, total }: { green: number; blue: number; grey: number; total: number }) {
  const gPct = total > 0 ? (green / total) * 100 : 0;
  const bPct = total > 0 ? (blue / total) * 100 : 0;
  const grPct = total > 0 ? (grey / total) * 100 : 0;
  return (
    <div className="flex h-3 w-full rounded-full overflow-hidden">
      <div className="bg-green-500 transition-all" style={{ width: `${gPct}%` }} title={`Green: ${gPct.toFixed(0)}%`} />
      <div className="bg-blue-500 transition-all" style={{ width: `${bPct}%` }} title={`Blue: ${bPct.toFixed(0)}%`} />
      <div className="bg-slate-400 transition-all" style={{ width: `${grPct}%` }} title={`Grey: ${grPct.toFixed(0)}%`} />
    </div>
  );
}

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  if (n >= 1) return n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  return n.toLocaleString("fr-FR", { maximumFractionDigits: 3 });
}

export default function ProductFootprint() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [selected, setSelected] = useState<ProductWF | null>(null);
  const [quantity, setQuantity] = useState("1");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = category === "Tous" || p.category === category;
      const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const calc = useMemo(() => {
    if (!selected) return null;
    const qty = parseFloat(quantity) || 1;
    return {
      green: selected.green * qty,
      blue: selected.blue * qty,
      grey: selected.grey * qty,
      total: (selected.green + selected.blue + selected.grey) * qty,
    };
  }, [selected, quantity]);

  return (
    <>
      <PageMeta
        title="Empreinte eau produit — HydroScan"
        description="Consultez les empreintes eau de référence par produit (LCA ISO 14046) pour les filières tunisiennes."
      />
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Empreinte eau produit</h1>
          <p className="text-muted-foreground text-sm">
            Référentiels LCA Water Footprint (ISO 14046) par produit — avec contexte tunisien
          </p>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Données issues du <strong>Water Footprint Network</strong> (Hoekstra et al., 2011) et adaptées au contexte tunisien.
            Les valeurs sont indicatives — calculez votre empreinte réelle via la page <strong>Saisie des données</strong>.
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: search + table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Rechercher un produit…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produit</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Répartition</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Unité</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Aucun résultat</td></tr>
                  ) : filtered.map((p) => {
                    const total = p.green + p.blue + p.grey;
                    return (
                      <tr
                        key={p.id}
                        className={`border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/40 ${selected?.id === p.id ? "bg-primary/5 hover:bg-primary/5" : ""}`}
                        onClick={() => { setSelected(p); setQuantity("1"); }}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.category}</div>
                        </td>
                        <td className="px-4 py-3 font-bold">{fmt(total)} m³</td>
                        <td className="px-4 py-3 hidden sm:table-cell w-32">
                          <WaterBar green={p.green} blue={p.blue} grey={p.grey} total={total} />
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">/{p.unit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Eau verte (pluie)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Eau bleue (irrigation)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-400 inline-block" /> Eau grise (pollution)</span>
            </div>
          </div>

          {/* Right: detail panel */}
          <div className="space-y-4">
            {selected ? (
              <>
                <Card className="border-primary/20">
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="self-start text-xs mb-1">{selected.category}</Badge>
                    <CardTitle className="text-lg">{selected.name}</CardTitle>
                    <CardDescription>Empreinte eau par {selected.unit}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {[
                        { label: "Eau verte", val: selected.green, color: "text-green-600", Icon: Leaf },
                        { label: "Eau bleue", val: selected.blue, color: "text-blue-600", Icon: Droplets },
                        { label: "Eau grise", val: selected.grey, color: "text-slate-500", Icon: FlaskConical },
                      ].map(({ label, val, color, Icon }) => (
                        <div key={label} className="flex items-center justify-between">
                          <div className={`flex items-center gap-1.5 text-sm ${color}`}>
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                          </div>
                          <span className={`font-bold text-sm ${color}`}>{fmt(val)} m³</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span>{fmt(selected.green + selected.blue + selected.grey)} m³/{selected.unit}</span>
                      </div>
                    </div>
                    <WaterBar green={selected.green} blue={selected.blue} grey={selected.grey} total={selected.green + selected.blue + selected.grey} />

                    {selected.tuniNote && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
                        🇹🇳 {selected.tuniNote}
                      </div>
                    )}
                    <p className="text-[0.65rem] text-muted-foreground">Source : {selected.source}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Calculer pour ma production</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Quantité ({selected.unit}s / an)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="1"
                      />
                    </div>
                    {calc && (
                      <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-green-600">Eau verte</span><span className="font-bold text-green-600">{fmt(calc.green)} m³/an</span></div>
                        <div className="flex justify-between"><span className="text-blue-600">Eau bleue</span><span className="font-bold text-blue-600">{fmt(calc.blue)} m³/an</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Eau grise</span><span className="font-bold text-slate-500">{fmt(calc.grey)} m³/an</span></div>
                        <div className="flex justify-between border-t pt-1 font-bold"><span>Empreinte totale</span><span>{fmt(calc.total)} m³/an</span></div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">Ces valeurs sont des références indicatives. Votre empreinte réelle peut varier selon vos pratiques, région, et équipements.</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
                <Droplets className="h-8 w-8 mx-auto mb-3 opacity-30" />
                Sélectionnez un produit pour voir son empreinte eau détaillée
              </div>
            )}

            <Card className="border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Top filières tunisiennes</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="blue">
                  <TabsList className="grid w-full grid-cols-2 h-7 text-xs">
                    <TabsTrigger value="blue" className="text-xs">Blue Water</TabsTrigger>
                    <TabsTrigger value="total" className="text-xs">Total</TabsTrigger>
                  </TabsList>
                  <TabsContent value="blue" className="mt-3 space-y-1.5">
                    {[...PRODUCTS].sort((a, b) => b.blue - a.blue).slice(0, 5).map((p) => (
                      <div key={p.id} className="flex justify-between text-xs cursor-pointer hover:text-primary" onClick={() => { setSelected(p); setQuantity("1"); }}>
                        <span className="truncate max-w-[130px]">{p.name}</span>
                        <span className="text-blue-600 font-bold shrink-0">{fmt(p.blue)} m³/{p.unit}</span>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="total" className="mt-3 space-y-1.5">
                    {[...PRODUCTS].sort((a, b) => (b.green + b.blue + b.grey) - (a.green + a.blue + a.grey)).slice(0, 5).map((p) => (
                      <div key={p.id} className="flex justify-between text-xs cursor-pointer hover:text-primary" onClick={() => { setSelected(p); setQuantity("1"); }}>
                        <span className="truncate max-w-[130px]">{p.name}</span>
                        <span className="font-bold shrink-0">{fmt(p.green + p.blue + p.grey)} m³/{p.unit}</span>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
