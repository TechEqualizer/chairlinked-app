
/**
 * Enhanced Beauty Industry Design System Service
 * Premium design system for beauty professionals with sophisticated styling
 */

import { beautyDesignTokens } from '../tokens/beautyTokens';

export type BeautyIndustryType = 'salon' | 'spa' | 'makeup' | 'hair' | 'esthetician' | 'nail_tech';
export type BeautyMoodType = 'elegant' | 'modern' | 'bold' | 'calming' | 'luxurious' | 'creative';
export type BeautySectionType = 'hero' | 'services' | 'gallery' | 'testimonials' | 'booking' | 'footer';

export interface BeautyThemeConfig {
  industry: BeautyIndustryType;
  mood: BeautyMoodType;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export interface BeautyDesignConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: {
      primary: string;
      secondary: string;
      elevated: string;
      overlay: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    mood: {
      [key: string]: string;
    };
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      fallback: string;
    };
    scale: typeof beautyDesignTokens.typography.scale;
    weights: typeof beautyDesignTokens.typography.weights;
    lineHeights: typeof beautyDesignTokens.typography.lineHeights;
    letterSpacing: typeof beautyDesignTokens.typography.letterSpacing;
  };
  spacing: {
    cardPadding: string;
    gridGap: string;
    sectionSpacing: string;
    rhythm: typeof beautyDesignTokens.spacing.rhythm;
  };
  shadows: {
    [key: string]: string;
  };
  animations: {
    easing: string;
    duration: {
      normal: string;
      slow: string;
    };
    interactions: typeof beautyDesignTokens.animations.interactions;
  };
}

