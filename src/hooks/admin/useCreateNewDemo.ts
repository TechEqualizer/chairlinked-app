
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "@/components/auth/AuthProvider";

export const useCreateNewDemo = () => {
  const { isAdmin } = useAuthContext();
  const navigate = useNavigate();

  const createNewDemo = useCallback(() => {
    if (!isAdmin) return;
    navigate('/template8-generator');
  }, [isAdmin, navigate]);

  return {
    createNewDemo,
    canPerformOperation: isAdmin
  };
};
