import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Type, Image, Layout, Upload, Wand2, Star } from 'lucide-react';

interface AdvancedHeroEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
}

export const AdvancedHeroEditor: React.FC<AdvancedHeroEditorProps> = ({
  sectionData,
  onSectionUpdate,
  activePanel,
  onPanelChange
}) => {
  const [heroData, setHeroData] = useState({
    heroTitle: sectionData.heroTitle || sectionData.headline || '',
    heroSubtitle: sectionData.heroSubtitle || sectionData.subheadline || '',
    heroCtaText: sectionData.heroCtaText || sectionData.ctaText || 'Get Started',
    heroImageUrl: sectionData.heroImageUrl || sectionData.heroImage || '',
    brandColor: sectionData.brandColor || '#8B5CF6',
    textColor: sectionData.textColor || '#ffffff',
    ...sectionData
  });

  const updateHeroData = (updates: any) => {
    const newData = { ...heroData, ...updates };
    setHeroData(newData);
    onSectionUpdate(newData);
  };

  const renderBrandPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Brand Colors</h4>
      
      <div>
        <Label htmlFor="brandColor">Primary Brand Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="brandColor"
            type="color"
            value={heroData.brandColor}
            onChange={(e) => updateHeroData({ brandColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={heroData.brandColor}
            onChange={(e) => updateHeroData({ brandColor: e.target.value })}
            placeholder="#8B5CF6"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Color Presets</Label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {[
            '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444',
            '#3B82F6', '#8B5A2B', '#6366F1', '#14B8A6', '#F97316'
          ].map((color) => (
            <button
              key={color}
              onClick={() => updateHeroData({ brandColor: color })}
              className="w-8 h-8 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderTypographyPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Typography</h4>
      
      <div>
        <Label htmlFor="textColor">Text Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="textColor"
            type="color"
            value={heroData.textColor}
            onChange={(e) => updateHeroData({ textColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={heroData.textColor}
            onChange={(e) => updateHeroData({ textColor: e.target.value })}
            placeholder="#ffffff"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Text Presets</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'White', color: '#ffffff' },
            { name: 'Black', color: '#000000' },
            { name: 'Dark Gray', color: '#374151' },
            { name: 'Light Gray', color: '#9CA3AF' }
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => updateHeroData({ textColor: preset.color })}
              className="p-2 text-sm border rounded-md hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: preset.color }}
                />
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderImagesPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Hero Images</h4>
      
      <div>
        <Label htmlFor="heroImageUrl">Hero Image URL</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="heroImageUrl"
            value={heroData.heroImageUrl}
            onChange={(e) => updateHeroData({ heroImageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const placeholderUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800&h=600&fit=crop`;
                  updateHeroData({ heroImageUrl: placeholderUrl });
                }
              };
              input.click();
            }}
          >
            <Upload className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {heroData.heroImageUrl && (
        <div className="mt-4">
          <img 
            src={heroData.heroImageUrl} 
            alt="Hero preview"
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      <div>
        <Label>Stock Images</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
            'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400'
          ].map((url, index) => (
            <button
              key={index}
              onClick={() => updateHeroData({ heroImageUrl: url })}
              className="aspect-video rounded-lg overflow-hidden border hover:ring-2 hover:ring-purple-500"
            >
              <img 
                src={url} 
                alt={`Stock image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLayoutPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Layout Options</h4>
      
      <div>
        <Label>Hero Layout</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            { name: 'Centered', value: 'centered' },
            { name: 'Left Aligned', value: 'left' },
            { name: 'Right Aligned', value: 'right' },
            { name: 'Split Screen', value: 'split' }
          ].map((layout) => (
            <button
              key={layout.value}
              onClick={() => updateHeroData({ heroLayout: layout.value })}
              className={`p-3 border rounded-lg text-sm transition-all ${
                heroData.heroLayout === layout.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {layout.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Section Height</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            { name: 'Compact', value: 'sm' },
            { name: 'Standard', value: 'md' },
            { name: 'Full Screen', value: 'lg' }
          ].map((height) => (
            <button
              key={height.value}
              onClick={() => updateHeroData({ heroHeight: height.value })}
              className={`p-2 border rounded text-sm ${
                heroData.heroHeight === height.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {height.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Content Editor */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Content</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Main Headline *</Label>
            <Input
              id="heroTitle"
              value={heroData.heroTitle}
              onChange={(e) => updateHeroData({ heroTitle: e.target.value })}
              placeholder="Welcome to Your Business"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="heroSubtitle">Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={heroData.heroSubtitle}
              onChange={(e) => updateHeroData({ heroSubtitle: e.target.value })}
              placeholder="Professional services that exceed expectations"
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="heroCtaText">Call-to-Action Button</Label>
            <Input
              id="heroCtaText"
              value={heroData.heroCtaText}
              onChange={(e) => updateHeroData({ heroCtaText: e.target.value })}
              placeholder="Get Started"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Advanced Panel */}
      {activePanel && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {activePanel === 'brand' && <Palette className="w-4 h-4" />}
              {activePanel === 'typography' && <Type className="w-4 h-4" />}
              {activePanel === 'images' && <Image className="w-4 h-4" />}
              {activePanel === 'layout' && <Layout className="w-4 h-4" />}
              <span className="capitalize">{activePanel} Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePanel === 'brand' && renderBrandPanel()}
            {activePanel === 'typography' && renderTypographyPanel()}
            {activePanel === 'images' && renderImagesPanel()}
            {activePanel === 'layout' && renderLayoutPanel()}
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {heroData.heroTitle && (
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center" style={{ color: heroData.textColor }}>
            <h1 className="text-3xl font-bold mb-4" style={{ color: heroData.textColor }}>
              {heroData.heroTitle}
            </h1>
            {heroData.heroSubtitle && (
              <p className="text-lg mb-6 opacity-90" style={{ color: heroData.textColor }}>
                {heroData.heroSubtitle}
              </p>
            )}
            <Button 
              style={{ backgroundColor: heroData.brandColor }}
              className="hover:opacity-90"
            >
              {heroData.heroCtaText}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Advanced Hero Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Use the Brand panel to maintain consistent colors</li>
              <li>• Typography controls help establish visual hierarchy</li>
              <li>• High-quality images make the biggest impact</li>
              <li>• Test different layouts for optimal conversion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};