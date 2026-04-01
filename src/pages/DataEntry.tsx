import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageMeta } from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Droplets, Package, FlaskConical, Plus, Upload, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole, useSites, useWaterConsumption } from "@/hooks/useOrgData";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/* ── Constants ── */
const sources = ["Réseau municipal", "Puits / Eau souterraine", "Eau de pluie", "Eau recyclée"];
const usages = ["Processus industriel", "Sanitaire", "Irrigation", "Refroidissement", "Nettoyage"];
const periods = ["Mensuel", "Trimestriel", "Annuel"];

const materialFactors: Record<string, number> = {
  "Coton": 10000, "Cuir": 17000, "Blé": 1800, "Sucre": 1500,
  "Olives / Huile d'olive": 14500, "Phosphate": 400, "Acier": 300,
  "Papier": 2000, "Polyester": 500, "Ciment": 200, "Autre": 1000,
};

const pollutantRefs = [
  { name: "DBO5", cMax: 30, cNat: 2, unit: "mg/L" },
  { name: "DCO", cMax: 90, cNat: 5, unit: "mg/L" },
  { name: "MES", cMax: 30, cNat: 5, unit: "mg/L" },
  { name: "Azote total", cMax: 30, cNat: 1, unit: "mg/L" },
  { name: "Phosphore", cMax: 10, cNat: 0.1, unit: "mg/L" },
  { name: "Métaux lourds", cMax: 0.5, cNat: 0.01, unit: "mg/L" },
];

const dischargeTypes = ["Rejet industriel", "Eaux sanitaires", "Eaux de refroidissement", "Eaux de lavage"];

interface SupplyEntry { id: number; material: string; supplier: string; country: string; quantity: number; waterFactor: number; }
interface DischargeEntry { id: number; type: string; pollutant: string; cEff: number; volumeM3: number; cMax: number; cNat: number; unit: string; wfGrey: number; }

