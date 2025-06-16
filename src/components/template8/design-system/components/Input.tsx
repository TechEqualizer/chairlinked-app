
import React from 'react';
import { cn } from '@/lib/utils';
import { colors, borderRadius } from '../tokens';

/**
 * Input component props
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'filled' | 'outline' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Enhanced Input component with design system integration
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default',
    inputSize = 'md',
    error = false,
    errorMessage,
    leftIcon,
    rightIcon,
    fullWidth = false,
    type = 'text',
    disabled,
    ...props 
  }, ref) => {
    // Variant styles
    const variantStyles = {
      default: `bg-white border border-[${colors.neutral[300]}] focus:border-[${colors.secondary[500]}] focus:ring-[${colors.secondary[500]}]`,
      filled: `bg-[${colors.neutral[100]}] border border-[${colors.neutral[200]}] focus:bg-white focus:border-[${colors.secondary[500]}] focus:ring-[${colors.secondary[500]}]`,
      outline: `bg-transparent border border-[${colors.neutral[300]}] focus:border-[${colors.secondary[500]}] focus:ring-[${colors.secondary[500]}]`,
      ghost: `bg-transparent border-none shadow-none focus:ring-[${colors.secondary[500]}]`,
    };
    
    // Size styles
    const sizeStyles = {
      sm: 'h-8 text-sm px-3 py-1',
      md: 'h-10 text-base px-4 py-2',
      lg: 'h-12 text-lg px-5 py-3',
    };
    
    // Error styles
    const errorStyles = error 
      ? `border-[${colors.error[500]}] focus:border-[${colors.error[500]}] focus:ring-[${colors.error[500]}]` 
      : '';
    
    // Icon padding adjustments
    const leftIconPadding = leftIcon ? 'pl-10' : '';
    const rightIconPadding = rightIcon ? 'pr-10' : '';
    
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            'rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
            variantStyles[variant],
            sizeStyles[inputSize],
            errorStyles,
            leftIconPadding,
            rightIconPadding,
            fullWidth && 'w-full',
            className
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            {rightIcon}
          </div>
        )}
        
        {error && errorMessage && (
          <p className={`mt-1 text-sm text-[${colors.error[500]}]`}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea component props
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'outline' | 'ghost';
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
}

/**
 * Enhanced Textarea component with design system integration
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant = 'default',
    error = false,
    errorMessage,
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    // Variant styles
    const variantStyles = {
      default: `bg-white border border-[${colors.neutral[300]}] focus:border-[${colors.secondary[500]}] focus:ring-[${colors.secondary[500]}]`,
      filled: `bg-[${colors.neutral[100]}] border border-[${colors.neutral[200]}] focus:bg-white focus:border-[${colors.secondary[500]}] focus:ring-[${colors.secondary[500]}]`,
      outline: `bg-transparent border border-[${colors.neutral[300]}] focus:border-[${colors.secondary[500]}] focus:ring-[${colors.secondary[500]}]`,
      ghost: `bg-transparent border-none shadow-none focus:ring-[${colors.secondary[500]}]`,
    };
    
    // Error styles
    const errorStyles = error 
      ? `border-[${colors.error[500]}] focus:border-[${colors.error[500]}] focus:ring-[${colors.error[500]}]` 
      : '';
    
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        <textarea
          className={cn(
            'rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[80px] px-4 py-2',
            variantStyles[variant],
            errorStyles,
            fullWidth && 'w-full',
            className
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        
        {error && errorMessage && (
          <p className={`mt-1 text-sm text-[${colors.error[500]}]`}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
