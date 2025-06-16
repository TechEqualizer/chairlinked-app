
export interface EnhancedTextPanelProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

export type TabType = 'content' | 'typography' | 'colors' | 'styling';

export interface Tab {
  id: TabType;
  label: string;
  icon: any;
}

export interface FontWeightOption {
  value: string;
  label: string;
  class: string;
}

export interface TextAlignOption {
  value: string;
  label: string;
}

export interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
}
