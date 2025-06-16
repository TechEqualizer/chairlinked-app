
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TeamMember, TeamInvitation, TeamRole } from './types';
import {
  fetchTeamMembers as fetchTeamMembersAPI,
  updateMemberRole as updateMemberRoleAPI,
  updateMemberStatus as updateMemberStatusAPI,
  deleteMember as deleteMemberAPI,
  addTeamMember as addTeamMemberAPI,
  ensureDevanteAsSuperAdmin
} from './teamMemberOperations';
import {
  fetchInvitations as fetchInvitationsAPI,
  inviteMember as inviteMemberAPI
} from './invitationOperations';

export function useTeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    try {
      const data = await fetchTeamMembersAPI();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    }
  };

  const fetchInvitations = async () => {
    try {
      const data = await fetchInvitationsAPI();
      setInvitations(data);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const updateMemberRole = async (userId: string, newRole: TeamRole) => {
    try {
      await updateMemberRoleAPI(userId, newRole);
      await fetchTeamMembers();
      toast({
        title: "Success",
        description: `Role updated successfully`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const updateMemberStatus = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      await updateMemberStatusAPI(userId, newStatus);
      await fetchTeamMembers();
      toast({
        title: "Success",
        description: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const inviteMember = async (email: string, role: TeamRole) => {
    try {
      await inviteMemberAPI(email, role);
      await fetchInvitations();
      toast({
        title: "Success",
        description: `Invitation sent to ${email}`,
      });
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  const addTeamMember = async (email: string, role: TeamRole) => {
    try {
      await addTeamMemberAPI(email, role);
      await fetchTeamMembers();
      toast({
        title: "Success",
        description: `${email} added to team successfully`,
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add team member",
        variant: "destructive",
      });
    }
  };

  const deleteMember = async (userId: string) => {
    try {
      await deleteMemberAPI(userId);
      await fetchTeamMembers();
      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Ensure Devante is set as super admin first
        await ensureDevanteAsSuperAdmin();
        await Promise.all([fetchTeamMembers(), fetchInvitations()]);
      } catch (error) {
        console.error('Error initializing team data:', error);
        toast({
          title: "Error",
          description: "Failed to initialize team data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    teamMembers,
    invitations,
    loading,
    updateMemberRole,
    updateMemberStatus,
    inviteMember,
    addTeamMember,
    deleteMember,
    refetch: async () => {
      await ensureDevanteAsSuperAdmin();
      return Promise.all([fetchTeamMembers(), fetchInvitations()]);
    }
  };
}
