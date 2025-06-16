
-- Since we can't create a profile without an existing auth user,
-- we'll modify the trigger function to automatically assign admin role 
-- to this specific email when they sign up

-- First, create a temporary table to store admin emails
CREATE TABLE IF NOT EXISTS admin_emails (
  email text PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert the admin email
INSERT INTO admin_emails (email) VALUES ('24devante@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Update the handle_new_user function to check for admin emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    CASE 
      WHEN EXISTS (SELECT 1 FROM admin_emails WHERE email = new.email) THEN 'admin'::user_role
      ELSE 'customer'::user_role
    END
  );
  RETURN new;
END;
$function$;
