
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  BarChart, 
  Edit,
  LogOut,
  UserCheck,
  MessageSquare,
  ChevronDown,
  Crown,
  Zap,
  Plus,
  Calendar,
  FileText,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useTeamPermissions } from "@/hooks/useTeamPermissions";

export const ModernAdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, profile } = useAuthContext();
  const { permissions, currentUserRole, loading: permissionsLoading } = useTeamPermissions();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const menuItems = [
    { 
      title: "Dashboard", 
      url: "/admin", 
      icon: LayoutDashboard,
      permission: null // Always visible
    },
    { 
      title: "Sites", 
      url: "/admin/demos", 
      icon: Edit, 
      badge: "12",
      permission: 'canManageSites' as keyof typeof permissions
    },
    { 
      title: "Templates", 
      url: "/admin/templates", 
      icon: LayoutDashboard,
      permission: 'canManageTemplates' as keyof typeof permissions
    },
    { 
      title: "Team", 
      url: "/admin/team", 
      icon: Users,
      permission: 'canManageTeam' as keyof typeof permissions
    },
    { 
      title: "Customers", 
      url: "/admin/customers", 
      icon: UserCheck, 
      badge: "8",
      permission: 'canViewCustomers' as keyof typeof permissions
    },
    { 
      title: "Customer Requests", 
      url: "/admin/customer-requests", 
      icon: MessageSquare, 
      hasNotification: true,
      permission: 'canViewCustomers' as keyof typeof permissions
    },
    { 
      title: "Analytics", 
      url: "/admin/analytics", 
      icon: BarChart,
      permission: 'canViewAnalytics' as keyof typeof permissions
    },
    { 
      title: "Settings", 
      url: "/admin/settings", 
      icon: Settings,
      permission: 'canViewSettings' as keyof typeof permissions
    },
  ];

  const quickActions = [
    { name: 'Create Demo', icon: Plus, permission: 'canManageSites' as keyof typeof permissions },
    { name: 'Analytics Report', icon: FileText, permission: 'canViewAnalytics' as keyof typeof permissions },
    { name: 'System Alerts', icon: Bell, hasNotification: true, permission: 'canViewSettings' as keyof typeof permissions },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleDisplayName = (role: string | null) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Administrator';
      case 'support': return 'Support';
      case 'developer': return 'Developer';
      case 'marketing': return 'Marketing';
      case 'viewer': return 'Viewer';
      default: return 'Team Member';
    }
  };

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'super_admin': return 'text-yellow-600';
      case 'admin': return 'text-purple-600';
      case 'support': return 'text-blue-600';
      case 'developer': return 'text-green-600';
      case 'marketing': return 'text-orange-600';
      default: return 'text-slate-600';
    }
  };

  // Filter menu items based on permissions
  const visibleMenuItems = menuItems.filter(item => {
    if (!item.permission) return true; // Always visible items
    if (permissionsLoading) return false; // Hide while loading permissions
    return permissions[item.permission];
  });

  // Filter quick actions based on permissions
  const visibleQuickActions = quickActions.filter(action => {
    if (permissionsLoading) return false;
    return permissions[action.permission];
  });

  if (permissionsLoading) {
    return (
      <aside className="w-80 bg-white border-slate-200 rounded-2xl beautiful-shadow overflow-hidden h-screen flex flex-col">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-white border-slate-200 rounded-2xl beautiful-shadow overflow-hidden h-screen flex flex-col">
      {/* Admin Workspace Header */}
      <div className="flex items-center justify-between border-slate-100 border-b p-5">
        <button 
          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          className="flex items-center gap-2 beautiful-shadow hover:shadow-md transition-all text-sm font-semibold bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 border rounded-xl py-2.5 px-4"
        >
          <Crown className="w-4 h-4 text-purple-600" />
          <span className="text-slate-800">ChairLinked Admin</span>
          <ChevronDown className={cn(
            "w-4 h-4 text-slate-500 transition-transform",
            isWorkspaceOpen && "rotate-180"
          )} />
        </button>
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold beautiful-shadow">
            {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'A'}
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
        </div>
      </div>

      {/* Admin Workspace Dropdown */}
      {isWorkspaceOpen && (
        <div className="mx-5 mt-2 rounded-xl bg-gradient-to-br from-slate-50 to-purple-50 beautiful-shadow border border-slate-200 p-5 text-sm">
          <div className="mb-4 pb-4 border-b border-slate-200">
            <p className="font-semibold text-slate-800">{profile?.full_name || 'Admin User'}</p>
            <p className="text-slate-500 text-xs mt-1">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className={`text-xs font-medium ${getRoleColor(currentUserRole)}`}>
                {getRoleDisplayName(currentUserRole)}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-3 w-full py-2.5 px-2 rounded-lg hover:bg-white/60 transition-colors">
            <Crown className="w-4 h-4 text-purple-600" />
            <span className="font-medium">Admin Dashboard</span>
            <Zap className="w-4 h-4 ml-auto text-purple-600 fill-current" />
          </button>
          <hr className="my-4 border-slate-200" />
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full py-2.5 px-2 rounded-lg hover:bg-white/60 transition-colors text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 select-none text-sm pt-6 px-2 overflow-y-auto">
        {visibleMenuItems.map((item) => {
          const isActive = location.pathname === item.url;
          const Icon = item.icon;
          
          return (
            <button
              key={item.title}
              onClick={() => navigate(item.url)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-colors mb-1 w-full',
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white beautiful-shadow'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className={cn('font-medium', isActive && 'text-white')}>{item.title}</span>
              {item.badge && (
                <span className={cn(
                  'ml-auto text-xs px-2 py-1 rounded-full font-medium',
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-purple-100 text-purple-800'
                )}>
                  {item.badge}
                </span>
              )}
              {item.hasNotification && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></div>
              )}
            </button>
          );
        })}

        {/* Quick Actions */}
        {visibleQuickActions.length > 0 && (
          <div className="px-4 mt-6 pb-6">
            <div className="flex items-center gap-2 w-full text-slate-500 uppercase text-xs tracking-wider font-semibold mb-3">
              <span>Admin Tools</span>
              <Plus className="w-4 h-4 ml-auto hover:bg-slate-200 rounded p-0.5 transition-colors cursor-pointer" />
            </div>
            <div className="space-y-1">
              {visibleQuickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-700 hover:bg-slate-100 rounded-xl transition-colors relative"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{action.name}</span>
                    {action.hasNotification && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};
