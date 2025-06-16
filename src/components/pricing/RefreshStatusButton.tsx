
import React from 'react';
import { Button } from '@/components/ui/button';

interface RefreshStatusButtonProps {
  onRefresh: () => void;
}

export const RefreshStatusButton: React.FC<RefreshStatusButtonProps> = ({ onRefresh }) => {
  return (
    <div className="text-center">
      <Button 
        onClick={onRefresh}
        variant="ghost"
        size="sm"
      >
        Refresh Status
      </Button>
    </div>
  );
};
