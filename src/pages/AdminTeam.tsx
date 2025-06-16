
import React, { useState } from 'react';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Trash2, Shield, User, UserPlus, Crown, Code, Headphones, TrendingUp, Eye } from 'lucide-react';
import { TeamInviteModal } from '@/components/admin/TeamInviteModal';
import { useTeamManagement, TeamMember } from '@/hooks/team';
import { useTeamPermissions } from '@/hooks/useTeamPermissions';
import { TeamRole } from '@/hooks/team/types';

const AdminTeam: React.FC = () => {
  const { hasPermission, currentUserRole } = useTeamPermissions();
  const {
    teamMembers,
    loading,
    updateMemberRole,
    updateMemberStatus,
    addTeamMember,
    deleteMember
  } = useTeamManagement();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const formatLastActive = (lastActive: string | null) => {
    if (!lastActive) return 'Never';
    
    const date = new Date(lastActive);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleRoleChange = async (userId: string, newRole: TeamRole) => {
    const currentUser = teamMembers.find(m => m.user_id === userId);
    if (!currentUser) return;

    if (userId === currentUser.user_id && currentUserRole === 'super_admin' && newRole !== 'super_admin') {
      alert("You cannot demote yourself from super admin");
      return;
    }
    await updateMemberRole(userId, newRole);
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    const currentUser = teamMembers.find(m => m.user_id === userId);
    if (!currentUser) return;

    if (currentUser.team_role === 'super_admin' && newStatus === 'inactive') {
      alert("Cannot deactivate super admin");
      return;
    }
    await updateMemberStatus(userId, newStatus);
  };

  const handleDeleteMember = async (userId: string, email: string) => {
    const memberToDelete = teamMembers.find(m => m.user_id === userId);
    if (!memberToDelete) return;

    if (memberToDelete.team_role === 'super_admin') {
      alert("Cannot delete super admin");
      return;
    }
    
    if (confirm(`Are you sure you want to remove ${email} from the team? This action cannot be undone.`)) {
      await deleteMember(userId);
    }
  };

  const handleAddMember = async (email: string, role: TeamRole) => {
    await addTeamMember(email, role);
    setInviteModalOpen(false);
  };

  const getRoleIcon = (role: TeamRole) => {
    switch (role) {
      case 'super_admin': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'admin': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'support': return <Headphones className="w-4 h-4 text-blue-600" />;
      case 'developer': return <Code className="w-4 h-4 text-green-600" />;
      case 'marketing': return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'viewer': return <Eye className="w-4 h-4 text-gray-500" />;
      default: return <User className="w-4 h-4 text-slate-400" />;
    }
  };

  const getRoleColor = (role: TeamRole) => {
    switch (role) {
      case 'super_admin': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'admin': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'support': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'developer': return 'text-green-600 bg-green-50 border-green-200';
      case 'marketing': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'viewer': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  if (!hasPermission('canManageTeam')) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">You don't have permission to access team management</p>
          </div>
        </div>
      </ModernAdminLayout>
    );
  }

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading team members...</p>
          </div>
        </div>
      </ModernAdminLayout>
    );
  }

  const activeMembers = teamMembers.filter(m => m.status === 'active');
  const adminMembers = teamMembers.filter(m => ['super_admin', 'admin'].includes(m.team_role));

  return (
    <ModernAdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
              <p className="text-slate-600 text-lg">Manage internal team members and their permissions</p>
            </div>
          </div>
          <Button onClick={() => setInviteModalOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Team Member
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Team Members</p>
                  <p className="text-2xl font-semibold text-slate-900">{teamMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Active Members</p>
                  <p className="text-2xl font-semibold text-slate-900">{activeMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Administrators</p>
                  <p className="text-2xl font-semibold text-slate-900">{adminMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
            <CardTitle className="text-xl text-slate-900">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No team members found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(member.team_role)}
                          {member.full_name || member.email.split('@')[0]}
                        </div>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Select
                          value={member.team_role}
                          onValueChange={(value: TeamRole) => handleRoleChange(member.user_id, value)}
                          disabled={member.team_role === 'super_admin' && member.team_role !== currentUserRole}
                        >
                          <SelectTrigger className={`w-32 text-xs font-medium border ${getRoleColor(member.team_role)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            {currentUserRole === 'super_admin' && (
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={member.status}
                          onValueChange={(value: 'active' | 'inactive') => handleStatusChange(member.user_id, value)}
                          disabled={member.team_role === 'super_admin'}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {formatLastActive(member.last_active)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteMember(member.user_id, member.email)}
                            disabled={member.team_role === 'super_admin'}
                            className="text-red-600 hover:text-red-700 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <TeamInviteModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          onInvite={handleAddMember}
        />
      </div>
    </ModernAdminLayout>
  );
};

export default AdminTeam;
