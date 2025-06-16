
import React from "react";
import { RotateCcw } from "lucide-react";

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  return (
    <div className="pb-2 border-b border-gray-200">
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors w-full justify-center"
      >
        <RotateCcw size={12} />
        Reset to Default
      </button>
    </div>
  );
};

export default ResetButton;
