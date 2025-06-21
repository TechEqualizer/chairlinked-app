
import React, { useRef, useEffect, useCallback, useState } from "react";
import { editingSections } from "./config/editingSections";
import { useEditingFlow } from "./hooks/useEditingFlow";
import { useEditMode } from "@/components/chairlinked/editing/EditModeContext";
import { useEditingHotkeys } from "./hooks/useEditingHotkeys";
// import { useUndoRedo } from "./hooks/useUndoRedo";
// import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
// import { useUnifiedAutoSave } from "./hooks/useUnifiedAutoSave";
import CompletionScreen from "./components/CompletionScreen";
import EditingFlowLayout from "./components/EditingFlowLayout";
import EditingNavigationArea from "./components/EditingNavigationArea";
import EditingSectionArea from "./components/EditingSectionArea";
import SitePreviewModal from "./components/SitePreviewModal";
import AIAssistantModal from "./components/AIAssistantModal";

interface EnhancedFullScreenEditingFlowProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
  onClose: () => void;
  isAdmin?: boolean;
  onSaveAsDemo?: () => Promise<void>;
  isSavingDemo?: boolean;
  onNavigateToAdmin?: () => void;
  onQuickEdit?: () => void;
  onSaveSuccessNavigate?: () => void;
}

const EnhancedFullScreenEditingFlow: React.FC<EnhancedFullScreenEditingFlowProps> = ({
  pageData,
  onUpdate,
  onSave,
  onClose,
  isAdmin = false,
  onSaveAsDemo,
  isSavingDemo = false,
  onNavigateToAdmin,
  onQuickEdit,
  onSaveSuccessNavigate
}) => {
  const { isEditMode, setIsEditMode } = useEditMode();
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const [isNavigationHidden, setIsNavigationHidden] = React.useState(false);
  const [showCompactMenu, setShowCompactMenu] = React.useState(false);
  const [isAutoSavePaused, setIsAutoSavePaused] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

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
    handleUndo: originalHandleUndo,
    handlePrevious: originalHandlePrevious,
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

  // Temporarily disabled enhanced features to fix error
  // TODO: Re-enable after fixing issues
  
  // Mock auto-save state for now
  const autoSaveState = null;
  const triggerSave = async () => {};
  const pauseAutoSave = () => {};
  const resumeAutoSave = () => {};

  const currentSection = editingSections[currentSectionIndex];
  
  // Use original undo/redo for now
  const canUndo = regenerationHistory.some(entry =>
    entry.sectionIndex === currentSectionIndex && entry.action === 'regenerate_start'
  );
  const canRedo = false; // Original doesn't have redo

  // Define section navigation functions first
  const handleSectionNavigate = async (sectionIndex: number) => {
    setShowCompactMenu(false);
    await jumpToSection(sectionIndex);
  };

  // Use original undo function
  const handleUndoOriginal = originalHandleUndo;
  const handleRedoOriginal = () => {}; // Original doesn't have redo

  // Use original navigation for now
  const handlePreviousSection = useCallback(() => {
    if (currentSectionIndex > 0) {
      originalHandlePrevious();
    }
  }, [currentSectionIndex, originalHandlePrevious]);

  const handleNextSection = useCallback(() => {
    const nextIndex = Math.min(currentSectionIndex + 1, editingSections.length - 1);
    if (nextIndex !== currentSectionIndex) {
      handleSectionNavigate(nextIndex);
    }
  }, [currentSectionIndex, handleSectionNavigate]);

  // Enhanced save function with user feedback
  const handleEnhancedSave = async () => {
    if (onUpdate && sectionData) onUpdate(sectionData);
    
    // This is a manual save request - show appropriate feedback
    try {
      await saveChanges();
      
      // Show subtle success feedback instead of disruptive alert
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[100] text-sm';
      toast.textContent = 'Changes saved ✓';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 2000);
    } catch (error) {
      console.error('Save failed:', error);
      
      // Show error feedback
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-[100] text-sm';
      toast.textContent = 'Save failed - changes stored locally';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  };

  // Mock auto-save control functions
  const handlePauseAutoSave = () => {
    setIsAutoSavePaused(true);
  };

  const handleResumeAutoSave = () => {
    setIsAutoSavePaused(false);
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

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  const handleAIChat = () => {
    setShowAIAssistant(true);
  };

  const handleToggleNavigation = () => {
    setIsNavigationHidden(!isNavigationHidden);
    setShowCompactMenu(false);
  };

  const handleNavigateToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Keyboard Navigation for Arrow Keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger navigation if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.contentEditable === 'true' ||
                      target.getAttribute('role') === 'textbox';

      if (isTyping || showCompactMenu) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (currentSectionIndex > 0) {
            event.preventDefault();
            handlePreviousSection();
          }
          break;
        case 'ArrowRight':
          if (currentSectionIndex < editingSections.length - 1) {
            event.preventDefault();
            handleNextSection();
          }
          break;
        case 'e':
          if ((event.metaKey || event.ctrlKey) && onQuickEdit) {
            event.preventDefault();
            onQuickEdit();
          }
          break;
        case 'j':
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            handleAIChat();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSectionIndex, handlePreviousSection, handleNextSection, showCompactMenu]);

  useEditingHotkeys({
    isNavigationHidden,
    currentSectionIndex,
    sectionsLength: editingSections.length,
    showCompactMenu,
    setShowCompactMenu,
    handlePrevious: handlePreviousSection,
    handleNext: handleNextSection,
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
        handlePreview={handlePreview}
        handlePrevious={handlePreviousSection}
        handleNext={handleNextSection}
        onQuickEdit={onQuickEdit}
        onAIChat={handleAIChat}
        isSaving={isSaving}
        onNavigateToDashboard={handleNavigateToDashboard}
        canGoPrevious={currentSectionIndex > 0}
        canGoNext={currentSectionIndex < editingSections.length - 1}
        isAdmin={isAdmin}
        sectionData={sectionData}
        onNavigateToAdmin={onNavigateToAdmin}
        onSaveAsDemo={onSaveAsDemo}
        isSavingDemo={isSavingDemo}
        autoSaveState={autoSaveState}
        onPauseAutoSave={handlePauseAutoSave}
        onResumeAutoSave={handleResumeAutoSave}
        isAutoSavePaused={isAutoSavePaused}
        onUndo={handleUndoOriginal}
        onRedo={handleRedoOriginal}
        canUndo={canUndo}
        canRedo={canRedo}
        onSaveSuccessNavigate={onSaveSuccessNavigate}
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
        handleUndo={handleUndoOriginal}
        handleToggleSettings={handleToggleSettings}
        isRegenerating={isRegenerating}
        isSaving={isSaving}
        lastRegenerationResult={lastRegenerationResult}
        canUndo={canUndo}
        handleEnhancedSave={handleEnhancedSave}
      />

      {/* Site Preview Modal */}
      <SitePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        siteData={sectionData}
        previewUrl={sectionData?._previewUrl}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        pageData={sectionData}
        onUpdate={handleSectionUpdate}
        currentSection={currentSection?.id || 'hero'}
        brandColor={sectionData?.brandColor}
      />
    </EditingFlowLayout>
  );
};

export default EnhancedFullScreenEditingFlow;
