/**
 * Beauty Theme Provider
 * Applies beauty industry-specific design system styles and CSS variables
 */

import React, { useEffect, useMemo } from 'react';
import { BeautyDesignSystem, BeautyIndustryType, BeautyThemeConfig } from '../services/BeautyDesignSystem';

interface BeautyThemeProviderProps {
  industry: BeautyIndustryType;
  customization?: Partial<BeautyThemeConfig>;
  children: React.ReactNode;
}

export const BeautyThemeProvider: React.FC<BeautyThemeProviderProps> = ({
  industry,
  customization,
  children,
}) => {
  const beautyCSS = useMemo(() => {
    return BeautyDesignSystem.generateBeautyCSS(industry, customization);
  }, [industry, customization]);

  const requiredFonts = useMemo(() => {
    return BeautyDesignSystem.getRequiredFonts(industry);
  }, [industry]);

  // Inject beauty-specific CSS
  useEffect(() => {
    const styleId = 'beauty-theme-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = beautyCSS;

    return () => {
      // Keep styles until component unmounts completely
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [beautyCSS]);

  // Load required fonts
  useEffect(() => {
    const loadFonts = async () => {
      for (const fontName of requiredFonts) {
        if (fontName && !document.querySelector(`link[href*="${fontName.replace(/\s+/g, '+')}"]`)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800&display=swap`;
          document.head.appendChild(link);
        }
      }
    };

    loadFonts();
  }, [requiredFonts]);

  return (
    <div className="beauty-theme-wrapper" data-beauty-industry={industry}>
      {children}
    </div>
  );
};

export default BeautyThemeProvider;
