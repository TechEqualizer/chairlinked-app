
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEnhancedPaymentStatus } from '@/hooks/useEnhancedPaymentStatus';
import { usePricingActions } from '@/hooks/usePricingActions';
import { Crown, Calendar, CreditCard, ArrowUpRight } from 'lucide-react';

export const SubscriptionSidebar: React.FC = () => {
  const { subscribed, subscription_tier, subscription_end, loading } = useEnhancedPaymentStatus();
  const { handleManageSubscription, loading: actionLoading } = usePricingActions();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className="w-5 h-5 text-yellow-500" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Badge className="mb-2">
              {subscription_tier?.charAt(0).toUpperCase() + subscription_tier?.slice(1) || 'Free'} Plan
            </Badge>
            <p className="text-sm text-gray-600">
              {subscribed ? 'Active subscription' : 'No active subscription'}
            </p>
          </div>

          {subscription_end && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Renews {new Date(subscription_end).toLocaleDateString()}</span>
            </div>
          )}

          <Button 
            onClick={handleManageSubscription}
            disabled={actionLoading === 'manage'}
            className="w-full"
            variant="outline"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Manage Subscription
          </Button>
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      {(!subscribed || subscription_tier === 'lite') && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-800">Upgrade Your Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-purple-700">
              Unlock premium features and advanced analytics with our Pro or Business plans.
            </p>
            <ul className="text-xs text-purple-600 space-y-1">
              <li>• Advanced site customization</li>
              <li>• Detailed analytics dashboard</li>
              <li>• Priority support</li>
              <li>• Custom domain options</li>
            </ul>
            <Button 
              onClick={() => window.location.href = '/pricing'}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Upgrade Now
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Support */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Get support for your ChairLinked site and subscription.
          </p>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              📚 Documentation
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              💬 Contact Support
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              🎥 Video Tutorials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
