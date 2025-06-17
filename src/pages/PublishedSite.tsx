import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSiteBySlug } from '@/services/supabaseChairLinked';
import { ChairLinkedSite } from '@/services/supabaseChairLinked';
import ChairLinkedRenderer from '@/components/chairlinked/ChairLinkedRenderer';
import { DemoSiteWrapper } from '@/components/demo/DemoSiteWrapper';
import { useTrafficTracking } from '@/hooks/useTrafficTracking';
import { RouteDebugger } from '@/components/RouteDebugger';
import { isSitePubliclyAccessible } from '@/utils/lifecycleUtils';
import { SiteLifecycleStage } from '@/types/siteLifecycle';
import { useAuthContext } from '@/components/auth/AuthProvider';

const PublishedSite: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<ChairLinkedSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuthContext();

  // Track traffic for sites (demo sites are handled in DemoSite component)
  useTrafficTracking({
    siteId: site?.id || '',
    siteType: site?.site_type || 'live'
  });

  // Determine if the site should be read-only based on lifecycle stage and user permissions
  const isReadOnly = (() => {
    if (!site) return false;
    
    const isProductionPreview = new URLSearchParams(window.location.search).get("preview") === "admin";
    
    // Admins can always edit (unless in production preview mode)
    if (isAdmin && !isProductionPreview) return false;
    
    // Define lifecycle stages where sites should be read-only for non-admin users
    const readOnlyStages: SiteLifecycleStage[] = [
      'claimed',
      'converting', 
      'customer_controlled',
      'live_published'
    ];
    
    return readOnlyStages.includes(site.lifecycle_stage as SiteLifecycleStage);
  })();

  useEffect(() => {
    const loadSite = async () => {
      if (!slug) {
        console.error('[PublishedSite] No site slug provided');
        setError('No site slug provided');
        setLoading(false);
        return;
      }

      try {
        console.log('[PublishedSite] Loading site with slug:', slug);
        console.log('[PublishedSite] Current URL info:', {
          hostname: window.location.hostname,
          pathname: window.location.pathname,
          origin: window.location.origin,
          href: window.location.href
        });
        
        // Check if we're on custom domain vs internal route
        const isCustomDomain = window.location.hostname !== 'chairlinked.com';
        const routeType = window.location.pathname.startsWith('/site/') ? 'internal' : 'custom';
        
        console.log('[PublishedSite] Route info:', {
          hostname: window.location.hostname,
          pathname: window.location.pathname,
          isCustomDomain,
          routeType,
          slug
        });

        const { data, error: fetchError } = await getSiteBySlug(slug);
        
        if (fetchError) {
          console.error('[PublishedSite] Error loading site:', {
            error: fetchError,
            slug,
            errorMessage: fetchError.message
          });
          setError('Site not found');
          return;
        }

        if (!data) {
          console.log('[PublishedSite] No site found for slug:', slug);
          setError('Site not found');
          return;
        }

        // Lifecycle stage validation
        const isProductionPreview = new URLSearchParams(window.location.search).get("preview") === "admin";
    
        // For live published sites, treat as 'live' regardless of original site_type
        // This handles converted demo sites that are now customer-controlled or published
        const siteType = (data.lifecycle_stage === 'live_published' || data.lifecycle_stage === 'customer_controlled') 
          && !window.location.pathname.includes('/demo/') ? 'live' : 
          (data.site_type === 'demo' ? 'demo' : 'live');
        
        const isPubliclyAccessibleCheck = isSitePubliclyAccessible(
          data.lifecycle_stage,
          siteType,
          isProductionPreview
        );

        if (!isPubliclyAccessibleCheck) {
          console.warn(`[PublishedSite] ${siteType} site is not in a publicly accessible stage:`, {
            slug,
            stage: data.lifecycle_stage,
          });
          setError(`This site is not currently available for viewing.`);
          setLoading(false);
          return;
        }

        // Only redirect to demo route if it's actually still a demo in lifecycle (not converted)
        if (data.site_type === 'demo' && 
            !window.location.pathname.startsWith('/site/') && 
            !['customer_controlled', 'live_published'].includes(data.lifecycle_stage) &&
            !isCustomDomain) {
          console.warn('[PublishedSite] Demo site accessed via wrong route, redirecting:', {
            slug,
            site_type: data.site_type,
            current_path: window.location.pathname,
            redirecting_to: `/demo/${slug}`
          });
          window.location.href = `/demo/${slug}`;
          return;
        }

        console.log('[PublishedSite] Successfully loaded site:', {
          id: data.id,
          business_name: data.business_name,
          site_type: data.site_type || 'live',
          status: data.status,
          demo_expires_at: data.demo_expires_at,
          demo_view_count: data.demo_view_count,
          accessMethod: routeType,
          slug
        });

        setSite(data);
      } catch (err) {
        console.error('[PublishedSite] Unexpected error:', {
          error: err,
          slug,
          errorMessage: err instanceof Error ? err.message : 'Unknown error'
        });
        setError('Failed to load site');
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RouteDebugger componentName="PublishedSite-Loading" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading site: {slug}</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    console.log('[PublishedSite] Rendering error state:', {
      error,
      hasSite: !!site,
      slug
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RouteDebugger componentName="PublishedSite-Error" />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Not Found</h1>
          <p className="text-gray-600 mb-8">
            {error || 'The site you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <p className="text-sm text-gray-500 mb-4">Slug: {slug}</p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  console.log('[PublishedSite] Rendering site. Site data:', {
    id: site.id,
    business_name: site.business_name,
    site_type: site.site_type,
    demo_expires_at: site.demo_expires_at,
    demo_view_count: site.demo_view_count,
    slug,
    lifecycle_stage: site.lifecycle_stage,
    isReadOnly,
    isAdmin
  });

  // Only show demo wrapper for actual demo sites that haven't been converted to customer sites
  const shouldShowDemoWrapper = site.site_type === 'demo' && 
    !['customer_controlled', 'live_published'].includes(site.lifecycle_stage as SiteLifecycleStage);

  return (
    <>
      <RouteDebugger componentName="PublishedSite-Success" />
      {shouldShowDemoWrapper ? (
        <DemoSiteWrapper
          siteData={{
            id: site.id,
            business_name: site.business_name,
            demo_expires_at: site.demo_expires_at || null,
            site_type: site.site_type || 'demo',
            demo_view_count: site.demo_view_count || 0,
            lifecycle_stage: site.lifecycle_stage,
          }}
        >
          <ChairLinkedRenderer 
            config={site.generated_config}
            logoUrl={site.logo_url}
            isProductionPreview={new URLSearchParams(window.location.search).get("preview") === "admin"}
            siteType={site.site_type || 'demo'}
            readOnly={isReadOnly}
          />
        </DemoSiteWrapper>
      ) : (
        <ChairLinkedRenderer 
          config={site.generated_config}
          logoUrl={site.logo_url}
          isProductionPreview={new URLSearchParams(window.location.search).get("preview") === "admin"}
          siteType={site.site_type || 'live'}
          readOnly={isReadOnly}
        />
      )}
    </>
  );
};

export default PublishedSite;
