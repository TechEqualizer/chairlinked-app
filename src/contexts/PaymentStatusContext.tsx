
import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
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

interface PaymentStatusContextType extends PaymentStatus {
  refetch: () => void;
}

const PaymentStatusContext = createContext<PaymentStatusContextType | undefined>(undefined);

const checkPaymentStatus = async () => {
  // Dev mode mock payment status - allow prospects to see claimed sites
  const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
  if (isDevMode) {
    return {
      setup_fee_paid: false, // Not paid initially to show payment prompt
      subscribed: false,
      subscription_tier: null,
      subscription_end: null,
    };
  }

  const { data, error } = await supabase.functions.invoke('check-payment-status');
  
  if (error) {
    throw new Error(error.message || 'Failed to check payment status');
  }

  return {
    setup_fee_paid: Boolean(data?.setup_fee_paid),
    subscribed: Boolean(data?.subscribed),
    subscription_tier: data?.subscription_tier || null,
    subscription_end: data?.subscription_end || null,
  };
};

export const PaymentStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthContext();

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['payment-status', user?.id],
    queryFn: checkPaymentStatus,
    enabled: isAuthenticated && !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const contextValue: PaymentStatusContextType = {
    setup_fee_paid: data?.setup_fee_paid || false,
    subscribed: data?.subscribed || false,
    subscription_tier: data?.subscription_tier || null,
    subscription_end: data?.subscription_end || null,
    loading: isLoading,
    error: error?.message || null,
    refetch: () => { refetch(); }
  };

  return (
    <PaymentStatusContext.Provider value={contextValue}>
      {children}
    </PaymentStatusContext.Provider>
  );
};

export const usePaymentStatusContext = (): PaymentStatusContextType => {
  const context = useContext(PaymentStatusContext);
  if (!context) {
    throw new Error('usePaymentStatusContext must be used within a PaymentStatusProvider');
  }
  return context;
};
