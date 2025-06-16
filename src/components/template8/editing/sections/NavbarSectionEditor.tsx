
import React from "react";
import { motion } from "framer-motion";
import SectionEditorWrapper from "../components/SectionEditorWrapper";
import EditableTemplate8NavbarBlock from "../../editableBlocks/EditableTemplate8NavbarBlock";
import NavbarProgressPanel from "../components/NavbarProgressPanel";
import NavbarVerticalToolbar from "../components/NavbarVerticalToolbar";
import { EditModeProvider } from "@/components/chairlinked/editing/EditModeContext";
import { useUniversalEditing } from "../hooks/useUniversalEditing";

interface NavbarSectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
}

const NavbarSectionEditor: React.FC<NavbarSectionEditorProps> = ({ 
  pageData, 
  onUpdate, 
  onSave 
}) => {
  const {
    isDirty,
    isAutoSaving,
    saveChanges,
    handleUpdate
  } = useUniversalEditing({ pageData, onUpdate, onSave });

  return (
    <EditModeProvider initialEditMode={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <SectionEditorWrapper sectionName="Navigation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 pr-32"> {/* Increased right padding for toolbar */}
            
            {/* Left Side - Progress and Tips */}
            <NavbarProgressPanel pageData={pageData} />

            {/* Right Side - Live Preview with better constraints */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6 max-w-full overflow-hidden" // Added overflow hidden
            >
              <div className="text-center lg:text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Live Preview
                </h3>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mr-8"> {/* Increased right margin */}
                {/* Device Frame Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-500 text-center">
                        yoursite.com
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Preview */}
                <div className="border-b border-gray-200">
                  <div className="px-4 py-3 bg-gray-50 flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                    <span className="text-sm font-medium text-gray-700">Desktop Preview</span>
                  </div>
                  <div className="min-h-[80px] bg-white overflow-hidden">
                    <EditableTemplate8NavbarBlock 
                      pageData={{
                        ...pageData,
                        businessName: pageData.businessName || "Creative Studio",
                        ctaText: pageData.ctaText || "Get Started"
                      }}
                      onUpdate={() => {}} // Read-only preview
                      fixed={false}
                    />
                  </div>
                </div>
                
                {/* Mobile Preview */}
                <div>
                  <div className="px-4 py-3 bg-gray-50 flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                    <span className="text-sm font-medium text-gray-700">Mobile Preview</span>
                  </div>
                  <div className="max-w-sm mx-auto border-x border-gray-200 bg-white overflow-hidden">
                    <EditableTemplate8NavbarBlock 
                      pageData={{
                        ...pageData,
                        businessName: pageData.businessName || "Creative Studio",
                        ctaText: pageData.ctaText || "Get Started"
                      }}
                      onUpdate={() => {}} // Read-only preview
                      forceMobile={true}
                      fixed={false}
                    />
                  </div>
                </div>
              </div>

              {/* Usage Hint with proper spacing */}
              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-gray-200 mr-8">
                <p className="text-sm text-gray-600 text-center">
                  📱 Use the vertical toolbar on the right to edit your navigation elements
                </p>
              </div>
            </motion.div>

          </div>
        </SectionEditorWrapper>
        
        {/* Vertical Toolbar with better positioning */}
        <NavbarVerticalToolbar
          pageData={pageData}
          onUpdate={handleUpdate}
          brandColor={pageData.brandColor || "#8B5CF6"}
        />
      </div>
    </EditModeProvider>
  );
};

export default NavbarSectionEditor;
