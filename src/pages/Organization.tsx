import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function Organization() {
  const { user } = useAuth();

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

  const { data: sites = [] } = useQuery({
    queryKey: ["sites", userRole?.organization_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("sites")
        .select("*")
        .eq("organization_id", userRole!.organization_id);
      return data || [];
    },
    enabled: !!userRole?.organization_id,
  });

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
        <p className="text-muted-foreground">Informations sur votre organisation</p>
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

          <Card className="shadow-card md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" /> Sites ({sites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sites.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun site enregistré.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {sites.map((s: any) => (
                    <div key={s.id} className="rounded-lg border p-3">
                      <p className="font-medium text-sm">{s.name}</p>
                      {s.location && <p className="text-xs text-muted-foreground">{s.location}</p>}
                    </div>
                  ))}
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
