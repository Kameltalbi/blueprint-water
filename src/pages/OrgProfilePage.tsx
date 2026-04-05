import { useState } from "react";
import { PageMeta } from "@/components/PageMeta";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Target, Thermometer, Save, CheckCircle2 } from "lucide-react";
import { loadOrgProfile, saveOrgProfile, SECTORS, GOVERNORATES_TN, wsiByGovernorate } from "@/lib/org-profile";
import { countryOptions, wsiByCountry } from "@/lib/water-data";
import { useCountryMode } from "@/contexts/CountryMode";
import { useOrganization, useUserRole } from "@/hooks/useOrgData";
import { toast } from "sonner";

const FUNCTIONAL_UNIT_EXAMPLES = [
  "1 tonne de produit fini",
  "1 000 litres d'huile d'olive",
  "1 000 pièces textiles",
  "1 tonne de briques / ciment",
  "1 tonne de phosphate",
  "1 000 conserves / boîtes",
  "1 000 m² de surface nettoyée",
  "1 chambre-nuit (hôtel)",
  "Autre unité",
];

function WsiChip({ wsi }: { wsi: number }) {
  const color =
    wsi >= 4.5 ? "bg-red-100 text-red-700 border-red-200" :
    wsi >= 3.5 ? "bg-orange-100 text-orange-700 border-orange-200" :
    wsi >= 2.5 ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
    "bg-green-100 text-green-700 border-green-200";
  const label =
    wsi >= 4.5 ? "Stress extrême" :
    wsi >= 3.5 ? "Stress élevé" :
    wsi >= 2.5 ? "Stress moyen-élevé" : "Stress modéré";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      <Thermometer className="h-3 w-3" /> WSI {wsi.toFixed(1)} — {label}
    </span>
  );
}

export default function OrgProfilePage() {
  const { isTunisia } = useCountryMode();
  const { data: role } = useUserRole();
  const { data: org } = useOrganization(role?.organization_id);

  const initial = loadOrgProfile();
  const [sector, setSector] = useState(initial.sector || "");
  const [governorate, setGovernorate] = useState(initial.governorate || "");
  const [country, setCountry] = useState(initial.country || "Tunisie");
  const [functionalUnit, setFunctionalUnit] = useState(initial.functionalUnit || "");
  const [functionalUnitQty, setFunctionalUnitQty] = useState(initial.functionalUnitQty || "");
  const [saved, setSaved] = useState(false);

  const wsi = isTunisia && governorate
    ? wsiByGovernorate[governorate] ?? 4.2
    : (() => {
        const key = country.toLowerCase().replace(/[éèê]/g, "e").replace(/\s/g, "_");
        return wsiByCountry[key]?.wsi ?? 2.0;
      })();

  function handleSave() {
    saveOrgProfile({ sector, governorate: isTunisia ? governorate : "", country, functionalUnit, functionalUnitQty });
    setSaved(true);
    toast.success("Profil enregistré");
    setTimeout(() => setSaved(false), 3000);
  }

  const locationLabel = isTunisia ? (governorate || "—") : (country || "—");

  return (
    <div className="space-y-6 max-w-3xl">
      <PageMeta title="Profil & Unité Fonctionnelle — HydroScan" description="Paramétrez votre étude ISO 14046 : secteur, localisation et unité de production." />

      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Profil & Unité Fonctionnelle</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ces paramètres personnalisent le calcul ISO 14046 — facteur AWARE, benchmarks sectoriels et empreinte par unité produite.
        </p>
      </div>

      {/* Org info read-only */}
      {org && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 flex items-center gap-4">
            <Building2 className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-base">{org.name}</p>
              <p className="text-xs text-muted-foreground">{org.address}</p>
            </div>
            {sector && <Badge variant="outline" className="ml-auto shrink-0">{sector}</Badge>}
          </CardContent>
        </Card>
      )}

      {/* Sector & Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Localisation & Secteur
          </CardTitle>
          <CardDescription>Détermine l'indice AWARE local et les benchmarks sectoriels appliqués.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Secteur d'activité *</Label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger><SelectValue placeholder="Choisir un secteur…" /></SelectTrigger>
                <SelectContent>{SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {isTunisia ? (
              <div className="space-y-2">
                <Label>Gouvernorat *</Label>
                <Select value={governorate} onValueChange={setGovernorate}>
                  <SelectTrigger><SelectValue placeholder="Choisir un gouvernorat…" /></SelectTrigger>
                  <SelectContent>{GOVERNORATES_TN.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Pays *</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{countryOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
          </div>
          {(governorate || country) && (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{locationLabel}</span>
              <WsiChip wsi={wsi} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Functional unit */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Unité Fonctionnelle (ISO 14046)
          </CardTitle>
          <CardDescription>
            L'unité fonctionnelle permet d'exprimer l'empreinte eau <strong>par unité produite</strong> — c'est la base de toute étude ISO 14046.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Que produisez-vous ?</Label>
            <Select value={functionalUnit} onValueChange={setFunctionalUnit}>
              <SelectTrigger><SelectValue placeholder="Choisir une unité de production…" /></SelectTrigger>
              <SelectContent>{FUNCTIONAL_UNIT_EXAMPLES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {functionalUnit === "Autre unité" && (
            <div className="space-y-2">
              <Label>Précisez votre unité fonctionnelle</Label>
              <Input
                placeholder="ex: 1 000 m² de sol poli, 1 tonne de conserves…"
                value={functionalUnitQty}
                onChange={(e) => setFunctionalUnitQty(e.target.value)}
              />
            </div>
          )}
          {functionalUnit && functionalUnit !== "Autre unité" && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm space-y-1">
              <p className="text-xs text-muted-foreground">Unité fonctionnelle active</p>
              <p className="font-semibold text-primary">🎯 {functionalUnit}</p>
              <p className="text-xs text-muted-foreground">
                HydroScan calculera votre empreinte eau totale rapportée à cette unité.
              </p>
            </div>
          )}
          {functionalUnit === "Autre unité" && functionalUnitQty && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
              <p className="text-xs text-muted-foreground">Unité fonctionnelle active</p>
              <p className="font-semibold text-primary">🎯 {functionalUnitQty}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button className="gradient-water text-primary-foreground gap-2" onClick={handleSave} disabled={!sector}>
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Enregistré !" : "Enregistrer le profil"}
        </Button>
      </div>
    </div>
  );
}
