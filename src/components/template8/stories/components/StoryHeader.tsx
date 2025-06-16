
import React from "react";
import { X } from "lucide-react";

interface StoryHeaderProps {
  businessName?: string;
  storyTitle: string;
  onClose: () => void;
}

const StoryHeader: React.FC<StoryHeaderProps> = ({
  businessName,
  storyTitle,
  onClose
}) => {
  return (
    <div className="absolute top-4 sm:top-8 left-2 sm:left-4 right-2 sm:right-4 z-20 flex items-center justify-between">
      <div className="flex items-center backdrop-blur-md bg-black/30 rounded-full px-2 sm:px-4 py-1 sm:py-2 border border-white/10">
        <span className="text-white font-bold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
          {businessName || storyTitle}
        </span>
        <span className="ml-2 sm:ml-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold shadow-lg">
          LIVE
        </span>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }} 
        className="text-white p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-all backdrop-blur-md bg-black/30 border border-white/10 cursor-pointer touch-manipulation"
      >
        <X size={16} className="sm:hidden" />
        <X size={20} className="hidden sm:block" />
      </button>
    </div>
  );
};

export default StoryHeader;
