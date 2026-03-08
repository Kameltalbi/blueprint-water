
-- 1. Table des facteurs d'impact (référentiel scientifique)
CREATE TABLE public.impact_factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  unit text NOT NULL DEFAULT 'kg',
  blue_water_factor numeric NOT NULL DEFAULT 0,
  green_water_factor numeric NOT NULL DEFAULT 0,
  grey_water_factor numeric NOT NULL DEFAULT 0,
  source_data text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: lecture publique, écriture admin seulement
ALTER TABLE public.impact_factors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read impact factors"
  ON public.impact_factors FOR SELECT
  TO authenticated
  USING (true);

-- 2. Table des indices de stress hydrique (WSI)
CREATE TABLE public.water_stress_indices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_name text NOT NULL,
  country text NOT NULL,
  wsi_score numeric NOT NULL DEFAULT 1.0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.water_stress_indices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read WSI"
  ON public.water_stress_indices FOR SELECT
  TO authenticated
  USING (true);

-- 3. Table des bilans (assessments)
CREATE TABLE public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_title text NOT NULL,
  location_id uuid REFERENCES public.water_stress_indices(id),
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org assessments"
  ON public.assessments FOR SELECT
  TO authenticated
  USING (is_org_member(auth.uid(), organization_id));

CREATE POLICY "Members can insert assessments"
  ON public.assessments FOR INSERT
  TO authenticated
  WITH CHECK (is_org_member(auth.uid(), organization_id) AND user_id = auth.uid());

CREATE POLICY "Users can update own assessments"
  ON public.assessments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own assessments"
  ON public.assessments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 4. Table des entrées de bilan (assessment_entries)
CREATE TABLE public.assessment_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  impact_factor_id uuid NOT NULL REFERENCES public.impact_factors(id),
  quantity_input numeric NOT NULL DEFAULT 0,
  calculated_blue numeric NOT NULL DEFAULT 0,
  calculated_green numeric NOT NULL DEFAULT 0,
  calculated_grey numeric NOT NULL DEFAULT 0,
  weighted_total numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.assessment_entries ENABLE ROW LEVEL SECURITY;

-- Accès via l'assessment parent
CREATE POLICY "Members can view org entries"
  ON public.assessment_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessments a
      WHERE a.id = assessment_id
      AND is_org_member(auth.uid(), a.organization_id)
    )
  );

CREATE POLICY "Members can insert entries"
  ON public.assessment_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.assessments a
      WHERE a.id = assessment_id
      AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own entries"
  ON public.assessment_entries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessments a
      WHERE a.id = assessment_id
      AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own entries"
  ON public.assessment_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessments a
      WHERE a.id = assessment_id
      AND a.user_id = auth.uid()
    )
  );
