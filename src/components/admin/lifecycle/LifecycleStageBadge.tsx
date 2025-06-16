
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SiteLifecycleStage, LIFECYCLE_STAGE_CONFIG } from '@/types/siteLifecycle';

interface LifecycleStageBadgeProps {
  stage: SiteLifecycleStage;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LifecycleStageBadge: React.FC<LifecycleStageBadgeProps> = ({
  stage,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  const config = LIFECYCLE_STAGE_CONFIG[stage];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      className={`${config.color} ${sizeClasses[size]} ${className} font-medium border-0`}
      title={config.description}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
};
