import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Users, MapPin, Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole, useOrganization, useSites } from "@/hooks/useOrgData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Organization() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: userRole } = useUserRole();
  const { data: org, isLoading } = useOrganization(userRole?.organization_id);
  const { data: sites = [] } = useSites(userRole?.organization_id);
  const isAdmin = userRole?.role === "admin";

  // Site form state
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteLocation, setNewSiteLocation] = useState("");
  const [editingSite, setEditingSite] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");

  const { data: members = [] } = useQuery({
    queryKey: ["members", userRole?.organization_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("organization_id", userRole!.organization_id);
      return data || [];
    },
    enabled: !!userRole?.organization_id,
  });

  const addSiteMutation = useMutation({
    mutationFn: async () => {
      if (!newSiteName.trim()) throw new Error("Nom du site requis");
      const { error } = await supabase.from("sites").insert({
        name: newSiteName.trim(),
        location: newSiteLocation.trim() || null,
        organization_id: userRole!.organization_id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Site ajouté !");
      setNewSiteName("");
      setNewSiteLocation("");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateSiteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sites").update({
        name: editName.trim(),
        location: editLocation.trim() || null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Site mis à jour !");
      setEditingSite(null);
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteSiteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Site supprimé !");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Organisation</h1>
        <p className="text-muted-foreground">Informations sur votre organisation et vos sites</p>
      </div>

      {org ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{org.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{org.sector} · {org.country}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Votre rôle :</span>
                <Badge variant="secondary" className="capitalize">{userRole?.role}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" /> Membres ({members.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {members.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm truncate">{m.user_id === user?.id ? "Vous" : m.user_id.slice(0, 8) + "…"}</span>
                  <Badge variant="outline" className="capitalize text-xs">{m.role}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sites CRUD */}
          <Card className="shadow-card md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" /> Sites ({sites.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sites.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun site enregistré.</p>
              ) : (
                <div className="rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nom</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Localisation</th>
                        {isAdmin && <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {sites.map((s: any) => (
                        <tr key={s.id} className="border-b last:border-0">
                          {editingSite === s.id ? (
                            <>
                              <td className="px-4 py-2">
                                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" />
                              </td>
                              <td className="px-4 py-2">
                                <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="h-8" />
                              </td>
                              <td className="px-4 py-2 text-right space-x-1">
                                <Button size="sm" variant="default" onClick={() => updateSiteMutation.mutate(s.id)}>OK</Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingSite(null)}>✕</Button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-3 font-medium">{s.name}</td>
                              <td className="px-4 py-3 text-muted-foreground">{s.location || "—"}</td>
                              {isAdmin && (
                                <td className="px-4 py-3 text-right space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      setEditingSite(s.id);
                                      setEditName(s.name);
                                      setEditLocation(s.location || "");
                                    }}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    onClick={() => {
                                      if (confirm(`Supprimer le site "${s.name}" ?`)) deleteSiteMutation.mutate(s.id);
                                    }}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </td>
                              )}
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {isAdmin && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Ajouter un site
                  </p>
                  <div className="flex gap-3 items-end flex-wrap">
                    <div className="space-y-1 flex-1 min-w-[180px]">
                      <Label className="text-xs">Nom du site</Label>
                      <Input placeholder="ex: Usine Sfax" value={newSiteName} onChange={(e) => setNewSiteName(e.target.value)} maxLength={100} />
                    </div>
                    <div className="space-y-1 flex-1 min-w-[180px]">
                      <Label className="text-xs">Localisation</Label>
                      <Input placeholder="ex: Sfax, Tunisie" value={newSiteLocation} onChange={(e) => setNewSiteLocation(e.target.value)} maxLength={255} />
                    </div>
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => addSiteMutation.mutate()}
                      disabled={addSiteMutation.isPending || !newSiteName.trim()}
                    >
                      {addSiteMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                      Ajouter
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4 text-sm text-destructive">
            Vous n'êtes lié à aucune organisation.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
