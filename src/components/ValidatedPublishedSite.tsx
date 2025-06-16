
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { validateSlug, SlugValidationResult } from '@/utils/slugValidator';
import { RouteDebugger } from '@/components/RouteDebugger';
import PublishedSite from '@/pages/PublishedSite';

const ValidatedPublishedSite: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [validation, setValidation] = useState<SlugValidationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAndLoad = async () => {
      if (!slug) {
        console.error('[ValidatedPublishedSite] No slug provided in URL');
        setValidation({
          isValid: false,
          exists: false,
          error: 'No slug provided',
          slug: ''
        });
        setLoading(false);
        return;
      }

      console.log('[ValidatedPublishedSite] Starting validation for slug:', slug);
      console.log('[ValidatedPublishedSite] Current URL:', window.location.href);
      
      try {
        const result = await validateSlug(slug);
        console.log('[ValidatedPublishedSite] Validation complete:', result);
        setValidation(result);
      } catch (error) {
        console.error('[ValidatedPublishedSite] Validation failed unexpectedly:', error);
        setValidation({
          isValid: false,
          exists: false,
          error: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          slug
        });
      } finally {
        setLoading(false);
      }
    };

    validateAndLoad();
  }, [slug]);

  // Show loading state
  if (loading) {
    console.log('[ValidatedPublishedSite] Rendering loading state for slug:', slug);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RouteDebugger componentName="ValidatedPublishedSite-Loading" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating site: {slug}</p>
        </div>
      </div>
    );
  }

  // Handle validation failure - only redirect to 404 if site doesn't exist or there's an actual error
  if (!validation || (!validation.exists && validation.error)) {
    console.log('[ValidatedPublishedSite] Validation failed, redirecting to 404:', {
      validation,
      slug,
      reason: validation?.error || 'No validation result'
    });
    
    return <Navigate to="/404" replace />;
  }

  // Handle case where site doesn't exist (no error, just not found)
  if (!validation.exists && !validation.error) {
    console.log('[ValidatedPublishedSite] Site does not exist, redirecting to 404:', slug);
    return <Navigate to="/404" replace />;
  }

  // Validation passed, render the actual site
  console.log('[ValidatedPublishedSite] Validation passed, rendering PublishedSite for:', slug);
  return (
    <>
      <RouteDebugger componentName="ValidatedPublishedSite-Success" />
      <PublishedSite />
    </>
  );
};

export default ValidatedPublishedSite;
