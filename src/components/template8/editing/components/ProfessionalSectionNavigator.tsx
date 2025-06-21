
import React from "react";
import { motion } from "framer-motion";
import { editingSections } from "../config/editingSections";

interface ProfessionalSectionNavigatorProps {
  currentSectionIndex: number;
  onSectionClick: (index: number) => void;
}

const ProfessionalSectionNavigator: React.FC<ProfessionalSectionNavigatorProps> = ({
  currentSectionIndex,
  onSectionClick
}) => {
  return (
    <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[60]">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/30 rounded-2xl shadow-lg p-1">
        <div className="flex items-center gap-0.5">
          {editingSections.map((section, index) => {
            const isActive = index === currentSectionIndex;
            const isCompleted = index < currentSectionIndex;
            
            return (
              <motion.button
                key={section.id}
                onClick={() => onSectionClick(index)}
                className={`
                  relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                    : isCompleted 
                      ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Icon */}
                <span className={`
                  flex items-center justify-center w-4 h-4 rounded-full text-xs
                  ${isActive 
                    ? 'bg-white/20' 
                    : isCompleted 
                      ? 'bg-green-100' 
                      : 'bg-gray-100'
                  }
                `}>
                  {isCompleted ? '✓' : section.icon}
                </span>
                
                {/* Compact Label */}
                <span className="hidden lg:inline font-medium text-xs">
                  {section.name}
                </span>
              </motion.button>
            );
          })}
        </div>
        
        {/* Minimal Progress bar */}
        <div className="mt-1 h-0.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSectionIndex + 1) / editingSections.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSectionNavigator;
