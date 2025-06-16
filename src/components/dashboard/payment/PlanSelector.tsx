
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';

interface PlanTier {
  value: string;
  label: string;
  price: string;
  monthlyAmount: number;
  description: string;
  features: string[];
}

interface PlanSelectorProps {
  tiers: PlanTier[];
  selectedTier: string;
  onTierChange: (tier: string) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  tiers,
  selectedTier,
  onTierChange
}) => {
  const selectedTierData = tiers.find(t => t.value === selectedTier);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Your Plan</h3>
        <Select value={selectedTier} onValueChange={onTierChange}>
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Select a subscription tier" />
          </SelectTrigger>
          <SelectContent>
            {tiers.map((tier) => (
              <SelectItem key={tier.value} value={tier.value} className="py-3">
                <div className="flex flex-col">
                  <div className="font-medium text-slate-900">
                    {tier.label} - {tier.price}
                  </div>
                  <div className="text-sm text-slate-500">
                    {tier.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTierData && (
        <div className="bg-slate-50 rounded-xl p-4">
          <h4 className="font-medium text-slate-900 mb-3">
            {selectedTierData.label} includes:
          </h4>
          <div className="space-y-2">
            {selectedTierData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
