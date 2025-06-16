
import React from 'react';
import { PaymentGateEnhanced } from '@/components/PaymentGateEnhanced';
import { CustomerContentEditor } from '@/components/customer/CustomerContentEditor';

const CustomerContentEditorPage: React.FC = () => {
  return (
    <PaymentGateEnhanced feature="content editor">
      <CustomerContentEditor />
    </PaymentGateEnhanced>
  );
};

// Ensure default export for dynamic import
export default CustomerContentEditorPage;
