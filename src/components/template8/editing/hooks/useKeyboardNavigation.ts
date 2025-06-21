import { useEffect, useCallback } from 'react';

export interface KeyboardNavigationOptions {
  onPrevious: () => void;
  onNext: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  disabled?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const {
    onPrevious,
    onNext,
    onUndo,
    onRedo,
    onSave,
    canGoPrevious = true,
    canGoNext = true,
    canUndo = false,
    canRedo = false,
    disabled = false
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger navigation if user is typing in an input/textarea
    const target = event.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.contentEditable === 'true' ||
                    target.getAttribute('role') === 'textbox';

    if (disabled || isTyping) {
      return;
    }

    // Handle different key combinations
    const { key, metaKey, ctrlKey, shiftKey, altKey } = event;
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdOrCtrl = isMac ? metaKey : ctrlKey;

    switch (key) {
      case 'ArrowLeft':
        // Left arrow - go to previous section
        if (!cmdOrCtrl && !shiftKey && !altKey) {
          if (canGoPrevious) {
            event.preventDefault();
            onPrevious();
          }
        }
        break;

      case 'ArrowRight':
        // Right arrow - go to next section
        if (!cmdOrCtrl && !shiftKey && !altKey) {
          if (canGoNext) {
            event.preventDefault();
            onNext();
          }
        }
        break;

      case 'z':
        // Cmd/Ctrl+Z - Undo
        if (cmdOrCtrl && !shiftKey) {
          if (canUndo && onUndo) {
            event.preventDefault();
            onUndo();
          }
        }
        // Cmd/Ctrl+Shift+Z - Redo (alternative)
        else if (cmdOrCtrl && shiftKey) {
          if (canRedo && onRedo) {
            event.preventDefault();
            onRedo();
          }
        }
        break;

      case 'y':
        // Cmd/Ctrl+Y - Redo (Windows style)
        if (cmdOrCtrl && !shiftKey) {
          if (canRedo && onRedo) {
            event.preventDefault();
            onRedo();
          }
        }
        break;

      case 's':
        // Cmd/Ctrl+S - Save
        if (cmdOrCtrl && onSave) {
          event.preventDefault();
          onSave();
        }
        break;

      default:
        // No action for other keys
        break;
    }
  }, [
    onPrevious,
    onNext,
    onUndo,
    onRedo,
    onSave,
    canGoPrevious,
    canGoNext,
    canUndo,
    canRedo,
    disabled
  ]);

  // Attach/detach event listeners
  useEffect(() => {
    if (disabled) return;

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, disabled]);

  // Return keyboard shortcuts info for UI display
  const shortcuts = {
    navigation: {
      previous: '← Left Arrow',
      next: '→ Right Arrow'
    },
    editing: {
      undo: navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘Z' : 'Ctrl+Z',
      redo: navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘⇧Z' : 'Ctrl+Y',
      save: navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘S' : 'Ctrl+S'
    }
  };

  return { shortcuts };
};