
import React from 'react';
import { ModernAdminStatsCards } from '@/components/admin/ModernAdminStatsCards';
import { EnhancedRecentSites } from '@/components/admin/dashboard/EnhancedRecentSites';
import { SiteManagementPanel } from '@/components/admin/dashboard/SiteManagementPanel';
import { AdminQuickActions } from './AdminQuickActions';
import { AdminSystemOverview } from './AdminSystemOverview';
import { SiteWithLifecycle } from '@/types/siteLifecycle';

interface AdminDashboardContentProps {
  demoSites: SiteWithLifecycle[];
  onCreateDemo: () => void;
  onEditDemo: (siteId: string) => void;
  onViewSite: (site: SiteWithLifecycle) => void;
  onContactProspect: (site: SiteWithLifecycle) => void;
  onDuplicate?: (siteId: string) => void;
  onSaveAsTemplate?: (siteId: string) => void;
}

export const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({
  demoSites,
  onCreateDemo,
  onEditDemo,
  onViewSite,
  onContactProspect,
  onDuplicate,
  onSaveAsTemplate
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Stats Grid */}
      <ModernAdminStatsCards />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Enhanced Recent Sites */}
        <div className="lg:col-span-2 space-y-6">
          <EnhancedRecentSites
            sites={demoSites}
            onEdit={onEditDemo}
            onViewSite={onViewSite}
            onContactProspect={onContactProspect}
            onDuplicate={onDuplicate}
            onSaveAsTemplate={onSaveAsTemplate}
          />
          
          {/* Quick Actions Grid */}
          <AdminQuickActions onCreateDemo={onCreateDemo} />
        </div>

        {/* Right Column - Site Management Panel */}
        <div className="space-y-6">
          <SiteManagementPanel
            sites={demoSites}
            onSiteClick={onEditDemo}
            onContactProspect={onContactProspect}
          />
          
          {/* System Overview */}
          <AdminSystemOverview />
        </div>
      </div>
    </div>
  );
};
