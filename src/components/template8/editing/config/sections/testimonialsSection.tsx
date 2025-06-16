
import React from "react";
import TestimonialsSectionEditor from "../../sections/TestimonialsSectionEditor";

export const testimonialsSection = {
  id: 'testimonials', 
  name: 'Testimonials', 
  component: ({ pageData, onUpdate }: any) => (
    <TestimonialsSectionEditor pageData={pageData} onUpdate={onUpdate} />
  )
};
