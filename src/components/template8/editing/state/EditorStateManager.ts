import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Template8Data } from '../../generator/types/GeneratorTypes';

// Event types for change propagation
export type EditorChangeEvent = {
  id: string;
  timestamp: number;
  source: 'quick-editor' | 'fullscreen-editor' | 'external';
  type: 'text' | 'color' | 'image' | 'style' | 'structure' | 'bulk';
  section?: string;
  element?: string;
  property: string;
  oldValue: any;
  newValue: any;
  metadata?: Record<string, any>;
};

// Undo/Redo history entry
export type EditorHistoryEntry = {
  id: string;
  timestamp: number;
  description: string;
  changes: EditorChangeEvent[];
  beforeState: Partial<Template8Data>;
  afterState: Partial<Template8Data>;
};

// Editor state interface
export interface EditorState {
  // Core data
  data: Partial<Template8Data>;
  
  // Change tracking
  changeHistory: EditorHistoryEntry[];
  currentHistoryIndex: number;
  pendingChanges: EditorChangeEvent[];
  
  // Editor status
  activeEditor: 'quick' | 'fullscreen' | 'none';
  isAutoSaving: boolean;
  lastSaveTimestamp: number;
  syncStatus: 'synced' | 'syncing' | 'conflict' | 'error';
  
  // Selected element tracking
  selectedElement: {
    id: string;
    section: string;
    element: string;
    properties: Record<string, any>;
  } | null;
  
  // Actions
  updateData: (updates: Partial<Template8Data>, source: EditorChangeEvent['source'], metadata?: Record<string, any>) => void;
  updateProperty: (property: string, value: any, source: EditorChangeEvent['source'], metadata?: Record<string, any>) => void;
  setSelectedElement: (element: EditorState['selectedElement']) => void;
  setActiveEditor: (editor: EditorState['activeEditor']) => void;
  
  // History management
  undo: () => boolean;
  redo: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  
  // Sync management
  setSyncStatus: (status: EditorState['syncStatus']) => void;
  setAutoSaving: (saving: boolean) => void;
  markSaved: () => void;
  
  // Batch operations
  startBatch: () => void;
  endBatch: (description: string) => void;
  isBatching: boolean;
  batchedChanges: EditorChangeEvent[];
}

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const createChangeEvent = (
  property: string,
  oldValue: any,
  newValue: any,
  source: EditorChangeEvent['source'],
  metadata?: Record<string, any>
): EditorChangeEvent => ({
  id: generateId(),
  timestamp: Date.now(),
  source,
  type: inferChangeType(property, oldValue, newValue),
  section: metadata?.section,
  element: metadata?.element,
  property,
  oldValue,
  newValue,
  metadata
});

const inferChangeType = (property: string, oldValue: any, newValue: any): EditorChangeEvent['type'] => {
  if (property.includes('Color') || property.includes('color')) return 'color';
  if (property.includes('Image') || property.includes('image')) return 'image';
  if (property.includes('Text') || property.includes('Title') || property.includes('Description')) return 'text';
  if (property.includes('fontSize') || property.includes('fontWeight') || property.includes('style')) return 'style';
  if (Array.isArray(oldValue) || Array.isArray(newValue)) return 'structure';
  return 'text';
};

const createHistoryEntry = (
  changes: EditorChangeEvent[],
  beforeState: Partial<Template8Data>,
  afterState: Partial<Template8Data>,
  description?: string
): EditorHistoryEntry => ({
  id: generateId(),
  timestamp: Date.now(),
  description: description || generateChangeDescription(changes),
  changes,
  beforeState,
  afterState
});

const generateChangeDescription = (changes: EditorChangeEvent[]): string => {
  if (changes.length === 1) {
    const change = changes[0];
    switch (change.type) {
      case 'text': return `Edit ${change.section || 'text'} content`;
      case 'color': return `Change ${change.section || 'element'} color`;
      case 'image': return `Update ${change.section || 'image'}`;
      case 'style': return `Modify ${change.section || 'element'} style`;
      default: return `Edit ${change.property}`;
    }
  }
  
  const types = [...new Set(changes.map(c => c.type))];
  if (types.length === 1) {
    return `Bulk ${types[0]} changes (${changes.length} items)`;
  }
  
  return `Multiple changes (${changes.length} items)`;
};

