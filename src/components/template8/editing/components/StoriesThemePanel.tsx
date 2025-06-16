
import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import SectionThemeSelector from "./SectionThemeSelector";
import StoryShapeSelector from "./StoryShapeSelector";
import { SectionTheme } from "../../utils/themeUtils";

interface StoriesThemePanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const StoriesThemePanel: React.FC<StoriesThemePanelProps> = ({
  pageData,
  onUpdate,
  onClose
}) => {
  const handleThemeChange = (theme: SectionTheme) => {
    onUpdate({ storiesTheme: theme });
  };

  const handleShapeChange = (shape: 'circle' | 'square' | 'star') => {
    onUpdate({ storyShape: shape });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-20 right-20 w-80 max-h-[calc(100vh-120px)] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-6 z-50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Theme & Style</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-6">
        <SectionThemeSelector
          currentTheme={pageData.storiesTheme || 'light'}
          onThemeChange={handleThemeChange}
          sectionName="Stories"
        />

        <StoryShapeSelector
          currentShape={pageData.storyShape || 'circle'}
          onShapeChange={handleShapeChange}
        />
      </div>
    </motion.div>
  );
};

export default StoriesThemePanel;
