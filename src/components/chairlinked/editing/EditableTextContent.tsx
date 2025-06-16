import React from "react";
import { useEditMode } from "./EditModeContext";
import EditPencilIcon from "./EditPencilIcon";
import EditableTooltip from "./EditableTooltip";
import { useEditableEditing } from "./useEditableEditing";
import type { EditableTextProps, EditableTextTag } from "./EditableText.types";

const DEBUG = false;

const EditableTextContent: React.FC<EditableTextProps> = ({
  value,
  onChange,
  tag = "div",
  className,
  placeholder = "Click to edit...",
  style,
}) => {
  const { isEditMode } = useEditMode();
  const [hovered, setHovered] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const {
    isEditing,
    setIsEditing,
    localValue,
    setLocalValue,
    inputRef,
  } = useEditableEditing(value);

  const instanceId = React.useRef(Math.round(Math.random() * 1e6));
  
  // Add a ref to track if we're in the middle of editing to prevent premature blur
  const isEditingRef = React.useRef(false);
  const blurTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  React.useEffect(() => {
    DEBUG && console.log(`[EditableText] MOUNTED id=${instanceId.current}`);
    return () => {
      DEBUG && console.log(`[EditableText] UNMOUNTED id=${instanceId.current}`);
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (DEBUG) {
      console.log(
        `[EditableText][Render] id=${instanceId.current} isEditMode=${isEditMode} isEditing=${isEditing} localValue='${localValue}' value='${value}' hovered=${hovered}`
      );
    }
  });

  function startEditing(debugFrom = "unknown") {
    DEBUG && console.log(`[EditableText][${debugFrom}] startEditing called. isEditing=${isEditing}`);
    if (!isEditing && isEditMode) {
      setIsEditing(true);
      setLocalValue(value);
      // Clear any pending blur timeouts
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
      // Focus the input after a small delay to ensure it's rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Set cursor to end of text
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(inputRef.current);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 10);
    }
  }

  // Save changes with validation
  const saveIfChanged = (val: string) => {
    const trimmedVal = val.trim();
    if (trimmedVal !== value && trimmedVal !== "") {
      onChange(trimmedVal);
      DEBUG && console.log(`[EditableText] Saved change: "${value}" -> "${trimmedVal}"`);
    }
  };

  // Handle delayed blur to prevent premature exits
  const handleDelayedBlur = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    
    blurTimeoutRef.current = setTimeout(() => {
      if (isEditingRef.current) {
        DEBUG && console.log(`[EditableText] Delayed blur - exiting edit mode`);
        setIsEditing(false);
        setHovered(false);
        setShowTooltip(false);
        saveIfChanged(localValue);
      }
    }, 150); // Small delay to allow for re-focusing
  };

  // Cancel any pending blur when focusing
  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setHovered(true);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isEditing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(false);
      setHovered(false);
      setShowTooltip(false);
      saveIfChanged(localValue);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(false);
      setHovered(false);
      setShowTooltip(false);
      setLocalValue(value); // Reset to original value
    }
  };

  // Always use the same Tag and className in both preview and edit mode
  const Tag = tag as any;

  // --- MAIN CHANGE: Remove ALL editing/affordances in preview mode! ---
  if (!isEditMode) {
    return (
      <Tag className={className} style={style}>
        {value || <span className="text-gray-400">{placeholder}</span>}
      </Tag>
    );
  }

  return (
    <Tag
      className={className || ""}
      style={{ position: "relative", ...style }}
      onMouseEnter={() => !isEditing && setHovered(true)}
      onMouseLeave={() => { if (!isEditing) { setHovered(false); setShowTooltip(false); } }}
      onMouseOver={() => !isEditing && setShowTooltip(true)}
      onMouseOut={() => !isEditing && setShowTooltip(false)}
      aria-label="Editable text"
      data-editable-id={instanceId.current}
    >
      {isEditing ? (
        <div
          ref={inputRef}
          className="w-full bg-transparent px-0 py-0 text-inherit font-inherit outline-none"
          style={{
            fontSize: "inherit",
            color: "inherit",
            zIndex: 10,
            position: "relative",
            minHeight: "1em",
            background: "transparent",
            padding: 0,
            margin: 0,
          }}
          contentEditable
          suppressContentEditableWarning
          tabIndex={0}
          onInput={e => { const newValue = (e.target as HTMLDivElement).innerText; setLocalValue(newValue); }}
          onBlur={handleDelayedBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onClick={e => { e.stopPropagation(); }}
        />
      ) : (
        <span
          className="w-full flex items-center cursor-text"
          tabIndex={0}
          onClick={e => { e.stopPropagation(); startEditing("spanClick"); }}
          onFocus={handleFocus}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              startEditing("spanKeydown");
            }
          }}
        >
          {value || <span className="text-gray-400">{placeholder}</span>}
        </span>
      )}

      {/* REMOVE: Pencil icon and tooltip in all preview mode */}
      {/* Debug overlay: DEV-only */}
      {DEBUG && isEditMode && (
        <div
          style={{
            position: "absolute", 
            inset: 0, 
            border: "1.5px dashed red", 
            pointerEvents: "none", 
            zIndex: 999, 
            opacity: 0.25
          }}
          aria-hidden
        />
      )}
    </Tag>
  );
};
export default EditableTextContent;
