import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, User, Building2, Upload, Globe } from "lucide-react";
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
            {/* Logo */}
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
