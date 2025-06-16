import { supabase } from '@/integrations/supabase/client';
import { TeamMember, TeamRole } from './types';

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as TeamMember[];
};

export const ensureDevanteAsSuperAdmin = async (): Promise<void> => {
  // First, ensure Devante exists in team_members as super_admin
  const { error: upsertError } = await supabase
    .from('team_members')
    .upsert({
      user_id: 'b5ad4ac4-b3af-4c49-abbe-2953b09e4a15',
      email: '24devante@gmail.com',
      full_name: 'Devante',
      team_role: 'super_admin',
      status: 'active',
      permissions: {}
    }, {
      onConflict: 'user_id'
    });

  if (upsertError) throw upsertError;

  // Then, demote any other super_admins to admin
  const { error: demoteError } = await supabase
    .from('team_members')
    .update({ team_role: 'admin' })
    .eq('team_role', 'super_admin')
    .neq('user_id', 'b5ad4ac4-b3af-4c49-abbe-2953b09e4a15');

  if (demoteError) throw demoteError;
};

export const updateMemberRole = async (userId: string, newRole: TeamRole): Promise<void> => {
  const { error } = await supabase
    .from('team_members')
    .update({ team_role: newRole })
    .eq('user_id', userId);

  if (error) throw error;
};

export const updateMemberStatus = async (userId: string, newStatus: 'active' | 'inactive'): Promise<void> => {
  const { error } = await supabase
    .from('team_members')
    .update({ status: newStatus })
    .eq('user_id', userId);

  if (error) throw error;
};

export const deleteMember = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};

export const addTeamMember = async (email: string, teamRole: TeamRole): Promise<void> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) throw new Error('Not authenticated');

  // First, check if this email exists in auth.users
  const { data: authUser, error: authError } = await supabase
    .from('user_profiles')
    .select('user_id, email, full_name')
    .eq('email', email)
    .single();

  if (authError || !authUser) {
    throw new Error('User must be registered before being added to team');
  }

  const { error } = await supabase
    .from('team_members')
    .insert({
      user_id: authUser.user_id,
      email: authUser.email,
      full_name: authUser.full_name,
      team_role: teamRole,
      invited_by: currentUser.user.id,
      status: 'active'
    });

  if (error) throw error;
};
