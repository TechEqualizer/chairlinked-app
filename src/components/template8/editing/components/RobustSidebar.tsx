import React from 'react';
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
  AlignLeft, 
  AlignCenter, 
  AlignRight
} from 'lucide-react';

interface RobustSidebarProps {
  selectedElement: any;
  sectionData: any;
  onDataUpdate: (updates: any) => void;
}

const RobustSidebar: React.FC<RobustSidebarProps> = ({
  selectedElement,
  sectionData,
  onDataUpdate
}) => {
  // Force re-render when properties change
  const [, forceUpdate] = React.useState({});
  const triggerUpdate = () => forceUpdate({});
  
  // Handle property changes for selected element
  const handleElementPropertyChange = (property: string, value: any) => {
    if (!selectedElement?.element) {
      console.log('No selected element to update');
      return;
    }
    
    const element = selectedElement.element as HTMLElement;
    console.log(`Updating ${property} to:`, value);
    
    try {
      // Apply the change directly to the element
      switch (property) {
        case 'textContent':
          element.textContent = value;
          // Also update inner text nodes if they exist
          if (element.children.length === 0) {
            element.textContent = value;
          } else {
            // For elements with children, try to find text nodes
            const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
            if (textNodes.length > 0) {
              textNodes[0].textContent = value;
            } else {
              element.textContent = value;
            }
          }
          
          // Update section data based on element type and position
          if (element.tagName === 'H1' || element.classList.contains('hero') || value.includes('Welcome')) {
            onDataUpdate({ ...sectionData, heroTitle: value });
          } else if (element.tagName === 'P' && element.closest('[class*="hero"]')) {
            onDataUpdate({ ...sectionData, heroSubtitle: value });
          } else if (element.tagName === 'BUTTON') {
            onDataUpdate({ ...sectionData, heroCtaText: value });
          }
          break;
          
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
      }
      
      // Update the selected element's properties for UI sync
      if (selectedElement.properties) {
        selectedElement.properties[property] = value;
      }
      
      console.log(`Successfully updated ${property}`);
      
      // Force UI update
      triggerUpdate();
      
    } catch (error) {
      console.error(`Error updating ${property}:`, error);
    }
  };

  if (!selectedElement) {
    return (
      <div className="h-full bg-gray-800 text-white p-6">
        <div className="text-center py-12">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Element Selected</h3>
          <p className="text-gray-400 text-sm">Click on any text element to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-800 text-white flex flex-col">
      {/* Fixed Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 flex-shrink-0">
        <h3 className="text-lg font-semibold">Edit {selectedElement.type}</h3>
        <p className="text-xs text-gray-400 mt-1">{selectedElement.selector}</p>
        
        {/* Quick Test Button */}
        <Button
          onClick={() => {
            console.log('Test button clicked');
            console.log('Current element:', selectedElement.element);
            console.log('Current properties:', selectedElement.properties);
            
            // Test direct text change
            if (selectedElement.element) {
              selectedElement.element.style.color = 'red';
              selectedElement.element.textContent = 'TEST CHANGE WORKS!';
              console.log('Applied test changes');
              
              // Scroll the element into view for better UX
              selectedElement.element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
              });
            }
          }}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
        >
          Test Direct Edit
        </Button>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Content
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-400">Text Content</Label>
              <Textarea
                value={selectedElement.properties?.textContent || ''}
                onChange={(e) => {
                  console.log('Text input changed to:', e.target.value);
                  handleElementPropertyChange('textContent', e.target.value);
                }}
                onKeyDown={(e) => {
                  // Allow normal text editing behavior
                  e.stopPropagation();
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                }}
                className="mt-1 bg-gray-700 border-gray-600 text-white resize-none"
                rows={3}
                placeholder="Enter text content..."
              />
              <div className="text-xs text-gray-500 mt-1">
                Current length: {(selectedElement.properties?.textContent || '').length} characters
              </div>
            </div>
          </div>
        </div>

        {/* Typography Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Typography
          </h4>
          
          <div className="space-y-4">
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
                    onClick={() => handleElementPropertyChange('textAlign', value)}
                    className="p-2 h-8 w-8"
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
                <Slider
                  value={[parseInt(selectedElement.properties?.fontSize?.replace('px', '')) || 16]}
                  onValueChange={([value]) => {
                    console.log('Font size slider moved to:', value);
                    handleElementPropertyChange('fontSize', value);
                  }}
                  max={72}
                  min={8}
                  step={1}
                  className="flex-1"
                />
                <div className="text-xs text-gray-400 w-12 bg-gray-600 px-2 py-1 rounded">
                  {parseInt(selectedElement.properties?.fontSize?.replace('px', '')) || 16}px
                </div>
              </div>
            </div>

            {/* Font Weight */}
            <div>
              <Label className="text-xs text-gray-400">Font Weight</Label>
              <Select
                value={selectedElement.properties?.fontWeight || '400'}
                onValueChange={(value) => handleElementPropertyChange('fontWeight', value)}
              >
                <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
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

            {/* Text Color */}
            <div>
              <Label className="text-xs text-gray-400">Text Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  value={selectedElement.properties?.color || '#000000'}
                  onChange={(e) => handleElementPropertyChange('color', e.target.value)}
                  className="w-12 h-8 p-1 rounded border-gray-600"
                />
                <Input
                  value={selectedElement.properties?.color || '#000000'}
                  onChange={(e) => handleElementPropertyChange('color', e.target.value)}
                  className="flex-1 bg-gray-700 border-gray-600 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Layout Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Layout
          </h4>
          
          <div className="space-y-4">
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

            {/* Padding */}
            <div>
              <Label className="text-xs text-gray-400">Padding</Label>
              <Input
                value={selectedElement.properties?.padding || ''}
                onChange={(e) => handleElementPropertyChange('padding', e.target.value)}
                placeholder="e.g., 16px or 1rem"
                className="mt-1 bg-gray-700 border-gray-600 text-white text-xs"
              />
            </div>

            {/* Border Radius */}
            <div>
              <Label className="text-xs text-gray-400">Border Radius</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[parseInt(selectedElement.properties?.borderRadius) || 0]}
                  onValueChange={([value]) => handleElementPropertyChange('borderRadius', value)}
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
        </div>
      </div>
    </div>
  );
};

export default RobustSidebar;