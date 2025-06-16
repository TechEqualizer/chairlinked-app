
import React, { useRef, useState } from "react";
import { UploadCloud, Camera } from "lucide-react";
import { useEditMode } from "./EditModeContext";

/**
 * EditableImage: Image with click-to-upload, drag-and-drop swapper for edit mode, premium UI.
 */
interface EditableImageProps {
  src: string;
  onChange: (url: string, file?: File) => void;
  alt?: string;
  className?: string;
  aspectClass?: string; // e.g., aspect-[4/5]
}

const EditableImage: React.FC<EditableImageProps> = ({
  src,
  onChange,
  alt,
  className = "",
  aspectClass = "aspect-[4/5]",
}) => {
  const { isEditMode, setUnsaved } = useEditMode();
  const [isHover, setIsHover] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = evt => {
      if (evt.target?.result && typeof evt.target.result === "string") {
        setPreviewURL(evt.target.result);
        setUnsaved(true);
        onChange(evt.target.result as string, file);
      }
    };
    reader.readAsDataURL(file);
  };

  // Standardize: Only global edit mode from context (no prop override)
  if (!isEditMode) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${aspectClass} object-cover w-full h-full rounded-xl shadow hover-scale-105 transition ${className}`}
        draggable={false}
      />
    );
  }

  // Edit mode - overlay drag/click UI, premium glassmorphism style
  return (
    <div
      className={`
        relative overflow-hidden group transition
        ${aspectClass} ${className}
        ${dragOver ? "ring-4 ring-fuchsia-400/70" : ""}
      `}
      tabIndex={0}
      style={{
        cursor: "pointer",
        borderRadius: 18,
        boxShadow: isHover || dragOver ? "0 2.5px 22px #e879f980" : undefined,
        background: dragOver ? "#faf5ff" : isHover ? "rgba(250,240,255,0.16)" : undefined,
        transition: "box-shadow 0.24s, background 0.22s",
        minHeight: 80,
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => {
        setIsHover(false);
        setShowTooltip(false);
      }}
      onClick={e => {
        e.stopPropagation();
        inputRef.current?.click();
      }}
      onDragOver={e => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFile(e.dataTransfer.files[0]);
        }
      }}
      onFocus={() => setIsHover(true)}
      onBlur={() => setIsHover(false)}
      onMouseOver={() => setShowTooltip(true)}
      onMouseOut={() => setShowTooltip(false)}
    >
      <img
        src={previewURL || src}
        alt={alt}
        className={`
          object-cover w-full h-full rounded-xl transition
          ${aspectClass}
          ${dragOver ? "opacity-60 blur-[2.5px]" : isHover ? "opacity-85" : ""}
        `}
        draggable={false}
        style={{ transition: "opacity 0.20s, filter 0.22s" }}
      />

      {/* Overlay Actions */}
      {(isHover || dragOver) && (
        <div
          className={`
            absolute inset-0 flex flex-col items-center justify-center
            transition bg-black/10 group-hover:bg-black/35
            animate-fade-in pointer-events-none z-10 rounded-2xl
          `}
          style={{
            // Apply strong glass + glow when dragging
            background: dragOver
              ? "rgba(250, 40, 255, 0.13)"
              : isHover
              ? "rgba(50,10,60,0.13)"
              : "transparent",
            backdropFilter: dragOver ? "blur(4px)" : isHover ? "blur(1.5px)" : "none",
          }}
        >
          <span className="flex flex-col items-center gap-1 text-white/90 text-xs font-semibold pointer-events-auto select-none">
            <Camera size={29} className="mb-1 drop-shadow shadow-glow" />
            {dragOver ? (
              <>Drop image to replace</>
            ) : (
              <>
                Change image
                <span className="text-[11px] font-normal opacity-80">
                  Click or drag here
                </span>
              </>
            )}
          </span>
        </div>
      )}

      {/* Tooltip: Change image */}
      {showTooltip && !dragOver && (
        <span
          className="
            absolute left-1/2 -translate-x-1/2 top-[98%] text-xs mt-1
            bg-black/80 text-white px-2 py-1 rounded shadow z-30 whitespace-nowrap pointer-events-none
            animate-fade-in
          "
        >
          Change image
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        tabIndex={-1}
        aria-label="Upload new image"
      />
    </div>
  );
};

export default EditableImage;
