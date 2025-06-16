
import React from "react";
import { RotateCcw, Loader2 } from "lucide-react";
import { colorPresets } from "./constants";
import { useDebouncedColorPicker } from "@/hooks/useDebouncedColorPicker";

interface ColorsTabProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

// Standardized default colors
const DEFAULT_TEXT_COLOR = '#ffffff';
const DEFAULT_SECONDARY_TEXT_COLOR = '#e5e7eb';

const ColorsTab: React.FC<ColorsTabProps> = ({ pageData, onUpdate }) => {
  const primaryColorPicker = useDebouncedColorPicker({
    initialValue: pageData.textColor || DEFAULT_TEXT_COLOR,
    onUpdate: (value) => onUpdate({ textColor: value }),
    delay: 300
  });

  const secondaryColorPicker = useDebouncedColorPicker({
    initialValue: pageData.secondaryTextColor || DEFAULT_SECONDARY_TEXT_COLOR,
    onUpdate: (value) => onUpdate({ secondaryTextColor: value }),
    delay: 300
  });

  const handleReset = () => {
    console.log('Resetting colors to Template 8 defaults');
    onUpdate({
      textColor: DEFAULT_TEXT_COLOR,
      secondaryTextColor: DEFAULT_SECONDARY_TEXT_COLOR
    });
  };

  const handlePresetLoad = (preset: any) => {
    onUpdate({ 
      textColor: preset.primary, 
      secondaryTextColor: preset.secondary 
    });
  };

  return (
    <div className="space-y-4">
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

      {/* Primary Text Color */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Primary Text (Headlines)</label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={primaryColorPicker.value}
              onChange={(e) => primaryColorPicker.onChange(e.target.value)}
              className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
            />
            {primaryColorPicker.isUpdating && (
              <div className="absolute -top-1 -right-1">
                <Loader2 size={12} className="animate-spin text-blue-500" />
              </div>
            )}
          </div>
          <span className="text-xs text-gray-600 font-mono">
            {primaryColorPicker.value}
          </span>
        </div>
      </div>

      {/* Secondary Text Color */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Secondary Text (Descriptions)</label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={secondaryColorPicker.value}
              onChange={(e) => secondaryColorPicker.onChange(e.target.value)}
              className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
            />
            {secondaryColorPicker.isUpdating && (
              <div className="absolute -top-1 -right-1">
                <Loader2 size={12} className="animate-spin text-blue-500" />
              </div>
            )}
          </div>
          <span className="text-xs text-gray-600 font-mono">
            {secondaryColorPicker.value}
          </span>
        </div>
      </div>

      {/* Color Presets */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Quick Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetLoad(preset)}
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
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500 mb-2">Preview:</div>
        <h4 
          className="font-semibold mb-1" 
          style={{ 
            color: primaryColorPicker.value,
            fontSize: `${(pageData.fontSize || 16) * 1.2}px`,
            lineHeight: pageData.lineHeight || 1.5
          }}
        >
          Sample Headline
        </h4>
        <p 
          className="text-sm" 
          style={{ 
            color: secondaryColorPicker.value,
            fontSize: `${pageData.fontSize || 16}px`,
            lineHeight: pageData.lineHeight || 1.5
          }}
        >
          This is how your text will look with the selected styling.
        </p>
      </div>
    </div>
  );
};

export default ColorsTab;
