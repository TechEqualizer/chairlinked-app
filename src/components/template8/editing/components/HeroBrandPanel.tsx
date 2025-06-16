
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Palette, Save, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BrandColorPresets from "../../hero/BrandColorPresets";

interface HeroBrandPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const HeroBrandPanel: React.FC<HeroBrandPanelProps> = ({
  pageData,
  onUpdate,
  onClose
}) => {
  const [savedPresets, setSavedPresets] = useState<Array<{
    name: string;
    primary: string;
    secondary: string;
    accent: string;
  }>>([
    { name: "Ocean", primary: "#0EA5E9", secondary: "#3B82F6", accent: "#06B6D4" },
    { name: "Forest", primary: "#10B981", secondary: "#059669", accent: "#34D399" },
    { name: "Sunset", primary: "#F97316", secondary: "#EA580C", accent: "#FB923C" },
  ]);

  const handleColorChange = (colorType: string, color: string) => {
    onUpdate({ [colorType]: color });
  };

  const saveCurrentAsPreset = () => {
    const presetName = prompt("Enter a name for this color preset:");
    if (presetName) {
      const newPreset = {
        name: presetName,
        primary: pageData.brandColor || "#8B5CF6",
        secondary: pageData.brandSecondary || "#EC4899",
        accent: pageData.brandAccent || "#F59E0B"
      };
      setSavedPresets([...savedPresets, newPreset]);
    }
  };

  const applyPreset = (preset: any) => {
    onUpdate({
      brandColor: preset.primary,
      brandSecondary: preset.secondary,
      brandAccent: preset.accent
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 z-50 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <Card className="shadow-xl border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Brand Colors
            </CardTitle>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Brand Color */}
          <div>
            <label className="text-sm font-medium mb-2 block">Primary Brand Color</label>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm"
                style={{ backgroundColor: pageData.brandColor || "#8B5CF6" }}
              />
              <input
                type="color"
                value={pageData.brandColor || "#8B5CF6"}
                onChange={(e) => handleColorChange('brandColor', e.target.value)}
                className="flex-1 h-10 rounded-md border border-gray-300 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Affects tagline badge, CTA button, and social proof accents</p>
          </div>

          {/* Secondary Brand Color */}
          <div>
            <label className="text-sm font-medium mb-2 block">Secondary Color</label>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm"
                style={{ backgroundColor: pageData.brandSecondary || "#EC4899" }}
              />
              <input
                type="color"
                value={pageData.brandSecondary || "#EC4899"}
                onChange={(e) => handleColorChange('brandSecondary', e.target.value)}
                className="flex-1 h-10 rounded-md border border-gray-300 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Used for gradients and background elements</p>
          </div>

          {/* Accent Color */}
          <div>
            <label className="text-sm font-medium mb-2 block">Accent Color</label>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm"
                style={{ backgroundColor: pageData.brandAccent || "#F59E0B" }}
              />
              <input
                type="color"
                value={pageData.brandAccent || "#F59E0B"}
                onChange={(e) => handleColorChange('brandAccent', e.target.value)}
                className="flex-1 h-10 rounded-md border border-gray-300 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Used for highlights and special elements</p>
          </div>

          {/* Quick Presets */}
          <BrandColorPresets
            selectedColor={pageData.brandColor || "#8B5CF6"}
            onColorSelect={(color) => handleColorChange('brandColor', color)}
          />

          {/* Saved Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Saved Presets</label>
              <Button
                variant="outline"
                size="sm"
                onClick={saveCurrentAsPreset}
                className="h-7 px-2 text-xs"
              >
                <Save className="w-3 h-3 mr-1" />
                Save Current
              </Button>
            </div>
            <div className="space-y-2">
              {savedPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="w-full p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-3"
                >
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded border border-gray-200"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded border border-gray-200"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded border border-gray-200"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-2">Color Preview:</div>
            <div className="space-y-2">
              <div 
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${pageData.brandColor || "#8B5CF6"}20`,
                  color: pageData.brandColor || "#8B5CF6",
                  border: `1px solid ${pageData.brandColor || "#8B5CF6"}40`
                }}
              >
                <Star className="w-3 h-3 mr-1" />
                Tagline Badge
              </div>
              <div
                className="w-full py-2 px-4 rounded-lg text-white text-sm font-medium text-center"
                style={{ backgroundColor: pageData.brandColor || "#8B5CF6" }}
              >
                CTA Button
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HeroBrandPanel;
