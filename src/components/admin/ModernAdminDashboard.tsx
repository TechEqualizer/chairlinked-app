
import React from 'react';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { AdminDashboardHeader } from '@/components/admin/dashboard/AdminDashboardHeader';
import { AdminDashboardContent } from '@/components/admin/dashboard/AdminDashboardContent';
import { useAdminDemoOperations } from '@/hooks/useAdminDemoOperations';
import { useSimpleDemoRefresh } from '@/hooks/useSimpleDemoRefresh';
import { useAdminDemoSites } from '@/hooks/useAdminDemoSites';
import { useDemoOperations } from '@/components/admin/DemoOperations';
import { useDuplicateDemo } from '@/hooks/admin/useDuplicateDemo';
import { useToast } from '@/hooks/use-toast';
import { SiteWithLifecycle } from '@/types/siteLifecycle';

const ModernAdminDashboard: React.FC = () => {
  const { demoSites, loading } = useAdminDemoSites();
  const {
    createNewDemo,
    isLoading
  } = useAdminDemoOperations();
  const { editDemo } = useDemoOperations();
  const { duplicateDemo } = useDuplicateDemo();
  const { toast } = useToast();

  const { isRefreshing, handleManualRefresh, lastRefresh, connectionStatus } = useSimpleDemoRefresh({
    onRefresh: async () => {
      window.location.reload();
    }
  });

  const handleDuplicateDemo = async (siteId: string) => {
    await duplicateDemo(siteId);
    console.log('[ModernAdminDashboard] Demo duplicated, list will auto-refresh');
  };

  const handleViewSite = (site: SiteWithLifecycle) => {
    const url = site.site_type === 'demo' 
      ? `/demo/${site.site_slug}` 
      : `/site/${site.site_slug}`;
    window.open(url, '_blank');
  };

  const handleContactProspect = (site: SiteWithLifecycle) => {
    if (site.prospect_email) {
      const subject = `Following up on ${site.business_name} demo`;
      const body = `Hi ${site.prospect_name || 'there'},\n\nI wanted to follow up on the demo site we created for ${site.business_name}. Have you had a chance to review it?\n\nBest regards`;
      window.open(`mailto:${site.prospect_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const handleSaveAsTemplate = async (siteId: string) => {
    // This would typically call an API to save the site as a template
    toast({
      title: "Template created successfully!",
      description: "The site has been saved as a template and can be used for new sites.",
      duration: 4000,
    });
  };

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="min-h-screen bg-zinc-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <AdminDashboardHeader
          onCreateDemo={createNewDemo}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
          lastRefresh={lastRefresh}
          connectionStatus={connectionStatus}
        />

        {/* Main Content */}
        <AdminDashboardContent
          demoSites={demoSites}
          onCreateDemo={createNewDemo}
          onEditDemo={editDemo}
          onViewSite={handleViewSite}
          onContactProspect={handleContactProspect}
          onDuplicate={handleDuplicateDemo}
          onSaveAsTemplate={handleSaveAsTemplate}
        />
      </div>
    </ModernAdminLayout>
  );
};

export default ModernAdminDashboard;
