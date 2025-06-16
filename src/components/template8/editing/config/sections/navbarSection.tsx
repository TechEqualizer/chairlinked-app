
import React from "react";
import CleanNavbarSectionEditor from "../../sections/CleanNavbarSectionEditor";

export const navbarSection = {
  id: 'navbar', 
  name: 'Navigation', 
  component: ({ pageData, onUpdate, onSave }: any) => (
    <CleanNavbarSectionEditor 
      pageData={pageData} 
      onUpdate={onUpdate} 
      onSave={onSave}
    />
  )
};
