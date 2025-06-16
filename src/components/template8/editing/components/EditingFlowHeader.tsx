
import React from "react";

interface EditingFlowHeaderProps {
  sectionName: string;
  currentSectionIndex: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  children?: React.ReactNode;
}

const EditingFlowHeader: React.FC<EditingFlowHeaderProps> = ({
  sectionName,
  currentSectionIndex,
  totalSections,
  onPrevious,
  onNext,
  onClose,
  canGoPrevious,
  canGoNext,
  children
}) => (
  <div className="absolute top-12 left-0 right-0 z-[55] bg-white/95 backdrop-blur-sm border-b border-gray-200">
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`p-1.5 rounded-md transition-colors ${
            !canGoPrevious
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          ←
        </button>
        <div className="text-sm font-medium text-gray-900">
          {sectionName} ({currentSectionIndex + 1}/{totalSections})
        </div>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`p-1.5 rounded-md transition-colors ${
            !canGoNext
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          →
        </button>
      </div>
      <div className="flex items-center gap-2">
        {children}
        <button
          onClick={onClose}
          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
);

export default EditingFlowHeader;
