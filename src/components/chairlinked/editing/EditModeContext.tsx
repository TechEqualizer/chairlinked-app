
import React, { createContext, useContext, ReactNode } from "react";

interface EditModeContextType {
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  setUnsaved: (unsaved: boolean) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

interface EditModeProviderProps {
  children: ReactNode;
  initialEditMode?: boolean;
  isProductionPreview?: boolean; // NEW: allow passing preview status
  readOnly?: boolean; // NEW: allow forcing read-only mode
}

export const EditModeProvider: React.FC<EditModeProviderProps> = ({
  children,
  initialEditMode = false,
  isProductionPreview = false, // NEW: defaults to false
  readOnly = false // NEW: defaults to false
}) => {
  console.log('[EditModeProvider] Initializing with:', {
    initialEditMode,
    isProductionPreview,
    readOnly,
    finalEditMode: (isProductionPreview || readOnly) ? false : initialEditMode
  });
  
  // In preview mode OR read-only mode, always force isEditMode = false
  const [isEditMode, setIsEditMode] = React.useState(
    (isProductionPreview || readOnly) ? false : initialEditMode
  );
  const [unsaved, setUnsaved] = React.useState(false);

  React.useEffect(() => {
    if (isProductionPreview || readOnly) setIsEditMode(false);
  }, [isProductionPreview, readOnly]);

  const contextValue = {
    isEditMode: (isProductionPreview || readOnly) ? false : isEditMode,
    setIsEditMode: (isProductionPreview || readOnly) ? () => {} : setIsEditMode,
    setUnsaved: (isProductionPreview || readOnly) ? () => {} : setUnsaved
  };
  
  console.log('[EditModeProvider] Context value:', contextValue);
  
  return (
    <EditModeContext.Provider value={contextValue}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    // For components outside the context, return read-only mode
    return {
      isEditMode: false,
      setIsEditMode: () => {},
      setUnsaved: () => {},
    };
  }
  return context;
};
