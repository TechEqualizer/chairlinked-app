
import React from "react";
import { Pencil } from "lucide-react";

interface EditPencilIconProps {
  visible: boolean;
}

const EditPencilIcon: React.FC<EditPencilIconProps> = ({ visible }) => {
  if (!visible) return null;
  return (
    <span
      className="
        absolute top-2 right-2
        bg-fuchsia-600/90 text-white p-1.5 rounded-full shadow-glow
        transition-opacity duration-200 opacity-100 select-none
        flex items-center
        z-20
        pointer-events-none
      "
      style={{ fontSize: 15, boxShadow: "0 2px 8px 0 #f0abfc33" }}
      aria-label="Edit text"
    >
      <Pencil size={16} />
    </span>
  );
};

export default EditPencilIcon;
