import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Template8SectionRenderer } from '../../layout/Template8SectionRenderer';

interface SitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: any;
  previewUrl?: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const SitePreviewModal: React.FC<SitePreviewModalProps> = ({
  isOpen,
  onClose,
  siteData,
  previewUrl
}) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');

  const deviceSettings = {
    desktop: { width: '100%', height: '100%', icon: Monitor, label: 'Desktop' },
    tablet: { width: '768px', height: '1024px', icon: Tablet, label: 'Tablet' },
    mobile: { width: '375px', height: '667px', icon: Smartphone, label: 'Mobile' }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Site Preview
                </h2>
                <p className="text-sm text-gray-500">
                  {previewUrl ? 'External Preview' : siteData ? 'Live Preview' : 'No Preview Available'}
                </p>
              </div>
              
              {/* Device Selector */}
              <div className="flex items-center gap-1 bg-white rounded-lg border p-1">
                {Object.entries(deviceSettings).map(([device, config]) => {
                  const IconComponent = config.icon;
                  const isActive = selectedDevice === device;
                  
                  return (
                    <button
                      key={device}
                      onClick={() => setSelectedDevice(device as DeviceType)}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                        ${isActive 
                          ? 'bg-blue-500 text-white shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                    >
                      <IconComponent size={16} />
                      <span className="hidden sm:inline">{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* External Preview Button */}
              {previewUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink size={14} />
                  Open in New Tab
                </Button>
              )}
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 p-4 bg-gray-100 h-[calc(100vh-120px)] overflow-hidden">
            <div className="h-full flex items-center justify-center">
              <motion.div
                key={selectedDevice}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden"
                style={{
                  width: deviceSettings[selectedDevice].width,
                  height: deviceSettings[selectedDevice].height,
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                {previewUrl ? (
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title="Site Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : siteData ? (
                  <div className="w-full h-full overflow-auto relative bg-white">
                    {/* Debug info for development */}
                    {console.log('[SitePreviewModal] Rendering with siteData:', {
                      hasHeroTitle: !!siteData?.heroTitle,
                      hasHeroSubtitle: !!siteData?.heroSubtitle,
                      hasBusinessName: !!siteData?.businessName,
                      dataKeys: Object.keys(siteData || {})
                    })}
                    
                    {/* Live Preview using Template8SectionRenderer */}
                    <Template8SectionRenderer
                      pageData={siteData}
                      onUpdate={() => {}} // Read-only preview
                      isProductionPreview={true}
                      siteType="demo"
                      visibleSections={['hero', 'stories', 'gallery', 'testimonials', 'beforeAfter', 'booking', 'footer']}
                    />
                    {/* Preview Mode Indicator */}
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm z-50 shadow-lg">
                      🔍 Live Preview Mode
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Monitor className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Preview Available
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Unable to generate preview - site data not available.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SitePreviewModal;