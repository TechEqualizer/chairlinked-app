import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Type, 
  Palette, 
  Image, 
  Maximize2,
  Zap,
  Edit3,
  Check,
  Clock,
  AlertCircle,
  Save,
  RefreshCw
} from 'lucide-react';
import { useQuickEditorSync } from '../hooks/useEditorSync';
import { useEditorSyncContext } from '../context/EditorSyncProvider';

interface QuickEditSidebarProps {
  selectedElement: any;
  sectionData: any;
  onDataUpdate: (updates: any) => void;
  onSwitchToProfessional: () => void;
  onSave?: () => Promise<void>;
  // Legacy support - will be phased out
  legacyMode?: boolean;
}

interface EnhancedSelectedElement {
  id: string;
  type: string;
  element: HTMLElement;
  selector: string;
  sectionId: string;
  sectionName: string;
  elementRole: string;
  dataPath: string;
  properties: Record<string, any>;
}

// Mapping between element roles and Template8Data properties
const ELEMENT_TO_DATA_MAPPING = {
  'title': 'heroTitle',
  'subtitle': 'heroSubtitle', 
  'description': 'description',
  'tagline': 'tagline',
  'cta': 'heroCtaText',
  'business-name': 'businessName',
  'heading': 'sectionHeading',
  'hero-image': 'heroImage',
  'story-text': 'storyText',
  'story-title': 'storyTitle',
  'testimonial-text': 'testimonialText',
  'author': 'testimonialAuthor',
  'gallery-title': 'galleryTitle',
  'caption': 'imageCaption'
};

// Color property mapping for different elements
const COLOR_PROPERTY_MAPPING = {
  'title': 'heroTitleColor',
  'subtitle': 'heroSubtitleColor',
  'heading': 'headingColor', 
  'description': 'textColor',
  'tagline': 'taglineColor',
  'story-text': 'storyTextColor',
  'story-title': 'storyTitleColor',
  'testimonial-text': 'testimonialTextColor',
  'author': 'testimonialAuthorColor',
  'gallery-title': 'galleryTitleColor',
  'caption': 'captionColor',
  'paragraph': 'textColor',
  'text': 'textColor'
};

