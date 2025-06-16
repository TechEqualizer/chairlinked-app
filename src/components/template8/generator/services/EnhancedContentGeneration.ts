import { generateChairLinkedContent } from "@/services/aiContentGeneration";
import { IndustryService } from "./IndustryService";
import { UnsplashImageService } from "@/services/unsplashImageService";
import { IndustryDesignSystem } from "../../design-system/services/IndustryDesignSystem";
import { IndustryThemeUtils } from "../../design-system/utils/industryThemeUtils";

export interface EnhancedGenerationRequest {
  businessName: string;
  industry: string;
  location?: string;
  tagline?: string;
  description?: string;
  brandColor?: string;
  services?: any[];
  useAdvancedGeneration?: boolean;
}

export class EnhancedContentGeneration {
  static async generateTemplate8Content(request: EnhancedGenerationRequest) {
    try {
      const content = await this.generateIndustryContent(request);
      
      return {
        success: true,
        data: content
      };
    } catch (error) {
      console.error('Template8 content generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate content'
      };
    }
  }

  static async generateIndustryContent(request: EnhancedGenerationRequest) {
    try {
      console.log('[EnhancedContentGeneration] Starting generation with request:', request);
      
      const industry = IndustryService.getIndustryById(request.industry);
      console.log('[EnhancedContentGeneration] Found industry config:', industry);

      // Get industry-specific design configuration
      const designConfig = IndustryDesignSystem.getDesignConfig(request.industry);
      console.log('[EnhancedContentGeneration] Applied industry design config:', designConfig);

      // Get industry-specific content
      const industryContent = IndustryService.generateIndustryContent(
        request.industry,
        request.businessName
      );
      console.log('[EnhancedContentGeneration] Generated industry content:', industryContent);

      let aiContent = null;
      
      // Generate AI content if requested
      if (request.useAdvancedGeneration) {
        console.log('[EnhancedContentGeneration] Generating AI content...');
        
        // Use services from request or fallback to industry defaults
        const servicesToUse = request.services?.length ? 
          request.services.map(s => s.title) : 
          industryContent?.services?.map(s => s.title) || [];
        
        console.log('[EnhancedContentGeneration] Services for AI generation:', servicesToUse);

        // Fix: Remove const assertion and use proper type
        const brandVibe = this.determineBrandVibeFromDesign(designConfig);

        const aiRequest = {
          businessName: request.businessName,
          industry: industry?.name || request.industry,
          city: request.location || '',
          brandVibe: brandVibe,
          services: servicesToUse,
          bookingLink: '',
          instagramHandle: '',
          followerCount: 1000,
          initialEngagement: {
            hearts: 150,
            comments: 25,
            saves: 40
          }
        };

        try {
          aiContent = await generateChairLinkedContent(aiRequest);
          console.log('[EnhancedContentGeneration] AI content generated:', aiContent);
        } catch (error) {
          console.error('[EnhancedContentGeneration] AI generation failed, continuing with industry content:', error);
        }
      }

      // Determine the brand vibe based on industry design config and brand color
      const brandVibe = this.determineBrandVibe(request.brandColor, industry);
      console.log('[EnhancedContentGeneration] Determined brand vibe:', brandVibe);

      // Generate curated images for the industry with quality-first approach
      const heroImage = this.getIndustryHeroImage(request.industry, brandVibe);
      const galleryImages = this.getIndustryGalleryImages(request.industry, 6, brandVibe);
      const storyImages = this.getIndustryStoryImages(request.industry, 6, brandVibe);

      console.log('[EnhancedContentGeneration] Generated images:', {
        heroImage,
        galleryCount: galleryImages.length,
        storyCount: storyImages.length
      });

      // Use services data to enhance testimonials and stories
      const enhancedServices = this.enhanceServicesWithImageData(
        request.services || industryContent?.services || industry?.defaultServices || [],
        request.industry,
        brandVibe
      );

      // Generate enhanced gallery with service-specific context
      const enhancedGalleryImages = this.generateServiceAwareGallery(
        galleryImages,
        enhancedServices,
        request.businessName
      );

      // Create service-specific stories
      const enhancedStories = this.generateServiceStories(
        enhancedServices,
        storyImages,
        request.businessName
      );

      // Generate enhanced testimonials based on actual services
      const enhancedTestimonials = this.generateServiceTestimonials(
        enhancedServices,
        industry,
        request.businessName
      );

      // Generate industry-specific CSS
      const industryCSS = IndustryThemeUtils.generateIndustryCSS(request.industry, request.brandColor);
      const requiredFonts = IndustryThemeUtils.getIndustryFontLoads(request.industry);

      // Merge all content sources with industry design system integration
      const finalContent = {
        businessName: request.businessName,
        industry: request.industry,
        tagline: request.tagline || industryContent?.tagline || aiContent?.heroTagline || industry?.taglineTemplates?.[0] || `Professional ${request.industry} Services`,
        description: request.description || aiContent?.aboutDescription || `Expert ${request.industry} services delivered with care and precision`,
        brandColor: request.brandColor || designConfig.colors.primary,
        
        // Industry design system integration
        designConfig,
        industryCSS,
        requiredFonts,
        
        // Enhanced services with image context
        services: enhancedServices,
        
        // Quality-first images
        heroImage: aiContent?.heroImage || heroImage,
        images: enhancedGalleryImages,
        
        // Service-aware stories
        stories: enhancedStories,
        
        // Service-enhanced testimonials
        testimonials: enhancedTestimonials,
        
        // Additional AI content if available
        ...(aiContent ? {
          socialProof: aiContent.socialProof,
          specialOffers: aiContent.specialOffers,
          headline: aiContent.headline,
          subheadline: aiContent.subheadline
        } : {
          headline: industryContent?.headline || `Expert ${request.industry} Services`,
          subheadline: industryContent?.subheadline || 'Professional services delivered with expertise and care'
        })
      };

      console.log('[EnhancedContentGeneration] Final content generated with industry design system:', {
        businessName: finalContent.businessName,
        servicesCount: finalContent.services.length,
        imagesCount: finalContent.images.length,
        storiesCount: finalContent.stories.length,
        testimonialsCount: finalContent.testimonials.length,
        designConfig: !!finalContent.designConfig,
        requiredFonts: finalContent.requiredFonts?.length || 0
      });

      return finalContent;
    } catch (error) {
      console.error('Enhanced content generation failed:', error);
      throw new Error('Failed to generate enhanced content');
    }
  }

