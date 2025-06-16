
import React, { ForwardedRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CurrentSectionRendererProps {
  sectionComponent: React.ComponentType<{ pageData: any; onUpdate: (updates: any) => void }>;
  sectionId: string | number;
  sectionData: any;
  onUpdate: (updates: any) => void;
  swipeDirection: "left" | "right" | null;
  heroSectionRef?: ForwardedRef<HTMLDivElement>;
  isHeroSection: boolean;
}

/**
 * Animated container for rendering the currently selected section in editing flow.
 * Split from EnhancedFullScreenEditingFlow to keep main file smaller and maintainable.
 */
const CurrentSectionRenderer: React.FC<CurrentSectionRendererProps> = ({
  sectionComponent: SectionComponent,
  sectionId,
  sectionData,
  onUpdate,
  swipeDirection,
  heroSectionRef,
  isHeroSection,
}) => {
  return (
    <div 
      ref={isHeroSection ? heroSectionRef : undefined}
      className="h-full overflow-y-auto bg-white" 
      style={{ zIndex: 1, paddingRight: '100px' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={sectionId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full relative px-4"
          style={{ zIndex: 1 }}
        >
          <SectionComponent
            pageData={sectionData}
            onUpdate={onUpdate}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CurrentSectionRenderer;
