
import React from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface NavigationToggleProps {
  isNavigationHidden: boolean;
  onToggle: () => void;
}

const NavigationToggle: React.FC<NavigationToggleProps> = ({
  isNavigationHidden,
  onToggle
}) => {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onToggle}
      className={`
        fixed z-[100] p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200
        hover:bg-white hover:shadow-xl transition-all duration-200
        ${isNavigationHidden ? 'top-4 left-4' : 'top-3 left-3'}
      `}
      title={isNavigationHidden ? 'Show navigation' : 'Hide navigation'}
    >
      {isNavigationHidden ? (
        <Eye size={20} className="text-gray-600" />
      ) : (
        <EyeOff size={20} className="text-gray-600" />
      )}
    </motion.button>
  );
};

export default NavigationToggle;
