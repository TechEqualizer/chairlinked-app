import { useEffect, useCallback, useRef } from 'react';
import { useEditorStore, EditorChangeEvent, Template8Data } from '../state/EditorStateManager';

// Hook options for customizing behavior
export interface UseEditorSyncOptions {
  // Which editor is using this hook
  editorType: 'quick' | 'fullscreen';
  
  // Auto-save configuration
  autoSave?: {
    enabled: boolean;
    debounceMs: number;
    onSave?: (data: Partial<Template8Data>) => Promise<void>;
  };
  
  // Change filtering - only react to certain types of changes
  changeFilter?: {
    sections?: string[];
    types?: EditorChangeEvent['type'][];
    sources?: EditorChangeEvent['source'][];
  };
  
  // Performance options
  performance?: {
    batchUpdates: boolean;
    throttleMs: number;
  };
}

// Return type for the hook
export interface EditorSyncAPI {
  // Current data and state
  data: Partial<Template8Data>;
  selectedElement: any;
  syncStatus: 'synced' | 'syncing' | 'conflict' | 'error';
  isAutoSaving: boolean;
  
  // Update functions
  updateData: (updates: Partial<Template8Data>, metadata?: Record<string, any>) => void;
  updateProperty: (property: string, value: any, metadata?: Record<string, any>) => void;
  setSelectedElement: (element: any) => void;
  
  // History functions
  undo: () => boolean;
  redo: () => boolean;
  canUndo: boolean;
  canRedo: boolean;
  
  // Batch operations
  batch: (callback: () => void, description?: string) => void;
  
  // Status functions
  markActive: () => void;
  markInactive: () => void;
  
  // Save functions
  save: () => Promise<void>;
  hasUnsavedChanges: boolean;
}

