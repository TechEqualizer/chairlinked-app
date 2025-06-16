
import React from "react";
import NavbarSectionEditor from "./NavbarSectionEditor";

interface CleanNavbarSectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
}

const CleanNavbarSectionEditor: React.FC<CleanNavbarSectionEditorProps> = ({ 
  pageData, 
  onUpdate, 
  onSave 
}) => {
  return (
    <NavbarSectionEditor 
      pageData={pageData} 
      onUpdate={onUpdate} 
      onSave={onSave}
    />
  );
};

export default CleanNavbarSectionEditor;
