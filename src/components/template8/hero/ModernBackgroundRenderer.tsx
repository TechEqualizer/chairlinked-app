import React from "react";
import { motion } from "framer-motion";
import { getThemeClasses } from "../utils/themeUtils";
import { detectVideoPlatform, isDirectVideoUrl } from "../utils/videoPlatforms";

interface ModernBackgroundRendererProps {
  pageData: any;
  heroImage: string;
  onUpdate?: (updates: any) => void;
  industryClasses?: any;
}

const ModernBackgroundRenderer: React.FC<ModernBackgroundRendererProps> = ({
  pageData,
  heroImage,
  onUpdate,
  industryClasses
}) => {
  const backgroundType = pageData.backgroundType || 'gradient';
  const heroTheme = pageData.heroTheme || 'light';
  const brandColor = pageData.brandColor || '#8B5CF6';
  
  // Check for user-defined overlay settings
  const hasCustomOverlay = pageData.enableImageOverlay;
  const customOverlayColor = pageData.overlayColor || brandColor;
  const customOverlayOpacity = pageData.backgroundOpacity || 0.7;

  // Use industry classes if available, otherwise fall back to theme system
  const themeClasses = industryClasses || getThemeClasses(heroTheme, brandColor, pageData.industry, 'hero');

  const renderVideoBackground = () => {
    const videoUrl = pageData.backgroundVideo || pageData.videoUrl;
    if (!videoUrl) return null;

    const videoPlatform = detectVideoPlatform(videoUrl);
    
    if (videoPlatform) {
      // Platform video (YouTube, Vimeo, Wistia) with proper looping
      const embedUrl = videoPlatform.platform.getEmbedUrl(videoPlatform.id);
      const autoplayParams = pageData.videoAutoplay !== false ? videoPlatform.platform.getAutoplayParams() : '';
      const loopParams = pageData.videoLoop !== false ? videoPlatform.platform.getLoopParams(videoPlatform.id) : '';
      
      return (
        <iframe
          src={`${embedUrl}?controls=0&showinfo=0&rel=0&modestbranding=1${autoplayParams}${loopParams}`}
          className="absolute inset-0 w-full h-full object-cover"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      );
    } else if (isDirectVideoUrl(videoUrl)) {
      // Direct video file
      return (
        <video
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay={pageData.videoAutoplay !== false}
          muted={pageData.videoMuted !== false}
          loop={pageData.videoLoop !== false}
          playsInline
        />
      );
    }
    
    return null;
  };

  const renderBackground = () => {
    switch (backgroundType) {
      case 'video':
        return (
          <div className="absolute inset-0">
            {renderVideoBackground()}
            {/* Overlay for video backgrounds */}
            {hasCustomOverlay ? (
              <div 
                className="absolute inset-0"
                style={{
                  backgroundColor: customOverlayColor,
                  opacity: customOverlayOpacity
                }}
              />
            ) : (
              <div 
                className={`absolute inset-0 ${industryClasses ? 'bg-[var(--industry-overlay)]' : themeClasses.overlay}`}
                style={industryClasses ? {
                  opacity: `var(--industry-overlay-opacity)`,
                } : undefined}
              />
            )}
          </div>
        );
        
      case 'image':
        return (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${pageData.backgroundImage || heroImage})` }}
          >
            {/* Custom overlay when user has enabled it */}
            {hasCustomOverlay ? (
              <div 
                className="absolute inset-0"
                style={{
                  backgroundColor: customOverlayColor,
                  opacity: customOverlayOpacity
                }}
              />
            ) : (
              /* Fallback to theme-based overlay when custom overlay is disabled */
              <div 
                className={`absolute inset-0 ${industryClasses ? 'bg-[var(--industry-overlay)]' : themeClasses.overlay}`}
                style={industryClasses ? {
                  opacity: `var(--industry-overlay-opacity)`,
                } : undefined}
              />
            )}
          </div>
        );
        
      case 'solid':
        return (
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: industryClasses ? 'var(--industry-bg-primary)' : (pageData.backgroundColor || brandColor)
            }}
          />
        );
        
      case 'gradient':
      default:
        const gradientStyle = industryClasses ? {
          background: `linear-gradient(135deg, var(--industry-color-primary) 0%, var(--industry-color-secondary) 50%, var(--industry-bg-primary) 100%)`
        } : {
          background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}80 50%, transparent 100%)`
        };
        
        return (
          <motion.div
            className={`absolute inset-0 ${industryClasses ? '' : themeClasses.background}`}
            style={gradientStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
        );
    }
  };

  return (
    <>
      {renderBackground()}
      
      {/* Decorative elements for industry themes */}
      {industryClasses && (
        <>
          <div 
            className="absolute top-1/4 -right-32 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: 'var(--industry-color-accent)' }}
          />
          <div 
            className="absolute bottom-1/4 -left-32 w-48 h-48 rounded-full opacity-15 blur-2xl"
            style={{ backgroundColor: 'var(--industry-color-primary)' }}
          />
        </>
      )}
    </>
  );
};

export default ModernBackgroundRenderer;
