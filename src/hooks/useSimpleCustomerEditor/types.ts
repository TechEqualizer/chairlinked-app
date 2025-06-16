
export interface Story {
  id: string;
  imageUrl: string;
  title: string;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatarUrl?: string;
  location?: string;
  service?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
}

export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
}

export interface SimpleEditorData {
  businessName: string;
  tagline: string;
  headline: string;
  subheadline: string;
  description: string;
  ctaText: string;
  phone: string;
  email: string;
  primaryColor: string;
  logoUrl?: string;
  heroImageUrl?: string;
  
  // Stories section
  stories: Story[];
  
  // Gallery section
  gallery: GalleryItem[];
  
  // Testimonials section
  testimonials: Testimonial[];
  
  // Contact/Booking section
  address?: string;
  businessHours?: BusinessHours;
  socialLinks?: SocialLinks;
  bookingUrl?: string;
  
  // Additional business info
  services?: string[];
  specialties?: string[];
}

export interface GeneratedConfig {
  headline?: string;
  subheadline?: string;
  tagline?: string;
  description?: string;
  ctaText?: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  colors?: {
    primary?: string;
  };
  logoUrl?: string;
  heroImageUrl?: string;
  stories?: Story[];
  gallery?: GalleryItem[];
  testimonials?: Testimonial[];
  socialLinks?: SocialLinks;
  businessHours?: BusinessHours;
  services?: string[];
  specialties?: string[];
  bookingUrl?: string;
}

export interface FormData {
  businessName?: string;
  tagline?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  ctaText?: string;
  phone?: string;
  email?: string;
  primaryColor?: string;
  address?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  stories?: Story[];
  gallery?: GalleryItem[];
  testimonials?: Testimonial[];
  socialLinks?: SocialLinks;
  businessHours?: BusinessHours;
  services?: string[];
  specialties?: string[];
  bookingUrl?: string;
}
