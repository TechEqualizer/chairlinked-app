
import { IndustryThemeUtils, type IndustryThemeSection } from '../design-system/utils/industryThemeUtils';
import { BeautyDesignSystem, BeautyIndustryType, BeautySectionType } from '../design-system/services/BeautyDesignSystem';

export type SectionTheme = 'light' | 'dark' | 'auto' | 'industry' | 'beauty';

export const getThemeClasses = (
  theme: SectionTheme, 
  brandColor?: string, 
  industry?: string, 
  section?: IndustryThemeSection,
  beautyIndustry?: BeautyIndustryType,
  beautySection?: BeautySectionType
) => {
  // If beauty theme is requested and we have beauty industry data, use beauty-specific styling
  if (theme === 'beauty' && beautyIndustry && beautySection) {
    return BeautyDesignSystem.getSectionThemeClasses(beautyIndustry, beautySection);
  }

  // If industry theme is requested and we have industry data, use industry-specific styling
  if (theme === 'industry' && industry && section) {
    return IndustryThemeUtils.getIndustryThemeClasses(industry, section, brandColor);
  }

  // Fallback to original theme system
  const baseClasses = {
    light: {
      background: 'bg-gradient-to-br from-gray-50 to-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      card: 'bg-white/80 border-gray-200/50',
      cardHover: 'hover:bg-white/90',
      overlay: 'bg-white/90',
      border: 'border-gray-200',
      shadow: 'shadow-lg'
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 to-gray-800',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      card: 'bg-gray-800/80 border-gray-700/50',
      cardHover: 'hover:bg-gray-800/90',
      overlay: 'bg-gray-800/90',
      border: 'border-gray-700',
      shadow: 'shadow-2xl shadow-gray-900/20'
    },
    auto: {
      background: 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      card: 'bg-white/80 border-gray-200/50',
      cardHover: 'hover:bg-white/90',
      overlay: 'bg-white/90',
      border: 'border-gray-200',
      shadow: 'shadow-lg'
    },
    industry: {
      // This will be handled by IndustryThemeUtils
      background: 'bg-[var(--industry-bg-primary)]',
      text: 'text-[var(--industry-text-primary)]',
      textSecondary: 'text-[var(--industry-text-secondary)]',
      card: 'bg-white/80 border-[var(--industry-border)]',
      cardHover: 'hover:bg-white/90',
      overlay: 'bg-[var(--industry-overlay)]',
      border: 'border-[var(--industry-border)]',
      shadow: 'shadow-lg'
    },
    beauty: {
      // This will be handled by BeautyDesignSystem
      background: 'bg-[var(--beauty-bg-primary)]',
      text: 'text-[var(--beauty-text-primary)]',
      textSecondary: 'text-[var(--beauty-text-secondary)]',
      card: 'bg-[var(--beauty-bg-elevated)] border-[var(--beauty-color-primary)]20',
      cardHover: 'hover:bg-[var(--beauty-bg-elevated)]',
      overlay: 'bg-[var(--beauty-bg-overlay)]',
      border: 'border-[var(--beauty-color-primary)]20',
      shadow: 'shadow-[var(--beauty-shadow-md)]'
    }
  };

  return baseClasses[theme];
};

export const getBrandColorForTheme = (
  theme: SectionTheme, 
  brandColor: string = '#8B5CF6', 
  industry?: string,
  beautyIndustry?: BeautyIndustryType
) => {
  if (theme === 'beauty' && beautyIndustry) {
    // Use beauty design system color logic
    const config = BeautyDesignSystem.getDesignConfig(beautyIndustry);
    return brandColor || config.colors.primary;
  }
  
  if (theme === 'industry' && industry) {
    // Use industry-specific brand color logic
    return brandColor; // Industry design system handles color variations internally
  }
  
  if (theme === 'dark') {
    // Lighten brand color for dark theme for better contrast
    return brandColor;
  }
  return brandColor;
};

// New utility for getting beauty industry theme classes
export const getBeautyThemeClasses = (
  industry: BeautyIndustryType, 
  section: BeautySectionType, 
  customization?: any
) => {
  return BeautyDesignSystem.getSectionThemeClasses(industry, section, customization);
};

// New utility for getting industry-specific theme classes
export const getIndustryThemeClasses = (industry: string, section: IndustryThemeSection, brandColor?: string) => {
  return IndustryThemeUtils.getIndustryThemeClasses(industry, section, brandColor);
};

// Export enhanced theme utilities for direct use
export { IndustryThemeUtils, BeautyDesignSystem };
