
export interface Customer {
  id: string;
  email: string;
  subscription_tier: string | null;
  subscribed: boolean;
  subscription_end: string | null;
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  total_revenue?: number;
  stripe_customer_id: string | null;
}

export interface CustomerStats {
  totalCustomers: number;
  activeSubscribers: number;
  monthlyRevenue: number;
  conversionRate: number;
}

export interface RpcResponse {
  success: boolean;
  message: string;
}
