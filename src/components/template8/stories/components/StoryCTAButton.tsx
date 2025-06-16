
import React from "react";
import { Button } from "@/components/ui/button";

interface StoryCTAButtonProps {
  ctaText: string;
  brandColor: string;
  onClick: () => void;
}

const StoryCTAButton: React.FC<StoryCTAButtonProps> = ({
  ctaText,
  brandColor,
  onClick
}) => {
  return (
    <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-4 right-3 sm:right-4 z-20">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="w-full py-3 sm:py-4 text-base sm:text-lg font-bold rounded-lg sm:rounded-xl shadow-xl transition-all duration-200 hover:scale-[1.02] border-0 backdrop-blur-md cursor-pointer touch-manipulation active:scale-[0.98]"
        style={{ 
          background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)`,
          color: "#fff",
          boxShadow: `0 8px 32px ${brandColor}40`
        }}
      >
        {ctaText}
      </Button>
    </div>
  );
};

export default StoryCTAButton;
