
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Palette, AlertTriangle } from "lucide-react";

interface BrandColorSectionProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  pushToHistory: (data: any) => void;
  markDirty: () => void;
}

const BrandColorSection: React.FC<BrandColorSectionProps> = ({
  pageData,
  onUpdate,
  pushToHistory,
  markDirty
}) => {
  const handleColorChange = (field: string, color: string) => {
    pushToHistory(pageData);
    onUpdate({ [field]: color });
    markDirty();
  };

  // Check contrast between navbar background and brand color
  const getContrastRatio = (bg: string, text: string) => {
    // Simple contrast check (simplified for demo)
    const bgLuminance = hexToLuminance(bg);
    const textLuminance = hexToLuminance(text);
    const ratio = (Math.max(bgLuminance, textLuminance) + 0.05) / (Math.min(bgLuminance, textLuminance) + 0.05);
    return ratio;
  };

  const hexToLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };

  const brandColorPresets = [
    { name: "Royal Blue", color: "#3B82F6" },
    { name: "Emerald", color: "#10B981" },
    { name: "Purple", color: "#8B5CF6" },
    { name: "Rose", color: "#F43F5E" },
    { name: "Orange", color: "#F97316" },
    { name: "Teal", color: "#14B8A6" }
  ];

  const backgroundColorPresets = [
    { name: "White", color: "#FFFFFF" },
    { name: "Light Gray", color: "#F8FAFC" },
    { name: "Dark", color: "#1F2937" },
    { name: "Navy", color: "#1E3A8A" }
  ];

  const navbarBg = pageData.navbarBackgroundColor || "#FFFFFF";
  const brandColor = pageData.brandColor || "#3B82F6";
  const contrastRatio = getContrastRatio(navbarBg, brandColor);
  const hasGoodContrast = contrastRatio >= 3; // WCAG AA standard for large text

  return (
    <div className="space-y-4"> {/* Reduced spacing */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3"> {/* Reduced padding */}
          <CardTitle className="flex items-center gap-2 text-base"> {/* Smaller title */}
            <Palette className="w-4 h-4" />
            Brand Text Color
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3"> {/* Reduced spacing */}
          <div className="grid grid-cols-3 gap-1.5"> {/* Reduced gap */}
            {brandColorPresets.map((preset) => (
              <button
                key={preset.color}
                onClick={() => handleColorChange('brandColor', preset.color)}
                className={`p-2 rounded-md border transition-all hover:scale-105 ${
                  pageData.brandColor === preset.color
                    ? 'border-gray-400 ring-1 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              >
                <div className="w-full h-3 rounded" style={{ backgroundColor: preset.color }}></div>
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              type="color"
              value={pageData.brandColor || "#3B82F6"}
              onChange={(e) => handleColorChange('brandColor', e.target.value)}
              className="w-12 h-8 p-1 border" // Smaller size
            />
            <Input
              value={pageData.brandColor || "#3B82F6"}
              onChange={(e) => handleColorChange('brandColor', e.target.value)}
              placeholder="#3B82F6"
              className="flex-1 h-8 text-xs font-mono" // Smaller height and font
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="w-4 h-4" />
            Navbar Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-1.5"> {/* 2 columns for background colors */}
            {backgroundColorPresets.map((preset) => (
              <button
                key={preset.color}
                onClick={() => handleColorChange('navbarBackgroundColor', preset.color)}
                className={`p-2 rounded-md border transition-all hover:scale-105 ${
                  (pageData.navbarBackgroundColor || "#FFFFFF") === preset.color
                    ? 'border-gray-400 ring-1 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              >
                <div className="w-full h-3 rounded border border-gray-200" style={{ backgroundColor: preset.color }}></div>
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              type="color"
              value={pageData.navbarBackgroundColor || "#FFFFFF"}
              onChange={(e) => handleColorChange('navbarBackgroundColor', e.target.value)}
              className="w-12 h-8 p-1 border"
            />
            <Input
              value={pageData.navbarBackgroundColor || "#FFFFFF"}
              onChange={(e) => handleColorChange('navbarBackgroundColor', e.target.value)}
              placeholder="#FFFFFF"
              className="flex-1 h-8 text-xs font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {/* Compact Preview */}
      <Card className="border-gray-200">
        <CardContent className="p-3"> {/* Reduced padding */}
          <div className="space-y-2">
            <div 
              className="p-3 rounded-md border border-gray-200 transition-all"
              style={{ backgroundColor: navbarBg }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: brandColor }}
                  >
                    B
                  </div>
                  <span 
                    className="font-bold text-sm"
                    style={{ color: brandColor }}
                  >
                    {pageData.businessName || "Your Brand"}
                  </span>
                </div>
                <button 
                  className="px-2 py-1 rounded text-white text-xs"
                  style={{ backgroundColor: brandColor }}
                >
                  {pageData.ctaText || "Get Started"}
                </button>
              </div>
            </div>

            {/* Compact Contrast Warning */}
            {!hasGoodContrast && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                <div className="text-xs text-amber-700">
                  Low contrast - text may be hard to read
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandColorSection;
