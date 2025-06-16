
import React from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { PaymentGateEnhanced } from '@/components/PaymentGateEnhanced';
import { ModernDashboardSidebar } from '@/components/dashboard/ModernDashboardSidebar';
import { CustomizationRequestsTable } from '@/components/dashboard/CustomizationRequestsTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CustomerRequests: React.FC = () => {
  const { user } = useAuthContext();

  const handleNewRequest = () => {
    window.location.href = 'mailto:support@chairlinked.com?subject=Website Customization Request&body=Hi, I\'d like to request changes to my ChairLinked website. Here\'s what I\'d like to update:%0D%0A%0D%0A[Please describe your requested changes]';
  };

  return (
    <PaymentGateEnhanced feature="customization requests">
      <div className="min-h-screen flex w-full bg-zinc-200 gap-6 p-6">
        <ModernDashboardSidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Customization Requests
                </h1>
                <p className="text-slate-600 text-lg">
                  View and manage your website customization requests
                </p>
              </div>
              <Button 
                onClick={handleNewRequest}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl beautiful-shadow"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>

            <CustomizationRequestsTable />
          </div>
        </div>
      </div>
    </PaymentGateEnhanced>
  );
};

export default CustomerRequests;
