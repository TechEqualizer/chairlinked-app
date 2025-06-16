
import React from "react";

interface StoriesBookingHandlerProps {
  children: (handleBookingClick: (serviceTitle?: string) => void) => React.ReactNode;
}

const StoriesBookingHandler: React.FC<StoriesBookingHandlerProps> = ({ children }) => {
  const handleBookingClick = (serviceTitle?: string) => {
    try {
      console.log(`[StoriesBookingHandler] Booking clicked for: ${serviceTitle}`);
      // Scroll to booking section
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        console.log('[StoriesBookingHandler] Scrolled to booking section');
      } else {
        console.warn('[StoriesBookingHandler] Booking section not found in DOM');
      }
    } catch (error) {
      console.error('[StoriesBookingHandler] Error handling booking click:', error);
    }
  };

  return <>{children(handleBookingClick)}</>;
};

export default StoriesBookingHandler;
