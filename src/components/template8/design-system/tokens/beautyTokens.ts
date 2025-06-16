
/**
 * Enhanced Beauty Industry Design Tokens
 * Sophisticated design system for beauty professionals
 */

// Mathematical spacing scale based on beauty industry needs
export const beautySpacing = {
  // Base unit: 4px for precise control
  base: '0.25rem', // 4px
  
  // Component-specific spacing
  salon: {
    cardPadding: '1.5rem', // 24px - comfortable for service cards
    gridGap: '2rem', // 32px - optimal for service grids
    sectionSpacing: '4rem', // 64px - professional section breaks
    consultationSpace: '3rem', // 48px - comfortable consultation areas
  },
  
  spa: {
    cardPadding: '2rem', // 32px - luxurious feel
    gridGap: '2.5rem', // 40px - serene spacing
    sectionSpacing: '5rem', // 80px - calming section breaks
    treatmentSpace: '4rem', // 64px - spa treatment spacing
  },
  
  makeup: {
    cardPadding: '1.25rem', // 20px - bold and compact
    gridGap: '1.5rem', // 24px - dramatic portfolio grid
    sectionSpacing: '3.5rem', // 56px - dynamic section breaks
    portfolioSpace: '2rem', // 32px - makeup portfolio spacing
  },
  
  // Vertical rhythm system
  rhythm: {
    xs: '0.5rem', // 8px
    sm: '0.75rem', // 12px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '5rem', // 80px
    '5xl': '6rem', // 96px
  },
  
  // Layout utilities
  layout: {
    beforeAfterGap: '1rem', // 16px - before/after image spacing
    serviceShowcaseGap: '2rem', // 32px - service showcase spacing
    testimonialSpacing: '1.5rem', // 24px - testimonial card spacing
    galleryItemGap: '1rem', // 16px - gallery item spacing
  }
};

// Beauty-focused color psychology
export const beautyColors = {
  // Salon modern theme
  salon: {
    primary: '#1a1a1a', // Professional black
    secondary: '#2c2c2c', // Charcoal
    accent: '#d4af37', // Gold accent
    success: '#059669', // Professional green
    warning: '#f59e0b', // Attention amber
    error: '#dc2626', // Professional red
    
    // Background variations
    background: {
      primary: '#fafafa', // Clean white
      secondary: '#f5f5f5', // Subtle gray
      elevated: '#ffffff', // Pure white cards
      overlay: 'rgba(26, 26, 26, 0.85)',
    },
    
    // Text hierarchy
    text: {
      primary: '#1a1a1a', // Strong black
      secondary: '#4a4a4a', // Medium gray
      muted: '#6b7280', // Light gray
      inverse: '#ffffff', // White on dark
    },
    
    // Mood variations
    mood: {
      confident: '#1a1a1a', // Strong black
      professional: '#2c2c2c', // Charcoal
      luxurious: '#d4af37', // Gold
    }
  },
  
  // Spa zen theme
  spa: {
    primary: '#059669', // Healing green
    secondary: '#06b6d4', // Calming teal
    accent: '#8b5cf6', // Spiritual purple
    success: '#10b981', // Natural green
    warning: '#f59e0b', // Gentle amber
    error: '#f87171', // Soft red
    
    background: {
      primary: '#f0fdfa', // Zen mint
      secondary: '#ecfdf5', // Peaceful green
      elevated: '#ffffff', // Pure serenity
      overlay: 'rgba(5, 150, 105, 0.08)',
    },
    
    text: {
      primary: '#064e3b', // Deep forest
      secondary: '#047857', // Forest green
      muted: '#6b7280', // Peaceful gray
      inverse: '#ffffff', // Light on dark
    },
    
    mood: {
      calming: '#059669', // Peaceful green
      serene: '#06b6d4', // Tranquil teal
      healing: '#8b5cf6', // Spiritual purple
    }
  },
  
  // Makeup glamour theme
  makeup: {
    primary: '#dc2626', // Bold red
    secondary: '#ec4899', // Glamorous pink
    accent: '#f59e0b', // Golden highlight
    success: '#059669', // Success green
    warning: '#f59e0b', // Attention gold
    error: '#dc2626', // Bold red
    
    background: {
      primary: '#fff0f3', // Soft pink
      secondary: '#ffe2e9', // Blush pink
      elevated: '#ffffff', // Clean white
      overlay: 'rgba(220, 38, 38, 0.13)',
    },
    
    text: {
      primary: '#7f1d1d', // Deep red
      secondary: '#be185d', // Rich pink
      muted: '#6b7280', // Neutral gray
      inverse: '#ffffff', // White on bold
    },
    
    mood: {
      bold: '#dc2626', // Statement red
      glamorous: '#ec4899', // Striking pink
      dramatic: '#7f1d1d', // Deep red
    }
  },
  
  // Hair stylist creative theme
  hair: {
    primary: '#8b5cf6', // Creative purple
    secondary: '#f3e8ff', // Soft lavender
    accent: '#ec4899', // Vibrant pink
    success: '#059669', // Success green
    warning: '#f59e0b', // Creative amber
    error: '#dc2626', // Alert red
    
    background: {
      primary: '#fefcff', // Almost white
      secondary: '#faf5ff', // Lavender tint
      elevated: '#ffffff', // Pure white
      overlay: 'rgba(139, 92, 246, 0.15)',
    },
    
    text: {
      primary: '#4c1d95', // Deep purple
      secondary: '#7c3aed', // Medium purple
      muted: '#6b7280', // Neutral gray
      inverse: '#ffffff', // White text
    },
    
    mood: {
      creative: '#8b5cf6', // Inspiring purple
      artistic: '#ec4899', // Expressive pink
      elegant: '#4c1d95', // Sophisticated purple
    }
  }
};

