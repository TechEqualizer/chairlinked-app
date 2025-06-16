
export type EditableTextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  tag?: EditableTextTag;
  className?: string;
  placeholder?: string;
  style?: React.CSSProperties;
}
