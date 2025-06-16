
import React from "react";
import GallerySectionEditor from "../../sections/GallerySectionEditor";

export const gallerySection = {
  id: 'gallery', 
  name: 'Gallery', 
  component: ({ pageData, onUpdate }: any) => {
    console.log('[gallerySection] Rendering with pageData:', {
      hasPageData: !!pageData,
      hasImages: !!pageData?.images,
      imagesLength: pageData?.images?.length,
      businessName: pageData?.businessName
    });

    return (
      <GallerySectionEditor
        pageData={{
          ...pageData,
          // Ensure we have fallback images if none exist
          images: pageData?.images?.length > 0 ? pageData.images : [
            {
              id: 1,
              image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
              mediaType: "image",
              likes: 247,
              dislikes: 18,
              caption: "Creative direction at its finest ✨ Bringing bold visions to life #creative #direction",
              user: pageData?.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
              category: "Creative Direction"
            },
            {
              id: 2,
              image: "https://images.unsplash.com/photo-1551434678-e076c223a692",
              mediaType: "image",
              likes: 189,
              dislikes: 12,
              caption: "Behind the scenes of our creative process 📸 Where the magic happens",
              user: pageData?.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
              category: "Behind the Scenes"
            },
            {
              id: 3,
              image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
              mediaType: "image",
              likes: 312,
              dislikes: 24,
              caption: "Brand strategy collaboration 🤝 Building authentic brand identities #branding",
              user: pageData?.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
              category: "Brand Strategy Portfolio"
            }
          ],
          // Ensure we have service-aligned categories
          availableCategories: pageData?.availableCategories?.length > 0 ? pageData.availableCategories : [
            { id: "brand-strategy", name: "Brand Strategy Portfolio", color: "#8B5CF6" },
            { id: "digital-design", name: "Digital Design Showcase", color: "#3B82F6" },
            { id: "creative-direction", name: "Creative Direction", color: "#F59E0B" },
            { id: "behind-scenes", name: "Behind the Scenes", color: "#10B981" }
          ]
        }}
        onUpdate={onUpdate}
      />
    );
  }
};
