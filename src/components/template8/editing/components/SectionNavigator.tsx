
import React from "react";
import { motion } from "framer-motion";
import { editingSections } from "../config/editingSections";

interface SectionNavigatorProps {
  currentSectionIndex: number;
  onSectionClick: (index: number) => void;
}

const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  currentSectionIndex,
  onSectionClick
}) => {
  return (
    <div className="absolute top-0 left-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-[60]">
      <div className="px-3 py-2">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="text-xs font-medium text-gray-900">
            Edit Sections
          </div>
          <div className="flex items-center gap-1">
            {editingSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => onSectionClick(index)}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all
                  ${index === currentSectionIndex 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
                title={section.name}
              >
                <span className="text-xs">{section.icon}</span>
                <span className="hidden md:inline text-xs">{section.name}</span>
                <span className="text-xs opacity-70 ml-0.5">
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Visual progress indicator - made thinner */}
        <div className="mt-1.5 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSectionIndex + 1) / editingSections.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionNavigator;
