
import React from "react";
import { motion } from "framer-motion";
import { X, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandColorSection from "./navbar/BrandColorSection";
import { useEnhancedEditing } from "../contexts/EnhancedEditingContext";

interface NavbarBrandPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const NavbarBrandPanel: React.FC<NavbarBrandPanelProps> = ({
  pageData,
  onUpdate,
  onClose
}) => {
  const { markDirty, pushToHistory } = useEnhancedEditing();

  return (
    <div className="p-6 h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Brand Colors</h3>
              <p className="text-sm text-gray-600">Customize your navigation colors</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <BrandColorSection
            pageData={pageData}
            onUpdate={onUpdate}
            pushToHistory={pushToHistory}
            markDirty={markDirty}
          />
        </div>

        {/* Usage Tips */}
        <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-800 mb-2">🎨 Color Tips</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Choose colors that reflect your brand identity</li>
            <li>• Ensure good contrast for accessibility</li>
            <li>• Test colors on both light and dark backgrounds</li>
            <li>• Consider your target audience's preferences</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default NavbarBrandPanel;
