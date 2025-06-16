
import React from "react";
import Template8InstagramStories from "../stories/Template8InstagramStories";
import StoriesDataProcessor from "./components/StoriesDataProcessor";
import StoriesBookingHandler from "./components/StoriesBookingHandler";
import { StoryItem } from "../types/storyTypes";

interface EditableTemplate8StoriesBlockProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  isProductionPreview?: boolean;
}

const EditableTemplate8StoriesBlock: React.FC<EditableTemplate8StoriesBlockProps> = ({
  pageData,
  onUpdate,
  isProductionPreview = false
}) => {
  console.log('[EditableTemplate8StoriesBlock] Component rendered with:', {
    hasPageData: !!pageData,
    storiesCount: pageData?.stories?.length || 0,
    storiesTheme: pageData?.storiesTheme || 'light',
    pageDataKeys: pageData ? Object.keys(pageData) : [],
    isProductionPreview
  });

  const handleBookingClick = (item: StoryItem) => {
    if (isProductionPreview) return;
    // Handle booking click for story items
    console.log('Story item booking clicked:', item);
  };

  // In production preview mode, disable updates
  const handleUpdate = isProductionPreview ? () => {} : onUpdate;

  return (
    <div className={isProductionPreview ? "stories-production-preview-mode" : ""}>
      {isProductionPreview && (
        <style>{`
          .stories-production-preview-mode .story-item {
            cursor: default !important;
          }
          
          .stories-production-preview-mode .story-item button,
          .stories-production-preview-mode .story-item [role="button"] {
            pointer-events: none !important;
            cursor: default !important;
          }
          
          .stories-production-preview-mode .editable-element,
          .stories-production-preview-mode [contentEditable] {
            pointer-events: none !important;
          }
        `}</style>
      )}
      <StoriesDataProcessor pageData={pageData}>
        {(stories) => (
          <Template8InstagramStories
            stories={stories}
            brandColor={pageData?.brandColor || "#8B5CF6"}
            fontClass={pageData?.fontClass || "font-inter"}
            businessName={pageData?.businessName || "Creative Studio"}
            theme={pageData?.storiesTheme || "light"}
            onBookingClick={handleBookingClick}
            pageData={pageData}
            onUpdate={handleUpdate}
          />
        )}
      </StoriesDataProcessor>
    </div>
  );
};

export default EditableTemplate8StoriesBlock;
