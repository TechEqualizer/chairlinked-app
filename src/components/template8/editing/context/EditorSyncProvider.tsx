import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useEditorStore, EditorChangeEvent, Template8Data } from '../state/EditorStateManager';

// Context for sharing editor sync state and utilities
interface EditorSyncContextValue {
  // Sync utilities
  syncWithExternal: (data: Partial<Template8Data>) => void;
  notifyExternalChange: (property: string, value: any, source?: string) => void;
  
  // Event subscription
  subscribeToChanges: (callback: (events: EditorChangeEvent[]) => void) => () => void;
  
  // Conflict resolution
  resolveConflict: (strategy: 'local' | 'external' | 'merge') => void;
  
  // Performance monitoring
  getPerformanceMetrics: () => {
    totalChanges: number;
    averageResponseTime: number;
    conflictCount: number;
  };
}

const EditorSyncContext = createContext<EditorSyncContextValue | null>(null);

export const useEditorSyncContext = () => {
  const context = useContext(EditorSyncContext);
  if (!context) {
    console.warn('[useEditorSyncContext] Used outside of EditorSyncProvider, returning null');
    return null;
  }
  return context;
};

interface EditorSyncProviderProps {
  children: ReactNode;
  
  // External data synchronization
  externalData?: Partial<Template8Data>;
  onDataChange?: (data: Partial<Template8Data>) => void;
  
  // Auto-save configuration
  autoSave?: {
    enabled: boolean;
    debounceMs: number;
    onSave: (data: Partial<Template8Data>) => Promise<void>;
  };
  
  // Performance monitoring
  enablePerformanceMonitoring?: boolean;
  
  // Conflict resolution strategy
  conflictResolution?: 'local' | 'external' | 'merge' | 'manual';
}

