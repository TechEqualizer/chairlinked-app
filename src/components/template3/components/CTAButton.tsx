
import React from "react";
import { motion } from "framer-motion";

interface CTAButtonProps {
  ctaText: string;
  brandColor: string;
  className?: string;
  onCtaClick?: () => void;
}

const CTAButton: React.FC<CTAButtonProps> = ({ 
  ctaText, 
  brandColor, 
  className = "",
  onCtaClick
}) => {
  return (
    <div className="relative group">
      {/* Glow effect - reduced blur and opacity */}
      <div 
        className="absolute -inset-1 rounded-xl opacity-50 group-hover:opacity-75 blur-sm transition-all duration-500"
        style={{ 
          background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)`
        }}
      />
      
      <motion.button
        onClick={onCtaClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative px-6 py-2.5 font-semibold rounded-xl transition-all duration-300 overflow-hidden ${className}`}
        style={{ 
          background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)`,
          color: "white",
          boxShadow: `0 8px 20px ${brandColor}40`
        }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <span className="relative z-10">
          {ctaText}
        </span>
      </motion.button>
    </div>
  );
};

export default CTAButton;
