
import { useEffect } from 'react';

interface UseStoryKeyboardProps {
  isOpen: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

export const useStoryKeyboard = ({
  isOpen,
  onNext,
  onPrevious,
  onClose
}: UseStoryKeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case "ArrowRight":
        case " ":
          onNext();
          break;
        case "ArrowLeft":
          onPrevious();
          break;
        case "Escape":
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onNext, onPrevious, onClose]);
};
