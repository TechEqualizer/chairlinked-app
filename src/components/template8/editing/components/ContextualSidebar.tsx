import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Type, 
  Palette, 
  Layout, 
  Settings, 
  Layers, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline,
  RotateCcw,
  Copy,
  Trash2,
  Image,
  Link
} from 'lucide-react';

interface ContextualSidebarProps {
  selectedElement: any;
  activePanel: 'inspector' | 'layers' | 'theme' | null;
  sectionData: any;
  onDataUpdate: (updates: any) => void;
  responsiveMode: 'desktop' | 'tablet' | 'mobile';
}

const ContextualSidebar: React.FC<ContextualSidebarProps> = ({
  selectedElement,
  activePanel,
  sectionData,
  onDataUpdate,
  responsiveMode
}) => {
  
  // Remove force update to prevent loops
  
  // Handle property changes for selected element
  const handleElementPropertyChange = (property: string, value: any) => {
    if (!selectedElement?.element) {
      console.log('[ContextualSidebar] No selected element to update');
      return;
    }
    
    const element = selectedElement.element as HTMLElement;
    
    // Apply the change directly to the element for immediate feedback
    try {
      switch (property) {
        case 'color':
          element.style.color = value;
          break;
        case 'fontSize':
          element.style.fontSize = typeof value === 'number' ? `${value}px` : value;
          break;
        case 'fontWeight':
          element.style.fontWeight = value;
          break;
        case 'textAlign':
          element.style.textAlign = value;
          break;
        case 'backgroundColor':
          element.style.backgroundColor = value;
          break;
        case 'padding':
          element.style.padding = typeof value === 'number' ? `${value}px` : value;
          break;
        case 'margin':
          element.style.margin = typeof value === 'number' ? `${value}px` : value;
          break;
        case 'borderRadius':
          element.style.borderRadius = typeof value === 'number' ? `${value}px` : value;
          break;
        case 'textContent':
          element.textContent = value;
          // For headlines and text elements, also try updating the inner structure
          if (element.querySelector('span, div')) {
            const textNode = element.querySelector('span, div');
            if (textNode) {
              textNode.textContent = value;
            }
          }
          break;
        default:
          console.log('[ContextualSidebar] Unknown property:', property);
      }
      
      // Update the selected element's properties object to reflect the change
      if (selectedElement.properties) {
        selectedElement.properties[property] = value;
      }
      
      // Style applied successfully
      
    } catch (error) {
      console.error('[ContextualSidebar] Error applying style:', error);
    }
    
    // Update the section data to persist changes
    const updatedSectionData = {
      ...sectionData,
      lastElementChange: {
        elementId: selectedElement.id,
        elementType: selectedElement.type,
        property,
        value,
        timestamp: Date.now(),
        selector: selectedElement.selector
      },
      // Also try to update specific sections based on element type
      ...(selectedElement.type === 'heading' && property === 'textContent' && selectedElement.id.includes('hero') && {
        heroTitle: value
      }),
      ...(selectedElement.type === 'paragraph' && property === 'textContent' && selectedElement.id.includes('hero') && {
        heroSubtitle: value
      }),
      ...(selectedElement.type === 'button' && property === 'textContent' && {
        heroCtaText: value
      })
    };
    
    console.log('[ContextualSidebar] Updating section data with:', updatedSectionData);
    onDataUpdate(updatedSectionData);
  };

  // Inspector Panel - Shows properties of selected element
  const InspectorPanel = () => (
    <div className="p-4 space-y-6 text-white">
      {selectedElement ? (
        <>
          {/* Element Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-300">Selected Element</h3>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                  <Copy className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Type</div>
              <div className="font-medium capitalize">{selectedElement.type}</div>
              {selectedElement.selector && (
                <>  
                  <div className="text-xs text-gray-400 mt-2 mb-1">Selector</div>
                  <div className="font-mono text-xs text-blue-300">{selectedElement.selector}</div>
                </>
              )}
            </div>
          </div>

          {/* Content Editing */}
          {(selectedElement.type === 'heading' || selectedElement.type === 'paragraph' || selectedElement.type === 'button') && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Content
              </h4>
              
              <div>
                <Label className="text-xs text-gray-400">Text Content</Label>
                <Textarea
                  value={selectedElement.properties?.textContent || ''}
                  onChange={(e) => {
                    handleElementPropertyChange('textContent', e.target.value);
                  }}
                  onFocus={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 bg-gray-700 border-gray-600 text-white resize-none"
                  rows={3}
                  style={{ pointerEvents: 'auto' }}
                />
              </div>
            </div>
          )}

          {/* Typography Controls */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Typography
            </h4>
            
            {/* Text Alignment */}
            <div>
              <Label className="text-xs text-gray-400">Text Alignment</Label>
              <div className="flex items-center gap-1 mt-1">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight }
                ].map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={selectedElement.properties?.textAlign === value ? "default" : "ghost"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleElementPropertyChange('textAlign', value);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="p-2 h-8 w-8 cursor-pointer hover:bg-gray-600"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Icon className="w-3 h-3" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <Label className="text-xs text-gray-400">Font Size</Label>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="flex-1"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Slider
                    value={[parseInt(selectedElement.properties?.fontSize) || 16]}
                    onValueChange={([value]) => {
                      handleElementPropertyChange('fontSize', value);
                    }}
                    max={72}
                    min={8}
                    step={1}
                    className="w-full cursor-pointer"
                  />
                </div>
                <div className="text-xs text-gray-400 w-12 bg-gray-600 px-2 py-1 rounded">
                  {parseInt(selectedElement.properties?.fontSize) || 16}px
                </div>
              </div>
            </div>

            {/* Font Weight */}
            <div>
              <Label className="text-xs text-gray-400">Font Weight</Label>
              <div 
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: 'auto' }}
              >
                <Select
                  value={selectedElement.properties?.fontWeight || '400'}
                  onValueChange={(value) => {
                    console.log('[ContextualSidebar] Font weight changed:', value);
                    handleElementPropertyChange('fontWeight', value);
                  }}
                >
                  <SelectTrigger 
                    className="mt-1 bg-gray-700 border-gray-600 text-white cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="300" className="text-white hover:bg-gray-600">Light (300)</SelectItem>
                    <SelectItem value="400" className="text-white hover:bg-gray-600">Regular (400)</SelectItem>
                    <SelectItem value="500" className="text-white hover:bg-gray-600">Medium (500)</SelectItem>
                    <SelectItem value="600" className="text-white hover:bg-gray-600">Semibold (600)</SelectItem>
                    <SelectItem value="700" className="text-white hover:bg-gray-600">Bold (700)</SelectItem>
                    <SelectItem value="800" className="text-white hover:bg-gray-600">Extra Bold (800)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Text Color */}
            <div>
              <Label className="text-xs text-gray-400">Text Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  value={selectedElement.properties?.color || '#000000'}
                  onChange={(e) => {
                    handleElementPropertyChange('color', e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-12 h-8 p-1 rounded border-gray-600 cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                />
                <Input
                  value={selectedElement.properties?.color || '#000000'}
                  onChange={(e) => {
                    handleElementPropertyChange('color', e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  className="flex-1 bg-gray-700 border-gray-600 text-white text-xs font-mono"
                  style={{ pointerEvents: 'auto' }}
                />
              </div>
            </div>
          </div>

          {/* Layout Controls */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Layout
            </h4>
            
            {/* Padding */}
            <div>
              <Label className="text-xs text-gray-400">Padding</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  placeholder="All sides"
                  value={selectedElement.properties?.padding || ''}
                  onChange={(e) => handleElementPropertyChange('padding', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white text-xs"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleElementPropertyChange('padding', '0')}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Margin */}
            <div>
              <Label className="text-xs text-gray-400">Margin</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  placeholder="All sides"
                  value={selectedElement.properties?.margin || ''}
                  onChange={(e) => handleElementPropertyChange('margin', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white text-xs"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleElementPropertyChange('margin', '0')}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Background Color */}
            <div>
              <Label className="text-xs text-gray-400">Background Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  value={selectedElement.properties?.backgroundColor || '#ffffff'}
                  onChange={(e) => handleElementPropertyChange('backgroundColor', e.target.value)}
                  className="w-12 h-8 p-1 rounded border-gray-600"
                />
                <Input
                  value={selectedElement.properties?.backgroundColor || '#ffffff'}
                  onChange={(e) => handleElementPropertyChange('backgroundColor', e.target.value)}
                  className="flex-1 bg-gray-700 border-gray-600 text-white text-xs font-mono"
                />
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <Label className="text-xs text-gray-400">Border Radius</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[parseInt(selectedElement.properties?.borderRadius) || 0]}
                  onValueChange={([value]) => {
                    console.log('[ContextualSidebar] Border radius changed to:', value);
                    handleElementPropertyChange('borderRadius', value);
                  }}
                  max={50}
                  min={0}
                  step={1}
                  className="flex-1"
                />
                <div className="text-xs text-gray-400 w-12 bg-gray-600 px-2 py-1 rounded">
                  {parseInt(selectedElement.properties?.borderRadius) || 0}px
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Settings className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select an element to edit its properties</p>
          <div className="mt-4 text-xs">
            <p>Debug Info:</p>
            <p>Active Panel: {activePanel || 'None'}</p>
            <p>Selected Element: {selectedElement ? selectedElement.type : 'None'}</p>
          </div>
          
          {/* Test Button */}
          <div className="mt-4">
            <Button
              onClick={() => {
                console.log('🧪 [ContextualSidebar] TEST BUTTON CLICKED!');
                alert('Sidebar is working!');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
            >
              Test Sidebar
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  // Layers Panel - Shows page structure
  const LayersPanel = () => (
    <div className="p-4 space-y-4 text-white">
      <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
        <Layers className="w-4 h-4" />
        Page Structure
      </h3>
      
      <div className="space-y-2">
        {/* This would show the page structure in a real implementation */}
        <div className="text-xs text-gray-400">
          Coming soon: Visual page structure with drag-and-drop reordering
        </div>
      </div>
    </div>
  );

  // Theme Panel - Global theme settings
  const ThemePanel = () => (
    <div className="p-4 space-y-4 text-white">
      <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
        <Palette className="w-4 h-4" />
        Global Theme
      </h3>
      
      <div className="space-y-4">
        {/* Brand Colors */}
        <div>
          <Label className="text-xs text-gray-400">Primary Color</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="color"
              value={sectionData.brandColor || '#8B5CF6'}
              onChange={(e) => onDataUpdate({ ...sectionData, brandColor: e.target.value })}
              className="w-12 h-8 p-1 rounded border-gray-600"
            />
            <Input
              value={sectionData.brandColor || '#8B5CF6'}
              onChange={(e) => onDataUpdate({ ...sectionData, brandColor: e.target.value })}
              className="flex-1 bg-gray-700 border-gray-600 text-white text-xs font-mono"
            />
          </div>
        </div>

        {/* Font Settings */}
        <div>
          <Label className="text-xs text-gray-400">Primary Font</Label>
          <Select
            value={sectionData.primaryFont || 'Inter'}
            onValueChange={(value) => onDataUpdate({ ...sectionData, primaryFont: value })}
          >
            <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
              <SelectItem value="Poppins">Poppins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="h-full overflow-y-auto" 
      style={{ pointerEvents: 'auto' }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <AnimatePresence mode="wait">
        {activePanel === 'inspector' && (
          <motion.div
            key="inspector"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <InspectorPanel />
          </motion.div>
        )}
        
        {activePanel === 'layers' && (
          <motion.div
            key="layers"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <LayersPanel />
          </motion.div>
        )}
        
        {activePanel === 'theme' && (
          <motion.div
            key="theme"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ThemePanel />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Responsive Mode Indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-700 rounded-lg p-2 text-xs text-gray-300 text-center">
          Editing for {responsiveMode} view
        </div>
      </div>
    </div>
  );
};

export default ContextualSidebar;