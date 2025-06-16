
import React from "react";
import EnhancedBackgroundControls from "./EnhancedBackgroundControls";

interface BackgroundControlsProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const BackgroundControls: React.FC<BackgroundControlsProps> = ({ pageData, onUpdate }) => {
  return <EnhancedBackgroundControls pageData={pageData} onUpdate={onUpdate} />;
};

export default BackgroundControls;
