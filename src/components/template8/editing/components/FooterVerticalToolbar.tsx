
import React from 'react';
import { Mail, Type } from 'lucide-react';
import EnhancedVerticalToolbar from './toolbar/EnhancedVerticalToolbar';

interface FooterVerticalToolbarProps {
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
  brandColor?: string;
  
  // Validation
  hasErrors?: boolean;
}

const FooterVerticalToolbar: React.FC<FooterVerticalToolbarProps> = ({
  activePanel,
  onPanelChange,
  brandColor = "#8B5CF6",
  hasErrors
}) => {
  const availablePanels = [
    {
      id: 'content',
      icon: <Type size={18} />,
      title: 'Content & Description'
    },
    {
      id: 'contact',
      icon: <Mail size={18} />,
      title: 'Contact Information'
    }
  ];

  return (
    <EnhancedVerticalToolbar
      brandColor={brandColor}
      activePanel={activePanel}
      onPanelChange={onPanelChange}
      availablePanels={availablePanels}
      currentSection="Footer"
      hasErrors={hasErrors}
    />
  );
};

export default FooterVerticalToolbar;
