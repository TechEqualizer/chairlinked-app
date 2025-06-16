
import React from "react";

interface BrandColorsPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const BrandColorsPanel: React.FC<BrandColorsPanelProps> = ({ pageData, onUpdate }) => {
  const handleColorChange = (colorType: string, color: string) => {
    console.log(`🎨 [BrandColorsPanel] Changing ${colorType} to:`, color);
    console.log(`🎨 [BrandColorsPanel] Current pageData:`, { 
      brandColor: pageData.brandColor,
      brandSecondary: pageData.brandSecondary,
      brandAccent: pageData.brandAccent 
    });
    
    // Force immediate update with new color
    const updates = { [colorType]: color };
    console.log(`🎨 [BrandColorsPanel] Sending updates:`, updates);
    onUpdate(updates);
  };

  const brandPresets = [
    { name: 'Blue Modern', primary: '#3b82f6', secondary: '#1e40af', accent: '#60a5fa' },
    { name: 'Purple Luxury', primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' },
    { name: 'Green Fresh', primary: '#10b981', secondary: '#059669', accent: '#34d399' },
    { name: 'Orange Bold', primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' },
    { name: 'Pink Creative', primary: '#ec4899', secondary: '#db2777', accent: '#f472b6' },
    { name: 'Teal Professional', primary: '#14b8a6', secondary: '#0d9488', accent: '#5eead4' }
  ];

  const applyPreset = (preset: any) => {
    console.log(`🎨 [BrandColorsPanel] Applying preset:`, preset);
    const updates = {
      brandColor: preset.primary,
      brandSecondary: preset.secondary,
      brandAccent: preset.accent
    };
    console.log(`🎨 [BrandColorsPanel] Preset updates:`, updates);
    onUpdate(updates);
  };

  return (
    <div className="space-y-6">
      {/* Primary Brand Color */}
      <div>
        <label className="text-gray-900 text-sm font-medium block mb-3">
          Brand Colors
        </label>
        
        <div className="space-y-4">
          {/* Primary Brand Color */}
          <div>
            <label className="text-gray-700 text-xs font-medium block mb-2">
              Primary Brand Color (Buttons, Links)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={pageData.brandColor || '#6366f1'}
                onChange={(e) => handleColorChange('brandColor', e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <div>
                <span className="text-sm text-gray-600 font-mono block">
                  {pageData.brandColor || '#6366f1'}
                </span>
                <span className="text-xs text-gray-500">
                  Used for CTAs and primary elements
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Brand Color */}
          <div>
            <label className="text-gray-700 text-xs font-medium block mb-2">
              Secondary Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={pageData.brandSecondary || '#4f46e5'}
                onChange={(e) => handleColorChange('brandSecondary', e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <div>
                <span className="text-sm text-gray-600 font-mono block">
                  {pageData.brandSecondary || '#4f46e5'}
                </span>
                <span className="text-xs text-gray-500">
                  Used for secondary buttons and accents
                </span>
              </div>
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="text-gray-700 text-xs font-medium block mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={pageData.brandAccent || '#818cf8'}
                onChange={(e) => handleColorChange('brandAccent', e.target.value)}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <div>
                <span className="text-sm text-gray-600 font-mono block">
                  {pageData.brandAccent || '#818cf8'}
                </span>
                <span className="text-xs text-gray-500">
                  Used for highlights and hover states
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Presets */}
      <div>
        <label className="text-gray-700 text-sm font-medium block mb-3">
          Brand Presets
        </label>
        <div className="grid grid-cols-1 gap-2">
          {brandPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{preset.name}</span>
                <div className="flex gap-1">
                  <div 
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: preset.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandColorsPanel;
