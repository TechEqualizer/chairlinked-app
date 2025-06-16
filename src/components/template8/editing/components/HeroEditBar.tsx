
import React from "react";
import { Upload, Palette, Type, Layout } from "lucide-react";
import { Label } from "@/components/ui/label";
import { EditingGlassCard } from "@/components/ui/enhanced-glass-morphism";
import BackgroundControls from "./BackgroundControls";
import BrandColorsPanel from "./BrandColorsPanel";
import FontControls from "./FontControls";

interface HeroEditBarProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const HeroEditBar: React.FC<HeroEditBarProps> = ({
  pageData,
  onUpdate
}) => {
  return (
    <div className="space-y-6">
      {/* Background Controls */}
      <EditingGlassCard variant="content" className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-blue-600" />
            <Label className="text-sm font-medium">Background & Colors</Label>
          </div>
          <BackgroundControls pageData={pageData} onUpdate={onUpdate} />
        </div>
      </EditingGlassCard>

      {/* Brand Colors */}
      <EditingGlassCard variant="content" className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-purple-600" />
            <Label className="text-sm font-medium">Brand Colors</Label>
          </div>
          <BrandColorsPanel pageData={pageData} onUpdate={onUpdate} />
        </div>
      </EditingGlassCard>

      {/* Typography */}
      <EditingGlassCard variant="content" className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Type size={16} className="text-green-600" />
            <Label className="text-sm font-medium">Typography</Label>
          </div>
          <FontControls pageData={pageData} onUpdate={onUpdate} />
        </div>
      </EditingGlassCard>
    </div>
  );
};

export default HeroEditBar;
