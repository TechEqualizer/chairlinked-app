
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SimpleEditableText from "@/components/template8/components/SimpleEditableText";

interface HeroDescriptionProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  variants?: any;
  isPreviewMode?: boolean;
}

const HeroDescription: React.FC<HeroDescriptionProps> = ({ pageData, onUpdate, variants, isPreviewMode = false }) => {
  const isEditMode = !isPreviewMode;

  console.log('[HeroDescription] Rendering with pageData:', {
    subheadline: pageData.subheadline,
    description: pageData.description,
    textAlignment: pageData.textAlignment,
    isPreviewMode
  });

  const getFontWeightClass = (weight: string) => {
    switch (weight) {
      case "light": return "font-light";
      case "medium": return "font-medium";
      case "semibold": return "font-semibold";
      case "bold": return "font-bold";
      case "extrabold": return "font-extrabold";
      default: return "font-normal";
    }
  };

  const fontWeightClass = getFontWeightClass(pageData.fontWeight || "normal");

  // Enhanced dynamic style object with better defaults
  const dynamicStyles = {
    color: pageData.secondaryTextColor || "#e5e7eb",
    textTransform: pageData.textTransform || "none",
    letterSpacing: `${pageData.letterSpacing || 0}px`,
    fontStyle: pageData.isItalic ? "italic" : "normal",
    textDecoration: pageData.isUnderlined ? "underline" : "none",
    fontSize: pageData.fontSize ? `${pageData.fontSize}px` : undefined,
    lineHeight: pageData.lineHeight || 1.6,
    fontFamily: pageData.fontFamily || "inherit"
  };

  // Enhanced font class with better fallbacks
  const fontClass = pageData.fontClass || "font-inter";

  // Prioritize subheadline over description for the hero section
  const displayText = pageData.subheadline || pageData.description || "";

  // Hide component completely in preview mode if no description content
  if (isPreviewMode && !displayText?.trim()) {
    return null;
  }

  return (
    <motion.div 
      variants={variants}
      style={dynamicStyles}
      className="relative"
    >
      <SimpleEditableText
        value={displayText}
        onChange={(value) => onUpdate({ subheadline: value })}
        className={cn(
          // Enhanced responsive typography
          !pageData.fontSize && 'text-lg sm:text-xl lg:text-2xl',
          !pageData.lineHeight && 'leading-relaxed',
          // Better max width and spacing
          'max-w-3xl',
          // Enhanced font styling
          fontWeightClass,
          fontClass,
          // Better text rendering
          'text-gray-100/90 antialiased',
          // Subtle animation on hover (edit mode only)
          !isPreviewMode && 'transition-all duration-300 hover:text-gray-50'
        )}
        placeholder="Describe what makes your business special and unique..."
        tag="p"
        disabled={isPreviewMode}
      />
    </motion.div>
  );
};

export default HeroDescription;
