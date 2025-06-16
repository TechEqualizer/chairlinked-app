
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Save, LogIn, Edit } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { EnhancedDemoSaveService } from "../services/EnhancedDemoSaveService";

interface AdminControlsProps {
  onNavigateToAdmin: () => void;
  onSaveAsDemo?: () => void;
  isSavingDemo?: boolean;
  className?: string;
  pageData?: any;
}

const AdminControls: React.FC<AdminControlsProps> = ({
  onNavigateToAdmin,
  onSaveAsDemo,
  isSavingDemo = false,
  className = "",
  pageData
}) => {
  const [isInternalSaving, setIsInternalSaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, loading: authLoading } = useAuthContext();

  // Detect if we're in edit mode
  const urlParams = new URLSearchParams(location.search);
  const isEditMode = urlParams.get('mode') === 'edit' || pageData?._isEditingExisting;

  const handleSaveAction = async () => {
    if (isInternalSaving || isSavingDemo || authLoading) return;

    // Check authentication first
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to save demos",
        variant: "destructive",
        duration: 5000,
      });
      navigate('/auth');
      return;
    }

    // Use provided callback if available (for new demos)
    if (onSaveAsDemo && !isEditMode) {
      onSaveAsDemo();
      return;
    }

    // Handle both new and existing demos with our enhanced service
    if (!pageData || !pageData.businessName) {
      toast({
        title: "No data to save",
        description: "Please generate some content first",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsInternalSaving(true);
    try {
      const result = await EnhancedDemoSaveService.saveDemo(pageData, {
        existingDemoId: pageData._demoId,
        isEditingExisting: isEditMode
      });
      
      if (result.success) {
        toast({
          title: isEditMode ? "Demo updated successfully!" : "Demo saved successfully!",
          description: "Redirecting to admin dashboard...",
          duration: 2000,
        });

        setTimeout(() => {
          onNavigateToAdmin();
        }, 1000);
      } else {
        console.error('[AdminControls] Save failed:', result.error);
        
        toast({
          title: "Save failed",
          description: result.error || "Unable to save demo",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('[AdminControls] Unexpected save error:', error);
      toast({
        title: "Save failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsInternalSaving(false);
    }
  };

  const isSaving = isSavingDemo || isInternalSaving;

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button 
        onClick={handleSaveAction} 
        disabled={isSaving || authLoading} 
        size="sm" 
        className="bg-green-600 hover:bg-green-700"
      >
        {!isAuthenticated && !authLoading ? (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Login to Save
          </>
        ) : (
          <>
            {isEditMode ? (
              <>
                <Edit className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save as Demo'}
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
};

export default AdminControls;
