
import React, { useState, useRef, useEffect } from 'react';
import { useEditMode } from '@/components/chairlinked/editing/EditModeContext';

interface SimpleEditableTextProps {
  value: string;
  onChange: (value: string) => void;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const SimpleEditableText: React.FC<SimpleEditableTextProps> = ({
  value,
  onChange,
  tag = 'div',
  className = '',
  placeholder = 'Click to edit...',
  disabled = false,
  style
}) => {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLDivElement>(null);
  const lastSavedValue = useRef(value);
  const cursorPositioned = useRef(false);
  const isTyping = useRef(false);

  // Check if editing should be disabled (either by prop or global context)
  const isDisabled = disabled || !isEditMode;

  console.log('[SimpleEditableText] Render:', {
    value: value.substring(0, 50) + '...',
    disabled,
    isEditMode,
    isDisabled,
    isEditing
  });

  useEffect(() => {
    setLocalValue(value);
    lastSavedValue.current = value;
  }, [value]);

  // Exit editing mode when global edit mode is disabled
  useEffect(() => {
    if (isEditing && isDisabled) {
      console.log('[SimpleEditableText] Exiting edit mode due to global edit mode disabled');
      setIsEditing(false);
    }
  }, [isDisabled, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current && !cursorPositioned.current) {
      inputRef.current.focus();
      
      // Set initial content without using dangerouslySetInnerHTML
      if (inputRef.current.textContent !== value) {
        inputRef.current.textContent = value;
      }
      
      // Set the cursor to the end of content only once
      const range = document.createRange();
      const selection = window.getSelection();
      
      if (inputRef.current.childNodes.length > 0) {
        const textNode = inputRef.current.childNodes[0];
        const length = inputRef.current.textContent?.length || 0;
        range.setStart(textNode, Math.min(length, textNode.textContent?.length || 0));
      } else {
        range.setStart(inputRef.current, 0);
      }
      range.collapse(true);
      
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      cursorPositioned.current = true;
    } else if (!isEditing) {
      cursorPositioned.current = false;
    }
  }, [isEditing, value]);

  const handleClick = () => {
    if (!isDisabled) {
      console.log('[SimpleEditableText] Starting edit mode, current value:', value);
      setIsEditing(true);
      setLocalValue(value);
      cursorPositioned.current = false;
    } else {
      console.log('[SimpleEditableText] Click ignored - editing disabled:', {
        disabled,
        isEditMode,
        isDisabled
      });
    }
  };

  const saveChanges = (newValue: string) => {
    // Always save the exact value, even if it's empty
    const finalValue = newValue;
    console.log('[SimpleEditableText] Saving changes:', { 
      originalValue: lastSavedValue.current, 
      newValue: finalValue,
      isEmpty: finalValue === ''
    });
    
    if (finalValue !== lastSavedValue.current) {
      onChange(finalValue);
      lastSavedValue.current = finalValue;
    }
  };

  const handleBlur = () => {
    console.log('[SimpleEditableText] Blur triggered, localValue:', localValue);
    isTyping.current = false;
    setIsEditing(false);
    saveChanges(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('[SimpleEditableText] Enter pressed, saving:', localValue);
      isTyping.current = false;
      setIsEditing(false);
      saveChanges(localValue);
    }
    if (e.key === 'Escape') {
      console.log('[SimpleEditableText] Escape pressed, reverting to:', lastSavedValue.current);
      isTyping.current = false;
      setLocalValue(lastSavedValue.current);
      setIsEditing(false);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    isTyping.current = true;
    const target = e.target as HTMLDivElement;
    const newValue = target.textContent || '';
    
    console.log('[SimpleEditableText] Input changed:', { 
      textContent: target.textContent, 
      newValue,
      isEmpty: newValue === ''
    });
    
    // Use requestAnimationFrame to defer state update and prevent cursor jumping
    requestAnimationFrame(() => {
      if (isTyping.current) {
        setLocalValue(newValue);
      }
    });
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Use execCommand for better cursor preservation
    if (document.execCommand) {
      document.execCommand('insertText', false, text);
    } else {
      // Fallback for browsers that don't support execCommand
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  if (isEditing && !isDisabled) {
    return (
      <div
        ref={inputRef}
        contentEditable
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onPaste={handlePaste}
        className={`${className} outline-none border-2 border-blue-500 rounded px-2 py-1 bg-white`}
        style={{ minHeight: '1.5em', ...style }}
        suppressContentEditableWarning={true}
      />
    );
  }

  // Create the tag element with proper typing
  const TagComponent = tag as keyof JSX.IntrinsicElements;
  
  return React.createElement(
    TagComponent,
    {
      onClick: handleClick,
      className: `${className} ${isDisabled ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100 hover:bg-opacity-50'} rounded px-2 py-1 transition-colors`,
      title: isDisabled ? undefined : "Click to edit",
      style
    },
    value || placeholder
  );
};

export default SimpleEditableText;
