
import React from 'react';
import { EditorSection } from '@/hooks/useSectionEditor';
import { SimpleEditorData } from '@/hooks/useSimpleCustomerEditor';
import { HeroSectionEditor } from './sections/HeroSectionEditor';
import { StoriesSectionEditor } from './sections/StoriesSectionEditor';
import { GallerySectionEditor } from './sections/GallerySectionEditor';
import { TestimonialsSectionEditor } from './sections/TestimonialsSectionEditor';
import { BookingSectionEditor } from './sections/BookingSectionEditor';
import { ContactSectionEditor } from './sections/ContactSectionEditor';

interface SectionEditorRendererProps {
  activeSection: EditorSection;
  data: SimpleEditorData;
  onUpdateField: (field: keyof SimpleEditorData, value: string) => void;
}

export const SectionEditorRenderer: React.FC<SectionEditorRendererProps> = ({
  activeSection,
  data,
  onUpdateField,
}) => {
  console.log('[SectionEditorRenderer] Rendering section:', activeSection, 'with data:', data);

  switch (activeSection) {
    case 'hero':
      return <HeroSectionEditor data={data} onUpdateField={onUpdateField} />;
    case 'stories':
      return <StoriesSectionEditor data={data} onUpdateField={onUpdateField} />;
    case 'gallery':
      return <GallerySectionEditor data={data} onUpdateField={onUpdateField} />;
    case 'testimonials':
      return <TestimonialsSectionEditor data={data} onUpdateField={onUpdateField} />;
    case 'booking':
      return <BookingSectionEditor data={data} onUpdateField={onUpdateField} />;
    case 'contact':
      return <ContactSectionEditor data={data} onUpdateField={onUpdateField} />;
    default:
      return <HeroSectionEditor data={data} onUpdateField={onUpdateField} />;
  }
};
