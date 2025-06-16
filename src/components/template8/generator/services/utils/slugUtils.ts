
import { supabase } from '@/integrations/supabase/client';

/**
 * Utilities for generating unique demo slugs
 */
export class SlugUtils {
  /**
   * Generates a unique slug for a demo based on business name
   */
  static async generateUniqueSlug(businessName: string): Promise<string> {
    if (!businessName || businessName.trim() === '') {
      businessName = 'demo-site';
    }

    // Create a clean, human-readable base slug
    const baseSlug = businessName
      .toLowerCase()
      .trim()
      // Remove special characters except spaces and hyphens
      .replace(/[^\w\s-]/g, '')
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      // Replace spaces with hyphens
      .replace(/\s/g, '-')
      // Replace multiple hyphens with single hyphen
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Limit length
      .substring(0, 50);

    let slug = baseSlug || 'demo-site';
    let counter = 1;

    while (true) {
      try {
        const { data, error } = await supabase
          .from('chairlinked_sites')
          .select('id')
          .eq('site_slug', slug)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (!data) {
          break; // Slug is unique
        }

        // If slug exists, append counter
        slug = `${baseSlug}-${counter}`;
        counter++;

        // Prevent infinite loops
        if (counter > 1000) {
          slug = `${baseSlug}-${Date.now()}`;
          break;
        }
      } catch (error) {
        console.error('[SlugUtils] Error checking slug uniqueness:', error);
        slug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }

    return slug;
  }

  /**
   * Validates if a slug is properly formatted
   */
  static isValidSlug(slug: string): boolean {
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugPattern.test(slug) && slug.length <= 50;
  }

  /**
   * Sanitizes a slug to ensure it's valid
   */
  static sanitizeSlug(slug: string): string {
    return slug
      .toLowerCase()
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }
}
