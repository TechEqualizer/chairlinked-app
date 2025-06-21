
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
    <div className="h-full pt-4 pb-10 relative">
      {/* Maximized Content Container with Full Height */}
      <div className="h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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

      {/* Minimal Auto-save indicator */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-10 right-4 z-[60] pointer-events-none"
          >
            <div className="bg-white/80 backdrop-blur-md border border-gray-200/20 rounded-full px-2 py-1 shadow-sm flex items-center gap-1">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-gray-600">Saving</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditingSectionArea;
