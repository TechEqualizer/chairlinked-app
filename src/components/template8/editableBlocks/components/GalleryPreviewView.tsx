
import React from 'react';
import Template8InstagramGallery from '../../components/Template8InstagramGallery';
import { Template8GalleryImage } from '../../hooks/useTemplate8Data';

interface GalleryPreviewViewProps {
  images: Template8GalleryImage[];
  businessName: string;
  brandColor?: string;
  onUpdate?: (updates: any) => void;
  onSelectItem?: (index: number) => void;
  pageData?: any;
  isEditMode?: boolean;
}

const GalleryPreviewView: React.FC<GalleryPreviewViewProps> = ({
  images,
  businessName,
  brandColor,
  onUpdate,
  onSelectItem,
  pageData,
  isEditMode = false
}) => {
  return (
    <Template8InstagramGallery
      images={images}
      businessName={businessName}
      brandColor={brandColor}
      onUpdate={onUpdate}
      onSelectItem={onSelectItem}
      pageData={pageData}
      isEditMode={isEditMode}
    />
  );
};

export default GalleryPreviewView;
