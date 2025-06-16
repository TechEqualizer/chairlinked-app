
/**
 * Enhanced Design System Tokens for Template 8 - Production Ready
 * 
 * This file defines production-grade design tokens with improved spacing,
 * typography, colors, and visual effects for a professional UI experience.
 */

// Enhanced color palette with production-grade variations
export const colors = {
  // Primary brand colors with more sophisticated variations
  primary: {
    50: '#f0f7ff',
    100: '#e0eefe',
    200: '#bae0fd',
    300: '#7cc8fb',
    400: '#36aaf5',
    500: '#0c8ee7',
    600: '#0270c4',
    700: '#0259a0',
    800: '#064b84',
    900: '#0a406e',
    950: '#072a4a',
  },
  
  // Enhanced secondary/accent colors for better visual hierarchy
  secondary: {
    50: '#f5f3ff',
    100: '#ede8ff',
    200: '#dcd5ff',
    300: '#c3b5fe',
    400: '#a48bfc',
    500: '#8b5cf6', // Primary brand color
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
  },
  
  // Production-grade neutral colors with better contrast
  neutral: {
    25: '#fcfcfd',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  
  // Enhanced success states
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Enhanced warning states
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  // Enhanced error states
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
};

// Production-grade spacing system with more granular control
export const spacing = {
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  18: '4.5rem',    // 72px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
};

// Enhanced typography with better hierarchy and readability
export const typography = {
  // Professional font families with better fallbacks
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'Playfair Display, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    // Enhanced modern fonts
    inter: 'Inter, sans-serif',
    poppins: 'Poppins, sans-serif',
    outfit: 'Outfit, sans-serif',
    workSans: 'Work Sans, sans-serif',
    // Enhanced luxury fonts
    playfair: 'Playfair Display, serif',
    cormorant: 'Cormorant Garamond, serif',
    crimson: 'Crimson Text, serif',
    // Enhanced bold fonts
    oswald: 'Oswald, sans-serif',
    montserrat: 'Montserrat, sans-serif',
    robotoCondensed: 'Roboto Condensed, sans-serif',
    // Enhanced creative fonts
    comfortaa: 'Comfortaa, sans-serif',
    nunito: 'Nunito, sans-serif',
    spaceGrotesk: 'Space Grotesk, sans-serif',
    // Enhanced classic fonts
    lora: 'Lora, serif',
    merriweather: 'Merriweather, serif',
  },
  
  // Production-optimized font sizes with better scaling
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
    '9xl': '8rem',      // 128px
  },
  
  // Enhanced font weights for better hierarchy
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Optimized line heights for readability
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Enhanced letter spacing for professional typography
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Enhanced border radius for modern design language
export const borderRadius = {
  none: '0',
  xs: '0.125rem',     // 2px
  sm: '0.25rem',      // 4px
  DEFAULT: '0.375rem', // 6px
  md: '0.5rem',       // 8px
  lg: '0.75rem',      // 12px
  xl: '1rem',         // 16px
  '2xl': '1.25rem',   // 20px
  '3xl': '1.5rem',    // 24px
  full: '9999px',     // Fully rounded
};

// Production-grade shadow system for depth and hierarchy
export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
  
  // Enhanced premium shadows for professional UI
  'premium-xs': '0 2px 4px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
  'premium-sm': '0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  'premium-md': '0 8px 16px -2px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.06)',
  'premium-lg': '0 20px 30px -8px rgba(0, 0, 0, 0.12), 0 10px 15px -3px rgba(0, 0, 0, 0.08)',
  'premium-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.18), 0 12px 25px -6px rgba(0, 0, 0, 0.1)',
  
  // Brand-specific shadows with color
  'brand-glow': '0 0 20px 4px rgba(139, 92, 246, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  'brand-card': '0 10px 30px -5px rgba(139, 92, 246, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  'brand-hover': '0 15px 35px -5px rgba(139, 92, 246, 0.2), 0 5px 15px -5px rgba(0, 0, 0, 0.1)',
};

// Enhanced z-index scale for proper layering
export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  60: '60',
  70: '70',
  80: '80',
  90: '90',
  100: '100',
  auto: 'auto',
  
  // Semantic z-indices for better organization
  base: '1',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modalBackdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
  toast: '1080',
};

// Enhanced transitions and animations for smooth interactions
export const transitions = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  
  timing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Enhanced easing curves for premium feel
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    snappy: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
  
  animation: {
    // Enhanced animations for production UI
    fadeIn: 'fadeIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fadeOut: 'fadeOut 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    scaleIn: 'scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    scaleOut: 'scaleOut 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    slideInRight: 'slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    slideOutRight: 'slideOutRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    
    // Premium animations
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
    float: 'float 6s ease-in-out infinite',
    glow: 'glow 2s ease-in-out infinite alternate',
    shimmer: 'shimmer 2.5s linear infinite',
  },
};

// Enhanced breakpoints for responsive design
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
};

// Media queries for responsive design
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  '3xl': `@media (min-width: ${breakpoints['3xl']})`,
};

// Enhanced theme variants for different sections and moods
export const themeVariants = {
  light: {
    background: colors.neutral[25],
    backgroundSecondary: colors.neutral[50],
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    textMuted: colors.neutral[500],
    border: colors.neutral[200],
    borderLight: colors.neutral[100],
    card: colors.neutral[50],
    cardHover: colors.neutral[100],
    overlay: 'rgba(255, 255, 255, 0.8)',
  },
  
  dark: {
    background: colors.neutral[900],
    backgroundSecondary: colors.neutral[800],
    text: colors.neutral[50],
    textSecondary: colors.neutral[300],
    textMuted: colors.neutral[400],
    border: colors.neutral[700],
    borderLight: colors.neutral[600],
    card: colors.neutral[800],
    cardHover: colors.neutral[700],
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  
  brand: {
    background: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.primary[500]} 100%)`,
    backgroundSecondary: colors.secondary[50],
    text: colors.neutral[50],
    textSecondary: colors.neutral[200],
    textMuted: colors.neutral[300],
    border: colors.secondary[300],
    borderLight: colors.secondary[200],
    card: 'rgba(255, 255, 255, 0.1)',
    cardHover: 'rgba(255, 255, 255, 0.2)',
    overlay: 'rgba(139, 92, 246, 0.1)',
  },
};

// Export all enhanced tokens
export const designTokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  breakpoints,
  mediaQueries,
  themeVariants,
};

export default designTokens;
