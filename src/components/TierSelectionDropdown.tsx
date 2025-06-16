
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, CreditCard, Settings } from 'lucide-react';

interface TierSelectionDropdownProps {
  onTierSelected: () => void;
}

export const TierSelectionDropdown: React.FC<TierSelectionDropdownProps> = ({ onTierSelected }) => {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const tiers = [
    { value: 'lite', label: 'Lite - $2.99/month', description: 'Up to 3 demo sites, Basic templates' },
    { value: 'pro', label: 'Pro - $5.99/month', description: 'Up to 10 demo sites, Premium templates, Analytics' },
    { value: 'business', label: 'Business - $9.99/month', description: 'Unlimited sites, All templates, Advanced analytics' }
  ];

  const getNextMonth = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleSubscribe = async () => {
    if (!selectedTier) {
      toast({
        title: "Please select a tier",
        description: "Choose a subscription tier to continue",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { tier: selectedTier }
      });
      
      if (error) throw error;
      
      // Open subscription checkout in new tab, but also redirect to customer portal after
      window.open(data.url, '_blank');
      
      // Show success message and redirect to customer portal after a delay
      toast({
        title: "Subscription Created!",
        description: "After completing payment, you'll be taken to your dashboard setup.",
      });

      // Redirect to customer portal after subscription setup
      setTimeout(async () => {
        try {
          const { data: portalData, error: portalError } = await supabase.functions.invoke('customer-portal');
          if (portalError) throw portalError;
          window.open(portalData.url, '_blank');
        } catch (error) {
          console.error('Error opening customer portal:', error);
          toast({
            title: "Note",
            description: "You can access your subscription dashboard from the pricing page.",
          });
        }
      }, 3000);

      onTierSelected();
    } catch (error) {
      toast({
        title: "Subscription Error",
        description: error instanceof Error ? error.message : "Failed to create subscription",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CreditCard className="w-5 h-5" />
          Choose Your Plan
        </CardTitle>
        <p className="text-gray-600">Select your monthly subscription tier</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Subscription Tier</label>
          <Select onValueChange={setSelectedTier}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subscription tier" />
            </SelectTrigger>
            <SelectContent>
              {tiers.map((tier) => (
                <SelectItem key={tier.value} value={tier.value}>
                  <div>
                    <div className="font-medium">{tier.label}</div>
                    <div className="text-sm text-gray-500">{tier.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Billing starts:</span>
          </div>
          <p className="text-blue-600 text-sm">
            Your first bill will be on {getNextMonth()}
          </p>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 mb-1">
            <Settings className="w-4 h-4" />
            <span className="font-medium">What happens next:</span>
          </div>
          <p className="text-green-600 text-sm">
            After payment, you'll be taken to your dashboard to manage your subscription and account settings.
          </p>
        </div>

        <Button 
          onClick={handleSubscribe}
          disabled={!selectedTier || loading}
          className="w-full"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Subscribe to {selectedTier ? tiers.find(t => t.value === selectedTier)?.label.split(' - ')[0] : 'Selected'} Plan
        </Button>
      </CardContent>
    </Card>
  );
};
