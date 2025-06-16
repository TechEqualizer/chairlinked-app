
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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

export const useEnhancedDemoRecovery = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<EnhancedRecoveryState>({
    showRecoveryMessage: false,
    hasValidRecovery: false,
    editingDemoSite: null,
    isRecoveryComplete: false,
    recoverySource: 'none',
    hasRecoveredSession: false,
    isEditingExistingDemo: false
  });

  useEffect(() => {
    const editMode = searchParams.get('mode');
    const isTemplatePreview = searchParams.get('preview') === 'true';
    
    console.log('[useEnhancedDemoRecovery] Starting recovery check:', {
      editMode,
      isTemplatePreview,
      hasSessionStorage: !!sessionStorage.getItem('editingDemoSite'),
      hasTemplatePreview: !!sessionStorage.getItem('templatePreview')
    });
    
    // Priority 1: Template preview mode
    if (isTemplatePreview) {
      const templatePreviewData = sessionStorage.getItem('templatePreview');
      if (templatePreviewData) {
        try {
          const parsedData = JSON.parse(templatePreviewData);
          console.log('[useEnhancedDemoRecovery] Template preview data found:', {
            templateId: parsedData.templateId,
            templateName: parsedData.templateName,
            hasConfig: !!parsedData.templateConfig
          });
          
          if (parsedData.templateConfig) {
            setState(prev => ({
              ...prev,
              editingDemoSite: parsedData,
              isRecoveryComplete: true,
              recoverySource: 'template',
              hasValidRecovery: true,
              hasRecoveredSession: true,
              isEditingExistingDemo: false,
              recoveredData: parsedData.templateConfig
            }));
            return;
          }
        } catch (error) {
          console.error('[useEnhancedDemoRecovery] Error parsing template preview data:', error);
          sessionStorage.removeItem('templatePreview');
        }
      }
    }
    
    // Priority 2: Demo editing mode
    if (editMode === 'edit') {
      const demoSiteData = sessionStorage.getItem('editingDemoSite');
      console.log('[useEnhancedDemoRecovery] Checking edit mode, raw session data:', demoSiteData);
      
      if (demoSiteData) {
        try {
          const parsedData = JSON.parse(demoSiteData);
          console.log('[useEnhancedDemoRecovery] Parsed demo site data:', {
            hasConfig: !!parsedData.config,
            businessName: parsedData.config?.businessName || parsedData.businessName,
            demoId: parsedData.id || parsedData.demoId,
            loadSource: parsedData.recoveryMetadata?.loadSource,
            isEditingExisting: parsedData.isEditingExisting
          });
          
          // Validate the data structure for demo editing
          if ((parsedData.id || parsedData.demoId) && parsedData.config) {
            console.log('[useEnhancedDemoRecovery] Valid demo editing data found');
            
            setState(prev => ({ 
              ...prev, 
              editingDemoSite: parsedData,
              isRecoveryComplete: true,
              recoverySource: 'database',
              hasValidRecovery: true,
              hasRecoveredSession: true,
              isEditingExistingDemo: true,
              demoId: parsedData.id || parsedData.demoId,
              recoveredData: parsedData.config
            }));
            
            // Show recovery message for demo editing
            setState(prev => ({
              ...prev,
              showRecoveryMessage: true
            }));
            
            setTimeout(() => {
              setState(prev => ({ ...prev, showRecoveryMessage: false }));
            }, 5000);
            
            return;
          } else {
            console.warn('[useEnhancedDemoRecovery] Invalid demo editing data structure:', {
              hasId: !!(parsedData.id || parsedData.demoId),
              hasConfig: !!parsedData.config,
              parsedData
            });
          }
        } catch (error) {
          console.error('[useEnhancedDemoRecovery] Failed to parse demo site data:', error);
          sessionStorage.removeItem('editingDemoSite');
        }
      } else {
        console.log('[useEnhancedDemoRecovery] No editingDemoSite found in sessionStorage for edit mode');
      }
    }
    
    // Mark recovery as complete if no special modes
    setState(prev => ({ ...prev, isRecoveryComplete: true }));
  }, [searchParams]);

  const handleDismissRecoveryMessage = () => {
    setState(prev => ({ ...prev, showRecoveryMessage: false }));
  };

  const clearRecovery = () => {
    setState(prev => ({
      ...prev,
      hasValidRecovery: false,
      hasRecoveredSession: false,
      isEditingExistingDemo: false,
      recoveredData: null,
      demoId: undefined,
      editingDemoSite: null
    }));
    sessionStorage.removeItem('editingDemoSite');
    sessionStorage.removeItem('templatePreview');
  };

  return {
    ...state,
    handleDismissRecoveryMessage,
    clearRecovery
  };
};
