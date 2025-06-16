import React from 'react';
import { cn } from '@/lib/utils';
import { colors } from '../tokens';

/**
 * GlassMorphism component props
 */
export interface GlassMorphismProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark' | 'colored';
  intensity?: 'low' | 'medium' | 'high';
  borderStyle?: 'none' | 'thin' | 'medium' | 'thick';
  blurAmount?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  isInteractive?: boolean;
}

/**
 * Enhanced GlassMorphism component with design system integration
 * 
 * This component creates a glass-like effect with customizable
 * blur, opacity, and border styles.
 */
export const GlassMorphism = React.forwardRef<HTMLDivElement, GlassMorphismProps>(
  ({ 
    className, 
    variant = 'light', 
    intensity = 'medium',
    borderStyle = 'thin',
    blurAmount = 'md',
    color,
    isInteractive = false,
    children, 
    ...props 
  }, ref) => {
    // Background opacity based on intensity
    const intensityMap = {
      low: {
        light: 'bg-white/30',
        dark: 'bg-black/30',
        colored: color ? `bg-[${color}]/30` : `bg-[${colors.secondary[500]}]/30`,
      },
      medium: {
        light: 'bg-white/60',
        dark: 'bg-black/60',
        colored: color ? `bg-[${color}]/60` : `bg-[${colors.secondary[500]}]/60`,
      },
      high: {
        light: 'bg-white/80',
        dark: 'bg-black/80',
        colored: color ? `bg-[${color}]/80` : `bg-[${colors.secondary[500]}]/80`,
      },
    };
    
    // Border styles
    const borderMap = {
      none: 'border-0',
      thin: variant === 'light' ? 'border border-white/20' : 'border border-black/20',
      medium: variant === 'light' ? 'border-2 border-white/20' : 'border-2 border-black/20',
      thick: variant === 'light' ? 'border-4 border-white/20' : 'border-4 border-black/20',
    };
    
    // Blur amount
    const blurMap = {
      none: '',
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
    };
    
    // Interactive states
    const interactiveClasses = isInteractive 
      ? 'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer' 
      : '';
    
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl',
          intensityMap[intensity][variant],
          borderMap[borderStyle],
          blurMap[blurAmount],
          interactiveClasses,
          className
        )}
        style={color && variant === 'colored' ? { 
          backgroundColor: `${color}${intensity === 'low' ? '4D' : intensity === 'medium' ? '99' : 'CC'}` 
        } : {}}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassMorphism.displayName = 'GlassMorphism';

/**
 * GlassCard component props
 */
export interface GlassCardProps extends GlassMorphismProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * GlassCard component - A card with glass morphism effects
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    padding = 'md',
    elevation = 'md',
    children,
    ...props 
  }, ref) => {
    // Padding mapping
    const paddingMap = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-7',
      xl: 'p-9',
    };
    
    // Elevation mapping
    const elevationMap = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    };
    
    return (
      <GlassMorphism
        ref={ref}
        className={cn(
          paddingMap[padding],
          elevationMap[elevation],
          className
        )}
        {...props}
      >
        {children}
      </GlassMorphism>
    );
  }
);

GlassCard.displayName = 'GlassCard';