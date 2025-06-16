
import React from "react";

interface EditableTooltipProps {
  show: boolean;
  isEditing: boolean;
  text?: string;
}

const EditableTooltip: React.FC<EditableTooltipProps> = ({
  show,
  isEditing,
  text = "Click to edit"
}) => {
  if (!show || isEditing) return null;
  return (
    <span
      className="
        absolute left-1/2 -translate-x-1/2 top-10 text-xs mt-2
        bg-black/80 text-white px-2 py-1 rounded shadow z-30 whitespace-nowrap select-none
        animate-fade-in pointer-events-none
      "
    >
      {text}
    </span>
  );
};

export default EditableTooltip;
