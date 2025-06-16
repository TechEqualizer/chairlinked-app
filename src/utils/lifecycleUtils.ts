
import { SiteLifecycleStage } from '@/types/siteLifecycle';

/**
 * Determines if a site should be publicly accessible based on its lifecycle stage.
 * @param stage The site's current lifecycle stage.
 * @param siteType The type of site, 'demo' or 'live'.
 * @param isProductionPreview A flag to bypass restrictions for admin previews.
 * @returns True if the site is accessible, false otherwise.
 */
export const isSitePubliclyAccessible = (
  stage: SiteLifecycleStage | null, 
  siteType: 'demo' | 'live',
  isProductionPreview: boolean
): boolean => {
  if (isProductionPreview) {
    return true; // Admins can preview any stage
  }
  
  if (!stage) {
    return false; // No stage means not accessible
  }

  if (siteType === 'demo') {
    const allowedDemoStages: SiteLifecycleStage[] = [
      'ready_to_share',
      'shared',
      'claimed',
      'converting',
      'customer_controlled',
      'live_published'
    ];
    return allowedDemoStages.includes(stage);
  } else { // live site
    const allowedLiveStages: SiteLifecycleStage[] = ['live_published', 'customer_controlled'];
    return allowedLiveStages.includes(stage);
  }
};

/**
 * Determines if the special Demo UI (banner, claim button, etc.) should be active.
 * The demo UI is shown for demo sites that are in an appropriate, active state.
 * @param stage The site's current lifecycle stage.
 * @param siteType The type of site.
 * @returns True if the demo wrapper UI should be shown, false otherwise.
 */
export const isDemoUIActive = (
  stage: SiteLifecycleStage | null,
  siteType: string
): boolean => {
  if (siteType !== 'demo' || !stage) {
    return false;
  }

  // Demo UI is active during the stages where it's being presented to a prospect.
  const activeDemoStages: SiteLifecycleStage[] = [
    'ready_to_share',
    'shared',
    'claimed',
    'converting'
  ];

  return activeDemoStages.includes(stage);
};
