
import { useState, useCallback } from 'react';

export type EditorSection = 'hero' | 'stories' | 'gallery' | 'testimonials' | 'booking' | 'contact';

export interface SectionInfo {
  id: EditorSection;
  name: string;
  icon: string;
  description: string;
}

export const editorSections: SectionInfo[] = [
  { id: 'hero', name: 'Hero Section', icon: '🎯', description: 'Main heading and call-to-action' },
  { id: 'stories', name: 'Stories', icon: '📱', description: 'Instagram-style stories showcase' },
  { id: 'gallery', name: 'Gallery', icon: '🖼️', description: 'Photo and video gallery' },
  { id: 'testimonials', name: 'Testimonials', icon: '💬', description: 'Customer reviews and feedback' },
  { id: 'booking', name: 'Booking', icon: '📅', description: 'Contact and appointment form' },
  { id: 'contact', name: 'Contact Info', icon: '📞', description: 'Business contact information' }
];

export const useSectionEditor = () => {
  const [activeSection, setActiveSection] = useState<EditorSection>('hero');

  const navigateToSection = useCallback((section: EditorSection) => {
    setActiveSection(section);
  }, []);

  const getActiveSectionInfo = useCallback(() => {
    return editorSections.find(section => section.id === activeSection) || editorSections[0];
  }, [activeSection]);

  return {
    activeSection,
    navigateToSection,
    getActiveSectionInfo,
    sections: editorSections
  };
};
