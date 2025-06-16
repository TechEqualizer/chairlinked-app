
import React from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { PaymentGate } from '@/components/PaymentGate';
import { ModernDashboardSidebar } from '@/components/dashboard/ModernDashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';

const CustomerSubscription: React.FC = () => {
  const { user } = useAuthContext();
  const { subscribed, loading } = usePaymentStatus();

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  const handleManagePortal = () => {
    // This would typically open Stripe customer portal
    console.log('Opening customer portal...');
  };

  return (
    <PaymentGate feature="subscription management">
      <div className="min-h-screen flex w-full bg-zinc-200 gap-6 p-6">
        <ModernDashboardSidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Manage Subscription
              </h1>
              <p className="text-slate-600 text-lg">
                View your current plan and billing information
              </p>
            </div>

            <div className="grid gap-6 mb-8">
              {/* Current Plan */}
              <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-slate-900">Current Plan</CardTitle>
                    <Badge className={subscribed ? 'bg-emerald-100 text-emerald-800 border-emerald-200 rounded-full' : 'bg-amber-100 text-amber-800 border-amber-200 rounded-full'}>
                      {subscribed ? 'Active' : 'Free Trial'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Plan Type</p>
                        <p className="font-medium text-slate-900">{subscribed ? 'Premium' : 'Free Trial'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Monthly Cost</p>
                        <p className="font-medium text-slate-900">{subscribed ? '$29.99' : '$0.00'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Next Billing</p>
                        <p className="font-medium text-slate-900">{subscribed ? 'Dec 8, 2024' : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    {!subscribed && (
                      <Button 
                        onClick={handleUpgrade}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl beautiful-shadow"
                      >
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={handleManagePortal}
                      className="rounded-xl border-slate-300 hover:bg-slate-50"
                    >
                      Manage Billing
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Features */}
              <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
                  <CardTitle className="text-xl text-slate-900">Plan Features</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Professional website creation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Custom domain support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Analytics and metrics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Priority support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Unlimited customization requests</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PaymentGate>
  );
};

export default CustomerSubscription;
