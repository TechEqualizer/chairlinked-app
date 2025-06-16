
import { Template8GalleryImage, Template8Category } from "../../hooks/useTemplate8Data";

interface GalleryImageManagerProps {
  images: Template8GalleryImage[];
  categories: Template8Category[];
  pageData: any;
  onUpdate: (updates: any) => void;
}

export const useGalleryImageManager = ({ images, categories, pageData, onUpdate }: GalleryImageManagerProps) => {
  const handleImageUpdate = (index: number, url: string, mediaType: 'image' | 'video' = 'image') => {
    console.log('[GalleryImageManager] Updating image at index:', index, 'with URL:', url);
    
    // Add safety check for valid index
    if (index < 0 || index >= images.length) {
      console.error('[GalleryImageManager] Invalid image index:', index);
      return;
    }

    try {
      const updatedImages = [...images];
      updatedImages[index] = { 
        ...updatedImages[index], 
        image: url,
        mediaType: mediaType
      };
      onUpdate({ images: updatedImages });
    } catch (error) {
      console.error('[GalleryImageManager] Error updating image:', error);
    }
  };

  const handleCaptionUpdate = (index: number, caption: string) => {
    console.log('[GalleryImageManager] Updating caption at index:', index);
    
    // Add safety check for valid index
    if (index < 0 || index >= images.length) {
      console.error('[GalleryImageManager] Invalid caption index:', index);
      return;
    }

    try {
      const updatedImages = [...images];
      updatedImages[index] = { ...updatedImages[index], caption };
      onUpdate({ images: updatedImages });
    } catch (error) {
      console.error('[GalleryImageManager] Error updating caption:', error);
    }
  };

  const handleCategoryUpdate = (index: number, categoryName: string) => {
    console.log('[GalleryImageManager] Updating category at index:', index, 'to:', categoryName);
    
    // Add safety check for valid index
    if (index < 0 || index >= images.length) {
      console.error('[GalleryImageManager] Invalid category index:', index);
      return;
    }

    try {
      const updatedImages = [...images];
      updatedImages[index] = { ...updatedImages[index], category: categoryName };
      onUpdate({ images: updatedImages });
    } catch (error) {
      console.error('[GalleryImageManager] Error updating category:', error);
    }
  };

  const handleAddCategory = (categoryName: string) => {
    console.log('[GalleryImageManager] Adding new category:', categoryName);
    
    // Validate category name
    if (!categoryName || typeof categoryName !== 'string' || categoryName.trim() === '') {
      console.error('[GalleryImageManager] Invalid category name:', categoryName);
      return;
    }

    // Check if category already exists
    const existingCategory = categories.find(cat => cat.name === categoryName.trim());
    if (existingCategory) {
      console.warn('[GalleryImageManager] Category already exists:', categoryName);
      return;
    }

    try {
      const newCategory: Template8Category = {
        id: `category-${Date.now()}`,
        name: categoryName.trim(),
        color: pageData.brandColor || '#8B5CF6'
      };
      const updatedCategories = [...categories, newCategory];
      console.log('[GalleryImageManager] Updated categories:', updatedCategories);
      onUpdate({ 
        availableCategories: updatedCategories
      });
    } catch (error) {
      console.error('[GalleryImageManager] Error adding category:', error);
    }
  };

  const handleUpdateCategories = (newCategories: Template8Category[]) => {
    console.log('[GalleryImageManager] Updating all categories:', newCategories);
    
    try {
      // Validate that we have at least one category
      if (!newCategories || newCategories.length === 0) {
        console.warn('[GalleryImageManager] Cannot remove all categories. At least one category is required.');
        return;
      }

      // Filter and validate images - remove any null/undefined entries
      const validImages = images.filter(img => img != null && typeof img === 'object');
      console.log('[GalleryImageManager] Valid images found:', validImages.length, 'out of', images.length);

      // When categories are updated, we also need to update any images that reference removed categories
      const categoryNames = newCategories.map(cat => cat.name);
      const defaultCategory = newCategories[0]?.name || "Uncategorized";
      
      const updatedImages = validImages.map(img => {
        // Additional safety check for img properties
        if (!img || !img.category) {
          console.warn('[GalleryImageManager] Found invalid image object:', img);
          return {
            ...img,
            category: defaultCategory
          };
        }

        if (!categoryNames.includes(img.category)) {
          // If the image's category was removed, assign it to the first available category
          console.log('[GalleryImageManager] Reassigning image from removed category:', img.category, 'to:', defaultCategory);
          return {
            ...img,
            category: defaultCategory
          };
        }
        return img;
      });

      // Update both categories and images if needed
      const updates: any = { availableCategories: newCategories };
      if (JSON.stringify(updatedImages) !== JSON.stringify(validImages)) {
        updates.images = updatedImages;
        console.log('[GalleryImageManager] Also updating images due to category changes');
      }
      
      onUpdate(updates);
    } catch (error) {
      console.error('[GalleryImageManager] Error updating categories:', error);
    }
  };

  const handleAddImage = (mediaType: 'image' | 'video' = 'image') => {
    console.log('[GalleryImageManager] Adding new image with mediaType:', mediaType);
    
    try {
      const defaultMedia = mediaType === 'video' 
        ? "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
        : "https://images.unsplash.com/photo-1498050108023-c5249f4df085";
        
      const newImage: Template8GalleryImage = {
        id: Math.max(0, ...images.map(img => img?.id || 0)) + 1,
        image: defaultMedia,
        mediaType: mediaType,
        likes: Math.floor(Math.random() * 200) + 50,
        dislikes: Math.floor(Math.random() * 20) + 5,
        caption: `New creative ${mediaType} ✨ #design #creative`,
        user: pageData.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
        category: categories[0]?.name || "Creative Work"
      };
      
      // Filter out any null images before adding the new one
      const validImages = images.filter(img => img != null);
      onUpdate({ images: [...validImages, newImage] });
    } catch (error) {
      console.error('[GalleryImageManager] Error adding image:', error);
    }
  };

  const handleRemoveImage = (index: number) => {
    console.log('[GalleryImageManager] Removing image at index:', index);
    
    // Add safety check for valid index
    if (index < 0 || index >= images.length) {
      console.error('[GalleryImageManager] Invalid remove index:', index);
      return;
    }

    try {
      const updatedImages = images.filter((_, i) => i !== index);
      onUpdate({ images: updatedImages });
    } catch (error) {
      console.error('[GalleryImageManager] Error removing image:', error);
    }
  };

  return {
    handleImageUpdate,
    handleCaptionUpdate,
    handleCategoryUpdate,
    handleAddCategory,
    handleUpdateCategories,
    handleAddImage,
    handleRemoveImage
  };
};
