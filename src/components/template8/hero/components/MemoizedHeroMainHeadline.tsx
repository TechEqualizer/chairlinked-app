
import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import SimpleEditableText from "@/components/template8/components/SimpleEditableText";

interface MemoizedHeroMainHeadlineProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  variants?: any;
  isPreviewMode?: boolean;
}

// Standardized defaults
const DEFAULT_TEXT_COLOR = '#ffffff';
const DEFAULT_FONT_WEIGHT = 'bold';
const DEFAULT_LINE_HEIGHT = 1.2;

const MemoizedHeroMainHeadline: React.FC<MemoizedHeroMainHeadlineProps> = memo(({ 
  pageData, 
  onUpdate, 
  variants,
  isPreviewMode = false
}) => {
  const isEditMode = !isPreviewMode; // Template 8 edit mode is inverse of preview mode

  console.log('[MemoizedHeroMainHeadline] Rendering with pageData:', {
    headline: pageData.headline,
    businessName: pageData.businessName,
    textAlignment: pageData.textAlignment,
    isPreviewMode
  });

  // Memoize style calculations to prevent unnecessary re-computations
  const { dynamicStyles, fontWeightClass, fontClass, headlineText } = useMemo(() => {
    const getFontWeightClass = (weight: string) => {
      switch (weight) {
        case "medium": return "font-medium";
        case "semibold": return "font-semibold";
        case "bold": return "font-bold";
        default: return "font-bold";
      }
    };

    return {
      dynamicStyles: {
        color: pageData.textColor || DEFAULT_TEXT_COLOR,
        textTransform: pageData.textTransform || "none",
        letterSpacing: `${pageData.letterSpacing || 0}px`,
        fontStyle: pageData.isItalic ? "italic" : "normal",
        textDecoration: pageData.isUnderlined ? "underline" : "none",
        fontSize: pageData.fontSize ? `${pageData.fontSize * 3}px` : undefined,
        lineHeight: pageData.lineHeight || DEFAULT_LINE_HEIGHT
      } as const,
      fontWeightClass: getFontWeightClass(pageData.fontWeight || DEFAULT_FONT_WEIGHT),
      fontClass: pageData.fontClass || "font-sans",
      // Only use headline field, no business name fallback
      headlineText: pageData.headline || ""
    };
  }, [
    pageData.textColor,
    pageData.textTransform,
    pageData.letterSpacing,
    pageData.isItalic,
    pageData.isUnderlined,
    pageData.fontSize,
    pageData.lineHeight,
    pageData.fontWeight,
    pageData.fontClass,
    pageData.headline
  ]);

  // Hide component completely in preview mode if no headline content
  if (isPreviewMode && !headlineText?.trim()) {
    return null;
  }

  return (
    <motion.div 
      variants={variants}
      style={dynamicStyles}
      className="relative"
    >
      <SimpleEditableText
        value={headlineText}
        onChange={(value) => onUpdate({ headline: value })}
        className={`${!pageData.fontSize ? 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl' : ''} ${fontWeightClass} ${fontClass} ${!pageData.lineHeight ? 'leading-tight' : ''} tracking-tight`}
        placeholder="Your Headline"
        tag="h1"
        disabled={isPreviewMode}
      />
    </motion.div>
  );
});

MemoizedHeroMainHeadline.displayName = 'MemoizedHeroMainHeadline';

export default MemoizedHeroMainHeadline;
