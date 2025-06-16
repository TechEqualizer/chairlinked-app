
import { useState, useEffect } from 'react';

interface UseStoryProgressProps {
  isOpen: boolean;
  isPaused: boolean;
  currentItemIndex: number;
  currentStoryIndex: number;
  storyDuration: number;
  onNext: () => void;
}

export const useStoryProgress = ({
  isOpen,
  isPaused,
  currentItemIndex,
  currentStoryIndex,
  storyDuration,
  onNext
}: UseStoryProgressProps) => {
  const [progress, setProgress] = useState(0);

  // Reset progress when story or item changes
  useEffect(() => {
    setProgress(0);
  }, [currentStoryIndex, currentItemIndex]);

  // Progress bar animation with enhanced duration support and validation
  useEffect(() => {
    if (!isOpen || isPaused) return;

    // Validate duration is within acceptable range (1-60 seconds)
    const validatedDuration = Math.max(1, Math.min(60, storyDuration || 5));
    
    if (validatedDuration !== storyDuration) {
      console.warn('[useStoryProgress] Duration out of range, clamped:', {
        original: storyDuration,
        clamped: validatedDuration
      });
    }

    const interval = 100;
    const increment = (interval / (validatedDuration * 1000)) * 100;
    
    console.log('[useStoryProgress] Starting progress with validated duration:', {
      originalDuration: storyDuration,
      validatedDuration,
      incrementPerInterval: increment
    });
    
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + increment;
        
        if (nextProgress >= 100) {
          console.log('[useStoryProgress] Progress complete, advancing to next');
          onNext();
          return 0;
        }
        
        return nextProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, currentStoryIndex, currentItemIndex, isPaused, storyDuration, onNext]);

  return { progress, setProgress };
};
