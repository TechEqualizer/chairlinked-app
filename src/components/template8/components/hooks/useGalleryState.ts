
import { useState, useCallback, useRef } from 'react';

export const useGalleryState = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [dislikedItems, setDislikedItems] = useState<Set<number>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [mutedVideos, setMutedVideos] = useState<Set<number>>(new Set());
  const [bookingClicks, setBookingClicks] = useState<Set<number>>(new Set());
  const [videoRefs] = useState<Map<number, HTMLVideoElement>>(new Map());
  
  // Debouncing for analytics logging only (not for UI updates)
  const analyticsTimeouts = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const onToggleLike = useCallback((id: number) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        // Remove from dislikes if it exists
        setDislikedItems(prevDislikes => {
          const newDislikedSet = new Set(prevDislikes);
          newDislikedSet.delete(id);
          return newDislikedSet;
        });
      }
      return newSet;
    });
  }, []);

  const onToggleDislike = useCallback((id: number) => {
    setDislikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        // Remove from likes if it exists
        setLikedItems(prevLikes => {
          const newLikedSet = new Set(prevLikes);
          newLikedSet.delete(id);
          return newLikedSet;
        });
      }
      return newSet;
    });
  }, []);

  const onToggleExpanded = useCallback((id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const onVideoRef = useCallback((element: HTMLVideoElement | null, id: number) => {
    if (element) {
      videoRefs.set(id, element);
    } else {
      videoRefs.delete(id);
    }
  }, [videoRefs]);

  const onToggleMute = useCallback((id: number) => {
    const video = videoRefs.get(id);
    if (video) {
      video.muted = !video.muted;
      setMutedVideos(prev => {
        const newSet = new Set(prev);
        if (video.muted) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
    }
  }, [videoRefs]);

  const onSetMutedVideos = useCallback((updater: React.SetStateAction<Set<number>>) => {
    setMutedVideos(updater);
  }, []);

  const onBookingClick = useCallback((id: number) => {
    // Prevent duplicate bookings for the same image
    setBookingClicks(prev => {
      if (prev.has(id)) {
        // Already booked, don't increment again
        return prev;
      }
      
      // Add to booking clicks immediately for instant UI feedback
      const newSet = new Set(prev);
      newSet.add(id);
      
      // Clear any existing analytics timeout for this booking
      const existingTimeout = analyticsTimeouts.current.get(id);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Add debounced analytics logging (separate from UI update)
      const timeout = setTimeout(() => {
        // Enhanced logging for analytics
        console.log(`[Gallery Analytics] Booking processed for image ${id}`, {
          timestamp: new Date().toISOString(),
          totalBookings: newSet.size,
          imageId: id
        });

        // Scroll to booking section with enhanced UX
        try {
          const bookingSection = document.getElementById('booking');
          if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
            console.log(`[Gallery] Successfully scrolled to booking section for image ${id}`);
          } else {
            console.warn('[Gallery] Booking section not found in DOM');
          }
        } catch (error) {
          console.error('[Gallery] Error scrolling to booking section:', error);
        }

        // Clean up timeout reference
        analyticsTimeouts.current.delete(id);
      }, 200); // Keep debouncing only for analytics and scroll

      // Store timeout reference
      analyticsTimeouts.current.set(id, timeout);
      
      return newSet;
    });
  }, []);

  return {
    activeCategory,
    setActiveCategory,
    likedItems,
    dislikedItems,
    expandedItems,
    mutedVideos,
    bookingClicks,
    videoRefs,
    onToggleLike,
    onToggleDislike,
    onToggleExpanded,
    onVideoRef,
    onToggleMute,
    onSetMutedVideos,
    onBookingClick
  };
};
