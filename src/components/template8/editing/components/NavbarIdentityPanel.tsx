
import React from "react";
import { motion } from "framer-motion";
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoUploadSection from "./navbar/LogoUploadSection";
import BusinessNameField from "./navbar/BusinessNameField";
import CTAButtonField from "./navbar/CTAButtonField";
import { useEnhancedEditing } from "../contexts/EnhancedEditingContext";

interface NavbarIdentityPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const NavbarIdentityPanel: React.FC<NavbarIdentityPanelProps> = ({
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
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Primary Identity</h3>
              <p className="text-sm text-gray-600">Logo, business name, and call-to-action</p>
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
          <LogoUploadSection
            pageData={pageData}
            onUpdate={onUpdate}
            pushToHistory={pushToHistory}
            markDirty={markDirty}
          />

          <BusinessNameField
            pageData={pageData}
            onUpdate={onUpdate}
            pushToHistory={pushToHistory}
            markDirty={markDirty}
          />

          <CTAButtonField
            pageData={pageData}
            onUpdate={onUpdate}
            pushToHistory={pushToHistory}
            markDirty={markDirty}
          />
        </div>

        {/* Usage Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">💡 Identity Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Logo serves as your primary visual identity</li>
            <li>• Business name appears when logo isn't available</li>
            <li>• CTA button should encourage your main desired action</li>
            <li>• Keep text concise for mobile compatibility</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default NavbarIdentityPanel;
