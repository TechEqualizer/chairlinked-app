import React from 'react';
import { ModernAdminStatsCards } from '@/components/admin/ModernAdminStatsCards';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardSystemOverview } from './DashboardSystemOverview';
import { DemoSitesTableContainer } from '@/components/admin/demo-table/DemoSitesTableContainer';

interface EnhancedAdminDashboardContentProps {
  demoSites: any[];
  isLoading: boolean;
  onCreateDemo: () => void;
  onEditDemo: (siteId: string) => void;
  onDeleteDemo: (siteId: string) => void;
  onDuplicateDemo: (siteId: string) => void;
  onTemplateCreated: () => void;
}

export const EnhancedAdminDashboardContent: React.FC<EnhancedAdminDashboardContentProps> = ({
  demoSites,
  isLoading,
  onCreateDemo,
  onEditDemo,
  onDeleteDemo,
  onDuplicateDemo,
  onTemplateCreated,
}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto pb-4 lg:pb-8 space-y-4 lg:space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <ModernAdminStatsCards />
      </div>
      {/* Actions + Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <DashboardQuickActions
            onCreateDemo={onCreateDemo}
            onManageCustomers={() => navigate('/admin/customers')}
            onAnalytics={() => navigate('/admin/analytics')}
            onTeam={() => navigate('/admin/team')}
          />
        </div>
        <div className="order-first lg:order-last">
          <DashboardSystemOverview />
        </div>
      </div>
      {/* Recent Demo Sites - Modern Card */}
      <div className="rounded-2xl lg:rounded-3xl bg-white p-4 lg:p-8 border border-zinc-100 mt-1 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 lg:mb-6 gap-3 sm:gap-0">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Recent Demo Sites</h2>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/demos')}
            className="rounded-xl px-4 lg:px-6 font-medium shadow-none border-zinc-200 hover:bg-zinc-50 text-sm lg:text-base w-full sm:w-auto"
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <DemoSitesTableContainer
            demoSites={demoSites.slice(0, 5)}
            onEdit={onEditDemo}
            onDelete={onDeleteDemo}
            onDuplicate={onDuplicateDemo}
            isLoading={isLoading}
            onTemplateCreated={onTemplateCreated}
          />
        </div>
      </div>
    </div>
  );
};