export const useEditorSync = (options: UseEditorSyncOptions): EditorSyncAPI => {
  const { editorType, autoSave, changeFilter, performance } = options;
  
  // Refs for stable callbacks
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<number>(0);
  const batchTimeoutRef = useRef<NodeJS.Timeout>();
  const pendingUpdatesRef = useRef<Array<() => void>>([]);
  
  // Subscribe to relevant state
  const {
    data,
    selectedElement,
    syncStatus,
    isAutoSaving,
    pendingChanges,
    lastSaveTimestamp,
    activeEditor,
    updateData: storeUpdateData,
    updateProperty: storeUpdateProperty,
    setSelectedElement: storeSetSelectedElement,
    setActiveEditor,
    undo: storeUndo,
    redo: storeRedo,
    canUndo: storeCanUndo,
    canRedo: storeCanRedo,
    startBatch,
    endBatch,
    markSaved,
    setAutoSaving
  } = useEditorStore(state => ({
    data: state.data,
    selectedElement: state.selectedElement,
    syncStatus: state.syncStatus,
    isAutoSaving: state.isAutoSaving,
    pendingChanges: state.pendingChanges,
    lastSaveTimestamp: state.lastSaveTimestamp,
    activeEditor: state.activeEditor,
    updateData: state.updateData,
    updateProperty: state.updateProperty,
    setSelectedElement: state.setSelectedElement,
    setActiveEditor: state.setActiveEditor,
    undo: state.undo,
    redo: state.redo,
    canUndo: state.canUndo(),
    canRedo: state.canRedo(),
    startBatch: state.startBatch,
    endBatch: state.endBatch,
    markSaved: state.markSaved,
    setAutoSaving: state.setAutoSaving
  }));

  // Enhanced update function with batching support
  const updateData = useCallback((updates: Partial<Template8Data>, metadata: Record<string, any> = {}) => {
    const updateFn = () => {
      storeUpdateData(updates, editorType === 'quick' ? 'quick-editor' : 'fullscreen-editor', {
        editorType,
        timestamp: Date.now(),
        ...metadata
      });
    };

    if (performance?.batchUpdates && performance.throttleMs > 0) {
      // Add to pending updates
      pendingUpdatesRef.current.push(updateFn);
      
      // Clear existing timeout
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      
      // Set new timeout to flush updates
      batchTimeoutRef.current = setTimeout(() => {
        if (pendingUpdatesRef.current.length > 0) {
          // Execute all pending updates as a batch
          startBatch();
          pendingUpdatesRef.current.forEach(fn => fn());
          endBatch(`Batch updates from ${editorType} editor`);
          pendingUpdatesRef.current = [];
        }
      }, performance.throttleMs);
    } else {
      // Execute immediately
      updateFn();
    }
  }, [storeUpdateData, editorType, performance, startBatch, endBatch]);

  const updateProperty = useCallback((property: string, value: any, metadata: Record<string, any> = {}) => {
    storeUpdateProperty(property, value, editorType === 'quick' ? 'quick-editor' : 'fullscreen-editor', {
      editorType,
      timestamp: Date.now(),
      ...metadata
    });
  }, [storeUpdateProperty, editorType]);

  // Batch operation wrapper
  const batch = useCallback((callback: () => void, description?: string) => {
    startBatch();
    try {
      callback();
    } finally {
      endBatch(description || `Batch operation from ${editorType} editor`);
    }
  }, [startBatch, endBatch, editorType]);

  // Mark this editor as active
  const markActive = useCallback(() => {
    setActiveEditor(editorType);
  }, [setActiveEditor, editorType]);

  // Mark this editor as inactive
  const markInactive = useCallback(() => {
    if (activeEditor === editorType) {
      setActiveEditor('none');
    }
  }, [setActiveEditor, editorType, activeEditor]);

  // Auto-save functionality
  const triggerAutoSave = useCallback(async () => {
    if (!autoSave?.enabled || !autoSave.onSave || isAutoSaving) return;
    
    try {
      setAutoSaving(true);
      await autoSave.onSave(data);
      markSaved();
    } catch (error) {
      console.error('[useEditorSync] Auto-save failed:', error);
    } finally {
      setAutoSaving(false);
    }
  }, [autoSave, data, isAutoSaving, setAutoSaving, markSaved]);

  // Manual save function
  const save = useCallback(async () => {
    if (autoSave?.onSave) {
      await triggerAutoSave();
    }
  }, [triggerAutoSave, autoSave]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave?.enabled || pendingChanges.length === 0) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Filter changes if needed
    let relevantChanges = pendingChanges;
    if (changeFilter) {
      relevantChanges = pendingChanges.filter(change => {
        if (changeFilter.sections && change.section && !changeFilter.sections.includes(change.section)) {
          return false;
        }
        if (changeFilter.types && !changeFilter.types.includes(change.type)) {
          return false;
        }
        if (changeFilter.sources && !changeFilter.sources.includes(change.source)) {
          return false;
        }
        return true;
      });
    }

    // Only auto-save if there are relevant changes
    if (relevantChanges.length > 0) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        triggerAutoSave();
      }, autoSave.debounceMs || 1000);
    }
  }, [pendingChanges, autoSave, changeFilter, triggerAutoSave]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, []);

  // Mark editor as active when component mounts
  useEffect(() => {
    markActive();
    return () => markInactive();
  }, [markActive, markInactive]);

  // Calculate if there are unsaved changes
  const hasUnsavedChanges = pendingChanges.length > 0;

  return {
    // State
    data,
    selectedElement,
    syncStatus,
    isAutoSaving,
    
    // Update functions
    updateData,
    updateProperty,
    setSelectedElement: storeSetSelectedElement,
    
    // History functions
    undo: storeUndo,
    redo: storeRedo,
    canUndo: storeCanUndo,
    canRedo: storeCanRedo,
    
    // Batch operations
    batch,
    
    // Status functions
    markActive,
    markInactive,
    
    // Save functions
    save,
    hasUnsavedChanges
  };
};

// Convenience hooks for specific editors
export const useQuickEditorSync = (options?: Partial<UseEditorSyncOptions>) => {
  return useEditorSync({
    editorType: 'quick',
    autoSave: {
      enabled: true,
      debounceMs: 500,
      ...options?.autoSave
    },
    performance: {
      batchUpdates: true,
      throttleMs: 100,
      ...options?.performance
    },
    ...options
  });
};

export const useFullscreenEditorSync = (options?: Partial<UseEditorSyncOptions>) => {
  return useEditorSync({
    editorType: 'fullscreen',
    autoSave: {
      enabled: true,
      debounceMs: 1000,
      ...options?.autoSave
    },
    performance: {
      batchUpdates: false,
      throttleMs: 0,
      ...options?.performance
    },
    ...options
  });
};