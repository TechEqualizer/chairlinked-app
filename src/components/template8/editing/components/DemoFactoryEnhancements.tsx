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
      
      // Update status to draft and set timestamp
      const draftData = {
        ...sectionData,
        _demoStatus: 'draft',
        _lastModified: new Date().toISOString()
      };

      console.log('[DemoFactoryEnhancements] Saving draft to database:', {
        businessName: draftData.businessName,
        hasExistingId: !!sectionData._demoId,
        demoId: sectionData._demoId
      });

      // Save to database with draft status
      const result = await EnhancedDemoSaveService.saveDemo(draftData, {
        existingDemoId: sectionData._demoId,
        isEditingExisting: !!sectionData._demoId,
        maxRetries: 3
      });

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
        console.error('[DemoFactoryEnhancements] Failed to save draft:', result);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to save draft: ';
        if (result.requiresAuth) {
          errorMessage = 'Authentication required. Please log in to save your demo.';
        } else if (result.error) {
          errorMessage += result.error;
        } else {
          errorMessage += 'Unknown error occurred';
        }
        
        if (window.alert) {
          window.alert(errorMessage);
        }
        
        // If authentication is required, navigate to login
        if (result.requiresAuth) {
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
        console.error('[DemoFactoryEnhancements] Failed to mark demo as ready:', result);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to mark demo as ready: ';
        if (result.requiresAuth) {
          errorMessage = 'Authentication required. Please log in to save your demo.';
        } else if (result.error) {
          errorMessage += result.error;
        } else {
          errorMessage += 'Unknown error occurred';
        }
        
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

  if (!isAdmin) return null;

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