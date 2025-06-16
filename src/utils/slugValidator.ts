
import { getSiteBySlug } from '@/services/supabaseChairLinked';

export interface SlugValidationResult {
  isValid: boolean;
  exists: boolean;
  error?: string;
  slug: string;
}

/**
 * Validates if a slug is properly formatted and exists in the database
 */
export async function validateSlug(slug: string): Promise<SlugValidationResult> {
  console.log('[SlugValidator] Validating slug:', slug);

  // Basic format validation
  if (!slug || slug.trim() === '') {
    console.log('[SlugValidator] Slug is empty');
    return {
      isValid: false,
      exists: false,
      error: 'Slug is empty',
      slug
    };
  }

  // Check for invalid characters or patterns
  const invalidPatterns = [
    /^(auth|admin|dashboard|template8-generator|pricing|payment-success|site)$/i,
    /\s/,
    /[^a-zA-Z0-9\-_]/
  ];

  for (const pattern of invalidPatterns) {
    if (pattern.test(slug)) {
      console.log('[SlugValidator] Slug failed pattern validation:', slug, pattern);
      return {
        isValid: false,
        exists: false,
        error: `Slug contains invalid characters or is a reserved word: ${slug}`,
        slug
      };
    }
  }

  // Check if slug exists in database
  try {
    console.log('[SlugValidator] Querying database for slug:', slug);
    const { data, error } = await getSiteBySlug(slug);
    
    // Handle actual database errors (connection issues, etc.)
    if (error && error.message !== 'Site not found') {
      console.error('[SlugValidator] Database error:', error);
      return {
        isValid: false,
        exists: false,
        error: `Database error: ${error.message}`,
        slug
      };
    }

    // Site not found is a valid case - not an error
    if (!data) {
      console.log('[SlugValidator] Site not found for slug:', slug);
      return {
        isValid: false,
        exists: false,
        slug
      };
    }

    // Site exists and was found
    console.log('[SlugValidator] Site found successfully:', {
      slug,
      siteId: data.id,
      businessName: data.business_name,
      status: data.status
    });

    return {
      isValid: true,
      exists: true,
      slug
    };
  } catch (error) {
    console.error('[SlugValidator] Unexpected error during validation:', error);
    return {
      isValid: false,
      exists: false,
      error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      slug
    };
  }
}

/**
 * Quick check to see if a slug looks like it could be valid (without database lookup)
 */
export function isSlugFormatValid(slug: string): boolean {
  if (!slug || slug.trim() === '') return false;
  
  // Reserved routes that should never be treated as slugs
  const reservedRoutes = [
    'auth', 'admin', 'dashboard', 'template8-generator', 
    'pricing', 'payment-success', 'site', 'api'
  ];
  
  if (reservedRoutes.includes(slug.toLowerCase())) {
    return false;
  }

  // Check format
  return /^[a-zA-Z0-9\-_]+$/.test(slug) && slug.length >= 2 && slug.length <= 100;
}