export default function DataEntry() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: userRole } = useUserRole();
  const { data: sites = [] } = useSites(userRole?.organization_id);
  const { data: entries = [], isLoading } = useWaterConsumption(userRole?.organization_id);

  /* ── Tab 1: Consommation directe ── */
  const [volume, setVolume] = useState("");
  const [source, setSource] = useState("");
  const [usage, setUsage] = useState("");
  const [period, setPeriod] = useState("");
  const [siteId, setSiteId] = useState("");
  const [recordedDate, setRecordedDate] = useState(new Date().toISOString().slice(0, 10));

  const insertMutation = useMutation({
    mutationFn: async () => {
      if (!userRole?.organization_id) throw new Error("Aucune organisation liée");
      const { error } = await supabase.from("water_consumption").insert({
        organization_id: userRole.organization_id,
        user_id: user!.id,
        volume_m3: parseFloat(volume),
        source, usage, period,
        site_id: siteId || null,
        recorded_date: recordedDate,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Données enregistrées !");
      setVolume(""); setSource(""); setUsage(""); setPeriod(""); setSiteId("");
      queryClient.invalidateQueries({ queryKey: ["waterConsumption"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("water_consumption").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Entrée supprimée");
      queryClient.invalidateQueries({ queryKey: ["waterConsumption"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  /* ── Tab 2: Chaîne logistique ── */
  const [supplyEntries, setSupplyEntries] = useState<SupplyEntry[]>([]);
  const [sMaterial, setSMaterial] = useState("");
  const [sSupplier, setSSupplier] = useState("");
  const [sCountry, setSCountry] = useState("");
  const [sQuantity, setSQuantity] = useState("");

  const addSupply = () => {
    if (!sMaterial || !sQuantity) { toast.error("Remplissez le matériau et la quantité"); return; }
    const factor = materialFactors[sMaterial] || 1000;
    setSupplyEntries([...supplyEntries, { id: Date.now(), material: sMaterial, supplier: sSupplier || "—", country: sCountry || "—", quantity: parseFloat(sQuantity), waterFactor: factor }]);
    setSMaterial(""); setSSupplier(""); setSCountry(""); setSQuantity("");
    toast.success("Approvisionnement ajouté");
  };

  /* ── Tab 3: Rejets & Qualité ── */
  const [dischargeEntries, setDischargeEntries] = useState<DischargeEntry[]>([]);
  const [dType, setDType] = useState("");
  const [dPollutant, setDPollutant] = useState("");
  const [dConcentration, setDConcentration] = useState("");
  const [dVolume, setDVolume] = useState("");

  const addDischarge = () => {
    if (!dType || !dPollutant || !dConcentration || !dVolume) { toast.error("Veuillez remplir tous les champs"); return; }
    const pol = pollutantRefs.find((p) => p.name === dPollutant);
    const cEff = parseFloat(dConcentration), vol = parseFloat(dVolume);
    const cMax = pol?.cMax || 30, cNat = pol?.cNat || 0;
    const wfGrey = (cMax - cNat) > 0 ? Math.round((cEff * vol) / (cMax - cNat) * 100) / 100 : 0;
    setDischargeEntries([...dischargeEntries, { id: Date.now(), type: dType, pollutant: dPollutant, cEff, volumeM3: vol, cMax, cNat, unit: pol?.unit || "mg/L", wfGrey }]);
    setDType(""); setDPollutant(""); setDConcentration(""); setDVolume("");
    toast.success("Rejet enregistré");
  };

  const noOrg = !userRole?.organization_id && !isLoading;
  const siteName = (id: string | null) => sites.find((s: any) => s.id === id)?.name || "—";
  const totalVirtualWater = supplyEntries.reduce((s, e) => s + e.quantity * e.waterFactor, 0);
  const totalGreyWater = dischargeEntries.reduce((s, e) => s + e.wfGrey, 0);
  const nonCompliant = dischargeEntries.filter((e) => e.cEff > e.cMax).length;

  return (
    <div className="space-y-6">
      <PageMeta title="Saisie des données — HydroScan" description="Saisissez toutes vos données eau en un seul endroit." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Saisie des données</h1>
          <p className="text-muted-foreground text-sm">Consommation, approvisionnements et rejets — tout en un seul endroit</p>
        </div>
        <Button variant="outline" className="gap-2 self-start sm:self-auto">
          <Upload className="h-4 w-4" /> Importer CSV
        </Button>
      </div>

      {noOrg && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4 text-sm text-destructive">
            Vous n'êtes lié à aucune organisation. Contactez un administrateur.
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="consumption" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consumption" className="gap-1.5 text-xs sm:text-sm">
            <Droplets className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Consommation</span>
          </TabsTrigger>
          <TabsTrigger value="supply" className="gap-1.5 text-xs sm:text-sm">
            <Package className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Chaîne logistique</span>
          </TabsTrigger>
          <TabsTrigger value="pollution" className="gap-1.5 text-xs sm:text-sm">
            <FlaskConical className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Rejets & Qualité</span>
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Consommation directe ── */}
        <TabsContent value="consumption" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Nouvelle saisie</CardTitle>
              <CardDescription>Eau achetée, pompée ou captée sur votre site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Volume (m³) *</Label>
                  <Input type="number" placeholder="ex: 1500" value={volume} onChange={(e) => setVolume(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Source *</Label>
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Usage *</Label>
                  <Select value={usage} onValueChange={setUsage}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{usages.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Période *</Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{periods.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Site</Label>
                  <Select value={siteId} onValueChange={setSiteId}>
                    <SelectTrigger><SelectValue placeholder="Tous les sites" /></SelectTrigger>
                    <SelectContent>{sites.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={recordedDate} onChange={(e) => setRecordedDate(e.target.value)} />
                </div>
              </div>
              <Button onClick={() => { if (!volume || !source || !usage || !period) { toast.error("Remplissez les champs obligatoires"); return; } insertMutation.mutate(); }} className="gap-2" disabled={insertMutation.isPending || noOrg}>
                {insertMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Enregistrer
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-base">Saisies récentes ({entries.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {["Date", "Volume", "Source", "Usage", "Site", "Période", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">{isLoading ? "Chargement…" : "Aucune saisie"}</td></tr>}
                    {entries.map((row) => (
                      <tr key={row.id} className="border-b last:border-0">
                        <td className="px-4 py-3">{row.recorded_date}</td>
                        <td className="px-4 py-3 font-medium">{row.volume_m3} m³</td>
                        <td className="px-4 py-3">{row.source}</td>
                        <td className="px-4 py-3">{row.usage}</td>
                        <td className="px-4 py-3 text-muted-foreground">{siteName(row.site_id)}</td>
                        <td className="px-4 py-3">{row.period}</td>
                        <td className="px-4 py-3 text-right">
                          {row.user_id === user?.id && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm("Supprimer ?")) deleteMutation.mutate(row.id); }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: Chaîne logistique ── */}
        <TabsContent value="supply" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Eau virtuelle totale</CardDescription>
                <CardTitle className="text-2xl">{totalVirtualWater > 0 ? `${(totalVirtualWater / 1000).toFixed(1)}k m³` : "—"}</CardTitle>
              </CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">{supplyEntries.length} approvisionnement(s)</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Matériaux distincts</CardDescription>
                <CardTitle className="text-2xl">{new Set(supplyEntries.map((e) => e.material)).size}</CardTitle>
              </CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">types de matières</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Fournisseurs uniques</CardDescription>
                <CardTitle className="text-2xl">{new Set(supplyEntries.filter((e) => e.supplier !== "—").map((e) => e.supplier)).size}</CardTitle>
              </CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">fournisseurs référencés</p></CardContent>
            </Card>
          </div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Ajouter un approvisionnement</CardTitle>
              <CardDescription>Eau cachée dans vos matières premières achetées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Matériau *</Label>
                  <Select value={sMaterial} onValueChange={setSMaterial}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{Object.keys(materialFactors).map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantité (tonnes) *</Label>
                  <Input type="number" placeholder="ex: 50" value={sQuantity} onChange={(e) => setSQuantity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Fournisseur</Label>
                  <Input placeholder="ex: SARL XYZ" value={sSupplier} onChange={(e) => setSSupplier(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Pays d'origine</Label>
                  <Input placeholder="ex: Tunisie" value={sCountry} onChange={(e) => setSCountry(e.target.value)} />
                </div>
              </div>
              {sMaterial && <p className="text-xs text-muted-foreground">Facteur eau virtuelle : {(materialFactors[sMaterial] || 1000).toLocaleString("fr-FR")} m³/tonne (WFN)</p>}
              <Button onClick={addSupply} className="gap-2"><Plus className="h-4 w-4" />Ajouter</Button>
            </CardContent>
          </Card>
          {supplyEntries.length > 0 && (
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-base">Approvisionnements ({supplyEntries.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        {["Matériau", "Quantité", "Fournisseur", "Pays", "Eau virtuelle", ""].map((h) => <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {supplyEntries.map((e) => (
                        <tr key={e.id} className="border-b last:border-0">
                          <td className="px-4 py-3 font-medium">{e.material}</td>
                          <td className="px-4 py-3">{e.quantity} t</td>
                          <td className="px-4 py-3 text-muted-foreground">{e.supplier}</td>
                          <td className="px-4 py-3 text-muted-foreground">{e.country}</td>
                          <td className="px-4 py-3 font-medium text-primary">{(e.quantity * e.waterFactor).toLocaleString("fr-FR")} m³</td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setSupplyEntries(supplyEntries.filter((x) => x.id !== e.id))}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Tab 3: Rejets & Qualité ── */}
        <TabsContent value="pollution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Eau grise calculée</CardDescription>
                <CardTitle className="text-2xl">{totalGreyWater > 0 ? `${Math.round(totalGreyWater).toLocaleString("fr-FR")} m³` : "—"}</CardTitle>
              </CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">WF_gris = Ceff × V / (Cmax − Cnat)</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Rejets enregistrés</CardDescription>
                <CardTitle className="text-2xl">{dischargeEntries.length}</CardTitle>
              </CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">mesures de polluants</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Conformité</CardDescription>
                <CardTitle className="text-2xl">{dischargeEntries.length > 0 ? `${Math.round(((dischargeEntries.length - nonCompliant) / dischargeEntries.length) * 100)}%` : "—"}</CardTitle>
              </CardHeader>
              <CardContent>{nonCompliant > 0 ? <Badge variant="destructive" className="text-xs">{nonCompliant} dépassement(s)</Badge> : dischargeEntries.length > 0 ? <Badge variant="secondary" className="text-xs">Conforme</Badge> : null}</CardContent>
            </Card>
          </div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Nouveau rejet</CardTitle>
              <CardDescription>Concentration de polluants dans vos effluents (analyses labo)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Type de rejet *</Label>
                  <Select value={dType} onValueChange={setDType}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{dischargeTypes.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Polluant *</Label>
                  <Select value={dPollutant} onValueChange={setDPollutant}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{pollutantRefs.map((p) => <SelectItem key={p.name} value={p.name}>{p.name} (Cmax: {p.cMax} {p.unit})</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Concentration mesurée (mg/L) *</Label>
                  <Input type="number" placeholder="ex: 45" value={dConcentration} onChange={(e) => setDConcentration(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Volume rejeté (m³) *</Label>
                  <Input type="number" placeholder="ex: 500" value={dVolume} onChange={(e) => setDVolume(e.target.value)} />
                </div>
              </div>
              <Button onClick={addDischarge} className="gap-2"><Plus className="h-4 w-4" />Enregistrer</Button>
            </CardContent>
          </Card>
          {dischargeEntries.length > 0 && (
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-base">Rejets ({dischargeEntries.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        {["Type", "Polluant", "Ceff", "Cmax / Cnat", "Volume", "WF gris", "Statut", ""].map((h) => <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {dischargeEntries.map((e) => (
                        <tr key={e.id} className="border-b last:border-0">
                          <td className="px-4 py-3">{e.type}</td>
                          <td className="px-4 py-3 font-medium">{e.pollutant}</td>
                          <td className="px-4 py-3">{e.cEff} {e.unit}</td>
                          <td className="px-4 py-3 text-muted-foreground">{e.cMax} / {e.cNat}</td>
                          <td className="px-4 py-3">{e.volumeM3} m³</td>
                          <td className="px-4 py-3 font-medium">{e.wfGrey.toLocaleString("fr-FR")} m³</td>
                          <td className="px-4 py-3">{e.cEff > e.cMax ? <Badge variant="destructive" className="text-xs">Dépassement</Badge> : <Badge variant="secondary" className="text-xs">Conforme</Badge>}</td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDischargeEntries(dischargeEntries.filter((x) => x.id !== e.id))}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
