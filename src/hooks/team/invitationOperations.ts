
import { supabase } from '@/integrations/supabase/client';
import { TeamInvitation, TeamRole } from './types';

export const fetchInvitations = async (): Promise<TeamInvitation[]> => {
  const { data, error } = await supabase
    .from('team_invitations')
    .select('*')
    .eq('status', 'pending')
    .order('invited_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const inviteMember = async (email: string, teamRole: TeamRole): Promise<void> => {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser.user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('team_invitations')
    .insert({
      email,
      team_role: teamRole,
      invited_by: currentUser.user.id
    });

  if (error) throw error;
};
