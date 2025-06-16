
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SessionData {
  pageData: any;
  editingState: {
    currentSectionIndex?: number;
    isEditingMode?: boolean;
    isPreviewMode?: boolean;
    areBarsCollapsed?: boolean;
    mode?: string;
    isGenerating?: boolean;
    error?: string;
    timestamp?: number;
  };
  timestamp: number;
  businessName: string;
  sessionId: string;
  version: string;
}

export interface PersistenceOptions {
  debounceMs?: number;
  maxRetries?: number;
  enableSessionRecovery?: boolean;
  storageKey?: string;
}

export const useEnhancedSessionPersistence = (
  businessName: string,
  options: PersistenceOptions = {}
) => {
  const {
    debounceMs = 500,
    maxRetries = 3,
    enableSessionRecovery = true,
    storageKey = `enhanced-session-${businessName}`
  } = options;

  const { toast } = useToast();
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [hasRecoveredSession, setHasRecoveredSession] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSaveRef = useRef<number>(0);
  const retryCountRef = useRef<number>(0);

  // Generate storage keys
  const getStorageKeys = useCallback(() => ({
    session: `${storageKey}-session`,
    backup: `${storageKey}-backup`,
    recovery: `${storageKey}-recovery-${sessionId}`
  }), [storageKey, sessionId]);

  // Safe storage operations with error handling
  const safeStorageOperation = useCallback((operation: () => void, fallback?: () => void) => {
    try {
      operation();
      retryCountRef.current = 0;
    } catch (error) {
      console.warn('Storage operation failed:', error);
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setTimeout(() => {
          if (fallback) fallback();
          else operation();
        }, 100 * retryCountRef.current);
      }
    }
  }, [maxRetries]);

  // Save session data
  const saveSessionData = useCallback((data: Partial<SessionData>) => {
    const keys = getStorageKeys();
    const sessionData: SessionData = {
      pageData: {},
      editingState: {},
      timestamp: Date.now(),
      businessName,
      sessionId,
      version: '1.0',
      ...data
    };

    safeStorageOperation(() => {
      // Primary save to sessionStorage (for crash recovery)
      sessionStorage.setItem(keys.session, JSON.stringify(sessionData));
      
      // Backup save to localStorage (for longer persistence)
      localStorage.setItem(keys.backup, JSON.stringify(sessionData));
      
      // Recovery save with session ID (for debugging)
      localStorage.setItem(keys.recovery, JSON.stringify({
        ...sessionData,
        savedAt: new Date().toISOString()
      }));
      
      lastSaveRef.current = Date.now();
    });
  }, [businessName, sessionId, getStorageKeys, safeStorageOperation]);

  // Load session data
  const loadSessionData = useCallback((): SessionData | null => {
    const keys = getStorageKeys();
    
    try {
      // Try sessionStorage first (most recent)
      const sessionData = sessionStorage.getItem(keys.session);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        return parsed;
      }

      // Fallback to localStorage backup
      const backupData = localStorage.getItem(keys.backup);
      if (backupData) {
        const parsed = JSON.parse(backupData);
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load session data:', error);
    }

    return null;
  }, [getStorageKeys]);

  // Debounced auto-save function
  const debouncedSave = useCallback((data: Partial<SessionData>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setIsAutoSaving(true);
      saveSessionData(data);
      setTimeout(() => setIsAutoSaving(false), 200);
    }, debounceMs);
  }, [debounceMs, saveSessionData]);

  // Clear session data
  const clearSessionData = useCallback(() => {
    const keys = getStorageKeys();
    safeStorageOperation(() => {
      sessionStorage.removeItem(keys.session);
      localStorage.removeItem(keys.backup);
      localStorage.removeItem(keys.recovery);
    });
  }, [getStorageKeys, safeStorageOperation]);

  // Check for recoverable session on mount
  useEffect(() => {
    if (!enableSessionRecovery || hasRecoveredSession) return;

    const savedData = loadSessionData();
    if (savedData && savedData.businessName === businessName) {
      // Check if the session is recent (within last hour)
      const isRecent = Date.now() - savedData.timestamp < 60 * 60 * 1000;
      if (isRecent && savedData.pageData && Object.keys(savedData.pageData).length > 0) {
        setHasRecoveredSession(true);
        
        // Show subtle recovery notification
        toast({
          title: "Session Restored",
          description: "Your previous editing session has been recovered.",
          duration: 3000,
        });
      }
    }
  }, [enableSessionRecovery, hasRecoveredSession, loadSessionData, businessName, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // If there are unsaved changes, warn the user
      const timeSinceLastSave = Date.now() - lastSaveRef.current;
      if (timeSinceLastSave < 2000) { // If saved within last 2 seconds, assume unsaved changes
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    saveSession: debouncedSave,
    loadSession: loadSessionData,
    clearSession: clearSessionData,
    isAutoSaving,
    hasRecoveredSession,
    sessionId
  };
};
