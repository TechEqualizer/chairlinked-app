
import { useState } from 'react';

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
export type PreviewMode = 'live' | 'editor';

export const usePreviewControl = () => {
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('editor');

  return {
    previewDevice,
    setPreviewDevice,
    previewMode,
    setPreviewMode,
  };
};
