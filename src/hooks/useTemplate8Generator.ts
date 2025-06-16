
// CONSOLIDATED TEMPLATE8 GENERATOR HOOK
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedSessionManager } from '@/hooks/useUnifiedSessionManager';
import { EnhancedContentGeneration } from '@/components/template8/generator/services/EnhancedContentGeneration';
import { EnhancedDemoSaveService } from '@/components/template8/generator/services/EnhancedDemoSaveService';
import { GeneratorMode, Template8Data } from '@/components/template8/generator/types/GeneratorTypes';
import { AdminTemplate } from '@/services/templateService';
import { DemoIdUtils } from '@/components/template8/generator/services/utils/demoIdUtils';

// Single source of truth for Template8 generator logic
export const useTemplate8Generator = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuthContext();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isTemplatePreview = searchParams.get('preview') === 'true';
  const templateId = searchParams.get('template');
  const isEditMode = searchParams.get('mode') === 'edit';

  // Enhanced session management
  const {
    hasRecoveredSession,
    recoveredData,
    isEditingExistingDemo,
    demoId,
    recoverySource,
    showRecoveryMessage,
    createSessionBackup,
    clearSession,
    handleDismissRecoveryMessage,
    getSessionDebugInfo
  } = useUnifiedSessionManager();

  // Core state
  const [mode, setMode] = useState<GeneratorMode>(() => {
    if (hasRecoveredSession && recoveredData) return 'template';
    if (isTemplatePreview) return 'template';
    if (isEditMode) return 'template';
    return 'form';
  });

  const [generatedData, setGeneratedData] = useState<Partial<Template8Data> | null>(() => {
    if (recoveredData) {
      const cleanedData = DemoIdUtils.cleanInvalidDemoIds(recoveredData);
      const validDemoId = DemoIdUtils.sanitizeDemoId(cleanedData._demoId);
      if (validDemoId) cleanedData._demoId = validDemoId;
      else delete cleanedData._demoId;
      return cleanedData;
    }
    return null;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSavingDemo, setIsSavingDemo] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(() => {
    return !hasRecoveredSession && !isTemplatePreview && !isEditMode;
  });

  // Update state after session recovery
  useEffect(() => {
    if (hasRecoveredSession && recoveredData && !generatedData) {
      const cleanedData = { ...recoveredData };
      if (cleanedData._demoId && !DemoIdUtils.isValidUUID(cleanedData._demoId)) delete cleanedData._demoId;
      setGeneratedData(cleanedData);
      setMode('template');
      setShowTemplateSelector(false);
    }
  }, [hasRecoveredSession, recoveredData, generatedData]);

  // Auto-save session whenever generatedData changes in template mode
  useEffect(() => {
    if (generatedData && mode === 'template') {
      createSessionBackup(generatedData, `mode-${mode}`);
    }
  }, [generatedData, mode, createSessionBackup]);

  // Form submission handler
  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await EnhancedContentGeneration.generateTemplate8Content(formData);
      if (result.success && result.data) {
        setGeneratedData(result.data);
        setMode('template');
        setShowTemplateSelector(false);
        createSessionBackup(result.data, 'generation');
        toast({
          title: "Generated Successfully",
          description: "Your website has been generated and session saved.",
          duration: 3000,
        });
      } else {
        setError(result.error || 'Failed to generate template');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError('An unexpected error occurred during generation');
    } finally {
      setIsGenerating(false);
    }
  };

  // Template selector handler
  const handleSelectTemplate = (template: AdminTemplate) => {
    if (template.template_config) {
      setGeneratedData(template.template_config);
      setMode('template');
      setShowTemplateSelector(false);
      createSessionBackup(template.template_config, 'template-selection');
    } else {
      toast({
        title: "Error",
        description: "Template configuration is missing",
        variant: "destructive",
      });
    }
  };

  const handleSkipTemplate = () => {
    setShowTemplateSelector(false);
    setMode('form');
  };

  // Data updates with session backup and validation
  const handleUpdate = (updates: Partial<Template8Data>) => {
    const newData = generatedData ? { ...generatedData, ...updates } : updates;
    const cleanedData = DemoIdUtils.cleanInvalidDemoIds(newData);
    setGeneratedData(cleanedData);
    createSessionBackup(cleanedData, 'update');
  };

  // Save handler
  const handleSave = async () => {
    if (!generatedData) {
      toast({
        title: "Error",
        description: "No data to save",
        variant: "destructive",
      });
      return;
    }
    if (!generatedData.businessName || generatedData.businessName.trim() === '') {
      toast({
        title: "Error",
        description: "Business name is required",
        variant: "destructive",
      });
      return;
    }
    setIsSavingDemo(true);
    try {
      const recoveredDemoId = DemoIdUtils.recoverDemoId(generatedData);
      const result = await EnhancedDemoSaveService.saveDemo(generatedData, {
        existingDemoId: recoveredDemoId,
        isEditingExisting: isEditingExistingDemo,
        maxRetries: 3
      });
      if (result.success) {
        toast({
          title: "Success",
          description: "Changes saved successfully",
        });
        createSessionBackup(generatedData, 'save');
      } else {
        // Enhanced error messages
        let errorTitle = "Save Error";
        let errorDescription = result.error || "Failed to save changes";
        if (result.error?.includes('uuid') || result.error?.includes('ID')) {
          errorTitle = "Data Recovery Error";
          errorDescription = "There was an issue with the demo data. The system will create a new demo.";
        } else if (result.requiresAuth) {
          errorTitle = "Authentication Required";
          errorDescription = "Please log in to save changes";
        } else if (result.error?.includes('permission')) {
          errorTitle = "Permission Denied";
          errorDescription = "You don't have permission to modify this demo";
        } else if (result.error?.includes('validation')) {
          errorTitle = "Validation Error";
          errorDescription = "Please check your data and try again";
        }
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
          duration: 7000,
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again or contact support.",
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsSavingDemo(false);
    }
  };

  // Save as demo (admin only)
  const handleSaveAsDemo = async () => {
    if (!isAdmin || !generatedData) return;
    setIsSavingDemo(true);
    try {
      const result = await EnhancedDemoSaveService.saveDemo(generatedData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Demo site created successfully",
        });
        navigate('/admin/sites');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Save as demo error:', error);
      toast({
        title: "Error",
        description: "Failed to create demo site",
        variant: "destructive",
      });
    } finally {
      setIsSavingDemo(false);
    }
  };

  // Navigation handlers (session is preserved)
  const handleBackToForm = () => {
    if (!isTemplatePreview) {
      setMode('form');
      setError(null);
    }
  };

  const handleStartEditing = () => {
    setMode('editing');
    if (generatedData) {
      createSessionBackup(generatedData, 'start-editing');
    }
  };

  const handleCloseEditing = () => {
    setMode('template');
  };

  const handleNavigateToAdmin = () => {
    if (generatedData) {
      createSessionBackup(generatedData, 'navigate-admin');
    }
    navigate('/admin');
  };

  const handleResetToForm = () => {
    if (!isTemplatePreview) {
      setMode('form');
      setGeneratedData(null);
      setError(null);
      clearSession();
      setShowTemplateSelector(true);
    }
  };

  return {
    // State
    mode,
    generatedData,
    isGenerating,
    error,
    isSavingDemo,
    showTemplateSelector,
    isTemplatePreview,
    isEditMode,
    isAdmin,
    showRecoveryMessage,

    // Handlers
    handleGenerate,
    handleSelectTemplate,
    handleSkipTemplate,
    handleUpdate,
    handleSave,
    handleSaveAsDemo,
    handleBackToForm,
    handleStartEditing,
    handleCloseEditing,
    handleNavigateToAdmin,
    handleResetToForm,
    handleDismissRecoveryMessage,

    // Debug utilities
    getSessionDebugInfo
  };
};
