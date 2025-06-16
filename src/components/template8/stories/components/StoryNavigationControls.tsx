
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StoryNavigationControlsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const StoryNavigationControls: React.FC<StoryNavigationControlsProps> = ({
  canGoBack,
  canGoForward,
  onPrevious,
  onNext
}) => {
  return (
    <>
      {/* Touch areas for mobile */}
      <div 
        className="absolute left-0 top-0 w-1/3 h-full cursor-pointer z-10 touch-manipulation" 
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
      />
      <div 
        className="absolute right-0 top-0 w-1/3 h-full cursor-pointer z-10 touch-manipulation"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
      />
      
      {/* Desktop-only navigation arrows */}
      {canGoBack && (
        <button 
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 sm:p-3 backdrop-blur-md transition-all hidden sm:block hover:scale-110 border border-white/20 z-20 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
        >
          <ChevronLeft size={20} className="sm:hidden" />
          <ChevronLeft size={24} className="hidden sm:block" />
        </button>
      )}
      {canGoForward && (
        <button 
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 sm:p-3 backdrop-blur-md transition-all hidden sm:block hover:scale-110 border border-white/20 z-20 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <ChevronRight size={20} className="sm:hidden" />
          <ChevronRight size={24} className="hidden sm:block" />
        </button>
      )}
    </>
  );
};

export default StoryNavigationControls;
