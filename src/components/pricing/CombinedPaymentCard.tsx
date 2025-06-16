
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Loader2 } from 'lucide-react';

interface Tier {
  value: string;
  label: string;
  price: string;
  monthlyAmount: number;
  description: string;
}

interface CombinedPaymentCardProps {
  onCombinedPayment: (tier: string) => void;
  loading: string | null;
}

const tiers: Tier[] = [
  { value: 'lite', label: 'Lite Plan', price: '$2.99/month', monthlyAmount: 299, description: 'Up to 3 demo sites, Basic templates' },
  { value: 'pro', label: 'Pro Plan', price: '$5.99/month', monthlyAmount: 599, description: 'Up to 10 demo sites, Premium templates, Analytics' },
  { value: 'business', label: 'Business Plan', price: '$9.99/month', monthlyAmount: 999, description: 'Unlimited sites, All templates, Advanced analytics' }
];

export const CombinedPaymentCard: React.FC<CombinedPaymentCardProps> = ({
  onCombinedPayment,
  loading
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('');

  const selectedTierData = tiers.find(t => t.value === selectedTier);
  const setupFee = 9700; // $97 in cents
  const totalToday = selectedTierData ? setupFee + selectedTierData.monthlyAmount : setupFee;
  const totalTodayFormatted = (totalToday / 100).toFixed(2);

  const handlePayment = () => {
    if (selectedTier) {
      onCombinedPayment(selectedTier);
    }
  };

  return (
    <div className="mb-12">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            Get Started with ChairLinked
          </CardTitle>
          <div className="text-3xl font-bold">
            {selectedTierData ? `$${totalTodayFormatted}` : '$97+'} Today
          </div>
          <p className="text-gray-600">Setup fee + first month subscription</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose Your Monthly Plan</label>
            <Select onValueChange={setSelectedTier}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subscription tier" />
              </SelectTrigger>
              <SelectContent>
                {tiers.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    <div>
                      <div className="font-medium">{tier.label} - {tier.price}</div>
                      <div className="text-sm text-gray-500">{tier.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTierData && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-blue-700 mb-2 font-medium">Billing Breakdown:</div>
              <div className="text-blue-600 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Setup fee:</span>
                  <span>$97.00</span>
                </div>
                <div className="flex justify-between">
                  <span>First month ({selectedTierData.label}):</span>
                  <span>${(selectedTierData.monthlyAmount / 100).toFixed(2)}</span>
                </div>
                <div className="border-t border-blue-200 pt-1 mt-1">
                  <div className="flex justify-between font-medium">
                    <span>Total today:</span>
                    <span>${totalTodayFormatted}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-green-700 mb-1 font-medium">What happens next:</div>
            <div className="text-green-600 text-sm space-y-1">
              <div>• Immediate access to your ChairLinked dashboard</div>
              <div>• {selectedTierData ? `${selectedTierData.price}` : 'Monthly'} billing continues automatically</div>
              <div>• Cancel or change plan anytime</div>
            </div>
          </div>

          {loading === 'payment' && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-medium">Redirecting to Stripe...</span>
              </div>
              <p className="text-blue-600 text-sm">
                Please complete your payment in the new tab that opened
              </p>
            </div>
          )}

          <Button 
            onClick={handlePayment}
            disabled={!selectedTier || loading === 'payment'}
            className="w-full"
          >
            {loading === 'payment' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Pay ${selectedTierData ? totalTodayFormatted : '97+'} - Start {selectedTierData ? selectedTierData.label : 'Selected Plan'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
