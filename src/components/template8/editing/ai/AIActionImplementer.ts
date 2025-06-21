import { Template8Data } from '../../generator/types/GeneratorTypes';

export interface AIAction {
  type: 'create_component' | 'modify_section' | 'update_styling' | 'hide_section';
  section: string;
  data: any;
  description: string;
}

export class AIActionImplementer {
  static implementAction(action: AIAction, currentData: Template8Data, onUpdate: (updates: any) => void): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          switch (action.type) {
            case 'create_component':
              this.createComponent(action, currentData, onUpdate);
              break;
            case 'modify_section':
              this.modifySection(action, currentData, onUpdate);
              break;
            case 'update_styling':
              this.updateStyling(action, currentData, onUpdate);
              break;
            case 'hide_section':
              this.hideSection(action, currentData, onUpdate);
              break;
          }
          resolve(`Successfully ${action.description.toLowerCase()}`);
        } catch (error) {
          resolve(`Failed to ${action.description.toLowerCase()}: ${error}`);
        }
      }, 1000); // Simulate processing time
    });
  }

  private static createComponent(action: AIAction, currentData: Template8Data, onUpdate: (updates: any) => void) {
    const { section, data } = action;
    
    switch (data.componentType) {
      case 'before_after':
        this.createBeforeAfterComponent(section, currentData, onUpdate, data);
        break;
      case 'testimonial_carousel':
        this.createTestimonialCarousel(section, currentData, onUpdate, data);
        break;
      case 'contact_form':
        this.createContactForm(section, currentData, onUpdate, data);
        break;
      default:
        throw new Error(`Unknown component type: ${data.componentType}`);
    }
  }

  private static createBeforeAfterComponent(section: string, currentData: Template8Data, onUpdate: (updates: any) => void, data: any) {
    console.log('[AIActionImplementer] Creating before/after component for section:', section);
    console.log('[AIActionImplementer] Current data has keys:', Object.keys(currentData));
    
    // Add before/after data directly to pageData (not nested)
    const updates = {
      ...currentData,
      // Add before/after properties directly to Template8Data
      beforeImage: '',
      afterImage: '',
      beforeLabel: 'Before',
      afterLabel: 'After',
      // Hide stories section if replacing it
      storiesHidden: section === 'stories' ? true : false,
      // Ensure beforeAfter section is visible
      sectionOrder: currentData.sectionOrder || ['hero', 'beforeAfter', 'gallery', 'testimonials', 'booking', 'footer']
    };

    console.log('[AIActionImplementer] Calling onUpdate with updates:', {
      beforeImage: updates.beforeImage,
      afterImage: updates.afterImage,
      beforeLabel: updates.beforeLabel,
      afterLabel: updates.afterLabel,
      storiesHidden: updates.storiesHidden,
      sectionOrder: updates.sectionOrder
    });

    onUpdate(updates);
  }

  private static createTestimonialCarousel(section: string, currentData: Template8Data, onUpdate: (updates: any) => void, data: any) {
    const sampleTestimonials = [
      {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Satisfied Client',
        avatar: '',
        content: 'Absolutely stunning results! The transformation exceeded my expectations. Professional, skilled, and caring.',
        rating: 5,
        featured: true
      },
      {
        id: 2,
        name: 'Emily Davis',
        role: 'Regular Client',
        avatar: '',
        content: 'I love coming here! The attention to detail and personalized service makes all the difference.',
        rating: 5,
        featured: true
      },
      {
        id: 3,
        name: 'Jessica Miller',
        role: 'Happy Customer',
        avatar: '',
        content: 'The best experience I\'ve had! Professional, friendly, and the results speak for themselves.',
        rating: 5,
        featured: true
      },
      {
        id: 4,
        name: 'Amanda Wilson',
        role: 'Loyal Client',
        avatar: '',
        content: 'Incredible work every time. I wouldn\'t trust anyone else with my beauty needs.',
        rating: 5,
        featured: true
      },
      {
        id: 5,
        name: 'Rachel Brown',
        role: 'New Client',
        avatar: '',
        content: 'From the moment I walked in, I felt welcomed and cared for. The results are amazing!',
        rating: 5,
        featured: true
      }
    ];

    const updates = {
      ...currentData,
      testimonials: [...(currentData.testimonials || []), ...sampleTestimonials],
      testimonialsCarousel: {
        enabled: true,
        autoRotate: true,
        rotationSpeed: 5000,
        showRatings: true,
        showAvatars: true
      }
    };

    onUpdate(updates);
  }

  private static createContactForm(section: string, currentData: Template8Data, onUpdate: (updates: any) => void, data: any) {
    const updates = {
      ...currentData,
      contactForm: {
        id: 'contact-form',
        type: 'contact_form',
        title: 'Get In Touch',
        description: 'Ready to transform your look? Contact us today to schedule your appointment.',
        fields: [
          { id: 'name', label: 'Full Name', type: 'text', required: true },
          { id: 'email', label: 'Email Address', type: 'email', required: true },
          { id: 'phone', label: 'Phone Number', type: 'tel', required: false },
          { id: 'service', label: 'Service Interest', type: 'select', required: true, options: ['Hair Styling', 'Makeup', 'Photography', 'Other'] },
          { id: 'message', label: 'Message', type: 'textarea', required: true }
        ],
        submitText: 'Send Message',
        brandColor: currentData.brandColor || '#8B5CF6'
      }
    };

    onUpdate(updates);
  }

  private static modifySection(action: AIAction, currentData: Template8Data, onUpdate: (updates: any) => void) {
    const { section, data } = action;
    
    switch (section) {
      case 'hero':
        this.modifyHeroSection(currentData, onUpdate, data);
        break;
      case 'gallery':
        this.modifyGallerySection(currentData, onUpdate, data);
        break;
      default:
        throw new Error(`Cannot modify section: ${section}`);
    }
  }

  private static modifyHeroSection(currentData: Template8Data, onUpdate: (updates: any) => void, data: any) {
    const updates = {
      ...currentData,
      ...data
    };

    onUpdate(updates);
  }

  private static modifyGallerySection(currentData: Template8Data, onUpdate: (updates: any) => void, data: any) {
    const updates = {
      ...currentData,
      gallerySettings: {
        ...currentData.gallerySettings,
        ...data
      }
    };

    onUpdate(updates);
  }

  private static updateStyling(action: AIAction, currentData: Template8Data, onUpdate: (updates: any) => void) {
    const { data } = action;
    
    if (data.colorEnhancement) {
      this.enhanceColors(currentData, onUpdate, data.colorEnhancement);
    }
    
    if (data.gradient) {
      this.applyGradient(currentData, onUpdate, data.gradient);
    }
  }

  private static enhanceColors(currentData: Template8Data, onUpdate: (updates: any) => void, enhancement: any) {
    const currentColor = currentData.brandColor || '#8B5CF6';
    
    // Increase saturation by 20%
    const enhancedColor = this.increaseSaturation(currentColor, 0.2);
    
    const updates = {
      ...currentData,
      brandColor: enhancedColor,
      textColor: enhancement.textColor || currentData.textColor,
      headingColor: enhancement.headingColor || currentData.headingColor,
      colorEnhanced: true
    };

    onUpdate(updates);
  }

  private static applyGradient(currentData: Template8Data, onUpdate: (updates: any) => void, gradient: any) {
    const updates = {
      ...currentData,
      heroBackground: {
        type: 'gradient',
        gradient: gradient.colors || [`${currentData.brandColor || '#8B5CF6'}`, `${currentData.brandColor || '#8B5CF6'}80`],
        direction: gradient.direction || 'to-br'
      }
    };

    onUpdate(updates);
  }

  private static hideSection(action: AIAction, currentData: Template8Data, onUpdate: (updates: any) => void) {
    const { section } = action;
    
    const updates = {
      ...currentData,
      [`${section}Hidden`]: true
    };

    onUpdate(updates);
  }

  // Utility function to increase color saturation
  private static increaseSaturation(hex: string, amount: number): string {
    // Simple hex color saturation increase
    // Convert hex to HSL, increase saturation, convert back
    // This is a simplified version - in production, use a proper color library
    const num = parseInt(hex.replace('#', ''), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    
    // Simple saturation enhancement
    const enhancement = 1 + amount;
    const newR = Math.min(255, Math.round(r * enhancement));
    const newG = Math.min(255, Math.round(g * enhancement));
    const newB = Math.min(255, Math.round(b * enhancement));
    
    return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
  }
}

export default AIActionImplementer;