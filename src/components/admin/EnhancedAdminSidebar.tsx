import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  ChevronRight,
  Crown,
  Zap,
  Plus,
  Calendar,
  FileText,
  Bell,
  Star,
  Globe,
  Eye,
  Circle,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { useAdminDemoSites } from "@/hooks/useAdminDemoSites";
import { useResponsive } from "@/hooks/useResponsive";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EnhancedAdminSidebarProps {
  onMobileClose?: () => void;
}

export const EnhancedAdminSidebar: React.FC<EnhancedAdminSidebarProps> = ({ onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, profile } = useAuthContext();
  const { demoSites } = useAdminDemoSites();
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userPreference, setUserPreference] = useState<boolean | null>(null);

  // Smart auto-adjustment based on screen size and user preference
  useEffect(() => {
    // Don't auto-adjust if user has manually set a preference recently
    if (userPreference !== null && isDesktop) {
      setIsCollapsed(userPreference);
      return;
    }

    // Auto-adjust based on screen size
    if (isMobile) {
      // On mobile, collapse state doesn't matter since sidebar is overlay
      setIsCollapsed(false);
    } else if (isTablet || (isDesktop && width < 1280)) {
      // Auto-collapse on tablet and smaller desktop screens
      setIsCollapsed(true);
    } else if (isDesktop && width >= 1280) {
      // Auto-expand on larger desktop screens
      setIsCollapsed(false);
    }

    // Clear user preference after screen size changes
    if (userPreference !== null) {
      const timer = setTimeout(() => setUserPreference(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, isTablet, isDesktop, width, userPreference]);

  // Handle manual toggle with user preference tracking
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    setUserPreference(newCollapsedState);
  };

  const mainMenuItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Templates", url: "/admin/templates", icon: LayoutDashboard },
    { title: "Team", url: "/admin/team", icon: Users },
    { title: "Customers", url: "/admin/customers", icon: UserCheck, badge: "8" },
    { title: "Customer Requests", url: "/admin/customer-requests", icon: MessageSquare, hasNotification: true },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ];

  const quickActions = [
    { name: 'New Demo Site', icon: Plus, action: () => navigate('/admin/demos') },
    { name: 'Analytics Report', icon: FileText, action: () => navigate('/admin/analytics') },
    { name: 'System Alerts', icon: Bell, hasNotification: true, action: () => {} },
  ];

  const getStatusInfo = (site: any) => {
    const statuses = [
      { label: 'Live', color: 'bg-emerald-500', count: 0 },
      { label: 'In Review', color: 'bg-amber-500', count: 0 },
      { label: 'Pending', color: 'bg-blue-500', count: 0 },
      { label: 'Draft', color: 'bg-slate-400', count: 0 }
    ];
    
    // Randomly assign status for demo purposes
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    return randomStatus;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleNavigation = (url: string) => {
    navigate(url);
    // Close mobile menu after navigation
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const CollapsibleNavItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
    const Icon = item.icon;
    
    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleNavigation(item.url)}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-xl transition-colors relative mx-auto',
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white beautiful-shadow'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.hasNotification && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500"></div>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              <span>{item.title}</span>
              {item.badge && (
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-800">
                  {item.badge}
                </span>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <button
        onClick={() => handleNavigation(item.url)}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full relative',
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
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></div>
        )}
      </button>
    );
  };

  return (
    <aside className={cn(
      "bg-white border-slate-200 overflow-hidden h-screen flex flex-col",
      // Mobile: full width, Desktop: responsive width with border radius and shadow
      "w-80 lg:rounded-2xl lg:beautiful-shadow lg:m-6 lg:h-[calc(100vh-3rem)]",
      // Smooth transitions for width changes
      "transition-all duration-300 ease-in-out",
      // Collapsed state only applies on desktop/tablet
      !isMobile && isCollapsed && "lg:w-20"
    )}>
      {/* Header with Toggle */}
      <div className="flex items-center justify-between border-slate-100 border-b p-4 lg:p-5">
        {!isCollapsed ? (
          <>
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
            <div className="flex items-center gap-2">
              {/* Only show collapse button on tablet and desktop */}
              {!isMobile && (
                <button
                  onClick={handleToggleCollapse}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose className="w-4 h-4 text-slate-600" />
                </button>
              )}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold beautiful-shadow">
                  {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'A'}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Only show expand button on tablet and desktop */}
            {!isMobile && (
              <button
                onClick={handleToggleCollapse}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
                title="Expand sidebar"
              >
                <PanelLeftOpen className="w-5 h-5 text-slate-600" />
              </button>
            )}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold beautiful-shadow">
                {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'A'}
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
            </div>
          </div>
        )}
      </div>

      {/* Workspace Dropdown */}
      {isWorkspaceOpen && !isCollapsed && (
        <div className="mx-5 mt-2 rounded-xl bg-gradient-to-br from-slate-50 to-purple-50 beautiful-shadow border border-slate-200 p-5 text-sm">
          <div className="mb-4 pb-4 border-b border-slate-200">
            <p className="font-semibold text-slate-800">{profile?.full_name || 'Admin User'}</p>
            <p className="text-slate-500 text-xs mt-1">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-xs text-slate-600">Admin Active</span>
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

      {/* Main Navigation */}
      <nav className="flex-1 select-none text-sm pt-6 px-2 overflow-y-auto modern-scrollbar">
        {/* Navigation Menu */}
        <div className={cn("px-2 mb-6", isCollapsed && "px-1")}>
          {!isCollapsed && (
            <div className="flex items-center gap-2 w-full text-slate-500 uppercase text-xs tracking-wider font-semibold mb-3">
              <span>Navigation</span>
            </div>
          )}
          <div className="space-y-1">
            {mainMenuItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <CollapsibleNavItem key={item.title} item={item} isActive={isActive} />
              );
            })}
          </div>
        </div>

        {/* Admin Sites Section - Hidden when collapsed or on mobile */}
        {!isCollapsed && !isMobile && (
          <div className="px-2 mb-6">
            <button 
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              className="flex items-center gap-2 w-full text-slate-500 uppercase text-xs tracking-wider font-semibold mb-3 hover:text-slate-700 transition-colors"
            >
              {isProjectsOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span>Admin Sites</span>
              <span className="ml-auto bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {demoSites?.length || 0}
              </span>
            </button>
            
            {isProjectsOpen && (
              <div className="space-y-2 max-h-64 overflow-y-auto modern-scrollbar">
                {demoSites?.slice(0, 8).map((site) => {
                  const status = getStatusInfo(site);
                  const isActive = location.pathname === `/admin/edit-demo/${site.id}`;
                  
                  return (
                    <div
                      key={site.id}
                      onClick={() => handleNavigation(`/admin/edit-demo/${site.id}`)}
                      className={cn(
                        "group cursor-pointer rounded-xl border transition-all beautiful-shadow-sm hover:shadow-md p-3",
                        isActive 
                          ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200" 
                          : "bg-white border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", status.color)} />
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-6 h-6 rounded-md hover:bg-slate-200 flex items-center justify-center">
                            <Star className="w-3 h-3 text-slate-400" />
                          </button>
                          <button className="w-6 h-6 rounded-md hover:bg-slate-200 flex items-center justify-center">
                            <MoreHorizontal className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-slate-800 text-sm mb-1 truncate">
                        {site.business_name || 'Unnamed Demo'}
                      </h4>
                      
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          <span>Live</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{Math.floor(Math.random() * 1000)}+</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(site.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {demoSites && demoSites.length > 8 && (
                  <button 
                    onClick={() => handleNavigation('/admin/demos')}
                    className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    View all {demoSites.length} sites →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className={cn("px-2 mt-auto pb-6", isCollapsed && !isMobile && "px-1")}>
          {!isCollapsed && !isMobile && (
            <div className="flex items-center gap-2 w-full text-slate-500 uppercase text-xs tracking-wider font-semibold mb-3">
              <span>Quick Actions</span>
              <Plus className="w-4 h-4 ml-auto hover:bg-slate-200 rounded p-0.5 transition-colors cursor-pointer" />
            </div>
          )}
          <div className="space-y-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              
              if (isCollapsed && !isMobile) {
                return (
                  <TooltipProvider key={action.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={action.action}
                          className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors relative mx-auto text-slate-700 hover:bg-slate-100"
                        >
                          <Icon className="w-4 h-4" />
                          {action.hasNotification && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500"></div>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <span>{action.name}</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }

              return (
                <button
                  key={action.name}
                  onClick={action.action}
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
      </nav>
    </aside>
  );
};
