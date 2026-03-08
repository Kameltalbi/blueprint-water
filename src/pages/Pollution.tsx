import { PageMeta } from "@/components/PageMeta";
import { useI18n } from "@/lib/i18n";
import { FlaskConical, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface DischargeEntry {
  id: number;
  type: string;
  pollutant: string;
  concentration: number;
  volumeM3: number;
  norm: number;
  unit: string;
}

const pollutants = [
  { name: "DBO5", cMax: 30, cNat: 2, unit: "mg/L" },
  { name: "DCO", cMax: 90, cNat: 5, unit: "mg/L" },
  { name: "MES", cMax: 30, cNat: 5, unit: "mg/L" },
  { name: "Azote total", cMax: 30, cNat: 1, unit: "mg/L" },
  { name: "Phosphore", cMax: 10, cNat: 0.1, unit: "mg/L" },
  { name: "Métaux lourds", cMax: 0.5, cNat: 0.01, unit: "mg/L" },
];

const dischargeTypes = [
  "Rejet industriel",
  "Eaux sanitaires",
  "Eaux de refroidissement",
  "Eaux de lavage",
];

export default function Pollution() {
  const { t } = useI18n();
  const [entries, setEntries] = useState<DischargeEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [dischargeType, setDischargeType] = useState("");
  const [pollutant, setPollutant] = useState("");
  const [concentration, setConcentration] = useState("");
  const [volume, setVolume] = useState("");

  const addEntry = () => {
    if (!dischargeType || !pollutant || !concentration || !volume) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    const pol = pollutants.find((p) => p.name === pollutant);
    setEntries([...entries, {
      id: Date.now(),
      type: dischargeType,
      pollutant,
      concentration: parseFloat(concentration),
      volumeM3: parseFloat(volume),
      norm: pol?.norm || 30,
      unit: pol?.unit || "mg/L",
    }]);
    setDischargeType("");
    setPollutant("");
    setConcentration("");
    setVolume("");
    toast.success("Rejet enregistré");
  };

  const removeEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  // Grey water calculation: volume * (concentration / norm)
  const totalGreyWater = entries.reduce((s, e) => s + (e.volumeM3 * (e.concentration / e.norm)), 0);
  const nonCompliant = entries.filter((e) => e.concentration > e.norm).length;
  const complianceRate = entries.length > 0 ? Math.round(((entries.length - nonCompliant) / entries.length) * 100) : 0;

  return (
    <>
      <PageMeta title="Rejets & Qualité — HydroScan" description="Gérez vos rejets d'eaux usées pour le calcul de l'eau grise" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("pollution.title")}</h1>
            <p className="text-muted-foreground">{t("pollution.subtitle")}</p>
          </div>
          <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            {t("pollution.add")}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("pollution.greyWater")}</CardDescription>
              <CardTitle className="text-2xl">
                {totalGreyWater > 0 ? `${Math.round(totalGreyWater).toLocaleString("fr-FR")} m³` : "— m³"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {totalGreyWater > 0 ? "Eau grise calculée (volume × concentration/norme)" : t("pollution.noData")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("pollution.sources")}</CardDescription>
              <CardTitle className="text-2xl">{entries.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">rejets enregistrés</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("pollution.compliance")}</CardDescription>
              <CardTitle className="text-2xl">
                {entries.length > 0 ? `${complianceRate}%` : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nonCompliant > 0 && (
                <Badge variant="destructive" className="text-xs">{nonCompliant} dépassement(s)</Badge>
              )}
              {entries.length > 0 && nonCompliant === 0 && (
                <Badge variant="secondary" className="text-xs">Conforme</Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Nouveau rejet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Type de rejet *</Label>
                  <Select value={dischargeType} onValueChange={setDischargeType}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {dischargeTypes.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Polluant *</Label>
                  <Select value={pollutant} onValueChange={setPollutant}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {pollutants.map((p) => (
                        <SelectItem key={p.name} value={p.name}>
                          {p.name} (norme: {p.norm} {p.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Concentration *</Label>
                  <Input type="number" placeholder="ex: 45" value={concentration} onChange={(e) => setConcentration(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Volume rejeté (m³) *</Label>
                  <Input type="number" placeholder="ex: 500" value={volume} onChange={(e) => setVolume(e.target.value)} />
                </div>
              </div>
              <Button onClick={addEntry} className="gap-2">
                <Plus className="h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        )}

        {entries.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16">
            <FlaskConical className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg mb-1">{t("pollution.emptyTitle")}</h3>
            <p className="text-muted-foreground text-sm text-center max-w-md mb-4">
              {t("pollution.emptyDesc")}
            </p>
            <Button className="gap-2" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              {t("pollution.add")}
            </Button>
          </Card>
        ) : (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Rejets enregistrés ({entries.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Polluant</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Concentration</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Norme</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Volume</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e) => (
                      <tr key={e.id} className="border-b last:border-0">
                        <td className="px-4 py-3">{e.type}</td>
                        <td className="px-4 py-3 font-medium">{e.pollutant}</td>
                        <td className="px-4 py-3">{e.concentration} {e.unit}</td>
                        <td className="px-4 py-3 text-muted-foreground">{e.norm} {e.unit}</td>
                        <td className="px-4 py-3">{e.volumeM3} m³</td>
                        <td className="px-4 py-3">
                          {e.concentration > e.norm ? (
                            <Badge variant="destructive" className="text-xs">Dépassement</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Conforme</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeEntry(e.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
