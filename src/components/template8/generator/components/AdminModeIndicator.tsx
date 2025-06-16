
import React from "react";
import { Button } from '@/components/template8/design-system/components/Button';
import { RotateCcw, Settings } from "lucide-react";
import { Badge } from '@/components/template8/design-system/components/Badge';
import { Flex } from '@/components/template8/design-system/components/Container';

/**
 * Component that indicates admin mode and provides admin-specific actions
 */
interface AdminModeIndicatorProps {
  onResetToForm: () => void;
  onNavigateToAdmin: () => void;
  className?: string;
}

const AdminModeIndicator: React.FC<AdminModeIndicatorProps> = ({
  onResetToForm,
  onNavigateToAdmin,
  className = ""
}) => {
  return (
    <Flex align="center" gap="sm" className={className}>
      <Badge 
        variant="filled" 
        color="secondary" 
        size="md"
        withDot
      >
        Admin Mode
      </Badge>
    </Flex>
  );
};

export default AdminModeIndicator;
