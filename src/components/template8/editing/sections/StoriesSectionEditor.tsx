
import React from "react";
import SectionEditorWrapper from "../components/SectionEditorWrapper";
import EditableTemplate8StoriesBlock from "../../editableBlocks/EditableTemplate8StoriesBlock";
import StoriesVerticalToolbar from "../components/StoriesVerticalToolbar";
import { useUniversalEditing } from "../hooks/useUniversalEditing";

interface StoriesSectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
}

const StoriesSectionEditor: React.FC<StoriesSectionEditorProps> = ({ 
  pageData, 
  onUpdate,
  onSave 
}) => {
  // Enhanced debugging for story data
  console.log('[StoriesSectionEditor] Rendering with pageData.stories:', 
    pageData.stories?.map((s: any) => ({ 
      id: s.id, 
      title: s.title, 
      coverType: s.coverType,
      hasImage: !!s.image 
    }))
  );

  const {
    isDirty,
    isAutoSaving,
    saveChanges,
    handleUpdate
  } = useUniversalEditing({ pageData, onUpdate, onSave });

  // Ensure we have at least one empty story to start with
  const storiesData = {
    ...pageData,
    stories: pageData.stories?.length > 0 ? pageData.stories : [
      {
        id: 1,
        image: "", // No default image
        coverType: 'image',
        title: "Your First Story",
        ctaText: "Get Started",
        items: [] // Start with empty items
      }
    ],
    brandColor: pageData.brandColor || "#8B5CF6",
    fontClass: pageData.fontClass || "font-inter",
    businessName: pageData.businessName || "Creative Studio",
    storiesTheme: pageData.storiesTheme || 'light'
  };

  return (
    <SectionEditorWrapper sectionName="Stories">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden"
           style={{
             background: pageData.brandColor ? 
               `linear-gradient(135deg, ${pageData.brandColor}08, ${pageData.brandColor}15, ${pageData.brandColor}08)` : 
               'linear-gradient(135deg, #f9fafb, #f3f4f6, #f9fafb)'
           }}>
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 border border-gray-200/30 rounded-full animate-pulse" 
               style={{ borderColor: pageData.brandColor ? `${pageData.brandColor}30` : undefined }} />
          <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full blur-2xl"
               style={{
                 background: pageData.brandColor ? 
                   `linear-gradient(45deg, ${pageData.brandColor}10, ${pageData.brandColor}20)` : 
                   'linear-gradient(45deg, #f3f4f610, #e5e7eb20)'
               }} />
        </div>

        {/* Section Label */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Stories</span>
          </div>
        </div>

        {/* Vertical Toolbar */}
        <StoriesVerticalToolbar
          pageData={storiesData}
          onUpdate={handleUpdate}
          brandColor={pageData.brandColor || "#8B5CF6"}
        />

        {/* Instagram Stories Preview */}
        <div className="relative z-10 pt-20">
          <EditableTemplate8StoriesBlock 
            pageData={storiesData}
            onUpdate={handleUpdate}
          />
        </div>

        {/* Usage Hint */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              📱 Use the vertical toolbar on the right to edit your Stories section
            </p>
          </div>
        </div>
      </div>
    </SectionEditorWrapper>
  );
};

export default StoriesSectionEditor;
