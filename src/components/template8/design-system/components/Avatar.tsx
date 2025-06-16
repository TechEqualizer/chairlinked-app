import React from 'react';
import { cn } from '@/lib/utils';
import { colors } from '../tokens';
import { User } from 'lucide-react';

/**
 * Avatar component props
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  fallback?: React.ReactNode;
  fallbackInitials?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  bordered?: boolean;
  borderColor?: string;
}

/**
 * Enhanced Avatar component with design system integration
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className, 
    src, 
    alt = 'Avatar',
    size = 'md',
    shape = 'circle',
    fallback,
    fallbackInitials,
    status,
    bordered = false,
    borderColor,
    ...props 
  }, ref) => {
    const [imgError, setImgError] = React.useState(false);
    
    // Size mapping
    const sizeMap = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl',
    };
    
    // Shape mapping
    const shapeMap = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-lg',
    };
    
    // Status color mapping
    const statusColorMap = {
      online: `bg-[${colors.success[500]}]`,
      offline: `bg-[${colors.neutral[400]}]`,
      away: `bg-[${colors.warning[500]}]`,
      busy: `bg-[${colors.error[500]}]`,
    };
    
    // Status size mapping
    const statusSizeMap = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-3.5 h-3.5',
      '2xl': 'w-4 h-4',
    };
    
    // Border styles
    const borderStyles = bordered 
      ? `border-2 ${borderColor ? `border-[${borderColor}]` : 'border-white'}` 
      : '';
    
    // Handle image load error
    const handleError = () => {
      setImgError(true);
    };
    
    // Generate initials from alt text
    const getInitials = () => {
      if (fallbackInitials) return fallbackInitials;
      
      if (!alt) return '';
      
      return alt
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden bg-gray-200',
          sizeMap[size],
          shapeMap[shape],
          borderStyles,
          className
        )}
        {...props}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleError}
          />
        ) : fallback ? (
          <div className="flex items-center justify-center w-full h-full">
            {fallback}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600 font-medium">
            {fallbackInitials ? (
              getInitials()
            ) : (
              <User className="w-1/2 h-1/2" />
            )}
          </div>
        )}
        
        {status && (
          <span 
            className={cn(
              'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
              statusColorMap[status],
              statusSizeMap[size]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

/**
 * AvatarGroup component props
 */
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: Array<Omit<AvatarProps, 'className' | 'ref'>>;
  max?: number;
  size?: AvatarProps['size'];
  spacing?: 'tight' | 'normal' | 'loose';
}

/**
 * AvatarGroup component for displaying multiple avatars
 */
export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ 
    className, 
    avatars, 
    max = 5,
    size = 'md',
    spacing = 'normal',
    ...props 
  }, ref) => {
    // Spacing mapping
    const spacingMap = {
      tight: '-mr-2',
      normal: '-mr-3',
      loose: '-mr-4',
    };
    
    // Visible avatars
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;
    
    return (
      <div
        ref={ref}
        className={cn('flex', className)}
        {...props}
      >
        {visibleAvatars.map((avatar, index) => (
          <div 
            key={index} 
            className={cn(
              index !== 0 && spacingMap[spacing],
              'relative inline-block'
            )}
          >
            <Avatar
              {...avatar}
              size={size}
              bordered
            />
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div 
            className={cn(
              spacingMap[spacing],
              'relative inline-flex items-center justify-center overflow-hidden bg-gray-200 font-medium text-gray-600',
              `rounded-full border-2 border-white`,
              size === 'xs' && 'w-6 h-6 text-xs',
              size === 'sm' && 'w-8 h-8 text-xs',
              size === 'md' && 'w-10 h-10 text-sm',
              size === 'lg' && 'w-12 h-12 text-base',
              size === 'xl' && 'w-16 h-16 text-lg',
              size === '2xl' && 'w-20 h-20 text-xl'
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';