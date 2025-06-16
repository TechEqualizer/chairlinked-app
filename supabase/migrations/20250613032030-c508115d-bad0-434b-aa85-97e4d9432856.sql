
-- Create team roles enum
CREATE TYPE public.team_role AS ENUM (
  'super_admin',
  'admin', 
  'support',
  'developer',
  'marketing',
  'viewer'
);

-- Create team_members table for internal staff only
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  team_role team_role NOT NULL DEFAULT 'viewer',
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_active TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Enable RLS on team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members - only admins can manage team
CREATE POLICY "Super admins can manage all team members"
ON public.team_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.team_members tm 
    WHERE tm.user_id = auth.uid() 
    AND tm.team_role = 'super_admin'
    AND tm.status = 'active'
  )
);

CREATE POLICY "Admins can view all team members"
ON public.team_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.team_members tm 
    WHERE tm.user_id = auth.uid() 
    AND tm.team_role IN ('super_admin', 'admin')
    AND tm.status = 'active'
  )
);

-- Create function to check team permissions
CREATE OR REPLACE FUNCTION public.has_team_permission(
  user_uuid UUID,
  required_role team_role
) RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE user_id = user_uuid 
    AND status = 'active'
    AND (
      team_role = required_role 
      OR (required_role = 'viewer' AND team_role IN ('super_admin', 'admin', 'support', 'developer', 'marketing'))
      OR (required_role = 'marketing' AND team_role IN ('super_admin', 'admin'))
      OR (required_role = 'developer' AND team_role IN ('super_admin', 'admin'))
      OR (required_role = 'support' AND team_role IN ('super_admin', 'admin'))
      OR (required_role = 'admin' AND team_role = 'super_admin')
    )
  );
$$;

-- Update team_invitations to use team_role instead of user_role
ALTER TABLE public.team_invitations 
DROP COLUMN role,
ADD COLUMN team_role team_role DEFAULT 'viewer';

-- Add trigger for updated_at
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create initial super admin (you'll need to update this with your actual user ID)
-- This ensures you have access to manage the team
INSERT INTO public.team_members (user_id, email, full_name, team_role, status)
SELECT 
  up.user_id,
  up.email,
  up.full_name,
  'super_admin'::team_role,
  'active'
FROM public.user_profiles up
WHERE up.role = 'admin'
ON CONFLICT (user_id) DO UPDATE SET
  team_role = 'super_admin',
  status = 'active',
  updated_at = now();
