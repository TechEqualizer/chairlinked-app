
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { colors, shadows, borderRadius, transitions } from '../tokens';

/**
 * Enhanced Button variants with production-grade styling
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        primary: `
          bg-gradient-to-r from-[${colors.secondary[500]}] to-[${colors.secondary[600]}] 
          text-white border-0
          hover:from-[${colors.secondary[600]}] hover:to-[${colors.secondary[700]}]
          hover:shadow-lg hover:shadow-[${colors.secondary[500]}]/25
          active:scale-[0.98] active:shadow-md
          before:absolute before:inset-0 before:bg-gradient-to-r 
          before:from-white/20 before:to-transparent before:opacity-0 
          before:transition-opacity before:duration-300
          hover:before:opacity-100
        `,
        
        secondary: `
          bg-white text-[${colors.neutral[800]}] 
          border border-[${colors.neutral[200]}] 
          shadow-sm hover:shadow-md
          hover:bg-[${colors.neutral[50]}] hover:border-[${colors.neutral[300]}]
          active:scale-[0.98]
        `,
        
        outline: `
          border border-[${colors.secondary[300]}] bg-transparent 
          text-[${colors.secondary[600]}]
          hover:bg-[${colors.secondary[50]}] hover:border-[${colors.secondary[400]}]
          hover:text-[${colors.secondary[700]}]
          active:scale-[0.98]
        `,
        
        ghost: `
          bg-transparent text-[${colors.neutral[700]}]
          hover:bg-[${colors.neutral[100]}] hover:text-[${colors.neutral[900]}]
          active:scale-[0.98]
        `,
        
        link: `
          text-[${colors.secondary[600]}] underline-offset-4 
          hover:underline hover:text-[${colors.secondary[700]}]
          bg-transparent p-0 h-auto
        `,
        
        destructive: `
          bg-gradient-to-r from-[${colors.error[500]}] to-[${colors.error[600]}] 
          text-white border-0
          hover:from-[${colors.error[600]}] hover:to-[${colors.error[700]}]
          hover:shadow-lg hover:shadow-[${colors.error[500]}]/25
          active:scale-[0.98]
        `,
        
        success: `
          bg-gradient-to-r from-[${colors.success[500]}] to-[${colors.success[600]}] 
          text-white border-0
          hover:from-[${colors.success[600]}] hover:to-[${colors.success[700]}]
          hover:shadow-lg hover:shadow-[${colors.success[500]}]/25
          active:scale-[0.98]
        `,
        
        premium: `
          bg-gradient-to-r from-[${colors.secondary[500]}] via-[${colors.primary[500]}] to-[${colors.secondary[600]}]
          text-white border-0 relative
          hover:shadow-xl hover:shadow-[${colors.secondary[500]}]/30
          active:scale-[0.98]
          before:absolute before:inset-0 before:bg-gradient-to-r 
          before:from-white/30 before:via-white/10 before:to-white/30 
          before:opacity-0 before:transition-opacity before:duration-500
          hover:before:opacity-100
        `,
      },
      
      size: {
        xs: "h-7 px-2.5 text-xs rounded-md",
        sm: "h-9 px-3 text-sm rounded-md",
        md: "h-10 px-4 py-2 text-sm rounded-lg",
        lg: "h-12 px-6 text-base rounded-lg",
        xl: "h-14 px-8 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-lg p-0",
        "icon-sm": "h-8 w-8 rounded-md p-0",
        "icon-lg": "h-12 w-12 rounded-lg p-0",
      },
      
      elevation: {
        flat: "",
        raised: "shadow-sm hover:shadow-md",
        floating: "shadow-md hover:shadow-lg",
        lifted: "shadow-lg hover:shadow-xl",
      },
    },
    
    defaultVariants: {
      variant: "primary",
      size: "md",
      elevation: "flat",
    },
  }
);

/**
 * Enhanced Button props with additional features
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  loadingText?: string;
}

/**
 * Production-ready Button component with enhanced styling and features
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    elevation,
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    loadingText,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, elevation }),
          fullWidth && "w-full",
          isLoading && "cursor-not-allowed",
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Left icon */}
        {!isLoading && leftIcon && (
          <span className="flex items-center justify-center">
            {leftIcon}
          </span>
        )}
        
        {/* Button content */}
        <span className="relative z-10">
          {isLoading && loadingText ? loadingText : children}
        </span>
        
        {/* Right icon */}
        {!isLoading && rightIcon && (
          <span className="flex items-center justify-center">
            {rightIcon}
          </span>
        )}
        
        {/* Premium variant shimmer effect */}
        {variant === 'premium' && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[shimmer_2s_ease-in-out_infinite]" />
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
