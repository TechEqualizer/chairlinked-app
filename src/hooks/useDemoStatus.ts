
import { useState, useEffect } from 'react';
import { DemoStatus } from '@/types/demoTypes';

export const useDemoStatus = (expirationDate: string | null): DemoStatus | null => {
  const [status, setStatus] = useState<DemoStatus | null>(null);

  useEffect(() => {
    if (!expirationDate) return;

    const updateStatus = () => {
      const now = new Date();
      const expires = new Date(expirationDate);
      const timeRemaining = expires.getTime() - now.getTime();
      
      const isExpired = timeRemaining <= 0;
      const hoursRemaining = timeRemaining / (1000 * 60 * 60);
      const isUrgent = hoursRemaining <= 24 && hoursRemaining > 0;
      
      let timeRemainingFormatted = '';
      if (timeRemaining > 0) {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          timeRemainingFormatted = `${days}d ${hours}h`;
        } else if (hours > 0) {
          timeRemainingFormatted = `${hours}h ${minutes}m`;
        } else {
          timeRemainingFormatted = `${minutes}m`;
        }
      }

      setStatus({
        isExpired,
        timeRemaining,
        timeRemainingFormatted,
        isUrgent,
        expirationDate: expires
      });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [expirationDate]);

  return status;
};
