import { useState } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePricingActions = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { isAuthenticated } = useAuthContext();
  const { toast } = useToast();

  const handleCombinedPayment = async (selectedTier: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to make a payment",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTier) {
      toast({
        title: "Please select a tier",
        description: "Choose a subscription tier to continue",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading('payment');
      
      toast({
        title: "Redirecting to Stripe...",
        description: "You'll be taken to Stripe checkout in a new tab",
      });

      const { data, error } = await supabase.functions.invoke('create-combined-payment', {
        body: { tier: selectedTier }
      });
      
      if (error) throw error;
      
      // Open Stripe checkout in a new tab for better reliability
      const newTab = window.open(data.url, '_blank');
      
      // Check if popup was blocked
      if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
        toast({
          title: "Popup blocked",
          description: "Please allow popups and try again, or we'll redirect you directly",
        });
        // Fallback to direct redirect if popup is blocked
        setTimeout(() => {
          window.location.href = data.url;
        }, 2000);
      } else {
        toast({
          title: "Checkout opened",
          description: "Complete your payment in the new tab. Your demo site will be converted to live after payment.",
        });
      }
      
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to create payment session",
        variant: "destructive"
      });
    } finally {
      // Only clear loading after a delay to prevent immediate clearing
      setTimeout(() => {
        setLoading(null);
      }, 3000);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading('manage');
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      // Open customer portal in new tab
      const newTab = window.open(data.url, '_blank');
      
      if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
        toast({
          title: "Popup blocked",
          description: "Please allow popups and try again",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Dashboard opened",
          description: "Manage your subscription in the new tab",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open customer portal",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return {
    loading,
    handleCombinedPayment,
    handleManageSubscription
  };
};
