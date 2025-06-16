
export function transformToTemplate8Format(generatedConfig: any, businessName: string) {
  if (!generatedConfig) return null;

  let primary = "#8B5CF6";
  let accent = "#EC4899";
  if (generatedConfig.colorScheme) {
    if (Array.isArray(generatedConfig.colorScheme)) {
      primary = generatedConfig.colorScheme[0] ?? primary;
      accent = generatedConfig.colorScheme[1] ?? primary;
    } else {
      primary = generatedConfig.colorScheme;
      accent = generatedConfig.colorScheme;
    }
  }

  return {
    businessName: businessName,
    brandColor: primary,
    backgroundColor: "#ffffff",
    fontFamily: generatedConfig.fontFamily || "inter",
    heroImages: generatedConfig.heroImage ? [generatedConfig.heroImage] : [
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
      "https://images.unsplash.com/photo-1557683311-eac922347aa1"
    ],
    headline: generatedConfig.headline || `Welcome to ${businessName}`,
    description: generatedConfig.subheadline || generatedConfig.description || "Creating amazing experiences",
    ctaText: generatedConfig.ctaText || "Book Now",
    services: generatedConfig.services || [
      {
        title: "Professional Service",
        description: "High-quality service delivery",
        price: "Starting at $99"
      }
    ],
    images: generatedConfig.galleryImages?.map((img: string, idx: number) => ({
      id: idx + 1,
      image: img,
      likes: Math.floor(Math.random() * 300) + 50,
      comments: Math.floor(Math.random() * 20) + 5,
      caption: `Amazing work #${idx + 1} ✨`,
      user: businessName.toLowerCase().replace(/\s/g, "_"),
      category: "Creative Work"
    })) || [],
    testimonials: generatedConfig.testimonials || [
      {
        name: "Sarah Johnson",
        text: "Outstanding service and professional results!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc"
      }
    ],
    contactEmail: generatedConfig.contactInfo?.email || `hello@${businessName.toLowerCase().replace(/\s/g, "")}.com`,
    phoneNumber: generatedConfig.contactInfo?.phone || "(555) 123-4567",
    instagramHandle: `@${businessName.toLowerCase().replace(/\s/g, "_")}`,
    availableCategories: [
      { id: "creative-work", name: "Creative Work", color: primary },
      { id: "behind-scenes", name: "Behind the Scenes", color: "#10B981" },
      { id: "client-work", name: "Client Work", color: accent },
      { id: "featured", name: "Featured", color: "#F59E0B" }
    ]
  };
}
