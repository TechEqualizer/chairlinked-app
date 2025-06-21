import { useCallback, useEffect, useRef, useState } from 'react';
import { EnhancedDemoSaveService } from '../../generator/services/EnhancedDemoSaveService';

// Simple debounce implementation to avoid lodash dependency issues
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
import type { Template8Data } from '../../generator/types/GeneratorTypes';
import type { SaveResult } from '../../generator/services/types/SaveServiceTypes';

export interface AutoSaveState {
  status: 'idle' | 'saving' | 'saved' | 'error' | 'conflict';
  lastSaved: Date | null;
  error: string | null;
  saveCount: number;
  unsavedChanges: boolean;
}

export interface AutoSaveOptions {
  interval?: number; // Auto-save interval in ms (default: 15000 = 15 seconds)
  debounceDelay?: number; // Debounce delay in ms (default: 2000)
  maxRetries?: number; // Max retry attempts (default: 3)
  onSaveSuccess?: (result: SaveResult) => void;
  onSaveError?: (error: string) => void;
  onStatusChange?: (status: AutoSaveState) => void;
}

export interface UnifiedAutoSaveReturn {
  autoSaveState: AutoSaveState;
  triggerSave: () => Promise<SaveResult>;
  resetAutoSave: () => void;
  pauseAutoSave: () => void;
  resumeAutoSave: () => void;
  hasUnsavedChanges: boolean;
}

export const useUnifiedAutoSave = (
  data: Partial<Template8Data> | null,
  demoId?: string,
  isEditingExisting?: boolean,
  options: AutoSaveOptions = {}
): UnifiedAutoSaveReturn => {
  const {
    interval = 15000, // 15 seconds
    debounceDelay = 2000, // 2 seconds
    maxRetries = 3,
    onSaveSuccess,
    onSaveError,
    onStatusChange
  } = options;

  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
    status: 'idle',
    lastSaved: null,
    error: null,
    saveCount: 0,
    unsavedChanges: false
  });

  const [isPaused, setIsPaused] = useState(false);
  const saveQueueRef = useRef<Promise<SaveResult> | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<string>('');

  // Update state and notify listeners
  const updateState = useCallback((updates: Partial<AutoSaveState>) => {
    setAutoSaveState(prev => {
      const newState = { ...prev, ...updates };
      onStatusChange?.(newState);
      return newState;
    });
  }, [onStatusChange]);

  // Core save function with queue management
  const performSave = useCallback(async (): Promise<SaveResult> => {
    // If a save is already in progress, wait for it
    if (saveQueueRef.current) {
      return saveQueueRef.current;
    }

    // Create new save promise
    saveQueueRef.current = (async (): Promise<SaveResult> => {
      try {
        updateState({ status: 'saving', error: null });

        const result = await EnhancedDemoSaveService.saveDemo(data || {}, {
          existingDemoId: demoId,
          isEditingExisting,
          maxRetries
        });

        if (result.success) {
          updateState({
            status: 'saved',
            lastSaved: new Date(),
            saveCount: autoSaveState.saveCount + 1,
            unsavedChanges: false,
            error: null
          });

          // Update demo ID if we got a new one
          if (result.demoId && result.demoId !== demoId) {
            // Store the new demo ID for future saves
            sessionStorage.setItem('current_demo_id', result.demoId);
          }

          onSaveSuccess?.(result);
        } else {
          const errorMsg = result.error || 'Save failed';
          updateState({
            status: 'error',
            error: errorMsg
          });
          onSaveError?.(errorMsg);
        }

        return result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown save error';
        updateState({
          status: 'error',
          error: errorMsg
        });
        onSaveError?.(errorMsg);
        
        return {
          success: false,
          error: errorMsg
        };
      } finally {
        saveQueueRef.current = null;
        
        // Reset to idle after a short delay to show save status
        setTimeout(() => {
          updateState({ status: 'idle' });
        }, 2000);
      }
    })();

    return saveQueueRef.current;
  }, [data, demoId, isEditingExisting, maxRetries, autoSaveState.saveCount, updateState, onSaveSuccess, onSaveError]);

  // Debounced save for frequent changes
  const debouncedSave = useCallback(
    debounce(() => {
      if (!isPaused && data) {
        performSave();
      }
    }, debounceDelay),
    [performSave, isPaused, data]
  );

  // Manual save trigger
  const triggerSave = useCallback(async (): Promise<SaveResult> => {
    if (!data) {
      return { success: false, error: 'No data to save' };
    }
    return performSave();
  }, [data, performSave]);

  // Check for data changes
  useEffect(() => {
    if (!data) return;

    const currentDataString = JSON.stringify(data);
    const hasChanged = currentDataString !== lastDataRef.current;
    
    if (hasChanged) {
      lastDataRef.current = currentDataString;
      updateState({ unsavedChanges: true });
      
      // Trigger debounced save
      if (!isPaused) {
        debouncedSave();
      }
    }
  }, [data, debouncedSave, isPaused, updateState]);

  // Periodic auto-save
  useEffect(() => {
    if (isPaused || !data) return;

    intervalRef.current = setInterval(() => {
      if (autoSaveState.unsavedChanges && autoSaveState.status === 'idle') {
        performSave();
      }
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, data, interval, autoSaveState.unsavedChanges, autoSaveState.status, performSave]);

  // Control functions
  const resetAutoSave = useCallback(() => {
    updateState({
      status: 'idle',
      lastSaved: null,
      error: null,
      saveCount: 0,
      unsavedChanges: false
    });
    lastDataRef.current = data ? JSON.stringify(data) : '';
  }, [data, updateState]);

  const pauseAutoSave = useCallback(() => {
    setIsPaused(true);
    debouncedSave.cancel();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [debouncedSave]);

  const resumeAutoSave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [debouncedSave]);

  return {
    autoSaveState,
    triggerSave,
    resetAutoSave,
    pauseAutoSave,
    resumeAutoSave,
    hasUnsavedChanges: autoSaveState.unsavedChanges
  };
};