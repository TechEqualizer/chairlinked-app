
import React from "react";
import { X, Palette } from "lucide-react";
import { motion } from "framer-motion";

interface ModernFloatingColorPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const colorPresets = [
  { name: "Blue", color: "#3B82F6" },
  { name: "Purple", color: "#8B5CF6" },
  { name: "Green", color: "#10B981" },
  { name: "Orange", color: "#F97316" },
  { name: "Pink", color: "#EC4899" },
  { name: "Cyan", color: "#06B6D4" },
];

const ModernFloatingColorPanel: React.FC<ModernFloatingColorPanelProps> = ({ 
  pageData, 
  onUpdate, 
  onClose 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="fixed top-32 right-4 z-50 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200 p-4 w-64"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          <h3 className="font-medium text-gray-800">Brand Color</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100 transition"
        >
          <X size={14} />
        </button>
      </div>

      {/* Current Color */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm"
            style={{ backgroundColor: pageData.brandColor || "#6366f1" }}
          />
          <input
            type="color"
            value={pageData.brandColor || "#6366f1"}
            onChange={(e) => onUpdate({ brandColor: e.target.value })}
            className="flex-1 h-8 rounded-md border border-gray-300 cursor-pointer"
          />
        </div>
      </div>

      {/* Color Presets */}
      <div className="grid grid-cols-3 gap-2">
        {colorPresets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onUpdate({ brandColor: preset.color })}
            className="group relative h-8 rounded-md border border-gray-200 hover:scale-105 transition-transform"
            style={{ backgroundColor: preset.color }}
            title={preset.name}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-md transition-colors" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ModernFloatingColorPanel;
