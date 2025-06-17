import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSiteBySlug } from '@/services/supabaseChairLinked';
import { ChairLinkedSite } from '@/services/supabaseChairLinked';
import ChairLinkedRenderer from '@/components/chairlinked/ChairLinkedRenderer';
import { DemoSiteWrapper } from '@/components/demo/DemoSiteWrapper';
import { useTrafficTracking } from '@/hooks/useTrafficTracking';
import { RouteDebugger } from '@/components/RouteDebugger';
import { isSitePubliclyAccessible } from '@/utils/lifecycleUtils';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { SiteLifecycleStage } from '@/types/siteLifecycle';

const DemoSite: React.FC = () => {
  console.log('[DemoSite] Component instance created');
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<ChairLinkedSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuthContext();

  // Track if this is an admin/production preview via the query param
  const isProductionPreview = (() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("preview") === "admin";
    }
    return false;
  })();

  // Determine if the site should be read-only based on lifecycle stage and user permissions
  const isReadOnly = (() => {
    if (!site) {
      console.log('[DemoSite] isReadOnly: false (no site)');
      return false;
    }
    
    // Admins can always edit (unless in production preview mode)
    if (isAdmin && !isProductionPreview) {
      console.log('[DemoSite] isReadOnly: false (admin can edit)', { isAdmin, isProductionPreview });
      return false;
    }
    
    // Define lifecycle stages where demos should be read-only for non-admin users
    const readOnlyStages: SiteLifecycleStage[] = [
      'claimed',
      'converting', 
      'customer_controlled',
      'live_published'
    ];
    
    const shouldBeReadOnly = readOnlyStages.includes(site.lifecycle_stage as SiteLifecycleStage);
    
    console.log('[DemoSite] isReadOnly calculation:', {
      siteLifecycleStage: site.lifecycle_stage,
      readOnlyStages,
      isAdmin,
      isProductionPreview,
      shouldBeReadOnly
    });
    
    return shouldBeReadOnly;
  })();

  // Track traffic for demo sites
  useTrafficTracking({
    siteId: site?.id || '',
    siteType: 'demo'
  });

  useEffect(() => {
    const loadDemoSite = async () => {
      console.log('[DemoSite] ========== LOADING DEMO SITE ==========');
      console.log('[DemoSite] Component mounted for slug:', slug);
      
      if (!slug) {
        console.error('[DemoSite] No demo slug provided');
        setError('No demo slug provided');
        setLoading(false);
        return;
      }

      try {
        console.log('[DemoSite] Loading demo site with slug:', slug);
        console.log('[DemoSite] Dev mode status:', import.meta.env.VITE_DEV_MODE);
        console.log('[DemoSite] All env vars:', import.meta.env);
        console.log('[DemoSite] Current URL info:', {
          hostname: window.location.hostname,
          pathname: window.location.pathname,
          origin: window.location.origin,
          href: window.location.href
        });

        console.log('[DemoSite] About to call getSiteBySlug with slug:', slug);
        const { data, error: fetchError } = await getSiteBySlug(slug);
        console.log('[DemoSite] getSiteBySlug returned:', { data, error: fetchError });
        
        if (fetchError) {
          console.error('[DemoSite] Error loading demo site:', {
            error: fetchError,
            slug,
            errorMessage: fetchError.message
          });
          setError('Demo site not found');
          return;
        }

        if (!data) {
          console.log('[DemoSite] No demo site found for slug:', slug);
          setError('Demo site not found');
          return;
        }
        
        // Validate that this is actually a demo site, redirect if not
        if (data.site_type !== 'demo') {
          console.warn('[DemoSite] Site found but not a demo site:', {
            slug,
            site_type: data.site_type,
            redirecting: true
          });
          // Redirect to the regular site route
          window.location.href = `/${slug}`;
          return;
        }
        
        // Lifecycle stage validation using centralized utility
        const isPubliclyAccessibleCheck = isSitePubliclyAccessible(
          data.lifecycle_stage, 
          'demo', 
          isProductionPreview
        );

        if (!isPubliclyAccessibleCheck) {
          console.warn('[DemoSite] Demo site not in a publicly accessible stage:', {
            slug,
            stage: data.lifecycle_stage,
          });
          setError(`This demo site is not currently available for viewing.`);
          setLoading(false);
          return;
        }

        console.log('[DemoSite] Successfully loaded demo site:', {
          id: data.id,
          business_name: data.business_name,
          site_type: data.site_type,
          status: data.status,
          demo_expires_at: data.demo_expires_at,
          demo_view_count: data.demo_view_count,
          slug
        });

        setSite(data);
      } catch (err) {
        console.error('[DemoSite] Unexpected error:', {
          error: err,
          slug,
          errorMessage: err instanceof Error ? err.message : 'Unknown error'
        });
        setError('Failed to load demo site');
      } finally {
        setLoading(false);
      }
    };

    loadDemoSite();
  }, [slug, isProductionPreview]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RouteDebugger componentName="DemoSite-Loading" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading demo site: {slug}</p>
        </div>
      </div>
    );
  }

  if (error || !site) {
    console.log('[DemoSite] Rendering error state:', {
      error,
      hasSite: !!site,
      slug
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RouteDebugger componentName="DemoSite-Error" />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Demo Site Not Found</h1>
          <p className="text-gray-600 mb-8">
            {error || 'The demo site you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <p className="text-sm text-gray-500 mb-4">Demo Slug: {slug}</p>
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

  console.log('[DemoSite] Rendering demo site with DemoSiteWrapper. Site data:', {
    id: site.id,
    business_name: site.business_name,
    site_type: site.site_type,
    demo_expires_at: site.demo_expires_at,
    demo_view_count: site.demo_view_count,
    slug,
    lifecycle_stage: site.lifecycle_stage,
    isReadOnly,
    isAdmin,
    isProductionPreview
  });

  return (
    <>
      <RouteDebugger componentName="DemoSite-Success" />
      <DemoSiteWrapper
        siteData={{
          id: site.id,
          business_name: site.business_name,
          demo_expires_at: site.demo_expires_at || null,
          site_type: 'demo', // Always demo for this route
          demo_view_count: site.demo_view_count || 0,
          lifecycle_stage: site.lifecycle_stage,
        }}
      >
        <ChairLinkedRenderer 
          config={site.generated_config}
          logoUrl={site.logo_url}
          isProductionPreview={isProductionPreview}
          siteType="demo"
          readOnly={isReadOnly}
        />
      </DemoSiteWrapper>
    </>
  );
};

export default DemoSite;
