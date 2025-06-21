
import { useState, useCallback } from 'react';
import { defaultTemplate8Data } from '../config/defaultTemplate8Data';

export interface Template8GalleryImage {
  id: number;
  image: string;
  mediaType?: 'image' | 'video'; // NEW: Add media type
  likes: number;
  dislikes: number; // NEW: Add dislikes instead of comments
  bookings?: number; // NEW: Add bookings count
  caption: string;
  user: string;
  category: string;
}

export interface Template8Category {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Template8Service {
  title: string;
  description: string;
  price?: string;
  image?: string;
  tags?: string[];
}

export interface Template8Data {
  businessName: string;
  tagline: string;
  description: string;
  heroImage?: string | null; // Allow explicit null
  heroImages: string[];
  images: Template8GalleryImage[];
  availableCategories: Template8Category[];
  stories: any[];
  testimonials: any[];
  services: Template8Service[];
  brandColor: string;
  navbarBackgroundColor: string;
  fontFamily: string;
  backgroundColor: string;
  contactEmail?: string;
  phoneNumber?: string;
  bookingLink?: string;
  instagramHandle?: string;
  ctaText?: string;
  _heroImageExplicitlySet?: boolean; // Track if user has made explicit choice
  // Before/After section properties
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const useTemplate8Data = (businessName: string, initialData?: Partial<Template8Data>) => {
  const [pageData, setPageData] = useState<Template8Data>(() => {
    // If initial data is provided (from ChairLinked), use it to override defaults
    const baseData = {
      ...defaultTemplate8Data,
      businessName,
      navbarBackgroundColor: "#ffffff",
      heroImages: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
        "https://images.unsplash.com/photo-1557683311-eac922347aa1",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
      ],
      services: [
        {
          title: "Brand Strategy",
          description: "Complete brand identity and strategy development",
          price: "Starting at $2,500"
        },
        {
          title: "Digital Design",
          description: "Web design, UI/UX, and digital experiences",
          price: "Starting at $1,500"
        },
        {
          title: "Creative Direction",
          description: "Art direction and creative campaign development",
          price: "Starting at $3,000"
        }
      ],
      backgroundColor: "#ffffff",
      contactEmail: "hello@creativestudio.com",
      phoneNumber: "(555) 123-4567",
      instagramHandle: "@creative_studio",
      availableCategories: [
        { id: "brand-strategy", name: "Brand Strategy Portfolio", color: "#8B5CF6" },
        { id: "digital-design", name: "Digital Design Showcase", color: "#3B82F6" },
        { id: "creative-direction", name: "Creative Direction", color: "#F59E0B" },
        { id: "behind-scenes", name: "Behind the Scenes", color: "#10B981" }
      ],
      images: [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
          likes: 247,
          dislikes: 12,
          bookings: 15,
          caption: "Creative direction at its finest ✨ Bringing bold visions to life #creative #direction",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Creative Direction"
        },
        {
          id: 2,
          image: "https://images.unsplash.com/photo-1551434678-e076c223a692",
          likes: 189,
          dislikes: 8,
          bookings: 12,
          caption: "Behind the scenes of our creative process 📸 Where the magic happens",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Behind the Scenes"
        },
        {
          id: 3,
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
          likes: 312,
          dislikes: 15,
          bookings: 28,
          caption: "Brand strategy collaboration 🤝 Building authentic brand identities #branding",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Brand Strategy Portfolio"
        },
        {
          id: 4,
          image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
          likes: 156,
          dislikes: 6,
          bookings: 9,
          caption: "Digital innovation meets creative design 💡 #digital #innovation",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Creative Direction"
        },
        {
          id: 5,
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
          likes: 203,
          dislikes: 9,
          bookings: 18,
          caption: "Digital design workspace ⚡ Creating seamless user experiences #ux #digital",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Digital Design Showcase"
        },
        {
          id: 6,
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
          likes: 278,
          dislikes: 11,
          bookings: 22,
          caption: "Digital creativity in action 🎨 Crafting beautiful interfaces #ui #digital",
          user: businessName.toLowerCase().replace(/\s/g, "_"),
          category: "Digital Design Showcase"
        }
      ]
    };

    if (initialData) {
      const result = { ...baseData, ...initialData };
      
      // Only set heroImage from heroImages if:
      // 1. No heroImage is provided in initialData
      // 2. User hasn't explicitly set/removed it
      // 3. This is a brand new site
      if (!result.hasOwnProperty('heroImage') && !result._heroImageExplicitlySet && result.heroImages?.[0]) {
        result.heroImage = result.heroImages[0];
      }
      
      return result;
    }
    
    // For brand new sites without initial data, set first heroImage
    if (baseData.heroImages?.[0]) {
      baseData.heroImage = baseData.heroImages[0];
    }
    
    return baseData;
  });

  const handleUpdate = useCallback((updates: Partial<Template8Data>) => {
    console.log('[useTemplate8Data] Updating with:', updates);
    
    setPageData(prev => {
      const newData = { ...prev, ...updates };
      
      // If heroImage is being explicitly set or removed, mark it as explicitly set
      if (updates.hasOwnProperty('heroImage')) {
        newData._heroImageExplicitlySet = true;
        console.log('[useTemplate8Data] Hero image explicitly set to:', updates.heroImage);
      }
      
      return newData;
    });
  }, []);

  const handleSave = useCallback(() => {
    console.log('Saving Template 8 data:', pageData);
    // Implementation for saving data
  }, [pageData]);

  return {
    pageData,
    handleUpdate,
    handleSave
  };
};
