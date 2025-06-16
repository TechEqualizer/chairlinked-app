
import { SiteWithLifecycle, SiteLifecycleStage } from '@/types/siteLifecycle';

export interface ValidationIssue {
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  canProceed: boolean;
  issues: ValidationIssue[];
}

/**
 * Validates if a site is ready to be moved to the 'ready_to_share' stage.
 */
export const validateSiteForReadyToShare = (site: SiteWithLifecycle): ValidationResult => {
  const issues: ValidationIssue[] = [];

  if (site.site_type !== 'demo') {
    issues.push({ message: 'Only demo sites can be marked as "Ready to Share".', severity: 'error' });
  }

  if (!site.business_name) {
    issues.push({ message: 'Business name is missing.', severity: 'error' });
  }

  if (!site.site_slug) {
    issues.push({ message: 'Site slug is missing.', severity: 'error' });
  }
  
  if (!site.generated_config || Object.keys(site.generated_config).length === 0) {
      issues.push({ message: 'Site configuration is missing or empty. Please edit the site to generate it.', severity: 'error' });
  }
  
  if (!site.prospect_name && !site.prospect_email) {
    issues.push({ message: 'It is recommended to assign a prospect before sharing.', severity: 'warning' });
  }

  const hasErrors = issues.some(i => i.severity === 'error');

  return {
    isValid: issues.length === 0,
    canProceed: !hasErrors,
    issues,
  };
};

/**
 * A generic validator that dispatches to specific validation functions based on target stage.
 */
export const validateLifecycleTransition = (
  site: SiteWithLifecycle, 
  targetStage: SiteLifecycleStage
): ValidationResult => {
  switch (targetStage) {
    case 'ready_to_share':
      return validateSiteForReadyToShare(site);
    default:
      return { isValid: true, canProceed: true, issues: [] }; 
  }
};
