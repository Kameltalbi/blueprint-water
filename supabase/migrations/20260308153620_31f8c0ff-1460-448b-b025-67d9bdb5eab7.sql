
-- Add phone column to organizations
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS email text;

-- Create a security definer function to create org + admin role in one transaction
CREATE OR REPLACE FUNCTION public.create_organization_with_admin(
  _user_id uuid,
  _org_name text,
  _org_address text,
  _org_email text,
  _org_phone text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org_id uuid;
BEGIN
  -- Create the organization
  INSERT INTO public.organizations (name, address, email, phone)
  VALUES (_org_name, _org_address, _org_email, _org_phone)
  RETURNING id INTO _org_id;

  -- Assign the user as admin
  INSERT INTO public.user_roles (user_id, organization_id, role)
  VALUES (_user_id, _org_id, 'admin');

  RETURN _org_id;
END;
$$;
