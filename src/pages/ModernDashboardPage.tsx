
import React from 'react';
import { PaymentStatusProvider } from '@/contexts/PaymentStatusContext';
import ModernDashboard from '@/components/dashboard/ModernDashboard';

const ModernDashboardPage: React.FC = () => {
  return (
    <PaymentStatusProvider>
      <ModernDashboard />
    </PaymentStatusProvider>
  );
};

export default ModernDashboardPage;
