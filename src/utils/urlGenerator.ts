/**
 * URL generation utilities for ChairLinked sites
 */

export interface SiteUrlConfig {
  slug: string;
  siteType: 'demo' | 'live';
  status: 'draft' | 'published';
}

/**
 * Determines if we're running on the custom domain
 */
export function isCustomDomain(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'chairlinked.com';
}

/**
 * Gets the base URL for the current environment
 */
export function getBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  
  // In production on custom domain
  if (isCustomDomain()) {
    return 'https://chairlinked.com';
  }
  
  // Development or internal domains
  return window.location.origin;
}

/**
 * Generates the appropriate URL for a site based on its type and status
 * Uses dedicated /demo/ route for demo sites, regular route for live sites
 */
export function generateSiteUrl(config: SiteUrlConfig): string {
  const { slug, siteType } = config;
  
  // Use dedicated demo route for demo sites
  if (siteType === 'demo') {
    return `/demo/${slug}`;
  }
  
  // Use custom domain format for live sites when on chairlinked.com
  if (isCustomDomain()) {
    return `/${slug}`;
  }
  
  // Use internal route structure for admin/development of live sites
  return `/site/${slug}`;
}

/**
 * Generates the preview URL that can be opened in a new tab
 * Always uses the full URL with custom domain when possible
 */
export function generatePreviewUrl(config: SiteUrlConfig): string {
  const { slug, siteType } = config;
  const baseUrl = getBaseUrl();
  
  // Demo sites always use the dedicated demo route
  if (siteType === 'demo') {
    if (isCustomDomain() || baseUrl.includes('chairlinked.com')) {
      return `https://chairlinked.com/demo/${slug}`;
    }
    return `${baseUrl}/demo/${slug}`;
  }
  
  // Live sites use custom domain when possible
  if (isCustomDomain() || baseUrl.includes('chairlinked.com')) {
    return `https://chairlinked.com/${slug}`;
  }
  
  // Fallback to internal route for development
  return `${baseUrl}/site/${slug}`;
}

/**
 * Generates a display-friendly URL for marketing/sharing purposes
 * Shows the actual URL structure that will be used
 */
export function generateDisplayUrl(config: SiteUrlConfig): string {
  const { slug, siteType } = config;
  
  if (siteType === 'demo') {
    return `chairlinked.com/demo/${slug}`;
  }
  
  return `chairlinked.com/${slug}`;
}

/**
 * Generates the shareable URL that should be used for external sharing
 * Always uses the custom domain format with proper route structure
 */
export function generateShareableUrl(config: SiteUrlConfig): string {
  const { slug, siteType } = config;
  
  if (siteType === 'demo') {
    return `https://chairlinked.com/demo/${slug}`;
  }
  
  return `https://chairlinked.com/${slug}`;
}

/**
 * Generates an admin preview URL with a token to bypass restrictions.
 * @param config The site's URL configuration.
 * @returns A full URL with an admin preview query parameter.
 */
export function generateAdminPreviewUrl(config: SiteUrlConfig): string {
  const publicUrl = generateShareableUrl(config);
  // URL constructor requires a full URL with protocol
  const url = new URL(publicUrl);
  url.searchParams.set('preview', 'admin');
  return url.toString();
}

/**
 * Extracts slug from a demo URL (now handles both old and new formats)
 */
export function extractSlugFromDemoUrl(demoUrl: string): string | null {
  // Handle new format: /demo/slug or https://domain.com/demo/slug
  const newFormatMatch = demoUrl.match(/\/demo\/([^\/\?#]+)/);
  if (newFormatMatch) {
    return newFormatMatch[1];
  }
  
  // Handle old format for backward compatibility: demo-slug or /demo-slug
  const oldFormatMatch = demoUrl.match(/demo-(.+)$/) || demoUrl.match(/\/([^\/]+)$/);
  return oldFormatMatch ? oldFormatMatch[1] : null;
}

/**
 * Determines if a URL is a demo URL
 */
export function isDemoUrl(url: string): boolean {
  return url.includes('/demo/') || url.includes('demo-');
}

/**
 * Gets the actual working URL for a site
 * Returns the appropriate URL based on current environment and site type
 */
export function getWorkingUrl(config: SiteUrlConfig): string {
  return generateSiteUrl(config);
}

/**
 * Gets the internal admin URL for a site (always uses /site/:slug format)
 * Used for admin interfaces and internal navigation
 */
export function getInternalUrl(config: SiteUrlConfig): string {
  const { slug } = config;
  return `/site/${slug}`;
}

/**
 * Gets the public URL for a site (the URL prospects/customers will use)
 * Uses the dedicated demo route for demos, custom domain for live sites
 */
export function getPublicUrl(config: SiteUrlConfig): string {
  const { slug, siteType } = config;
  const baseUrl = getBaseUrl();
  
  if (siteType === 'demo') {
    return `${baseUrl}/demo/${slug}`;
  }
  
  // For live sites, use custom domain format
  if (isCustomDomain() || baseUrl.includes('chairlinked.com')) {
    return `https://chairlinked.com/${slug}`;
  }
  
  return `${baseUrl}/${slug}`;
}
