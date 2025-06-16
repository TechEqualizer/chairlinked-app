
import React from "react";
import { motion } from "framer-motion";

interface StoriesBackgroundElementsProps {
  brandColor: string;
  theme?: 'light' | 'dark' | 'industry';
  industry?: string;
}

const StoriesBackgroundElements: React.FC<StoriesBackgroundElementsProps> = ({
  brandColor,
  theme = 'light',
  industry
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Theme-aware floating elements */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${brandColor}40, transparent)`
        }}
      />

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-72 md:h-72 rounded-full blur-2xl opacity-25"
        style={{
          background: `radial-gradient(circle, ${brandColor}30, transparent)`
        }}
      />
    </div>
  );
};

export default StoriesBackgroundElements;
