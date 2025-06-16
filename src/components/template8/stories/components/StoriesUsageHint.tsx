
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Play, Eye, Sparkles } from "lucide-react";

interface StoriesUsageHintProps {
  theme?: 'light' | 'dark' | 'industry';
  brandColor: string;
}

const StoriesUsageHint: React.FC<StoriesUsageHintProps> = ({
  theme = 'light',
  brandColor
}) => {
  const isMobile = useIsMobile();

  // Get basic theme classes for text
  const themeClasses = {
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      viewport={{ once: true }}
      className="mt-8 sm:mt-12 text-center"
    >
      <motion.div 
        whileHover={{ scale: 1.02, y: -2 }}
        className={cn(
          "inline-flex items-center gap-3 sm:gap-4 backdrop-blur-xl rounded-2xl px-6 sm:px-8 py-4 sm:py-5 border-2 relative overflow-hidden group cursor-pointer shadow-lg"
        )}
        style={{
          borderColor: `${brandColor}20`,
          background: `linear-gradient(135deg, ${brandColor}08, ${brandColor}15, ${brandColor}08)`
        }}
      >
        {/* Background shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${brandColor}40, transparent)`
          }}
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div 
            className="p-2 sm:p-3 rounded-xl"
            style={{ backgroundColor: `${brandColor}15` }}
          >
            {isMobile ? (
              <Eye size={18} style={{ color: brandColor }} />
            ) : (
              <Play size={20} style={{ color: brandColor }} />
            )}
          </div>
        </motion.div>

        {/* Text */}
        <div className="relative z-10 flex flex-col items-start">
          <motion.span 
            className={cn(
              "text-sm sm:text-base font-semibold tracking-wide font-sans"
            )}
            style={{ color: brandColor }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isMobile ? "Tap to explore" : "Click any story"}
          </motion.span>
          <span className={cn(
            "text-xs sm:text-sm opacity-70 mt-0.5 font-sans", 
            themeClasses.textSecondary
          )}>
            {isMobile ? "Interactive story experience" : "Immersive fullscreen experience"}
          </span>
        </div>

        {/* Sparkle decoration */}
        <motion.div
          className="relative z-10"
          animate={{ 
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Sparkles size={16} style={{ color: `${brandColor}80` }} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StoriesUsageHint;
