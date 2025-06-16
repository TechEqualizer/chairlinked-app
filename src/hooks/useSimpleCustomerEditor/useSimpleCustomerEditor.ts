
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SiteWithLifecycle } from '@/types/siteLifecycle';
import { SimpleEditorData } from './types';
import { loadSiteData } from './dataLoader';
import { saveSiteData, publishSite as publishSiteService } from './dataSaver';

export const useSimpleCustomerEditor = (claimedSite: SiteWithLifecycle | null) => {
  const { toast } = useToast();
  const [data, setData] = useState<SimpleEditorData>({
    businessName: '',
    tagline: '',
    headline: '',
    subheadline: '',
    description: '',
    ctaText: 'Get Started',
    phone: '',
    email: '',
    address: '',
    primaryColor: '#6B46C1',
    logoUrl: '',
    stories: [],
    gallery: [],
    testimonials: [],
    businessHours: {},
    socialLinks: {},
    bookingUrl: '',
    services: [],
    specialties: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load data when claimedSite becomes available
  useEffect(() => {
    const loadDataEffect = async () => {
      if (!claimedSite?.id) {
        console.log('[useSimpleCustomerEditor] No claimed site available, skipping data load');
        setLoading(false);
        return;
      }

      console.log('[useSimpleCustomerEditor] Starting data transformation for site:', claimedSite.id);
      setLoading(true);
      
      try {
        const loadedData = await loadSiteData(claimedSite);
        setData(loadedData);
        setHasChanges(false);
        console.log('[useSimpleCustomerEditor] Data loaded and set successfully');
      } catch (error) {
        console.error('[useSimpleCustomerEditor] Error loading data:', error);
        toast({
          title: "Data Loading Error",
          description: "Failed to load site data. Using default values.",
          variant: "destructive",
        });
        
        // Set default data on error to prevent infinite loading
        setData({
          businessName: claimedSite.business_name || 'My Business',
          tagline: '',
          headline: '',
          subheadline: '',
          description: '',
          ctaText: 'Get Started',
          phone: '',
          email: '',
          address: '',
          primaryColor: '#6B46C1',
          logoUrl: '',
          stories: [],
          gallery: [],
          testimonials: [],
          businessHours: {},
          socialLinks: {},
          bookingUrl: '',
          services: [],
          specialties: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadDataEffect();
  }, [claimedSite?.id, toast]);

  // Auto-save with debouncing
  const saveData = useCallback(async () => {
    if (!claimedSite?.id || !hasChanges) return;

    setSaving(true);
    try {
      console.log('[useSimpleCustomerEditor] Saving data for site:', claimedSite.id);
      await saveSiteData(data, claimedSite);
      setHasChanges(false);
      toast({
        title: "Saved",
        description: "Your changes have been saved automatically",
      });
    } catch (error) {
      console.error('[useSimpleCustomerEditor] Error saving:', error);
      toast({
        title: "Save Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [data, claimedSite, hasChanges, toast]);

  // Debounced auto-save
  useEffect(() => {
    if (!hasChanges || !claimedSite?.id) return;
    
    const timer = setTimeout(() => {
      saveData();
    }, 2000); // Auto-save after 2 seconds of no changes

    return () => clearTimeout(timer);
  }, [data, hasChanges, saveData, claimedSite?.id]);

  const updateField = (field: keyof SimpleEditorData, value: any) => {
    console.log('[useSimpleCustomerEditor] Updating field:', field, 'with value:', value);
    setData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const publishSite = async () => {
    if (!claimedSite?.id) return;

    setSaving(true);
    try {
      console.log('[useSimpleCustomerEditor] Publishing site:', claimedSite.id);
      // Save first, then publish
      if (hasChanges) {
        await saveSiteData(data, claimedSite);
        setHasChanges(false);
      }

      await publishSiteService(claimedSite);

      toast({
        title: "Published!",
        description: "Your website is now live",
      });
    } catch (error) {
      console.error('[useSimpleCustomerEditor] Error publishing:', error);
      toast({
        title: "Publish Error",
        description: "Failed to publish site",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    data,
    loading,
    saving,
    hasChanges,
    updateField,
    publishSite,
    saveData
  };
};