// Sophisticated typography hierarchy
export const beautyTypography = {
  // Font families with proper fallbacks
  fontFamilies: {
    // Luxury serif fonts
    luxury: {
      primary: 'Playfair Display, Georgia, serif',
      secondary: 'Cormorant Garamond, Georgia, serif',
      fallback: 'Georgia, serif'
    },
    
    // Modern sans-serif fonts
    modern: {
      primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      secondary: 'Work Sans, -apple-system, sans-serif',
      fallback: '-apple-system, BlinkMacSystemFont, sans-serif'
    },
    
    // Bold statement fonts
    bold: {
      primary: 'Oswald, Impact, sans-serif',
      secondary: 'Montserrat, Arial, sans-serif',
      fallback: 'Arial Black, sans-serif'
    },
    
    // Creative display fonts
    creative: {
      primary: 'Poppins, Arial, sans-serif',
      secondary: 'Nunito, Arial, sans-serif',
      fallback: 'Arial, sans-serif'
    }
  },
  
  // Modular scale typography (1.25 ratio - major third)
  scale: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.563rem', // 25px
    '3xl': '1.953rem', // 31px
    '4xl': '2.441rem', // 39px
    '5xl': '3.052rem', // 49px
    '6xl': '3.815rem', // 61px
    '7xl': '4.768rem', // 76px
    '8xl': '5.96rem', // 95px
  },
  
  // Weight system
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  
  // Line height relationships
  lineHeights: {
    tight: '1.25', // Headlines
    snug: '1.375', // Subheadings
    normal: '1.5', // Body text
    relaxed: '1.625', // Large body text
    loose: '2', // Captions
  },
  
  // Letter spacing for elegance
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  }
};

// Advanced shadow system for depth and luxury
export const beautyShadows = {
  // Elegant shadow variations
  elegant: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 2px 4px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    md: '0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    lg: '0 8px 16px 0 rgba(0, 0, 0, 0.1), 0 4px 8px 0 rgba(0, 0, 0, 0.08)',
    xl: '0 16px 32px 0 rgba(0, 0, 0, 0.12), 0 8px 16px 0 rgba(0, 0, 0, 0.1)',
  },
  
  // Luxury shadows with warmth
  luxury: {
    xs: '0 2px 4px 0 rgba(212, 175, 55, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 4px 8px 0 rgba(212, 175, 55, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    md: '0 8px 16px 0 rgba(212, 175, 55, 0.2), 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
    lg: '0 16px 32px 0 rgba(212, 175, 55, 0.25), 0 8px 16px 0 rgba(0, 0, 0, 0.12)',
    xl: '0 24px 48px 0 rgba(212, 175, 55, 0.3), 0 12px 24px 0 rgba(0, 0, 0, 0.15)',
  },
  
  // Brand-specific glow effects
  glow: {
    salon: '0 0 20px 4px rgba(212, 175, 55, 0.2)',
    spa: '0 0 20px 4px rgba(5, 150, 105, 0.15)',
    makeup: '0 0 20px 4px rgba(220, 38, 38, 0.2)',
    hair: '0 0 20px 4px rgba(139, 92, 246, 0.2)',
  }
};

// Premium animation system
export const beautyAnimations = {
  // Timing functions for mood
  easing: {
    calm: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Spa-like calm
    elegant: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Luxury elegance
    energetic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Salon energy
    dramatic: 'cubic-bezier(0.4, 0, 0.2, 1)', // Makeup drama
  },
  
  // Duration scales
  duration: {
    instant: '100ms',
    quick: '200ms',
    normal: '300ms',
    slow: '500ms',
    luxurious: '800ms',
  },
  
  // Micro-interactions
  interactions: {
    cardHover: 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    buttonPress: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    fadeIn: 'opacity 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    slideUp: 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }
};

// Responsive breakpoints for beauty industry
export const beautyBreakpoints = {
  mobile: {
    min: '320px',
    max: '767px',
    optimized: '375px', // iPhone standard
  },
  tablet: {
    min: '768px',
    max: '1023px',
    optimized: '768px', // iPad standard
  },
  desktop: {
    min: '1024px',
    max: '1439px',
    optimized: '1280px', // Common desktop
  },
  large: {
    min: '1440px',
    optimized: '1440px', // Large screens
  },
  
  // Touch-optimized sizes
  touch: {
    minTarget: '44px', // Minimum touch target
    comfortable: '48px', // Comfortable touch target
    spacious: '56px', // Spacious touch target
  }
};

// Export all beauty tokens
export const beautyDesignTokens = {
  spacing: beautySpacing,
  colors: beautyColors,
  typography: beautyTypography,
  shadows: beautyShadows,
  animations: beautyAnimations,
  breakpoints: beautyBreakpoints,
};

export default beautyDesignTokens;
