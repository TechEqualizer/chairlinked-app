
import React from "react";

interface StoryCaptionOverlayProps {
  caption: string;
}

const StoryCaptionOverlay: React.FC<StoryCaptionOverlayProps> = ({
  caption
}) => {
  return (
    <div className="absolute bottom-16 sm:bottom-28 left-3 sm:left-6 right-3 sm:right-6 z-20">
      <div className="backdrop-blur-md bg-black/40 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
        <p className="text-white text-sm sm:text-lg font-medium text-center drop-shadow-lg leading-relaxed">
          {caption}
        </p>
      </div>
    </div>
  );
};

export default StoryCaptionOverlay;
