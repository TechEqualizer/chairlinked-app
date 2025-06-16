import { useState, useCallback } from 'react';
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useBulkDeleteDemos } from './useBulkDeleteDemos';

export const useDemoCleanup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, user } = useAuthContext();
  const { bulkDeleteDemos } = useBulkDeleteDemos();

  const findDuplicateDemos = useCallback(async () => {
    if (!isAdmin || !user) return [];

    try {
      const { data: demos, error } = await supabase
        .from('chairlinked_sites')
        .select('*')
        .eq('site_type', 'demo')
        .order('business_name', { ascending: true });

      if (error) throw error;

      // Group demos by business name
      const grouped = demos.reduce((acc, demo) => {
        const name = demo.business_name.toLowerCase().trim();
        if (!acc[name]) acc[name] = [];
        acc[name].push(demo);
        return acc;
      }, {} as Record<string, any[]>);

      // Find duplicates (groups with more than 1 demo)
      const duplicates = Object.entries(grouped)
        .filter(([_, demos]) => demos.length > 1)
        .map(([name, demos]) => ({
          businessName: name,
          demos: demos.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
          duplicateCount: demos.length
        }));

      return duplicates;
    } catch (error) {
      console.error('Error finding duplicates:', error);
      return [];
    }
  }, [isAdmin, user]);

  const cleanupDuplicates = useCallback(async (duplicateGroups: any[], keepLatest = true) => {
    if (!isAdmin || !user) return;

    setIsLoading(true);
    try {
      const idsToDelete: string[] = [];

      duplicateGroups.forEach(group => {
        if (keepLatest && group.demos.length > 1) {
          // Keep the first (most recent) and delete the rest
          idsToDelete.push(...group.demos.slice(1).map((demo: any) => demo.id));
        }
      });

      if (idsToDelete.length > 0) {
        await bulkDeleteDemos(idsToDelete);
      }

    } catch (error) {
      console.error('Error cleaning duplicates:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, user, bulkDeleteDemos]);

  return {
    findDuplicateDemos,
    cleanupDuplicates,
    isLoading,
    canPerformOperations: isAdmin && !!user
  };
};
