
import { Template8Data } from '../hooks/useTemplate8Data';

export const defaultTemplate8Data: Template8Data = {
  businessName: "Creative Studio",
  tagline: "Where Creativity Meets Innovation",
  description: "We transform ideas into stunning digital experiences that captivate and inspire.",
  heroImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
  heroImages: [
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
    "https://images.unsplash.com/photo-1557683311-eac922347aa1",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  ],
  images: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      likes: 247,
      dislikes: 12,
      caption: "Creative direction at its finest ✨ Bringing bold visions to life #creative #direction",
      user: "creative_studio",
      category: "Creative Direction"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692",
      likes: 189,
      dislikes: 8,
      caption: "Behind the scenes of our creative process 📸 Where the magic happens",
      user: "creative_studio",
      category: "Behind the Scenes"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      likes: 312,
      dislikes: 15,
      caption: "Brand strategy collaboration 🤝 Building authentic brand identities #branding",
      user: "creative_studio",
      category: "Brand Strategy Portfolio"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
      likes: 156,
      dislikes: 6,
      caption: "Digital innovation meets creative design 💡 #digital #innovation",
      user: "creative_studio",
      category: "Creative Direction"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      likes: 203,
      dislikes: 9,
      caption: "Digital design workspace ⚡ Creating seamless user experiences #ux #digital",
      user: "creative_studio",
      category: "Digital Design Showcase"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      likes: 278,
      dislikes: 11,
      caption: "Digital creativity in action 🎨 Crafting beautiful interfaces #ui #digital",
      user: "creative_studio",
      category: "Digital Design Showcase"
    }
  ],
  availableCategories: [
    { id: "brand-strategy", name: "Brand Strategy Portfolio", color: "#8B5CF6" },
    { id: "digital-design", name: "Digital Design Showcase", color: "#3B82F6" },
    { id: "creative-direction", name: "Creative Direction", color: "#F59E0B" },
    { id: "behind-scenes", name: "Behind the Scenes", color: "#10B981" }
  ],
  stories: [],
  testimonials: [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc",
      content: "Working with this team was absolutely amazing. They transformed our vision into reality.",
      rating: 5,
      featured: true
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Founder, DesignCo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      content: "Professional, creative, and delivered beyond our expectations.",
      rating: 5,
      featured: false
    }
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
  brandColor: "#8B5CF6",
  navbarBackgroundColor: "#ffffff",
  fontFamily: "Inter, sans-serif",
  backgroundColor: "#ffffff",
  contactEmail: "hello@creativestudio.com",
  phoneNumber: "(555) 123-4567",
  instagramHandle: "@creative_studio",
  bookingLink: "https://calendly.com/creativestudio",
  ctaText: "Get Started"
};