const QuickEditSidebar: React.FC<QuickEditSidebarProps> = ({
  selectedElement,
  sectionData,
  onDataUpdate,
  onSwitchToProfessional,
  onSave,
  legacyMode = true // Force legacy mode to prevent infinite loops
}) => {
  // DISABLED: New unified state management - causing infinite loops
  // TODO: Fix sync system integration with legacy callbacks
  const syncAPI = null; // useQuickEditorSync({
  //   autoSave: {
  //     enabled: true,
  //     debounceMs: 500,
  //     onSave: async (data) => {
  //       // Bridge to legacy onDataUpdate for compatibility
  //       onDataUpdate(data);
  //     }
  //   },
  //   performance: {
  //     batchUpdates: true,
  //     throttleMs: 100
  //   }
  // });

  const syncContext = useEditorSyncContext();

  // Local state for text inputs with better management
  const [localTextContent, setLocalTextContent] = useState('');
  const [isActivelyEditing, setIsActivelyEditing] = useState(false);
  
  // Manual save state management
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Use refs to avoid stale closures in debounced functions (legacy mode)
  const onDataUpdateRef = useRef(onDataUpdate);
  const sectionDataRef = useRef(sectionData);
  
  // Update refs when props change (legacy mode)
  useEffect(() => {
    onDataUpdateRef.current = onDataUpdate;
    sectionDataRef.current = sectionData;
  }, [onDataUpdate, sectionData]);

  // Update local state when selectedElement changes
  useEffect(() => {
    if (selectedElement?.properties?.textContent) {
      setLocalTextContent(selectedElement.properties.textContent);
      setIsActivelyEditing(false);
    }
  }, [selectedElement?.id]);

  // Sync selected element with unified state
  useEffect(() => {
    if (selectedElement && !legacyMode && syncAPI) {
      syncAPI.setSelectedElement({
        id: selectedElement.id,
        section: selectedElement.sectionId,
        element: selectedElement.elementRole,
        properties: selectedElement.properties
      });
    }
  }, [selectedElement, syncAPI, legacyMode]);

  // Enhanced update function that uses either unified system or legacy
  const updateData = useCallback((updates: any, immediate: boolean = false) => {
    // Mark that we have unsaved changes
    setHasUnsavedChanges(true);
    setSaveStatus('idle');
    
    if (legacyMode) {
      // Legacy debounced update
      if (immediate) {
        onDataUpdateRef.current(updates);
      } else {
        // Use the old debouncing logic
        setTimeout(() => {
          onDataUpdateRef.current(updates);
        }, 500);
      }
    } else if (syncAPI) {
      // Use unified sync system
      console.log('[QuickEditSidebar] Using unified sync for updates:', updates);
      syncAPI.updateData(updates, {
        immediate,
        source: 'quick-edit-sidebar',
        timestamp: Date.now()
      });
    } else {
      // Fallback to legacy if syncAPI is null
      onDataUpdateRef.current(updates);
    }
  }, [legacyMode, syncAPI]);

  // Manual save function for better sync control
  const handleManualSave = useCallback(async () => {
    if (saveStatus === 'saving') return; // Prevent double saves
    
    try {
      setSaveStatus('saving');
      console.log('[QuickEditSidebar] Manual save triggered');
      
      // Force immediate update of any pending changes
      if (selectedElement) {
        const enhancedElement = selectedElement as EnhancedSelectedElement;
        
        // Handle text content changes
        if (localTextContent !== selectedElement.properties?.textContent) {
          const textDataProperty = ELEMENT_TO_DATA_MAPPING[enhancedElement.elementRole as keyof typeof ELEMENT_TO_DATA_MAPPING];
          if (textDataProperty) {
            onDataUpdateRef.current({ [textDataProperty]: localTextContent });
          }
        }
        
        // Handle hero image changes specifically for sync issues
        if (enhancedElement.elementRole === 'hero-image' && enhancedElement.element.tagName === 'IMG') {
          const currentImageSrc = (enhancedElement.element as HTMLImageElement).src;
          const dataImageSrc = sectionDataRef.current?.heroImage;
          if (currentImageSrc !== dataImageSrc) {
            console.log('[QuickEditSidebar] Manual save: syncing hero image', { 
              currentImageSrc, 
              dataImageSrc 
            });
            onDataUpdateRef.current({ heroImage: currentImageSrc });
          }
        }
      }
      
      // Call the save callback if provided
      if (onSave) {
        await onSave();
      }
      
      // Mark as saved and clear unsaved changes
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      
      // Auto-reset save status after showing success
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
      
      console.log('[QuickEditSidebar] Manual save completed successfully');
    } catch (error) {
      console.error('[QuickEditSidebar] Manual save failed:', error);
      setSaveStatus('error');
      
      // Reset error status after delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  }, [saveStatus, selectedElement, localTextContent, onSave]);

  // Smart property change handler with proper Template8Data mapping
  const handleQuickEdit = (property: string, value: any, immediate: boolean = false) => {
    if (!selectedElement?.element) return;
    
    const element = selectedElement.element as HTMLElement;
    const enhancedElement = selectedElement as EnhancedSelectedElement;
    
    try {
      // Apply immediate visual feedback to DOM
      switch (property) {
        case 'textContent':
          element.textContent = value;
          // Map to correct Template8Data property with section-aware logic
          let textDataProperty = ELEMENT_TO_DATA_MAPPING[enhancedElement.elementRole as keyof typeof ELEMENT_TO_DATA_MAPPING];
          
          // Section-specific text handling for better sync
          if (!textDataProperty) {
            const section = enhancedElement.sectionId;
            const role = enhancedElement.elementRole;
            
            if (section === 'stories') {
              if (role.includes('text') || role.includes('paragraph')) {
                textDataProperty = 'storiesText';
              } else if (role.includes('title') || role.includes('heading')) {
                textDataProperty = 'storiesTitle';
              }
            } else if (section === 'testimonials') {
              if (role.includes('text') || role.includes('quote')) {
                textDataProperty = 'testimonialsText';
              } else if (role.includes('author') || role.includes('name')) {
                textDataProperty = 'testimonialsAuthor';
              }
            } else if (section === 'gallery') {
              if (role.includes('title')) {
                textDataProperty = 'galleryTitle';
              } else if (role.includes('caption')) {
                textDataProperty = 'galleryCaption';
              }
            }
          }
          
          if (textDataProperty) {
            const updates = { [textDataProperty]: value };
            console.log('[QuickEditSidebar] Text update mapping:', { 
              section: enhancedElement.sectionId,
              role: enhancedElement.elementRole, 
              property: textDataProperty, 
              value 
            });
            updateData(updates, immediate);
          } else {
            console.warn('[QuickEditSidebar] No text mapping found for:', { 
              section: enhancedElement.sectionId,
              role: enhancedElement.elementRole 
            });
          }
          break;
          
        case 'color':
          element.style.color = value;
          // Map to correct color property in Template8Data with section-aware logic
          let colorProperty = COLOR_PROPERTY_MAPPING[enhancedElement.elementRole as keyof typeof COLOR_PROPERTY_MAPPING];
          
          // Section-specific color handling for better sync
          if (!colorProperty) {
            const section = enhancedElement.sectionId;
            const role = enhancedElement.elementRole;
            
            if (section === 'stories') {
              if (role.includes('text') || role.includes('paragraph')) {
                colorProperty = 'storiesTextColor';
              } else if (role.includes('title') || role.includes('heading')) {
                colorProperty = 'storiesTitleColor';
              } else {
                colorProperty = 'storiesTextColor'; // fallback for stories section
              }
            } else if (section === 'testimonials') {
              if (role.includes('text') || role.includes('quote')) {
                colorProperty = 'testimonialsTextColor';
              } else if (role.includes('author') || role.includes('name')) {
                colorProperty = 'testimonialsAuthorColor';
              } else {
                colorProperty = 'testimonialsTextColor';
              }
            } else if (section === 'gallery') {
              colorProperty = 'galleryTextColor';
            } else {
              // Generic fallback based on element type
              if (role.includes('heading') || role.includes('title')) {
                colorProperty = 'headingColor';
              } else {
                colorProperty = 'textColor';
              }
            }
          }
          
          const colorUpdates = { [colorProperty]: value };
          console.log('[QuickEditSidebar] Color update mapping:', { 
            section: enhancedElement.sectionId,
            role: enhancedElement.elementRole, 
            property: colorProperty, 
            value 
          });
          updateData(colorUpdates, true); // Color changes are immediate
          break;
          
        case 'fontSize':
          element.style.fontSize = value;
          // Store fontSize in a way that syncs with fullscreen editor
          const fontSizeProperty = `${enhancedElement.elementRole}FontSize`;
          updateData({ [fontSizeProperty]: value }, true);
          break;
          
        case 'fontWeight':
          element.style.fontWeight = value;
          const fontWeightProperty = `${enhancedElement.elementRole}FontWeight`;
          updateData({ [fontWeightProperty]: value }, true);
          break;
          
        case 'backgroundColor':
          element.style.backgroundColor = value;
          if (enhancedElement.elementRole === 'cta') {
            updateData({ ctaBackgroundColor: value }, true);
          }
          break;
          
        case 'imageSource':
          if (element.tagName === 'IMG') {
            (element as HTMLImageElement).src = value;
            if (enhancedElement.elementRole === 'hero-image') {
              // Special handling for hero image sync
              console.log('[QuickEditSidebar] Hero image updated:', { value, immediate: true });
              updateData({ heroImage: value }, true);
              // Mark as unsaved to enable manual sync
              setHasUnsavedChanges(true);
            } else {
              // For other images, try to update the images array
              const imageIndex = parseInt(enhancedElement.id.split('-').pop() || '0');
              const currentImages = legacyMode ? sectionDataRef.current.images : syncAPI.data.images || [];
              const updatedImages = [...currentImages];
              if (updatedImages[imageIndex]) {
                updatedImages[imageIndex] = { ...updatedImages[imageIndex], url: value };
                updateData({ images: updatedImages }, true);
              }
            }
          }
          break;
      }
    } catch (error) {
      console.error(`[QuickEditSidebar] Error in quick edit ${property}:`, error);
    }
  };

  // Enhanced text input handler with editing state management
  const handleTextInputChange = (value: string) => {
    setLocalTextContent(value);
    setIsActivelyEditing(true);
    
    // Apply immediate visual feedback
    if (selectedElement?.element) {
      selectedElement.element.textContent = value;
    }
    
    // Use debounced update for data persistence
    handleQuickEdit('textContent', value, false);
  };

  // Handle focus events to manage editing state
  const handleInputFocus = () => {
    setIsActivelyEditing(true);
    setSaveStatus('idle');
  };

  const handleInputBlur = () => {
    setIsActivelyEditing(false);
    // Force immediate save on blur
    if (selectedElement) {
      const enhancedElement = selectedElement as EnhancedSelectedElement;
      const textDataProperty = ELEMENT_TO_DATA_MAPPING[enhancedElement.elementRole as keyof typeof ELEMENT_TO_DATA_MAPPING];
      if (textDataProperty) {
        updateData({ [textDataProperty]: localTextContent }, true);
      }
    }
  };

  // Render save status indicator using unified sync system
  const renderSaveStatus = () => {
    if (legacyMode) {
      // Legacy mode - simple status display
      if (!isActivelyEditing) return null;
      return (
        <span className="ml-auto text-xs text-blue-400 flex items-center gap-1">
          <Clock className="w-2 h-2" />
          Typing...
        </span>
      );
    }

    // New unified system status
    const { syncStatus, isAutoSaving, hasUnsavedChanges } = syncAPI;
    
    if (!isActivelyEditing && !hasUnsavedChanges && syncStatus === 'synced') return null;
    
    const statusConfig = {
      syncing: { text: 'Syncing...', color: 'text-blue-400', icon: Clock },
      saving: { text: 'Saving...', color: 'text-yellow-400', icon: Clock },
      saved: { text: 'Synced', color: 'text-green-400', icon: Check },
      synced: { text: 'Synced', color: 'text-green-400', icon: Check },
      conflict: { text: 'Conflict', color: 'text-red-400', icon: AlertCircle },
      error: { text: 'Error', color: 'text-red-400', icon: AlertCircle }
    };
    
    let currentStatus = syncStatus;
    if (isAutoSaving) currentStatus = 'saving';
    if (isActivelyEditing) currentStatus = 'syncing';
    
    const config = statusConfig[currentStatus] || statusConfig.synced;
    const IconComponent = config.icon;
    
    return (
      <span className={`ml-auto text-xs ${config.color} flex items-center gap-1`}>
        <IconComponent className={`w-2 h-2 ${isAutoSaving || isActivelyEditing ? 'animate-pulse' : ''}`} />
        {config.text}
      </span>
    );
  };

  if (!selectedElement) {
    return (
      <div className="h-full bg-gray-800 text-white p-6">
        <div className="text-center py-8">
          {/* Call to Action for Professional Mode */}
          <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-700 mb-6">
            <Maximize2 className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <h3 className="text-lg font-semibold mb-2 text-blue-300">Need Professional Editing?</h3>
            <p className="text-gray-300 text-sm mb-4">
              For advanced editing with full controls, brand management, and professional layouts
            </p>
            <Button
              onClick={onSwitchToProfessional}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Open Professional Editor
            </Button>
          </div>

          {/* Quick Edit Instructions */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <Settings className="w-8 h-8 mx-auto mb-3 text-gray-400" />
            <h3 className="text-sm font-semibold mb-2">Quick Edit Mode</h3>
            <p className="text-gray-400 text-xs mb-3">Click any element to make quick changes:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>📝 Text: Click to edit content</p>
              <p>🖼️ Images: Click to change source</p>
              <p>🎨 Colors: Quick color adjustments</p>
            </div>
            <p className="text-blue-400 text-xs mt-3">Changes sync automatically with Professional Editor</p>
          </div>
        </div>
      </div>
    );
  }

  const enhancedElement = selectedElement as EnhancedSelectedElement;

  return (
    <div className="h-full bg-gray-800 text-white flex flex-col">
      {/* Quick Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-blue-300">
            Quick Edit: {enhancedElement.elementRole}
          </h3>
          <div className="flex items-center gap-2">
            {/* Manual Save Button */}
            <Button
              onClick={handleManualSave}
              disabled={saveStatus === 'saving' || (!hasUnsavedChanges && saveStatus !== 'error')}
              size="sm"
              className={`text-xs px-2 py-1 h-6 flex items-center gap-1 ${
                saveStatus === 'saved' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : saveStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : hasUnsavedChanges
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
              }`}
              title={
                saveStatus === 'saved' 
                  ? 'Changes saved and synced!' 
                  : saveStatus === 'error'
                  ? 'Save failed - click to retry'
                  : hasUnsavedChanges 
                  ? 'Save changes and sync with fullscreen editor'
                  : 'No changes to save'
              }
            >
              {saveStatus === 'saving' ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : saveStatus === 'saved' ? (
                <Check className="w-3 h-3" />
              ) : saveStatus === 'error' ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              {saveStatus === 'saving' ? 'Saving...' : 
               saveStatus === 'saved' ? 'Saved!' : 
               saveStatus === 'error' ? 'Retry' : 'Save'}
            </Button>
            
            <Button
              onClick={onSwitchToProfessional}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-6"
            >
              <Maximize2 className="w-3 h-3 mr-1" />
              Pro
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Section: {enhancedElement.sectionName}
          </p>
          {/* Save status indicator */}
          <div className="flex items-center gap-1 text-xs">
            {hasUnsavedChanges ? (
              <span className="text-orange-400 flex items-center gap-1">
                <Clock className="w-2 h-2" />
                Unsaved changes
              </span>
            ) : saveStatus === 'saved' ? (
              <span className="text-green-400 flex items-center gap-1">
                <Check className="w-2 h-2" />
                Synced
              </span>
            ) : (
              <span className="text-gray-500 flex items-center gap-1">
                <Check className="w-2 h-2" />
                Up to date
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Edit Controls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Text Content - Most Common Edit */}
        {enhancedElement.properties?.textContent && (
          <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-700">
            <Label className="text-xs text-blue-300 font-medium flex items-center gap-2 mb-2">
              <Type className="w-3 h-3" />
              Text Content
              {renderSaveStatus()}
            </Label>
            {enhancedElement.elementRole === 'title' || enhancedElement.elementRole === 'description' ? (
              <Textarea
                value={localTextContent}
                onChange={(e) => handleTextInputChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="bg-gray-700 border-gray-600 text-white text-sm resize-none"
                rows={enhancedElement.elementRole === 'title' ? 2 : 3}
                placeholder="Edit text..."
              />
            ) : (
              <Input
                value={localTextContent}
                onChange={(e) => handleTextInputChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="bg-gray-700 border-gray-600 text-white text-sm"
                placeholder="Edit text..."
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              Changes sync automatically with Professional Editor
            </p>
          </div>
        )}

        {/* Quick Color Changes */}
        <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-700">
          <Label className="text-xs text-purple-300 font-medium flex items-center gap-2 mb-2">
            <Palette className="w-3 h-3" />
            Quick Colors
          </Label>
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-gray-400">Text Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  value={enhancedElement.properties?.color || '#000000'}
                  onChange={(e) => handleQuickEdit('color', e.target.value, true)}
                  className="w-12 h-8 p-1 rounded border-gray-600"
                />
                <Button
                  size="sm"
                  onClick={() => handleQuickEdit('color', sectionData.brandColor || '#3B82F6', true)}
                  className="text-xs bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 flex-1"
                >
                  Use Brand Color
                </Button>
              </div>
            </div>
            
            {(enhancedElement.type === 'button' || enhancedElement.elementRole === 'cta') && (
              <div>
                <Label className="text-xs text-gray-400">Button Background</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="color"
                    value={enhancedElement.properties?.backgroundColor || '#3B82F6'}
                    onChange={(e) => handleQuickEdit('backgroundColor', e.target.value, true)}
                    className="w-12 h-8 p-1 rounded border-gray-600"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleQuickEdit('backgroundColor', sectionData.brandColor || '#3B82F6', true)}
                    className="text-xs bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 flex-1"
                  >
                    Brand Style
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Quick Edit */}
        {enhancedElement.type === 'image' && (
          <div className="bg-orange-900/20 p-3 rounded-lg border border-orange-700">
            <Label className="text-xs text-orange-300 font-medium flex items-center gap-2 mb-2">
              <Image className="w-3 h-3" />
              Image Source
            </Label>
            <Input
              value={enhancedElement.properties?.imageSource || ''}
              onChange={(e) => handleQuickEdit('imageSource', e.target.value, true)}
              className="bg-gray-700 border-gray-600 text-white text-xs"
              placeholder="Image URL..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Changes sync immediately with Professional Editor
            </p>
          </div>
        )}

        {/* Professional Editor Promotion */}
        <div className="bg-green-900/20 p-3 rounded-lg border border-green-700">
          <Label className="text-xs text-green-300 font-medium flex items-center gap-2 mb-2">
            <Zap className="w-3 h-3" />
            Need More Control?
          </Label>
          <p className="text-xs text-gray-400 mb-3">
            For typography, layouts, backgrounds, and advanced styling
          </p>
          <Button
            onClick={onSwitchToProfessional}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white w-full text-xs"
          >
            <Edit3 className="w-3 h-3 mr-2" />
            Open Professional Editor
          </Button>
        </div>

        {/* Manual Save & Sync Control */}
        <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-700">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-blue-300 font-medium">
                Manual Save & Sync
              </p>
              <p className="text-xs text-gray-400">
                Use "Save" button for immediate sync control
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              saveStatus === 'saved'
                ? 'bg-green-400'
                : saveStatus === 'saving'
                ? 'bg-blue-400 animate-pulse'
                : saveStatus === 'error'
                ? 'bg-red-400'
                : hasUnsavedChanges
                ? 'bg-orange-400 animate-pulse'
                : 'bg-gray-400'
            }`}></div>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={handleManualSave}
              disabled={saveStatus === 'saving' || (!hasUnsavedChanges && saveStatus !== 'error')}
              size="sm"
              className={`w-full text-xs ${
                saveStatus === 'saved' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : saveStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : hasUnsavedChanges
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                  Saving & Syncing...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="w-3 h-3 mr-2" />
                  Successfully Synced!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="w-3 h-3 mr-2" />
                  Retry Save & Sync
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <Save className="w-3 h-3 mr-2" />
                  Save & Sync Changes
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 mr-2" />
                  All Changes Saved
                </>
              )}
            </Button>
            
            <div className="text-xs text-gray-500">
              {saveStatus === 'saved' ? (
                <p className="text-green-400">✓ Changes synced with Professional Editor</p>
              ) : saveStatus === 'error' ? (
                <p className="text-red-400">✗ Save failed - please try again</p>
              ) : hasUnsavedChanges ? (
                <p className="text-orange-400">⚠ You have unsaved changes</p>
              ) : (
                <p>💡 Make changes and click "Save" to sync with Professional Editor</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickEditSidebar;