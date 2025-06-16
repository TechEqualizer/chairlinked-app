
import React from "react";
import ModernHeroTextContent from "./ModernHeroTextContent";
import ModernHeroImageCard from "./ModernHeroImageCard";
import { motion } from "framer-motion";

interface HeroLayoutRendererProps {
  layoutType: string;
  pageData: any;
  onUpdate: (updates: any) => void;
  heroImage: string | null;
  isPreviewMode?: boolean;
}

const HeroLayoutRenderer: React.FC<HeroLayoutRendererProps> = ({
  layoutType,
  pageData,
  onUpdate,
  heroImage,
  isPreviewMode = false
}) => {
  // Get layout settings
  const contentAlignment = pageData.contentAlignment || 'left';
  const textAlignment = pageData.textAlignment || 'left';
  const contentWidth = pageData.contentWidth || 'normal';

  const getContentAlignmentClasses = () => {
    const alignmentMap = {
      left: 'items-start justify-start',
      center: 'items-center justify-center', 
      right: 'items-end justify-end'
    };
    return alignmentMap[contentAlignment as keyof typeof alignmentMap] || alignmentMap.left;
  };

  const getTextAlignmentClasses = () => {
    const alignmentMap = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };
    return alignmentMap[textAlignment as keyof typeof alignmentMap] || alignmentMap.left;
  };

  const getWidthClasses = () => {
    const widthMap = {
      narrow: 'max-w-lg',
      normal: 'max-w-2xl',
      wide: 'max-w-4xl'
    };
    return widthMap[contentWidth as keyof typeof widthMap] || widthMap.normal;
  };

  const renderLayout = () => {
    const contentAlignmentClasses = getContentAlignmentClasses();
    const textAlignmentClasses = getTextAlignmentClasses();
    const widthClasses = getWidthClasses();

    // If no hero image, use user-specified alignment and width settings
    if (!heroImage) {
      return (
        <div className={`flex flex-col min-h-[75vh] w-full ${contentAlignmentClasses}`}>
          <div className={`${widthClasses} ${contentAlignment === 'center' ? 'mx-auto' : contentAlignment === 'right' ? 'ml-auto' : 'mr-auto'} ${textAlignmentClasses}`}>
            <ModernHeroTextContent pageData={pageData} onUpdate={onUpdate} isPreviewMode={isPreviewMode} />
          </div>
        </div>
      );
    }

    switch (layoutType) {
      case 'modern-split':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[75vh]">
            <div className={`order-2 lg:order-1 flex flex-col ${contentAlignmentClasses}`}>
              <div className={`${widthClasses} ${textAlignmentClasses}`}>
                <ModernHeroTextContent pageData={pageData} onUpdate={onUpdate} isPreviewMode={isPreviewMode} />
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <ModernHeroImageCard 
                heroImage={heroImage}
                businessName={pageData.businessName}
                tagline={pageData.tagline}
                brandColor={pageData.brandColor}
                onUpdate={onUpdate}
                layoutVariant="split"
                isPreviewMode={isPreviewMode}
              />
            </div>
          </div>
        );

      case 'minimal-luxury':
        return (
          <div className="relative min-h-[80vh] flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-cover bg-center rounded-3xl"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 rounded-3xl" />
            <div className={`relative z-10 ${contentAlignmentClasses} ${widthClasses} ${textAlignmentClasses} mx-auto text-white px-8`}>
              <ModernHeroTextContent pageData={pageData} onUpdate={onUpdate} isPreviewMode={isPreviewMode} />
            </div>
          </div>
        );

      case 'creative-showcase':
        return (
          <div className="relative">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-center min-h-[75vh]">
              <div className={`xl:col-span-7 relative z-10 space-y-8 flex flex-col ${contentAlignmentClasses}`}>
                <div className={`${widthClasses} ${textAlignmentClasses}`}>
                  <ModernHeroTextContent pageData={pageData} onUpdate={onUpdate} isPreviewMode={isPreviewMode} />
                </div>
              </div>
              <div className="xl:col-span-5 relative">
                <motion.div
                  initial={{ rotate: -2, scale: 0.95 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="transform hover:rotate-1 transition-transform duration-700"
                >
                  <ModernHeroImageCard 
                    heroImage={heroImage}
                    businessName={pageData.businessName}
                    tagline={pageData.tagline}
                    brandColor={pageData.brandColor}
                    onUpdate={onUpdate}
                    layoutVariant="showcase"
                    isPreviewMode={isPreviewMode}
                  />
                </motion.div>
              </div>
            </div>
            {/* Decorative elements */}
            <div 
              className="absolute top-1/4 -right-32 w-64 h-64 rounded-full opacity-10 blur-3xl"
              style={{ backgroundColor: pageData.brandColor }}
            />
            <div 
              className="absolute bottom-1/4 -left-32 w-48 h-48 rounded-full opacity-15 blur-2xl"
              style={{ backgroundColor: pageData.brandColor }}
            />
          </div>
        );

      case 'classic-split':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[75vh]">
            <div className={`space-y-8 flex flex-col ${contentAlignmentClasses}`}>
              <div className={`${widthClasses} ${textAlignmentClasses}`}>
                <ModernHeroTextContent pageData={pageData} onUpdate={onUpdate} isPreviewMode={isPreviewMode} />
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <ModernHeroImageCard 
                heroImage={heroImage}
                businessName={pageData.businessName}
                tagline={pageData.tagline}
                brandColor={pageData.brandColor}
                onUpdate={onUpdate}
                layoutVariant="floating"
                isPreviewMode={isPreviewMode}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      key={`${layoutType}-${contentAlignment}-${textAlignment}-${contentWidth}-${!!heroImage}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10"
    >
      {renderLayout()}
    </motion.div>
  );
};

export default HeroLayoutRenderer;
