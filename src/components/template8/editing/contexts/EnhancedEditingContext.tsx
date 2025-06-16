
import React, { createContext, useContext, ReactNode } from "react";

interface EnhancedEditingContextType {
  isDirty: boolean;
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
  validationErrors: Record<string, string[]>;
  activeSection: string;
  markDirty: () => void;
  pushToHistory: (data: any) => void;
}

const EnhancedEditingContext = createContext<EnhancedEditingContextType | undefined>(undefined);

interface EnhancedEditingProviderProps {
  children: ReactNode;
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave: () => Promise<void>;
}

export const EnhancedEditingProvider: React.FC<EnhancedEditingProviderProps> = ({ 
  children, 
  pageData, 
  onUpdate, 
  onSave 
}) => {
  const [isDirty, setIsDirty] = React.useState(false);
  const [isPreviewMode, setIsPreviewMode] = React.useState(false);

  const markDirty = () => setIsDirty(true);
  const pushToHistory = (data: any) => {
    // Simple implementation
    console.log('Pushing to history:', data);
  };

  const togglePreviewMode = () => setIsPreviewMode(!isPreviewMode);

  const value = {
    isDirty,
    isPreviewMode,
    togglePreviewMode,
    validationErrors: {},
    activeSection: 'hero',
    markDirty,
    pushToHistory
  };

  return (
    <EnhancedEditingContext.Provider value={value}>
      {children}
    </EnhancedEditingContext.Provider>
  );
};

export const useEnhancedEditing = () => {
  const context = useContext(EnhancedEditingContext);
  if (!context) {
    // Return default values for Template 8
    return {
      isDirty: false,
      isPreviewMode: false,
      togglePreviewMode: () => {},
      validationErrors: {},
      activeSection: 'hero',
      markDirty: () => {},
      pushToHistory: () => {}
    };
  }
  return context;
};
