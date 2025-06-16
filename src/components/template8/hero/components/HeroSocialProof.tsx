
import React from "react";
import { motion } from "framer-motion";
import SimpleEditableText from "@/components/template8/components/SimpleEditableText";
import { Users, Star, Award } from "lucide-react";
import { getResponsiveJustifyClasses } from "../utils/alignmentUtils";

interface HeroSocialProofProps {
  pageData: any;
  variants: any;
  onUpdate: (updates: any) => void;
  isPreviewMode?: boolean;
}

const HeroSocialProof: React.FC<HeroSocialProofProps> = ({ pageData, variants, onUpdate, isPreviewMode = false }) => {
  const isEditMode = !isPreviewMode; // Template 8 edit mode is inverse of preview mode

  console.log('[HeroSocialProof] Rendering with brand colors:', {
    isEditMode,
    isPreviewMode,
    brandColor: pageData.brandColor,
    brandSecondary: pageData.brandSecondary,
    brandAccent: pageData.brandAccent,
    socialProof: pageData.socialProof,
    textAlignment: pageData.textAlignment
  });

  const handleSocialProofUpdate = (field: string, value: string) => {
    if (isPreviewMode) return;
    console.log('[HeroSocialProof] Updating social proof:', field, value);
    onUpdate({
      socialProof: {
        ...pageData.socialProof,
        [field]: value
      }
    });
  };

  // Check if any social proof content exists
  const hasContent = pageData.socialProof?.clientsCount?.trim() || 
                    pageData.socialProof?.rating?.trim() || 
                    pageData.socialProof?.yearsExperience?.trim();

  // Hide component completely in preview mode if no social proof content
  if (isPreviewMode && !hasContent) {
    return null;
  }

  // Use different brand colors for different elements
  const primaryColor = pageData.brandColor || '#6366f1';
  const accentColor = pageData.brandAccent || primaryColor;

  const secondaryTextStyle = {
    color: pageData.secondaryTextColor || '#6b7280'
  };

  // Get alignment classes based on textAlignment setting
  const textAlignment = pageData.textAlignment || 'left';
  const justifyClasses = getResponsiveJustifyClasses(textAlignment);

  return (
    <motion.div 
      variants={variants}
      className={`flex items-center gap-8 pt-8 w-full ${justifyClasses}`}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Users className="w-4 h-4" style={{ color: accentColor }} />
          <div 
            className="text-2xl font-bold transition-colors duration-300"
            style={{ color: primaryColor }}
          >
            {isEditMode ? (
              <SimpleEditableText
                value={pageData.socialProof?.clientsCount || "500+"}
                onChange={(value) => handleSocialProofUpdate('clientsCount', value)}
                className="text-2xl font-bold cursor-pointer hover:bg-white/10 rounded px-1"
                placeholder="500+"
                tag="span"
                disabled={isPreviewMode}
              />
            ) : (
              pageData.socialProof?.clientsCount || "500+"
            )}
          </div>
        </div>
        <div className="text-sm" style={secondaryTextStyle}>Happy Clients</div>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Star className="w-4 h-4" style={{ color: accentColor }} />
          <div 
            className="text-2xl font-bold transition-colors duration-300"
            style={{ color: primaryColor }}
          >
            {isEditMode ? (
              <SimpleEditableText
                value={pageData.socialProof?.rating || "4.9★"}
                onChange={(value) => handleSocialProofUpdate('rating', value)}
                className="text-2xl font-bold cursor-pointer hover:bg-white/10 rounded px-1"
                placeholder="4.9★"
                tag="span"
                disabled={isPreviewMode}
              />
            ) : (
              pageData.socialProof?.rating || "4.9★"
            )}
          </div>
        </div>
        <div className="text-sm" style={secondaryTextStyle}>Rating</div>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <Award className="w-4 h-4" style={{ color: accentColor }} />
          <div 
            className="text-2xl font-bold transition-colors duration-300"
            style={{ color: primaryColor }}
          >
            {isEditMode ? (
              <SimpleEditableText
                value={pageData.socialProof?.yearsExperience || "15+"}
                onChange={(value) => handleSocialProofUpdate('yearsExperience', value)}
                className="text-2xl font-bold cursor-pointer hover:bg-white/10 rounded px-1"
                placeholder="15+"
                tag="span"
                disabled={isPreviewMode}
              />
            ) : (
              pageData.socialProof?.yearsExperience || "15+"
            )}
          </div>
        </div>
        <div className="text-sm" style={secondaryTextStyle}>Years</div>
      </div>
    </motion.div>
  );
};

export default HeroSocialProof;
