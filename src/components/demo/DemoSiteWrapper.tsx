import React, { useEffect } from 'react';
import { DemoClaimButton } from './DemoClaimButton';
import { DemoStatusBanner } from './DemoStatusBanner';
import { useDemoStatus } from '@/hooks/useDemoStatus';
import { useTrafficTracking } from '@/hooks/useTrafficTracking';
import { useButtonTracking } from '@/hooks/useButtonTracking';
import { SiteLifecycleStage } from '@/types/siteLifecycle';
import { isDemoUIActive } from '@/utils/lifecycleUtils';

interface DemoSiteWrapperProps {
  children: React.ReactNode;
  siteData: {
    id: string;
    business_name: string;
    demo_expires_at: string | null;
    site_type: string;
    demo_view_count?: number;
    lifecycle_stage: SiteLifecycleStage | null;
  };
}

export const DemoSiteWrapper: React.FC<DemoSiteWrapperProps> = ({
  children,
  siteData
}) => {
  const demoStatus = useDemoStatus(siteData.demo_expires_at);
  const { trackButtonClick } = useButtonTracking();

  // Track traffic for this site
  useTrafficTracking({
    siteId: siteData.id,
    siteType: siteData.site_type
  });

  console.log('[DemoSiteWrapper] Wrapper data:', {
    siteType: siteData.site_type,
    lifecycleStage: siteData.lifecycle_stage,
    expiresAt: siteData.demo_expires_at,
    hasDemoStatus: !!demoStatus,
    businessName: siteData.business_name,
    demoStatus: demoStatus
  });

  // Set up global click tracking for this site
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const button = target.closest('button, a[role="button"], [data-track-click]');
      
      if (button) {
        const buttonText = button.textContent?.trim() || '';
        const section = button.closest('[data-section]')?.getAttribute('data-section') || 
                      button.closest('header, nav, main, footer')?.tagName.toLowerCase() || 
                      'unknown';
        
        // Determine button type based on context
        let buttonType: 'cta' | 'social' | 'navigation' | 'claim' | 'contact' | 'booking' = 'cta';
        
        if (buttonText.toLowerCase().includes('claim') || button.getAttribute('data-button-type') === 'claim') {
          buttonType = 'claim';
        } else if (buttonText.toLowerCase().includes('book') || buttonText.toLowerCase().includes('appointment')) {
          buttonType = 'booking';
        } else if (buttonText.toLowerCase().includes('contact') || buttonText.toLowerCase().includes('call')) {
          buttonType = 'contact';
        } else if (button.closest('nav') || buttonText.toLowerCase().includes('menu')) {
          buttonType = 'navigation';
        } else if (button.closest('[class*="social"]') || button.querySelector('svg[class*="social"]')) {
          buttonType = 'social';
        }

        trackButtonClick({
          siteId: siteData.id,
          buttonType,
          buttonLabel: buttonText,
          section
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [siteData.id, trackButtonClick]);

  // CRITICAL: Only show demo features for actual demo sites in an active demo stage.
  if (!isDemoUIActive(siteData.lifecycle_stage, siteData.site_type)) {
    console.log('[DemoSiteWrapper] Site is not an active demo, skipping demo UI', {
      siteType: siteData.site_type,
      lifecycleStage: siteData.lifecycle_stage
    });
    return <>{children}</>;
  }

  // Additional check: only proceed with demo UI if we have valid demo status
  if (!demoStatus) {
    console.log('[DemoSiteWrapper] No demo status available - skipping demo UI');
    return <>{children}</>;
  }

  console.log('[DemoSiteWrapper] Active demo site confirmed - showing demo UI with status:', demoStatus);

  return (
    <div className="relative">
      {/* Demo Status Banner */}
      <DemoStatusBanner
        demoStatus={demoStatus}
        businessName={siteData.business_name}
      />
      
      {/* Main Content */}
      <div className="relative">
        {children}
        
        {/* Demo Watermark */}
        <div className="fixed top-20 left-4 z-40 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          DEMO SITE
        </div>
      </div>
      
      {/* Claim Button */}
      <DemoClaimButton
        demoStatus={demoStatus}
        demoSiteId={siteData.id}
        businessName={siteData.business_name}
      />
    </div>
  );
};
