
export interface EnhancedBackgroundControlsProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

export interface BackgroundPreset {
  category: string;
  images: string[];
}

export interface OverlayPreset {
  name: string;
  color: string;
  opacity: number;
}

export interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}
