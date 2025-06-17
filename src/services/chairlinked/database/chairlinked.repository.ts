
import { supabase } from '@/integrations/supabase/client';
import type { ChairLinkedSite, SaveSiteRequest } from '../types/chairlinked.types';
import { generateSlug } from '../utils/slug.utils';
import { generateChairLinkedUrl } from '../utils/url.utils';
import { transformToTemplate8Format } from '../utils/config-transformer.utils';

export async function saveSite(request: SaveSiteRequest): Promise<{ data: ChairLinkedSite | null; error: any; chairlinkedUrl?: string }> {
  try {
    const slug = generateSlug(request.businessName);
    let finalSlug = slug;
    let counter = 1;
    while (true) {
      const { data: existingSite } = await supabase
        .from('chairlinked_sites')
        .select('site_slug')
        .eq('site_slug', finalSlug)
        .single();
      if (!existingSite) break;
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const template8Config = transformToTemplate8Format(request.generatedConfig, request.businessName);

    const { data, error } = await supabase
      .from('chairlinked_sites')
      .insert({
        site_slug: finalSlug,
        business_name: request.businessName,
        generated_config: template8Config,
        form_data: request.formData,
        logo_url: request.logoUrl,
        status: request.status || 'published'
      })
      .select()
      .single();

    if (error) {
      return { data: null, error, chairlinkedUrl: undefined };
    }

    if (request.initialEngagement && data) {
      const { saveEngagementData } = await import('@/services/engagementService');
      await saveEngagementData(data.id, {
        ...request.initialEngagement,
        traffic_score: 0
      });
    }

    const chairlinkedUrl = generateChairLinkedUrl(request.businessName);
    return { data: data as ChairLinkedSite, error, chairlinkedUrl };
  } catch (error) {
    console.error('Error saving site:', error);
    return { data: null, error, chairlinkedUrl: undefined };
  }
}

export async function getSiteBySlug(slug: string): Promise<{ data: ChairLinkedSite | null; error: any }> {
  try {
    console.log('[getSiteBySlug] ========== GETTING SITE BY SLUG ==========');
    console.log('[getSiteBySlug] Initial DB query for slug:', slug);
    console.log('[getSiteBySlug] Environment check - VITE_DEV_MODE:', import.meta.env.VITE_DEV_MODE);
    
    // Dev mode mock data
    const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
    console.log('[getSiteBySlug] Is dev mode:', isDevMode);
    
    if (isDevMode) {
      console.log('[getSiteBySlug] Dev mode: using mock data for slug:', slug);
      
      // Check if this demo has been claimed by checking localStorage
      const claimedDemoInfo = localStorage.getItem('dev_claimed_demo_info');
      let claimedDemoData = null;
      
      if (claimedDemoInfo) {
        try {
          claimedDemoData = JSON.parse(claimedDemoInfo);
          console.log('[getSiteBySlug] Found claimed demo info:', claimedDemoData);
        } catch (e) {
          console.log('Could not parse claimed demo info');
        }
      } else {
        console.log('[getSiteBySlug] No claimed demo info in localStorage');
      }
      
      const mockSites = [
        {
          id: 'demo-1',
          business_name: 'Beauty Studio Demo',
          site_slug: 'beauty-studio-demo',
          site_type: 'demo',
          // If this demo has been claimed, set lifecycle to 'claimed', otherwise 'shared'
          lifecycle_stage: (() => {
            const isClaimed = claimedDemoData?.demoSiteId === 'demo-1';
            const stage = isClaimed ? 'claimed' : 'shared';
            console.log('[getSiteBySlug] Setting lifecycle_stage for demo-1:', {
              isClaimed,
              claimedDemoSiteId: claimedDemoData?.demoSiteId,
              stage
            });
            return stage;
          })(),
          status: 'published',
          demo_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          demo_view_count: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          generated_config: {
            businessName: 'Beauty Studio Demo',
            businessType: 'Beauty Salon',
            services: ['Haircuts', 'Coloring', 'Styling'],
            location: 'Downtown Area'
          }
        },
        {
          id: 'demo-2',
          business_name: 'Hair Salon Demo',
          site_slug: 'hair-salon-demo',
          site_type: 'demo',
          lifecycle_stage: 'claimed',
          status: 'published',
          demo_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          demo_view_count: 12,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          generated_config: {
            businessName: 'Hair Salon Demo',
            businessType: 'Hair Salon',
            services: ['Cuts', 'Styles', 'Treatments'],
            location: 'Main Street'
          }
        },
        {
          id: 'live-1',
          business_name: 'Pink Fin Beauty',
          site_slug: 'pinkfinbeauty',
          site_type: 'live',
          lifecycle_stage: 'live_published',
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          generated_config: {
            businessName: 'Pink Fin Beauty',
            businessType: 'Beauty Salon',
            services: ['Skincare', 'Makeup', 'Treatments'],
            location: 'Uptown'
          }
        }
      ];
      
      console.log('[getSiteBySlug] Available mock sites:', mockSites.map(s => ({ slug: s.site_slug, name: s.business_name, type: s.site_type })));
      
      // Find exact match first
      console.log('[getSiteBySlug] Looking for exact match with slug:', slug);
      let site = mockSites.find(s => s.site_slug === slug);
      console.log('[getSiteBySlug] Exact match result:', site ? site.business_name : 'none');
      
      // If not found and doesn't start with demo-, try with demo- prefix
      if (!site && !slug.startsWith('demo-')) {
        console.log('[getSiteBySlug] No exact match, trying with demo- prefix:', `demo-${slug}`);
        site = mockSites.find(s => s.site_slug === `demo-${slug}`);
        console.log('[getSiteBySlug] Demo prefix match result:', site ? site.business_name : 'none');
      }
      
      if (site) {
        console.log('[getSiteBySlug] Dev mode: Found mock site:', site.business_name);
        console.log('[getSiteBySlug] Returning site data:', site);
        return { data: site as ChairLinkedSite, error: null };
      } else {
        console.log('[getSiteBySlug] Dev mode: No mock site found for slug:', slug);
        console.log('[getSiteBySlug] Searched in:', mockSites.map(s => s.site_slug));
        return { data: null, error: { message: 'Site not found' } };
      }
    }

    let { data, error } = await supabase
      .from('chairlinked_sites')
      .select('*')
      .eq('site_slug', slug)
      .maybeSingle();

    if (error) {
      console.error('[getSiteBySlug] Error during initial query:', { error, slug });
      return { data: null, error };
    }
    if (data) {
      console.log('[getSiteBySlug] Found site by exact slug (first attempt):', {
        id: data.id, slug: data.site_slug, site_type: data.site_type
      });
      return { data: data as ChairLinkedSite, error: null };
    }

    if (!slug.startsWith('demo-')) {
      const demoSlug = `demo-${slug}`;
      console.log('[getSiteBySlug] Not found, trying with demo- prefix:', demoSlug);

      const { data: demoData, error: demoError } = await supabase
        .from('chairlinked_sites')
        .select('*')
        .eq('site_slug', demoSlug)
        .maybeSingle();

      if (demoError) {
        console.error('[getSiteBySlug] Error when trying demo- prefix:', { demoError, demoSlug });
        return { data: null, error: demoError };
      }
      if (demoData) {
        console.log('[getSiteBySlug] Found site by slug with demo- prefix:', {
          id: demoData.id, slug: demoData.site_slug, site_type: demoData.site_type
        });
        return { data: demoData as ChairLinkedSite, error: null };
      }
    }

    console.log('[getSiteBySlug] No site found for slug nor demo- prefix:', slug);
    return { data: null, error: { message: 'Site not found' } };
  } catch (error) {
    console.error('[getSiteBySlug] Unexpected error:', error);
    return { data: null, error: { message: 'Database connection error' } };
  }
}

export async function updateSite(id: string, updates: Partial<ChairLinkedSite>): Promise<{ data: ChairLinkedSite | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('chairlinked_sites')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    return { data: data as ChairLinkedSite, error };
  } catch (error) {
    console.error('Error updating site:', error);
    return { data: null, error };
  }
}

export async function listSites(): Promise<{ data: ChairLinkedSite[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('chairlinked_sites')
      .select('*')
      .order('created_at', { ascending: false });

    return { data: data as ChairLinkedSite[], error };
  } catch (error) {
    console.error('Error listing sites:', error);
    return { data: null, error };
  }
}
