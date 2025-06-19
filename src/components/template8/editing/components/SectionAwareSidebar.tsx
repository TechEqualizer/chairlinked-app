import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Settings, Navigation } from "lucide-react";
import { editingSections } from "../config/editingSections";
import { useSectionManager } from "../hooks/useSectionManager";
import { useSectionDetection } from "../hooks/useSectionDetection";
import SectionEditorFactory from "./section-editors/SectionEditorFactory";

interface SectionAwareSidebarProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  currentSectionIndex: number;
  onSectionChange: (index: number) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

interface SectionInfo {
  id: string;
  name: string;
  icon: string;
  isVisible: boolean;
  element: HTMLElement | null;
  boundingRect: DOMRect | null;
}

const SectionAwareSidebar: React.FC<SectionAwareSidebarProps> = ({
  pageData,
  onUpdate,
  currentSectionIndex: externalCurrentSectionIndex,
  onSectionChange,
  isVisible,
  onToggleVisibility
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSectionEditor, setShowSectionEditor] = useState(false);
  
  const {
    currentSectionIndex,
    sectionElements,
    isInitialized,
    scrollToSection,
    getCurrentSection
  } = useSectionDetection({
    pageData,
    onSectionChange: (sectionId, index) => {
      if (onSectionChange) {
        onSectionChange(index);
      }
    }
  });

  const currentSection = getCurrentSection();

  const handleSectionClick = (index: number) => {
    scrollToSection(index);
  };

  const handleEditSection = () => {
    setShowSectionEditor(true);
  };

  const handleCloseSectionEditor = () => {
    setShowSectionEditor(false);
  };

  if (!isVisible) {
    return (
      <motion.button
        onClick={onToggleVisibility}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </motion.button>
    );
  }

  return (
    <motion.div
      className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl overflow-hidden"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
            {currentSection?.icon || '📄'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {currentSection?.name || 'Section'}
            </h3>
            <p className="text-xs text-gray-500">
              {currentSectionIndex + 1} of {sectionElements.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleVisibility}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Section Navigator */}
            <div className="p-3 border-b border-gray-100">
              <div className="flex flex-col gap-1">
                {sectionElements.map((section, index) => {
                  const isActive = index === currentSectionIndex;
                  
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => handleSectionClick(index)}
                      className={`
                        flex items-center gap-3 p-2.5 rounded-lg text-left transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className={`
                        flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {section.icon}
                      </span>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isActive ? 'text-white' : 'text-gray-700'
                        }`}>
                          {section.name}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Section-Specific Actions */}
            <div className="p-3">
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleEditSection}
                  className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Edit Section
                </button>
                
                <button className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                
                <button className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <Navigation className="w-4 h-4" />
                  Reorder
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Editor Modal */}
      {showSectionEditor && currentSection && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg">
                  {currentSection.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Edit {currentSection.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Customize your {currentSection.name.toLowerCase()} section
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleCloseSectionEditor}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <SectionEditorFactory
                sectionId={currentSection.id}
                pageData={pageData}
                onUpdate={onUpdate}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SectionAwareSidebar;