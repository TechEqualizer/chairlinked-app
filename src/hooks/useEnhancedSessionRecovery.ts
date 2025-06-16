
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export type RecoverySource = 'none' | 'demoSite' | 'sessionData' | 'businessName' | 'demoId' | 'database' | 'template';

interface EnhancedRecoveryState {
  showRecoveryMessage: boolean;
  hasValidRecovery: boolean;
  editingDemoSite: any;
  isRecoveryComplete: boolean;
  recoverySource: RecoverySource;
  recoveredData?: any;
  hasRecoveredSession: boolean;
  isEditingExistingDemo: boolean;
  demoId?: string;
}

export const useEnhancedSessionRecovery = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [state, setState] = useState<EnhancedRecoveryState>({
    showRecoveryMessage: false,
    hasValidRecovery: false,
    editingDemoSite: null,
    isRecoveryComplete: false,
    recoverySource: 'none',
    hasRecoveredSession: false,
    isEditingExistingDemo: false
  });

  // Enhanced session monitoring
  const monitorSessionHealth = useCallback(() => {
    const sessionKeys = [
      'editingDemoSite',
      'templatePreview',
      'demo-recovery-',
      'business-recovery-'
    ];

    const healthCheck = sessionKeys.reduce((acc, key) => {
      const data = key.includes('-') 
        ? Object.keys(sessionStorage).filter(k => k.startsWith(key))
        : sessionStorage.getItem(key);
      acc[key] = !!data;
      return acc;
    }, {} as Record<string, boolean>);

    console.log('[SessionRecovery] Health check:', healthCheck);
    return healthCheck;
  }, []);

  // Backup current session data
  const createSessionBackup = useCallback((data: any, source: string) => {
    try {
      const backup = {
        data,
        source,
        timestamp: Date.now(),
        url: window.location.href,
        searchParams: Object.fromEntries(searchParams.entries())
      };
      
      sessionStorage.setItem('session-backup', JSON.stringify(backup));
      localStorage.setItem('session-backup-persistent', JSON.stringify(backup));
      
      console.log('[SessionRecovery] Created backup:', { source, timestamp: backup.timestamp });
    } catch (error) {
      console.warn('[SessionRecovery] Failed to create backup:', error);
    }
  }, [searchParams]);

  // Attempt recovery from backup
  const attemptBackupRecovery = useCallback(() => {
    try {
      const sessionBackup = sessionStorage.getItem('session-backup');
      const persistentBackup = localStorage.getItem('session-backup-persistent');
      
      const backup = sessionBackup ? JSON.parse(sessionBackup) : 
                     persistentBackup ? JSON.parse(persistentBackup) : null;

      if (backup && backup.data) {
        const timeDiff = Date.now() - backup.timestamp;
        const isRecent = timeDiff < 5 * 60 * 1000; // 5 minutes

        if (isRecent) {
          console.log('[SessionRecovery] Attempting backup recovery:', {
            source: backup.source,
            age: Math.round(timeDiff / 1000) + 's'
          });

          return {
            data: backup.data,
            source: 'backup' as RecoverySource,
            isRecent: true
          };
        }
      }
    } catch (error) {
      console.warn('[SessionRecovery] Backup recovery failed:', error);
    }
    
    return null;
  }, []);

  useEffect(() => {
    const editMode = searchParams.get('mode');
    const isTemplatePreview = searchParams.get('preview') === 'true';
    
    console.log('[SessionRecovery] Enhanced recovery check:', {
      editMode,
      isTemplatePreview,
      url: window.location.href
    });

    // Monitor session health
    monitorSessionHealth();
    
    // Priority 1: Template preview mode
    if (isTemplatePreview) {
      const templatePreviewData = sessionStorage.getItem('templatePreview');
      if (templatePreviewData) {
        try {
          const parsedData = JSON.parse(templatePreviewData);
          console.log('[SessionRecovery] Template preview recovery successful');
          
          setState(prev => ({
            ...prev,
            editingDemoSite: parsedData,
            isRecoveryComplete: true,
            recoverySource: 'template',
            hasValidRecovery: true,
            hasRecoveredSession: true,
            recoveredData: parsedData.templateConfig
          }));

          createSessionBackup(parsedData, 'template-preview');
          return;
        } catch (error) {
          console.error('[SessionRecovery] Template preview data corrupted:', error);
          sessionStorage.removeItem('templatePreview');
        }
      }
    }
    
    // Priority 2: Demo editing mode
    if (editMode === 'edit') {
      const demoSiteData = sessionStorage.getItem('editingDemoSite');
      
      if (demoSiteData) {
        try {
          const parsedData = JSON.parse(demoSiteData);
          console.log('[SessionRecovery] Demo editing recovery successful:', {
            demoId: parsedData.id || parsedData.demoId,
            businessName: parsedData.config?.businessName,
            hasConfig: !!parsedData.config
          });
          
          setState(prev => ({ 
            ...prev, 
            editingDemoSite: parsedData,
            isRecoveryComplete: true,
            recoverySource: 'database',
            hasValidRecovery: true,
            hasRecoveredSession: true,
            isEditingExistingDemo: true,
            demoId: parsedData.id || parsedData.demoId,
            recoveredData: parsedData.config,
            // Don't show recovery message for edit mode - go straight to editing
            showRecoveryMessage: false
          }));

          createSessionBackup(parsedData, 'demo-editing');
          
          // Don't show toast for edit mode - just proceed silently
          console.log('[SessionRecovery] Demo editing session restored, proceeding to editing mode');
          
          return;
        } catch (error) {
          console.error('[SessionRecovery] Demo editing data corrupted:', error);
          sessionStorage.removeItem('editingDemoSite');
        }
      } else {
        console.warn('[SessionRecovery] Edit mode detected but no demo site data found');
      }
    }

    // Priority 3: Backup recovery (only for non-edit modes)
    if (editMode !== 'edit') {
      const backupRecovery = attemptBackupRecovery();
      if (backupRecovery) {
        console.log('[SessionRecovery] Backup recovery successful');
        
        setState(prev => ({
          ...prev,
          editingDemoSite: backupRecovery.data,
          isRecoveryComplete: true,
          recoverySource: backupRecovery.source,
          hasValidRecovery: true,
          hasRecoveredSession: true,
          recoveredData: backupRecovery.data.config || backupRecovery.data.templateConfig,
          showRecoveryMessage: true
        }));

        toast({
          title: "Session Recovered",
          description: "Your previous editing session has been recovered from backup.",
          duration: 4000,
        });

        return;
      }
    }
    
    // Mark recovery as complete
    setState(prev => ({ ...prev, isRecoveryComplete: true }));
  }, [searchParams, monitorSessionHealth, createSessionBackup, attemptBackupRecovery, toast]);

  const handleDismissRecoveryMessage = useCallback(() => {
    setState(prev => ({ ...prev, showRecoveryMessage: false }));
  }, []);

  const clearRecovery = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasValidRecovery: false,
      hasRecoveredSession: false,
      isEditingExistingDemo: false,
      recoveredData: null,
      demoId: undefined,
      editingDemoSite: null
    }));
    
    // Clear all session storage
    const keysToRemove = [
      'editingDemoSite',
      'templatePreview',
      'session-backup'
    ];
    
    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });
    
    // Clear recovery-specific keys
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('demo-recovery-') || key.startsWith('business-recovery-')) {
        sessionStorage.removeItem(key);
      }
    });

    console.log('[SessionRecovery] Recovery data cleared');
  }, []);

  // Expose session monitoring for debugging
  const getSessionDebugInfo = useCallback(() => {
    return {
      sessionHealth: monitorSessionHealth(),
      currentState: state,
      backupAvailable: !!sessionStorage.getItem('session-backup'),
      persistentBackupAvailable: !!localStorage.getItem('session-backup-persistent')
    };
  }, [monitorSessionHealth, state]);

  return {
    ...state,
    handleDismissRecoveryMessage,
    clearRecovery,
    createSessionBackup,
    getSessionDebugInfo
  };
};
