import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useOrgData";
import { toast } from "sonner";

export interface SupplyChainEntry {
  id: string;
  organization_id: string;
  user_id: string;
  material: string;
  supplier: string | null;
  country: string | null;
  quantity: number;
  unit: string;
  water_factor: number;
  created_at: string;
}

export function useSupplyChainEntries() {
  const roleData = useUserRole();
  const orgId = roleData.data?.organization_id;

  return useQuery({
    queryKey: ["supply_chain_entries", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("supply_chain_entries")
        .select("*")
        .eq("organization_id", orgId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as SupplyChainEntry[];
    },
    enabled: !!orgId,
  });
}

export function useAddSupplyChainEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const roleData = useUserRole();
  const orgId = roleData.data?.organization_id;

  return useMutation({
    mutationFn: async (entry: {
      material: string;
      supplier: string;
      country: string;
      quantity: number;
      water_factor: number;
    }) => {
      const { error } = await supabase.from("supply_chain_entries").insert({
        organization_id: orgId!,
        user_id: user!.id,
        material: entry.material,
        supplier: entry.supplier || null,
        country: entry.country || null,
        quantity: entry.quantity,
        water_factor: entry.water_factor,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supply_chain_entries"] });
      toast.success("Entrée ajoutée");
    },
    onError: () => toast.error("Erreur lors de l'ajout"),
  });
}

export function useDeleteSupplyChainEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("supply_chain_entries")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supply_chain_entries"] });
    },
  });
}
