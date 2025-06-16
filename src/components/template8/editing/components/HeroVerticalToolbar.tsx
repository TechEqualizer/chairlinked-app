
import React from 'react';
import { Palette, Type, Image, Layout } from 'lucide-react';
import EnhancedVerticalToolbar from './toolbar/EnhancedVerticalToolbar';

interface HeroVerticalToolbarProps {
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
  brandColor?: string;
  
  // Validation
  hasErrors?: boolean;
}

const HeroVerticalToolbar: React.FC<HeroVerticalToolbarProps> = ({
  activePanel,
  onPanelChange,
  brandColor = "#8B5CF6",
  hasErrors
}) => {
  const availablePanels = [
    {
      id: 'brand',
      icon: <Palette size={18} />,
      title: 'Brand Colors & Presets'
    },
    {
      id: 'typography',
      icon: <Type size={18} />,
      title: 'Typography & Text'
    },
    {
      id: 'images',
      icon: <Image size={18} />,
      title: 'Images & Background'
    },
    {
      id: 'layout',
      icon: <Layout size={18} />,
      title: 'Layout Options'
    }
  ];

  return (
    <EnhancedVerticalToolbar
      brandColor={brandColor}
      activePanel={activePanel}
      onPanelChange={onPanelChange}
      availablePanels={availablePanels}
      currentSection="Hero Section"
      hasErrors={hasErrors}
    />
  );
};

export default HeroVerticalToolbar;
