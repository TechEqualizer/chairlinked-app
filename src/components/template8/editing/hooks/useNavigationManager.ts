
import { useState } from "react";

export const useNavigationManager = (totalSections: number) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleApprove = async (saveChanges: () => Promise<void>) => {
    console.log('✅ Saving current section changes...');
    
    // Save changes when approving a section
    await saveChanges();
    
    setSwipeDirection('right');
    
    setTimeout(() => {
      if (currentSectionIndex < totalSections - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
        setSwipeDirection(null);
      } else {
        setIsCompleted(true);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      console.log('⬅️ Moving to previous section...');
      setSwipeDirection('left');
      
      setTimeout(() => {
        setCurrentSectionIndex(currentSectionIndex - 1);
        setSwipeDirection(null);
      }, 300);
    }
  };

  const jumpToSection = async (sectionIndex: number, saveChanges: () => Promise<void>) => {
    if (sectionIndex >= 0 && sectionIndex < totalSections && sectionIndex !== currentSectionIndex) {
      console.log(`🎯 Jumping to section ${sectionIndex + 1}...`);
      
      // Save current changes before jumping
      await saveChanges();
      
      // Determine swipe direction for animation
      const direction = sectionIndex > currentSectionIndex ? 'right' : 'left';
      setSwipeDirection(direction);
      
      setTimeout(() => {
        setCurrentSectionIndex(sectionIndex);
        setSwipeDirection(null);
      }, 300);
    }
  };

  return {
    currentSectionIndex,
    swipeDirection,
    isCompleted,
    setIsCompleted,
    handleApprove,
    handlePrevious,
    jumpToSection
  };
};
