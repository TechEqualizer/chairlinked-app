import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { DevicePreviewProvider } from "../editing/contexts/DevicePreviewContext";
import { IndustryThemeProvider } from "../design-system/providers/IndustryThemeProvider";
import { useSectionManager } from "../editing/hooks/useSectionManager";
import FloatingEditButton from "../components/FloatingEditButton";
import EnhancedFullScreenEditingFlow from "../editing/EnhancedFullScreenEditingFlow";
import ChairlinkedBadge from "@/components/common/ChairlinkedBadge";
import { Template8SectionRenderer } from "./Template8SectionRenderer";
import { Template8LoadingState } from "./Template8LoadingState";
import { Template8StatusIndicators } from "./Template8StatusIndicators";
import AdminPreviewBar from "./AdminPreviewBar";

interface Template8LayoutContentProps {
  businessName: string;
  onUpdate?: (updates: any) => void;
  onSave?: () => Promise<void>;
  isChairLinkedMode: boolean;
  isProductionPreview: boolean;
  siteType: string;
  pageData: any;
  editingState: any;
  handleUpdate: any;
  handleEditingStateUpdate: any;
  handleSave: any;
  isLoading: boolean;
  isSaving: boolean;
  isAutoSaving: boolean;
  hasRecoveredSession: boolean;
}

export const Template8LayoutContent: React.FC<Template8LayoutContentProps> = ({
  businessName = "Creative Studio",
  onUpdate: externalOnUpdate,
  onSave: externalOnSave,
  isChairLinkedMode = false,
  isProductionPreview = false,
  siteType = 'demo',
  pageData,
  editingState,
  handleUpdate,
  handleEditingStateUpdate,
  handleSave,
  isLoading,
  isSaving,
  isAutoSaving,
  hasRecoveredSession
}) => {
  const [isEditingMode, setIsEditingMode] = useState(editingState.isEditingMode || false);
  const navigate = useNavigate();
  const { isAdmin } = useAuthContext();
  const { getVisibleSections } = useSectionManager(pageData);

  console.log('[Template8Layout] PageData for industry theming:', {
    industry: pageData.industry,
    brandColor: pageData.brandColor,
    hasIndustryData: !!pageData.industry,
    isProductionPreview,
    sectionConfig: pageData.sectionConfig,
    siteType
  });

  // Use external handlers if provided (ChairLinked mode), otherwise use internal handlers
  const finalOnUpdate = externalOnUpdate || handleUpdate;
  const finalOnSave = externalOnSave || handleSave;

  const handleEditClick = () => {
    console.log('[Template8Layout] Starting enhanced edit mode');
    setIsEditingMode(true);
    handleEditingStateUpdate({ isEditingMode: true });
  };

  const handleCloseEditing = () => {
    console.log('[Template8Layout] Closing enhanced edit mode');
    setIsEditingMode(false);
    handleEditingStateUpdate({ isEditingMode: false });
  };

  const handleNavigateToAdmin = () => {
    console.log('[Template8Layout] Navigating to admin dashboard');
    navigate('/admin');
  };

  // Show loading state while data is being loaded
  if (isLoading && !isChairLinkedMode) {
    return <Template8LoadingState hasRecoveredSession={hasRecoveredSession} />;
  }

  // Only show floating badge for demo sites, not live sites
  const shouldShowFloatingBadge = siteType === 'demo';

  // Show admin preview bar for admin in preview mode (not editing)
  const showAdminBar =
    isProductionPreview &&
    isAdmin &&
    !isEditingMode;

  // Try to get demoId if available from pageData
  const demoId =
    (pageData && (pageData.id || pageData._demoId)) || undefined;

  return (
    <DevicePreviewProvider>
      <IndustryThemeProvider 
        industry={pageData.industry || 'hair_stylist'} 
        brandColor={pageData.brandColor}
      >
        <div className="min-h-screen bg-gray-50">
          {/* Admin Preview Bar: Only for admins in preview mode and not editing */}
          {showAdminBar && (
            <AdminPreviewBar
              demoId={demoId}
              onStartEditing={handleEditClick}
            />
          )}

          {/* Powered by Chairlinked Badge - Only show on demo sites and when not editing */}
          {!isEditingMode && shouldShowFloatingBadge && (
            <ChairlinkedBadge 
              variant="floating" 
              theme="auto" 
              showBadge={shouldShowFloatingBadge}
            />
          )}

          {/* Floating Edit Button - hide completely in production preview mode */}
          {!isEditingMode && !isChairLinkedMode && !isProductionPreview && (
            <FloatingEditButton onClick={handleEditClick} />
          )}

          {/* Enhanced Full Screen Editing Flow - disable in production preview */}
          {isEditingMode && !isProductionPreview && (
            <EnhancedFullScreenEditingFlow
              pageData={pageData}
              onUpdate={finalOnUpdate}
              onSave={finalOnSave}
              onClose={handleCloseEditing}
              isAdmin={isAdmin}
              onNavigateToAdmin={handleNavigateToAdmin}
            />
          )}

          {/* Main Template Content - always show when not in editing mode */}
          {!isEditingMode && (
            <Template8SectionRenderer
              pageData={pageData}
              onUpdate={finalOnUpdate}
              isProductionPreview={isProductionPreview}
              siteType={siteType}
              visibleSections={getVisibleSections()}
            />
          )}

          {/* Status Indicators */}
          <Template8StatusIndicators
            isSaving={isSaving}
            isAutoSaving={isAutoSaving}
            hasRecoveredSession={hasRecoveredSession}
            isChairLinkedMode={isChairLinkedMode}
            isProductionPreview={isProductionPreview}
          />
        </div>
      </IndustryThemeProvider>
    </DevicePreviewProvider>
  );
};
