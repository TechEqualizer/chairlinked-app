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
}

const DemoFactoryEnhancements: React.FC<DemoFactoryEnhancementsProps> = ({
  sectionData,
  onUpdate,
  isAdmin = false,
  initiallyVisible = false
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
            
            // Restore the data and trigger the save
            if (saveData.action === 'saveDraft') {
              // Update the component data first
              onUpdate(saveData.data);
              
              // Wait a moment for the data to be set, then trigger save
              setTimeout(() => {
                console.log('[DemoFactoryEnhancements] Automatically resuming draft save...');
                handleSaveDraft();
              }, 100);
            }
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

      // Always verify authentication directly with Supabase before saving
      console.log('[DemoFactoryEnhancements] Context auth state:', { isAuthenticated, authLoading });
      
      // Direct Supabase authentication check to ensure client is synchronized
      const { supabase } = await import('@/integrations/supabase/client');
      
      // First try to get the session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('[DemoFactoryEnhancements] Session check first:', {
        hasSession: !!sessionData.session,
        sessionError: sessionError?.message
      });
      
      // If no session, try refreshing before checking user
      if (!sessionData.session) {
        console.log('[DemoFactoryEnhancements] No session, trying refresh...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshData.session) {
          console.log('[DemoFactoryEnhancements] Session refreshed successfully');
        } else {
          console.log('[DemoFactoryEnhancements] Session refresh failed:', refreshError?.message);
        }
      }
      
      // Now check for user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      console.log('[DemoFactoryEnhancements] Final auth check:', {
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email,
        authError: authError?.message
      });
      
      if (authError || !user) {
        console.error('[DemoFactoryEnhancements] Authentication failed - Supabase auth check:', {
          authError,
          authErrorMessage: authError?.message,
          authErrorCode: authError?.code,
          hasUser: !!user,
          userDetails: user
        });
        
        // Try to get session directly
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        console.log('[DemoFactoryEnhancements] Session check:', {
          hasSession: !!sessionData.session,
          sessionError: sessionError?.message,
          sessionExpiry: sessionData.session?.expires_at,
          currentTime: Date.now() / 1000
        });
        
        // If no session, try to restore from storage and refresh
        if (!sessionData.session) {
          console.log('[DemoFactoryEnhancements] No session found, attempting recovery...');
          
          // Try to refresh the session first
          try {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            console.log('[DemoFactoryEnhancements] Session refresh attempt:', {
              hasNewSession: !!refreshData.session,
              hasNewUser: !!refreshData.user,
              refreshError: refreshError?.message
            });
            
            if (refreshData.session && refreshData.user) {
              console.log('[DemoFactoryEnhancements] Session successfully refreshed, retrying save...');
              // Session refreshed successfully, we can proceed with the save
              // Don't return here, let the function continue with the save logic
            } else {
              throw new Error('Session refresh failed');
            }
          } catch (refreshErr) {
            console.error('[DemoFactoryEnhancements] Session refresh failed:', refreshErr);
            
            // As a last resort, check if AuthProvider can help
            if (window.confirm('Your session has expired. Would you like to log in again to save your demo? (Click Cancel to continue without saving)')) {
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
        } else {
          // Session exists but auth check failed - this shouldn't happen
          console.error('[DemoFactoryEnhancements] Session exists but auth check failed - this is unexpected');
          if (window.alert) {
            window.alert('Authentication error. Please refresh the page and try again.');
          }
          return;
        }
      }
      
      // Force refresh the session to ensure it's valid
      try {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        console.log('[DemoFactoryEnhancements] Session refresh result:', {
          hasSession: !!refreshData.session,
          hasUser: !!refreshData.user,
          refreshError: refreshError?.message
        });
        
        if (refreshError && refreshError.message !== 'Auth session missing!') {
          console.warn('[DemoFactoryEnhancements] Session refresh warning:', refreshError);
        }
      } catch (refreshErr) {
        console.warn('[DemoFactoryEnhancements] Session refresh failed:', refreshErr);
      }

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
        // Comprehensive error logging
        console.error('[DemoFactoryEnhancements] Save failed - Full analysis:', {
          result,
          resultType: typeof result,
          resultConstructor: result?.constructor?.name,
          resultKeys: result ? Object.keys(result) : 'null',
          resultValues: result ? Object.entries(result) : 'null',
          error: result?.error,
          requiresAuth: result?.requiresAuth,
          success: result?.success,
          isResultTruthy: !!result,
          isResultObject: typeof result === 'object',
          isResultNull: result === null
        });
        
        // Force detailed console output
        if (result) {
          console.log('[DemoFactoryEnhancements] Raw result object:', result);
          console.log('[DemoFactoryEnhancements] Result stringified:', JSON.stringify(result, null, 2));
        }
        
        // Provide more specific error messages
        let errorMessage = 'Save failed: ';
        if (result?.requiresAuth) {
          errorMessage = 'Authentication required. Please log in to save your demo.';
        } else if (result?.error) {
          errorMessage += result.error;
        } else if (result && typeof result === 'object') {
          // Truncate long JSON for alert display
          const jsonStr = JSON.stringify(result, null, 2);
          errorMessage += jsonStr.length > 200 ? 
            jsonStr.substring(0, 200) + '...' : 
            jsonStr;
        } else {
          errorMessage += `Unexpected result type: ${typeof result}`;
        }
        
        console.log('[DemoFactoryEnhancements] Final error message:', errorMessage);
        
        if (window.alert) {
          window.alert(errorMessage);
        }
        
        // If authentication is required, navigate to login
        if (result?.requiresAuth) {
          navigate('/auth');
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

      // Double-check authentication using both context and direct Supabase call
      if (!isAuthenticated) {
        console.warn('[DemoFactoryEnhancements] Context shows not authenticated, checking Supabase directly...');
        
        // Try direct authentication check as fallback
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.error('[DemoFactoryEnhancements] Authentication failed:', error);
          if (window.alert) {
            window.alert('Authentication required. Please log in to save your demo.');
          }
          // Navigate to auth page using React Router
          navigate('/auth');
          return;
        }
        
        console.log('[DemoFactoryEnhancements] Direct auth check passed, user found:', user.id);
      }

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
        console.error('[DemoFactoryEnhancements] Failed to mark demo as ready:', {
          result,
          resultType: typeof result,
          resultKeys: result ? Object.keys(result) : 'null',
          error: result?.error,
          requiresAuth: result?.requiresAuth,
          success: result?.success
        });
        
        // Provide more specific error messages
        let errorMessage = 'Failed to mark demo as ready: ';
        if (result?.requiresAuth) {
          errorMessage = 'Authentication required. Please log in to save your demo.';
        } else if (result?.error) {
          errorMessage += result.error;
        } else if (typeof result === 'object' && result !== null) {
          errorMessage += JSON.stringify(result);
        } else {
          errorMessage += 'Unknown error occurred';
        }
        
        console.log('[DemoFactoryEnhancements] Error message:', errorMessage);
        
        if (window.alert) {
          window.alert(errorMessage);
        }
        
        // If authentication is required, navigate to login
        if (result.requiresAuth) {
          navigate('/auth');
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

  // Only show Demo Factory Tools in editing contexts, not on live demo sites
  const isInEditingContext = window.location.pathname.includes('template8-generator') || 
                            window.location.pathname.includes('admin') ||
                            window.location.search.includes('mode=');

  // Don't show on live demo pages or if not admin
  if (!isAdmin || !isInEditingContext) return null;

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