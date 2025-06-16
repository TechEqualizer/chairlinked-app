
import { useState, useCallback, useRef, useEffect } from 'react';

export const useVideoControls = () => {
  const [mutedVideos, setMutedVideos] = useState<Set<number>>(new Set());
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize intersection observer for video auto-play
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            videoElement.play().catch(console.error);
          } else {
            videoElement.pause();
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '50px'
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const setVideoRef = useCallback((element: HTMLVideoElement | null, id: number) => {
    if (element) {
      videoRefs.current.set(id, element);
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    } else {
      const existingVideo = videoRefs.current.get(id);
      if (existingVideo && observerRef.current) {
        observerRef.current.unobserve(existingVideo);
      }
      videoRefs.current.delete(id);
    }
  }, []);

  const toggleMute = useCallback((id: number) => {
    const video = videoRefs.current.get(id);
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
  }, []);

  return {
    mutedVideos,
    setMutedVideos,
    setVideoRef,
    toggleMute
  };
};
