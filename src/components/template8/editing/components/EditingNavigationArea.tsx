
import React, { useState } from "react";
import ProfessionalSectionNavigator from "./ProfessionalSectionNavigator";
import ModernFloatingToolbar from "./ModernFloatingToolbar";
import ModernCommandPalette from "./ModernCommandPalette";
import ProfessionalEditSidebar from "./ProfessionalEditSidebar";
import { AdminEditingControls } from "./AdminEditingControls";

interface EditingNavigationAreaProps {
  isNavigationHidden: boolean;
  showCompactMenu: boolean;
  setShowCompactMenu: (v: boolean) => void;
  currentSectionIndex: number;
  editingSections: any[];
  handleSectionNavigate: (sectionIndex: number) => void;
  handleEnhancedSave: () => Promise<void>;
  handleCloseEditing: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  isSaving: boolean;
  onNavigateToDashboard: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isAdmin: boolean;
  sectionData: any;
  onNavigateToAdmin?: () => void;
  onSaveAsDemo?: () => Promise<void>;
  isSavingDemo?: boolean;
}

const EditingNavigationArea: React.FC<EditingNavigationAreaProps> = ({
  currentSectionIndex,
  editingSections,
  handleSectionNavigate,
  handleEnhancedSave,
  handleCloseEditing,
  handlePrevious,
  handleNext,
  isSaving,
  canGoPrevious,
  canGoNext,
  isAdmin,
  sectionData,
  onNavigateToAdmin,
  onSaveAsDemo,
  isSavingDemo
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
      {/* Professional Section Navigator */}
      <ProfessionalSectionNavigator
        currentSectionIndex={currentSectionIndex}
        onSectionClick={handleSectionNavigate}
      />

      {/* Modern Floating Toolbar */}
      <ModernFloatingToolbar
        onSave={handleEnhancedSave}
        onUndo={handlePrevious}
        onRedo={handleNext}
        onPreview={handleCloseEditing}
        onSettings={() => setShowEditSidebar(true)}
        onCommandPalette={() => setShowCommandPalette(true)}
        isSaving={isSaving}
        canUndo={canGoPrevious}
        canRedo={canGoNext}
        brandColor={sectionData?.brandColor}
      />

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
          onSaveSuccessNavigate={onNavigateToAdmin}
          onSaveAsDemo={onSaveAsDemo}
          isSavingDemo={isSavingDemo}
        />
      </ProfessionalEditSidebar>
    </>
  );
};

export default EditingNavigationArea;
