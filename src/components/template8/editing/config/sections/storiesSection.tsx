
import React from "react";
import StoriesSectionEditor from "../../sections/StoriesSectionEditor";

export const storiesSection = {
  id: 'stories', 
  name: 'Stories', 
  component: ({ pageData, onUpdate }: any) => (
    <StoriesSectionEditor pageData={pageData} onUpdate={onUpdate} />
  )
};
