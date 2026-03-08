import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const sources = [
  "Réseau municipal",
  "Puits / Eau souterraine",
  "Eau de pluie",
  "Eau recyclée",
];

const usages = [
  "Processus industriel",
  "Sanitaire",
  "Irrigation",
  "Refroidissement",
  "Nettoyage",
];

const periods = ["Mensuel", "Trimestriel", "Annuel"];

export default function DataEntry() {
  const [entries, setEntries] = useState<
    { volume: string; source: string; usage: string; period: string }[]
  >([]);

  const handleAdd = () => {
    setEntries([...entries, { volume: "", source: "", usage: "", period: "" }]);
  };

  const handleSubmit = () => {
    toast.success("Données enregistrées avec succès !");
    setEntries([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Collecte de données</h1>
          <p className="text-muted-foreground">
            Saisissez vos données de consommation d'eau
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Importer CSV
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Nouvelle saisie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Volume (m³)</Label>
              <Input type="number" placeholder="ex: 1500" />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Usage</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {usages.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Période</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="gap-2">
              <Plus className="h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent entries table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Saisies récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Volume</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usage</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Période</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "2024-03-01", volume: "1 200 m³", source: "Réseau municipal", usage: "Processus industriel", period: "Mensuel" },
                  { date: "2024-03-01", volume: "800 m³", source: "Puits", usage: "Irrigation", period: "Mensuel" },
                  { date: "2024-02-01", volume: "1 100 m³", source: "Réseau municipal", usage: "Processus industriel", period: "Mensuel" },
                ].map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3 font-medium">{row.volume}</td>
                    <td className="px-4 py-3">{row.source}</td>
                    <td className="px-4 py-3">{row.usage}</td>
                    <td className="px-4 py-3">{row.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
