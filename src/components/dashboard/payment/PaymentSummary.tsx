
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentSummaryProps {
  selectedTierData: {
    label: string;
    monthlyAmount: number;
    price: string;
  } | undefined;
  totalTodayFormatted: string;
  loading: string | null;
  onPayment: () => void;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  selectedTierData,
  totalTodayFormatted,
  loading,
  onPayment
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Summary</h3>
        
        {selectedTierData && (
          <div className="space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Setup fee:</span>
              <span>$97.00</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>First month ({selectedTierData.label}):</span>
              <span>${(selectedTierData.monthlyAmount / 100).toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between text-lg font-semibold text-slate-900">
                <span>Total today:</span>
                <span>${totalTodayFormatted}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-green-50 rounded-xl p-4">
        <h4 className="font-medium text-green-800 mb-2">What happens next:</h4>
        <div className="space-y-1 text-sm text-green-700">
          <div>• Immediate access to your full dashboard</div>
          <div>• {selectedTierData ? `${selectedTierData.price}` : 'Monthly'} billing continues automatically</div>
          <div>• Cancel or change plan anytime</div>
          <div>• Full access to all ChairLinked features</div>
        </div>
      </div>

      {loading === 'payment' && (
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-medium">Redirecting to Stripe...</span>
          </div>
          <p className="text-blue-600 text-sm">
            Please complete your payment in the new tab that opened
          </p>
        </div>
      )}

      <Button 
        onClick={onPayment}
        disabled={!selectedTierData || loading === 'payment'}
        className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl beautiful-shadow"
      >
        {loading === 'payment' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        <CreditCard className="w-4 h-4 mr-2" />
        Pay ${selectedTierData ? totalTodayFormatted : '97+'} - Start {selectedTierData ? selectedTierData.label : 'Selected Plan'}
      </Button>
    </div>
  );
};
