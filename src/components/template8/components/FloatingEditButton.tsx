
import React from "react";
import { Pencil } from "lucide-react";

interface FloatingEditButtonProps {
  onClick: () => void;
}

const FloatingEditButton: React.FC<FloatingEditButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('🎨 FloatingEditButton clicked - Launching full-screen editing experience...');
    console.log('[FloatingEditButton] About to call onClick handler');
    onClick();
  };

  console.log('[FloatingEditButton] Rendered and ready for clicks');

  return (
    <button
      className="
        fixed bottom-6 right-6 z-30 
        bg-gradient-to-r from-indigo-600 to-purple-600 
        text-white rounded-full shadow-lg 
        px-6 py-3 flex items-center gap-2
        hover:from-indigo-700 hover:to-purple-700 
        transition-all duration-300 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        animate-fade-in hover:scale-105
        border border-white/20
      "
      style={{ fontSize: 16, fontWeight: 600 }}
      onClick={handleClick}
      aria-label="Start Full-Screen Editing"
      type="button"
    >
      <Pencil size={18} /> 
      <span>Edit Page</span>
    </button>
  );
};

export default FloatingEditButton;
