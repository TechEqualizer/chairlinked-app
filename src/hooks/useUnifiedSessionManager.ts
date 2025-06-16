
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DemoIdUtils } from '@/components/template8/generator/services/utils/demoIdUtils';

export type RecoverySource = 'none' | 'demoSite' | 'sessionData' | 'businessName' | 'demoId' | 'database' | 'template';

interface UnifiedSessionState {
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

export const useUnifiedSessionManager = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [state, setState] = useState<UnifiedSessionState>({
    showRecoveryMessage: false,
    hasValidRecovery: false,
    editingDemoSite: null,
    isRecoveryComplete: false,
    recoverySource: 'none',
    hasRecoveredSession: false,
    isEditingExistingDemo: false
  });

  // Enhanced session backup with validation
  const createSessionBackup = useCallback((data: any, source: string) => {
    try {
      // Clean data before backup
      const cleanedData = DemoIdUtils.cleanInvalidDemoIds(data);
      
      const backup = {
        data: cleanedData,
        source,
        timestamp: Date.now(),
        url: window.location.href,
        searchParams: Object.fromEntries(searchParams.entries()),
        demoId: DemoIdUtils.sanitizeDemoId(cleanedData._demoId || cleanedData.demoId)
      };
      
      sessionStorage.setItem('session-backup', JSON.stringify(backup));
      localStorage.setItem('session-backup-persistent', JSON.stringify(backup));
      
      console.log('[UnifiedSessionManager] Created enhanced backup:', { 
        source, 
        timestamp: backup.timestamp,
        demoId: backup.demoId 
      });
    } catch (error) {
      console.warn('[UnifiedSessionManager] Failed to create backup:', error);
    }
  }, [searchParams]);

  // Enhanced session recovery with comprehensive validation and debugging
  useEffect(() => {
    const editMode = searchParams.get('mode');
    const isTemplatePreview = searchParams.get('preview') === 'true';
    
    console.log('[UnifiedSessionManager] Enhanced recovery check START:', {
      editMode,
      isTemplatePreview,
      url: window.location.href,
      sessionKeys: Object.keys(sessionStorage)
    });
    
    // Priority 1: Template preview mode
    if (isTemplatePreview) {
      console.log('[UnifiedSessionManager] Processing template preview mode');
      const templatePreviewData = sessionStorage.getItem('templatePreview');
      if (templatePreviewData) {
        try {
          const parsedData = JSON.parse(templatePreviewData);
          console.log('[UnifiedSessionManager] Template preview recovery successful');
          
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
          console.error('[UnifiedSessionManager] Template preview data corrupted:', error);
          sessionStorage.removeItem('templatePreview');
        }
      }
      console.log('[UnifiedSessionManager] No template preview data found');
    }
    
    // Priority 2: Demo editing mode with enhanced validation and debugging
    if (editMode === 'edit') {
      console.log('[UnifiedSessionManager] Processing edit mode');
      const demoSiteData = sessionStorage.getItem('editingDemoSite');
      
      console.log('[UnifiedSessionManager] Raw demo site data:', demoSiteData ? 'found' : 'not found');
      
      if (demoSiteData) {
        try {
          const parsedData = JSON.parse(demoSiteData);
          console.log('[UnifiedSessionManager] Parsed demo data structure:', {
            hasId: !!(parsedData.id || parsedData.demoId),
            hasConfig: !!parsedData.config,
            configKeys: parsedData.config ? Object.keys(parsedData.config) : [],
            businessName: parsedData.config?.businessName || parsedData.businessName,
            recoveryMetadata: parsedData.recoveryMetadata
          });
          
          // Enhanced validation of demo editing data
          const demoId = DemoIdUtils.sanitizeDemoId(
            parsedData.id || parsedData.demoId || parsedData.config?.id || parsedData.config?._demoId
          );
          
          if (demoId && parsedData.config) {
            console.log('[UnifiedSessionManager] Demo editing recovery successful with ID:', demoId);
            
            // Clean the config data
            const cleanedConfig = DemoIdUtils.cleanInvalidDemoIds(parsedData.config);
            cleanedConfig._demoId = demoId;
            
            console.log('[UnifiedSessionManager] Setting recovery state for edit mode');
            setState(prev => ({ 
              ...prev, 
              editingDemoSite: parsedData,
              isRecoveryComplete: true,
              recoverySource: 'database',
              hasValidRecovery: true,
              hasRecoveredSession: true,
              isEditingExistingDemo: true,
              demoId: demoId,
              recoveredData: cleanedConfig,
              showRecoveryMessage: false // Don't show message for edit mode - go straight to editing
            }));

            createSessionBackup(cleanedConfig, 'demo-editing');
            
            console.log('[UnifiedSessionManager] Edit mode recovery completed successfully');
            
            return;
          } else {
            console.warn('[UnifiedSessionManager] Invalid demo editing data structure:', {
              hasDemoId: !!demoId,
              hasConfig: !!parsedData.config,
              rawData: parsedData
            });
            
            // Clear invalid session data
            sessionStorage.removeItem('editingDemoSite');
            
            toast({
              title: "Loading Error",
              description: "Demo data is corrupted. Returning to dashboard.",
              variant: "destructive",
            });
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              window.location.href = '/admin';
            }, 2000);
            
            return;
          }
        } catch (error) {
          console.error('[UnifiedSessionManager] Demo editing data corrupted:', error);
          sessionStorage.removeItem('editingDemoSite');
          
          toast({
            title: "Loading Error", 
            description: "Failed to load demo data. Returning to dashboard.",
            variant: "destructive",
          });
          
          setTimeout(() => {
            window.location.href = '/admin';
          }, 2000);
          
          return;
        }
      } else {
        console.warn('[UnifiedSessionManager] Edit mode but no editingDemoSite found in session');
        
        toast({
          title: "No Demo Data",
          description: "No demo data found to edit. Returning to dashboard.",
          variant: "destructive",
        });
        
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
        
        return;
      }
    }

