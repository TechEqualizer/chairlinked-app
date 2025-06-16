
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Plus } from 'lucide-react';
import { ManualRefreshButton } from '@/components/admin/ManualRefreshButton';

interface AdminDashboardHeaderProps {
  onCreateDemo: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastRefresh: Date | null;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  onCreateDemo,
  onRefresh,
  isRefreshing,
  lastRefresh,
  connectionStatus
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        </div>
        <p className="text-slate-600 text-lg">
          Welcome back! Here's what's happening with your ChairLinked platform.
        </p>
      </div>
      <div className="flex gap-3">
        <ManualRefreshButton 
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          lastRefresh={lastRefresh}
          connectionStatus={connectionStatus}
        />
        <Button onClick={onCreateDemo} className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl beautiful-shadow">
          <Plus className="w-4 h-4 mr-2" />
          New Demo Site
        </Button>
      </div>
    </div>
  );
};
