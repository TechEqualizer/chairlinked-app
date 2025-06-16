
/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'wistia-player': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        'media-id'?: string;
        'silentAutoPlay'?: string;
        'muted'?: string;
        'loop'?: string;
        'playButton'?: string;
        'controlsVisibleOnLoad'?: string;
        'aspect'?: string;
        'wistia-popover'?: string;
      },
      HTMLElement
    >;
  }
}