export class BeautyDesignSystem {
  private static readonly INDUSTRY_CONFIGS: Record<BeautyIndustryType, BeautyDesignConfig> = {
    salon: {
      colors: beautyDesignTokens.colors.salon,
      typography: {
        fontFamily: beautyDesignTokens.typography.fontFamilies.bold,
        scale: beautyDesignTokens.typography.scale,
        weights: beautyDesignTokens.typography.weights,
        lineHeights: beautyDesignTokens.typography.lineHeights,
        letterSpacing: beautyDesignTokens.typography.letterSpacing,
      },
      spacing: {
        cardPadding: beautyDesignTokens.spacing.salon.cardPadding,
        gridGap: beautyDesignTokens.spacing.salon.gridGap,
        sectionSpacing: beautyDesignTokens.spacing.salon.sectionSpacing,
        rhythm: beautyDesignTokens.spacing.rhythm,
      },
      shadows: beautyDesignTokens.shadows.elegant,
      animations: {
        easing: beautyDesignTokens.animations.easing.energetic,
        duration: {
          normal: beautyDesignTokens.animations.duration.normal,
          slow: beautyDesignTokens.animations.duration.slow,
        },
        interactions: beautyDesignTokens.animations.interactions,
      },
    },
    
    spa: {
      colors: beautyDesignTokens.colors.spa,
      typography: {
        fontFamily: beautyDesignTokens.typography.fontFamilies.luxury,
        scale: beautyDesignTokens.typography.scale,
        weights: beautyDesignTokens.typography.weights,
        lineHeights: beautyDesignTokens.typography.lineHeights,
        letterSpacing: beautyDesignTokens.typography.letterSpacing,
      },
      spacing: {
        cardPadding: beautyDesignTokens.spacing.spa.cardPadding,
        gridGap: beautyDesignTokens.spacing.spa.gridGap,
        sectionSpacing: beautyDesignTokens.spacing.spa.sectionSpacing,
        rhythm: beautyDesignTokens.spacing.rhythm,
      },
      shadows: beautyDesignTokens.shadows.elegant,
      animations: {
        easing: beautyDesignTokens.animations.easing.calm,
        duration: {
          normal: beautyDesignTokens.animations.duration.slow,
          slow: beautyDesignTokens.animations.duration.luxurious,
        },
        interactions: beautyDesignTokens.animations.interactions,
      },
    },
    
    makeup: {
      colors: beautyDesignTokens.colors.makeup,
      typography: {
        fontFamily: beautyDesignTokens.typography.fontFamilies.bold,
        scale: beautyDesignTokens.typography.scale,
        weights: beautyDesignTokens.typography.weights,
        lineHeights: beautyDesignTokens.typography.lineHeights,
        letterSpacing: beautyDesignTokens.typography.letterSpacing,
      },
      spacing: {
        cardPadding: beautyDesignTokens.spacing.makeup.cardPadding,
        gridGap: beautyDesignTokens.spacing.makeup.gridGap,
        sectionSpacing: beautyDesignTokens.spacing.makeup.sectionSpacing,
        rhythm: beautyDesignTokens.spacing.rhythm,
      },
      shadows: beautyDesignTokens.shadows.luxury,
      animations: {
        easing: beautyDesignTokens.animations.easing.dramatic,
        duration: {
          normal: beautyDesignTokens.animations.duration.quick,
          slow: beautyDesignTokens.animations.duration.normal,
        },
        interactions: beautyDesignTokens.animations.interactions,
      },
    },
    
    hair: {
      colors: beautyDesignTokens.colors.hair,
      typography: {
        fontFamily: beautyDesignTokens.typography.fontFamilies.creative,
        scale: beautyDesignTokens.typography.scale,
        weights: beautyDesignTokens.typography.weights,
        lineHeights: beautyDesignTokens.typography.lineHeights,
        letterSpacing: beautyDesignTokens.typography.letterSpacing,
      },
      spacing: {
        cardPadding: beautyDesignTokens.spacing.salon.cardPadding,
        gridGap: beautyDesignTokens.spacing.salon.gridGap,
        sectionSpacing: beautyDesignTokens.spacing.salon.sectionSpacing,
        rhythm: beautyDesignTokens.spacing.rhythm,
      },
      shadows: beautyDesignTokens.shadows.elegant,
      animations: {
        easing: beautyDesignTokens.animations.easing.elegant,
        duration: {
          normal: beautyDesignTokens.animations.duration.normal,
          slow: beautyDesignTokens.animations.duration.luxurious,
        },
        interactions: beautyDesignTokens.animations.interactions,
      },
    },
    
    esthetician: {
      colors: beautyDesignTokens.colors.spa, // Use spa colors for estheticians
      typography: {
        fontFamily: beautyDesignTokens.typography.fontFamilies.modern,
        scale: beautyDesignTokens.typography.scale,
        weights: beautyDesignTokens.typography.weights,
        lineHeights: beautyDesignTokens.typography.lineHeights,
        letterSpacing: beautyDesignTokens.typography.letterSpacing,
      },
      spacing: {
        cardPadding: beautyDesignTokens.spacing.spa.cardPadding,
        gridGap: beautyDesignTokens.spacing.spa.gridGap,
        sectionSpacing: beautyDesignTokens.spacing.spa.sectionSpacing,
        rhythm: beautyDesignTokens.spacing.rhythm,
      },
      shadows: beautyDesignTokens.shadows.elegant,
      animations: {
        easing: beautyDesignTokens.animations.easing.calm,
        duration: {
          normal: beautyDesignTokens.animations.duration.normal,
          slow: beautyDesignTokens.animations.duration.slow,
        },
        interactions: beautyDesignTokens.animations.interactions,
      },
    },
    
    nail_tech: {
      colors: beautyDesignTokens.colors.makeup, // Use makeup colors for nail techs
      typography: {
        fontFamily: beautyDesignTokens.typography.fontFamilies.creative,
        scale: beautyDesignTokens.typography.scale,
        weights: beautyDesignTokens.typography.weights,
        lineHeights: beautyDesignTokens.typography.lineHeights,
        letterSpacing: beautyDesignTokens.typography.letterSpacing,
      },
      spacing: {
        cardPadding: beautyDesignTokens.spacing.makeup.cardPadding,
        gridGap: beautyDesignTokens.spacing.makeup.gridGap,
        sectionSpacing: beautyDesignTokens.spacing.makeup.sectionSpacing,
        rhythm: beautyDesignTokens.spacing.rhythm,
      },
      shadows: beautyDesignTokens.shadows.elegant,
      animations: {
        easing: beautyDesignTokens.animations.easing.energetic,
        duration: {
          normal: beautyDesignTokens.animations.duration.normal,
          slow: beautyDesignTokens.animations.duration.slow,
        },
        interactions: beautyDesignTokens.animations.interactions,
      },
    },
  };

  /**
   * Get design configuration for a specific beauty industry
   */
  static getDesignConfig(industry: BeautyIndustryType, customization?: Partial<BeautyThemeConfig>): BeautyDesignConfig {
    const baseConfig = this.INDUSTRY_CONFIGS[industry] || this.INDUSTRY_CONFIGS.salon;
    
    if (!customization) {
      return baseConfig;
    }

    // Apply customizations
    const customizedConfig = { ...baseConfig };
    
    if (customization.primaryColor) {
      customizedConfig.colors.primary = customization.primaryColor;
    }
    
    if (customization.secondaryColor) {
      customizedConfig.colors.secondary = customization.secondaryColor;
    }
    
    if (customization.accentColor) {
      customizedConfig.colors.accent = customization.accentColor;
    }

    return customizedConfig;
  }

