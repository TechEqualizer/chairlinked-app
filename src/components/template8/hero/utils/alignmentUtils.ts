
// Utility functions for text alignment in hero components

export const getFlexAlignmentClasses = (textAlignment: string) => {
  switch (textAlignment) {
    case 'center':
      return 'items-center justify-center';
    case 'right':
      return 'items-end justify-end';
    case 'left':
    default:
      return 'items-start justify-start';
  }
};

export const getJustifyClasses = (textAlignment: string) => {
  switch (textAlignment) {
    case 'center':
      return 'justify-center';
    case 'right':
      return 'justify-end';
    case 'left':
    default:
      return 'justify-start';
  }
};

export const getTextAlignClasses = (textAlignment: string) => {
  switch (textAlignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    case 'left':
    default:
      return 'text-left';
  }
};

export const getResponsiveJustifyClasses = (textAlignment: string) => {
  switch (textAlignment) {
    case 'center':
      return 'justify-center';
    case 'right':
      return 'justify-center md:justify-end';
    case 'left':
    default:
      return 'justify-center md:justify-start';
  }
};
