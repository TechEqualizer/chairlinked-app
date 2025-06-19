import React from "react";
import NavbarSectionEditor from "./NavbarSectionEditor";
import HeroSectionEditor from "./HeroSectionEditor";
import StoriesSectionEditor from "./StoriesSectionEditor";
import GallerySectionEditor from "./GallerySectionEditor";
import TestimonialsSectionEditor from "./TestimonialsSectionEditor";
import BookingSectionEditor from "./BookingSectionEditor";
import FooterSectionEditor from "./FooterSectionEditor";

interface SectionEditorFactoryProps {
  sectionId: string;
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
}

const SectionEditorFactory: React.FC<SectionEditorFactoryProps> = ({
  sectionId,
  pageData,
  onUpdate,
  onSave
}) => {
  const commonProps = {
    pageData,
    onUpdate,
    onSave
  };

  switch (sectionId) {
    case 'navbar':
      return <NavbarSectionEditor {...commonProps} />;
    case 'hero':
      return <HeroSectionEditor {...commonProps} />;
    case 'stories':
      return <StoriesSectionEditor {...commonProps} />;
    case 'gallery':
      return <GallerySectionEditor {...commonProps} />;
    case 'testimonials':
      return <TestimonialsSectionEditor {...commonProps} />;
    case 'booking':
      return <BookingSectionEditor {...commonProps} />;
    case 'footer':
      return <FooterSectionEditor {...commonProps} />;
    default:
      return (
        <div className="p-4 text-center text-gray-500">
          <p className="text-sm">No editor available for "{sectionId}" section</p>
        </div>
      );
  }
};

export default SectionEditorFactory;