
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Customer, CustomerStats } from '@/hooks/types/customerTypes';
import { 
  fetchCustomersData, 
  cancelCustomerSubscription, 
  reactivateCustomerSubscription, 
  deleteCustomerAccountService 
} from '@/services/customerService';
import { calculateCustomerStats } from '@/utils/customerStatsCalculator';

export function useCustomerManagement() {
  const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
  
  // Mock customer data for development
  const mockCustomers: Customer[] = [
    {
      id: 'cust-1',
      full_name: 'Jane Smith',
      email: 'jane@beautysta.com',
      site_id: 'site-1',
      site_slug: 'janes-beauty-studio',
      business_name: "Jane's Beauty Studio",
      subscription_status: 'active',
      subscription_tier: 'pro',
      subscription_start_date: '2024-01-15',
      monthly_revenue: 29.99,
      lifetime_value: 359.88,
      last_login: '2024-06-15',
      created_at: '2024-01-15',
      updated_at: '2024-06-15',
    },
    {
      id: 'cust-2', 
      full_name: 'Mike Johnson',
      email: 'mike@salon.com',
      site_id: 'site-2',
      site_slug: 'mikes-hair-salon',
      business_name: "Mike's Hair Salon",
      subscription_status: 'active',
      subscription_tier: 'basic',
      subscription_start_date: '2024-02-20',
      monthly_revenue: 19.99,
      lifetime_value: 199.90,
      last_login: '2024-06-14',
      created_at: '2024-02-20',
      updated_at: '2024-06-14',
    }
  ];

  const mockStats: CustomerStats = {
    totalCustomers: 2,
    activeSubscribers: 2,
    monthlyRevenue: 49.98,
    conversionRate: 15.5,
  };

  const [customers, setCustomers] = useState<Customer[]>(isDevMode ? mockCustomers : []);
  const [loading, setLoading] = useState(isDevMode ? false : true);
  const [stats, setStats] = useState<CustomerStats>(isDevMode ? mockStats : {
    totalCustomers: 0,
    activeSubscribers: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
  });
  const { toast } = useToast();

  const fetchCustomers = async () => {
    // Skip database calls in dev mode
    if (isDevMode) {
      console.log('fetchCustomers: Dev mode - using mock data');
      setCustomers(mockCustomers);
      setStats(mockStats);
      setLoading(false);
      return;
    }
    
    try {
      const customersWithRevenue = await fetchCustomersData();
      setCustomers(customersWithRevenue);
      
      // Calculate stats
      const calculatedStats = calculateCustomerStats(customersWithRevenue);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
    }
  };

  const cancelSubscription = async (customerEmail: string, reason?: string) => {
    try {
      await cancelCustomerSubscription(customerEmail, reason);
      toast({
        title: "Success",
        description: "Customer subscription cancelled successfully",
      });
      await fetchCustomers(); // Refresh the data
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  const reactivateSubscription = async (customerEmail: string) => {
    try {
      await reactivateCustomerSubscription(customerEmail);
      toast({
        title: "Success",
        description: "Customer subscription reactivated successfully",
      });
      await fetchCustomers(); // Refresh the data
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reactivate subscription",
        variant: "destructive",
      });
    }
  };

  const deleteCustomerAccount = async (customerEmail: string) => {
    try {
      await deleteCustomerAccountService(customerEmail);
      toast({
        title: "Success",
        description: "Customer account deleted successfully",
      });
      await fetchCustomers(); // Refresh the data
    } catch (error) {
      console.error('Error deleting customer account:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete customer account",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCustomers();
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    customers,
    loading,
    stats,
    refetch: fetchCustomers,
    cancelSubscription,
    reactivateSubscription,
    deleteCustomerAccount
  };
}

export type { Customer, CustomerStats } from '@/hooks/types/customerTypes';
