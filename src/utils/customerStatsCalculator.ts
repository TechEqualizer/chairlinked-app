
import { Customer, CustomerStats } from '@/hooks/types/customerTypes';

export const calculateCustomerStats = (customers: Customer[]): CustomerStats => {
  const totalCustomers = customers.length;
  const activeSubscribers = customers.filter(c => c.subscribed).length;
  const monthlyRevenue = customers
    .filter(c => c.subscribed)
    .reduce((sum, customer) => {
      // Estimate monthly revenue based on subscription tier
      const tierRevenue = customer.subscription_tier === 'premium' ? 2999 : 999; // in cents
      return sum + tierRevenue;
    }, 0);
  
  const conversionRate = totalCustomers > 0 ? Math.round((activeSubscribers / totalCustomers) * 100) : 0;

  return {
    totalCustomers,
    activeSubscribers,
    monthlyRevenue,
    conversionRate,
  };
};
