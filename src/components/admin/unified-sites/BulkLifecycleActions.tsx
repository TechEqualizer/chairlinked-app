
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Move, ChevronDown } from 'lucide-react';
import { SiteLifecycleStage, LIFECYCLE_STAGE_CONFIG } from '@/types/siteLifecycle';
import { useLifecycleManagement } from '@/hooks/useLifecycleManagement';

interface BulkLifecycleActionsProps {
  selectedSiteIds: string[];
  onTransitionComplete: () => void;
}

export const BulkLifecycleActions: React.FC<BulkLifecycleActionsProps> = ({ selectedSiteIds, onTransitionComplete }) => {
  const { transitionMultipleSitesLifecycle, isLoading } = useLifecycleManagement();

  const handleBulkTransition = async (targetStage: SiteLifecycleStage) => {
    if (selectedSiteIds.length === 0 || isLoading) return;

    await transitionMultipleSitesLifecycle(selectedSiteIds, targetStage);
    onTransitionComplete();
  };

  const allStages = Object.keys(LIFECYCLE_STAGE_CONFIG) as SiteLifecycleStage[];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isLoading || selectedSiteIds.length === 0}>
          <Move className="w-4 h-4 mr-2" />
          <span>Change Stage ({selectedSiteIds.length})</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Move selected sites to...</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allStages.map(stage => (
          <DropdownMenuItem
            key={stage}
            onClick={() => handleBulkTransition(stage)}
            disabled={isLoading}
            className="flex items-center"
          >
            <span>{LIFECYCLE_STAGE_CONFIG[stage].icon}</span>
            <span className="ml-2">{LIFECYCLE_STAGE_CONFIG[stage].label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
