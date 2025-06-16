
import { useState, useEffect, useCallback } from 'react';

interface UseDebouncedColorPickerProps {
  initialValue: string;
  onUpdate: (value: string) => void;
  delay?: number;
}

export const useDebouncedColorPicker = ({
  initialValue,
  onUpdate,
  delay = 300
}: UseDebouncedColorPickerProps) => {
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  // Update display value immediately for responsive UI
  const handleChange = useCallback((value: string) => {
    setDisplayValue(value);
  }, []);

  // Debounce the actual update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayValue !== debouncedValue) {
        setDebouncedValue(displayValue);
        onUpdate(displayValue);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [displayValue, debouncedValue, onUpdate, delay]);

  // Sync with external changes
  useEffect(() => {
    if (initialValue !== displayValue && initialValue !== debouncedValue) {
      setDisplayValue(initialValue);
      setDebouncedValue(initialValue);
    }
  }, [initialValue, displayValue, debouncedValue]);

  return {
    value: displayValue,
    onChange: handleChange,
    isUpdating: displayValue !== debouncedValue
  };
};
