import React from "react";
import { EditModeProvider } from "@/components/chairlinked/editing/EditModeContext";
import { Template8LayoutContent } from "./layout/Template8LayoutContent";
import { useEnhancedTemplate8DataPersistence } from "./hooks/useEnhancedTemplate8DataPersistence";

interface Template8LayoutProps {
  businessName?: string;
  onUpdate?: (updates: any) => void;
  onSave?: () => Promise<void>;
  isChairLinkedMode?: boolean;
  isProductionPreview?: boolean;
  initialData?: any;
  siteType?: string;
  readOnly?: boolean;
}

const Template8Layout: React.FC<Template8LayoutProps> = (props) => {
  const { businessName = "Creative Studio", initialData, isProductionPreview = false, siteType = 'demo', readOnly = false } = props;
  const { 
    pageData, 
    editingState, 
    handleUpdate, 
    handleEditingStateUpdate, 
    handleSave, 
    isLoading, 
    isSaving, 
    hasRecoveredSession, 
    isAutoSaving 
  } = useEnhancedTemplate8DataPersistence(businessName, initialData);

  return (
    <EditModeProvider initialEditMode={!isProductionPreview && !readOnly} isProductionPreview={isProductionPreview} readOnly={readOnly}>
      <Template8LayoutContent 
        businessName={businessName}
        onUpdate={props.onUpdate}
        onSave={props.onSave}
        isChairLinkedMode={props.isChairLinkedMode || false}
        isProductionPreview={isProductionPreview}
        siteType={siteType}
        pageData={pageData}
        editingState={editingState}
        handleUpdate={handleUpdate}
        handleEditingStateUpdate={handleEditingStateUpdate}
        handleSave={handleSave}
        isLoading={isLoading}
        isSaving={isSaving}
        isAutoSaving={isAutoSaving}
        hasRecoveredSession={hasRecoveredSession}
      />
    </EditModeProvider>
  );
};

export default Template8Layout;
