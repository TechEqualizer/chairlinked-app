
-- First, let's add a last_login column to track user activity
ALTER TABLE user_profiles 
ADD COLUMN last_login timestamp with time zone;

-- Create a function to update last login time
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_profiles 
  SET last_login = now() 
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$;

-- Create trigger to update last login on auth
CREATE OR REPLACE TRIGGER on_auth_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION update_last_login();

-- Add RLS policies for team management
CREATE POLICY "Admins can view all user profiles"
  ON user_profiles FOR SELECT
  USING (is_current_user_admin());

CREATE POLICY "Admins can update user profiles"
  ON user_profiles FOR UPDATE
  USING (is_current_user_admin());

-- Create a table for team member invitations
CREATE TABLE team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  invited_by uuid REFERENCES user_profiles(user_id) NOT NULL,
  invited_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '7 days'),
  accepted_at timestamp with time zone,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled'))
);

-- Enable RLS on team_invitations
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for team_invitations
CREATE POLICY "Admins can manage invitations"
  ON team_invitations FOR ALL
  USING (is_current_user_admin());

-- Add status column to user_profiles for active/inactive users
ALTER TABLE user_profiles 
ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'inactive'));
