
import React from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { PaymentGateEnhanced } from '@/components/PaymentGateEnhanced';
import Template8GeneratorLayout from '@/components/template8/generator/Template8GeneratorLayout';

const Template8Generator: React.FC = () => {
  const { isAdmin } = useAuthContext();

  // Admin users can bypass payment gate when creating demo sites
  if (isAdmin) {
    return <Template8GeneratorLayout />;
  }

  // Regular users still need to go through payment gate
  return (
    <PaymentGateEnhanced feature="site creation">
      <Template8GeneratorLayout />
    </PaymentGateEnhanced>
  );
};

export default Template8Generator;
