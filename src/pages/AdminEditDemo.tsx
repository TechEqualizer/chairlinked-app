
import React from 'react';
import { useParams } from 'react-router-dom';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { Button } from '@/components/ui/button';
import { DemoEditHeader } from '@/components/admin/demo/DemoEditHeader';
import { DemoBasicInfoCard } from '@/components/admin/demo/DemoBasicInfoCard';
import { DemoProspectInfoCard } from '@/components/admin/demo/DemoProspectInfoCard';
import { DemoDetailsCard } from '@/components/admin/demo/DemoDetailsCard';
import { useDemoEdit } from '@/hooks/useDemoEdit';

const AdminEditDemo: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  
  const {
    demo,
    loading,
    saving,
    businessName,
    setBusinessName,
    prospectName,
    setProspectName,
    prospectEmail,
    setProspectEmail,
    status,
    setStatus,
    handleSave,
    handlePreview,
    handleContinueEditing,
    handleBack
  } = useDemoEdit(siteId);

  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </ModernAdminLayout>
    );
  }

  if (!demo) {
    return (
      <ModernAdminLayout>
        <div className="text-center py-8">
          <p className="text-slate-500">Demo site not found</p>
          <Button onClick={handleBack} className="mt-4">
            Back to Demo Sites
          </Button>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <DemoEditHeader
          onBack={handleBack}
          onPreview={handlePreview}
          onContinueEditing={handleContinueEditing}
          onSave={handleSave}
          saving={saving}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DemoBasicInfoCard
            businessName={businessName}
            setBusinessName={setBusinessName}
            siteSlug={demo.site_slug}
            status={status}
            setStatus={setStatus}
          />

          <DemoProspectInfoCard
            prospectName={prospectName}
            setProspectName={setProspectName}
            prospectEmail={prospectEmail}
            setProspectEmail={setProspectEmail}
            demoExpiresAt={demo.demo_expires_at}
          />
        </div>

        <DemoDetailsCard
          createdAt={demo.created_at}
          updatedAt={demo.updated_at}
          siteType={demo.site_type}
        />
      </div>
    </ModernAdminLayout>
  );
};

export default AdminEditDemo;
