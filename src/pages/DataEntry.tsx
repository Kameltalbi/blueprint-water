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
import { Plus, Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const [volume, setVolume] = useState("");
  const [source, setSource] = useState("");
  const [usage, setUsage] = useState("");
  const [period, setPeriod] = useState("");

  // Fetch user's org
  const { data: userRole } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("organization_id, role")
        .eq("user_id", user!.id)
        .limit(1)
        .single();
      return data;
    },
    enabled: !!user,
  });

  // Fetch recent entries
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["waterConsumption", userRole?.organization_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("water_consumption")
        .select("*")
        .eq("organization_id", userRole!.organization_id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!userRole?.organization_id,
  });

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
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Données enregistrées avec succès !");
      setVolume("");
      setSource("");
      setUsage("");
      setPeriod("");
      queryClient.invalidateQueries({ queryKey: ["waterConsumption"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = () => {
    if (!volume || !source || !usage || !period) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    insertMutation.mutate();
  };

  const noOrg = !userRole?.organization_id && !isLoading;

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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Volume (m³)</Label>
              <Input type="number" placeholder="ex: 1500" value={volume} onChange={(e) => setVolume(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={source} onValueChange={setSource}>
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
              <Select value={usage} onValueChange={setUsage}>
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
              <Select value={period} onValueChange={setPeriod}>
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
            <Button onClick={handleSubmit} className="gap-2" disabled={insertMutation.isPending || noOrg}>
              {insertMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>

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
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
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
