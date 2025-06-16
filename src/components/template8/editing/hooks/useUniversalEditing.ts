
import { useState, useCallback } from 'react';

export const useUniversalEditing = (options?: { 
  pageData?: any; 
  onUpdate?: (updates: any) => void; 
  onSave?: () => Promise<void> 
}) => {
  const { pageData, onUpdate, onSave } = options || {};
  const [isDirty, setIsDirty] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const handleUpdate = useCallback((updates: any) => {
    console.log('[useUniversalEditing] Update called with:', updates);
    setIsDirty(true);
    if (onUpdate) {
      onUpdate(updates);
    }
  }, [onUpdate]);

  const saveChanges = useCallback(async () => {
    console.log('[useUniversalEditing] Save called with current data:', pageData);
    setIsAutoSaving(true);
    try {
      if (onSave) {
        await onSave();
      }
      setIsDirty(false);
    } catch (error) {
      console.error('[useUniversalEditing] Save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [onSave, pageData]);

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const clearDirty = useCallback(() => {
    setIsDirty(false);
  }, []);

  return {
    isEditMode: true,
    toggleEditMode: () => {},
    saveChanges,
    isDirty,
    markDirty,
    clearDirty,
    isAutoSaving,
    handleUpdate
  };
};
