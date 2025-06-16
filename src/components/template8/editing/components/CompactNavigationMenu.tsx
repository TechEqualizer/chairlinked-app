
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, RotateCcw, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { editingSections } from "../config/editingSections";

interface CompactNavigationMenuProps {
  isVisible: boolean;
  currentSectionIndex: number;
  onSectionClick: (index: number) => void;
  onSave: () => void;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isSaving: boolean;
  onNavigateToDashboard?: () => void;
}

const CompactNavigationMenu: React.FC<CompactNavigationMenuProps> = ({
  isVisible,
  currentSectionIndex,
  onSectionClick,
  onSave,
  onClose,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isSaving,
  onNavigateToDashboard
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-4 z-[90] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3"
        >
          <div className="flex flex-col gap-2 min-w-[200px]">
            {/* Section Navigation */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className={`p-1 rounded ${
                  canGoPrevious 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="text-sm font-medium text-gray-900 flex-1 text-center">
                {editingSections[currentSectionIndex]?.name} ({currentSectionIndex + 1}/{editingSections.length})
              </span>
              
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className={`p-1 rounded ${
                  canGoNext 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Section Grid */}
            <div className="grid grid-cols-4 gap-1">
              {editingSections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => onSectionClick(index)}
                  className={`
                    p-2 rounded-md text-xs font-medium transition-all
                    ${index === currentSectionIndex 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                  title={section.name}
                >
                  <span className="block">{section.icon}</span>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium disabled:opacity-50 transition-colors flex-1"
                >
                  <Save size={14} />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-medium transition-colors"
                >
                  <X size={14} />
                  Close
                </button>
              </div>
              
              {onNavigateToDashboard && (
                <button
                  onClick={onNavigateToDashboard}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                >
                  <Home size={14} />
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompactNavigationMenu;
