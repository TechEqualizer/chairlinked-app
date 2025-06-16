
import React from "react";
import SectionEditorWrapper from "../../components/SectionEditorWrapper";
import EditableTemplate8BookingBlock from "../../../editableBlocks/EditableTemplate8BookingBlock";

export const bookingSection = {
  id: 'booking', 
  name: 'Booking', 
  component: ({ pageData, onUpdate }: any) => (
    <SectionEditorWrapper sectionName="Contact & Booking">
      <EditableTemplate8BookingBlock 
        pageData={{
          ...pageData,
          contactEmail: pageData.contactEmail || "hello@creativestudio.com",
          phoneNumber: pageData.phoneNumber || "(555) 123-4567",
          bookingTheme: pageData.bookingTheme || 'light'
        }}
        onUpdate={onUpdate}
      />
    </SectionEditorWrapper>
  )
};