    // Priority 3: Enhanced backup recovery
    try {
      const sessionBackup = sessionStorage.getItem('session-backup');
      const persistentBackup = localStorage.getItem('session-backup-persistent');
      
      const backup = sessionBackup ? JSON.parse(sessionBackup) : 
                     persistentBackup ? JSON.parse(persistentBackup) : null;

      if (backup && backup.data) {
        const timeDiff = Date.now() - backup.timestamp;
        const isRecent = timeDiff < 10 * 60 * 1000; // 10 minutes

        if (isRecent) {
          console.log('[UnifiedSessionManager] Enhanced backup recovery successful:', {
            source: backup.source,
            age: Math.round(timeDiff / 1000) + 's',
            demoId: backup.demoId
          });

          // Validate and clean backup data
          const cleanedData = DemoIdUtils.cleanInvalidDemoIds(backup.data);
          
          setState(prev => ({
            ...prev,
            editingDemoSite: backup,
            isRecoveryComplete: true,
            recoverySource: 'sessionData',
            hasValidRecovery: true,
            hasRecoveredSession: true,
            recoveredData: cleanedData,
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
    } catch (error) {
      console.warn('[UnifiedSessionManager] Backup recovery failed:', error);
    }
    
    // Mark recovery as complete
    console.log('[UnifiedSessionManager] Recovery process completed - no data found');
    setState(prev => ({ ...prev, isRecoveryComplete: true }));
  }, [searchParams, createSessionBackup, toast]);

  const handleDismissRecoveryMessage = useCallback(() => {
    setState(prev => ({ ...prev, showRecoveryMessage: false }));
  }, []);

  const clearSession = useCallback(() => {
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
    
    localStorage.removeItem('session-backup-persistent');
    
    console.log('[UnifiedSessionManager] Enhanced session cleared');
  }, []);

  const getSessionDebugInfo = useCallback(() => {
    return {
      ...state,
      sessionStorage: {
        editingDemoSite: !!sessionStorage.getItem('editingDemoSite'),
        templatePreview: !!sessionStorage.getItem('templatePreview'),
        sessionBackup: !!sessionStorage.getItem('session-backup')
      },
      validDemoId: DemoIdUtils.sanitizeDemoId(state.demoId)
    };
  }, [state]);

  return {
    ...state,
    createSessionBackup,
    handleDismissRecoveryMessage,
    clearSession,
    getSessionDebugInfo
  };
};
