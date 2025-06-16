
import React from "react";
import { motion } from "framer-motion";
import SimpleEditableText from "@/components/template8/components/SimpleEditableText";
import HeroPremiumBadge from "./components/HeroPremiumBadge";
import HeroMainHeadline from "./components/HeroMainHeadline";
import HeroDescription from "./components/HeroDescription";
import HeroCTAButtons from "./components/HeroCTAButtons";
import HeroSocialProof from "./components/HeroSocialProof";
import { getFlexAlignmentClasses, getTextAlignClasses } from "./utils/alignmentUtils";

interface ModernHeroTextContentProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  isPreviewMode?: boolean;
}

const ModernHeroTextContent: React.FC<ModernHeroTextContentProps> = ({ pageData, onUpdate, isPreviewMode = false }) => {
  console.log('[ModernHeroTextContent] Rendering with pageData:', { 
    businessName: pageData.businessName, 
    tagline: pageData.tagline,
    brandColor: pageData.brandColor,
    textAlign: pageData.textAlign,
    textAlignment: pageData.textAlignment,
    textTransform: pageData.textTransform,
    letterSpacing: pageData.letterSpacing,
    isItalic: pageData.isItalic,
    isUnderlined: pageData.isUnderlined,
    isPreviewMode
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  // Get alignment classes based on textAlignment setting
  const textAlignment = pageData.textAlignment || 'left';
  const flexAlignmentClasses = getFlexAlignmentClasses(textAlignment);
  const textAlignClasses = getTextAlignClasses(textAlignment);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`space-y-8 flex flex-col w-full ${flexAlignmentClasses} ${textAlignClasses}`}
    >
      <HeroPremiumBadge pageData={pageData} onUpdate={onUpdate} variants={item} isPreviewMode={isPreviewMode} />
      <HeroMainHeadline pageData={pageData} onUpdate={onUpdate} variants={item} isPreviewMode={isPreviewMode} />
      <HeroDescription pageData={pageData} onUpdate={onUpdate} variants={item} isPreviewMode={isPreviewMode} />
      <HeroCTAButtons pageData={pageData} onUpdate={onUpdate} variants={item} isPreviewMode={isPreviewMode} />
      <HeroSocialProof pageData={pageData} variants={item} onUpdate={onUpdate} isPreviewMode={isPreviewMode} />
    </motion.div>
  );
};

export default ModernHeroTextContent;
