import React from 'react';
import BeforeAfterSection from '../components/BeforeAfterSection';
import { useEditMode } from '@/components/chairlinked/editing/EditModeContext';

interface EditableTemplate8BeforeAfterBlockProps {
  pageData: any;
  onUpdate?: (updates: any) => void;
}

const EditableTemplate8BeforeAfterBlock: React.FC<EditableTemplate8BeforeAfterBlockProps> = ({
  pageData,
  onUpdate
}) => {
  const { isEditMode } = useEditMode();

  // Debug logging to track data flow
  console.log('[EditableTemplate8BeforeAfterBlock] Rendering with:', {
    beforeImage: pageData.beforeImage,
    afterImage: pageData.afterImage,
    beforeLabel: pageData.beforeLabel,
    afterLabel: pageData.afterLabel,
    isEditMode,
    hasPageData: !!pageData
  });

  const handleBeforeImageChange = (image: string) => {
    console.log('[EditableTemplate8BeforeAfterBlock] Before image changed:', image);
    if (onUpdate) {
      onUpdate({
        beforeImage: image
      });
    }
  };

  const handleAfterImageChange = (image: string) => {
    console.log('[EditableTemplate8BeforeAfterBlock] After image changed:', image);
    if (onUpdate) {
      onUpdate({
        afterImage: image
      });
    }
  };

  // In production preview mode, only render if there's content
  const hasContent = pageData.beforeImage || pageData.afterImage || isEditMode;
  
  if (!hasContent) {
    return null;
  }

  return (
    <BeforeAfterSection
      beforeImage={pageData.beforeImage || ''}
      afterImage={pageData.afterImage || ''}
      beforeLabel={pageData.beforeLabel || 'Before'}
      afterLabel={pageData.afterLabel || 'After'}
      brandColor={pageData.brandColor}
      onBeforeImageChange={handleBeforeImageChange}
      onAfterImageChange={handleAfterImageChange}
      isEditing={isEditMode}
    />
  );
};

export default EditableTemplate8BeforeAfterBlock;