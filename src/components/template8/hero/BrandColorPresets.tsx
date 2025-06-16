
import React from "react";
import { Check } from "lucide-react";

interface BrandColorPresetsProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colorPresets = [
  { name: "Elegant", color: "#6366f1", description: "Professional indigo" },
  { name: "Professional", color: "#3b82f6", description: "Corporate blue" },
  { name: "Luxury", color: "#8b5cf6", description: "Premium purple" },
  { name: "Creative", color: "#f59e0b", description: "Vibrant orange" },
  { name: "Nature", color: "#10b981", description: "Fresh green" },
  { name: "Bold", color: "#ef4444", description: "Energetic red" },
  { name: "Modern", color: "#06b6d4", description: "Tech cyan" },
  { name: "Warm", color: "#f97316", description: "Friendly orange" }
];

const BrandColorPresets: React.FC<BrandColorPresetsProps> = ({ 
  selectedColor, 
  onColorSelect 
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs text-gray-600 font-medium">Brand Color Presets</label>
      <div className="grid grid-cols-2 gap-2">
        {colorPresets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onColorSelect(preset.color)}
            className={`flex items-center gap-2 p-2 rounded-lg border transition ${
              selectedColor === preset.color
                ? 'bg-gray-50 border-gray-300 ring-1 ring-gray-400'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div 
              className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center"
              style={{ backgroundColor: preset.color }}
            >
              {selectedColor === preset.color && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-gray-800">{preset.name}</div>
              <div className="text-xs text-gray-500">{preset.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandColorPresets;
