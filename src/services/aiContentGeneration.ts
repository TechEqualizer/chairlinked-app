

import { supabase } from '@/integrations/supabase/client';
import { UnsplashImageService } from './unsplashImageService';

type BrandVibe = 'bold' | 'modern' | 'feminine' | 'luxury';

interface ChairLinkedContentRequest {
  businessName: string;
  industry: string;
  city?: string;
  brandVibe: BrandVibe;
  services: string[];
  bookingLink?: string;
  instagramHandle?: string;
  followerCount?: number;
  initialEngagement?: {
    hearts: number;
    comments: number;
    saves: number;
  };
}

interface ChairLinkedContentResponse {
  businessName: string;
  headline: string;
  subheadline: string;
  heroTagline: string;
  ctaText: string;
  services: Array<{
    title: string;
    description: string;
    price?: string;
    duration?: string;
    icon?: string;
  }>;
  testimonials: Array<{
    name: string;
    text: string;
    rating: number;
    avatarUrl?: string;
    location?: string;
    service?: string;
  }>;
  colorScheme: string;
  fontFamily: string;
  galleryImages: string[];
  aboutDescription: string;
  socialProof: {
    yearsExperience: string;
    clientsServed: string;
    rating: string;
  };
  specialOffers?: Array<{
    title: string;
    description: string;
    discount: string;
  }>;
  stories: Array<{
    id: number;
    image: string;
    title: string;
    ctaText?: string;
  }>;
}

function getQualityIndustryImages(industry: string, count: number, brandVibe: BrandVibe = 'modern') {
  console.log('[aiContentGeneration] Getting quality images for industry:', industry, 'count:', count, 'brandVibe:', brandVibe);
  
  // Use exact industry match with quality-first approach
  const images = UnsplashImageService.getGalleryImages(industry, count, brandVibe);
  console.log('[aiContentGeneration] Retrieved images:', images.length);
  
  // Ensure we have the requested count by using higher quality images
  if (images.length < count) {
    const additionalImages = UnsplashImageService.getGalleryImages(industry, count * 2, brandVibe);
    return additionalImages.slice(0, count);
  }
  
  return images.slice(0, count);
}

function getQualityHeroImage(industry: string, brandVibe: BrandVibe = 'modern') {
  console.log('[aiContentGeneration] Getting quality hero image for industry:', industry, 'brandVibe:', brandVibe);
  
  const heroImage = UnsplashImageService.getHeroImage(industry, brandVibe);
  console.log('[aiContentGeneration] Retrieved hero image:', heroImage);
  
  return heroImage;
}

function getQualityTestimonialAvatars(count: number) {
  console.log('[aiContentGeneration] Getting quality testimonial avatars, count:', count);
  
  const avatars = UnsplashImageService.getTestimonialAvatars(count);
  console.log('[aiContentGeneration] Retrieved avatars:', avatars.length);
  
  return avatars;
}

export async function generateChairLinkedContent(
  request: ChairLinkedContentRequest
): Promise<ChairLinkedContentResponse> {
  try {
    console.log('[aiContentGeneration] Starting content generation with request:', request);
    
    const { data, error } = await supabase.functions.invoke('generate-chairlinked-content', {
      body: request,
    });

    if (error) {
      console.error('[aiContentGeneration] Edge function error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }

    if (!data) {
      throw new Error('No content generated');
    }

    console.log('[aiContentGeneration] Generated content from AI:', data);

    // Use quality-first image generation with service context - REDUCED FROM 10 TO 6
    const galleryImages = getQualityIndustryImages(request.industry, 6, request.brandVibe);
    const heroImage = getQualityHeroImage(request.industry, request.brandVibe);

    console.log('[aiContentGeneration] Generated quality images:', {
      heroImage,
      galleryCount: galleryImages.length
    });

    // Enhanced testimonials with quality avatars and service context
    const testimonials = Array.isArray(data.testimonials)
      ? data.testimonials.map((testimonial: any, index: number) => {
          const avatars = getQualityTestimonialAvatars(data.testimonials.length);
          return {
            ...testimonial,
            avatarUrl: avatars[index] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`,
            service: request.services[index % request.services.length] || 'Service'
          };
        })
      : [];

    // Generate service-specific story images - Cap at 6 for quality
    let storyImages: string[] = [];
    if (request.services && request.services.length > 0) {
      storyImages = UnsplashImageService.getStoryImages(
        request.industry, 
        Math.min(request.services.length, 6), 
        request.brandVibe
      );
      console.log('[aiContentGeneration] Generated story images:', storyImages.length);
    }

    // Create service-aware stories with quality images - Limit to 6
    const storyCount = Math.min(6, request.services.length);
    console.log('[aiContentGeneration] Creating', storyCount, 'service-aware stories');

    const stories = request.services.slice(0, storyCount).map((service, index) => ({
      id: index + 1,
      image: storyImages[index] || galleryImages[index % galleryImages.length] || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      title: service,
      ctaText: `Book ${service}`
    }));

    console.log('[aiContentGeneration] Created service-aware stories:', stories);

    // Enhanced services with better context
    const enhancedServices = Array.isArray(data.services) 
      ? data.services.map((service: any, index: number) => ({
          ...service,
          service: request.services[index] || service.title,
          featured: index === 0
        }))
      : request.services.map((serviceName, index) => ({
          title: serviceName,
          description: `Professional ${serviceName.toLowerCase()} service`,
          price: '$75',
          duration: '60 min',
          featured: index === 0
        }));

    // Get service images for enhanced gallery context - Reduced count
    let serviceImages: string[] = [];
    if (request.services && request.services.length > 0) {
      serviceImages = UnsplashImageService.getServiceImages(
        request.industry, 
        request.services, 
        request.brandVibe
      );
    }

    const enhancedData = {
      ...data,
      galleryImages,
      heroImage,
      testimonials,
      serviceImages,
      storyImages,
      stories,
      services: enhancedServices,
      bookingLink: request.bookingLink,
      instagramHandle: request.instagramHandle,
      followerCount: request.followerCount,
      initialEngagement: request.initialEngagement,
    };

    console.log('[aiContentGeneration] Enhanced content with quality-first approach:', {
      heroImage: !!enhancedData.heroImage,
      galleryCount: enhancedData.galleryImages.length,
      storiesCount: enhancedData.stories.length,
      testimonialsCount: enhancedData.testimonials.length,
      servicesCount: enhancedData.services.length
    });

    return enhancedData as ChairLinkedContentResponse;
    
  } catch (error) {
    console.error('[aiContentGeneration] Content generation failed:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
}
