
import { usePaymentStatusContext } from '@/contexts/PaymentStatusContext';

export const useEnhancedPaymentStatus = () => {
  const context = usePaymentStatusContext();
  
  return {
    setup_fee_paid: context.setup_fee_paid,
    subscribed: context.subscribed,
    subscription_tier: context.subscription_tier,
    subscription_end: context.subscription_end,
    loading: context.loading,
    error: context.error,
    refetch: context.refetch,
    lastChecked: null // Removed complex caching logic
  };
};
