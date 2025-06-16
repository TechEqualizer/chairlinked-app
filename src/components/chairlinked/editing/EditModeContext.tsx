
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
}

export const EditModeProvider: React.FC<EditModeProviderProps> = ({
  children,
  initialEditMode = false,
  isProductionPreview = false // NEW: defaults to false
}) => {
  // In preview mode (view-only), always force isEditMode = false
  const [isEditMode, setIsEditMode] = React.useState(
    isProductionPreview ? false : initialEditMode
  );
  const [unsaved, setUnsaved] = React.useState(false);

  React.useEffect(() => {
    if (isProductionPreview) setIsEditMode(false);
  }, [isProductionPreview]);

  return (
    <EditModeContext.Provider value={{
      isEditMode: isProductionPreview ? false : isEditMode,
      setIsEditMode: isProductionPreview ? () => {} : setIsEditMode,
      setUnsaved: isProductionPreview ? () => {} : setUnsaved
    }}>
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
