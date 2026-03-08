
-- Validation trigger: prevent negative volumes in water_consumption
CREATE OR REPLACE FUNCTION public.validate_water_consumption()
RETURNS TRIGGER
LANGUAGE plpgsql
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

CREATE TRIGGER validate_water_consumption_before_insert
  BEFORE INSERT OR UPDATE ON public.water_consumption
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_water_consumption();
