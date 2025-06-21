
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { useAdminDemoOperations } from '@/hooks/useAdminDemoOperations';
import { useSimpleDemoRefresh } from '@/hooks/useSimpleDemoRefresh';
import { useAdminDemoSites } from '@/hooks/useAdminDemoSites';
import { useToast } from '@/hooks/use-toast';
import { EnhancedAdminDashboardContent } from '@/components/admin/dashboard/EnhancedAdminDashboardContent';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard: React.FC = () => {
  const { demoSites, loading } = useAdminDemoSites();
  const navigate = useNavigate();

  // Set page title to reflect Demo Factory focus
  React.useEffect(() => {
    document.title = 'Demo Factory - Production Dashboard | ChairLinked';
  }, []);
  const {
    createNewDemo,
    duplicateDemo,
    isLoading
  } = useAdminDemoOperations();
  const { toast } = useToast();

  const { isRefreshing, handleManualRefresh, lastRefresh, connectionStatus } = useSimpleDemoRefresh({
    onRefresh: async () => {} // Make this async to match the expected type
  });

  const editDemo = useCallback((siteId: string) => {
    navigate(`/admin/edit-demo/${siteId}`);
  }, [navigate]);

  const deleteDemo = useCallback(async (siteId: string) => {
    if (!confirm('Are you sure you want to delete this demo?')) return;

    try {
      // Delete logic would go here
      console.log('[ModernAdminDashboard] Demo deleted, list will auto-refresh');
      toast({
        title: "Demo deleted",
        description: "Demo site has been removed successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('[ModernAdminDashboard] Error deleting demo:', error);
      toast({
        title: "Error deleting demo",
        description: "Failed to delete the demo site",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDuplicateDemo = useCallback(async (siteId: string) => {
    await duplicateDemo(siteId);
    console.log('[ModernAdminDashboard] Demo duplicated, list will auto-refresh');
  }, [duplicateDemo]);

  const handleTemplateCreated = useCallback(() => {
    toast({
      title: "Template created successfully!",
      description: "The template has been added to your library and can be used for new sites.",
      duration: 4000
    });
  }, [toast]);

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="max-w-7xl mx-auto space-y-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="col-span-2"><Skeleton className="h-40 rounded-2xl" /></div>
                <div><Skeleton className="h-40 rounded-2xl" /></div>
            </div>
            <Skeleton className="h-96 rounded-3xl" />
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <EnhancedAdminDashboardContent 
        demoSites={demoSites}
        isLoading={isLoading || isRefreshing}
        onCreateDemo={createNewDemo}
        onEditDemo={editDemo}
        onDeleteDemo={deleteDemo}
        onDuplicateDemo={handleDuplicateDemo}
        onTemplateCreated={handleTemplateCreated}
      />
    </ModernAdminLayout>
  );
};

export default AdminDashboard;
