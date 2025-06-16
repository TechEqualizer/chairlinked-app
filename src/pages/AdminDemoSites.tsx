
import React, { useState } from 'react';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { AdminSitesView } from '@/components/admin/sites/AdminSitesView';
import DemoCleanupSection from '@/components/admin/DemoCleanupSection';
import { useEnhancedDemoOperations } from '@/hooks/admin/useEnhancedDemoOperations';
import { useSimpleDemoRefresh } from '@/hooks/useSimpleDemoRefresh';
import { useAdminDemoSites } from '@/hooks/useAdminDemoSites';
import { useDemoOperations } from '@/components/admin/DemoOperations';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Wrench } from 'lucide-react';

const AdminDemoSites: React.FC = () => {
  const [showCleanupSection, setShowCleanupSection] = useState(false);
  const { toast } = useToast();

  // Custom hooks for data and operations
  const { allSites, loading, loadSites } = useAdminDemoSites();
  const { 
    createNewDemo, 
    publishSite,
    convertToLive,
    selectedExpiration,
    setSelectedExpiration,
    isLoading 
  } = useEnhancedDemoOperations();
  const { editDemo, deleteDemo } = useDemoOperations();

  // Use the simplified refresh hook
  const { isRefreshing, handleManualRefresh } = useSimpleDemoRefresh({
    onRefresh: loadSites
  });

  const handlePublishSite = async (siteId: string) => {
    console.log('AdminDemoSites: Publishing site:', siteId);
    const result = await publishSite(siteId);
    
    if (result?.success) {
      console.log('Admin DemoSites: Site published successfully, triggering refresh');
      await loadSites();
    }
  };

  const handleConvertToLive = async (siteId: string) => {
    console.log('AdminDemoSites: Converting demo to live site:', siteId);
    const result = await convertToLive(siteId);
    
    if (result?.success) {
      console.log('AdminDemoSites: Site converted successfully, triggering refresh');
      await loadSites();
    }
  };

  const handleTemplateCreated = () => {
    toast({
      title: "Template created successfully!",
      description: "The template has been added to your library and can be used for new sites.",
      duration: 4000,
    });
  };

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Quick Admin Tools */}
        <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Settings className="w-5 h-5 text-purple-600" />
                Admin Tools
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCleanupSection(!showCleanupSection)}
                className="rounded-xl"
              >
                <Wrench className="w-4 h-4 mr-2" />
                {showCleanupSection ? 'Hide' : 'Show'} Cleanup Tools
              </Button>
            </div>
          </CardHeader>
          
          {showCleanupSection && (
            <CardContent className="p-6">
              <DemoCleanupSection onRefresh={loadSites} />
            </CardContent>
          )}
        </Card>

        {/* Main Sites Management Interface */}
        <AdminSitesView
          sites={allSites}
          onCreateDemo={createNewDemo}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
          onEdit={editDemo}
          onDelete={deleteDemo}
          onPublish={handlePublishSite}
          onConvertToLive={handleConvertToLive}
          onTemplateCreated={handleTemplateCreated}
        />
      </div>
    </ModernAdminLayout>
  );
};

export default AdminDemoSites;
