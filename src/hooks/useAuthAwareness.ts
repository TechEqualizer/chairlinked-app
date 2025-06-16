
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface AuthAwarenessResult {
  isReady: boolean;
  isAuthenticated: boolean;
  canSaveDemo: boolean;
  requiresLogin: boolean;
  handleAuthRequired: () => void;
}

/**
 * Hook to provide authentication awareness for demo saving operations
 */
export const useAuthAwareness = (): AuthAwarenessResult => {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { toast } = useToast();
  const [hasShownAuthPrompt, setHasShownAuthPrompt] = useState(false);

  const isReady = !authLoading;
  const canSaveDemo = isReady && isAuthenticated;
  const requiresLogin = isReady && !isAuthenticated;

  const handleAuthRequired = () => {
    if (!hasShownAuthPrompt && requiresLogin) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your demo to the database",
        duration: 5000,
      });
      setHasShownAuthPrompt(true);
    }
  };

  // Reset the prompt flag when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      setHasShownAuthPrompt(false);
    }
  }, [isAuthenticated]);

  return {
    isReady,
    isAuthenticated,
    canSaveDemo,
    requiresLogin,
    handleAuthRequired
  };
};
