
import React, { useState } from "react";
import { Palette, Type, Grid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StoriesThemePanel from "./StoriesThemePanel";
import StoriesHeaderPanel from "./StoriesHeaderPanel";
import StoriesManagementPanel from "./StoriesManagementPanel";
import EnhancedVerticalToolbar from "./toolbar/EnhancedVerticalToolbar";

interface StoriesVerticalToolbarProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  brandColor?: string;
  
  // Navigation
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  
  // Validation
  hasErrors?: boolean;
}

const StoriesVerticalToolbar: React.FC<StoriesVerticalToolbarProps> = ({
  pageData,
  onUpdate,
  brandColor = "#8B5CF6",
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  hasErrors
}) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const closePanel = () => {
    setActivePanel(null);
  };

  const availablePanels = [
    {
      id: 'theme',
      icon: <Palette size={18} />,
      title: 'Theme & Style'
    },
    {
      id: 'header',
      icon: <Type size={18} />,
      title: 'Section Header'
    },
    {
      id: 'stories',
      icon: <Grid size={18} />,
      title: 'Stories Management'
    }
  ];

  return (
    <>
      <EnhancedVerticalToolbar
        brandColor={brandColor}
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        availablePanels={availablePanels}
        currentSection="Stories"
        onPrevious={onPrevious}
        onNext={onNext}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        hasErrors={hasErrors}
      />

      {/* Floating Panels */}
      <AnimatePresence>
        {activePanel === 'theme' && (
          <StoriesThemePanel
            pageData={pageData}
            onUpdate={onUpdate}
            onClose={closePanel}
          />
        )}
        
        {activePanel === 'header' && (
          <StoriesHeaderPanel
            pageData={pageData}
            onUpdate={onUpdate}
            onClose={closePanel}
          />
        )}

        {activePanel === 'stories' && (
          <StoriesManagementPanel
            pageData={pageData}
            onUpdate={onUpdate}
            brandColor={brandColor}
            onClose={closePanel}
          />
        )}
      </AnimatePresence>

      {/* Background overlay when panel is open */}
      {activePanel && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/5"
          onClick={closePanel}
        />
      )}
    </>
  );
};

export default StoriesVerticalToolbar;
