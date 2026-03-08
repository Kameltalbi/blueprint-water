
-- Insert organization
INSERT INTO public.organizations (id, name, sector, country)
VALUES ('a1b2c3d4-0000-0000-0000-000000000001', 'ABC Archibat', 'Architecture', 'Tunisie');

-- Link user as admin
INSERT INTO public.user_roles (user_id, organization_id, role)
VALUES ('bff4b90c-2526-4273-9c11-bf870953e2e1', 'a1b2c3d4-0000-0000-0000-000000000001', 'admin');
