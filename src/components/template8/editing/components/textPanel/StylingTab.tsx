
import React from "react";
import { RotateCcw } from "lucide-react";
import { textAlignOptions } from "./constants";

interface StylingTabProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const StylingTab: React.FC<StylingTabProps> = ({ pageData, onUpdate }) => {
  const handleTextAlignChange = (align: string) => {
    console.log('Text align changed to:', align);
    onUpdate({ textAlign: align });
  };

  const handleTextTransformChange = (transform: string) => {
    console.log('Text transform changed to:', transform);
    onUpdate({ textTransform: transform });
  };

  const handleLetterSpacingChange = (spacing: number) => {
    console.log('Letter spacing changed to:', spacing);
    onUpdate({ letterSpacing: spacing });
  };

  const handleStyleToggle = (property: string, value: boolean) => {
    console.log(`${property} toggled to:`, value);
    onUpdate({ [property]: value });
  };

  const handleReset = () => {
    console.log('Resetting styling to defaults');
    onUpdate({
      textAlign: "left",
      textTransform: "none",
      letterSpacing: 0,
      isItalic: false,
      isUnderlined: false
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

      {/* Text Alignment */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Text Alignment</label>
        <div className="grid grid-cols-3 gap-1">
          {textAlignOptions.map((align) => (
            <button
              key={align.value}
              className={`px-2 py-2 text-xs rounded-lg border transition-all ${
                pageData.textAlign === align.value
                  ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => handleTextAlignChange(align.value)}
            >
              {align.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Transform */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Text Transform</label>
        <select
          value={pageData.textTransform || 'none'}
          onChange={(e) => handleTextTransformChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="none">None</option>
          <option value="uppercase">UPPERCASE</option>
          <option value="lowercase">lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>

      {/* Letter Spacing */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">
          Letter Spacing: {pageData.letterSpacing || 0}px
        </label>
        <input
          type="range"
          min="-2"
          max="4"
          step="0.5"
          value={pageData.letterSpacing || 0}
          onChange={(e) => handleLetterSpacingChange(parseFloat(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>

      {/* Text Decoration */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Text Style</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pageData.isItalic || false}
              onChange={(e) => handleStyleToggle('isItalic', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-gray-600 italic">Italic</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pageData.isUnderlined || false}
              onChange={(e) => handleStyleToggle('isUnderlined', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-gray-600 underline">Underlined</span>
          </label>
        </div>
      </div>

      {/* Preview */}
      <div className="p-3 bg-gray-50 rounded-lg border">
        <div className="text-xs text-gray-500 mb-2">Live Preview:</div>
        <div 
          className="text-sm"
          style={{
            textAlign: pageData.textAlign || 'left',
            textTransform: pageData.textTransform || 'none',
            letterSpacing: `${pageData.letterSpacing || 0}px`,
            fontStyle: pageData.isItalic ? 'italic' : 'normal',
            textDecoration: pageData.isUnderlined ? 'underline' : 'none',
            color: pageData.textColor || '#1f2937'
          }}
        >
          Sample text with current styling
        </div>
      </div>
    </div>
  );
};

export default StylingTab;