  /**
   * Generate section-specific theme classes
   */
  static getSectionThemeClasses(
    industry: BeautyIndustryType,
    section: BeautySectionType,
    customization?: Partial<BeautyThemeConfig>
  ): Record<string, string> {
    const config = this.getDesignConfig(industry, customization);
    
    const baseClasses = {
      container: `mx-auto px-6 max-w-7xl`,
      section: `relative overflow-hidden`,
      heading: `font-[${config.typography.fontFamily.primary}] font-${config.typography.weights.bold} tracking-${config.typography.letterSpacing.wide}`,
      subheading: `font-[${config.typography.fontFamily.secondary}] font-${config.typography.weights.normal} leading-${config.typography.lineHeights.relaxed}`,
      card: `rounded-xl backdrop-blur-sm border border-opacity-20 transition-all duration-300`,
      button: `rounded-lg font-${config.typography.weights.semibold} transition-all duration-300`,
      text: `font-[${config.typography.fontFamily.secondary}] leading-${config.typography.lineHeights.normal}`,
    };

    // Section-specific styling
    const sectionStyles = this.getSectionSpecificStyles(section, config);

    return {
      ...baseClasses,
      ...sectionStyles,
      // Export individual design tokens for direct use
      primaryColor: config.colors.primary,
      secondaryColor: config.colors.secondary,
      accentColor: config.colors.accent,
      primaryFont: config.typography.fontFamily.primary,
      secondaryFont: config.typography.fontFamily.secondary,
      cardPadding: config.spacing.cardPadding,
      gridGap: config.spacing.gridGap,
      sectionSpacing: config.spacing.sectionSpacing,
      shadowMd: config.shadows.md || config.shadows['0 4px 8px 0 rgba(0, 0, 0, 0.08)'],
      shadowLg: config.shadows.lg || config.shadows['0 8px 16px 0 rgba(0, 0, 0, 0.1)'],
      animationEasing: config.animations.easing,
      animationDuration: config.animations.duration.normal,
    };
  }

  /**
   * Get section-specific styling
   */
  private static getSectionSpecificStyles(section: BeautySectionType, config: BeautyDesignConfig): Record<string, string> {
    const styles: Record<BeautySectionType, Record<string, string>> = {
      hero: {
        background: `linear-gradient(135deg, ${config.colors.primary}15, ${config.colors.background.primary})`,
        textPrimary: config.colors.text.primary,
        textSecondary: config.colors.text.secondary,
        overlay: config.colors.background.overlay,
        padding: config.spacing.sectionSpacing,
      },
      
      services: {
        background: config.colors.background.secondary,
        card: `bg-white/90 ${config.shadows.md ? `shadow-[${config.shadows.md}]` : 'shadow-md'} hover:${config.shadows.lg ? `shadow-[${config.shadows.lg}]` : 'shadow-lg'}`,
        grid: `gap-[${config.spacing.gridGap}]`,
        padding: config.spacing.cardPadding,
      },
      
      gallery: {
        background: config.colors.background.primary,
        item: `rounded-lg ${config.shadows.md ? `shadow-[${config.shadows.md}]` : 'shadow-md'} hover:${config.shadows.lg ? `shadow-[${config.shadows.lg}]` : 'shadow-lg'}`,
        grid: `gap-[${config.spacing.rhythm.lg}]`,
        padding: config.spacing.cardPadding,
      },
      
      testimonials: {
        background: `linear-gradient(145deg, ${config.colors.background.primary}, ${config.colors.background.secondary})`,
        card: `bg-white/95 ${config.shadows.md ? `shadow-[${config.shadows.md}]` : 'shadow-md'} border border-${config.colors.primary}20`,
        spacing: config.spacing.rhythm.xl,
        padding: config.spacing.cardPadding,
      },
      
      booking: {
        background: config.colors.primary,
        text: config.colors.text.inverse,
        card: `bg-white/10 backdrop-blur-md ${config.shadows.lg ? `shadow-[${config.shadows.lg}]` : 'shadow-lg'}`,
        button: `bg-${config.colors.accent} hover:bg-${config.colors.accent}90`,
        padding: config.spacing.sectionSpacing,
      },
      
      footer: {
        background: config.colors.text.primary,
        text: config.colors.text.inverse,
        link: `text-${config.colors.accent} hover:text-${config.colors.accent}80`,
        padding: config.spacing.rhythm.xl,
      },
    };

    return styles[section] || {};
  }

  /**
   * Generate complete CSS variables for the beauty design system
   */
  static generateBeautyCSS(industry: BeautyIndustryType, customization?: Partial<BeautyThemeConfig>): string {
    const config = this.getDesignConfig(industry, customization);
    
    return `
      :root {
        /* Beauty Design System - ${industry.charAt(0).toUpperCase() + industry.slice(1)} Theme */
        
        /* Typography */
        --beauty-font-primary: ${config.typography.fontFamily.primary};
        --beauty-font-secondary: ${config.typography.fontFamily.secondary};
        --beauty-font-fallback: ${config.typography.fontFamily.fallback};
        
        /* Colors */
        --beauty-color-primary: ${config.colors.primary};
        --beauty-color-secondary: ${config.colors.secondary};
        --beauty-color-accent: ${config.colors.accent};
        
        /* Backgrounds */
        --beauty-bg-primary: ${config.colors.background.primary};
        --beauty-bg-secondary: ${config.colors.background.secondary};
        --beauty-bg-elevated: ${config.colors.background.elevated};
        --beauty-bg-overlay: ${config.colors.background.overlay};
        
        /* Text Colors */
        --beauty-text-primary: ${config.colors.text.primary};
        --beauty-text-secondary: ${config.colors.text.secondary};
        --beauty-text-muted: ${config.colors.text.muted};
        --beauty-text-inverse: ${config.colors.text.inverse};
        
        /* Spacing */
        --beauty-spacing-card: ${config.spacing.cardPadding};
        --beauty-spacing-grid: ${config.spacing.gridGap};
        --beauty-spacing-section: ${config.spacing.sectionSpacing};
        
        /* Shadows */
        --beauty-shadow-sm: ${config.shadows.sm || '0 2px 4px rgba(0,0,0,0.1)'};
        --beauty-shadow-md: ${config.shadows.md || '0 4px 8px rgba(0,0,0,0.1)'};
        --beauty-shadow-lg: ${config.shadows.lg || '0 8px 16px rgba(0,0,0,0.1)'};
        
        /* Animations */
        --beauty-animation-easing: ${config.animations.easing};
        --beauty-animation-duration: ${config.animations.duration.normal};
        --beauty-animation-duration-slow: ${config.animations.duration.slow};
      }
      
      /* Beauty utility classes */
      .beauty-card {
        background: var(--beauty-bg-elevated);
        border-radius: 0.75rem;
        box-shadow: var(--beauty-shadow-md);
        padding: var(--beauty-spacing-card);
        transition: all var(--beauty-animation-duration) var(--beauty-animation-easing);
      }
      
      .beauty-card:hover {
        box-shadow: var(--beauty-shadow-lg);
        transform: translateY(-2px);
      }
      
      .beauty-button {
        background: var(--beauty-color-primary);
        color: var(--beauty-text-inverse);
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        transition: all var(--beauty-animation-duration) var(--beauty-animation-easing);
      }
      
      .beauty-button:hover {
        background: var(--beauty-color-secondary);
        transform: translateY(-1px);
      }
      
      .beauty-text-primary {
        color: var(--beauty-text-primary);
        font-family: var(--beauty-font-primary);
      }
      
      .beauty-text-secondary {
        color: var(--beauty-text-secondary);
        font-family: var(--beauty-font-secondary);
      }
    `;
  }

  /**
   * Get required font imports for the beauty industry
   */
  static getRequiredFonts(industry: BeautyIndustryType): string[] {
    const config = this.getDesignConfig(industry);
    const fonts = [config.typography.fontFamily.primary, config.typography.fontFamily.secondary];
    
    return fonts
      .map(font => font.split(',')[0].trim().replace(/['"]/g, ''))
      .filter(font => !['sans-serif', 'serif', 'monospace', '-apple-system', 'BlinkMacSystemFont'].includes(font))
      .filter((font, index, array) => array.indexOf(font) === index); // Remove duplicates
  }

  /**
   * Get responsive spacing for different screen sizes
   */
  static getResponsiveSpacing(industry: BeautyIndustryType): Record<string, Record<string, string>> {
    const config = this.getDesignConfig(industry);
    
    return {
      mobile: {
        cardPadding: `calc(${config.spacing.cardPadding} * 0.75)`,
        gridGap: `calc(${config.spacing.gridGap} * 0.8)`,
        sectionSpacing: `calc(${config.spacing.sectionSpacing} * 0.6)`,
      },
      tablet: {
        cardPadding: `calc(${config.spacing.cardPadding} * 0.9)`,
        gridGap: config.spacing.gridGap,
        sectionSpacing: `calc(${config.spacing.sectionSpacing} * 0.8)`,
      },
      desktop: {
        cardPadding: config.spacing.cardPadding,
        gridGap: `calc(${config.spacing.gridGap} * 1.1)`,
        sectionSpacing: config.spacing.sectionSpacing,
      },
    };
  }
}

export default BeautyDesignSystem;
