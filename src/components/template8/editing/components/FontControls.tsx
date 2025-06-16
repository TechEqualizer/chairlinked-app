
import React from "react";
import { RotateCcw } from "lucide-react";
import { fontOptions } from "./FontManager";

interface FontControlsProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const FontControls: React.FC<FontControlsProps> = ({ pageData, onUpdate }) => {
  const handleFontChange = (fontValue: string) => {
    console.log('🔤 Changing font to:', fontValue);
    const selectedFont = fontOptions.find(f => f.value === fontValue);
    if (selectedFont) {
      onUpdate({ 
        fontFamily: fontValue,
        fontClass: selectedFont.class
      });
    }
  };

  const handleColorChange = (colorType: string, color: string) => {
    console.log(`🎨 Changing ${colorType} to:`, color);
    onUpdate({ [colorType]: color });
  };

  const handleReset = () => {
    console.log('Resetting typography to Template 8 defaults');
    onUpdate({
      fontFamily: "inter",
      fontClass: "font-inter",
      fontWeight: "bold",
      fontSize: undefined,
      lineHeight: undefined,
      textColor: "#232946",
      secondaryTextColor: "#6b7280"
    });
  };

  const colorPresets = [
    { name: 'Dark', primary: '#1f2937', secondary: '#6b7280' },
    { name: 'Black', primary: '#000000', secondary: '#374151' },
    { name: 'Navy', primary: '#1e3a8a', secondary: '#64748b' },
    { name: 'Brown', primary: '#92400e', secondary: '#a3a3a3' },
    { name: 'Gray', primary: '#374151', secondary: '#9ca3af' }
  ];

  return (
    <div className="space-y-6">
      {/* Reset Button */}
      <div className="pb-2 border-b border-gray-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors w-full justify-center"
        >
          <RotateCcw size={12} />
          Reset to Default
        </button>
      </div>

      {/* Font Selection */}
      <div>
        <label className="text-gray-900 text-sm font-medium block mb-3">
          Choose Font
        </label>
        <div className="space-y-2">
          {fontOptions.map((font) => (
            <button
              key={font.value}
              onClick={() => handleFontChange(font.value)}
              className={`w-full text-left py-3 px-4 rounded-lg transition-all ${
                pageData.fontFamily === font.value
                  ? 'bg-blue-100 border border-blue-300 text-blue-800'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
              }`}
            >
              <div className={`${font.class} text-base`}>
                {font.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                The quick brown fox jumps
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size Control */}
      <div>
        <label className="text-gray-900 text-sm font-medium block mb-2">
          Font Size: {pageData.fontSize || 16}px
        </label>
        <input
          type="range"
          min="12"
          max="24"
          value={pageData.fontSize || 16}
          onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Text Colors Section */}
      <div>
        <label className="text-gray-900 text-sm font-medium block mb-3">
          Text Colors
        </label>
        
        {/* Primary Text Color */}
        <div className="space-y-3">
          <div>
            <label className="text-gray-700 text-xs font-medium block mb-2">
              Primary Text (Headlines)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={pageData.textColor || '#1f2937'}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-600 font-mono">
                {pageData.textColor || '#1f2937'}
              </span>
            </div>
          </div>

          {/* Secondary Text Color */}
          <div>
            <label className="text-gray-700 text-xs font-medium block mb-2">
              Secondary Text (Descriptions)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={pageData.secondaryTextColor || '#6b7280'}
                onChange={(e) => handleColorChange('secondaryTextColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-600 font-mono">
                {pageData.secondaryTextColor || '#6b7280'}
              </span>
            </div>
          </div>
        </div>

        {/* Color Presets */}
        <div className="mt-4">
          <label className="text-gray-700 text-xs font-medium block mb-2">
            Quick Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onUpdate({ 
                  textColor: preset.primary, 
                  secondaryTextColor: preset.secondary 
                })}
                className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.secondary }}
                  />
                </div>
                <span className="text-xs text-gray-600">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-2">Preview:</div>
          <h4 
            className="font-semibold mb-1" 
            style={{ color: pageData.textColor || '#1f2937' }}
          >
            Sample Headline
          </h4>
          <p 
            className="text-sm" 
            style={{ color: pageData.secondaryTextColor || '#6b7280' }}
          >
            This is how your text will look with the selected colors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontControls;
