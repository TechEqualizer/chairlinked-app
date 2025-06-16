
import React from 'react';
import { useEnhancedPaymentStatus } from '@/hooks/useEnhancedPaymentStatus';
import { DashboardPaymentPrompt } from '@/components/dashboard/DashboardPaymentPrompt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
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

interface PaymentGateEnhancedProps {
  children: React.ReactNode;
  requiredTier?: 'lite' | 'pro' | 'business';
  feature?: string;
  showIntegratedPrompt?: boolean;
  claimedSite?: ClaimedSite | null;
}

export const PaymentGateEnhanced: React.FC<PaymentGateEnhancedProps> = ({ 
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
    refetch
  } = useEnhancedPaymentStatus();
  
  const navigate = useNavigate();

  const tierLevels = {
    lite: 1,
    pro: 2,
    business: 3
  };

  const currentTierLevel = subscription_tier ? tierLevels[subscription_tier as keyof typeof tierLevels] : 0;
  const requiredTierLevel = tierLevels[requiredTier];

  // Show loading overlay while checking payment status
  if (loading) {
    return (
      <div className="relative">
        <div className="absolute top-0 right-0 z-10 bg-blue-50 border border-blue-200 rounded-lg p-3 m-4">
          <div className="flex items-center gap-2 text-blue-700 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying subscription...</span>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Show error with ability to continue
  if (error) {
    return (
      <div className="relative">
        <div className="absolute top-0 right-0 z-10 bg-amber-50 border border-amber-200 rounded-lg p-3 m-4">
          <div className="flex items-center gap-2 text-amber-700 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Unable to verify subscription</span>
            <Button onClick={refetch} size="sm" variant="outline" className="ml-2">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Check payment conditions
  const isSetupFeePaid = Boolean(setup_fee_paid);
  const isSubscribed = Boolean(subscribed);
  const hasValidTier = currentTierLevel >= requiredTierLevel;

  // Check if setup fee is paid
  if (!isSetupFeePaid) {
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
              Choose your plan and get started today to access {feature}.
            </p>
            <Button onClick={() => navigate('/pricing')} className="w-full">
              Choose Plan & Get Started
            </Button>
            <div className="pt-2 border-t">
              <Button onClick={refetch} variant="ghost" size="sm" className="flex items-center gap-2 text-xs">
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
  if (!isSubscribed) {
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
              <Button onClick={refetch} variant="ghost" size="sm" className="flex items-center gap-2 text-xs">
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
  if (!hasValidTier) {
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
              <Button onClick={refetch} variant="ghost" size="sm" className="flex items-center gap-2 text-xs">
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
