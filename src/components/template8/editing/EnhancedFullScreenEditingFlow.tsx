
import React, { useRef } from "react";
import { editingSections } from "./config/editingSections";
import { useEditingFlow } from "./hooks/useEditingFlow";
import { useEditMode } from "@/components/chairlinked/editing/EditModeContext";
import { useEditingHotkeys } from "./hooks/useEditingHotkeys";
import CompletionScreen from "./components/CompletionScreen";
import EditingFlowLayout from "./components/EditingFlowLayout";
import EditingNavigationArea from "./components/EditingNavigationArea";
import EditingSectionArea from "./components/EditingSectionArea";

interface EnhancedFullScreenEditingFlowProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
  onClose: () => void;
  isAdmin?: boolean;
  onSaveAsDemo?: () => Promise<void>;
  isSavingDemo?: boolean;
  onNavigateToAdmin?: () => void;
}

const EnhancedFullScreenEditingFlow: React.FC<EnhancedFullScreenEditingFlowProps> = ({
  pageData,
  onUpdate,
  onSave,
  onClose,
  isAdmin = false,
  onSaveAsDemo,
  isSavingDemo = false,
  onNavigateToAdmin
}) => {
  const { isEditMode, setIsEditMode } = useEditMode();
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const [isNavigationHidden, setIsNavigationHidden] = React.useState(false);
  const [showCompactMenu, setShowCompactMenu] = React.useState(false);

  React.useEffect(() => {
    setIsEditMode(true);
    return () => setIsEditMode(false);
  }, [setIsEditMode]);

  const {
    currentSectionIndex,
    swipeDirection,
    sectionData,
    isCompleted,
    isEditBarOpen,
    isRegenerating,
    isSaving,
    regenerationHistory,
    lastRegenerationResult,
    handleSectionUpdate,
    handleRegenerate,
    handleStyleRegenerate,
    handleUndo,
    handlePrevious,
    handleToggleSettings,
    setIsCompleted,
    saveChanges,
    jumpToSection
  } = useEditingFlow({
    pageData,
    onUpdate,
    onSave,
    totalSections: editingSections.length
  });

  const currentSection = editingSections[currentSectionIndex];
  const canUndo = regenerationHistory.some(entry =>
    entry.sectionIndex === currentSectionIndex && entry.action === 'regenerate_start'
  );

  // Enhanced save function
  const handleEnhancedSave = async () => {
    if (onUpdate && sectionData) onUpdate(sectionData);
    await saveChanges();
  };

  const handleComplete = async () => {
    await handleEnhancedSave();
    setIsEditMode(false);
    setIsCompleted(false);
    onClose();
  };

  const handleCloseEditing = () => {
    setIsEditMode(false);
    onClose();
  };

  const handleSectionNavigate = async (sectionIndex: number) => {
    setShowCompactMenu(false);
    await jumpToSection(sectionIndex);
  };

  const handleToggleNavigation = () => {
    setIsNavigationHidden(!isNavigationHidden);
    setShowCompactMenu(false);
  };

  const handleNext = () => {
    const nextIndex = Math.min(currentSectionIndex + 1, editingSections.length - 1);
    if (nextIndex !== currentSectionIndex) {
      handleSectionNavigate(nextIndex);
    }
  };

  const handleNavigateToDashboard = () => {
    window.location.href = '/dashboard';
  };

  useEditingHotkeys({
    isNavigationHidden,
    currentSectionIndex,
    sectionsLength: editingSections.length,
    showCompactMenu,
    setShowCompactMenu,
    handlePrevious,
    handleNext,
  });

  if (isCompleted) {
    return <CompletionScreen onComplete={handleComplete} />;
  }

  return (
    <EditingFlowLayout>
      <EditingNavigationArea
        isNavigationHidden={isNavigationHidden}
        showCompactMenu={showCompactMenu}
        setShowCompactMenu={setShowCompactMenu}
        currentSectionIndex={currentSectionIndex}
        editingSections={editingSections}
        handleSectionNavigate={handleSectionNavigate}
        handleEnhancedSave={handleEnhancedSave}
        handleCloseEditing={handleCloseEditing}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        isSaving={isSaving}
        onNavigateToDashboard={handleNavigateToDashboard}
        canGoPrevious={currentSectionIndex > 0}
        canGoNext={currentSectionIndex < editingSections.length - 1}
        isAdmin={isAdmin}
        sectionData={sectionData}
        onNavigateToAdmin={onNavigateToAdmin}
        onSaveAsDemo={onSaveAsDemo}
        isSavingDemo={isSavingDemo}
      />
      <EditingSectionArea
        isNavigationHidden={isNavigationHidden}
        swipeDirection={swipeDirection}
        currentSection={currentSection}
        currentSectionIndex={currentSectionIndex}
        editingSections={editingSections}
        sectionData={sectionData}
        handleSectionUpdate={handleSectionUpdate}
        heroSectionRef={heroSectionRef}
        isEditBarOpen={isEditBarOpen}
        handleRegenerate={handleRegenerate}
        handleStyleRegenerate={handleStyleRegenerate}
        handleUndo={handleUndo}
        handleToggleSettings={handleToggleSettings}
        isRegenerating={isRegenerating}
        isSaving={isSaving}
        lastRegenerationResult={lastRegenerationResult}
        canUndo={canUndo}
        handleEnhancedSave={handleEnhancedSave}
      />
    </EditingFlowLayout>
  );
};

export default EnhancedFullScreenEditingFlow;
