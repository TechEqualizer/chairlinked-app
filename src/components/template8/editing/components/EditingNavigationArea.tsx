
import React, { useState } from "react";
import ProfessionalSectionNavigator from "./ProfessionalSectionNavigator";
import ModernFloatingToolbar from "./ModernFloatingToolbar";
import ModernCommandPalette from "./ModernCommandPalette";
import ProfessionalEditSidebar from "./ProfessionalEditSidebar";
import { AdminEditingControls } from "./AdminEditingControls";
import AutoHideNavigation from "./AutoHideNavigation";
import type { AutoSaveState } from '../hooks/useUnifiedAutoSave';

interface EditingNavigationAreaProps {
  isNavigationHidden: boolean;
  showCompactMenu: boolean;
  setShowCompactMenu: (v: boolean) => void;
  currentSectionIndex: number;
  editingSections: any[];
  handleSectionNavigate: (sectionIndex: number) => void;
  handleEnhancedSave: () => Promise<void>;
  handleCloseEditing: () => void;
  handlePreview: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  onQuickEdit?: () => void;
  onAIChat?: () => void;
  isSaving: boolean;
  onNavigateToDashboard: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isAdmin: boolean;
  sectionData: any;
  onNavigateToAdmin?: () => void;
  onSaveAsDemo?: () => Promise<void>;
  isSavingDemo?: boolean;
  // Enhanced auto-save props
  autoSaveState?: AutoSaveState;
  onPauseAutoSave?: () => void;
  onResumeAutoSave?: () => void;
  isAutoSavePaused?: boolean;
  // Enhanced undo/redo props
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onSaveSuccessNavigate?: () => void;
}

const EditingNavigationArea: React.FC<EditingNavigationAreaProps> = ({
  currentSectionIndex,
  editingSections,
  handleSectionNavigate,
  handleEnhancedSave,
  handleCloseEditing,
  handlePreview,
  handlePrevious,
  handleNext,
  onQuickEdit,
  onAIChat,
  isSaving,
  canGoPrevious,
  canGoNext,
  isAdmin,
  sectionData,
  onNavigateToAdmin,
  onSaveAsDemo,
  isSavingDemo,
  autoSaveState,
  onPauseAutoSave,
  onResumeAutoSave,
  isAutoSavePaused,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSaveSuccessNavigate
}) => {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);

  const currentSection = editingSections[currentSectionIndex];

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleEnhancedSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setShowEditSidebar(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleEnhancedSave]);

  return (
    <>
      {/* Auto-Hide Bottom Toolbar */}
      <AutoHideNavigation position="bottom" hideDelay={4000}>
        <ModernFloatingToolbar
          onSave={handleEnhancedSave}
          onUndo={onUndo || (() => {})}
          onRedo={onRedo || (() => {})}
          onPreview={handlePreview}
          onSettings={() => setShowEditSidebar(true)}
          onCommandPalette={() => setShowCommandPalette(true)}
          onQuickEdit={onQuickEdit}
          onAIChat={onAIChat}
          isSaving={isSaving}
          canUndo={canUndo || false}
          canRedo={canRedo || false}
          brandColor={sectionData?.brandColor}
          autoSaveState={autoSaveState}
          onPauseAutoSave={onPauseAutoSave}
          onResumeAutoSave={onResumeAutoSave}
          isAutoSavePaused={isAutoSavePaused}
        />
      </AutoHideNavigation>

      {/* Command Palette */}
      <ModernCommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigateToSection={handleSectionNavigate}
        currentSectionIndex={currentSectionIndex}
      />

      {/* Professional Edit Sidebar */}
      <ProfessionalEditSidebar
        isOpen={showEditSidebar}
        onClose={() => setShowEditSidebar(false)}
        currentSection={currentSection.name}
      >
        <AdminEditingControls
          isAdmin={isAdmin}
          onSave={handleEnhancedSave}
          pageData={sectionData}
          isAutoSaving={isSaving}
          onSaveSuccessNavigate={onSaveSuccessNavigate || onNavigateToAdmin}
          onSaveAsDemo={onSaveAsDemo}
          isSavingDemo={isSavingDemo}
        />
      </ProfessionalEditSidebar>
    </>
  );
};

export default EditingNavigationArea;
