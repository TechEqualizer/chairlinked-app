
import React, { useRef, useEffect, useCallback, useState } from "react";
import { editingSections } from "./config/editingSections";
import { useEditingFlow } from "./hooks/useEditingFlow";
import { useEditMode } from "@/components/chairlinked/editing/EditModeContext";
import { useEditingHotkeys } from "./hooks/useEditingHotkeys";
import { useSectionManager } from "./hooks/useSectionManager";
import { restoreDesignSystemOverrides, restoreUniversalColorOverrides } from "./utils/designSystemOverrides";
// import { useUnifiedAutoSave } from "./hooks/useUnifiedAutoSave";
// import { useAuthContext } from "@/components/auth/AuthProvider";
// import { useUndoRedo } from "./hooks/useUndoRedo";
// import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
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
  hideDemoFactoryTools?: boolean;
  isProductionPreview?: boolean;
  readOnly?: boolean;
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
  onSaveSuccessNavigate,
  hideDemoFactoryTools = false,
  isProductionPreview = false,
  readOnly = false
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

  // Restore design system overrides from Quick Editor
  React.useEffect(() => {
    restoreDesignSystemOverrides();
    restoreUniversalColorOverrides();
  }, []);

  // Get section visibility configuration
  const { getVisibleSections, isSectionVisible } = useSectionManager(pageData);
  
  // Filter editing sections by visibility
  const visibleEditingSections = editingSections.filter(section => 
    isSectionVisible(section.id)
  );

  console.log('[EnhancedFullScreenEditingFlow] Section visibility:', {
    allSections: editingSections.map(s => s.id),
    visibleSections: getVisibleSections(),
    filteredEditingSections: visibleEditingSections.map(s => s.id)
  });

  // Session recovery temporarily disabled
  // TODO: Re-enable after fixing auto-save system

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
    totalSections: visibleEditingSections.length
  });

  // Get current section from visible sections
  const currentSection = visibleEditingSections[currentSectionIndex];

  // Temporarily disable auto-save to prevent white screen
  // Enable unified auto-save system
  const autoSaveState = null;
  const triggerSave = async () => {};
  const pauseAutoSave = () => {};
  const resumeAutoSave = () => {};
  const hasUnsavedChanges = false;
  
  // TODO: Re-enable auto-save after fixing authentication issues
  /*
  const {
    autoSaveState,
    triggerSave,
    pauseAutoSave,
    resumeAutoSave,
    hasUnsavedChanges
  } = useUnifiedAutoSave(
    sectionData,
    sectionData?._demoId,
    !!sectionData?._demoId,
    {
      interval: 15000, // Auto-save every 15 seconds
      debounceDelay: 2000, // 2 second debounce on changes
      maxRetries: 3,
      onSaveSuccess: (result) => {
        console.log('[EnhancedFullScreenEditingFlow] Auto-save successful:', result);
        // Update local data with saved demo information
        if (result.demoId && onUpdate) {
          const updatedData = {
            ...sectionData,
            _demoId: result.demoId,
            _lastSaved: new Date().toISOString()
          };
          onUpdate(updatedData);
        }
      },
      onSaveError: (error) => {
        console.error('[EnhancedFullScreenEditingFlow] Auto-save failed:', error);
      }
    }
  );
  */

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
    const nextIndex = Math.min(currentSectionIndex + 1, visibleEditingSections.length - 1);
    if (nextIndex !== currentSectionIndex) {
      handleSectionNavigate(nextIndex);
    }
  }, [currentSectionIndex, handleSectionNavigate, visibleEditingSections.length]);

  // Enhanced save function with simplified authentication
  const handleEnhancedSave = async () => {
    try {
      // Update parent component with current data first
      if (onUpdate && sectionData) {
        onUpdate(sectionData);
      }

      // Check authentication by getting current user directly from Supabase
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        console.log('[EnhancedFullScreenEditingFlow] No valid session found');
        throw new Error('Please log in to save your demo');
      }

      const currentUser = session.user;

      console.log('[EnhancedFullScreenEditingFlow] Starting save with valid session:', {
        businessName: sectionData?.businessName,
        demoId: sectionData?._demoId,
        hasData: !!sectionData,
        userId: currentUser.id
      });

      // Prepare the save data
      const saveData = {
        business_name: sectionData.businessName || 'Untitled Demo',
        generated_config: sectionData,
        form_data: sectionData,
        user_id: currentUser.id,
        admin_user_id: currentUser.id, // Set both for admin-created demos
        site_type: 'demo',
        status: 'draft',
        lifecycle_stage: 'draft', // Add lifecycle stage for production pipeline
        updated_at: new Date().toISOString()
      };

      let result;
      
      if (sectionData?._demoId) {
        // Update existing demo
        console.log('[EnhancedFullScreenEditingFlow] Updating existing demo:', sectionData._demoId);
        
        const { data: updatedDemo, error } = await supabase
          .from('chairlinked_sites')
          .update(saveData)
          .eq('id', sectionData._demoId)
          .or(`user_id.eq.${currentUser.id},admin_user_id.eq.${currentUser.id}`)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to update demo: ${error.message}`);
        }

        result = {
          success: true,
          demoId: updatedDemo.id,
          url: `/demo/${updatedDemo.site_slug}`
        };
      } else {
        // Create new demo
        console.log('[EnhancedFullScreenEditingFlow] Creating new demo');
        
        // Generate a unique slug
        const slug = `${sectionData.businessName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'demo'}-${Date.now()}`;
        
        const { data: newDemo, error } = await supabase
          .from('chairlinked_sites')
          .insert({
            ...saveData,
            site_slug: slug,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to create demo: ${error.message}`);
        }

        result = {
          success: true,
          demoId: newDemo.id,
          url: `/demo/${newDemo.site_slug}`
        };
      }

      if (result.success) {
        // Update local data with saved demo information
        const updatedData = {
          ...sectionData,
          _demoId: result.demoId,
          _lastSaved: new Date().toISOString()
        };
        
        if (onUpdate) {
          onUpdate(updatedData);
        }

        console.log('[EnhancedFullScreenEditingFlow] Save successful:', result);
        
        // Show success feedback with demo ID
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[100] text-sm';
        toast.textContent = `✓ Saved successfully${result.demoId ? ` (ID: ${result.demoId})` : ''}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.remove();
        }, 3000);
        
        // Call onSaveSuccessNavigate if provided
        if (onSaveSuccessNavigate) {
          onSaveSuccessNavigate();
        }
      } else {
        throw new Error(result.error || 'Save failed');
      }
    } catch (error) {
      console.error('[EnhancedFullScreenEditingFlow] Save failed:', error);
      
      // Categorized error handling
      let errorMessage = 'Save failed';
      let shouldRetry = false;
      
      if (error instanceof Error) {
        if (error.message.includes('authentication') || error.message.includes('auth')) {
          errorMessage = 'Please log in to save your changes';
        } else if (error.message.includes('permission') || error.message.includes('denied')) {
          errorMessage = 'Permission denied - you may not have access to edit this demo';
        } else if (error.message.includes('validation')) {
          errorMessage = 'Please check your content and try again';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error - please check your connection';
          shouldRetry = true;
        } else {
          errorMessage = `Save failed: ${error.message}`;
          shouldRetry = true;
        }
      }
      
      // Show error feedback with retry option
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-[100] text-sm max-w-sm';
      toast.innerHTML = `
        <div class="flex items-center justify-between">
          <span>${errorMessage}</span>
          ${shouldRetry ? '<button class="ml-2 px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-700" onclick="this.closest(\'.fixed\').remove(); document.querySelector(\'[data-save-button]\')?.click();">Retry</button>' : ''}
        </div>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, shouldRetry ? 8000 : 5000);
      
      // Re-throw for any additional error handling
      throw error;
    }
  };

  // Auto-save control functions
  const handlePauseAutoSave = () => {
    setIsAutoSavePaused(true);
    pauseAutoSave();
  };

  const handleResumeAutoSave = () => {
    setIsAutoSavePaused(false);
    resumeAutoSave();
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
        editingSections={visibleEditingSections}
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
        canGoNext={currentSectionIndex < visibleEditingSections.length - 1}
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
        editingSections={visibleEditingSections}
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
