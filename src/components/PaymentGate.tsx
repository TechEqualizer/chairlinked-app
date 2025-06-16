
import React from 'react';
import { useEnhancedPaymentStatus } from '@/hooks/useEnhancedPaymentStatus';
import { DashboardPaymentPrompt } from '@/components/dashboard/DashboardPaymentPrompt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClaimedSite {
  id: string;
  business_name: string;
  site_slug: string;
  logo_url?: string;
  status: string;
  created_at: string;
  claimed_at: string;
}

interface PaymentGateProps {
  children: React.ReactNode;
  requiredTier?: 'lite' | 'pro' | 'business';
  feature?: string;
  showIntegratedPrompt?: boolean;
  claimedSite?: ClaimedSite | null;
}

export const PaymentGate: React.FC<PaymentGateProps> = ({ 
  children, 
  requiredTier = 'lite',
  feature = 'this feature',
  showIntegratedPrompt = false,
  claimedSite
}) => {
  const { 
    setup_fee_paid, 
    subscribed, 
    subscription_tier, 
    loading, 
    error,
    refetch,
    lastChecked 
  } = useEnhancedPaymentStatus();
  const navigate = useNavigate();

  console.log('[PaymentGate] Payment status:', { 
    setup_fee_paid,
    subscribed,
    subscription_tier,
    loading,
    error,
    lastChecked: lastChecked ? new Date(lastChecked).toISOString() : null,
    showIntegratedPrompt, 
    claimedSite: claimedSite ? claimedSite.business_name : 'null'
  });

  const tierLevels = {
    lite: 1,
    pro: 2,
    business: 3
  };

  const currentTierLevel = subscription_tier ? tierLevels[subscription_tier as keyof typeof tierLevels] : 0;
  const requiredTierLevel = tierLevels[requiredTier];

  // Show loading state with option to retry
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Checking your subscription status...</p>
          {error && (
            <div className="space-y-2">
              <p className="text-red-600 text-sm">Error: {error}</p>
              <Button
                onClick={refetch}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Check if setup fee is paid
  if (!setup_fee_paid) {
    // Show integrated prompt if requested (for dashboard), otherwise show traditional blocking screen
    if (showIntegratedPrompt) {
      return <DashboardPaymentPrompt onPaymentSuccess={refetch} claimedSite={claimedSite} />;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <CardTitle>Get Started with ChairLinked</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Choose your plan and get started today with setup fee + first month subscription to access {feature}.
            </p>
            <Button onClick={() => navigate('/pricing')} className="w-full">
              Choose Plan & Get Started
            </Button>
            <div className="pt-2 border-t">
              <Button
                onClick={refetch}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-xs"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if subscription is active
  if (!subscribed) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <CardTitle>Subscription Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Please subscribe to a monthly plan to access {feature}.
            </p>
            <Button onClick={() => navigate('/pricing')} className="w-full">
              Choose Subscription Plan
            </Button>
            <div className="pt-2 border-t">
              <Button
                onClick={refetch}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-xs"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if tier level is sufficient
  if (currentTierLevel < requiredTierLevel) {
    const requiredTierName = requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1);
    
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <CardTitle>Upgrade Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {feature} requires a {requiredTierName} plan or higher. 
              You currently have {subscription_tier?.charAt(0).toUpperCase() + subscription_tier?.slice(1)}.
            </p>
            <Button onClick={() => navigate('/pricing')} className="w-full">
              Upgrade to {requiredTierName}
            </Button>
            <div className="pt-2 border-t">
              <Button
                onClick={refetch}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-xs"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};
