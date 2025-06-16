import React from "react";
import { ManualSaveButton } from "./ManualSaveButton";

interface AdminEditingControlsProps {
  isAdmin: boolean;
  onSave: () => Promise<void>;
  pageData: any;
  isAutoSaving: boolean;
  onSaveSuccessNavigate?: () => void;
  onSaveAsDemo?: () => Promise<void>;
  isSavingDemo?: boolean;
}

export const AdminEditingControls: React.FC<AdminEditingControlsProps> = ({
  isAdmin,
  onSave,
  pageData,
  isAutoSaving,
  onSaveSuccessNavigate,
  onSaveAsDemo,
  isSavingDemo
}) => {
  if (!isAdmin) return null;
  return (
    <>
      <ManualSaveButton
        onSave={onSave}
        pageData={pageData}
        isDirty={true}
        isAutoSaving={isAutoSaving}
        className="text-xs"
        onSaveSuccessNavigate={onSaveSuccessNavigate}
      />
      {onSaveAsDemo && (
        <button
          onClick={onSaveAsDemo}
          disabled={isSavingDemo}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium disabled:opacity-50 transition-colors"
        >
          {isSavingDemo ? "Publishing..." : "Publish"}
        </button>
      )}
    </>
  );
};
