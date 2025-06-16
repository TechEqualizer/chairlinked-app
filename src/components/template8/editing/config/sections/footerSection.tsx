
import React from "react";
import FooterSectionEditor from "../../sections/FooterSectionEditor";

export const footerSection = {
  id: 'footer', 
  name: 'Footer', 
  component: ({ pageData, onUpdate, onSave, onPrevious, onNext, canGoPrevious, canGoNext }: any) => (
    <FooterSectionEditor 
      pageData={pageData} 
      onUpdate={onUpdate} 
      onSave={onSave}
      onPrevious={onPrevious}
      onNext={onNext}
      canGoPrevious={canGoPrevious}
      canGoNext={canGoNext}
    />
  )
};
