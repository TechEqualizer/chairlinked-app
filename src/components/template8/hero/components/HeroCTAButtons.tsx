
import React from "react";
import { motion } from "framer-motion";
import SimpleEditableText from "@/components/template8/components/SimpleEditableText";
import { getJustifyClasses } from "../utils/alignmentUtils";

interface HeroCTAButtonsProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  variants?: any;
  isPreviewMode?: boolean;
}

const HeroCTAButtons: React.FC<HeroCTAButtonsProps> = ({ pageData, onUpdate, variants, isPreviewMode = false }) => {
  const isEditMode = !isPreviewMode; // Template 8 edit mode is inverse of preview mode

  // Hide component completely in preview mode if no CTA text content
  if (isPreviewMode && !pageData.ctaText?.trim()) {
    return null;
  }

  const getFontWeightClass = (weight: string) => {
    switch (weight) {
      case "medium": return "font-medium";
      case "semibold": return "font-semibold";
      case "bold": return "font-bold";
      default: return "font-semibold";
    }
  };

  const fontWeightClass = getFontWeightClass(pageData.fontWeight || "semibold");

  // Use the primary text color or fallback to white if not set
  const buttonTextColor = pageData.textColor || "#FFFFFF";

  // Get alignment classes based on textAlignment setting
  const textAlignment = pageData.textAlignment || 'left';
  const justifyClasses = getJustifyClasses(textAlignment);

  return (
    <motion.div variants={variants} className={`flex flex-col sm:flex-row gap-4 relative w-full ${justifyClasses}`}>
      <div className="relative group">
        {/* Glow effect */}
        <div 
          className="absolute -inset-1 rounded-xl opacity-75 group-hover:opacity-100 blur transition-all duration-500"
          style={{ 
            background: `linear-gradient(135deg, ${pageData.brandColor || "#6366F1"}, ${pageData.brandColor || "#6366F1"}dd)`
          }}
        />
        
        <button
          className={`relative px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 ${fontWeightClass} overflow-hidden`}
          style={{ 
            background: `linear-gradient(135deg, ${pageData.brandColor || "#6366F1"}, ${pageData.brandColor || "#6366F1"}dd)`,
            color: buttonTextColor,
            boxShadow: `0 20px 40px ${pageData.brandColor || "#6366F1"}40`
          }}
          type="button"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <span className="relative z-10">
            <SimpleEditableText
              value={pageData.ctaText || ""}
              onChange={(value) => onUpdate({ ctaText: value })}
              placeholder="Get Started"
              tag="span"
              disabled={isPreviewMode}
            />
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default HeroCTAButtons;
