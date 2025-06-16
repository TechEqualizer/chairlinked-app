
import React from "react";
import type { EditableTextProps } from "./EditableText.types";
import EditableTextContent from "./EditableTextContent";

const EditableText: React.FC<EditableTextProps> = (props) => (
  <EditableTextContent {...props} />
);

export default EditableText;
