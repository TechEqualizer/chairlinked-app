import { useState, useCallback, useEffect } from "react";
import { useNavigationManager } from "./useNavigationManager";
import { useRegenerationManager } from "./useRegenerationManager";
import { useHistoryManager } from "./useHistoryManager";
import { UseEditingFlowProps } from "./types/editingFlowTypes";

export const useEditingFlow = ({
  pageData,
  onUpdate,
  onSave,
  totalSections
}: UseEditingFlowProps) => {
  const [sectionData, setSectionData] = useState(pageData);
  const [isEditBarOpen, setIsEditBarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // CRITICAL FIX: Sync internal state when pageData prop changes
  // This ensures Quick Editor changes are reflected in Fullscreen Editor
  useEffect(() => {
    if (pageData && pageData !== sectionData) {
      console.log('[useEditingFlow] Syncing with updated pageData from Quick Editor:', {
        oldBusinessName: sectionData?.businessName,
        newBusinessName: pageData?.businessName,
        oldTagline: sectionData?.tagline,
        newTagline: pageData?.tagline,
        dataChanged: JSON.stringify(pageData) !== JSON.stringify(sectionData)
      });
      setSectionData(pageData);
    }
  }, [pageData]);

  const {
    currentSectionIndex,
    swipeDirection,
    isCompleted,
    setIsCompleted,
    handleApprove,
    handlePrevious,
    jumpToSection: navigationJumpToSection
  } = useNavigationManager(totalSections);

  const {
    isRegenerating,
    lastRegenerationResult,
    regenerationHistory,
    handleRegenerate,
    handleStyleRegenerate
  } = useRegenerationManager(currentSectionIndex, sectionData, setSectionData);

  const { handleUndo } = useHistoryManager(
    currentSectionIndex,
    sectionData,
    setSectionData,
    regenerationHistory
  );

  const saveChanges = useCallback(async () => {
    console.log('[useEditingFlow] Save changes called with current section data:', {
      businessName: sectionData?.businessName,
      demoId: sectionData?._demoId,
      hasData: !!sectionData
    });

    setIsSaving(true);
    try {
      // Ensure onUpdate is called with the current section data before saving
      if (onUpdate && sectionData) {
        console.log('[useEditingFlow] Updating parent with current section data before save');
        onUpdate(sectionData);
      }
      
      // If onSave is provided, use it (for backward compatibility)
      if (onSave) {
        await onSave();
        console.log('✅ Changes saved successfully via onSave prop');
      } else {
        // No onSave prop provided, save handled by parent component
        console.log('[useEditingFlow] No onSave prop provided, assuming parent handles save');
      }
    } catch (error) {
      console.error('❌ Error saving changes:', error);
      throw error; // Re-throw for handling by calling components
    } finally {
      setIsSaving(false);
    }
  }, [onSave, onUpdate, sectionData]);

  const handleSectionUpdate = useCallback((updates: any) => {
    console.log('[useEditingFlow] Section update called with:', updates);
    const newData = { ...sectionData, ...updates };
    setSectionData(newData);
    
    // Also immediately call onUpdate to keep parent in sync
    if (onUpdate) {
      onUpdate(newData);
    }
  }, [sectionData, onUpdate]);

  const handleApproveWithSave = useCallback(async () => {
    await handleApprove(saveChanges);
  }, [handleApprove, saveChanges]);

  const jumpToSection = useCallback(async (sectionIndex: number) => {
    await navigationJumpToSection(sectionIndex, saveChanges);
  }, [navigationJumpToSection, saveChanges]);

  const handleToggleSettings = useCallback(() => {
    setIsEditBarOpen(!isEditBarOpen);
  }, [isEditBarOpen]);

  return {
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
    handleApprove: handleApproveWithSave,
    handlePrevious,
    handleToggleSettings,
    setIsCompleted,
    saveChanges,
    jumpToSection
  };
};
