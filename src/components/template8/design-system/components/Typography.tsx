
import React from 'react';
import { cn } from '@/lib/utils';
import { typography, colors } from '../tokens';

/**
 * Enhanced Heading component with production-grade styling
 */
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  font?: 'sans' | 'serif' | 'mono' | keyof typeof typography.fontFamily;
  color?: string;
  align?: 'left' | 'center' | 'right';
  tracking?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
  gradient?: boolean;
  animated?: boolean;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ 
    as: Component = 'h2', 
    size = 'lg', 
    weight = 'bold',
    font = 'sans',
    color,
    align = 'left',
    tracking = 'normal',
    gradient = false,
    animated = false,
    className, 
    children, 
    ...props 
  }, ref) => {
    // Enhanced size mapping with better hierarchy
    const sizeMap = {
      xs: 'text-lg sm:text-xl',
      sm: 'text-xl sm:text-2xl',
      md: 'text-2xl sm:text-3xl',
      lg: 'text-3xl sm:text-4xl lg:text-5xl',
      xl: 'text-4xl sm:text-5xl lg:text-6xl',
      '2xl': 'text-5xl sm:text-6xl lg:text-7xl',
      '3xl': 'text-6xl sm:text-7xl lg:text-8xl',
      '4xl': 'text-7xl sm:text-8xl lg:text-9xl',
      '5xl': 'text-8xl sm:text-9xl',
    };
    
    // Enhanced weight mapping
    const weightMap = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    };
    
    // Enhanced font family mapping
    const fontMap = {
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono',
      inter: 'font-inter',
      poppins: 'font-poppins',
      outfit: 'font-outfit',
      playfair: 'font-playfair',
      montserrat: 'font-montserrat',
    };
    
    // Text alignment
    const alignMap = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };
    
    // Letter spacing
    const trackingMap = {
      tighter: 'tracking-tighter',
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider',
      widest: 'tracking-widest',
    };
    
    // Gradient text styles
    const gradientClass = gradient ? 
      'bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent' : '';
    
    // Animation classes
    const animationClass = animated ? 
      'animate-fade-in transition-all duration-700 ease-out' : '';
    
    return (
      <Component
        ref={ref}
        className={cn(
          sizeMap[size],
          weightMap[weight],
          fontMap[font as keyof typeof fontMap] || 'font-sans',
          alignMap[align],
          trackingMap[tracking],
          'leading-tight',
          gradientClass,
          animationClass,
          className
        )}
        style={{ 
          color: gradient ? undefined : (color || 'inherit'),
        }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

/**
 * Enhanced Text component with production-grade styling
 */
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  font?: 'sans' | 'serif' | 'mono' | keyof typeof typography.fontFamily;
  color?: string;
  align?: 'left' | 'center' | 'right';
  tracking?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
  leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  truncate?: boolean;
  clamp?: number;
  muted?: boolean;
  animated?: boolean;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ 
    as: Component = 'p', 
    size = 'md', 
    weight = 'normal',
    font = 'sans',
    color,
    align = 'left',
    tracking = 'normal',
    leading = 'normal',
    truncate = false,
    clamp,
    muted = false,
    animated = false,
    className, 
    children, 
    ...props 
  }, ref) => {
    // Enhanced size mapping
    const sizeMap = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    };
    
    // Weight mapping
    const weightMap = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };
    
    // Enhanced font family mapping
    const fontMap = {
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono',
      inter: 'font-inter',
      poppins: 'font-poppins',
      outfit: 'font-outfit',
      playfair: 'font-playfair',
    };
    
    // Text alignment
    const alignMap = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };
    
    // Letter spacing
    const trackingMap = {
      tighter: 'tracking-tighter',
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider',
      widest: 'tracking-widest',
    };
    
    // Line height
    const leadingMap = {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    };
    
    // Text styles
    const truncateClasses = truncate ? 'truncate' : '';
    const clampClasses = clamp ? `line-clamp-${clamp}` : '';
    const mutedClasses = muted ? 'text-gray-600' : '';
    const animationClass = animated ? 'animate-fade-in transition-all duration-500 ease-out' : '';
    
    return (
      <Component
        ref={ref}
        className={cn(
          sizeMap[size],
          weightMap[weight],
          fontMap[font as keyof typeof fontMap] || 'font-sans',
          alignMap[align],
          trackingMap[tracking],
          leadingMap[leading],
          truncateClasses,
          clampClasses,
          mutedClasses,
          animationClass,
          className
        )}
        style={{ color: color || 'inherit' }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

/**
 * Enhanced Label component with production-grade styling
 */
export interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  size?: 'xs' | 'sm' | 'md';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  required?: boolean;
  htmlFor?: string;
  animated?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ 
    size = 'sm', 
    weight = 'medium',
    required = false,
    animated = false,
    className, 
    children,
    ...props 
  }, ref) => {
    // Size mapping
    const sizeMap = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
    };
    
    // Weight mapping
    const weightMap = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };
    
    const animationClass = animated ? 'transition-colors duration-200' : '';
    
    return (
      <label
        ref={ref}
        className={cn(
          sizeMap[size],
          weightMap[weight],
          'block text-gray-700 hover:text-gray-900',
          animationClass,
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-500 font-medium">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
