
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ButtonClickData {
  siteId: string;
  buttonType: 'cta' | 'social' | 'navigation' | 'claim' | 'contact' | 'booking';
  buttonLabel?: string;
  section?: string;
}

export const useButtonTracking = () => {
  const trackButtonClick = useCallback(async (data: ButtonClickData) => {
    try {
      // Get visitor identifier
      let visitorId = localStorage.getItem('visitor_id');
      if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('visitor_id', visitorId);
      }

      const clickData = {
        site_id: data.siteId,
        visitor_id: visitorId,
        button_type: data.buttonType,
        button_label: data.buttonLabel || '',
        section: data.section || '',
        user_agent: navigator.userAgent,
        referrer: document.referrer || null
      };

      const { error } = await supabase
        .from('button_clicks')
        .insert(clickData);

      if (error) {
        console.error('[ButtonTracking] Error tracking click:', error);
      } else {
        console.log('[ButtonTracking] Button click tracked:', data);
      }
    } catch (error) {
      console.error('[ButtonTracking] Unexpected error:', error);
    }
  }, []);

  return { trackButtonClick };
};
