
import React from 'react';
import { ModernDashboardSidebar } from '@/components/dashboard/ModernDashboardSidebar';
import { PaymentGateEnhanced } from '@/components/PaymentGateEnhanced';
import ModernCustomerSettings from '@/components/dashboard/ModernCustomerSettings';

const CustomerSettings: React.FC = () => {
  return (
    <PaymentGateEnhanced feature="customer settings">
      <div className="min-h-screen flex w-full bg-zinc-200 gap-6 p-6">
        <ModernDashboardSidebar />
        <div className="flex-1 overflow-auto">
          <ModernCustomerSettings />
        </div>
      </div>
    </PaymentGateEnhanced>
  );
};

export default CustomerSettings;
