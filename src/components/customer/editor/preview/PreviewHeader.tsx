
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Smartphone, Monitor, Tablet } from 'lucide-react';
import { PreviewDevice, PreviewMode } from '@/hooks/usePreviewControl';

interface PreviewHeaderProps {
  isLiveSite: boolean;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
  previewDevice: PreviewDevice;
  setPreviewDevice: (device: PreviewDevice) => void;
  previewUrl: string;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  isLiveSite,
  previewMode,
  setPreviewMode,
  previewDevice,
  setPreviewDevice,
  previewUrl,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between h-14">
      <div className="flex items-center gap-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={previewMode === 'editor' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('editor')}
            className="px-3 py-1 text-xs"
          >
            Live Editor
          </Button>
          <Button
            variant={previewMode === 'live' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('live')}
            className="px-3 py-1 text-xs"
            disabled={!isLiveSite}
          >
            Published Version
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewDevice('desktop')}
            className="p-2"
          >
            <Monitor size={16} />
          </Button>
          <Button
            variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewDevice('tablet')}
            className="p-2"
          >
            <Tablet size={16} />
          </Button>
          <Button
            variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewDevice('mobile')}
            className="p-2"
          >
            <Smartphone size={16} />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(previewUrl, '_blank')}
          className="flex items-center gap-2"
        >
          <ExternalLink size={16} />
          Open Link
        </Button>
      </div>
    </div>
  );
};
