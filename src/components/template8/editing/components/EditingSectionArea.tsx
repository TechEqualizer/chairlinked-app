
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SwipeTransition from "../SwipeTransition";
import CurrentSectionRenderer from "./CurrentSectionRenderer";

interface EditingSectionAreaProps {
  isNavigationHidden: boolean;
  swipeDirection: "left" | "right" | null;
  currentSection: any;
  currentSectionIndex: number;
  editingSections: any[];
  sectionData: any;
  handleSectionUpdate: (updates: any) => void;
  heroSectionRef: React.RefObject<HTMLDivElement>;
  isEditBarOpen: boolean;
  handleRegenerate: () => void;
  handleStyleRegenerate: (stylePreset: string) => void;
  handleUndo: () => void;
  handleToggleSettings: () => void;
  isRegenerating: boolean;
  isSaving: boolean;
  lastRegenerationResult: any;
  canUndo: boolean;
  handleEnhancedSave: () => Promise<void>;
}

const EditingSectionArea: React.FC<EditingSectionAreaProps> = ({
  swipeDirection,
  currentSection,
  currentSectionIndex,
  sectionData,
  handleSectionUpdate,
  heroSectionRef,
  isSaving
}) => {
  return (
    <div className="h-full pt-20 pb-32 relative">
      {/* Content Container with Glass Morphism */}
      <div className="h-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full"
          >
            <SwipeTransition direction={swipeDirection}>
              <CurrentSectionRenderer
                sectionComponent={currentSection.component}
                sectionId={currentSection.id}
                sectionData={sectionData}
                onUpdate={handleSectionUpdate}
                swipeDirection={swipeDirection}
                heroSectionRef={heroSectionRef}
                isHeroSection={currentSectionIndex === 0}
              />
            </SwipeTransition>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Auto-save indicator */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-28 right-8 z-[60]"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Auto-saving...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditingSectionArea;
