
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SiteWithLifecycle } from '@/types/siteLifecycle';

export const useCustomerEditor = (claimedSite: SiteWithLifecycle | null) => {
    const { toast } = useToast();

    const [editorData, setEditorData] = useState<any>(null);
    const [originalData, setOriginalData] = useState<any>(null);
    const [dataLoading, setDataLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const loadSiteData = useCallback(async () => {
        if (!claimedSite?.id) {
            console.warn('[useCustomerEditor] No claimed site ID available');
            return;
        }

        console.log('[useCustomerEditor] Loading site data for:', claimedSite.id);
        setDataLoading(true);
        setLoadError(null);

        try {
            const { data, error } = await supabase
                .from('chairlinked_sites')
                .select('*')
                .eq('id', claimedSite.id)
                .single();

            if (error) {
                console.error('[useCustomerEditor] Database error:', error);
                throw error;
            }

            if (!data) {
                throw new Error('No site data found');
            }

            console.log('[useCustomerEditor] Raw database data:', data);

            const mappedData = {
                id: data.id,
                businessName: data.business_name,
                status: data.status,
                site_type: data.site_type,
                site_slug: data.site_slug,
                ...(data.generated_config && typeof data.generated_config === 'object' ? data.generated_config : {}),
                formData: data.form_data && typeof data.form_data === 'object' ? data.form_data : {},
                created_at: data.created_at,
                updated_at: data.updated_at
            };

            console.log('[useCustomerEditor] Mapped editor data:', mappedData);

            setEditorData(mappedData);
            setOriginalData(mappedData);
            setHasChanges(false);

        } catch (error) {
            console.error('[useCustomerEditor] Error loading site data:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to load site data';
            setLoadError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setDataLoading(false);
            console.log('[useCustomerEditor] Loading complete');
        }
    }, [claimedSite?.id, toast]);


    useEffect(() => {
        if (claimedSite?.id && !editorData) {
            loadSiteData();
        }
    }, [claimedSite?.id, editorData, loadSiteData]);


    const handleDataUpdate = (updates: any) => {
        setEditorData(prev => {
            const newData = { ...prev, ...updates };
            const hasActualChanges = JSON.stringify(newData) !== JSON.stringify(originalData);
            setHasChanges(hasActualChanges);
            return newData;
        });
    };

    const handleSave = async (publishChanges = false) => {
        if (!editorData || !claimedSite?.id) return;

        if (publishChanges) {
            setIsPublishing(true);
        } else {
            setIsSaving(true);
        }

        try {
            const { id, formData, created_at, updated_at, status, site_type, site_slug, ...configData } = editorData;

            const updateData: any = {
                business_name: editorData.businessName,
                generated_config: configData,
                updated_at: new Date().toISOString()
            };

            if (publishChanges) {
                updateData.status = 'published';
            }

            const { error } = await supabase
                .from('chairlinked_sites')
                .update(updateData)
                .eq('id', claimedSite.id);

            if (error) throw error;

            setOriginalData(editorData);
            setHasChanges(false);

            toast({
                title: "Success",
                description: publishChanges ? "Your changes have been published!" : "Your changes have been saved!",
            });
        } catch (error) {
            console.error('Error saving changes:', error);
            toast({
                title: "Error",
                description: publishChanges ? "Failed to publish changes" : "Failed to save changes",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
            setIsPublishing(false);
        }
    };

    const handlePublish = () => handleSave(true);

    const handleRevert = () => {
        setEditorData(originalData);
        setHasChanges(false);
        toast({
            title: "Reverted",
            description: "Changes have been reverted to last saved version",
        });
    };

    return {
        editorData,
        dataLoading,
        loadError,
        isSaving,
        isPublishing,
        hasChanges,
        handleDataUpdate,
        handleSave,
        handlePublish,
        handleRevert,
        loadSiteData
    };
};
