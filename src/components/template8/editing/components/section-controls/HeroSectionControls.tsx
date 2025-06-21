import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MediaUploadZone from '@/components/template8/editing/MediaUploadZone';
import BrandColorPresets from '@/components/template8/hero/BrandColorPresets';
import { 
  Type, 
  Palette, 
  Layout, 
  Image,
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Upload,
  Trash2,
  Layers,
  Mountain,
  Zap,
  Monitor
} from 'lucide-react';

interface HeroSectionControlsProps {
  selectedElement: any;
  sectionData: any;
  onElementPropertyChange: (property: string, value: any) => void;
  onDataUpdate: (updates: any) => void;
}

const HeroSectionControls: React.FC<HeroSectionControlsProps> = ({
  selectedElement,
  sectionData,
  onElementPropertyChange,
  onDataUpdate
}) => {
  const { elementRole } = selectedElement;

  const renderRoleSpecificControls = () => {
    switch (elementRole) {
      case 'title':
        return (
          <div className="space-y-6">
            {/* IMMEDIATE TEXT EDITING - Most Important */}
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
              <h5 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Edit Title Text
              </h5>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Title Content</Label>
                  <Textarea
                    value={selectedElement.properties?.textContent || sectionData.tagline || ''}
                    onChange={(e) => {
                      onElementPropertyChange('textContent', e.target.value);
                      onDataUpdate({ tagline: e.target.value });
                    }}
                    className="mt-1 bg-gray-700 border-gray-600 text-white resize-none text-lg"
                    rows={2}
                    placeholder="Enter your hero title..."
                  />
                </div>
              </div>
            </div>

            {/* IMMEDIATE VISUAL STYLING */}
            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
              <h5 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Text Appearance
              </h5>
              <div className="space-y-3">
                {/* Font Size - Big and Obvious */}
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Size</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {[
                      { size: '32', label: 'Small' },
                      { size: '48', label: 'Medium' },
                      { size: '64', label: 'Large' }
                    ].map(({ size, label }) => (
                      <Button
                        key={size}
                        size="sm"
                        variant={(selectedElement.properties?.fontSize?.replace('px', '') || '48') === size ? "default" : "outline"}
                        onClick={() => onElementPropertyChange('fontSize', `${size}px`)}
                        className={`text-xs h-12 flex flex-col ${
                          (selectedElement.properties?.fontSize?.replace('px', '') || '48') === size 
                            ? 'bg-purple-600 text-white border-purple-600' 
                            : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                        }`}
                      >
                        <span className="text-sm font-bold">Aa</span>
                        <span className="text-xs">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Text Color - Visual Color Picker */}
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Text Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="color"
                      value={selectedElement.properties?.color || '#000000'}
                      onChange={(e) => onElementPropertyChange('color', e.target.value)}
                      className="w-16 h-10 p-1 rounded border-gray-600"
                    />
                    <Input
                      value={selectedElement.properties?.color || '#000000'}
                      onChange={(e) => onElementPropertyChange('color', e.target.value)}
                      className="flex-1 bg-gray-700 border-gray-600 text-white text-sm font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Font Weight */}
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Weight</Label>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    {[
                      { weight: '400', label: 'Regular' },
                      { weight: '600', label: 'Semibold' },
                      { weight: '700', label: 'Bold' }
                    ].map(({ weight, label }) => (
                      <Button
                        key={weight}
                        size="sm"
                        variant={selectedElement.properties?.fontWeight === weight ? "default" : "outline"}
                        onClick={() => onElementPropertyChange('fontWeight', weight)}
                        className={`text-xs ${
                          selectedElement.properties?.fontWeight === weight 
                            ? 'bg-purple-600 text-white border-purple-600' 
                            : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                        }`}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Text Alignment */}
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Alignment</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {[
                      { value: 'left', icon: AlignLeft },
                      { value: 'center', icon: AlignCenter },
                      { value: 'right', icon: AlignRight }
                    ].map(({ value, icon: Icon }) => (
                      <Button
                        key={value}
                        size="sm"
                        variant={selectedElement.properties?.textAlign === value ? "default" : "outline"}
                        onClick={() => onElementPropertyChange('textAlign', value)}
                        className={`p-2 h-9 w-12 ${
                          selectedElement.properties?.textAlign === value 
                            ? 'bg-purple-600 text-white border-purple-600' 
                            : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
              <h5 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quick Styles
              </h5>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onElementPropertyChange('fontSize', '56px');
                    onElementPropertyChange('fontWeight', '700');
                    onElementPropertyChange('textAlign', 'center');
                    onElementPropertyChange('color', '#FFFFFF');
                  }}
                  className="text-xs bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white"
                >
                  🎯 Hero Style
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onElementPropertyChange('color', sectionData.brandColor || '#3B82F6');
                    onElementPropertyChange('fontWeight', '600');
                  }}
                  className="text-xs bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white"
                >
                  🎨 Brand Color
                </Button>
              </div>
            </div>
          </div>
        );

      case 'subtitle':
      case 'description':
        return (
          <div className="space-y-6">
            {/* IMMEDIATE TEXT EDITING */}
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
              <h5 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Edit Description Text
              </h5>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Description Content</Label>
                  <Textarea
                    value={selectedElement.properties?.textContent || sectionData.description || ''}
                    onChange={(e) => {
                      onElementPropertyChange('textContent', e.target.value);
                      onDataUpdate({ description: e.target.value });
                    }}
                    className="mt-1 bg-gray-700 border-gray-600 text-white resize-none text-base"
                    rows={3}
                    placeholder="Enter your hero description..."
                  />
                </div>
              </div>
            </div>

            {/* TEXT STYLING */}
            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
              <h5 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Text Appearance
              </h5>
              <div className="space-y-3">
                {/* Font Size */}
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Size</Label>
                  <div className="grid grid-cols-4 gap-1 mt-1">
                    {[
                      { size: '14', label: 'Small' },
                      { size: '16', label: 'Regular' },
                      { size: '18', label: 'Medium' },
                      { size: '20', label: 'Large' }
                    ].map(({ size, label }) => (
                      <Button
                        key={size}
                        size="sm"
                        variant={(selectedElement.properties?.fontSize?.replace('px', '') || '18') === size ? "default" : "outline"}
                        onClick={() => onElementPropertyChange('fontSize', `${size}px`)}
                        className={`text-xs h-10 flex flex-col ${
                          (selectedElement.properties?.fontSize?.replace('px', '') || '18') === size 
                            ? 'bg-purple-600 text-white border-purple-600' 
                            : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                        }`}
                      >
                        <span className="text-xs">Aa</span>
                        <span className="text-xs">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Text Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="color"
                      value={selectedElement.properties?.color || '#000000'}
                      onChange={(e) => onElementPropertyChange('color', e.target.value)}
                      className="w-16 h-10 p-1 rounded border-gray-600"
                    />
                    <Input
                      value={selectedElement.properties?.color || '#000000'}
                      onChange={(e) => onElementPropertyChange('color', e.target.value)}
                      className="flex-1 bg-gray-700 border-gray-600 text-white text-sm font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Text Weight */}
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Weight</Label>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    {[
                      { weight: '300', label: 'Light' },
                      { weight: '400', label: 'Regular' },
                      { weight: '600', label: 'Semibold' }
                    ].map(({ weight, label }) => (
                      <Button
                        key={weight}
                        size="sm"
                        variant={selectedElement.properties?.fontWeight === weight ? "default" : "outline"}
                        onClick={() => onElementPropertyChange('fontWeight', weight)}
                        className={`text-xs ${
                          selectedElement.properties?.fontWeight === weight 
                            ? 'bg-purple-600 text-white border-purple-600' 
                            : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                        }`}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Text Alignment */}
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Alignment</Label>
                  <div className="flex items-center gap-1 mt-1">
                    {[
                      { value: 'left', icon: AlignLeft },
                      { value: 'center', icon: AlignCenter },
                      { value: 'right', icon: AlignRight }
                    ].map(({ value, icon: Icon }) => (
                      <Button
                        key={value}
                        size="sm"
                        variant={selectedElement.properties?.textAlign === value ? "default" : "outline"}
                        onClick={() => onElementPropertyChange('textAlign', value)}
                        className={`p-2 h-9 w-12 ${
                          selectedElement.properties?.textAlign === value 
                            ? 'bg-purple-600 text-white border-purple-600' 
                            : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK STYLES */}
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
              <h5 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quick Styles
              </h5>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onElementPropertyChange('fontSize', '18px');
                    onElementPropertyChange('fontWeight', '400');
                    onElementPropertyChange('textAlign', 'center');
                    onElementPropertyChange('color', '#6B7280');
                  }}
                  className="text-xs bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white"
                >
                  📝 Clean Style
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onElementPropertyChange('color', sectionData.brandColor || '#3B82F6');
                    onElementPropertyChange('fontWeight', '500');
                  }}
                  className="text-xs bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white"
                >
                  🎨 Brand Color
                </Button>
              </div>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-gray-400">Button Text</Label>
              <Input
                value={selectedElement.properties?.textContent || sectionData.ctaText || ''}
                onChange={(e) => {
                  onElementPropertyChange('textContent', e.target.value);
                  onDataUpdate({ ctaText: e.target.value });
                }}
                className="mt-1 bg-gray-700 border-gray-600 text-white"
                placeholder="Enter button text..."
              />
            </div>
            
            <div>
              <Label className="text-xs text-gray-400">Button Style</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onElementPropertyChange('backgroundColor', sectionData.brandColor || '#3B82F6');
                    onElementPropertyChange('color', '#FFFFFF');
                    onElementPropertyChange('border', 'none');
                  }}
                  className="text-xs bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white"
                >
                  Primary
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onElementPropertyChange('backgroundColor', 'transparent');
                    onElementPropertyChange('color', sectionData.brandColor || '#3B82F6');
                    onElementPropertyChange('border', `2px solid ${sectionData.brandColor || '#3B82F6'}`);
                  }}
                  className="text-xs bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white"
                >
                  Outline
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-400">Button Size</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[parseInt(selectedElement.properties?.padding?.replace('px', '').split(' ')[0]) || 12]}
                  onValueChange={([value]) => onElementPropertyChange('padding', `${value}px ${value * 2}px`)}
                  max={24}
                  min={8}
                  step={2}
                  className="flex-1"
                />
                <div className="text-xs text-gray-400 w-12 bg-gray-600 px-2 py-1 rounded">
                  {parseInt(selectedElement.properties?.padding?.replace('px', '').split(' ')[0]) || 12}px
                </div>
              </div>
            </div>
          </div>
        );

      case 'hero-image':
      case 'image':
        return (
          <div className="space-y-6">
            {/* IMMEDIATE IMAGE UPLOAD - Most Important */}
            <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700">
              <h5 className="text-sm font-semibold text-orange-300 mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Change Hero Image
              </h5>
              <div className="space-y-3">
                <MediaUploadZone
                  currentMedia={selectedElement.properties?.imageSource || sectionData.heroImage || ''}
                  mediaType="image"
                  onMediaChange={(mediaUrl) => {
                    onElementPropertyChange('src', mediaUrl);
                    onDataUpdate({ 
                      heroImage: mediaUrl,
                      backgroundType: mediaUrl ? 'image' : 'gradient',
                      backgroundImage: mediaUrl
                    });
                  }}
                  aspectRatio="16:9"
                  brandColor={sectionData.brandColor || '#3B82F6'}
                  acceptVideo={false}
                  showDimensionHint={true}
                  className="w-full"
                />
                
                {(selectedElement.properties?.imageSource || sectionData.heroImage) && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      onElementPropertyChange('src', '');
                      onDataUpdate({ 
                        heroImage: null,
                        backgroundType: 'gradient',
                        backgroundImage: undefined
                      });
                    }}
                    className="w-full text-xs"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Remove This Image
                  </Button>
                )}
              </div>
            </div>

            {/* IMAGE STYLING */}
            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
              <h5 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Image className="w-4 h-4" />
                Image Styling
              </h5>
              <div className="space-y-3">
                {/* Image Size */}
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Size</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {[
                      { size: '50%', label: 'Small' },
                      { size: '75%', label: 'Medium' },
                      { size: '100%', label: 'Full' }
                    ].map(({ size, label }) => (
                      <Button
                        key={size}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onElementPropertyChange('width', size);
                          onElementPropertyChange('height', 'auto');
                        }}
                        className="text-xs h-10 flex flex-col bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white"
                      >
                        <span className="text-xs">📐</span>
                        <span className="text-xs">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Image Position/Alignment */}
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Position</Label>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    {[
                      { position: 'flex-start', label: 'Left', icon: AlignLeft },
                      { position: 'center', label: 'Center', icon: AlignCenter },
                      { position: 'flex-end', label: 'Right', icon: AlignRight }
                    ].map(({ position, label, icon: Icon }) => (
                      <Button
                        key={position}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Apply to parent container if needed
                          const parent = selectedElement.element.parentElement;
                          if (parent) {
                            parent.style.display = 'flex';
                            parent.style.justifyContent = position;
                          }
                        }}
                        className="text-xs h-9 flex flex-col bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white"
                      >
                        <Icon className="w-3 h-3" />
                        <span className="text-xs">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Corner Rounding</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      value={[parseInt(selectedElement.properties?.borderRadius?.replace('px', '') || '0')]}
                      onValueChange={([value]) => onElementPropertyChange('borderRadius', `${value}px`)}
                      max={50}
                      min={0}
                      step={2}
                      className="flex-1"
                    />
                    <div className="text-xs text-gray-400 w-12 bg-gray-600 px-2 py-1 rounded">
                      {parseInt(selectedElement.properties?.borderRadius?.replace('px', '') || '0')}px
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IMAGE DETAILS */}
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
              <h5 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Image Details
              </h5>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Alt Text (for accessibility)</Label>
                  <Input
                    value={selectedElement.properties?.textContent || ''}
                    onChange={(e) => onElementPropertyChange('alt', e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    placeholder="Describe what's in the image..."
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-300 font-medium">Image URL (advanced)</Label>
                  <Input
                    value={selectedElement.properties?.imageSource || ''}
                    onChange={(e) => {
                      onElementPropertyChange('src', e.target.value);
                      onDataUpdate({ heroImage: e.target.value });
                    }}
                    className="mt-1 bg-gray-700 border-gray-600 text-white text-xs font-mono"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
              <h5 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quick Actions
              </h5>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onElementPropertyChange('width', '100%');
                    onElementPropertyChange('height', 'auto');
                    onElementPropertyChange('borderRadius', '8px');
                  }}
                  className="text-xs bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white"
                >
                  🖼️ Full Hero
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onElementPropertyChange('width', '60%');
                    onElementPropertyChange('borderRadius', '12px');
                    // Center the image
                    const parent = selectedElement.element.parentElement;
                    if (parent) {
                      parent.style.display = 'flex';
                      parent.style.justifyContent = 'center';
                    }
                  }}
                  className="text-xs bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white"
                >
                  🎨 Styled
                </Button>
              </div>
            </div>
          </div>
        );

      case 'background':
      case 'hero-container':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-gray-400">Background Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  value={selectedElement.properties?.backgroundColor || sectionData.backgroundColor || '#FFFFFF'}
                  onChange={(e) => {
                    onElementPropertyChange('backgroundColor', e.target.value);
                    onDataUpdate({ backgroundColor: e.target.value });
                  }}
                  className="w-12 h-8 p-1 rounded border-gray-600"
                />
                <Input
                  value={selectedElement.properties?.backgroundColor || sectionData.backgroundColor || '#FFFFFF'}
                  onChange={(e) => {
                    onElementPropertyChange('backgroundColor', e.target.value);
                    onDataUpdate({ backgroundColor: e.target.value });
                  }}
                  className="flex-1 bg-gray-700 border-gray-600 text-white text-xs font-mono"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-400">Background Image</Label>
              <MediaUploadZone
                currentMedia={sectionData.backgroundImage || ''}
                mediaType="image"
                onMediaChange={(mediaUrl) => {
                  onDataUpdate({ 
                    backgroundImage: mediaUrl,
                    backgroundType: 'image'
                  });
                }}
                aspectRatio="16:9"
                brandColor={sectionData.brandColor || '#3B82F6'}
                acceptVideo={false}
                showDimensionHint={true}
                className="w-full"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-400">Padding</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[parseInt(selectedElement.properties?.padding?.replace('px', '').split(' ')[0]) || 20]}
                  onValueChange={([value]) => {
                    onElementPropertyChange('padding', `${value}px`);
                  }}
                  max={100}
                  min={0}
                  step={4}
                  className="flex-1"
                />
                <div className="text-xs text-gray-400 w-12 bg-gray-600 px-2 py-1 rounded">
                  {parseInt(selectedElement.properties?.padding?.replace('px', '').split(' ')[0]) || 20}px
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="text-gray-400 text-sm mb-4">
              Editing: {elementRole} ({selectedElement.type})
            </div>
            
            {/* Universal text editing for any element with text content */}
            {selectedElement.properties?.textContent && (
              <div>
                <Label className="text-xs text-gray-400">Text Content</Label>
                <Textarea
                  value={selectedElement.properties?.textContent || ''}
                  onChange={(e) => onElementPropertyChange('textContent', e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-white resize-none"
                  rows={3}
                  placeholder="Edit text content..."
                />
              </div>
            )}

            {/* Universal image editing for any image element */}
            {selectedElement.type === 'image' && (
              <div>
                <Label className="text-xs text-gray-400">Image Source</Label>
                <Input
                  value={selectedElement.properties?.imageSource || ''}
                  onChange={(e) => onElementPropertyChange('src', e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-white text-xs"
                  placeholder="Image URL..."
                />
              </div>
            )}

            {/* Universal background editing for container elements */}
            {(selectedElement.type === 'container' || selectedElement.type === 'section') && (
              <div>
                <Label className="text-xs text-gray-400">Background Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="color"
                    value={selectedElement.properties?.backgroundColor || '#FFFFFF'}
                    onChange={(e) => onElementPropertyChange('backgroundColor', e.target.value)}
                    className="w-12 h-8 p-1 rounded border-gray-600"
                  />
                  <Input
                    value={selectedElement.properties?.backgroundColor || '#FFFFFF'}
                    onChange={(e) => onElementPropertyChange('backgroundColor', e.target.value)}
                    className="flex-1 bg-gray-700 border-gray-600 text-white text-xs font-mono"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Intuitive Section Header */}
      <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
        <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
          <Image className="w-4 h-4 text-blue-400" />
          Hero Section Editor
        </h4>
        <p className="text-xs text-gray-300">
          Editing: <span className="text-blue-300 font-medium">{elementRole}</span> element
        </p>
        {selectedElement.properties?.textContent && (
          <p className="text-xs text-gray-400 mt-1 italic">
            "{selectedElement.properties.textContent.substring(0, 40)}..."
          </p>
        )}
      </div>

      {/* Main Role-specific Controls - No Extra Wrapper */}
      {renderRoleSpecificControls()}

      {/* Global Hero Section Controls - Only show if not covered by role-specific */}
      {(elementRole !== 'hero-image' && elementRole !== 'image') && (
        <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-700">
          <h5 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Global Hero Settings
          </h5>
          
          <div className="space-y-3">
            {/* Brand Color */}
            <div>
              <Label className="text-xs text-gray-300 font-medium">Brand Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="color"
                  value={sectionData.brandColor || '#3B82F6'}
                  onChange={(e) => {
                    const color = e.target.value;
                    onDataUpdate({ brandColor: color });
                    // Auto-apply to CTA buttons
                    const ctaButtons = document.querySelectorAll('[data-section="hero"] button');
                    ctaButtons.forEach(btn => {
                      (btn as HTMLElement).style.backgroundColor = color;
                    });
                  }}
                  className="w-16 h-10 p-1 rounded border-gray-600"
                />
                <Input
                  value={sectionData.brandColor || '#3B82F6'}
                  onChange={(e) => onDataUpdate({ brandColor: e.target.value })}
                  className="flex-1 bg-gray-700 border-gray-600 text-white text-sm font-mono"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            {/* Quick Brand Color Presets */}
            <div>
              <Label className="text-xs text-gray-300 font-medium mb-2 block">Quick Colors</Label>
              <BrandColorPresets
                selectedColor={sectionData.brandColor || '#3B82F6'}
                onColorSelect={(color) => onDataUpdate({ brandColor: color })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSectionControls;