
import React from 'react';
import { CustomerPreviewPane } from './CustomerPreviewPane';
import { EditorToolbar } from './EditorToolbar';
import { EditorSidebar } from './EditorSidebar';

interface CustomerEditorLayoutProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  editorData: any;
  onUpdate: (updates: any) => void;
  siteSlug: string;
  siteType: string;
  displayBusinessName: string;
  status: 'published' | 'draft' | string;
  hasChanges: boolean;
  onRevert: () => void;
  isSaving: boolean;
  onSave: () => void;
  isPublishing: boolean;
  onPublish: () => void;
}

export const CustomerEditorLayout: React.FC<CustomerEditorLayoutProps> = ({
  activeTab,
  onTabChange,
  editorData,
  onUpdate,
  siteSlug,
  siteType,
  displayBusinessName,
  status,
  hasChanges,
  onRevert,
  isSaving,
  onSave,
  isPublishing,
  onPublish
}) => {
  console.log('[CustomerEditorLayout] Rendering new layout with data:', {
    hasEditorData: !!editorData,
    activeTab,
    siteSlug,
    siteType
  });

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <EditorToolbar
        displayBusinessName={displayBusinessName}
        status={status}
        siteType={siteType}
        hasChanges={hasChanges}
        onRevert={onRevert}
        isSaving={isSaving}
        onSave={onSave}
        isPublishing={isPublishing}
        onPublish={onPublish}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel (Left) */}
        <EditorSidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          editorData={editorData}
          onUpdate={onUpdate}
        />
        
        {/* Preview Panel (Right) */}
        <main className="flex-1 bg-gray-100 relative">
          <CustomerPreviewPane
            data={editorData}
            siteSlug={siteSlug}
            siteType={siteType}
            businessName={displayBusinessName}
          />
        </main>
      </div>
    </div>
  );
};
