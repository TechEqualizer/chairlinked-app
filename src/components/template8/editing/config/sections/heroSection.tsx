
import React from "react";
import HeroSectionEditor from "../../sections/HeroSectionEditor";

export const heroSection = {
  id: 'hero', 
  name: 'Hero Section', 
  component: ({ pageData, onUpdate, onSave, onPrevious, onNext, canGoPrevious, canGoNext }: any) => (
    <HeroSectionEditor 
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
