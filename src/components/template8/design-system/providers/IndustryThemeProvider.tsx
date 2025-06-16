/**
 * Industry Theme Provider
 * Applies industry-specific design system styles and CSS variables
 */

import React, { useEffect, useMemo } from 'react';
import { IndustryThemeUtils } from '../utils/industryThemeUtils';

interface IndustryThemeProviderProps {
  industry: string;
  brandColor?: string;
  children: React.ReactNode;
}

export const IndustryThemeProvider: React.FC<IndustryThemeProviderProps> = ({
  industry,
  brandColor,
  children,
}) => {
  const industryCSS = useMemo(() => {
    return IndustryThemeUtils.generateIndustryCSS(industry, brandColor);
  }, [industry, brandColor]);

  const requiredFonts = useMemo(() => {
    return IndustryThemeUtils.getIndustryFontLoads(industry);
  }, [industry]);

  // Inject industry-specific CSS
  useEffect(() => {
    const styleId = 'industry-theme-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = industryCSS;

    return () => {
      // Keep styles until component unmounts completely
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [industryCSS]);

  // Load required fonts
  useEffect(() => {
    const loadFonts = async () => {
      for (const fontName of requiredFonts) {
        if (fontName && !document.querySelector(`link[href*="${fontName.replace(/\s+/g, '+')}"]`)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
          document.head.appendChild(link);
        }
      }
    };

    loadFonts();
  }, [requiredFonts]);

  return (
    <div className="industry-theme-wrapper" data-industry={industry}>
      {children}
    </div>
  );
};

export default IndustryThemeProvider;
