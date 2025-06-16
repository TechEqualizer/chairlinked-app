
import React, { useState } from "react";
import { Image, Palette } from "lucide-react";
import CollapsibleSection from "../ui/CollapsibleSection";
import EnhancedImageUploadZone from "../../EnhancedImageUploadZone";
import { backgroundPresets } from "../data/backgroundPresets";
import { overlayPresets } from "../data/overlayPresets";

interface BackgroundImageSectionProps {
  pageData: any;
  onCustomImageUpload: (imageUrl: string) => void;
  onBackgroundChange: (type: string, value?: string) => void;
}

const BackgroundImageSection: React.FC<BackgroundImageSectionProps> = ({ 
  pageData, 
  onCustomImageUpload, 
  onBackgroundChange 
}) => {
  const [selectedCategory, setSelectedCategory] = useState("Professional");

  if (pageData.backgroundType !== 'image') return null;

  const handleOverlayPresetClick = (preset: any) => {
    pageData.onUpdate({
      overlayColor: preset.color,
      backgroundOpacity: preset.opacity
    });
  };

  const handleOverlayColorChange = (color: string) => {
    pageData.onUpdate({ overlayColor: color });
  };

  const handleOpacityChange = (opacity: number) => {
    pageData.onUpdate({ backgroundOpacity: opacity });
  };

  // Ensure overlay color defaults to brand color
  const currentOverlayColor = pageData.overlayColor || pageData.brandColor || '#6366f1';

  return (
    <CollapsibleSection
      title="Background Image"
      icon={<Image className="w-4 h-4 text-green-600" />}
    >
      {/* Custom Upload with Enhanced Processing */}
      <div>
        <label className="text-sm font-medium text-gray-900 block mb-2">Upload Custom Image</label>
        <EnhancedImageUploadZone
          currentImage={pageData.backgroundImage}
          onImageChange={(imageUrl) => {
            onCustomImageUpload(imageUrl);
            // Auto-enable overlay and set to brand color if not already set
            if (!pageData.overlayColor) {
              pageData.onUpdate({ 
                overlayColor: pageData.brandColor || '#6366f1',
                enableImageOverlay: true
              });
            }
          }}
          aspectRatio="16:9"
          brandColor={pageData.brandColor}
          className="mb-3"
          showDimensionHint={true}
        />
      </div>

      {/* Preset Categories */}
      <div>
        <label className="text-sm font-medium text-gray-900 block mb-2">Background Presets</label>
        <div className="flex gap-2 mb-3 flex-wrap">
          {backgroundPresets.map((category) => (
            <button
              key={category.category}
              onClick={() => setSelectedCategory(category.category)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category.category
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {backgroundPresets
            .find(cat => cat.category === selectedCategory)
            ?.images.map((bg, index) => (
            <button
              key={index}
              onClick={() => {
                onBackgroundChange('image', bg);
                // Auto-enable overlay and set to brand color if not already set
                if (!pageData.overlayColor) {
                  pageData.onUpdate({ 
                    overlayColor: pageData.brandColor || '#6366f1',
                    enableImageOverlay: true
                  });
                }
              }}
              className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all transform hover:scale-105 ${
                pageData.backgroundImage === bg 
                  ? 'border-indigo-500 shadow-md' 
                  : 'border-gray-200 hover:border-indigo-400'
              }`}
            >
              <img 
                src={bg} 
                alt={`${selectedCategory} preset ${index + 1}`} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Overlay Controls Section */}
      <div className="space-y-4 border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-purple-600" />
          <h4 className="text-sm font-medium text-gray-900">Image Overlay</h4>
        </div>

        {/* Overlay Color Picker */}
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">Overlay Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={currentOverlayColor}
              onChange={(e) => handleOverlayColorChange(e.target.value)}
              className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
            <div className="flex-1">
              <input
                type="text"
                value={currentOverlayColor}
                onChange={(e) => handleOverlayColorChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md"
                placeholder={pageData.brandColor || '#6366f1'}
              />
            </div>
          </div>
        </div>

        {/* Overlay Opacity */}
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">
            Overlay Opacity: {Math.round((pageData.backgroundOpacity || 0.6) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={pageData.backgroundOpacity || 0.6}
            onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Transparent</span>
            <span>Opaque</span>
          </div>
        </div>

        {/* Overlay Presets */}
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2">
            {overlayPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleOverlayPresetClick(preset)}
                className="p-2 text-xs border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                <div 
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ 
                    backgroundColor: preset.color,
                    opacity: preset.opacity 
                  }}
                />
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Background Controls */}
      <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-4">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Position</label>
          <select
            value={pageData.backgroundPosition || 'center'}
            onChange={(e) => pageData.onUpdate({ backgroundPosition: e.target.value })}
            className="w-full text-xs border border-gray-200 rounded px-2 py-1"
          >
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Size</label>
          <select
            value={pageData.backgroundSize || 'cover'}
            onChange={(e) => pageData.onUpdate({ backgroundSize: e.target.value })}
            className="w-full text-xs border border-gray-200 rounded px-2 py-1"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default BackgroundImageSection;
