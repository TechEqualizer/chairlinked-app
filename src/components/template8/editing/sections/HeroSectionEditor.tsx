
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionEditorWrapper from "../components/SectionEditorWrapper";
import EditableTemplate8HeroBlock from "../../editableBlocks/EditableTemplate8HeroBlock";
import { EditModeProvider } from "@/components/chairlinked/editing/EditModeContext";
import DirectEditOverlay from "../DirectEditOverlay";
import HeroVerticalToolbar from "../components/HeroVerticalToolbar";
import HeroBrandPanel from "../components/HeroBrandPanel";
import HeroTypographyPanel from "../components/HeroTypographyPanel";
import HeroImagesPanel from "../components/HeroImagesPanel";
import HeroLayoutPanel from "../components/HeroLayoutPanel";
import { useUniversalEditing } from "../hooks/useUniversalEditing";

interface HeroSectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ 
  pageData, 
  onUpdate, 
  onSave,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const {
    handleUpdate
  } = useUniversalEditing({ pageData, onUpdate, onSave });

  const closePanel = () => {
    setActivePanel(null);
  };

  return (
    <EditModeProvider initialEditMode={true}>
      <SectionEditorWrapper sectionName="Hero Section">
        <EditableTemplate8HeroBlock pageData={pageData} onUpdate={handleUpdate} />
        <DirectEditOverlay pageData={pageData} onUpdate={handleUpdate} />
        
        <HeroVerticalToolbar
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          brandColor={pageData.brandColor}
          hasErrors={false}
        />

        {/* Floating Panels */}
        <AnimatePresence>
          {activePanel === 'brand' && (
            <HeroBrandPanel
              pageData={pageData}
              onUpdate={handleUpdate}
              onClose={closePanel}
            />
          )}
          
          {activePanel === 'typography' && (
            <HeroTypographyPanel
              pageData={pageData}
              onUpdate={handleUpdate}
              onClose={closePanel}
            />
          )}

          {activePanel === 'images' && (
            <HeroImagesPanel
              pageData={pageData}
              onUpdate={handleUpdate}
              onClose={closePanel}
            />
          )}

          {activePanel === 'layout' && (
            <HeroLayoutPanel
              pageData={pageData}
              onUpdate={handleUpdate}
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
      </SectionEditorWrapper>
    </EditModeProvider>
  );
};

export default HeroSectionEditor;
