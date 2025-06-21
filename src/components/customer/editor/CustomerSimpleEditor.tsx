
import React, { useEffect, useState } from 'react';
import { useOptimizedClaimedSite } from '@/hooks/useOptimizedClaimedSite';
import { useSimpleCustomerEditor } from '@/hooks/useSimpleCustomerEditor';
import { ImprovedEditorLoading } from './states/ImprovedEditorLoading';
import { EditorErrorBoundary } from './states/EditorErrorBoundary';
import { NoSiteFound } from './states/NoSiteFound';
import { EditorHeader } from './EditorHeader';
import { EditorFormPanel } from './EditorFormPanel';
import { EditorPreviewPanel } from './EditorPreviewPanel';

export const CustomerSimpleEditor: React.FC = () => {
  const { claimedSite, loading: claimedSiteLoading, error: claimedSiteError, refreshClaimedSite } = useOptimizedClaimedSite();
  const {
    data,
    loading: editorLoading,
    saving,
    hasChanges,
    saveError,
    lastSaveTime,
    updateField,
    publishSite,
    saveData
  } = useSimpleCustomerEditor(claimedSite);

  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [criticalError, setCriticalError] = useState<Error | null>(null);

  console.log('[CustomerSimpleEditor] State:', {
    claimedSiteLoading,
    claimedSiteError,
    claimedSite: claimedSite?.id,
    editorLoading,
    saving,
    hasChanges,
    data
  });

  // Set up loading timeout - reduced to 10 seconds for better UX
  useEffect(() => {
    if (claimedSiteLoading || editorLoading) {
      const timer = setTimeout(() => {
        console.warn('[CustomerSimpleEditor] Loading timeout reached');
        setLoadingTimeout(true);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [claimedSiteLoading, editorLoading]);

  // Error boundary for critical errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[CustomerSimpleEditor] Critical error:', event.error);
      setCriticalError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Handle critical errors
  if (criticalError) {
    return (
      <EditorErrorBoundary
        error={criticalError}
        onRetry={() => {
          setCriticalError(null);
          refreshClaimedSite();
        }}
        onGoHome={() => window.location.href = '/dashboard'}
      />
    );
  }

  // Handle loading timeout
  if (loadingTimeout && (claimedSiteLoading || editorLoading)) {
    return (
      <EditorErrorBoundary
        error={new Error('Loading timeout - The editor is taking too long to load')}
        onRetry={() => {
          setLoadingTimeout(false);
          refreshClaimedSite();
        }}
        onGoHome={() => window.location.href = '/dashboard'}
      />
    );
  }

  // Show error state if there's an error loading the claimed site
  if (claimedSiteError) {
    console.error('[CustomerSimpleEditor] Claimed site error:', claimedSiteError);
    return (
      <EditorErrorBoundary
        error={new Error(claimedSiteError)}
        onRetry={refreshClaimedSite}
        onGoHome={() => window.location.href = '/dashboard'}
      />
    );
  }

  // Show improved loading state only for claimed site loading
  if (claimedSiteLoading) {
    console.log('[CustomerSimpleEditor] Showing loading state for claimed site');
    return <ImprovedEditorLoading claimedSiteLoading={claimedSiteLoading} dataLoading={false} />;
  }

  // Show no site found state
  if (!claimedSite) {
    console.log('[CustomerSimpleEditor] No claimed site found');
    return <NoSiteFound />;
  }

  // Show editor loading state only if we have a claimed site but editor is still loading
  if (editorLoading) {
    console.log('[CustomerSimpleEditor] Showing loading state for editor data');
    return <ImprovedEditorLoading claimedSiteLoading={false} dataLoading={editorLoading} />;
  }

  console.log('[CustomerSimpleEditor] Rendering main editor interface with data:', data);
  
  return (
    <div className="h-screen w-full bg-gray-50">
      <EditorHeader
        businessName={data.businessName}
        siteStatus={claimedSite.status}
        siteType={claimedSite.site_type}
        saving={saving}
        hasChanges={hasChanges}
        claimedSiteLoading={claimedSiteLoading}
        saveError={saveError}
        lastSaveTime={lastSaveTime}
        onSave={saveData}
        onPublish={publishSite}
        onRefresh={refreshClaimedSite}
      />

      {/* Main Content - Side by side layout */}
      <div className="flex h-[calc(100vh-73px)]">
        <EditorFormPanel
          data={data}
          onUpdateField={updateField}
        />
        
        <EditorPreviewPanel
          data={data}
          claimedSite={claimedSite}
        />
      </div>
    </div>
  );
};
