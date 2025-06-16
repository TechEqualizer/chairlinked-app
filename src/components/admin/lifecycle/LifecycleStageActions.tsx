import React from 'react';
import { SiteLifecycleStage, SiteWithLifecycle } from '@/types/siteLifecycle';
import { LifecycleTransitionButton } from './LifecycleTransitionButton';

interface LifecycleStageActionsProps {
  site: SiteWithLifecycle;
  onTransitionComplete?: () => void;
  isAdmin?: boolean;
}

export const LifecycleStageActions: React.FC<LifecycleStageActionsProps> = ({
  site,
  onTransitionComplete,
  isAdmin = false
}) => {
  const { lifecycle_stage: currentStage } = site;

  const getAvailableTransitions = (stage: SiteLifecycleStage): SiteLifecycleStage[] => {
    switch (stage) {
      case 'draft':
        return ['ready_to_share'];
      case 'ready_to_share':
        return ['shared'];
      case 'shared':
        return ['claimed'];
      case 'claimed':
        return ['converting'];
      case 'converting':
        return ['customer_controlled', 'claimed']; // Allow rollback
      case 'customer_controlled':
        return ['live_published'];
      case 'live_published':
        return []; // Final state
      default:
        return [];
    }
  };

  const availableTransitions = getAvailableTransitions(currentStage);

  // Admin users can make any transition (with reason required)
  const adminTransitions: SiteLifecycleStage[] = isAdmin ? [
    'draft' as SiteLifecycleStage,
    'ready_to_share' as SiteLifecycleStage,
    'shared' as SiteLifecycleStage,
    'claimed' as SiteLifecycleStage,
    'converting' as SiteLifecycleStage,
    'customer_controlled' as SiteLifecycleStage,
    'live_published' as SiteLifecycleStage
  ].filter(stage => stage !== currentStage) : [];

  if (availableTransitions.length === 0 && adminTransitions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* Standard transitions */}
      {availableTransitions.map((targetStage) => (
        <LifecycleTransitionButton
          key={targetStage}
          site={site}
          targetStage={targetStage}
          onTransitionComplete={onTransitionComplete}
          size="sm"
        />
      ))}
      
      {/* Admin override transitions */}
      {isAdmin && adminTransitions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-l-2 border-amber-300 pl-2 ml-2">
          <span className="text-xs text-amber-600 font-medium self-center">Admin Override:</span>
          {adminTransitions.slice(0, 3).map((targetStage) => (
            <LifecycleTransitionButton
              key={`admin-${targetStage}`}
              site={site}
              targetStage={targetStage}
              onTransitionComplete={onTransitionComplete}
              size="sm"
              variant="ghost"
              requiresReason={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
