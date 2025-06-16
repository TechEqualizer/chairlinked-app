
/**
 * Industry Theme Utilities
 * Provides industry-specific theme classes and styling functions
 */

import { IndustryDesignSystem, type IndustryDesignConfig } from '../services/IndustryDesignSystem';

export type IndustryThemeSection = 'hero' | 'gallery' | 'testimonials' | 'stories' | 'footer';

export class IndustryThemeUtils {
  static getIndustryThemeClasses(
    industry: string,
    section: IndustryThemeSection,
    brandColor?: string
  ): Record<string, string> {
    const config = IndustryDesignSystem.getDesignConfig(industry);
    const spacing = IndustryDesignSystem.getSpacingScale(industry);
    const shadows = IndustryDesignSystem.getShadowStyle(industry);
    const typography = IndustryDesignSystem.getTypographyClasses(industry);

    const baseClasses = {
      container: `px-6 mx-auto max-w-7xl`,
      section: `py-[${spacing.section}] relative`,
      heading: `${typography.heading} text-3xl lg:text-5xl mb-6`,
      subheading: `${typography.body} text-lg lg:text-xl opacity-90 mb-8`,
      card: `rounded-[${config.visual.borderRadius}] backdrop-blur-sm border border-opacity-20`,
      button: `rounded-[${config.visual.borderRadius}] font-medium transition-all duration-300`,
      overlay: `absolute inset-0 opacity-[${config.visual.overlayOpacity}]`,
    };

    // Section-specific styling
    const sectionStyles = {
      hero: {
        background: this.getHeroBackground(config, brandColor),
        text: this.getHeroTextColor(config),
        accent: brandColor || config.colors.accent,
      },
      gallery: {
        background: config.colors.backgroundSecondary,
        card: `${baseClasses.card} shadow-[${shadows.md}] hover:shadow-[${shadows.lg}]`,
        grid: `gap-[${spacing.element}]`,
      },
      testimonials: {
        background: this.getTestimonialsBackground(config),
        card: `${baseClasses.card} shadow-[${shadows.sm}] bg-white/80`,
      },
      stories: {
        background: config.colors.background,
        item: `rounded-[${config.visual.borderRadius}] shadow-[${shadows.md}]`,
      },
      footer: {
        background: config.colors.text,
        text: config.colors.background,
      },
    };

    return {
      ...baseClasses,
      ...sectionStyles[section],
      // Fix: spread the objects instead of assigning directly
      primaryFont: typography.primary,
      secondaryFont: typography.secondary,
      headingClasses: typography.heading,
      bodyClasses: typography.body,
      sectionSpacing: spacing.section,
      elementSpacing: spacing.element,
      smallShadow: shadows.sm,
      mediumShadow: shadows.md,
      largeShadow: shadows.lg,
    };
  }

  private static getHeroBackground(config: IndustryDesignConfig, brandColor?: string): string {
    const primaryColor = brandColor || config.colors.primary;
    
    if (config.mood.formality === 'luxury') {
      return `linear-gradient(${config.visual.gradientDirection}, ${primaryColor} 0%, ${config.colors.secondary} 50%, ${config.colors.background} 100%)`;
    } else if (config.mood.energy === 'bold') {
      return `linear-gradient(${config.visual.gradientDirection}, ${primaryColor} 0%, ${config.colors.accent} 100%)`;
    } else {
      return `linear-gradient(${config.visual.gradientDirection}, ${config.colors.background} 0%, ${config.colors.backgroundSecondary} 100%)`;
    }
  }

  private static getHeroTextColor(config: IndustryDesignConfig): string {
    return config.mood.formality === 'luxury' || config.mood.energy === 'bold'
      ? '#ffffff'
      : config.colors.text;
  }

  private static getTestimonialsBackground(config: IndustryDesignConfig): string {
    if (config.mood.energy === 'calm') {
      return `linear-gradient(145deg, ${config.colors.background} 0%, ${config.colors.backgroundSecondary} 100%)`;
    }
    return config.colors.backgroundSecondary;
  }

  static generateIndustryCSS(industry: string, brandColor?: string): string {
    return IndustryDesignSystem.generateIndustryCSS(industry, brandColor);
  }

  static getIndustryFontLoads(industry: string): string[] {
    const config = IndustryDesignSystem.getDesignConfig(industry);
    const fonts = [config.typography.primary, config.typography.secondary];
    
    return fonts
      .map(font => font.split(',')[0].trim().replace(/['"]/g, ''))
      .filter(font => !['sans-serif', 'serif', 'monospace'].includes(font));
  }

  static getResponsiveSpacing(industry: string): Record<string, Record<string, string>> {
    const spacing = IndustryDesignSystem.getSpacingScale(industry);
    
    return {
      mobile: {
        section: `calc(${spacing.section} * 0.6)`,
        element: `calc(${spacing.element} * 0.8)`,
        padding: `calc(${spacing.md} * 0.75)`,
      },
      tablet: {
        section: `calc(${spacing.section} * 0.8)`,
        element: spacing.element,
        padding: spacing.md,
      },
      desktop: {
        section: spacing.section,
        element: `calc(${spacing.element} * 1.1)`,
        padding: `calc(${spacing.md} * 1.2)`,
      },
    };
  }

  static getMoodBasedAnimations(industry: string): Record<string, string> {
    const config = IndustryDesignSystem.getDesignConfig(industry);
    
    const animationTimings = {
      calm: { duration: '500ms', easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
      energetic: { duration: '200ms', easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
      bold: { duration: '150ms', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      elegant: { duration: '400ms', easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' },
    };
    
    const timing = animationTimings[config.mood.energy];
    
    return {
      transition: `all ${timing.duration} ${timing.easing}`,
      hover: `transform ${timing.duration} ${timing.easing}`,
      fade: `opacity ${timing.duration} ${timing.easing}`,
    };
  }
}
