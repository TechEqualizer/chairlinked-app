import React from 'react';
import { cn } from '@/lib/utils';
import { colors } from '../tokens';

/**
 * Spinner component props
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'border' | 'dots' | 'grow';
  color?: string;
  thickness?: 'thin' | 'normal' | 'thick';
  label?: string;
  labelPosition?: 'top' | 'right' | 'bottom' | 'left';
  centered?: boolean;
}

/**
 * Enhanced Spinner component with design system integration
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ 
    className, 
    size = 'md', 
    variant = 'border',
    color,
    thickness = 'normal',
    label,
    labelPosition = 'bottom',
    centered = false,
    ...props 
  }, ref) => {
    // Size mapping
    const sizeMap = {
      xs: 'w-4 h-4',
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };
    
    // Thickness mapping
    const thicknessMap = {
      thin: 'border',
      normal: 'border-2',
      thick: 'border-4',
    };
    
    // Label position mapping
    const labelPositionMap = {
      top: 'flex-col-reverse',
      right: 'flex-row',
      bottom: 'flex-col',
      left: 'flex-row-reverse',
    };
    
    // Label spacing mapping
    const labelSpacingMap = {
      top: 'mb-2',
      right: 'ml-2',
      bottom: 'mt-2',
      left: 'mr-2',
    };
    
    // Default color
    const spinnerColor = color || colors.secondary[500];
    
    // Render spinner based on variant
    const renderSpinner = () => {
      switch (variant) {
        case 'border':
          return (
            <div 
              className={cn(
                sizeMap[size],
                thicknessMap[thickness],
                'rounded-full border-gray-200 animate-spin',
                className
              )}
              style={{ 
                borderTopColor: spinnerColor,
                borderRightColor: spinnerColor,
                opacity: 0.75
              }}
            />
          );
        
        case 'dots':
          return (
            <div className={cn('flex space-x-1', className)}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-full',
                    size === 'xs' && 'w-1 h-1',
                    size === 'sm' && 'w-1.5 h-1.5',
                    size === 'md' && 'w-2 h-2',
                    size === 'lg' && 'w-2.5 h-2.5',
                    size === 'xl' && 'w-3 h-3',
                  )}
                  style={{
                    backgroundColor: spinnerColor,
                    animation: `bounce 1.4s infinite ease-in-out both`,
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
            </div>
          );
        
        case 'grow':
          return (
            <div className={cn('flex space-x-1', className)}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-full',
                    size === 'xs' && 'w-1 h-1',
                    size === 'sm' && 'w-1.5 h-1.5',
                    size === 'md' && 'w-2 h-2',
                    size === 'lg' && 'w-2.5 h-2.5',
                    size === 'xl' && 'w-3 h-3',
                  )}
                  style={{
                    backgroundColor: spinnerColor,
                    animation: `grow 1.5s infinite ease-in-out both`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          );
        
        default:
          return null;
      }
    };
    
    // Wrapper with label
    const spinnerWithLabel = (
      <div 
        className={cn(
          'inline-flex',
          labelPositionMap[labelPosition],
          'items-center',
          centered && 'justify-center',
        )}
      >
        {renderSpinner()}
        {label && (
          <span 
            className={cn(
              'text-sm font-medium',
              labelSpacingMap[labelPosition]
            )}
            style={{ color: color || 'inherit' }}
          >
            {label}
          </span>
        )}
      </div>
    );
    
    // Centered wrapper
    if (centered) {
      return (
        <div 
          ref={ref} 
          className="flex items-center justify-center w-full h-full"
          {...props}
        >
          {spinnerWithLabel}
        </div>
      );
    }
    
    return (
      <div ref={ref} {...props}>
        {spinnerWithLabel}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;