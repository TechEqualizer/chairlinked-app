import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { 
  Copy, 
  Palette, 
  Zap, 
  Users, 
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';

interface DemoFactoryEnhancementsProps {
  sectionData: any;
  onUpdate: (updates: any) => void;
  isAdmin?: boolean;
  initiallyVisible?: boolean;
  hideDemoFactoryTools?: boolean;
  isProductionPreview?: boolean;
  readOnly?: boolean;
}

const DemoFactoryEnhancements: React.FC<DemoFactoryEnhancementsProps> = ({
  sectionData,
  onUpdate,
  isAdmin = false,
  initiallyVisible = false,
  hideDemoFactoryTools = false,
  isProductionPreview = false,
  readOnly = false
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyVisible);
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();

  // Check for pending save operations after auth recovery
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const pendingSave = sessionStorage.getItem('pendingDemoSave');
      if (pendingSave) {
        try {
          const saveData = JSON.parse(pendingSave);
          const saveAge = Date.now() - saveData.timestamp;
          
          // Only restore saves from the last 10 minutes
          if (saveAge < 10 * 60 * 1000) {
            console.log('[DemoFactoryEnhancements] Found pending save, restoring...', saveData);
            
            // Clear the pending save
            sessionStorage.removeItem('pendingDemoSave');
            
            // Restore the data and trigger the appropriate save action
            onUpdate(saveData.data);
            
            // Wait a moment for the data to be set, then trigger save
            setTimeout(() => {
              if (saveData.action === 'saveDraft') {
                console.log('[DemoFactoryEnhancements] Automatically resuming draft save...');
                handleSaveDraft();
              } else if (saveData.action === 'markReady') {
                console.log('[DemoFactoryEnhancements] Automatically resuming mark ready...');
                handleMarkReady();
              }
            }, 100);
          } else {
            // Save is too old, clear it
            sessionStorage.removeItem('pendingDemoSave');
            console.log('[DemoFactoryEnhancements] Pending save expired, cleared');
          }
        } catch (e) {
          console.error('[DemoFactoryEnhancements] Failed to parse pending save:', e);
          sessionStorage.removeItem('pendingDemoSave');
        }
      }
    }
  }, [isAuthenticated, authLoading]);

  // Demo factory quick actions
  const handleQuickStylePreset = (preset: string) => {
    const presets = {
      'professional': {
        brandColor: '#1E3A8A',
        backgroundColor: '#F8FAFC',
        tagline: 'Professional Beauty Services',
        description: 'Elevate your look with our expert stylists and premium treatments.'
      },
      'modern': {
        brandColor: '#7C3AED',
        backgroundColor: '#FAFAFA',
        tagline: 'Modern Hair & Beauty',
        description: 'Contemporary styling with cutting-edge techniques and trends.'
      },
      'luxury': {
        brandColor: '#B91C1C',
        backgroundColor: '#FFFBEB',
        tagline: 'Luxury Beauty Experience',
        description: 'Indulge in premium treatments and personalized luxury service.'
      },
      'minimalist': {
        brandColor: '#059669',
        backgroundColor: '#FFFFFF',
        tagline: 'Clean Beauty Studio',
        description: 'Simple, natural beauty treatments in a serene environment.'
      }
    };

    const selectedPreset = presets[preset as keyof typeof presets];
    if (selectedPreset) {
      onUpdate(selectedPreset);
    }
  };

  const handleDuplicateDemo = () => {
    // Would integrate with demo management system
    console.log('Duplicating demo with current settings');
  };

  const handleSaveDraft = async () => {
    try {
      // Check authentication first using React context
      if (authLoading) {
        if (window.alert) {
          window.alert('Please wait, checking authentication...');
        }
        return;
      }

      // Simplified authentication check using AuthUtils
      console.log('[DemoFactoryEnhancements] Context auth state:', { isAuthenticated, authLoading });
      
      // Use the robust AuthUtils for authentication check
      const { AuthUtils } = await import('../../generator/services/utils/authUtils');
      const currentUser = await AuthUtils.getCurrentUser();
      
      if (!currentUser) {
        console.log('[DemoFactoryEnhancements] Authentication failed - no current user');
        
        // Simple auth failure handling
        if (window.confirm('Please log in to save your demo. Would you like to log in now? (Click Cancel to continue without saving)')) {
          // Save the current demo data to sessionStorage before redirect
          sessionStorage.setItem('pendingDemoSave', JSON.stringify({
            data: sectionData,
            timestamp: Date.now(),
            action: 'saveDraft'
          }));
          navigate('/auth?returnTo=' + encodeURIComponent(window.location.pathname));
        }
        return;
      }
      
      console.log('[DemoFactoryEnhancements] Authentication successful:', {
        userId: currentUser.id,
        userEmail: currentUser.email
      });

      // Import the EnhancedDemoSaveService dynamically to avoid circular imports
      console.log('[DemoFactoryEnhancements] About to import EnhancedDemoSaveService...');
      const serviceModule = await import('../../generator/services/EnhancedDemoSaveService');
      console.log('[DemoFactoryEnhancements] Service module imported:', serviceModule);
      
      const { EnhancedDemoSaveService } = serviceModule;
      console.log('[DemoFactoryEnhancements] EnhancedDemoSaveService extracted:', EnhancedDemoSaveService);
      
      // Update status to draft and set timestamp
      const draftData = {
        ...sectionData,
        _demoStatus: 'draft',
        _lastModified: new Date().toISOString()
      };

      console.log('[DemoFactoryEnhancements] Prepared draft data:', {
        businessName: draftData.businessName,
        hasExistingId: !!sectionData._demoId,
        demoId: sectionData._demoId,
        draftDataKeys: Object.keys(draftData)
      });

      // Save to database with draft status
      const saveOptions = {
        existingDemoId: sectionData._demoId,
        isEditingExisting: !!sectionData._demoId,
        maxRetries: 3
      };
      
      console.log('[DemoFactoryEnhancements] About to call saveDemo with options:', saveOptions);
      console.log('[DemoFactoryEnhancements] Service method exists?', typeof EnhancedDemoSaveService.saveDemo);
      
      const result = await EnhancedDemoSaveService.saveDemo(draftData, saveOptions);
      
      console.log('[DemoFactoryEnhancements] Raw result received from saveDemo:', result);
      console.log('[DemoFactoryEnhancements] Result type check:', typeof result);

      console.log('[DemoFactoryEnhancements] Save result:', result);

      if (result.success) {
        // Update local data with saved demo information
        onUpdate({
          ...draftData,
          _demoId: result.demoId
        });

        console.log('[DemoFactoryEnhancements] Draft saved successfully:', result);
        
        // Show success feedback with options
        if (window.confirm) {
          const goToDashboard = window.confirm(
            `Draft saved successfully! Demo ID: ${result.demoId}\n\n` +
            `Click OK to view in Demo Factory Dashboard, or Cancel to continue editing.`
          );
          
          if (goToDashboard) {
            navigate('/admin/demo-factory');
          }
        } else {
          if (window.alert) {
            window.alert(`Draft saved successfully! Demo ID: ${result.demoId}`);
          }
        }
      } else {
        // Improved error handling with clear categorization
        console.error('[DemoFactoryEnhancements] Save failed:', {
          result,
          error: result?.error,
          requiresAuth: result?.requiresAuth,
          success: result?.success
        });
        
        // Categorize error types for better user messaging
        let errorMessage = '';
        let shouldRedirectToAuth = false;
        
        if (result?.requiresAuth) {
          errorMessage = 'Your session has expired. Please log in again to save your demo.';
          shouldRedirectToAuth = true;
        } else if (result?.error) {
          if (result.error.includes('permission') || result.error.includes('denied')) {
            errorMessage = 'Permission denied. You may not have access to edit this demo.';
          } else if (result.error.includes('validation')) {
            errorMessage = 'Data validation failed. Please check your demo content and try again.';
          } else if (result.error.includes('network') || result.error.includes('fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
          } else {
            errorMessage = `Save failed: ${result.error}`;
          }
        } else {
          errorMessage = 'An unexpected error occurred while saving. Please try again.';
        }
        
        console.log('[DemoFactoryEnhancements] User-friendly error:', errorMessage);
        
        if (window.alert) {
          window.alert(errorMessage);
        }
        
        // Handle authentication redirect
        if (shouldRedirectToAuth) {
          // Save current state before redirecting
          sessionStorage.setItem('pendingDemoSave', JSON.stringify({
            data: sectionData,
            timestamp: Date.now(),
            action: 'saveDraft'
          }));
          navigate('/auth?returnTo=' + encodeURIComponent(window.location.pathname));
        }
      }
    } catch (error) {
      console.error('[DemoFactoryEnhancements] Error saving draft:', error);
      if (window.alert) {
        window.alert(`Error saving draft: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
      }
    }
  };

  const handleMarkReady = async () => {
    try {
      // Check authentication first using React context
      if (authLoading) {
        if (window.alert) {
          window.alert('Please wait, checking authentication...');
        }
        return;
      }

      // Simplified authentication check using AuthUtils
      console.log('[DemoFactoryEnhancements] Context auth state:', { isAuthenticated, authLoading });
      
      // Use the robust AuthUtils for authentication check
      const { AuthUtils } = await import('../../generator/services/utils/authUtils');
      const currentUser = await AuthUtils.getCurrentUser();
      
      if (!currentUser) {
        console.log('[DemoFactoryEnhancements] Authentication failed - no current user');
        
        // Simple auth failure handling
        if (window.confirm('Please log in to mark demo as ready. Would you like to log in now? (Click Cancel to continue without saving)')) {
          // Save the current demo data to sessionStorage before redirect
          sessionStorage.setItem('pendingDemoSave', JSON.stringify({
            data: sectionData,
            timestamp: Date.now(),
            action: 'markReady'
          }));
          navigate('/auth?returnTo=' + encodeURIComponent(window.location.pathname));
        }
        return;
      }
      
      console.log('[DemoFactoryEnhancements] Authentication successful for mark ready:', {
        userId: currentUser.id,
        userEmail: currentUser.email
      });

      // Import the EnhancedDemoSaveService dynamically to avoid circular imports
      const { EnhancedDemoSaveService } = await import('../../generator/services/EnhancedDemoSaveService');
      
      // Update status to ready and set timestamp
      const readyData = {
        ...sectionData,
        _demoStatus: 'ready',
        _lastModified: new Date().toISOString()
      };

      console.log('[DemoFactoryEnhancements] Marking demo as ready:', {
        businessName: readyData.businessName,
        hasExistingId: !!sectionData._demoId,
        demoId: sectionData._demoId
      });

      // Save to database with ready status
      const result = await EnhancedDemoSaveService.saveDemo(readyData, {
        existingDemoId: sectionData._demoId,
        isEditingExisting: !!sectionData._demoId,
        maxRetries: 3
      });

      console.log('[DemoFactoryEnhancements] Mark ready result:', result);

      if (result.success) {
        // Update local data with saved demo information
        onUpdate({
          ...readyData,
          _demoId: result.demoId
        });

        console.log('[DemoFactoryEnhancements] Demo marked as ready successfully:', result);
        
        // Show success feedback with options
        if (window.confirm) {
          const goToDashboard = window.confirm(
            `Demo marked as ready successfully! Demo ID: ${result.demoId}\n\n` +
            `Click OK to view in Demo Factory Dashboard, or Cancel to continue editing.`
          );
          
          if (goToDashboard) {
            navigate('/admin/demo-factory');
          }
        } else {
          if (window.alert) {
            window.alert(`Demo marked as ready successfully! Demo ID: ${result.demoId}`);
          }
        }
      } else {
        // Improved error handling with clear categorization
        console.error('[DemoFactoryEnhancements] Failed to mark demo as ready:', {
          result,
          error: result?.error,
          requiresAuth: result?.requiresAuth,
          success: result?.success
        });
        
        // Categorize error types for better user messaging
        let errorMessage = '';
        let shouldRedirectToAuth = false;
        
        if (result?.requiresAuth) {
          errorMessage = 'Your session has expired. Please log in again to mark demo as ready.';
          shouldRedirectToAuth = true;
        } else if (result?.error) {
          if (result.error.includes('permission') || result.error.includes('denied')) {
            errorMessage = 'Permission denied. You may not have access to edit this demo.';
          } else if (result.error.includes('validation')) {
            errorMessage = 'Data validation failed. Please check your demo content and try again.';
          } else if (result.error.includes('network') || result.error.includes('fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
          } else {
            errorMessage = `Failed to mark demo as ready: ${result.error}`;
          }
        } else {
          errorMessage = 'An unexpected error occurred while marking demo as ready. Please try again.';
        }
        
        console.log('[DemoFactoryEnhancements] User-friendly error:', errorMessage);
        
        if (window.alert) {
          window.alert(errorMessage);
        }
        
        // Handle authentication redirect
        if (shouldRedirectToAuth) {
          // Save current state before redirecting
          sessionStorage.setItem('pendingDemoSave', JSON.stringify({
            data: sectionData,
            timestamp: Date.now(),
            action: 'markReady'
          }));
          navigate('/auth?returnTo=' + encodeURIComponent(window.location.pathname));
        }
      }
    } catch (error) {
      console.error('[DemoFactoryEnhancements] Error marking demo as ready:', error);
      if (window.alert) {
        window.alert(`Error marking demo as ready: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
      }
    }
  };

  const getQualityScore = () => {
    let score = 0;
    let total = 0;

    // Check for complete business info
    if (sectionData.businessName) { score++; } total++;
    if (sectionData.tagline) { score++; } total++;
    if (sectionData.description) { score++; } total++;
    if (sectionData.brandColor) { score++; } total++;
    if (sectionData.heroImage || sectionData.backgroundImage) { score++; } total++;

    return Math.round((score / total) * 100);
  };

  // Enhanced context detection to prevent showing on live demo sites
  const currentUrl = window.location;
  const pathname = currentUrl.pathname;
  const search = currentUrl.search;
  
  // Explicit override - if hideDemoFactoryTools is true, never show
  if (hideDemoFactoryTools) return null;
  
  // Don't show if not admin
  if (!isAdmin) return null;
  
  // Don't show in production preview mode (when admins are viewing live sites)
  if (isProductionPreview) return null;
  
  // Don't show in read-only mode
  if (readOnly) return null;
  
  // Check for contexts where we definitely SHOULD NOT show the tools
  const isLiveDemoSite = pathname.startsWith('/demo/') || 
                        pathname.match(/^\/[a-zA-Z0-9-]+$/) ||  // matches /:slug pattern
                        pathname.startsWith('/site/');
  
  const isPublicSiteView = !pathname.includes('template8-generator') && 
                          !pathname.includes('admin') && 
                          !pathname.includes('editor') &&
                          !search.includes('mode=edit') &&
                          !search.includes('mode=advanced') &&
                          !search.includes('source=demo-factory');
  
  // If we're on a live demo site or public site view, don't show
  if (isLiveDemoSite || isPublicSiteView) return null;
  
  // Only show Demo Factory Tools in explicit editing contexts
  const isInEditingContext = pathname.includes('template8-generator') || 
                            pathname.includes('admin') ||
                            pathname.includes('editor') ||
                            search.includes('mode=edit') ||
                            search.includes('mode=advanced') ||
                            search.includes('source=demo-factory') ||
                            search.includes('skip-form=true');

  // Final safety check - must be in editing context
  if (!isInEditingContext) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Collapsed State - Just Toggle Button */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          size="sm"
          className="bg-gray-800/95 backdrop-blur text-white border border-gray-600 hover:bg-gray-700"
        >
          <Settings className="w-4 h-4 mr-2" />
          Demo Tools
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      )}

      {/* Expanded State - Full Panel */}
      {isExpanded && (
        <div className="bg-gray-800/95 backdrop-blur text-white p-4 rounded-xl border border-gray-600 shadow-xl max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-semibold">Demo Factory Tools</h4>
              <Badge variant="secondary" className="text-xs bg-blue-600 text-white">
                Internal
              </Badge>
            </div>
            <Button
              onClick={() => setIsExpanded(false)}
              size="sm"
              variant="ghost"
              className="p-1 h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
          </div>

          {/* Quality Score */}
          <div className="mb-4 p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-300">Demo Quality</span>
              <span className="text-sm font-medium text-green-400">{getQualityScore()}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${getQualityScore()}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Style Presets */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-gray-300">Quick Presets</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[
                { key: 'professional', label: 'Professional', color: 'bg-blue-600' },
                { key: 'modern', label: 'Modern', color: 'bg-purple-600' },
                { key: 'luxury', label: 'Luxury', color: 'bg-red-600' },
                { key: 'minimalist', label: 'Minimal', color: 'bg-green-600' }
              ].map(({ key, label, color }) => (
                <Button
                  key={key}
                  size="sm"
                  onClick={() => handleQuickStylePreset(key)}
                  className={`${color} hover:opacity-80 text-white text-xs h-7`}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Demo Actions */}
          <div className="space-y-2">
            <Button
              size="sm"
              onClick={handleDuplicateDemo}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white text-xs"
            >
              <Copy className="w-3 h-3 mr-2" />
              Duplicate Demo
            </Button>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleMarkReady}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Mark Ready
              </Button>
              
              <Button
                size="sm"
                onClick={handleSaveDraft}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
              >
                <Clock className="w-3 h-3 mr-1" />
                Save Draft
              </Button>
            </div>
          </div>

          {/* Team Info */}
          <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Demo Factory Team</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <FileText className="w-3 h-3" />
              <span>Site ID: {sectionData._demoId || 'New Demo'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoFactoryEnhancements;