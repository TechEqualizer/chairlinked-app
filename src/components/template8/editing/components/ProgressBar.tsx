
import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  currentIndex: number;
  totalSections: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentIndex, totalSections }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-1 bg-gray-800 z-70">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
        initial={{ width: 0 }}
        animate={{ width: `${((currentIndex + 1) / totalSections) * 100}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default ProgressBar;
