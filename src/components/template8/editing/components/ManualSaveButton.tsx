import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Check, Loader2, Archive, LogIn, Edit, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { EnhancedDemoSaveService } from '@/components/template8/generator/services/EnhancedDemoSaveService';
import { DemoIdUtils } from '@/components/template8/generator/services/utils/demoIdUtils';

interface ManualSaveButtonProps {
  onSave: () => Promise<void>;
  isDirty?: boolean;
  isAutoSaving?: boolean;
  className?: string;
  pageData?: any;
  onSaveSuccessNavigate?: () => void;
  skipNavigationOnSave?: boolean;
}

export const ManualSaveButton: React.FC<ManualSaveButtonProps> = ({
  onSave,
  isDirty = false,
  isAutoSaving = false,
  className = "",
  pageData,
  onSaveSuccessNavigate,
  skipNavigationOnSave = false
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveAttempt, setLastSaveAttempt] = useState<Date | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, loading: authLoading } = useAuthContext();

  // Detect if we're in edit mode
  const urlParams = new URLSearchParams(location.search);
  const isEditMode = urlParams.get('mode') === 'edit' || pageData?._isEditingExisting;

  const handleSaveAction = async () => {
    if (isSaving || isAutoSaving || authLoading) return;

    // Check authentication first
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your demo",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Validate business name
    if (!pageData?.businessName || pageData.businessName.trim() === '') {
      toast({
        title: "Missing business name",
        description: "Please enter a business name before saving",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSaving(true);
    setLastSaveAttempt(new Date());

    try {
      console.log('[ManualSaveButton] Starting enhanced save process with current data:', {
        demoId: pageData._demoId,
        businessName: pageData.businessName,
        isAuthenticated,
        isEditMode,
        hasHeroImage: !!pageData.heroImage,
        pageDataKeys: Object.keys(pageData || {}),
        skipNavigationOnSave
      });

      // Call the provided onSave - if it exists, it handles the complete save process
      if (onSave) {
        console.log('[ManualSaveButton] Calling onSave to handle save process');
        await onSave();
        
        // If onSave succeeded, show success message and return
        const successMessage = isEditMode ? "Changes saved successfully!" : "Demo created successfully!";
        
        toast({
          title: successMessage,
          description: skipNavigationOnSave ? "Your changes have been saved." : "Redirecting to admin dashboard...",
          duration: 2000,
        });

        // Only navigate if skipNavigationOnSave is false
        if (!skipNavigationOnSave) {
          setTimeout(() => {
            if (onSaveSuccessNavigate) {
              onSaveSuccessNavigate();
            } else {
              navigate('/admin');
            }
          }, 1000);
        }
        
        setLastSaveAttempt(new Date());
        return; // Exit early since onSave handled everything
      }

      // Fallback: Use the enhanced save service directly (when no onSave provided)
      console.log('[ManualSaveButton] No onSave provided, using EnhancedDemoSaveService directly');
      
      // Recover demo ID if needed
      const recoveredDemoId = DemoIdUtils.recoverDemoId(pageData);
      if (recoveredDemoId && recoveredDemoId !== pageData._demoId) {
        console.log('[ManualSaveButton] Recovered demo ID:', recoveredDemoId);
        // Update pageData with recovered ID
        if (pageData) {
          pageData._demoId = recoveredDemoId;
        }
      }
      
      console.log('[ManualSaveButton] Calling EnhancedDemoSaveService with data:', {
        businessName: pageData.businessName,
        demoId: recoveredDemoId || pageData._demoId,
        isEditMode,
        heroImage: pageData.heroImage
      });

      const result = await EnhancedDemoSaveService.saveDemo(pageData, {
        existingDemoId: recoveredDemoId || pageData._demoId,
        isEditingExisting: isEditMode,
        maxRetries: 3
      });
      
      if (result.success) {
        const successMessage = isEditMode ? "Changes saved successfully!" : "Demo created successfully!";
        
        toast({
          title: successMessage,
          description: skipNavigationOnSave ? "Your changes have been saved." : "Redirecting to admin dashboard...",
          duration: 2000,
        });

        // Only navigate if skipNavigationOnSave is false
        if (!skipNavigationOnSave) {
          setTimeout(() => {
            if (onSaveSuccessNavigate) {
              onSaveSuccessNavigate();
            } else {
              navigate('/admin');
            }
          }, 1000);
        }
      } else {
        console.error('[ManualSaveButton] Enhanced save failed:', result.error);
        
        // Categorize errors for better user experience
        let errorTitle = "Save failed";
        let errorDescription = result.error || "Unable to save demo";
        
        if (result.requiresAuth) {
          errorTitle = "Authentication required";
          errorDescription = "Please log in to save demos";
        } else if (result.error?.includes('validation')) {
          errorTitle = "Data validation error";
          errorDescription = "Please check your input and try again";
        } else if (result.error?.includes('permission')) {
          errorTitle = "Permission denied";
          errorDescription = "You don't have permission to save this demo";
        } else if (result.error?.includes('network') || result.error?.includes('fetch')) {
          errorTitle = "Network error";
          errorDescription = "Please check your connection and try again";
        }
        
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
          duration: 7000,
        });
      }
    } catch (error) {
      console.error('[ManualSaveButton] Unexpected save error:', error);
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred. Please try again or contact support.",
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoginPrompt = () => {
    navigate('/auth');
  };

  const isDisabled = isSaving || isAutoSaving || authLoading;

  // Show login button if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          onClick={handleLoginPrompt}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2"
          size="default"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login to Save Demo
        </Button>
      </div>
    );
  }

  // Show enhanced save button with status indicators
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={handleSaveAction}
        disabled={isDisabled}
        className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 relative"
        size="default"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isEditMode ? 'Saving Changes...' : 'Saving Demo...'}
          </>
        ) : (
          <>
            {isEditMode ? (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Archive className="w-4 h-4 mr-2" />
                Save as Demo
              </>
            )}
          </>
        )}
      </Button>
      
      {/* Auto-saving indicator */}
      {isAutoSaving && (
        <div className="flex items-center text-xs text-blue-600">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Auto-saving
        </div>
      )}
      
      {/* Last save indicator */}
      {lastSaveAttempt && !isSaving && (
        <div className="flex items-center text-xs text-gray-500">
          <Check className="w-3 h-3 mr-1" />
          Saved {lastSaveAttempt.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};
