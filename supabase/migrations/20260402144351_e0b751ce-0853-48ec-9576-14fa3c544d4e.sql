
-- Supply chain entries
CREATE TABLE public.supply_chain_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  material text NOT NULL,
  supplier text,
  country text,
  quantity numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'tonnes',
  water_factor numeric NOT NULL DEFAULT 1000,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Discharge (pollution) entries
CREATE TABLE public.discharge_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  discharge_type text NOT NULL,
  pollutant text NOT NULL,
  concentration numeric NOT NULL DEFAULT 0,
  volume_m3 numeric NOT NULL DEFAULT 0,
  c_max numeric NOT NULL DEFAULT 30,
  c_nat numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'mg/L',
  wf_grey numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS for supply_chain_entries
ALTER TABLE public.supply_chain_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org supply chain"
  ON public.supply_chain_entries FOR SELECT TO authenticated
  USING (is_org_member(auth.uid(), organization_id));

CREATE POLICY "Members can insert supply chain"
  ON public.supply_chain_entries FOR INSERT TO authenticated
  WITH CHECK (is_org_member(auth.uid(), organization_id) AND user_id = auth.uid());

CREATE POLICY "Users can update own supply chain"
  ON public.supply_chain_entries FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own supply chain"
  ON public.supply_chain_entries FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS for discharge_entries
ALTER TABLE public.discharge_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org discharges"
  ON public.discharge_entries FOR SELECT TO authenticated
  USING (is_org_member(auth.uid(), organization_id));

CREATE POLICY "Members can insert discharges"
  ON public.discharge_entries FOR INSERT TO authenticated
  WITH CHECK (is_org_member(auth.uid(), organization_id) AND user_id = auth.uid());

CREATE POLICY "Users can update own discharges"
  ON public.discharge_entries FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own discharges"
  ON public.discharge_entries FOR DELETE TO authenticated
  USING (user_id = auth.uid());
