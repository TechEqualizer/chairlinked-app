import { useCallback, useRef, useState } from 'react';
import type { Template8Data } from '../../generator/types/GeneratorTypes';

// Simple debounce implementation to avoid lodash dependency issues
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export interface UndoRedoState {
  canUndo: boolean;
  canRedo: boolean;
  historyIndex: number;
  historyLength: number;
}

export interface UndoRedoReturn {
  state: UndoRedoState;
  undo: () => Template8Data | null;
  redo: () => Template8Data | null;
  pushToHistory: (data: Template8Data) => void;
  clearHistory: () => void;
  resetToState: (data: Template8Data) => void;
}

const MAX_HISTORY_SIZE = 50; // Limit history to prevent memory issues
const DEBOUNCE_DELAY = 1000; // 1 second debounce for auto-pushing to history

export const useUndoRedo = (initialData?: Template8Data): UndoRedoReturn => {
  const [history, setHistory] = useState<Template8Data[]>(
    initialData ? [initialData] : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastPushedDataRef = useRef<string>('');

  // Debounced function to push to history automatically
  const debouncedPushToHistory = useCallback(
    debounce((data: Template8Data) => {
      const dataString = JSON.stringify(data);
      
      // Don't push if it's the same as the last pushed data
      if (dataString === lastPushedDataRef.current) {
        return;
      }

      lastPushedDataRef.current = dataString;
      
      setHistory(prevHistory => {
        const newHistory = [...prevHistory];
        
        // Remove any future history if we're not at the end
        if (currentIndex < newHistory.length - 1) {
          newHistory.splice(currentIndex + 1);
        }
        
        // Add new state
        newHistory.push(data);
        
        // Limit history size
        if (newHistory.length > MAX_HISTORY_SIZE) {
          newHistory.shift();
          setCurrentIndex(prev => prev); // Index stays the same since we removed from beginning
        } else {
          setCurrentIndex(newHistory.length - 1);
        }
        
        return newHistory;
      });
    }, DEBOUNCE_DELAY),
    [currentIndex]
  );

  // Manual push to history (immediate)
  const pushToHistory = useCallback((data: Template8Data) => {
    const dataString = JSON.stringify(data);
    
    // Don't push if it's the same as the last pushed data
    if (dataString === lastPushedDataRef.current) {
      return;
    }

    lastPushedDataRef.current = dataString;
    
    setHistory(prevHistory => {
      const newHistory = [...prevHistory];
      
      // Remove any future history if we're not at the end
      if (currentIndex < newHistory.length - 1) {
        newHistory.splice(currentIndex + 1);
      }
      
      // Add new state
      newHistory.push(data);
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        return newHistory;
      } else {
        setCurrentIndex(newHistory.length - 1);
        return newHistory;
      }
    });
  }, [currentIndex]);

  // Undo function
  const undo = useCallback((): Template8Data | null => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      const previousState = history[newIndex];
      lastPushedDataRef.current = JSON.stringify(previousState);
      return previousState;
    }
    return null;
  }, [currentIndex, history]);

  // Redo function
  const redo = useCallback((): Template8Data | null => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      const nextState = history[newIndex];
      lastPushedDataRef.current = JSON.stringify(nextState);
      return nextState;
    }
    return null;
  }, [currentIndex, history]);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(0);
    lastPushedDataRef.current = '';
  }, []);

  // Reset to a specific state and clear history
  const resetToState = useCallback((data: Template8Data) => {
    const newHistory = [data];
    setHistory(newHistory);
    setCurrentIndex(0);
    lastPushedDataRef.current = JSON.stringify(data);
  }, []);

  // Auto-push to history when data changes (debounced)
  const autoTrackChanges = useCallback((data: Template8Data) => {
    debouncedPushToHistory(data);
  }, [debouncedPushToHistory]);

  // Calculate state
  const state: UndoRedoState = {
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    historyIndex: currentIndex,
    historyLength: history.length
  };

  return {
    state,
    undo,
    redo,
    pushToHistory,
    clearHistory,
    resetToState
  };
};