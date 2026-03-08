import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Building2, Upload } from "lucide-react";

export default function OrganizationTab() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [orgName, setOrgName] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgTva, setOrgTva] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

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

  const { data: org, isLoading } = useQuery({
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
    if (org) {
      setOrgName(org.name || "");
      setOrgAddress(org.address || "");
      setOrgTva(org.tva || "");
      setLogoUrl(org.logo_url || "");
    }
  }, [org]);

  const isAdmin = userRole?.role === "admin";

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
        })
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="shadow-card max-w-2xl">
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
  );
}
