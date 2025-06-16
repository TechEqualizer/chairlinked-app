
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Palette, Type, Layout } from 'lucide-react';

interface CustomerVisualEditorProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export const CustomerVisualEditor: React.FC<CustomerVisualEditorProps> = ({
  data,
  onUpdate
}) => {
  const handleColorChange = (colorType: string, value: string) => {
    const colors = data?.colors || {};
    onUpdate({
      colors: {
        ...colors,
        [colorType]: value
      }
    });
  };

  const handleFontChange = (value: string) => {
    onUpdate({ fontFamily: value });
  };

  const presetColors = [
    { name: 'Rose Gold', primary: '#E8B4B8', secondary: '#F5E6E8' },
    { name: 'Deep Purple', primary: '#6B46C1', secondary: '#E0E7FF' },
    { name: 'Emerald', primary: '#10B981', secondary: '#ECFDF5' },
    { name: 'Amber', primary: '#F59E0B', secondary: '#FFFBEB' },
    { name: 'Slate', primary: '#475569', secondary: '#F8FAFC' },
  ];

  const fontOptions = [
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Lora', value: 'Lora' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Inter', value: 'Inter' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Visual Design</h3>
        <p className="text-sm text-gray-600 mb-6">Customize colors, fonts, and layout</p>
      </div>

      {/* Color Palette */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold">Color Palette</h4>
        </div>
        
        {/* Preset Color Schemes */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Quick Color Schemes</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {presetColors.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="h-16 p-3 flex items-center gap-3"
                onClick={() => {
                  handleColorChange('primary', preset.primary);
                  handleColorChange('secondary', preset.secondary);
                }}
              >
                <div className="flex gap-1">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: preset.secondary }}
                  />
                </div>
                <span className="text-sm font-medium">{preset.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={data?.colors?.primary || '#6B46C1'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={data?.colors?.primary || '#6B46C1'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                placeholder="#6B46C1"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondaryColor"
                type="color"
                value={data?.colors?.secondary || '#E0E7FF'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={data?.colors?.secondary || '#E0E7FF'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                placeholder="#E0E7FF"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Typography */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Type className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold">Typography</h4>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fontOptions.map((font) => (
                <Button
                  key={font.value}
                  variant={data?.fontFamily === font.value ? "default" : "outline"}
                  className="h-12 justify-start"
                  onClick={() => handleFontChange(font.value)}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Layout Options */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Layout className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold">Layout Style</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant={data?.layoutStyle === 'modern' ? "default" : "outline"}
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => onUpdate({ layoutStyle: 'modern' })}
          >
            <div className="text-sm font-medium">Modern</div>
            <div className="text-xs text-gray-500">Clean & minimal</div>
          </Button>
          
          <Button
            variant={data?.layoutStyle === 'classic' ? "default" : "outline"}
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => onUpdate({ layoutStyle: 'classic' })}
          >
            <div className="text-sm font-medium">Classic</div>
            <div className="text-xs text-gray-500">Traditional & elegant</div>
          </Button>
        </div>
      </Card>
    </div>
  );
};
