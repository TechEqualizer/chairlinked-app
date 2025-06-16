
/**
 * Utilities for demo ID validation and recovery
 */
export class DemoIdUtils {
  /**
   * Validates if a string is a valid UUID
   */
  static isValidUUID(uuid: string | undefined | null): boolean {
    if (!uuid || typeof uuid !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Sanitizes and validates demo ID from various sources
   */
  static sanitizeDemoId(demoId: any): string | null {
    if (!demoId) return null;
    
    // Convert to string and trim
    const sanitized = String(demoId).trim();
    
    // Validate format
    return this.isValidUUID(sanitized) ? sanitized : null;
  }

  /**
   * Extracts demo ID from session data with validation
   */
  static extractDemoIdFromSession(): string | null {
    try {
      // Check multiple session storage keys
      const sessionKeys = ['editingDemoSite', 'demo-recovery-', 'business-recovery-'];
      
      for (const baseKey of sessionKeys) {
        if (baseKey.includes('-')) {
          // Handle dynamic keys like demo-recovery-{id}
          const keys = Object.keys(sessionStorage).filter(k => k.startsWith(baseKey));
          for (const key of keys) {
            const data = sessionStorage.getItem(key);
            if (data) {
              const parsed = JSON.parse(data);
              const demoId = parsed.id || parsed.demoId || parsed._demoId;
              const sanitized = this.sanitizeDemoId(demoId);
              if (sanitized) return sanitized;
            }
          }
        } else {
          // Handle direct keys
          const data = sessionStorage.getItem(baseKey);
          if (data) {
            const parsed = JSON.parse(data);
            const demoId = parsed.id || parsed.demoId || parsed._demoId || 
                           parsed.config?.id || parsed.config?.demoId || parsed.config?._demoId;
            const sanitized = this.sanitizeDemoId(demoId);
            if (sanitized) return sanitized;
          }
        }
      }
    } catch (error) {
      console.warn('[DemoIdUtils] Error extracting demo ID from session:', error);
    }
    
    return null;
  }

  /**
   * Extracts demo ID from URL parameters
   */
  static extractDemoIdFromURL(): string | null {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const demoId = urlParams.get('demoId') || urlParams.get('id');
      return this.sanitizeDemoId(demoId);
    } catch (error) {
      console.warn('[DemoIdUtils] Error extracting demo ID from URL:', error);
      return null;
    }
  }

  /**
   * Comprehensive demo ID recovery from all available sources
   */
  static recoverDemoId(pageData?: any): string | null {
    console.log('[DemoIdUtils] Starting demo ID recovery');
    
    // Priority 1: From page data
    if (pageData) {
      const fromPageData = this.sanitizeDemoId(pageData._demoId || pageData.demoId || pageData.id);
      if (fromPageData) {
        console.log('[DemoIdUtils] Recovered demo ID from page data:', fromPageData);
        return fromPageData;
      }
    }

    // Priority 2: From session storage
    const fromSession = this.extractDemoIdFromSession();
    if (fromSession) {
      console.log('[DemoIdUtils] Recovered demo ID from session:', fromSession);
      return fromSession;
    }

    // Priority 3: From URL parameters
    const fromURL = this.extractDemoIdFromURL();
    if (fromURL) {
      console.log('[DemoIdUtils] Recovered demo ID from URL:', fromURL);
      return fromURL;
    }

    console.log('[DemoIdUtils] No valid demo ID found in any source');
    return null;
  }

  /**
   * Cleans invalid demo IDs from data object
   */
  static cleanInvalidDemoIds(data: any): any {
    if (!data) return data;
    
    const cleaned = { ...data };
    
    // Check and clean various demo ID fields
    const demoIdFields = ['_demoId', 'demoId', 'id'];
    
    for (const field of demoIdFields) {
      if (cleaned[field] && !this.isValidUUID(cleaned[field])) {
        console.warn(`[DemoIdUtils] Removing invalid ${field}:`, cleaned[field]);
        delete cleaned[field];
      }
    }
    
    return cleaned;
  }
}
