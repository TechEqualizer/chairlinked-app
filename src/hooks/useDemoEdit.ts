import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generatePreviewUrl, getWorkingUrl } from '@/utils/urlGenerator';

interface DemoSite {
  id: string;
  business_name: string;
  site_slug: string;
  prospect_name: string | null;
  prospect_email: string | null;
  generated_config: any;
  form_data: any;
  status: string;
  site_type: string;
  demo_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useDemoEdit = (siteId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [demo, setDemo] = useState<DemoSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [prospectName, setProspectName] = useState('');
  const [prospectEmail, setProspectEmail] = useState('');
  const [status, setStatus] = useState('draft');

  useEffect(() => {
    if (siteId) {
      loadDemo();
    }
  }, [siteId]);

  const loadDemo = async () => {
    try {
      const { data, error } = await supabase
        .from('chairlinked_sites')
        .select('*')
        .eq('id', siteId)
        .eq('site_type', 'demo')
        .single();

      if (error) throw error;

      console.log('[useDemoEdit] Loaded demo data:', {
        id: data.id,
        businessName: data.business_name,
        hasConfig: !!data.generated_config,
        configKeys: data.generated_config ? Object.keys(data.generated_config) : [],
        hasFormData: !!data.form_data,
        status: data.status,
        lastUpdated: data.updated_at
      });

      setDemo(data);
      setBusinessName(data.business_name);
      setProspectName(data.prospect_name || '');
      setProspectEmail(data.prospect_email || '');
      setStatus(data.status);
    } catch (error) {
      console.error('Error loading demo:', error);
      toast({
        title: "Error",
        description: "Failed to load demo site",
        variant: "destructive",
      });
      navigate('/admin/demos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!demo) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('chairlinked_sites')
        .update({
          business_name: businessName,
          prospect_name: prospectName || null,
          prospect_email: prospectEmail || null,
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', demo.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Demo site updated successfully",
      });

      navigate('/admin/demos');
    } catch (error) {
      console.error('Error saving demo:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (demo) {
      // Use the working URL pattern for preview, but normalize slug for demo sites
      let previewSlug = demo.site_slug;
      // If this is a demo site and the slug starts with "demo-", remove it
      if (demo.site_type === 'demo' && previewSlug.startsWith('demo-')) {
        previewSlug = previewSlug.replace(/^demo-/, '');
      }
      const previewUrl = getWorkingUrl({
        slug: previewSlug,
        siteType: demo.site_type as 'demo' | 'live',
        status: demo.status as 'draft' | 'published'
      });
      // Always open preview in a new tab as admin, so the AdminPreviewBar will show
      window.open(`${previewUrl}?preview=admin`, '_blank');
    }
  };

  const handleContinueEditing = () => {
    if (demo) {
      console.log('[useDemoEdit] Starting continue editing flow for demo:', {
        id: demo.id,
        slug: demo.site_slug,
        businessName: demo.business_name,
        hasConfig: !!demo.generated_config,
        configKeys: demo.generated_config ? Object.keys(demo.generated_config) : [],
        lastUpdated: demo.updated_at
      });

      // Clear any existing session storage to avoid conflicts
      sessionStorage.removeItem('editingDemoSite');
      
      // Create the editing data with enhanced structure for better recovery
      const editingData = {
        id: demo.id,
        slug: demo.site_slug,
        businessName: demo.business_name,
        config: demo.generated_config && Object.keys(demo.generated_config).length > 0 
          ? {
              ...demo.generated_config,
              _demoId: demo.id,
              _isEditingExisting: true,
              _lastDatabaseUpdate: demo.updated_at,
              _loadedFromDatabase: true
            }
          : {
              businessName: demo.business_name,
              _demoId: demo.id,
              _isEditingExisting: true,
              _lastDatabaseUpdate: demo.updated_at,
              _loadedFromDatabase: true,
              _createdFromMinimalData: true
            },
        recoveryMetadata: {
          demoId: demo.id,
          businessName: demo.business_name,
          slug: demo.site_slug,
          status: demo.status,
          siteType: demo.site_type,
          lastDatabaseUpdate: demo.updated_at,
          preparedAt: new Date().toISOString(),
          hasGeneratedConfig: !!demo.generated_config,
          configDataKeys: demo.generated_config ? Object.keys(demo.generated_config) : [],
          isValidForEditing: true,
          recoveryVersion: '4.1',
          loadSource: 'database',
          editingSessionId: `edit-${demo.id}-${Date.now()}`
        }
      };
      
      // Store the data with enhanced error handling
      try {
        sessionStorage.setItem('editingDemoSite', JSON.stringify(editingData));
        
        console.log('[useDemoEdit] Enhanced editing data stored successfully:', {
          key: 'editingDemoSite',
          demoId: demo.id,
          businessName: demo.business_name,
          hasConfig: !!editingData.config,
          configKeys: editingData.config ? Object.keys(editingData.config) : [],
          recoveryVersion: editingData.recoveryMetadata.recoveryVersion,
          sessionId: editingData.recoveryMetadata.editingSessionId
        });
        
        // Navigate to the generator with edit mode
        navigate('/template8-generator?mode=edit');
      } catch (error) {
        console.error('[useDemoEdit] Failed to store editing data:', error);
        toast({
          title: "Error",
          description: "Failed to prepare editing session. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    navigate('/admin/demos');
  };

  return {
    demo,
    loading,
    saving,
    businessName,
    setBusinessName,
    prospectName,
    setProspectName,
    prospectEmail,
    setProspectEmail,
    status,
    setStatus,
    handleSave,
    handlePreview,
    handleContinueEditing,
    handleBack
  };
};
