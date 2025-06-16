
import React from "react";

interface SectionEditorWrapperProps {
  children: React.ReactNode;
  sectionName: string;
}

const SectionEditorWrapper: React.FC<SectionEditorWrapperProps> = ({ 
  children, 
  sectionName 
}) => {
  return (
    <div className="min-h-screen w-full">
      {/* Section content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default SectionEditorWrapper;
