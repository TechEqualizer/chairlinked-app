
import React from "react";
import { Button } from "@/components/template8/design-system/components/Button";
import { Settings, Save } from "lucide-react";
import { Flex } from "@/components/template8/design-system/components/Container";

/**
 * Admin controls component for managing demo sites
 */
interface AdminControlsProps {
  onNavigateToAdmin: () => void;
  onSaveAsDemo: () => void;
  isSavingDemo: boolean;
  className?: string;
}

const AdminControls: React.FC<AdminControlsProps> = ({
  onNavigateToAdmin,
  onSaveAsDemo,
  isSavingDemo,
  className = ""
}) => {
  return (
    <Flex gap="sm" className={className}>
      <Button 
        onClick={onSaveAsDemo} 
        disabled={isSavingDemo} 
        size="sm" 
        variant="success"
        isLoading={isSavingDemo}
        leftIcon={!isSavingDemo ? <Save className="w-4 h-4" /> : undefined}
      >
        {isSavingDemo ? 'Saving...' : 'Save as Demo'}
      </Button>
    </Flex>
  );
};

export default AdminControls;