export const EditorSyncProvider: React.FC<EditorSyncProviderProps> = ({
  children,
  externalData,
  onDataChange,
  autoSave,
  enablePerformanceMonitoring = false,
  conflictResolution = 'local'
}) => {
  // Store subscription with refs to prevent re-renders
  const storeState = useEditorStore(state => ({
    data: state.data,
    pendingChanges: state.pendingChanges,
    syncStatus: state.syncStatus
  }));
  
  // Get store actions separately to avoid including them in useEffect dependencies
  const updateData = useEditorStore(state => state.updateData);
  const setSyncStatus = useEditorStore(state => state.setSyncStatus);
  const markSaved = useEditorStore(state => state.markSaved);
  const setAutoSaving = useEditorStore(state => state.setAutoSaving);
  
  // Destructure state for cleaner usage
  const { data, pendingChanges, syncStatus } = storeState;

  // Performance tracking
  const performanceRef = useRef({
    totalChanges: 0,
    totalResponseTime: 0,
    conflictCount: 0,
    lastChangeTime: 0
  });

  // Change subscribers
  const subscribersRef = useRef<Array<(events: EditorChangeEvent[]) => void>>([]);

  // Auto-save timeout
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize store with external data
  useEffect(() => {
    if (externalData && Object.keys(externalData).length > 0) {
      console.log('[EditorSyncProvider] Initializing with external data:', externalData);
      updateData(externalData, 'external', { source: 'initialization' });
      setSyncStatus('synced');
    }
  }, [externalData]); // Remove updateData and setSyncStatus from dependencies

  // Sync internal changes to external
  useEffect(() => {
    if (onDataChange && Object.keys(data).length > 0) {
      const timeoutId = setTimeout(() => {
        console.log('[EditorSyncProvider] Syncing data to external:', data);
        onDataChange(data);
      }, 100); // Small delay to batch rapid changes

      return () => clearTimeout(timeoutId);
    }
  }, [data, onDataChange]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave?.enabled || pendingChanges.length === 0) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new auto-save timeout
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        console.log('[EditorSyncProvider] Auto-saving data...');
        setAutoSaving(true);
        await autoSave.onSave(data);
        markSaved();
        console.log('[EditorSyncProvider] Auto-save completed');
      } catch (error) {
        console.error('[EditorSyncProvider] Auto-save failed:', error);
        setSyncStatus('error');
      } finally {
        setAutoSaving(false);
      }
    }, autoSave.debounceMs || 1000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [pendingChanges, autoSave, data]); // Remove store functions from dependencies

  // Performance monitoring
  useEffect(() => {
    if (enablePerformanceMonitoring && pendingChanges.length > 0) {
      const now = Date.now();
      const lastChange = performanceRef.current.lastChangeTime;
      
      if (lastChange > 0) {
        performanceRef.current.totalResponseTime += now - lastChange;
      }
      
      performanceRef.current.totalChanges += pendingChanges.length;
      performanceRef.current.lastChangeTime = now;
    }
  }, [pendingChanges, enablePerformanceMonitoring]);

  // Change notification system
  useEffect(() => {
    if (pendingChanges.length > 0) {
      // Notify all subscribers of changes
      subscribersRef.current.forEach(callback => {
        try {
          callback(pendingChanges);
        } catch (error) {
          console.error('[EditorSyncProvider] Error in change subscriber:', error);
        }
      });
    }
  }, [pendingChanges]);

  // Context value
  const contextValue: EditorSyncContextValue = {
    // Sync utilities
    syncWithExternal: (externalData: Partial<Template8Data>) => {
      console.log('[EditorSyncProvider] Syncing with external data:', externalData);
      
      // Detect conflicts
      const hasConflicts = Object.keys(externalData).some(key => {
        const currentValue = data[key as keyof Template8Data];
        const newValue = externalData[key as keyof Template8Data];
        return currentValue !== undefined && currentValue !== newValue;
      });

      if (hasConflicts && conflictResolution === 'manual') {
        setSyncStatus('conflict');
        performanceRef.current.conflictCount++;
        return;
      }

      // Apply conflict resolution strategy
      let finalData = externalData;
      if (hasConflicts) {
        switch (conflictResolution) {
          case 'local':
            finalData = { ...externalData, ...data }; // Local data wins
            break;
          case 'external':
            finalData = externalData; // External data wins
            break;
          case 'merge':
            // Simple merge strategy - could be enhanced with more sophisticated logic
            finalData = { ...data, ...externalData };
            break;
        }
        performanceRef.current.conflictCount++;
      }

      updateData(finalData, 'external', { 
        source: 'sync',
        conflictResolution: hasConflicts ? conflictResolution : 'none'
      });
      setSyncStatus('synced');
    },

    notifyExternalChange: (property: string, value: any, source = 'external') => {
      console.log('[EditorSyncProvider] External change notification:', { property, value, source });
      updateData({ [property]: value } as Partial<Template8Data>, 'external', { 
        source,
        property,
        isExternalNotification: true
      });
    },

    // Event subscription
    subscribeToChanges: (callback: (events: EditorChangeEvent[]) => void) => {
      subscribersRef.current.push(callback);
      
      // Return unsubscribe function
      return () => {
        const index = subscribersRef.current.indexOf(callback);
        if (index > -1) {
          subscribersRef.current.splice(index, 1);
        }
      };
    },

    // Conflict resolution
    resolveConflict: (strategy: 'local' | 'external' | 'merge') => {
      console.log('[EditorSyncProvider] Resolving conflict with strategy:', strategy);
      
      if (syncStatus !== 'conflict') {
        console.warn('[EditorSyncProvider] No conflict to resolve');
        return;
      }

      // Apply the chosen strategy
      // This would need to be enhanced with actual conflict data
      setSyncStatus('synced');
    },

    // Performance monitoring
    getPerformanceMetrics: () => {
      const metrics = performanceRef.current;
      return {
        totalChanges: metrics.totalChanges,
        averageResponseTime: metrics.totalChanges > 0 
          ? metrics.totalResponseTime / metrics.totalChanges 
          : 0,
        conflictCount: metrics.conflictCount
      };
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <EditorSyncContext.Provider value={contextValue}>
      {children}
    </EditorSyncContext.Provider>
  );
};

// Higher-order component for easy integration
export const withEditorSync = <P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<EditorSyncProviderProps, 'children'>
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <EditorSyncProvider {...options}>
      <Component {...props} ref={ref} />
    </EditorSyncProvider>
  ));
};