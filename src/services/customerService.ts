
import { supabase } from '@/integrations/supabase/client';
import { Customer, RpcResponse } from '@/hooks/types/customerTypes';

export const fetchCustomersData = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Calculate total revenue for each customer
  const customersWithRevenue = await Promise.all(
    (data || []).map(async (customer) => {
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount')
        .eq('user_id', customer.user_id)
        .eq('status', 'completed');

      if (!paymentsError && payments) {
        const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
        return { ...customer, total_revenue: totalRevenue };
      }
      return { ...customer, total_revenue: 0 };
    })
  );

  return customersWithRevenue;
};

export const cancelCustomerSubscription = async (customerEmail: string, reason?: string): Promise<void> => {
  const { data, error } = await supabase.rpc('cancel_customer_subscription', {
    customer_email: customerEmail,
    reason: reason || null
  });

  if (error) throw error;

  const response = data as unknown as RpcResponse;
  if (!response?.success) {
    throw new Error(response?.message || 'Failed to cancel subscription');
  }
};

export const reactivateCustomerSubscription = async (customerEmail: string): Promise<void> => {
  const { data, error } = await supabase.rpc('reactivate_customer_subscription', {
    customer_email: customerEmail
  });

  if (error) throw error;

  const response = data as unknown as RpcResponse;
  if (!response?.success) {
    throw new Error(response?.message || 'Failed to reactivate subscription');
  }
};

export const deleteCustomerAccountService = async (customerEmail: string): Promise<void> => {
  const { data, error } = await supabase.rpc('delete_customer_account', {
    customer_email: customerEmail
  });

  if (error) throw error;

  const response = data as unknown as RpcResponse;
  if (!response?.success) {
    throw new Error(response?.message || 'Failed to delete account');
  }
};
