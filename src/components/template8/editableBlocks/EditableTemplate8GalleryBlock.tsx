
import React from "react";
import { Template8GalleryImage, Template8Category } from "../hooks/useTemplate8Data";
import { useGalleryImageManager } from "./components/GalleryImageManager";
import GalleryPreviewView from "./components/GalleryPreviewView";

interface EditableTemplate8GalleryBlockProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSelectItem?: (index: number) => void;
  isProductionPreview?: boolean;
}

const EditableTemplate8GalleryBlock: React.FC<EditableTemplate8GalleryBlockProps> = ({
  pageData,
  onUpdate,
  onSelectItem,
  isProductionPreview = false
}) => {
  console.log('[EditableTemplate8GalleryBlock] Render with data:', {
    pageData: pageData ? Object.keys(pageData) : null,
    hasImages: !!pageData?.images,
    imagesLength: pageData?.images?.length,
    isProductionPreview
  });

  // Ensure images array exists with robust fallback and validation - IMPROVED FALLBACK WITH 4-5 QUALITY IMAGES
  const images: Template8GalleryImage[] = React.useMemo(() => {
    try {
      const rawImages = pageData?.images;
      
      if (!rawImages || !Array.isArray(rawImages)) {
        console.log('[EditableTemplate8GalleryBlock] No valid images array, using quality fallback');
        return [
          {
            id: 1,
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
            mediaType: "image",
            likes: 247,
            dislikes: 12,
            caption: "Latest creative project showcase ✨ #design #creative",
            user: pageData?.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
            category: "Creative Work"
          },
          {
            id: 2,
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692",
            mediaType: "image",
            likes: 189,
            dislikes: 8,
            caption: "Behind the scenes of our studio work 📸",
            user: pageData?.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
            category: "Behind the Scenes"
          },
          {
            id: 3,
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
            mediaType: "image",
            likes: 312,
            dislikes: 15,
            caption: "Client collaboration at its finest! 🤝 #teamwork",
            user: pageData?.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
            category: "Client Work"
          },
          {
            id: 4,
            image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
            mediaType: "image",
            likes: 201,
            dislikes: 9,
            caption: "Professional workspace and tools 🔧",
            user: pageData?.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
            category: "Workspace"
          },
          {
            id: 5,
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
            mediaType: "image",
            likes: 178,
            dislikes: 7,
            caption: "Attention to detail in every project ⚡",
            user: pageData?.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
            category: "Detail Work"
          }
        ];
      }

      // Validate and transform each image object - CAP AT 6 IMAGES MAXIMUM
      const processedImages = rawImages.map((img: any, index: number) => {
        try {
          // Handle both string URLs and object formats
          const imageUrl = typeof img === 'string' ? img : img?.image || img?.url;
          
          if (!imageUrl) {
            console.warn(`[EditableTemplate8GalleryBlock] Invalid image at index ${index}:`, img);
            return null;
          }

          return {
            id: img?.id || index + 1,
            image: imageUrl,
            mediaType: img?.mediaType || "image",
            likes: img?.likes || Math.floor(Math.random() * 300) + 50,
            dislikes: img?.dislikes || Math.floor(Math.random() * 20) + 5,
            caption: img?.caption || `Professional work showcase #${index + 1}`,
            user: img?.user || pageData?.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
            category: img?.category || "Portfolio"
          };
        } catch (error) {
          console.error(`[EditableTemplate8GalleryBlock] Error processing image at index ${index}:`, error);
          return null;
        }
      }).filter(Boolean); // Remove any null entries

      // Cap at 6 images maximum for quality focus
      return processedImages.slice(0, 6);
    } catch (error) {
      console.error('[EditableTemplate8GalleryBlock] Error processing images:', error);
      return [];
    }
  }, [pageData?.images, pageData?.businessName]);

  console.log('[EditableTemplate8GalleryBlock] Processed images:', {
    count: images.length,
    firstImage: images[0]?.image,
    sampleImage: images[0]
  });

  // In production preview mode, disable all interactions
  const handleUpdate = isProductionPreview ? () => {} : onUpdate;
  const handleSelectItem = isProductionPreview ? () => {} : onSelectItem;

  // If no images after processing, show loading or empty state
  if (!images || images.length === 0) {
    return (
      <div className="w-full py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Gallery Loading...</h3>
          <p className="text-gray-500">Setting up your portfolio showcase</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isProductionPreview ? "gallery-production-preview-mode" : ""}>
      {isProductionPreview && (
        <style>{`
          .gallery-production-preview-mode .gallery-item {
            cursor: default !important;
          }
          
          .gallery-production-preview-mode .gallery-item:hover {
            transform: none !important;
          }
          
          .gallery-production-preview-mode .gallery-interactions button {
            pointer-events: none !important;
            cursor: default !important;
          }
          
          .gallery-production-preview-mode .editable-element,
          .gallery-production-preview-mode [contentEditable] {
            pointer-events: none !important;
          }
        `}</style>
      )}
      <GalleryPreviewView
        images={images}
        businessName={pageData?.businessName || "Creative Studio"}
        brandColor={pageData?.brandColor}
        onUpdate={handleUpdate}
        onSelectItem={handleSelectItem}
        pageData={pageData}
        isEditMode={!isProductionPreview}
      />
    </div>
  );
};

export default EditableTemplate8GalleryBlock;
