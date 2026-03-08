
CREATE TABLE public.calculator_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sector text NOT NULL,
  product text,
  volume numeric,
  unit text DEFAULT 'kg',
  country text,
  green_water numeric NOT NULL DEFAULT 0,
  blue_water numeric NOT NULL DEFAULT 0,
  grey_water numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  per_unit numeric NOT NULL DEFAULT 0,
  score text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.calculator_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own results"
ON public.calculator_results FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own results"
ON public.calculator_results FOR SELECT TO authenticated
USING (auth.uid() = user_id);
