
import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { X, Type, Save, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FontControls from "./FontControls";
import { useDebouncedColorPicker } from "@/hooks/useDebouncedColorPicker";

interface HeroTypographyPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

interface ColorPreset {
  id: string;
  name: string;
  textColor: string;
  secondaryTextColor: string;
  isBuiltIn?: boolean;
}

// Standardized defaults
const DEFAULT_TEXT_COLOR = '#ffffff';
const DEFAULT_SECONDARY_TEXT_COLOR = '#e5e7eb';

const builtInPresets: ColorPreset[] = [
  { id: 'template8', name: 'Template 8', textColor: DEFAULT_TEXT_COLOR, secondaryTextColor: DEFAULT_SECONDARY_TEXT_COLOR, isBuiltIn: true },
  { id: 'dark', name: 'Dark', textColor: '#1f2937', secondaryTextColor: '#6b7280', isBuiltIn: true },
  { id: 'black', name: 'Black', textColor: '#000000', secondaryTextColor: '#374151', isBuiltIn: true },
  { id: 'navy', name: 'Navy', textColor: '#1e3a8a', secondaryTextColor: '#64748b', isBuiltIn: true },
  { id: 'brown', name: 'Brown', textColor: '#92400e', secondaryTextColor: '#a3a3a3', isBuiltIn: true }
];

const HeroTypographyPanel: React.FC<HeroTypographyPanelProps> = memo(({
  pageData,
  onUpdate,
  onClose
}) => {
  const [customPresets, setCustomPresets] = useState<ColorPreset[]>([]);
  const [presetName, setPresetName] = useState("");

  // Debounced color pickers for smooth updates
  const primaryColorPicker = useDebouncedColorPicker({
    initialValue: pageData.textColor || DEFAULT_TEXT_COLOR,
    onUpdate: (value) => onUpdate({ textColor: value }),
    delay: 200
  });

  const secondaryColorPicker = useDebouncedColorPicker({
    initialValue: pageData.secondaryTextColor || DEFAULT_SECONDARY_TEXT_COLOR,
    onUpdate: (value) => onUpdate({ secondaryTextColor: value }),
    delay: 200
  });

  useEffect(() => {
    // Load custom presets from localStorage
    const saved = localStorage.getItem('heroTextColorPresets');
    if (saved) {
      try {
        setCustomPresets(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load custom presets:', error);
      }
    }
  }, []);

  const saveCustomPresets = (presets: ColorPreset[]) => {
    setCustomPresets(presets);
    localStorage.setItem('heroTextColorPresets', JSON.stringify(presets));
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    
    const newPreset: ColorPreset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      textColor: primaryColorPicker.value,
      secondaryTextColor: secondaryColorPicker.value,
      isBuiltIn: false
    };

    const updatedPresets = [...customPresets, newPreset];
    saveCustomPresets(updatedPresets);
    setPresetName("");
  };

  const handleLoadPreset = (preset: ColorPreset) => {
    onUpdate({
      textColor: preset.textColor,
      secondaryTextColor: preset.secondaryTextColor
    });
  };

  const handleDeletePreset = (presetId: string) => {
    const updatedPresets = customPresets.filter(p => p.id !== presetId);
    saveCustomPresets(updatedPresets);
  };

  const handleSocialProofChange = (field: string, value: string) => {
    onUpdate({
      socialProof: {
        ...pageData.socialProof,
        [field]: value
      }
    });
  };

  const allPresets = [...builtInPresets, ...customPresets];

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
              <Type className="w-5 h-5" />
              Typography & Text
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
          {/* Font Controls */}
          <FontControls pageData={pageData} onUpdate={onUpdate} />

          {/* Text Colors */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Text Colors</Label>
            
            {/* Primary Text Color */}
            <div className="mb-4">
              <label className="text-xs text-gray-600 mb-2 block">Primary Text (Headlines)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColorPicker.value}
                  onChange={(e) => primaryColorPicker.onChange(e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-xs text-gray-600 font-mono">
                  {primaryColorPicker.value}
                </span>
              </div>
            </div>

            {/* Secondary Text Color */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Secondary Text (Descriptions)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColorPicker.value}
                  onChange={(e) => secondaryColorPicker.onChange(e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-xs text-gray-600 font-mono">
                  {secondaryColorPicker.value}
                </span>
              </div>
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Color Presets</Label>
            
            {/* Save New Preset */}
            <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: primaryColorPicker.value }}
                />
                <div
                  className="w-6 h-6 rounded border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: secondaryColorPicker.value }}
                />
                <Input
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset name"
                  className="text-xs h-8"
                />
                <button
                  onClick={handleSavePreset}
                  disabled={!presetName.trim()}
                  className="p-1 bg-indigo-100 hover:bg-indigo-200 disabled:bg-gray-100 disabled:text-gray-400 text-indigo-700 rounded transition-colors"
                >
                  <Save size={14} />
                </button>
              </div>
            </div>

            {/* Preset Grid */}
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {allPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group"
                  onClick={() => handleLoadPreset(preset)}
                >
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded border border-gray-200"
                      style={{ backgroundColor: preset.textColor }}
                    />
                    <div
                      className="w-4 h-4 rounded border border-gray-200"
                      style={{ backgroundColor: preset.secondaryTextColor }}
                    />
                  </div>
                  <span className="text-xs font-medium flex-1">{preset.name}</span>
                  {!preset.isBuiltIn && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePreset(preset.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Primary Text Content */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Primary Text</Label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Hero Tagline</label>
                <Input
                  value={pageData.tagline || ""}
                  onChange={(e) => onUpdate({ tagline: e.target.value })}
                  placeholder="Professional badge text"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Headline</label>
                <Input
                  value={pageData.headline || ""}
                  onChange={(e) => onUpdate({ headline: e.target.value })}
                  placeholder="Your main headline"
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Secondary Text Content */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Secondary Text</Label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Subheadline</label>
                <Input
                  value={pageData.subheadline || ""}
                  onChange={(e) => onUpdate({ subheadline: e.target.value })}
                  placeholder="Supporting text under headline"
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Social Proof Text */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Social Proof Text</Label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Years Experience</label>
                <Input
                  value={pageData.socialProof?.yearsExperience || ""}
                  onChange={(e) => handleSocialProofChange('yearsExperience', e.target.value)}
                  placeholder="15+ Years"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Clients Served</label>
                <Input
                  value={pageData.socialProof?.clientsServed || ""}
                  onChange={(e) => handleSocialProofChange('clientsServed', e.target.value)}
                  placeholder="1000+ Happy Clients"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Rating</label>
                <Input
                  value={pageData.socialProof?.rating || ""}
                  onChange={(e) => handleSocialProofChange('rating', e.target.value)}
                  placeholder="4.9/5 Stars"
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

HeroTypographyPanel.displayName = 'HeroTypographyPanel';

export default HeroTypographyPanel;
