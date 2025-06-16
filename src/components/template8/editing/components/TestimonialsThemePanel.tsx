
import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import SectionThemeSelector from "./SectionThemeSelector";
import { SectionTheme } from "../../utils/themeUtils";

interface TestimonialsThemePanelProps {
  currentTheme: SectionTheme;
  onThemeChange: (theme: SectionTheme) => void;
  onClose: () => void;
}

const TestimonialsThemePanel: React.FC<TestimonialsThemePanelProps> = ({
  currentTheme,
  onThemeChange,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-6 z-50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Theme Settings</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        <SectionThemeSelector
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
          sectionName="Testimonials"
        />
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 Tip: Choose a theme that complements your brand and improves readability
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialsThemePanel;
