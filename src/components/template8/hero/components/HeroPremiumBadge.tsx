
import React from "react";
import { motion } from "framer-motion";
import SimpleEditableText from "@/components/template8/components/SimpleEditableText";
import { getJustifyClasses } from "../utils/alignmentUtils";

interface HeroPremiumBadgeProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  variants?: any;
  isPreviewMode?: boolean;
}

const HeroPremiumBadge: React.FC<HeroPremiumBadgeProps> = ({ pageData, onUpdate, variants, isPreviewMode = false }) => {
  const isEditMode = !isPreviewMode; // Template 8 edit mode is inverse of preview mode

  // Hide component completely in preview mode if no tagline content
  if (isPreviewMode && !pageData.tagline?.trim()) {
    return null;
  }

  // Get alignment classes based on textAlignment setting
  const textAlignment = pageData.textAlignment || 'left';
  const justifyClasses = getJustifyClasses(textAlignment);

  // Show in edit mode even if empty (for editing), or if there's content in preview mode
  return (
    <motion.div variants={variants} className={`relative flex w-full ${justifyClasses}`}>
      <div 
        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm"
        style={{
          backgroundColor: `${pageData.brandColor || "#6366F1"}20`,
          borderColor: `${pageData.brandColor || "#6366F1"}40`,
          color: pageData.brandColor || "#6366F1"
        }}
      >
        ✨ <SimpleEditableText
          value={pageData.tagline || ""}
          onChange={(value) => onUpdate({ tagline: value })}
          className="ml-2 font-medium"
          placeholder="Your tagline here"
          tag="span"
          disabled={isPreviewMode}
        />
      </div>
    </motion.div>
  );
};

export default HeroPremiumBadge;
