
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  HelpCircle,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthActions } from '@/hooks/auth/useAuthActions';
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
  },
  {
    name: 'Manage Subscription',
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

export const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuthActions();
  const { toast } = useToast();

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
      // Redirect will be handled by the auth context
      window.location.href = '/';
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Company Name */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">ChairLinked</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="px-4 pb-6">
        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-gray-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
