
import { SiteWithLifecycle } from '@/types/siteLifecycle';
import { SimpleEditorData, GeneratedConfig, FormData } from './types';

export const loadSiteData = async (claimedSite: SiteWithLifecycle): Promise<SimpleEditorData> => {
  console.log('[dataLoader] Transforming claimed site data:', claimedSite);
  
  try {
    // Transform the data directly from the claimed site object instead of fetching
    const config = (claimedSite.generated_config || {}) as GeneratedConfig;
    const formData = ((claimedSite as any).form_data || {}) as FormData;
    
    const editorData: SimpleEditorData = {
      businessName: claimedSite.business_name || '',
      tagline: config.tagline || formData.tagline || '',
      headline: config.headline || formData.headline || '',
      subheadline: config.subheadline || formData.subheadline || '',
      description: config.description || formData.description || '',
      ctaText: config.ctaText || formData.ctaText || 'Get Started',
      phone: config.contact?.phone || formData.phone || '',
      email: config.contact?.email || formData.email || '',
      address: config.contact?.address || formData.address || '',
      primaryColor: config.colors?.primary || formData.primaryColor || '#6B46C1',
      logoUrl: config.logoUrl || formData.logoUrl || '',
      heroImageUrl: config.heroImageUrl || formData.heroImageUrl || '',
      
      // Stories section
      stories: config.stories || formData.stories || [],
      
      // Gallery section
      gallery: config.gallery || formData.gallery || [],
      
      // Testimonials section
      testimonials: config.testimonials || formData.testimonials || [],
      
      // Contact/Booking section
      businessHours: config.businessHours || formData.businessHours || {},
      socialLinks: config.socialLinks || formData.socialLinks || {},
      bookingUrl: config.bookingUrl || formData.bookingUrl || '',
      
      // Additional business info
      services: config.services || formData.services || [],
      specialties: config.specialties || formData.specialties || []
    };

    console.log('[dataLoader] Successfully transformed editor data:', editorData);
    return editorData;
  } catch (error) {
    console.error('[dataLoader] Error transforming data:', error);
    throw new Error(`Failed to transform site data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
