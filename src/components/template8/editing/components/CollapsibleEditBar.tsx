
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings } from "lucide-react";
import FontManager from "./FontManager";
import AIControls from "./AIControls";
import StoriesEditBar from "./StoriesEditBar";
import HeroEditBar from "./HeroEditBar";
import GalleryEditBar from "./GalleryEditBar";
import StoryEditErrorBoundary from "./StoryEditErrorBoundary";

interface CollapsibleEditBarProps {
  currentSection: string;
  pageData: any;
  onUpdate: (updates: any) => void;
  onRegenerate: () => void;
  onStyleRegenerate?: (style: string) => void;
  onUndo?: () => void;
  isOpen: boolean;
  onToggle: () => void;
  isRegenerating?: boolean;
  lastRegenerationResult?: any;
  canUndo?: boolean;
}

const CollapsibleEditBar: React.FC<CollapsibleEditBarProps> = ({
  currentSection,
  pageData,
  onUpdate,
  onRegenerate,
  onStyleRegenerate,
  onUndo,
  isOpen,
  onToggle,
  isRegenerating = false,
  lastRegenerationResult,
  canUndo = false
}) => {
  console.log('[CollapsibleEditBar] Render state:', { 
    isOpen, 
    currentSection,
    isRegenerating,
    pageDataKeys: pageData ? Object.keys(pageData) : 'no pageData'
  });

  const getSectionSpecificContent = () => {
    const sectionName = currentSection.toLowerCase();
    
    if (sectionName.includes('stories') || sectionName.includes('instagram')) {
      return (
        <StoryEditErrorBoundary>
          <StoriesEditBar 
            pageData={pageData} 
            onUpdate={onUpdate} 
            brandColor={pageData?.brandColor || "#8B5CF6"} 
          />
        </StoryEditErrorBoundary>
      );
    }
    
    if (sectionName.includes('hero')) {
      return <HeroEditBar pageData={pageData} onUpdate={onUpdate} />;
    }
    
    if (sectionName.includes('gallery')) {
      return <GalleryEditBar pageData={pageData} onUpdate={onUpdate} brandColor={pageData?.brandColor || "#8B5CF6"} />;
    }
    
    // Default to AI controls for other sections
    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <AIControls 
          currentSection={currentSection} 
          onRegenerate={onRegenerate} 
          onStyleRegenerate={onStyleRegenerate}
          onUndo={onUndo}
          onUpdate={onUpdate}
          isRegenerating={isRegenerating}
          lastResult={lastRegenerationResult}
          canUndo={canUndo}
        />
      </div>
    );
  };

  return (
    <>
      <FontManager selectedFont={pageData?.fontFamily || 'inter'} />
      
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-20 right-4 z-[80] p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Settings size={18} />
        </button>
      )}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 384, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 384, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-14 right-4 bottom-20 z-[80] w-80 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-medium text-gray-900 text-sm">Edit {currentSection}</h3>
              <button
                onClick={onToggle}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 overflow-y-auto h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {getSectionSpecificContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CollapsibleEditBar;
