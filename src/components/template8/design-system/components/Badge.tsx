import React from 'react';
import { cn } from '@/lib/utils';
import { colors } from '../tokens';

/**
 * Badge component props
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'filled' | 'subtle';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'default' | 'full';
  withDot?: boolean;
  dotColor?: string;
}

/**
 * Enhanced Badge component with design system integration
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant = 'default', 
    color = 'primary',
    size = 'md',
    rounded = 'full',
    withDot = false,
    dotColor,
    children, 
    ...props 
  }, ref) => {
    // Color mapping
    const colorMap = {
      primary: {
        default: `bg-[${colors.primary[100]}] text-[${colors.primary[800]}]`,
        outline: `border border-[${colors.primary[500]}] text-[${colors.primary[500]}]`,
        filled: `bg-[${colors.primary[500]}] text-white`,
        subtle: `bg-[${colors.primary[50]}] text-[${colors.primary[700]}]`,
      },
      secondary: {
        default: `bg-[${colors.secondary[100]}] text-[${colors.secondary[800]}]`,
        outline: `border border-[${colors.secondary[500]}] text-[${colors.secondary[500]}]`,
        filled: `bg-[${colors.secondary[500]}] text-white`,
        subtle: `bg-[${colors.secondary[50]}] text-[${colors.secondary[700]}]`,
      },
      success: {
        default: `bg-[${colors.success[100]}] text-[${colors.success[800]}]`,
        outline: `border border-[${colors.success[500]}] text-[${colors.success[500]}]`,
        filled: `bg-[${colors.success[500]}] text-white`,
        subtle: `bg-[${colors.success[50]}] text-[${colors.success[700]}]`,
      },
      warning: {
        default: `bg-[${colors.warning[100]}] text-[${colors.warning[800]}]`,
        outline: `border border-[${colors.warning[500]}] text-[${colors.warning[500]}]`,
        filled: `bg-[${colors.warning[500]}] text-white`,
        subtle: `bg-[${colors.warning[50]}] text-[${colors.warning[700]}]`,
      },
      error: {
        default: `bg-[${colors.error[100]}] text-[${colors.error[800]}]`,
        outline: `border border-[${colors.error[500]}] text-[${colors.error[500]}]`,
        filled: `bg-[${colors.error[500]}] text-white`,
        subtle: `bg-[${colors.error[50]}] text-[${colors.error[700]}]`,
      },
      neutral: {
        default: `bg-[${colors.neutral[100]}] text-[${colors.neutral[800]}]`,
        outline: `border border-[${colors.neutral[500]}] text-[${colors.neutral[500]}]`,
        filled: `bg-[${colors.neutral[500]}] text-white`,
        subtle: `bg-[${colors.neutral[50]}] text-[${colors.neutral[700]}]`,
      },
    };
    
    // Size mapping
    const sizeMap = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-0.5',
      lg: 'text-base px-3 py-1',
    };
    
    // Rounded mapping
    const roundedMap = {
      default: 'rounded',
      full: 'rounded-full',
    };
    
    // Get dot color based on badge color if not specified
    const getDotColor = () => {
      if (dotColor) return dotColor;
      
      switch (color) {
        case 'primary': return colors.primary[500];
        case 'secondary': return colors.secondary[500];
        case 'success': return colors.success[500];
        case 'warning': return colors.warning[500];
        case 'error': return colors.error[500];
        default: return colors.neutral[500];
      }
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium',
          colorMap[color][variant],
          sizeMap[size],
          roundedMap[rounded],
          className
        )}
        {...props}
      >
        {withDot && (
          <span 
            className="w-2 h-2 rounded-full mr-1.5"
            style={{ backgroundColor: getDotColor() }}
          />
        )}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';