
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export interface CustomizationRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  site_id: string | null;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  chairlinked_sites?: {
    business_name: string;
    site_slug: string;
  };
  assigned_user?: {
    full_name: string;
  };
}

export const useCustomizationRequests = () => {
  const { user, isAdmin } = useAuthContext();
  const { toast } = useToast();
  const [requests, setRequests] = useState<CustomizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      setLoading(true);

      let query = supabase
        .from('customization_requests')
        .select(`
          *,
          chairlinked_sites(business_name, site_slug),
          assigned_user:user_profiles!assigned_to(full_name)
        `)
        .order('created_at', { ascending: false });

      // If not admin, only show user's own requests
      if (!isAdmin) {
        query = query.eq('customer_email', user.email);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Type cast the data to ensure proper typing
      const typedData = (data || []) as CustomizationRequest[];
      setRequests(typedData);
    } catch (error) {
      console.error('Error fetching customization requests:', error);
      toast({
        title: "Error",
        description: "Failed to load customization requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: {
    customer_name: string;
    customer_email: string;
    site_id?: string;
    title: string;
    description: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }) => {
    if (!user) return { error: 'No user found' };

    try {
      setCreating(true);

      const { error } = await supabase
        .from('customization_requests')
        .insert({
          ...requestData,
          priority: requestData.priority || 'medium'
        });

      if (error) throw error;

      await fetchRequests();

      toast({
        title: "Success",
        description: "Customization request created successfully"
      });

      return { error: null };
    } catch (error) {
      console.error('Error creating request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create request';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      return { error: errorMessage };
    } finally {
      setCreating(false);
    }
  };

  const updateRequest = async (id: string, updates: Partial<CustomizationRequest>) => {
    if (!user || !isAdmin) return { error: 'Unauthorized' };

    try {
      setUpdating(true);

      const { error } = await supabase
        .from('customization_requests')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchRequests();

      toast({
        title: "Success",
        description: "Request updated successfully"
      });

      return { error: null };
    } catch (error) {
      console.error('Error updating request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update request';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      return { error: errorMessage };
    } finally {
      setUpdating(false);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!user || !isAdmin) return { error: 'Unauthorized' };

    try {
      const { error } = await supabase
        .from('customization_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchRequests();

      toast({
        title: "Success",
        description: "Request deleted successfully"
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting request:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete request';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      return { error: errorMessage };
    }
  };

  return {
    requests,
    loading,
    creating,
    updating,
    createRequest,
    updateRequest,
    deleteRequest,
    refetch: fetchRequests
  };
};
