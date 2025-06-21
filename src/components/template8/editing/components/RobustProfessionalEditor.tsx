import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye, EyeOff, Monitor, Tablet, Smartphone, Undo2, Redo2, Globe, Edit3, Maximize2, Zap } from 'lucide-react';
import RobustVisualEditor from './RobustVisualEditor';
import QuickEditSidebar from './QuickEditSidebar';
import { Template8SectionRenderer } from '../../layout/Template8SectionRenderer';
import EnhancedFullScreenEditingFlow from '../EnhancedFullScreenEditingFlow';
import DemoFactoryEnhancements from './DemoFactoryEnhancements';
import SitePreviewModal from './SitePreviewModal';
import { EditorSyncProvider } from '../context/EditorSyncProvider';
import { useFullscreenEditorSync } from '../hooks/useEditorSync';

interface RobustProfessionalEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
  onClose: () => void;
  siteData?: {
    id: string;
    business_name: string;
    lifecycle_stage: string;
  };
  onSaveSuccessNavigate?: () => void;
}

interface SelectedElement {
  id: string;
  type: string;
  element: HTMLElement;
  selector: string;
  properties: Record<string, any>;
}

interface EnhancedSelectedElement extends SelectedElement {
  sectionId: string;
  sectionName: string;
  elementRole: string;
  dataPath: string;
}

type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

