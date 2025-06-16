import React from 'react';
import { cn } from '@/lib/utils';
import { colors } from '../tokens';

/**
 * Divider component props
 */
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: 'thin' | 'normal' | 'thick';
  color?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  label?: React.ReactNode;
  labelPosition?: 'start' | 'center' | 'end';
  labelBackground?: string;
}

/**
 * Enhanced Divider component with design system integration
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ 
    className, 
    orientation = 'horizontal', 
    variant = 'solid',
    thickness = 'normal',
    color,
    spacing = 'md',
    label,
    labelPosition = 'center',
    labelBackground = 'white',
    ...props 
  }, ref) => {
    // Variant mapping
    const variantMap = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    };
    
    // Thickness mapping
    const thicknessMap = {
      thin: orientation === 'horizontal' ? 'border-t' : 'border-l',
      normal: orientation === 'horizontal' ? 'border-t-2' : 'border-l-2',
      thick: orientation === 'horizontal' ? 'border-t-4' : 'border-l-4',
    };
    
    // Spacing mapping
    const spacingMap = {
      none: 'my-0',
      sm: 'my-2',
      md: 'my-4',
      lg: 'my-8',
    };
    
    // Label position mapping
    const labelPositionMap = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    };
    
    // Default color
    const dividerColor = color || colors.neutral[200];
    
    // Simple divider without label
    if (!label) {
      return (
        <div
          ref={ref}
          className={cn(
            orientation === 'horizontal' ? spacingMap[spacing] : 'mx-2 h-full',
            variantMap[variant],
            thicknessMap[thickness],
            className
          )}
          style={{ borderColor: dividerColor }}
          {...props}
        />
      );
    }
    
    // Divider with label
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          orientation === 'horizontal' ? spacingMap[spacing] : 'h-full',
          labelPositionMap[labelPosition],
          className
        )}
        {...props}
      >
        <div 
          className={cn(
            'flex-grow',
            variantMap[variant],
            thicknessMap[thickness]
          )}
          style={{ borderColor: dividerColor }}
        />
        
        <div 
          className={cn(
            'px-2 text-sm font-medium',
            orientation === 'horizontal' ? '-mt-2.5' : 'my-2 -ml-2.5'
          )}
          style={{ backgroundColor: labelBackground }}
        >
          {label}
        </div>
        
        <div 
          className={cn(
            'flex-grow',
            variantMap[variant],
            thicknessMap[thickness]
          )}
          style={{ borderColor: dividerColor }}
        />
      </div>
    );
  }
);

Divider.displayName = 'Divider';