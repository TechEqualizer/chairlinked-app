
import React from "react";
import { X, ArrowLeft } from "lucide-react";

interface EditingHeaderProps {
  currentSectionName: string;
  currentIndex: number;
  totalSections: number;
  onPrevious: () => void;
  onClose: () => void;
  canGoPrevious: boolean;
}

const EditingHeader: React.FC<EditingHeaderProps> = ({
  currentSectionName,
  currentIndex,
  totalSections,
  onPrevious,
  onClose,
  canGoPrevious
}) => {
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[EditingHeader] Previous button clicked');
    try {
      onPrevious();
    } catch (error) {
      console.error('[EditingHeader] Error in onPrevious:', error);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[EditingHeader] Close button clicked');
    try {
      onClose();
    } catch (error) {
      console.error('[EditingHeader] Error in onClose:', error);
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-[100] flex justify-between items-center pointer-events-auto">
      <div className="flex items-center gap-4">
        {canGoPrevious && (
          <button
            type="button"
            onClick={handlePrevious}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors pointer-events-auto"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="text-white pointer-events-none">
          <h3 className="font-semibold">{currentSectionName}</h3>
          <p className="text-sm text-white/70">
            {currentIndex + 1} of {totalSections}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleClose}
        className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors pointer-events-auto"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default EditingHeader;
