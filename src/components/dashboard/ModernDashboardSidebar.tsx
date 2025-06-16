
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  HelpCircle,
  LogOut,
  ChevronDown,
  Star,
  Bell,
  Calendar,
  FilePlus,
  Zap,
  Users,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthActions } from '@/hooks/auth/useAuthActions';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Requests',
    href: '/dashboard/requests',
    icon: MessageSquare,
    badge: '3'
  },
  {
    name: 'Subscription',
    href: '/dashboard/subscription',
    icon: CreditCard,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    name: 'Help',
    href: '/dashboard/help',
    icon: HelpCircle,
  },
];

const quickActions = [
  { name: 'Schedule Call', icon: Calendar },
  { name: 'New Request', icon: FilePlus },
  { name: 'Notifications', icon: Bell, hasNotification: true },
];

export const ModernDashboardSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuthActions();
  const { profile } = useAuthContext();
  const { toast } = useToast();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const handleLogout = async () => {
    console.log('Attempting to log out...');
    const { error } = await signOut();
    
    if (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    } else {
      console.log('Logout successful');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      window.location.href = '/';
    }
  };

  return (
    <aside className="w-80 bg-white border-slate-200 rounded-2xl beautiful-shadow overflow-hidden h-screen flex flex-col">
      {/* Workspace Header */}
      <div className="flex items-center justify-between border-slate-100 border-b p-5">
        <button 
          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          className="flex items-center gap-2 beautiful-shadow hover:shadow-md transition-all text-sm font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 border rounded-xl py-2.5 px-4"
        >
          <Zap className="w-4 h-4 text-indigo-600" />
          <span className="text-slate-800">ChairLinked</span>
          <ChevronDown className={cn(
            "w-4 h-4 text-slate-500 transition-transform",
            isWorkspaceOpen && "rotate-180"
          )} />
        </button>
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold beautiful-shadow">
            {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
        </div>
      </div>

      {/* Workspace Dropdown */}
      {isWorkspaceOpen && (
        <div className="mx-5 mt-2 rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50 beautiful-shadow border border-slate-200 p-5 text-sm">
          <div className="mb-4 pb-4 border-b border-slate-200">
            <p className="font-semibold text-slate-800">{profile?.full_name || 'User'}</p>
            <p className="text-slate-500 text-xs mt-1">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-xs text-slate-600">Online</span>
            </div>
          </div>
          <button className="flex items-center gap-3 w-full py-2.5 px-2 rounded-lg hover:bg-white/60 transition-colors">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="font-medium">ChairLinked</span>
            <Star className="w-4 h-4 ml-auto text-emerald-600 fill-current" />
          </button>
          <hr className="my-4 border-slate-200" />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-2.5 px-2 rounded-lg hover:bg-white/60 transition-colors text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 select-none text-sm pt-6 px-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-colors mb-1',
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white beautiful-shadow'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className={cn('font-medium', isActive && 'text-white')}>{item.name}</span>
              {item.badge && (
                <span className={cn(
                  'ml-auto text-xs px-2 py-1 rounded-full font-medium',
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-indigo-100 text-indigo-800'
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Quick Actions */}
        <div className="px-4 mt-6 pb-6">
          <div className="flex items-center gap-2 w-full text-slate-500 uppercase text-xs tracking-wider font-semibold mb-3">
            <span>Quick Actions</span>
            <Plus className="w-4 h-4 ml-auto hover:bg-slate-200 rounded p-0.5 transition-colors cursor-pointer" />
          </div>
          <div className="space-y-1">
            {quickActions.map((action) => {
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
      </nav>
    </aside>
  );
};
