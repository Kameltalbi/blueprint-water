import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useUserRole() {
  const { user } = useAuth();
  return useQuery({
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
}

export function useOrganization(orgId: string | undefined) {
  return useQuery({
    queryKey: ["organization", orgId],
    queryFn: async () => {
      const { data } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", orgId!)
        .single();
      return data;
    },
    enabled: !!orgId,
  });
}

export function useSites(orgId: string | undefined) {
  return useQuery({
    queryKey: ["sites", orgId],
    queryFn: async () => {
      const { data } = await supabase
        .from("sites")
        .select("*")
        .eq("organization_id", orgId!);
      return data || [];
    },
    enabled: !!orgId,
  });
}

export function useWaterConsumption(orgId: string | undefined) {
  return useQuery({
    queryKey: ["waterConsumption", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("water_consumption")
        .select("*")
        .eq("organization_id", orgId!)
        .order("recorded_date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!orgId,
  });
}