  private static determineBrandVibeFromDesign(designConfig: any): 'luxury' | 'modern' | 'feminine' | 'bold' {
    if (designConfig.mood.formality === 'luxury') return 'luxury';
    if (designConfig.mood.energy === 'bold') return 'bold';
    if (designConfig.mood.warmth === 'warm' && designConfig.mood.energy === 'elegant') return 'feminine';
    return 'modern';
  }

  private static determineBrandVibe(brandColor?: string, industry?: any): 'luxury' | 'modern' | 'feminine' | 'bold' {
    if (!brandColor) return 'modern';
    
    // Convert hex to determine vibe
    const color = brandColor.toLowerCase();
    
    if (color.includes('gold') || color.includes('8B4513') || color.includes('FFD700')) {
      return 'luxury';
    } else if (color.includes('pink') || color.includes('purple') || color.includes('FF69B4')) {
      return 'feminine';
    } else if (color.includes('red') || color.includes('orange') || color.includes('FF4500')) {
      return 'bold';
    } else {
      return 'modern';
    }
  }

  private static getIndustryHeroImage(industryId: string, brandVibe: 'luxury' | 'modern' | 'feminine' | 'bold' = 'modern'): string {
    return UnsplashImageService.getHeroImage(industryId, brandVibe);
  }

  private static getIndustryGalleryImages(industryId: string, count: number, brandVibe: 'luxury' | 'modern' | 'feminine' | 'bold' = 'modern'): string[] {
    return UnsplashImageService.getGalleryImages(industryId, count, brandVibe);
  }

  private static getIndustryStoryImages(industryId: string, count: number, brandVibe: 'luxury' | 'modern' | 'feminine' | 'bold' = 'modern'): string[] {
    return UnsplashImageService.getStoryImages(industryId, count, brandVibe);
  }

  private static enhanceServicesWithImageData(services: any[], industry: string, brandVibe: any) {
    return services.map((service, index) => ({
      ...service,
      id: index + 1,
      featured: index === 0,
      category: 'Premium Service'
    }));
  }

  private static generateServiceAwareGallery(images: string[], services: any[], businessName: string) {
    // Ensure we cap at maximum 6 images for quality focus
    const maxImages = Math.min(images.length, 6);
    const selectedImages = images.slice(0, maxImages);
    
    return selectedImages.map((image, index) => {
      const service = services[index % services.length];
      return {
        id: index + 1,
        image,
        likes: Math.floor(Math.random() * 200) + 100, // Higher engagement for quality sites
        comments: Math.floor(Math.random() * 50) + 15,
        caption: service ? `Professional ${service.title} by ${businessName}` : `Quality work by ${businessName}`,
        user: businessName.toLowerCase().replace(/\s/g, '_'),
        category: service?.title || 'Portfolio'
      };
    });
  }

  private static generateServiceStories(services: any[], images: string[], businessName: string) {
    return services.slice(0, 6).map((service, index) => ({
      id: index + 1,
      image: images[index] || images[0] || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      title: service.title,
      ctaText: `Book ${service.title}`,
      items: []
    }));
  }

  private static generateServiceTestimonials(services: any[], industry: any, businessName: string) {
    const serviceNames = services.map(s => s.title);
    
    return (industry?.testimonialTemplates || []).map((template: any, index: number) => ({
      ...template,
      id: index + 1,
      avatarUrl: UnsplashImageService.getTestimonialAvatars(industry?.testimonialTemplates?.length || 3)[index] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${template.name}`,
      location: 'Verified Client',
      service: serviceNames[index % serviceNames.length],
      featured: index === 0
    }));
  }
}
