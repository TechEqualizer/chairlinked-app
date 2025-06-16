
import React, { useState } from "react";
import { motion } from "framer-motion";
import SectionEditorWrapper from "../components/SectionEditorWrapper";
import EditableTemplate8GalleryBlock from "../../editableBlocks/EditableTemplate8GalleryBlock";
import GalleryVerticalToolbar from "../components/GalleryVerticalToolbar";
import { useGalleryImageManager } from "../../editableBlocks/components/GalleryImageManager";
import { useUniversalEditing } from "../hooks/useUniversalEditing";
import { Template8GalleryImage, Template8Category } from "../../hooks/useTemplate8Data";

interface GallerySectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const GallerySectionEditor: React.FC<GallerySectionEditorProps> = ({ 
  pageData, 
  onUpdate
}) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | undefined>(undefined);

  const {
    isDirty,
    isAutoSaving,
    saveChanges,
    handleUpdate
  } = useUniversalEditing({ pageData, onUpdate });

  // Ensure images array exists with fallback
  const images: Template8GalleryImage[] = pageData.images || [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      likes: 247,
      dislikes: 12,
      caption: "Latest creative project showcase ✨ #design #creative",
      user: pageData.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
      category: "Creative Work"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692",
      likes: 189,
      dislikes: 8,
      caption: "Behind the scenes of our studio work 📸",
      user: pageData.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
      category: "Behind the Scenes"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      likes: 312,
      dislikes: 15,
      caption: "Client collaboration at its finest! 🤝 #teamwork",
      user: pageData.businessName?.toLowerCase().replace(/\s/g, "_") || "creative_studio",
      category: "Client Work"
    }
  ];

  // Ensure categories array exists with fallback
  const categories: Template8Category[] = pageData.availableCategories || [
    { id: "creative-work", name: "Creative Work", color: pageData.brandColor || "#8B5CF6" },
    { id: "behind-scenes", name: "Behind the Scenes", color: "#10B981" },
    { id: "client-work", name: "Client Work", color: "#F59E0B" }
  ];

  const { 
    handleImageUpdate, 
    handleCaptionUpdate,
    handleCategoryUpdate,
    handleAddCategory,
    handleUpdateCategories,
    handleAddImage, 
    handleRemoveImage 
  } = useGalleryImageManager({
    images,
    categories,
    pageData,
    onUpdate: handleUpdate
  });

  return (
    <SectionEditorWrapper sectionName="Portfolio Gallery">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden"
           style={{
             background: pageData.brandColor ? 
               `linear-gradient(135deg, ${pageData.brandColor}08, ${pageData.brandColor}15, ${pageData.brandColor}08)` : 
               'linear-gradient(135deg, #f9fafb, #f3f4f6, #f9fafb)'
           }}>
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-40 left-40 w-72 h-72 border border-gray-200/30 rounded-full"
            style={{ borderColor: pageData.brandColor ? `${pageData.brandColor}30` : undefined }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute bottom-40 right-40 w-56 h-56 rounded-full blur-3xl"
            style={{
              background: pageData.brandColor ? 
                `linear-gradient(to right, ${pageData.brandColor}10, ${pageData.brandColor}20)` : 
                'linear-gradient(to right, #8B5CF610, #8B5CF620)'
            }}
          />
        </div>

        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Portfolio Gallery Section</span>
          </div>
        </motion.div>

        {/* Vertical Toolbar */}
        <GalleryVerticalToolbar
          images={images}
          categories={categories}
          onImageUpdate={handleImageUpdate}
          onCaptionUpdate={handleCaptionUpdate}
          onCategoryUpdate={handleCategoryUpdate}
          onAddCategory={handleAddCategory}
          onUpdateCategories={handleUpdateCategories}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          selectedItemIndex={selectedItemIndex}
          onSelectItem={setSelectedItemIndex}
          brandColor={pageData.brandColor || "#8B5CF6"}
        />

        {/* Gallery Preview - Always show the Instagram-style gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 pt-20"
        >
          <EditableTemplate8GalleryBlock 
            pageData={{
              ...pageData,
              images,
              availableCategories: categories
            }}
            onUpdate={handleUpdate}
            onSelectItem={setSelectedItemIndex}
          />
        </motion.div>

        {/* Usage Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              📸 Use the vertical toolbar on the right to edit your gallery. Click on any image to edit it.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionEditorWrapper>
  );
};

export default GallerySectionEditor;
