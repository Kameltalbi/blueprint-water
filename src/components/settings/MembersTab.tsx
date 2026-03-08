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
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Users, UserPlus, Trash2 } from "lucide-react";

export default function MembersTab() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("member");

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

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["orgMembers", userRole?.organization_id],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("id, user_id, role")
        .eq("organization_id", userRole!.organization_id);
      if (!roles) return [];

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

  const isAdmin = userRole?.role === "admin";

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
    <Card className="shadow-card">
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
                  toast.info("Fonctionnalité d'invitation par email bientôt disponible.");
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
  );
}
