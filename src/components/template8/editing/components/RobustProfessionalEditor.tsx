import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye, EyeOff, Monitor, Tablet, Smartphone, Undo2, Redo2 } from 'lucide-react';
import RobustVisualEditor from './RobustVisualEditor';
import RobustSidebar from './RobustSidebar';

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
}

interface SelectedElement {
  id: string;
  type: string;
  element: HTMLElement;
  selector: string;
  properties: Record<string, any>;
}

type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

const RobustProfessionalEditor: React.FC<RobustProfessionalEditorProps> = ({
  pageData,
  onUpdate,
  onSave,
  onClose,
  siteData
}) => {
  // Core state
  const [sectionData, setSectionData] = useState(pageData || {});
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [responsiveMode, setResponsiveMode] = useState<ResponsiveMode>('desktop');
  const [overlaysVisible, setOverlaysVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Undo/Redo state
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);

  // Handle data updates with undo support
  const handleDataUpdate = useCallback((updates: any) => {
    setUndoStack(prev => [...prev, sectionData]);
    setRedoStack([]); // Clear redo stack
    setSectionData(prev => ({ ...prev, ...updates }));
    onUpdate({ ...sectionData, ...updates });
  }, [sectionData, onUpdate]);

  // Handle element selection
  const handleElementSelect = useCallback((element: SelectedElement) => {
    setSelectedElement(element);
  }, []);

  // Undo functionality
  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [sectionData, ...prev]);
      setUndoStack(prev => prev.slice(0, -1));
      setSectionData(previousState);
      onUpdate(previousState);
    }
  }, [undoStack, sectionData, onUpdate]);

  // Redo functionality
  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack(prev => [...prev, sectionData]);
      setRedoStack(prev => prev.slice(1));
      setSectionData(nextState);
      onUpdate(nextState);
    }
  }, [redoStack, sectionData, onUpdate]);

  // Save functionality
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave();
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Professional Header */}
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
            <span className="text-xs text-gray-400">• Professional Editor</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
              disabled={undoStack.length === 0}
              className="text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-50"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
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
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
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
              <RobustVisualEditor
                sectionData={sectionData}
                onElementSelect={handleElementSelect}
                overlaysVisible={overlaysVisible}
              />
            </div>
          </div>
        </div>

        {/* Fixed Sidebar */}
        <div className="absolute top-0 right-0 bottom-0 w-96 bg-gray-800 border-l border-gray-700 z-10">
          <RobustSidebar
            selectedElement={selectedElement}
            sectionData={sectionData}
            onDataUpdate={handleDataUpdate}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-xs text-gray-400 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>
            {selectedElement ? `Selected: ${selectedElement.type}` : 'No selection'}
          </span>
          <span>•</span>
          <span className="capitalize">{responsiveMode} view</span>
          <span>•</span>
          <span>Overlays {overlaysVisible ? 'ON' : 'OFF'}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span>Undo: {undoStack.length}</span>
          <span>•</span>
          <span>Redo: {redoStack.length}</span>
          <span>•</span>
          <span>Ctrl+S to save • Ctrl+Z to undo • Esc to deselect</span>
        </div>
      </div>
    </div>
  );
};

export default RobustProfessionalEditor;