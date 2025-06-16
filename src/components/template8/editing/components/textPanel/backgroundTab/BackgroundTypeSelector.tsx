
import React from "react";
import { Video } from "lucide-react";

interface BackgroundTypeSelectorProps {
  backgroundType: string;
  onTypeChange: (type: string) => void;
}

const BackgroundTypeSelector: React.FC<BackgroundTypeSelectorProps> = ({
  backgroundType,
  onTypeChange
}) => {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-2 block">Background Type</label>
      <div className="grid grid-cols-3 gap-1">
        <button
          className={`px-2 py-2 text-xs rounded-lg border transition-all ${
            backgroundType === "gradient"
              ? "bg-indigo-100 border-indigo-300 text-indigo-700"
              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => onTypeChange("gradient")}
        >
          Gradient
        </button>
        <button
          className={`px-2 py-2 text-xs rounded-lg border transition-all ${
            backgroundType === "image"
              ? "bg-indigo-100 border-indigo-300 text-indigo-700"
              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => onTypeChange("image")}
        >
          Image
        </button>
        <button
          className={`px-2 py-2 text-xs rounded-lg border transition-all ${
            backgroundType === "video"
              ? "bg-indigo-100 border-indigo-300 text-indigo-700"
              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => onTypeChange("video")}
        >
          <Video size={10} className="inline mr-1" />
          Video
        </button>
      </div>
    </div>
  );
};

export default BackgroundTypeSelector;
