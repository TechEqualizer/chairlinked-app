
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamRole, TeamPermissions } from './team/types';

export function useTeamPermissions() {
  // Development mode bypass
  const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
  
  const [currentUserRole, setCurrentUserRole] = useState<TeamRole | null>(
    isDevMode ? 'super_admin' : null
  );
  const [permissions, setPermissions] = useState<TeamPermissions>(
    isDevMode ? {
      canManageTeam: true,
      canViewCustomers: true,
      canManageCustomers: true,
      canViewAnalytics: true,
      canManageSites: true,
      canManageTemplates: true,
      canViewSettings: true,
      canManageSettings: true,
    } : {
      canManageTeam: false,
      canViewCustomers: false,
      canManageCustomers: false,
      canViewAnalytics: false,
      canManageSites: false,
      canManageTemplates: false,
      canViewSettings: false,
      canManageSettings: false,
    }
  );
  const [loading, setLoading] = useState(isDevMode ? false : true);

  const calculatePermissions = (role: TeamRole): TeamPermissions => {
    switch (role) {
      case 'super_admin':
        return {
          canManageTeam: true,
          canViewCustomers: true,
          canManageCustomers: true,
          canViewAnalytics: true,
          canManageSites: true,
          canManageTemplates: true,
          canViewSettings: true,
          canManageSettings: true,
        };
      case 'admin':
        return {
          canManageTeam: false,
          canViewCustomers: true,
          canManageCustomers: true,
          canViewAnalytics: true,
          canManageSites: true,
          canManageTemplates: true,
          canViewSettings: true,
          canManageSettings: false,
        };
      case 'support':
        return {
          canManageTeam: false,
          canViewCustomers: true,
          canManageCustomers: false,
          canViewAnalytics: false,
          canManageSites: true,
          canManageTemplates: false,
          canViewSettings: false,
          canManageSettings: false,
        };
      case 'developer':
        return {
          canManageTeam: false,
          canViewCustomers: false,
          canManageCustomers: false,
          canViewAnalytics: true,
          canManageSites: true,
          canManageTemplates: true,
          canViewSettings: true,
          canManageSettings: false,
        };
      case 'marketing':
        return {
          canManageTeam: false,
          canViewCustomers: true,
          canManageCustomers: false,
          canViewAnalytics: true,
          canManageSites: true,
          canManageTemplates: true,
          canViewSettings: false,
          canManageSettings: false,
        };
      case 'viewer':
      default:
        return {
          canManageTeam: false,
          canViewCustomers: false,
          canManageCustomers: false,
          canViewAnalytics: false,
          canManageSites: false,
          canManageTemplates: false,
          canViewSettings: false,
          canManageSettings: false,
        };
    }
  };

  useEffect(() => {
    // Skip database calls in dev mode
    if (isDevMode) {
      return;
    }
    
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: teamMember, error } = await supabase
          .from('team_members')
          .select('team_role')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (error || !teamMember) {
          // User is not a team member, check if they're a legacy admin
          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (userProfile?.role === 'admin') {
            // Legacy admin, give them super_admin permissions
            setCurrentUserRole('super_admin');
            setPermissions(calculatePermissions('super_admin'));
          } else {
            setCurrentUserRole(null);
            setPermissions(calculatePermissions('viewer'));
          }
        } else {
          setCurrentUserRole(teamMember.team_role);
          setPermissions(calculatePermissions(teamMember.team_role));
        }
      } catch (error) {
        console.error('Error fetching team role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [isDevMode]);

  const hasPermission = (permission: keyof TeamPermissions): boolean => {
    return permissions[permission];
  };

  const hasRole = (role: TeamRole): boolean => {
    if (!currentUserRole) return false;
    
    // Super admin has all roles
    if (currentUserRole === 'super_admin') return true;
    
    // Check for exact match
    return currentUserRole === role;
  };

  const hasMinimumRole = (minimumRole: TeamRole): boolean => {
    if (!currentUserRole) return false;

    const roleHierarchy: Record<TeamRole, number> = {
      'viewer': 1,
      'marketing': 2,
      'developer': 2,
      'support': 2,
      'admin': 3,
      'super_admin': 4
    };

    return roleHierarchy[currentUserRole] >= roleHierarchy[minimumRole];
  };

  // Create dev-aware functions
  const devAwareHasPermission = (permission: keyof TeamPermissions): boolean => {
    const result = isDevMode ? true : permissions[permission];
    console.log('[useTeamPermissions] Permission check:', { permission, isDevMode, result, currentUserRole });
    return result;
  };

  const devAwareHasRole = (role: TeamRole): boolean => {
    if (isDevMode) return true;
    return hasRole(role);
  };

  const devAwareHasMinimumRole = (minimumRole: TeamRole): boolean => {
    if (isDevMode) return true;
    return hasMinimumRole(minimumRole);
  };

  return {
    currentUserRole: isDevMode ? 'super_admin' : currentUserRole,
    permissions,
    loading,
    hasPermission: devAwareHasPermission,
    hasRole: devAwareHasRole,
    hasMinimumRole: devAwareHasMinimumRole,
    isTeamMember: isDevMode ? true : currentUserRole !== null
  };
}
