import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useOrgData";
import { toast } from "sonner";

export interface DischargeEntry {
  id: string;
  organization_id: string;
  user_id: string;
  discharge_type: string;
  pollutant: string;
  concentration: number;
  volume_m3: number;
  c_max: number;
  c_nat: number;
  unit: string;
  wf_grey: number;
  created_at: string;
}

export function useDischargeEntries() {
  const roleData = useUserRole();
  const orgId = roleData.data?.organization_id;

  return useQuery({
    queryKey: ["discharge_entries", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discharge_entries")
        .select("*")
        .eq("organization_id", orgId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as DischargeEntry[];
    },
    enabled: !!orgId,
  });
}

export function useAddDischargeEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const roleData = useUserRole();
  const orgId = roleData.data?.organization_id;

  return useMutation({
    mutationFn: async (entry: {
      discharge_type: string;
      pollutant: string;
      concentration: number;
      volume_m3: number;
      c_max: number;
      c_nat: number;
      unit: string;
      wf_grey: number;
    }) => {
      const { error } = await supabase.from("discharge_entries").insert({
        organization_id: orgId!,
        user_id: user!.id,
        ...entry,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discharge_entries"] });
      toast.success("Rejet enregistré");
    },
    onError: () => toast.error("Erreur lors de l'enregistrement"),
  });
}

export function useDeleteDischargeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("discharge_entries")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discharge_entries"] });
    },
  });
}
