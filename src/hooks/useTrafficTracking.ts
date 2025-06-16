
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrafficTrackingProps {
  siteId: string;
  siteType?: string;
}

export const useTrafficTracking = ({ siteId, siteType }: TrafficTrackingProps) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!siteId || hasTracked.current) return;

    const trackVisitor = async () => {
      try {
        // Generate or get visitor identifier
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('visitor_id', visitorId);
        }

        const visitorData = {
          site_id: siteId,
          visitor_identifier: visitorId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          first_visit: new Date().toISOString(),
          last_visit: new Date().toISOString(),
          visit_count: 1
        };

        // Try to insert new visitor, or update existing
        const { error: upsertError } = await supabase
          .from('chairlinked_traffic')
          .upsert(
            visitorData,
            { 
              onConflict: 'site_id,visitor_identifier',
              ignoreDuplicates: false 
            }
          );

        if (upsertError) {
          // If upsert fails (likely due to existing record), update visit count
          await supabase
            .from('chairlinked_traffic')
            .update({
              last_visit: new Date().toISOString(),
              visit_count: 1 // Will be incremented by trigger or manual logic
            })
            .eq('site_id', siteId)
            .eq('visitor_identifier', visitorId);
        }

        // Also increment the site's demo view count if it's a demo
        if (siteType === 'demo') {
          // First get current count, then increment it
          const { data: currentSite } = await supabase
            .from('chairlinked_sites')
            .select('demo_view_count')
            .eq('id', siteId)
            .single();

          const currentCount = currentSite?.demo_view_count || 0;
          
          await supabase
            .from('chairlinked_sites')
            .update({
              demo_view_count: currentCount + 1,
              demo_last_viewed: new Date().toISOString()
            })
            .eq('id', siteId);
        }

        console.log('[TrafficTracking] Visitor tracked:', { siteId, visitorId });
        hasTracked.current = true;
      } catch (error) {
        console.error('[TrafficTracking] Error tracking visitor:', error);
      }
    };

    trackVisitor();
  }, [siteId, siteType]);
};
