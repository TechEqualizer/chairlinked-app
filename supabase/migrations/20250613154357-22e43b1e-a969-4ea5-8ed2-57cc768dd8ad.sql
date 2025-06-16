
-- Drop existing problematic RLS policies on team_members
DROP POLICY IF EXISTS "Super admins can manage all team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can view all team members" ON public.team_members;

-- Create new RLS policies that avoid circular dependencies
-- Policy for super admins to manage all team members
CREATE POLICY "Super admins can manage all team members"
ON public.team_members
FOR ALL
USING (
  public.has_team_permission(auth.uid(), 'super_admin')
);

-- Policy for admins and super admins to view team members
CREATE POLICY "Admins can view all team members"
ON public.team_members
FOR SELECT
USING (
  public.has_team_permission(auth.uid(), 'admin')
);

-- Policy for team members to view their own record
CREATE POLICY "Users can view their own team member record"
ON public.team_members
FOR SELECT
USING (auth.uid() = user_id);
