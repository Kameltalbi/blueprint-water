import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageMeta } from "@/components/PageMeta";
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
import { Plus, Upload, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole, useSites, useWaterConsumption } from "@/hooks/useOrgData";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: userRole } = useUserRole();
  const { data: sites = [] } = useSites(userRole?.organization_id);
  const { data: entries = [], isLoading } = useWaterConsumption(userRole?.organization_id);

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
        source,
        usage,
        period,
        site_id: siteId || null,
        recorded_date: recordedDate,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Données enregistrées avec succès !");
      setVolume("");
      setSource("");
      setUsage("");
      setPeriod("");
      setSiteId("");
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

  const handleSubmit = () => {
    if (!volume || !source || !usage || !period) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    insertMutation.mutate();
  };

  const noOrg = !userRole?.organization_id && !isLoading;
  const siteName = (id: string | null) => sites.find((s: any) => s.id === id)?.name || "—";

  return (
    <div className="space-y-6">
      <PageMeta title="Collecte de données — HydroScan" description="Saisissez vos données de consommation d'eau pour un suivi précis." />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Collecte de données</h1>
          <p className="text-muted-foreground">Saisissez vos données de consommation d'eau</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Importer CSV
        </Button>
      </div>

      {noOrg && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4 text-sm text-destructive">
            Vous n'êtes lié à aucune organisation. Contactez un administrateur pour être ajouté.
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Nouvelle saisie</CardTitle>
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
                <SelectContent>
                  {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Usage *</Label>
              <Select value={usage} onValueChange={setUsage}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {usages.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Période *</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {periods.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Site</Label>
              <Select value={siteId} onValueChange={setSiteId}>
                <SelectTrigger><SelectValue placeholder="Tous les sites" /></SelectTrigger>
                <SelectContent>
                  {sites.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={recordedDate} onChange={(e) => setRecordedDate(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="gap-2" disabled={insertMutation.isPending || noOrg}>
              {insertMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Saisies récentes ({entries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Volume</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usage</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Site</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Période</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      {isLoading ? "Chargement…" : "Aucune saisie pour le moment"}
                    </td>
                  </tr>
                )}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm("Supprimer cette entrée ?")) deleteMutation.mutate(row.id);
                          }}
                        >
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
    </div>
  );
}
