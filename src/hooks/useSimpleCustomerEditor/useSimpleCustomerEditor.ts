
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SiteWithLifecycle } from '@/types/siteLifecycle';
import { SimpleEditorData } from './types';
import { loadSiteData } from './dataLoader';
import { publishSite as publishSiteService } from './dataSaver';
import { EnhancedDemoSaveService } from '@/components/template8/generator/services/EnhancedDemoSaveService';
import type { Template8Data } from '@/components/template8/generator/types/GeneratorTypes';

// Transform SimpleEditorData to Template8Data for EnhancedDemoSaveService
const transformToTemplate8Data = (data: SimpleEditorData, claimedSite: SiteWithLifecycle | null): Template8Data => {
  return {
    businessName: data.businessName,
    headline: data.headline,
    subheadline: data.subheadline,
    tagline: data.tagline,
    description: data.description,
    heroImage: data.heroImageUrl,
    brandColor: data.primaryColor,
    ctaText: data.ctaText,
    contactEmail: data.email,
    phoneNumber: data.phone,
    bookingLink: data.bookingUrl,
    instagramHandle: data.socialLinks?.instagram,
    
    // Transform services
    services: data.services?.map((service, index) => ({
      title: service,
      description: data.specialties?.[index] || '',
      price: ''
    })) || [],
    
    // Transform testimonials
    testimonials: data.testimonials?.map((testimonial, index) => ({
      id: index + 1,
      name: testimonial.name,
      content: testimonial.text,
      rating: testimonial.rating,
      avatar: testimonial.avatarUrl,
      role: testimonial.service,
      featured: index === 0
    })) || [],
    
    // Transform gallery images
    images: data.gallery?.map((item, index) => ({
      id: index + 1,
      image: item.url,
      likes: 0,
      comments: 0,
      caption: item.title || item.description || '',
      user: data.businessName,
      category: 'work'
    })) || [],
    
    // Add demo tracking fields
    _demoId: claimedSite?.id,
    _isEditingExisting: true,
    _businessName: data.businessName,
    _lastUpdateTimestamp: Date.now()
  };
};

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

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

  // Enhanced save with EnhancedDemoSaveService
  const saveData = useCallback(async () => {
    if (!claimedSite?.id || !hasChanges) return;

    setSaving(true);
    setSaveError(null); // Clear previous errors
    try {
      console.log('[useSimpleCustomerEditor] Saving data for site using EnhancedDemoSaveService:', claimedSite.id);
      
      // Transform data to Template8Data format
      const template8Data = transformToTemplate8Data(data, claimedSite);
      
      // Use EnhancedDemoSaveService with existing site ID
      const result = await EnhancedDemoSaveService.saveDemo(template8Data, {
        existingDemoId: claimedSite.id,
        isEditingExisting: true,
        maxRetries: 2
      });

      if (result.success) {
        setHasChanges(false);
        setLastSaveTime(new Date());
        setSaveError(null);
        toast({
          title: "Saved",
          description: "Your changes have been saved successfully",
        });
        console.log('[useSimpleCustomerEditor] Save successful via EnhancedDemoSaveService');
      } else {
        // Enhanced error handling
        console.error('[useSimpleCustomerEditor] Enhanced save failed:', result.error);
        
        let errorTitle = "Save Error";
        let errorDescription = result.error || "Failed to save changes";
        
        if (result.requiresAuth) {
          errorTitle = "Authentication Required";
          errorDescription = "Please log in to save your changes";
        } else if (result.error?.includes('validation')) {
          errorTitle = "Data Validation Error";
          errorDescription = "Please check your input and try again";
        } else if (result.error?.includes('permission')) {
          errorTitle = "Permission Denied";
          errorDescription = "You don't have permission to edit this site";
        }
        
        setSaveError(errorDescription);
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[useSimpleCustomerEditor] Unexpected error during save:', error);
      const errorMessage = "An unexpected error occurred while saving. Please try again.";
      setSaveError(errorMessage);
      toast({
        title: "Unexpected Error",
        description: errorMessage,
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
      
      // Save first using EnhancedDemoSaveService if there are changes
      if (hasChanges) {
        console.log('[useSimpleCustomerEditor] Saving changes before publish');
        const template8Data = transformToTemplate8Data(data, claimedSite);
        
        const saveResult = await EnhancedDemoSaveService.saveDemo(template8Data, {
          existingDemoId: claimedSite.id,
          isEditingExisting: true,
          maxRetries: 2
        });

        if (!saveResult.success) {
          throw new Error(saveResult.error || 'Failed to save changes before publish');
        }
        
        setHasChanges(false);
      }

      // Then publish
      await publishSiteService(claimedSite);

      toast({
        title: "Published!",
        description: "Your website is now live",
      });
    } catch (error) {
      console.error('[useSimpleCustomerEditor] Error publishing:', error);
      
      let errorTitle = "Publish Error";
      let errorDescription = "Failed to publish site";
      
      if (error instanceof Error) {
        if (error.message.includes('save')) {
          errorTitle = "Save Error";
          errorDescription = "Failed to save changes before publishing";
        } else if (error.message.includes('permission')) {
          errorTitle = "Permission Denied";
          errorDescription = "You don't have permission to publish this site";
        } else {
          errorDescription = error.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
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
    saveError,
    lastSaveTime,
    updateField,
    publishSite,
    saveData
  };
};
