
import { useEffect } from "react";

export function useEditingHotkeys({
  isNavigationHidden,
  currentSectionIndex,
  sectionsLength,
  showCompactMenu,
  setShowCompactMenu,
  handlePrevious,
  handleNext,
}: {
  isNavigationHidden: boolean;
  currentSectionIndex: number;
  sectionsLength: number;
  showCompactMenu: boolean;
  setShowCompactMenu: (v: boolean) => void;
  handlePrevious: () => void;
  handleNext: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isNavigationHidden) return;
      if (event.key === "ArrowLeft" && currentSectionIndex > 0) {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === "ArrowRight" && currentSectionIndex < sectionsLength - 1) {
        event.preventDefault();
        handleNext();
      } else if (event.key === "Escape") {
        event.preventDefault();
        setShowCompactMenu(false);
      } else if (event.key === "m" && event.ctrlKey) {
        event.preventDefault();
        setShowCompactMenu(!showCompactMenu);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isNavigationHidden,
    currentSectionIndex,
    showCompactMenu,
    sectionsLength,
    handlePrevious,
    handleNext,
    setShowCompactMenu,
  ]);
}
