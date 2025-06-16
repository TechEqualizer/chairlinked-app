
export type Palette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  textMuted: string;
  border: string;
  shadow: string;
};

export const luxuryPalette: Palette = {
  primary: "#201c1b",           // rich charcoal
  secondary: "#f7ecd8",         // ivory
  accent: "#d4af37",            // luxury gold
  background: "#181514",        // black-brown
  backgroundSecondary: "#292222", // muted surface
  text: "#f7ecd8",              // ivory text
  textMuted: "#b8a478",         // muted gold
  border: "#d4af3780",          // gold border w/opacity
  shadow: "0 8px 36px rgba(212, 175, 55, 0.07)"
};
