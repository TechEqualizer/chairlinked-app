
import { useRef, useState, useEffect } from "react";

export function useEditableEditing(value: string) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLDivElement>(null);

  // Only set localValue when value external changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // On isEditing, set content only once
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.innerText = value;
      inputRef.current.focus();
    }
  }, [isEditing, value]);

  return {
    isEditing,
    setIsEditing,
    localValue,
    setLocalValue,
    inputRef,
  };
}
