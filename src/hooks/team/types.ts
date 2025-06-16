
export interface TeamMember {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  team_role: 'super_admin' | 'admin' | 'support' | 'developer' | 'marketing' | 'viewer';
  permissions: any; // Changed from Record<string, any> to match Supabase Json type
  invited_by: string | null;
  joined_at: string;
  last_active: string | null;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface TeamInvitation {
  id: string;
  email: string;
  team_role: 'super_admin' | 'admin' | 'support' | 'developer' | 'marketing' | 'viewer';
  invited_by: string;
  invited_at: string;
  expires_at: string;
  status: string;
}

export type TeamRole = 'super_admin' | 'admin' | 'support' | 'developer' | 'marketing' | 'viewer';

export interface TeamPermissions {
  canManageTeam: boolean;
  canViewCustomers: boolean;
  canManageCustomers: boolean;
  canViewAnalytics: boolean;
  canManageSites: boolean;
  canManageTemplates: boolean;
  canViewSettings: boolean;
  canManageSettings: boolean;
}