// Internal component that uses the unified sync system
const RobustProfessionalEditorInner: React.FC<RobustProfessionalEditorProps> = ({
  pageData,
  onUpdate,
  onSave,
  onClose,
  siteData,
  onSaveSuccessNavigate
}) => {
  // DISABLED: Use unified sync system - causing infinite loops
  const syncAPI = {
    data: pageData,
    isAutoSaving: false,
    hasUnsavedChanges: false,
    canUndo: false,
    canRedo: false,
    syncStatus: 'synced' as const,
    updateData: (updates: any) => onUpdate(updates),
    undo: () => false,
    redo: () => false,
    save: async () => {
      if (onSave) await onSave();
    }
  }; // Fallback to legacy system

  // Local UI state (not data state - that's handled by syncAPI)
  const [selectedElement, setSelectedElement] = useState<EnhancedSelectedElement | null>(null);
  const [responsiveMode, setResponsiveMode] = useState<ResponsiveMode>('desktop');
  const [overlaysVisible, setOverlaysVisible] = useState(true);
  const [previewMode, setPreviewMode] = useState<'editor' | 'live'>('editor');
  const [editingMode, setEditingMode] = useState<'quick' | 'professional'>('quick');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Use syncAPI data as the source of truth
  const sectionData = syncAPI.data;

  // Handle data updates through unified system
  const handleDataUpdate = useCallback((updates: any) => {
    console.log('[RobustProfessionalEditor] handleDataUpdate called with:', updates);
    syncAPI.updateData(updates, {
      source: 'professional-editor',
      timestamp: Date.now()
    });
  }, [syncAPI]);

  // Handle element selection with enhanced debugging
  const handleElementSelect = useCallback((element: EnhancedSelectedElement) => {
    console.log('[RobustProfessionalEditor] Element selected:', {
      sectionId: element.sectionId,
      sectionName: element.sectionName,
      elementRole: element.elementRole,
      type: element.type,
      dataPath: element.dataPath,
      element: element.element.tagName,
      className: element.element.className
    });
    
    setSelectedElement(element);
  }, []);

  // Undo/Redo through unified system
  const handleUndo = useCallback(() => {
    const success = syncAPI.undo();
    console.log('[RobustProfessionalEditor] Undo result:', success);
  }, [syncAPI]);

  const handleRedo = useCallback(() => {
    const success = syncAPI.redo();
    console.log('[RobustProfessionalEditor] Redo result:', success);
  }, [syncAPI]);

  // Save functionality through unified system
  const handleSave = async () => {
    try {
      await syncAPI.save();
      // Call navigation callback after successful save if provided
      if (onSaveSuccessNavigate) {
        onSaveSuccessNavigate();
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  // Mode switching
  const handleSwitchToProfessional = useCallback(() => {
    setEditingMode('professional');
  }, []);

  const handleReturnToQuickEdit = useCallback(() => {
    setEditingMode('quick');
  }, []);

  const handlePreview = useCallback(() => {
    setShowPreviewModal(true);
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'Escape':
            e.preventDefault();
            setSelectedElement(null);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Responsive frame styles
  const getFrameStyles = () => {
    switch (responsiveMode) {
      case 'mobile':
        return { width: '375px', height: '667px', margin: '0 auto' };
      case 'tablet':
        return { width: '768px', height: '1024px', margin: '0 auto' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  // Render fullscreen professional editor with demo factory enhancements
  if (editingMode === 'professional') {
    return (
      <div className="relative">
        <EnhancedFullScreenEditingFlow
          pageData={sectionData}
          onUpdate={onUpdate}
          onSave={onSave}
          onClose={handleReturnToQuickEdit}
          onQuickEdit={handleReturnToQuickEdit}
          isAdmin={true}
          onSaveSuccessNavigate={onSaveSuccessNavigate}
        />
        <DemoFactoryEnhancements
          sectionData={sectionData}
          onUpdate={onUpdate}
          isAdmin={true}
          initiallyVisible={false}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Enhanced Professional Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm font-medium">{siteData?.business_name}</span>
            <span className="text-xs text-gray-400">• Quick Edit Mode</span>
          </div>

          {/* Professional Mode Button */}
          <Button
            onClick={handleSwitchToProfessional}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7"
          >
            <Maximize2 className="w-3 h-3 mr-1" />
            Professional Editor
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview Mode Toggle */}
          <div className="flex items-center bg-gray-700 rounded-lg p-1">
            {[
              { mode: 'editor', icon: Edit3, label: 'Editor Preview' },
              { mode: 'live', icon: Globe, label: 'Live Preview' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode as 'editor' | 'live')}
                className={`p-2 rounded transition-colors ${
                  previewMode === mode
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Responsive Mode Switcher */}
          <div className="flex items-center bg-gray-700 rounded-lg p-1">
            {([
              { mode: 'desktop', icon: Monitor },
              { mode: 'tablet', icon: Tablet },
              { mode: 'mobile', icon: Smartphone }
            ] as const).map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setResponsiveMode(mode)}
                className={`p-2 rounded transition-colors ${
                  responsiveMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
                title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} view`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={!syncAPI.canUndo}
              className="text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-50"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={!syncAPI.canRedo}
              className="text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-50"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOverlaysVisible(!overlaysVisible)}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
              title="Toggle overlays"
            >
              {overlaysVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
              title="Preview Site"
            >
              <Monitor className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleSave}
              disabled={syncAPI.isAutoSaving}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {syncAPI.isAutoSaving ? 'Saving...' : syncAPI.hasUnsavedChanges ? 'Save Changes' : 'Saved'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor Layout */}
      <div className="flex-1 relative">
        {/* Visual Editor - Full Width with Margin for Sidebar */}
        <div className="absolute inset-0 right-96 bg-gray-100">
          <div className="h-full overflow-auto">
            {/* Site Preview Container */}
            <div 
              className="min-h-full bg-white transition-all duration-300"
              style={responsiveMode === 'desktop' ? {} : getFrameStyles()}
            >
              {previewMode === 'editor' ? (
                <RobustVisualEditor
                  sectionData={sectionData}
                  onElementSelect={handleElementSelect}
                  overlaysVisible={overlaysVisible}
                />
              ) : (
                <div className="relative h-full">
                  {/* Live Preview using Template8SectionRenderer */}
                  <Template8SectionRenderer
                    pageData={pageData}
                    onUpdate={onUpdate}
                    isProductionPreview={true}
                    siteType="demo"
                    visibleSections={['hero', 'gallery', 'testimonials', 'booking', 'footer']}
                  />
                  {/* Overlay to show this is live preview */}
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-2 rounded text-sm z-50">
                    🌐 Live Preview Mode
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unified Quick Edit Sidebar */}
        <div className="absolute top-0 right-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 z-10">
          <QuickEditSidebar
            selectedElement={selectedElement}
            sectionData={sectionData}
            onDataUpdate={handleDataUpdate}
            onSwitchToProfessional={handleSwitchToProfessional}
            onSave={onSave}
            legacyMode={true}
          />
        </div>

        {/* Demo Factory Tools for Quick Edit Mode */}
        <div className="absolute top-4 left-4 z-20">
          <DemoFactoryEnhancements
            sectionData={sectionData}
            onUpdate={onUpdate}
            isAdmin={true}
            initiallyVisible={false}
          />
        </div>
      </div>

      {/* Enhanced Status Bar with Sync Status */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-xs text-gray-400 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-green-400 font-medium">
            ⚡ Unified Quick Edit Mode
          </span>
          <span>•</span>
          <span>
            {selectedElement ? `Editing: ${selectedElement.elementRole || selectedElement.type}` : 'Click any element to edit'}
          </span>
          <span>•</span>
          <span className="capitalize">{responsiveMode} view</span>
          <span>•</span>
          <span className={previewMode === 'live' ? 'text-green-400' : 'text-blue-400'}>
            {previewMode === 'live' ? '🌐 Live Preview' : '✏️ Editor Preview'}
          </span>
          <span>•</span>
          <span className={`${
            syncAPI.syncStatus === 'synced' && !syncAPI.hasUnsavedChanges 
              ? 'text-green-400' 
              : 'text-yellow-400'
          }`}>
            {syncAPI.syncStatus === 'synced' && !syncAPI.hasUnsavedChanges 
              ? '🔄 Synced' 
              : '⏳ Syncing...'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSwitchToProfessional}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-5"
          >
            <Maximize2 className="w-3 h-3 mr-1" />
            Professional Mode
          </Button>
          <span>•</span>
          <span>Ctrl+S to save • Ctrl+Z to undo</span>
        </div>
      </div>

      {/* Site Preview Modal */}
      <SitePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        siteData={sectionData}
        previewUrl={sectionData?._previewUrl}
      />
    </div>
  );
};

// Main component that wraps the inner component with EditorSyncProvider
const RobustProfessionalEditor: React.FC<RobustProfessionalEditorProps> = (props) => {
  // DISABLED: EditorSyncProvider - causing infinite loops
  return <RobustProfessionalEditorInner {...props} />;
  
  // return (
  //   <EditorSyncProvider
  //     externalData={props.pageData}
  //     onDataChange={props.onUpdate}
  //     autoSave={{
  //       enabled: true,
  //       debounceMs: 1000,
  //       onSave: async (data) => {
  //         if (props.onSave) await props.onSave();
  //         props.onUpdate(data);
  //       }
  //     }}
  //     enablePerformanceMonitoring={true}
  //     conflictResolution="local"
  //   >
  //     <RobustProfessionalEditorInner {...props} />
  //   </EditorSyncProvider>
  // );
};

export default RobustProfessionalEditor;