// Create the Zustand store with subscriptions
export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    data: {},
    changeHistory: [],
    currentHistoryIndex: -1,
    pendingChanges: [],
    activeEditor: 'none',
    isAutoSaving: false,
    lastSaveTimestamp: 0,
    syncStatus: 'synced',
    selectedElement: null,
    isBatching: false,
    batchedChanges: [],

    // Core update function with change tracking
    updateData: (updates, source, metadata = {}) => {
      const currentData = get().data;
      const isBatching = get().isBatching;
      
      // Create change events for each updated property
      const changes: EditorChangeEvent[] = [];
      Object.entries(updates).forEach(([property, newValue]) => {
        const oldValue = currentData[property as keyof Template8Data];
        if (oldValue !== newValue) {
          changes.push(createChangeEvent(property, oldValue, newValue, source, metadata));
        }
      });

      if (changes.length === 0) return; // No actual changes

      const newData = { ...currentData, ...updates };

      if (isBatching) {
        // Add to batch instead of creating history entry
        set(state => ({
          data: newData,
          batchedChanges: [...state.batchedChanges, ...changes],
          pendingChanges: [...state.pendingChanges, ...changes],
          syncStatus: 'syncing'
        }));
      } else {
        // Create history entry and update state
        const historyEntry = createHistoryEntry(changes, currentData, newData);
        
        set(state => ({
          data: newData,
          changeHistory: [...state.changeHistory.slice(0, state.currentHistoryIndex + 1), historyEntry],
          currentHistoryIndex: state.currentHistoryIndex + 1,
          pendingChanges: [...state.pendingChanges, ...changes],
          syncStatus: 'syncing'
        }));
      }
    },

    // Convenience method for single property updates
    updateProperty: (property, value, source, metadata = {}) => {
      const currentData = get().data;
      const isBatching = get().isBatching;
      
      // Create change event for the property
      const oldValue = currentData[property as keyof Template8Data];
      if (oldValue === value) return; // No actual change
      
      const change = createChangeEvent(property, oldValue, value, source, metadata);
      const newData = { ...currentData, [property]: value };

      if (isBatching) {
        // Add to batch instead of creating history entry
        set(state => ({
          data: newData,
          batchedChanges: [...state.batchedChanges, change],
          pendingChanges: [...state.pendingChanges, change],
          syncStatus: 'syncing'
        }));
      } else {
        // Create history entry and update state
        const historyEntry = createHistoryEntry([change], currentData, newData);
        
        set(state => ({
          data: newData,
          changeHistory: [...state.changeHistory.slice(0, state.currentHistoryIndex + 1), historyEntry],
          currentHistoryIndex: state.currentHistoryIndex + 1,
          pendingChanges: [...state.pendingChanges, change],
          syncStatus: 'syncing'
        }));
      }
    },

    // Element selection management
    setSelectedElement: (element) => {
      set({ selectedElement: element });
    },

    // Active editor tracking
    setActiveEditor: (editor) => {
      set({ activeEditor: editor });
    },

    // Undo functionality
    undo: () => {
      const { changeHistory, currentHistoryIndex } = get();
      if (currentHistoryIndex >= 0) {
        const entry = changeHistory[currentHistoryIndex];
        set({
          data: entry.beforeState,
          currentHistoryIndex: currentHistoryIndex - 1,
          syncStatus: 'syncing'
        });
        return true;
      }
      return false;
    },

    // Redo functionality
    redo: () => {
      const { changeHistory, currentHistoryIndex } = get();
      if (currentHistoryIndex < changeHistory.length - 1) {
        const entry = changeHistory[currentHistoryIndex + 1];
        set({
          data: entry.afterState,
          currentHistoryIndex: currentHistoryIndex + 1,
          syncStatus: 'syncing'
        });
        return true;
      }
      return false;
    },

    // History state checks
    canUndo: () => get().currentHistoryIndex >= 0,
    canRedo: () => get().currentHistoryIndex < get().changeHistory.length - 1,

    // Clear history
    clearHistory: () => {
      set({
        changeHistory: [],
        currentHistoryIndex: -1,
        pendingChanges: []
      });
    },

    // Sync status management
    setSyncStatus: (status) => {
      set({ syncStatus: status });
    },

    // Auto-save status
    setAutoSaving: (saving) => {
      set({ isAutoSaving: saving });
    },

    // Mark as saved
    markSaved: () => {
      set({
        lastSaveTimestamp: Date.now(),
        pendingChanges: [],
        syncStatus: 'synced',
        isAutoSaving: false
      });
    },

    // Batch operations
    startBatch: () => {
      set({ isBatching: true, batchedChanges: [] });
    },

    endBatch: (description) => {
      const { isBatching, batchedChanges, data } = get();
      if (!isBatching || batchedChanges.length === 0) return;

      // Create a single history entry for the entire batch
      const beforeState = { ...data };
      // Apply all batched changes to get the final state
      const afterState = batchedChanges.reduce((state, change) => ({
        ...state,
        [change.property]: change.newValue
      }), beforeState);

      const historyEntry = createHistoryEntry(batchedChanges, beforeState, afterState, description);

      set(state => ({
        isBatching: false,
        batchedChanges: [],
        changeHistory: [...state.changeHistory.slice(0, state.currentHistoryIndex + 1), historyEntry],
        currentHistoryIndex: state.currentHistoryIndex + 1
      }));
    }
  }))
);

// Export types for external use
export type { Template8Data, EditorChangeEvent, EditorHistoryEntry };