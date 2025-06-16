
import React from "react";
import HeroLayoutRenderer from "../hero/HeroLayoutRenderer";
import ModernBackgroundRenderer from "../hero/ModernBackgroundRenderer";
import { getIndustryThemeClasses } from "../utils/themeUtils";

interface EditableTemplate8HeroBlockProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  isProductionPreview?: boolean;
}

const EditableTemplate8HeroBlock: React.FC<EditableTemplate8HeroBlockProps> = ({
  pageData,
  onUpdate,
  isProductionPreview = false
}) => {
  console.log('[EditableTemplate8HeroBlock] Component rendered with:', {
    hasPageData: !!pageData,
    heroImage: pageData?.heroImage,
    heroImageValue: pageData?.heroImage,
    heroImageType: typeof pageData?.heroImage,
    heroImages: pageData?.heroImages?.length || 0,
    images: pageData?.images?.length || 0,
    industry: pageData?.industry,
    heroTheme: pageData?.heroTheme || 'light',
    isProductionPreview,
    _heroImageExplicitlySet: pageData?._heroImageExplicitlySet
  });

  // Determine the hero image with respect for explicit user choices
  const getHeroImage = () => {
    // If user has explicitly set or removed the hero image, respect that choice completely
    if (pageData._heroImageExplicitlySet) {
      console.log('[EditableTemplate8HeroBlock] Using explicitly set hero image:', pageData.heroImage);
      return pageData.heroImage;
    }

    // If heroImage property exists in pageData (even if null/undefined), respect that choice
    if (pageData.hasOwnProperty('heroImage')) {
      console.log('[EditableTemplate8HeroBlock] Hero image property exists, using value:', pageData.heroImage);
      return pageData.heroImage;
    }

    // Only use legacy fallback for sites that have never had heroImage property set
    // This handles backward compatibility for old sites
    const legacyImage = (pageData.heroImages && pageData.heroImages[0]) ||
                       (pageData.images && pageData.images[0]?.image) ||
                       (pageData.images && pageData.images[0]);

    console.log('[EditableTemplate8HeroBlock] Using legacy fallback:', legacyImage);
    return legacyImage || null;
  };

  const heroImage = getHeroImage();

  console.log('[EditableTemplate8HeroBlock] Final hero image decision:', {
    heroImage,
    hasHeroImageProperty: pageData.hasOwnProperty('heroImage'),
    heroImageValue: pageData.heroImage,
    _heroImageExplicitlySet: pageData._heroImageExplicitlySet
  });

  // Get industry-specific theme classes if industry theme is selected
  const heroTheme = pageData.heroTheme || 'light';
  const industryClasses = heroTheme === 'industry' && pageData.industry ? 
    getIndustryThemeClasses(pageData.industry, 'hero', pageData.brandColor) : null;

  // In production preview mode, disable updates
  const handleUpdate = isProductionPreview ? () => {} : onUpdate;

  return (
    <div className={isProductionPreview ? "hero-production-preview-mode" : ""}>
      {isProductionPreview && (
        <style>{`
          .hero-production-preview-mode .editable-element,
          .hero-production-preview-mode [contentEditable] {
            pointer-events: none !important;
            cursor: default !important;
          }
          
          .hero-production-preview-mode .edit-pencil,
          .hero-production-preview-mode .edit-overlay,
          .hero-production-preview-mode .edit-tooltip {
            display: none !important;
          }
        `}</style>
      )}
      <section 
        id="hero" 
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
          industryClasses ? 'industry-theme-wrapper' : ''
        }`}
        style={industryClasses ? {
          fontFamily: `var(--industry-font-primary)`,
          backgroundColor: `var(--industry-bg-primary)`,
          color: `var(--industry-text-primary)`,
        } : undefined}
      >
        {/* Background Renderer with industry theme support */}
        <ModernBackgroundRenderer 
          pageData={pageData} 
          heroImage={heroImage}
          onUpdate={handleUpdate}
          industryClasses={industryClasses}
        />
        
        {/* Hero Content with industry-aware layout */}
        <HeroLayoutRenderer
          layoutType={pageData.heroLayout || 'modern-split'}
          pageData={pageData}
          onUpdate={handleUpdate}
          heroImage={heroImage}
          isPreviewMode={isProductionPreview}
        />
      </section>
    </div>
  );
};

export default EditableTemplate8HeroBlock;
