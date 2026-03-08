import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, User, Building2, Upload, Globe, Users, Shield, UserPlus, Trash2 } from "lucide-react";
import { LangToggle } from "@/components/LangToggle";

export default function Settings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");

  // Org state
  const [orgName, setOrgName] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgTva, setOrgTva] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Invite state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("member");

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

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

  const { data: org, isLoading: orgLoading } = useQuery({
    queryKey: ["organization", userRole?.organization_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", userRole!.organization_id)
        .single();
      return data;
    },
    enabled: !!userRole?.organization_id,
  });

  // Fetch all members with their profiles
  const { data: members = [] } = useQuery({
    queryKey: ["orgMembers", userRole?.organization_id],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("id, user_id, role")
        .eq("organization_id", userRole!.organization_id);
      if (!roles) return [];

      // Fetch profiles for each member
      const userIds = roles.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);

      return roles.map((r) => ({
        ...r,
        profile: profiles?.find((p) => p.id === r.user_id),
      }));
    },
    enabled: !!userRole?.organization_id,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setCompany(profile.company || "");
    }
  }, [profile]);

  useEffect(() => {
    if (org) {
      setOrgName(org.name || "");
      setOrgAddress((org as any).address || "");
      setOrgTva((org as any).tva || "");
      setLogoUrl((org as any).logo_url || "");
    }
  }, [org]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, company, updated_at: new Date().toISOString() })
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profil mis à jour !");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateOrgMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("organizations")
        .update({
          name: orgName,
          address: orgAddress,
          tva: orgTva,
          logo_url: logoUrl,
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", userRole!.organization_id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Organisation mise à jour !");
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ roleId, newRole }: { roleId: string; newRole: string }) => {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole } as any)
        .eq("id", roleId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Rôle mis à jour !");
      queryClient.invalidateQueries({ queryKey: ["orgMembers"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeUserMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Utilisateur retiré !");
      queryClient.invalidateQueries({ queryKey: ["orgMembers"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userRole?.organization_id) return;

    setUploadingLogo(true);
    const ext = file.name.split(".").pop();
    const path = `${userRole.organization_id}/logo.${ext}`;

    const { error } = await supabase.storage.from("org-logos").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Erreur upload : " + error.message);
      setUploadingLogo(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("org-logos").getPublicUrl(path);
    setLogoUrl(urlData.publicUrl);
    setUploadingLogo(false);
    toast.success("Logo uploadé !");
  };

  const isAdmin = userRole?.role === "admin";
  const isLoading = profileLoading || orgLoading;

  const roleLabels: Record<string, string> = {
    admin: "Administrateur",
    member: "Membre",
    viewer: "Lecteur",
  };

  const roleBadgeVariant = (role: string) => {
    if (role === "admin") return "default" as const;
    if (role === "member") return "secondary" as const;
    return "outline" as const;
  };

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
        <h1 className="font-display text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre profil, votre organisation et vos préférences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profil */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Entreprise</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} maxLength={100} />
            </div>
            <Button onClick={() => updateProfileMutation.mutate()} disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Enregistrer
            </Button>
          </CardContent>
        </Card>

        {/* Organisation */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" /> Organisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-14 w-14 rounded-lg object-contain border bg-background p-1" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-muted text-muted-foreground text-xs">
                    Logo
                  </div>
                )}
                <div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={!isAdmin} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!isAdmin || uploadingLogo}
                  >
                    {uploadingLogo ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                    Changer le logo
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nom de l'organisation</Label>
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={!isAdmin} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} disabled={!isAdmin} placeholder="Adresse complète" maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label>Numéro TVA</Label>
              <Input value={orgTva} onChange={(e) => setOrgTva(e.target.value)} disabled={!isAdmin} placeholder="ex: TN1234567A" maxLength={30} />
            </div>
            {isAdmin ? (
              <Button onClick={() => updateOrgMutation.mutate()} disabled={updateOrgMutation.isPending}>
                {updateOrgMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Enregistrer
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">Seuls les administrateurs peuvent modifier l'organisation.</p>
            )}
          </CardContent>
        </Card>

        {/* Utilisateurs */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" /> Utilisateurs ({members.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Utilisateur</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rôle</th>
                    {isAdmin && <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {members.map((m: any) => {
                    const isCurrentUser = m.user_id === user?.id;
                    return (
                      <tr key={m.id} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {(m.profile?.full_name || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">
                                {m.profile?.full_name || "Utilisateur"}
                                {isCurrentUser && <span className="text-muted-foreground ml-1">(vous)</span>}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={roleBadgeVariant(m.role)}>{roleLabels[m.role] || m.role}</Badge>
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-right">
                            {!isCurrentUser && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (confirm("Retirer cet utilisateur de l'organisation ?")) {
                                    removeUserMutation.mutate(m.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {isAdmin && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Ajouter un utilisateur
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  L'utilisateur doit d'abord créer un compte sur HydroScan. Entrez son email pour l'ajouter à votre organisation.
                </p>
                <div className="flex gap-3 items-end flex-wrap">
                  <div className="space-y-1 flex-1 min-w-[200px]">
                    <Label className="text-xs">Email</Label>
                    <Input
                      type="email"
                      placeholder="email@entreprise.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      maxLength={255}
                    />
                  </div>
                  <div className="space-y-1 w-[160px]">
                    <Label className="text-xs">Rôle</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="member">Membre</SelectItem>
                        <SelectItem value="viewer">Lecteur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={async () => {
                      if (!inviteEmail.trim()) return toast.error("Entrez un email");
                      // Note: this is a simplified flow — in production you'd use an edge function
                      toast.info("Fonctionnalité d'invitation par email bientôt disponible. Ajoutez les utilisateurs via le SQL Editor Supabase pour l'instant.");
                      setInviteEmail("");
                    }}
                  >
                    <UserPlus className="h-3 w-3" />
                    Ajouter
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" /> Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Permission</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Administrateur</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Membre</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Lecteur</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Voir le tableau de bord", admin: true, member: true, viewer: true },
                    { label: "Saisir des données de consommation", admin: true, member: true, viewer: false },
                    { label: "Générer et exporter des rapports", admin: true, member: true, viewer: true },
                    { label: "Modifier les paramètres de l'organisation", admin: true, member: false, viewer: false },
                    { label: "Gérer les utilisateurs et rôles", admin: true, member: false, viewer: false },
                    { label: "Gérer les sites", admin: true, member: false, viewer: false },
                    { label: "Supprimer des données", admin: true, member: false, viewer: false },
                  ].map((perm, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{perm.label}</td>
                      <td className="px-4 py-3 text-center">{perm.admin ? "✅" : "❌"}</td>
                      <td className="px-4 py-3 text-center">{perm.member ? "✅" : "❌"}</td>
                      <td className="px-4 py-3 text-center">{perm.viewer ? "✅" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Les permissions sont appliquées automatiquement via les politiques de sécurité (RLS) de la base de données.
            </p>
          </CardContent>
        </Card>

        {/* Préférences */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" /> Préférences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Langue</Label>
              <LangToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
