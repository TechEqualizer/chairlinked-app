
import React, { createContext, useContext, useState } from "react";

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DevicePreviewContextValue {
  currentDevice: DeviceType;
  setCurrentDevice: (device: DeviceType) => void;
  isMobilePreview: boolean;
  isTabletPreview: boolean;
  isDesktopPreview: boolean;
}

const DevicePreviewContext = createContext<DevicePreviewContextValue | undefined>(undefined);

interface DevicePreviewProviderProps {
  children: React.ReactNode;
}

export const DevicePreviewProvider: React.FC<DevicePreviewProviderProps> = ({ children }) => {
  const [currentDevice, setCurrentDevice] = useState<DeviceType>('desktop');

  const value: DevicePreviewContextValue = {
    currentDevice,
    setCurrentDevice,
    isMobilePreview: currentDevice === 'mobile',
    isTabletPreview: currentDevice === 'tablet',
    isDesktopPreview: currentDevice === 'desktop'
  };

  return (
    <DevicePreviewContext.Provider value={value}>
      {children}
    </DevicePreviewContext.Provider>
  );
};

export const useDevicePreview = () => {
  const context = useContext(DevicePreviewContext);
  if (!context) {
    throw new Error('useDevicePreview must be used within DevicePreviewProvider');
  }
  return context;
};
