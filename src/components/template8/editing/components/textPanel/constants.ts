
import { Type, Palette, Settings, FileText } from "lucide-react";
import { Tab, FontWeightOption, TextAlignOption, ColorPreset } from "./types";

export const tabs: Tab[] = [
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'styling', label: 'Styling', icon: Settings }
];

export const fontCategories = ["Modern", "Luxury", "Bold", "Creative", "Classic", "System"];

export const fontWeightOptions: FontWeightOption[] = [
  { value: "normal", label: "Normal", class: "font-normal" },
  { value: "medium", label: "Medium", class: "font-medium" },
  { value: "semibold", label: "Semi Bold", class: "font-semibold" },
  { value: "bold", label: "Bold", class: "font-bold" }
];

export const textAlignOptions: TextAlignOption[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" }
];

export const colorPresets: ColorPreset[] = [
  { name: 'Dark', primary: '#1f2937', secondary: '#6b7280' },
  { name: 'Black', primary: '#000000', secondary: '#374151' },
  { name: 'Navy', primary: '#1e3a8a', secondary: '#64748b' },
  { name: 'Brown', primary: '#92400e', secondary: '#a3a3a3' },
  { name: 'Gray', primary: '#374151', secondary: '#9ca3af' }
];
