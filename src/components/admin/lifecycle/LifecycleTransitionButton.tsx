
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import { SiteLifecycleStage, LIFECYCLE_STAGE_CONFIG, SiteWithLifecycle } from '@/types/siteLifecycle';
import { useLifecycleManagement } from '@/hooks/useLifecycleManagement';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { validateLifecycleTransition, ValidationIssue } from '@/utils/lifecycleValidation';

interface LifecycleTransitionButtonProps {
  site: SiteWithLifecycle;
  targetStage: SiteLifecycleStage;
  onTransitionComplete?: () => void;
  size?: 'sm' | 'lg' | 'default';
  variant?: 'default' | 'outline' | 'ghost';
  requiresReason?: boolean;
}

export const LifecycleTransitionButton: React.FC<LifecycleTransitionButtonProps> = ({
  site,
  targetStage,
  onTransitionComplete,
  size = 'sm',
  variant = 'outline',
  requiresReason = false
}) => {
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [canProceedWithWarnings, setCanProceedWithWarnings] = useState(false);
  const [reason, setReason] = useState('');
  const { transitionSiteLifecycle, isLoading } = useLifecycleManagement();

  const { id: siteId, lifecycle_stage: currentStage } = site;

  const targetConfig = LIFECYCLE_STAGE_CONFIG[targetStage];
  const currentConfig = LIFECYCLE_STAGE_CONFIG[currentStage];

  const handleTransition = async () => {
    if (requiresReason && !reason.trim()) {
      return;
    }

    const result = await transitionSiteLifecycle(siteId, targetStage, reason || undefined);
    
    if (result.success) {
      setShowReasonDialog(false);
      setReason('');
      onTransitionComplete?.();
    }
  };
  
  const proceedAfterValidation = () => {
    setShowValidationDialog(false);
    if (requiresReason) {
        setShowReasonDialog(true);
    } else {
        handleTransition();
    }
  }

  const handleClick = () => {
    const validationResult = validateLifecycleTransition(site, targetStage);
    
    if (!validationResult.isValid) {
      setValidationIssues(validationResult.issues);
      setCanProceedWithWarnings(validationResult.canProceed);
      setShowValidationDialog(true);
      return;
    }

    if (requiresReason) {
      setShowReasonDialog(true);
    } else {
      handleTransition();
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isLoading}
        size={size}
        variant={variant}
        className="flex items-center gap-2"
      >
        <span>{targetConfig.icon}</span>
        <span>Move to {targetConfig.label}</span>
        <ArrowRight className="w-3 h-3" />
      </Button>

      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Confirm Stage Transition
            </DialogTitle>
            <DialogDescription>
              You are about to move this site from <strong>{currentConfig.label}</strong> to <strong>{targetConfig.label}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for transition (required)</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for this transition..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReasonDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleTransition}
              disabled={isLoading || (requiresReason && !reason.trim())}
            >
              {isLoading ? 'Processing...' : 'Confirm Transition'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Transition Requirements
            </DialogTitle>
            <DialogDescription>
              Please address the following items before moving to <strong>{targetConfig.label}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 py-4">
            {validationIssues.map((issue, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                {issue.severity === 'error' ? (
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                )}
                <span className={issue.severity === 'error' ? 'text-gray-800 font-medium' : 'text-gray-700'}>
                  {issue.message}
                </span>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowValidationDialog(false)}>
              Cancel
            </Button>
            {canProceedWithWarnings && (
              <Button
                onClick={proceedAfterValidation}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Proceed Anyway'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
