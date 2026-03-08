
-- Fix search_path on validate_water_consumption
CREATE OR REPLACE FUNCTION public.validate_water_consumption()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.volume_m3 < 0 THEN
    RAISE EXCEPTION 'volume_m3 cannot be negative';
  END IF;
  IF NEW.source IS NULL OR trim(NEW.source) = '' THEN
    RAISE EXCEPTION 'source is required';
  END IF;
  IF NEW.usage IS NULL OR trim(NEW.usage) = '' THEN
    RAISE EXCEPTION 'usage is required';
  END IF;
  RETURN NEW;
END;
$$;
