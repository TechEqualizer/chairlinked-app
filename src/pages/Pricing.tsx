
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { usePricingActions } from '@/hooks/usePricingActions';
import { CurrentSubscriptionCard } from '@/components/pricing/CurrentSubscriptionCard';
import { CombinedPaymentCard } from '@/components/pricing/CombinedPaymentCard';
import { RefreshStatusButton } from '@/components/pricing/RefreshStatusButton';

const Pricing: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const { setup_fee_paid, subscribed, subscription_tier, loading: statusLoading, refetch } = usePaymentStatus();
  const { loading, handleCombinedPayment, handleManageSubscription } = usePricingActions();

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading payment status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your ChairLinked Plan
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Get started today with setup fee + first month subscription
          </p>
          <p className="text-sm text-gray-500">
            Monthly billing continues automatically - cancel anytime
          </p>
        </div>

        {/* Current Subscription Status - Only show if subscribed */}
        {subscribed && (
          <CurrentSubscriptionCard
            subscriptionTier={subscription_tier}
            onManageSubscription={handleManageSubscription}
            loading={loading}
          />
        )}

        {/* Combined Setup Fee + Tier Selection - Only show if not subscribed */}
        {!subscribed && (
          <CombinedPaymentCard
            onCombinedPayment={handleCombinedPayment}
            loading={loading}
          />
        )}

        {/* Refresh Status */}
        <RefreshStatusButton onRefresh={refetch} />
      </div>
    </div>
  );
};

export default Pricing;
