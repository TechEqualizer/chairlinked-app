import React from 'react';
import { cn } from '@/lib/utils';
import { colors, shadows, borderRadius } from '../tokens';

/**
 * Card component props
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'filled' | 'glass';
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  isHoverable?: boolean;
  isInteractive?: boolean;
  noPadding?: boolean;
}

/**
 * Enhanced Card component with design system integration
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    elevation = 'md',
    isHoverable = false,
    isInteractive = false,
    noPadding = false,
    children, 
    ...props 
  }, ref) => {
    // Variant styles
    const variantStyles = {
      default: `bg-white border border-[${colors.neutral[200]}]`,
      outline: `bg-transparent border border-[${colors.neutral[200]}]`,
      filled: `bg-[${colors.neutral[100]}] border border-[${colors.neutral[200]}]`,
      glass: `bg-white/80 backdrop-blur-sm border border-white/20`,
    };
    
    // Elevation styles
    const elevationStyles = {
      none: '',
      sm: `shadow-sm`,
      md: `shadow`,
      lg: `shadow-lg`,
      xl: `shadow-xl`,
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          `rounded-lg overflow-hidden ${!noPadding ? 'p-6' : ''}`,
          variantStyles[variant],
          elevationStyles[elevation],
          isHoverable && `transition-all duration-200 hover:shadow-lg`,
          isInteractive && `cursor-pointer transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header component props
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  noDivider?: boolean;
}

/**
 * Card Header component
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, noDivider = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5',
        !noDivider && 'pb-4 mb-4 border-b border-gray-200',
        className
      )}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Title component
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

/**
 * Card Description component
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

/**
 * Card Content component
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));

CardContent.displayName = 'CardContent';

/**
 * Card Footer component
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 mt-4 border-t border-gray-200', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };