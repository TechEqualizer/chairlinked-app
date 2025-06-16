
// Enhanced Design System Tokens for Template 8
export const enhancedDesignTokens = {
  // Enhanced Spacing Scale (more granular)
  spacing: {
    '0': '0px',
    '1': '4px',
    '1.5': '6px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '20px',
    '6': '24px',
    '8': '32px',
    '10': '40px',
    '12': '48px',
    '16': '64px',
    '20': '80px',
    '24': '96px',
    '32': '128px',
  },

  // Section-specific spacing
  sections: {
    padding: {
      xs: '16px',
      sm: '24px',
      md: '32px',
      lg: '48px',
      xl: '64px',
      '2xl': '80px',
    },
    margin: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
    },
  },

  // Enhanced Typography Scale
  typography: {
    sizes: {
      'xs': '0.75rem',     // 12px
      'sm': '0.875rem',    // 14px
      'base': '1rem',      // 16px
      'lg': '1.125rem',    // 18px
      'xl': '1.25rem',     // 20px
      '2xl': '1.5rem',     // 24px
      '3xl': '1.875rem',   // 30px
      '4xl': '2.25rem',    // 36px
      '5xl': '3rem',       // 48px
      '6xl': '3.75rem',    // 60px
    },
    lineHeights: {
      none: '1',
      tight: '1.2',
      snug: '1.4',
      normal: '1.5',
      relaxed: '1.6',
      loose: '1.8',
    },
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  // Component Sizes
  components: {
    button: {
      xs: { height: '32px', padding: '8px 12px', fontSize: '0.75rem' },
      sm: { height: '36px', padding: '10px 16px', fontSize: '0.875rem' },
      md: { height: '40px', padding: '12px 20px', fontSize: '1rem' },
      lg: { height: '48px', padding: '16px 24px', fontSize: '1.125rem' },
      xl: { height: '56px', padding: '20px 32px', fontSize: '1.25rem' },
    },
    input: {
      xs: { height: '32px', padding: '8px 12px', fontSize: '0.75rem' },
      sm: { height: '36px', padding: '10px 12px', fontSize: '0.875rem' },
      md: { height: '40px', padding: '12px 16px', fontSize: '1rem' },
      lg: { height: '48px', padding: '16px 20px', fontSize: '1.125rem' },
    },
    panel: {
      width: {
        sm: '320px',
        md: '384px',
        lg: '448px',
        xl: '512px',
      },
    },
  },

  // Enhanced Icon Sizes
  icons: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  // Z-Index Scale
  zIndex: {
    base: 1,
    dropdown: 10,
    sticky: 20,
    modal: 30,
    popover: 40,
    overlay: 50,
    tooltip: 60,
    toast: 70,
  },

  // Enhanced Border Radius
  radius: {
    none: '0px',
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },

  // Enhanced Shadow System
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Dark theme shadows
  shadowsDark: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.6)',
  },

  // Touch Targets (WCAG AA)
  touchTarget: {
    minimum: '44px',
    comfortable: '48px',
    large: '56px',
  },

  // Animation Timing
  transitions: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },

  // Focus Ring
  focusRing: {
    width: '2px',
    offset: '2px',
    color: 'rgb(59 130 246)',
    style: 'solid',
  },
};

export type EnhancedDesignTokens = typeof enhancedDesignTokens;
