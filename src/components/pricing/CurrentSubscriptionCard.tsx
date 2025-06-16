
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Loader2 } from 'lucide-react';

interface CurrentSubscriptionCardProps {
  subscriptionTier: string | null;
  onManageSubscription: () => void;
  loading: string | null;
}

export const CurrentSubscriptionCard: React.FC<CurrentSubscriptionCardProps> = ({
  subscriptionTier,
  onManageSubscription,
  loading
}) => {
  return (
    <div className="mb-12">
      <Card className="max-w-md mx-auto border-blue-200 bg-blue-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-blue-600" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            {subscriptionTier?.charAt(0).toUpperCase() + subscriptionTier?.slice(1)} Plan
          </Badge>
          <p className="text-gray-600">
            Your subscription is active and ready to use!
          </p>
          <Button 
            onClick={onManageSubscription}
            disabled={loading === 'manage'}
            variant="outline"
            className="w-full"
          >
            {loading === 'manage' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Manage Subscription
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
