
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionEditorWrapper from "../components/SectionEditorWrapper";
import EditableTemplate8FooterBlock from "../../editableBlocks/EditableTemplate8FooterBlock";
import { EditModeProvider } from "@/components/chairlinked/editing/EditModeContext";
import DirectEditOverlay from "../DirectEditOverlay";
import FooterVerticalToolbar from "../components/FooterVerticalToolbar";
import FooterContactPanel from "../components/FooterContactPanel";
import FooterContentPanel from "../components/FooterContentPanel";
import { useUniversalEditing } from "../hooks/useUniversalEditing";

interface FooterSectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

const FooterSectionEditor: React.FC<FooterSectionEditorProps> = ({ 
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
    isDirty,
    isAutoSaving,
    saveChanges,
    handleUpdate
  } = useUniversalEditing({ pageData, onUpdate, onSave });

  const closePanel = () => {
    setActivePanel(null);
  };

  return (
    <EditModeProvider initialEditMode={true}>
      <SectionEditorWrapper sectionName="Footer">
        <EditableTemplate8FooterBlock pageData={pageData} onUpdate={handleUpdate} />
        <DirectEditOverlay pageData={pageData} onUpdate={handleUpdate} />
        
        <FooterVerticalToolbar
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          brandColor={pageData.brandColor}
          hasErrors={false}
        />

        {/* Floating Panels */}
        <AnimatePresence>
          {activePanel === 'content' && (
            <FooterContentPanel
              pageData={pageData}
              onUpdate={handleUpdate}
              onClose={closePanel}
            />
          )}
          
          {activePanel === 'contact' && (
            <FooterContactPanel
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

export default FooterSectionEditor;
