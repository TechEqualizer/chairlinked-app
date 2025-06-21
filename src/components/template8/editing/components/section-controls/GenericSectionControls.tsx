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

interface GenericSectionControlsProps {
  selectedElement: any;
  sectionData: any;
  onElementPropertyChange: (property: string, value: any) => void;
  onDataUpdate: (updates: any) => void;
}

const GenericSectionControls: React.FC<GenericSectionControlsProps> = ({
  selectedElement,
  sectionData,
  onElementPropertyChange,
  onDataUpdate
}) => {
  const { elementRole, sectionName, sectionId } = selectedElement;

  // Force re-render when properties change
  const [, forceUpdate] = React.useState({});
  const triggerUpdate = () => forceUpdate({});

  const getSectionIcon = (sectionId: string) => {
    switch (sectionId) {
      case 'navbar': return '🧭';
      case 'hero': return '🎯';
      case 'gallery': return '🖼️';
      case 'testimonials': return '💬';
      case 'stories': return '📱';
      case 'booking': return '📅';
      case 'footer': return '📄';
      default: return '⚙️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
          <span className="text-lg">{getSectionIcon(sectionId)}</span>
          {sectionName} Section
        </h4>
        <p className="text-xs text-gray-400">
          Editing: {elementRole} element
        </p>
      </div>

      {/* Content Controls */}
      <div>
        <h5 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-2">
          <Type className="w-3 h-3" />
          Content
        </h5>
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-400">Text Content</Label>
            <Textarea
              value={selectedElement.properties?.textContent || ''}
              onChange={(e) => {
                console.log('Text input changed to:', e.target.value);
                onElementPropertyChange('textContent', e.target.value);
                triggerUpdate();
              }}
              onKeyDown={(e) => {
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
        <h5 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-2">
          <Type className="w-3 h-3" />
          Typography
        </h5>
        
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
                  onClick={() => onElementPropertyChange('textAlign', value)}
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
                  onElementPropertyChange('fontSize', value);
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
              onValueChange={(value) => onElementPropertyChange('fontWeight', value)}
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
                onChange={(e) => onElementPropertyChange('color', e.target.value)}
                className="w-12 h-8 p-1 rounded border-gray-600"
              />
              <Input
                value={selectedElement.properties?.color || '#000000'}
                onChange={(e) => onElementPropertyChange('color', e.target.value)}
                className="flex-1 bg-gray-700 border-gray-600 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Layout Section */}
      <div>
        <h5 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-2">
          <Layout className="w-3 h-3" />
          Layout
        </h5>
        
        <div className="space-y-4">
          {/* Background Color */}
          <div>
            <Label className="text-xs text-gray-400">Background Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="color"
                value={selectedElement.properties?.backgroundColor || '#ffffff'}
                onChange={(e) => onElementPropertyChange('backgroundColor', e.target.value)}
                className="w-12 h-8 p-1 rounded border-gray-600"
              />
              <Input
                value={selectedElement.properties?.backgroundColor || '#ffffff'}
                onChange={(e) => onElementPropertyChange('backgroundColor', e.target.value)}
                className="flex-1 bg-gray-700 border-gray-600 text-white text-xs font-mono"
              />
            </div>
          </div>

          {/* Padding */}
          <div>
            <Label className="text-xs text-gray-400">Padding</Label>
            <Input
              value={selectedElement.properties?.padding || ''}
              onChange={(e) => onElementPropertyChange('padding', e.target.value)}
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
                onValueChange={([value]) => onElementPropertyChange('borderRadius', value)}
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

      {/* Section-Specific Actions */}
      <div>
        <h5 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-2">
          <Settings className="w-3 h-3" />
          Quick Actions
        </h5>
        
        <div className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onElementPropertyChange('color', sectionData.brandColor || '#3B82F6');
            }}
            className="w-full text-xs"
          >
            Apply Brand Color
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Reset to default styles
              onElementPropertyChange('fontSize', '16px');
              onElementPropertyChange('fontWeight', '400');
              onElementPropertyChange('textAlign', 'left');
              onElementPropertyChange('color', '#000000');
              onElementPropertyChange('backgroundColor', 'transparent');
            }}
            className="w-full text-xs"
          >
            Reset Styles
          </Button>

          {sectionId !== 'unknown' && (
            <div className="mt-4 p-3 bg-blue-900/20 rounded border border-blue-700/30">
              <p className="text-xs text-blue-300 mb-2">
                💡 Enhanced controls for {sectionName.toLowerCase()} sections are coming soon!
              </p>
              <p className="text-xs text-gray-400">
                For now, use these universal controls to edit text, colors, and layout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericSectionControls;