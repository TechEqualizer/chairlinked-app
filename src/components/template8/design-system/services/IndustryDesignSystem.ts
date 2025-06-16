
/**
 * Industry-Specific Design System Service
 * Maps industries to sophisticated design configurations for premium, custom-designed feel
 */

export type IndustryDesignConfig = {
  typography: {
    primary: string;
    secondary: string;
    headingWeight: string;
    bodyWeight: string;
    letterSpacing: string;
    lineHeight: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundSecondary: string;
    text: string;
    textSecondary: string;
    border: string;
    overlay: string;
  };
  spacing: {
    scale: 'compact' | 'comfortable' | 'luxurious';
    sectionPadding: string;
    elementGap: string;
  };
  visual: {
    borderRadius: string;
    shadowStyle: 'sharp' | 'soft' | 'minimal' | 'dramatic';
    gradientDirection: string;
    overlayOpacity: number;
  };
  mood: {
    energy: 'calm' | 'energetic' | 'bold' | 'elegant';
    formality: 'casual' | 'professional' | 'luxury';
    warmth: 'cool' | 'neutral' | 'warm';
  };
};

export class IndustryDesignSystem {
  private static readonly INDUSTRY_CONFIGS: Record<string, IndustryDesignConfig> = {
    barber: {
      typography: {
        primary: 'Oswald, sans-serif',
        secondary: 'Roboto Condensed, sans-serif',
        headingWeight: '700',
        bodyWeight: '500',
        letterSpacing: '0.025em',
        lineHeight: '1.4',
      },
      colors: {
        primary: '#1a1a1a',
        secondary: '#2c2c2c',
        accent: '#d4af37',
        background: '#fafafa',
        backgroundSecondary: '#f5f5f5',
        text: '#1a1a1a',
        textSecondary: '#4a4a4a',
        border: '#e5e5e5',
        overlay: 'rgba(26, 26, 26, 0.85)',
      },
      spacing: {
        scale: 'comfortable',
        sectionPadding: '4rem',
        elementGap: '2rem',
      },
      visual: {
        borderRadius: '0.25rem',
        shadowStyle: 'sharp',
        gradientDirection: '135deg',
        overlayOpacity: 0.85,
      },
      mood: {
        energy: 'bold',
        formality: 'professional',
        warmth: 'neutral',
      },
    },
    
    hair_stylist: {
      typography: {
        primary: 'Playfair Display, serif',
        secondary: 'Inter, sans-serif',
        headingWeight: '600',
        bodyWeight: '400',
        letterSpacing: '0.01em',
        lineHeight: '1.6',
      },
      colors: {
        primary: '#8b5cf6',
        secondary: '#f3e8ff',
        accent: '#ec4899',
        background: '#fefcff',
        backgroundSecondary: '#faf5ff',
        text: '#4c1d95',
        textSecondary: '#7c3aed',
        border: '#e9d5ff',
        overlay: 'rgba(139, 92, 246, 0.15)',
      },
      spacing: {
        scale: 'luxurious',
        sectionPadding: '5rem',
        elementGap: '2.5rem',
      },
      visual: {
        borderRadius: '1rem',
        shadowStyle: 'soft',
        gradientDirection: '135deg',
        overlayOpacity: 0.15,
      },
      mood: {
        energy: 'elegant',
        formality: 'luxury',
        warmth: 'warm',
      },
    },
    
    nail_techs: {
      typography: {
        primary: 'Poppins, sans-serif',
        secondary: 'Nunito, sans-serif',
        headingWeight: '600',
        bodyWeight: '400',
        letterSpacing: '0.015em',
        lineHeight: '1.5',
      },
      colors: {
        primary: '#ec4899',
        secondary: '#fef2f2',
        accent: '#f59e0b',
        background: '#fff0fa',
        backgroundSecondary: '#ffe6dc',
        text: '#be185d',
        textSecondary: '#f9a8d4',
        border: '#fcc1e6',
        overlay: 'rgba(236, 72, 153, 0.12)',
      },
      spacing: {
        scale: 'comfortable',
        sectionPadding: '3.5rem',
        elementGap: '1.5rem',
      },
      visual: {
        borderRadius: '0.75rem',
        shadowStyle: 'soft',
        gradientDirection: '120deg',
        overlayOpacity: 0.12,
      },
      mood: {
        energy: 'energetic',
        formality: 'casual',
        warmth: 'warm',
      },
    },
    
    estheticians: {
      typography: {
        primary: 'Inter, sans-serif',
        secondary: 'Work Sans, sans-serif',
        headingWeight: '500',
        bodyWeight: '400',
        letterSpacing: '0.005em',
        lineHeight: '1.6',
      },
      colors: {
        primary: '#059669',
        secondary: '#ecfdf5',
        accent: '#06b6d4',
        background: '#f0fdfa',
        backgroundSecondary: '#ffffff',
        text: '#064e3b',
        textSecondary: '#047857',
        border: '#a7f3d0',
        overlay: 'rgba(5, 150, 105, 0.08)',
      },
      spacing: {
        scale: 'luxurious',
        sectionPadding: '4.5rem',
        elementGap: '2rem',
      },
      visual: {
        borderRadius: '0.5rem',
        shadowStyle: 'minimal',
        gradientDirection: '160deg',
        overlayOpacity: 0.08,
      },
      mood: {
        energy: 'calm',
        formality: 'professional',
        warmth: 'cool',
      },
    },
    
    makeup_artist: {
      typography: {
        primary: 'Cormorant Garamond, serif',
        secondary: 'Outfit, sans-serif',
        headingWeight: '600',
        bodyWeight: '400',
        letterSpacing: '0.02em',
        lineHeight: '1.5',
      },
      colors: {
        primary: '#dc2626',
        secondary: '#fff1f2',
        accent: '#f59e0b',
        background: '#fff0f3',
        backgroundSecondary: '#ffe2e9',
        text: '#7f1d1d',
        textSecondary: '#f87171',
        border: '#fda4af',
        overlay: 'rgba(220, 38, 38, 0.13)',
      },
      spacing: {
        scale: 'luxurious',
        sectionPadding: '5rem',
        elementGap: '2.5rem',
      },
      visual: {
        borderRadius: '0.75rem',
        shadowStyle: 'dramatic',
        gradientDirection: '145deg',
        overlayOpacity: 0.13,
      },
      mood: {
        energy: 'bold',
        formality: 'luxury',
        warmth: 'warm',
      },
    },
  };

  static getDesignConfig(industry: string): IndustryDesignConfig {
    return this.INDUSTRY_CONFIGS[industry] || this.INDUSTRY_CONFIGS.hair_stylist;
  }

  static generateIndustryCSS(industry: string, brandColor?: string): string {
    const config = this.getDesignConfig(industry);
    
    // Use brand color if provided, otherwise use industry default
    const primaryColor = brandColor || config.colors.primary;
    
    return `
      :root {
        --industry-font-primary: ${config.typography.primary};
        --industry-font-secondary: ${config.typography.secondary};
        --industry-heading-weight: ${config.typography.headingWeight};
        --industry-body-weight: ${config.typography.bodyWeight};
        --industry-letter-spacing: ${config.typography.letterSpacing};
        --industry-line-height: ${config.typography.lineHeight};
        
        --industry-color-primary: ${primaryColor};
        --industry-color-secondary: ${config.colors.secondary};
        --industry-color-accent: ${config.colors.accent};
        --industry-bg-primary: ${config.colors.background};
        --industry-bg-secondary: ${config.colors.backgroundSecondary};
        --industry-text-primary: ${config.colors.text};
        --industry-text-secondary: ${config.colors.textSecondary};
        --industry-border: ${config.colors.border};
        --industry-overlay: ${config.colors.overlay};
        
        --industry-section-padding: ${config.spacing.sectionPadding};
        --industry-element-gap: ${config.spacing.elementGap};
        --industry-border-radius: ${config.visual.borderRadius};
        --industry-overlay-opacity: ${config.visual.overlayOpacity};
      }
    `;
  }

  static getSpacingScale(industry: string): Record<string, string> {
    const config = this.getDesignConfig(industry);
    
    const baseMultipliers = {
      compact: { section: 0.8, element: 0.9, padding: 0.75 },
      comfortable: { section: 1, element: 1, padding: 1 },
      luxurious: { section: 1.25, element: 1.15, padding: 1.5 },
    };
    
    const multiplier = baseMultipliers[config.spacing.scale];
    
    return {
      xs: `${0.5 * multiplier.padding}rem`,
      sm: `${0.75 * multiplier.padding}rem`,
      md: `${1 * multiplier.padding}rem`,
      lg: `${1.5 * multiplier.padding}rem`,
      xl: `${2 * multiplier.padding}rem`,
      '2xl': `${3 * multiplier.padding}rem`,
      section: `${4 * multiplier.section}rem`,
      element: `${1.5 * multiplier.element}rem`,
    };
  }

  static getShadowStyle(industry: string): Record<string, string> {
    const config = this.getDesignConfig(industry);
    
    const shadowStyles = {
      sharp: {
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.12)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
      },
      soft: {
        sm: '0 2px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        md: '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 12px 24px -4px rgba(0, 0, 0, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
      },
      minimal: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        md: '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        lg: '0 4px 8px 0 rgba(0, 0, 0, 0.08)',
      },
      dramatic: {
        sm: '0 4px 12px 0 rgba(0, 0, 0, 0.15), 0 2px 6px 0 rgba(0, 0, 0, 0.1)',
        md: '0 8px 24px -2px rgba(0, 0, 0, 0.18), 0 4px 12px -1px rgba(0, 0, 0, 0.12)',
        lg: '0 20px 40px -8px rgba(0, 0, 0, 0.22), 0 8px 20px -4px rgba(0, 0, 0, 0.15)',
      },
    };
    
    return shadowStyles[config.visual.shadowStyle];
  }

  static getTypographyClasses(industry: string): Record<string, string> {
    const config = this.getDesignConfig(industry);
    
    return {
      heading: `font-[${config.typography.primary}] font-[${config.typography.headingWeight}] tracking-[${config.typography.letterSpacing}] leading-[${config.typography.lineHeight}]`,
      body: `font-[${config.typography.secondary}] font-[${config.typography.bodyWeight}] leading-[${config.typography.lineHeight}]`,
      primary: config.typography.primary,
      secondary: config.typography.secondary,
    };
  }
}
