import React from 'react';
import RobustProfessionalEditor from './components/RobustProfessionalEditor';

interface ProfessionalInlineEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
  onClose: () => void;
  isAdmin?: boolean;
  siteData?: {
    id: string;
    business_name: string;
    lifecycle_stage: string;
  };
  onSaveSuccessNavigate?: () => void;
}

type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';
type EditorPanel = 'inspector' | 'layers' | 'assets' | 'theme' | null;

interface SelectedElement {
  id: string;
  type: string;
  element: HTMLElement;
  selector: string;
  properties: Record<string, any>;
}

export const ProfessionalInlineEditor: React.FC<ProfessionalInlineEditorProps> = ({
  pageData,
  onUpdate,
  onSave,
  onClose,
  isAdmin = false,
  siteData,
  onSaveSuccessNavigate
}) => {
  return (
    <RobustProfessionalEditor
      pageData={pageData}
      onUpdate={onUpdate}
      onSave={onSave}
      onClose={onClose}
      siteData={siteData}
      onSaveSuccessNavigate={onSaveSuccessNavigate}
    />
  );
};

export default ProfessionalInlineEditor;