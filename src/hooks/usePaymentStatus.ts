
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface PaymentStatus {
  setup_fee_paid: boolean;
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  loading: boolean;
  error: string | null;
}

export const usePaymentStatus = () => {
  const [status, setStatus] = useState<PaymentStatus>({
    setup_fee_paid: false,
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    loading: true,
    error: null
  });

  const { user, isAuthenticated } = useAuthContext();

  const checkPaymentStatus = async () => {
    if (!isAuthenticated || !user) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-payment-status');
      
      if (error) throw error;

      setStatus({
        setup_fee_paid: data.setup_fee_paid || false,
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || null,
        subscription_end: data.subscription_end || null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check payment status'
      }));
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, [isAuthenticated, user]);

  return {
    ...status,
    refetch: checkPaymentStatus
  };
};
