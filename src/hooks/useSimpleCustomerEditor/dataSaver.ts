
import { supabase } from '@/integrations/supabase/client';
import { SiteWithLifecycle } from '@/types/siteLifecycle';
import { SimpleEditorData } from './types';

export const saveSiteData = async (data: SimpleEditorData, claimedSite: SiteWithLifecycle): Promise<void> => {
  console.log('[dataSaver] Saving site data:', {
    businessName: data.businessName,
    primaryColor: data.primaryColor,
    heroImageUrl: data.heroImageUrl,
    logoUrl: data.logoUrl
  });

  // Convert complex types to JSON-compatible format
  const serializeForJson = (obj: any) => JSON.parse(JSON.stringify(obj));

  const updateData = {
    business_name: data.businessName,
    generated_config: serializeForJson({
      businessName: data.businessName,
      headline: data.headline,
      subheadline: data.subheadline,
      tagline: data.tagline,
      description: data.description,
      ctaText: data.ctaText,
      colors: { primary: data.primaryColor },
      // Also save as brandColor for Template8Layout compatibility
      brandColor: data.primaryColor,
      contact: {
        phone: data.phone,
        email: data.email,
        address: data.address
      },
      logoUrl: data.logoUrl,
      heroImage: data.heroImageUrl,
      heroImageUrl: data.heroImageUrl,
      stories: data.stories,
      gallery: data.gallery,
      testimonials: data.testimonials,
      socialLinks: data.socialLinks,
      businessHours: data.businessHours,
      services: data.services,
      specialties: data.specialties,
      bookingUrl: data.bookingUrl
    }),
    form_data: serializeForJson({
      businessName: data.businessName,
      tagline: data.tagline,
      headline: data.headline,
      subheadline: data.subheadline,
      description: data.description,
      ctaText: data.ctaText,
      phone: data.phone,
      email: data.email,
      address: data.address,
      primaryColor: data.primaryColor,
      logoUrl: data.logoUrl,
      heroImageUrl: data.heroImageUrl,
      stories: data.stories,
      gallery: data.gallery,
      testimonials: data.testimonials,
      socialLinks: data.socialLinks,
      businessHours: data.businessHours,
      services: data.services,
      specialties: data.specialties,
      bookingUrl: data.bookingUrl
    }),
    updated_at: new Date().toISOString()
  };

  console.log('[dataSaver] Updating with data:', updateData);

  const { error } = await supabase
    .from('chairlinked_sites')
    .update(updateData)
    .eq('id', claimedSite.id);

  if (error) {
    console.error('[dataSaver] Error saving data:', error);
    throw error;
  }

  console.log('[dataSaver] Successfully saved site data');
};

export const publishSite = async (claimedSite: SiteWithLifecycle): Promise<void> => {
  console.log('[dataSaver] Publishing site:', claimedSite.id);

  const { error } = await supabase
    .from('chairlinked_sites')
    .update({ 
      status: 'published',
      updated_at: new Date().toISOString()
    })
    .eq('id', claimedSite.id);

  if (error) {
    console.error('[dataSaver] Error publishing site:', error);
    throw error;
  }

  console.log('[dataSaver] Successfully published site');
};
