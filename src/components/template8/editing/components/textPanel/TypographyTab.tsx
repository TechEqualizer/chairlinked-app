import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import { fontOptions } from "../../../hero/FontManager";
import { fontCategories, fontWeightOptions } from "./constants";

interface TypographyTabProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const TypographyTab: React.FC<TypographyTabProps> = ({ pageData, onUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Modern");

  const handleFontFamilyChange = (fontValue: string) => {
    const selectedFont = fontOptions.find(f => f.value === fontValue);
    if (selectedFont) {
      onUpdate({ 
        fontFamily: fontValue,
        fontClass: selectedFont.class
      });
    }
  };

  const handleReset = () => {
    console.log('Resetting typography to Template 8 polished defaults');
    onUpdate({
      fontFamily: "Inter",
      fontClass: "font-inter",
      fontWeight: "bold", // Keep bold for headlines as this maintains the design hierarchy
      fontSize: undefined, // Let Tailwind responsive classes handle sizing
      lineHeight: undefined // Let Tailwind handle line heights for proper responsiveness
    });
  };

  const filteredFonts = fontOptions.filter(font => font.category === selectedCategory);

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

      {/* Font Categories */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Font Category</label>
        <div className="flex flex-wrap gap-1">
          {fontCategories.map((category) => (
            <button
              key={category}
              className={`px-2 py-1 text-xs rounded-md border transition-all ${
                selectedCategory === category
                  ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Font Family</label>
        <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
          {filteredFonts.map((font) => (
            <button
              key={font.value}
              className={`px-2 py-2 text-xs rounded-lg border transition-all text-left ${
                pageData.fontFamily === font.value
                  ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => handleFontFamilyChange(font.value)}
            >
              <span className={font.class}>{font.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Weight */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Font Weight</label>
        <div className="grid grid-cols-2 gap-1">
          {fontWeightOptions.map((weight) => (
            <button
              key={weight.value}
              className={`px-2 py-2 text-xs rounded-lg border transition-all ${
                pageData.fontWeight === weight.value
                  ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => onUpdate({ fontWeight: weight.value })}
            >
              <span className={weight.class}>{weight.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">
          Font Size: {pageData.fontSize || 16}px
        </label>
        <input
          type="range"
          min="12"
          max="32"
          value={pageData.fontSize || 16}
          onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
          className="w-full accent-indigo-500"
        />
      </div>

      {/* Line Height */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">
          Line Height: {pageData.lineHeight || 1.5}
        </label>
        <input
          type="range"
          min="1"
          max="2"
          step="0.1"
          value={pageData.lineHeight || 1.5}
          onChange={(e) => onUpdate({ lineHeight: parseFloat(e.target.value) })}
          className="w-full accent-indigo-500"
        />
      </div>
    </div>
  );
};

export default TypographyTab;
