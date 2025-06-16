import { supabase } from '@/integrations/supabase/client';
import { generateSiteUrl, getWorkingUrl } from '@/utils/urlGenerator';
import type { Template8Data } from '../types/GeneratorTypes';

/**
 * Service for saving, loading, and managing demo sites in the database
 */
export class DemoSavingService {
  /**
   * Saves a demo site to the database
   * @param data The demo site data to save
   * @param existingDemoId Optional ID of an existing demo to update
   * @returns The URL of the saved demo site
   */
  static async saveDemo(data: Partial<Template8Data>, existingDemoId?: string): Promise<string> {
    try {
      console.log('[DemoSavingService] Saving demo:', {
        hasExistingId: !!existingDemoId,
        businessName: data.businessName,
        demoId: existingDemoId || data._demoId,
        isNewFromTemplate: data._isNewFromTemplate,
        generationSource: data._generationSource
      });

      // Validate required data
      if (!data.businessName || data.businessName.trim() === '') {
        throw new Error('Business name is required');
      }

      // Determine if this should create a new demo or update existing
      const shouldCreateNew = data._isNewFromTemplate || 
                              data._generationSource === 'template' || 
                              data._generationSource === 'scratch' || 
                              !existingDemoId;

      let demoUrl: string;
      let isNewDemo = false;
      let demoRecord: any;

      if (shouldCreateNew) {
        console.log('[DemoSavingService] Creating NEW demo (not updating existing)');
        const result = await this.createNewDemo(data);
        demoUrl = result.url;
        demoRecord = result.record;
        isNewDemo = true;
      } else {
        console.log('[DemoSavingService] Updating existing demo:', existingDemoId);
        const result = await this.updateExistingDemo(data, existingDemoId);
        demoUrl = result.url;
        demoRecord = result.record;
      }

      // Enhanced event dispatching for better cross-page communication
      const eventDetail = {
        url: demoUrl,
        businessName: data.businessName,
        isNewDemo,
        demoId: demoRecord.id,
        timestamp: new Date().toISOString()
      };

      console.log('[DemoSavingService] Dispatching enhanced events:', eventDetail);
      
      // 1. Store event in sessionStorage for same-page communication
      sessionStorage.setItem('lastDemoCreated', JSON.stringify(eventDetail));
      sessionStorage.setItem('pendingDemoRefresh', JSON.stringify({
        timestamp: Date.now(),
        detail: eventDetail
      }));
      
      // 2. Store in localStorage for cross-tab communication
      localStorage.setItem('demoSiteCreated', JSON.stringify(eventDetail));
      
      // 3. Dispatch the custom event
      window.dispatchEvent(new CustomEvent('demoSiteCreated', { 
        detail: eventDetail
      }));

      // 4. Trigger a storage event for cross-tab communication
      setTimeout(() => {
        localStorage.removeItem('demoSiteCreated');
      }, 1000);

      return demoUrl;
    } catch (error) {
      console.error('[DemoSavingService] Error saving demo:', error);
      throw error;
    }
  }

  /**
   * Creates a new demo site in the database
   * @param data The demo site data
   * @returns The URL and database record of the created demo
   */
  private static async createNewDemo(data: Partial<Template8Data>): Promise<{ url: string; record: any }> {
    // Generate a unique slug for the new demo
    const slug = await this.generateUniqueSlug(data.businessName!);

    // Clean the data of any existing demo identifiers
    const cleanedData = this.cleanDataForNewDemo(data);

    const demoData = {
      site_slug: slug,
      business_name: data.businessName!,
      generated_config: cleanedData,
      form_data: cleanedData, // Using the same data for form_data
      status: 'draft' as const,
      site_type: 'demo' as const,
      updated_at: new Date().toISOString()
    };

    console.log('[DemoSavingService] Creating demo with data:', {
      site_slug: demoData.site_slug,
      business_name: demoData.business_name,
      site_type: demoData.site_type,
      status: demoData.status
    });

    const { data: newDemo, error } = await supabase
      .from('chairlinked_sites')
      .insert(demoData)
      .select()
      .single();

    if (error) {
      console.error('[DemoSavingService] Insert error:', error);
      throw new Error(`Failed to create demo: ${error.message}`);
    }

    if (!newDemo) {
      throw new Error('No demo data returned after creation');
    }

    console.log('[DemoSavingService] Created new demo successfully:', {
      id: newDemo.id,
      slug: newDemo.site_slug,
      businessName: newDemo.business_name,
      siteType: newDemo.site_type,
      status: newDemo.status
    });
    
    // Enhanced session storage with multiple recovery keys
    await this.createRecoveryData(newDemo, cleanedData);

    // Generate the working URL using the functional route pattern
    const demoUrl = getWorkingUrl({
      slug: newDemo.site_slug,
      siteType: 'demo',
      status: 'draft'
    });

    return { url: demoUrl, record: newDemo };
  }

  /**
   * Updates an existing demo site in the database
   * @param data The updated demo site data
   * @param demoId The ID of the demo to update
   * @returns The URL and database record of the updated demo
   */
  private static async updateExistingDemo(data: Partial<Template8Data>, demoId: string): Promise<{ url: string; record: any }> {
    // Generate a unique slug for the demo
    const slug = await this.generateUniqueSlug(data.businessName!);

    const demoData = {
      site_slug: slug,
      business_name: data.businessName!,
      generated_config: data,
      form_data: data, // Using the same data for form_data
      status: 'draft' as const,
      site_type: 'demo' as const,
      updated_at: new Date().toISOString()
    };

    const { data: updatedDemo, error } = await supabase
      .from('chairlinked_sites')
      .update(demoData)
      .eq('id', demoId)
      .select()
      .single();

    if (error) {
      console.error('[DemoSavingService] Update error:', error);
      throw new Error(`Failed to update demo: ${error.message}`);
    }

    if (!updatedDemo) {
      throw new Error('No demo data returned after update');
    }

    console.log('[DemoSavingService] Updated existing demo:', {
      id: updatedDemo.id,
      slug: updatedDemo.site_slug,
      businessName: updatedDemo.business_name
    });

    // Generate the working URL using the functional route pattern
    const demoUrl = getWorkingUrl({
      slug: updatedDemo.site_slug,
      siteType: 'demo',
      status: 'draft'
    });

    return { url: demoUrl, record: updatedDemo };
  }

  /**
   * Cleans the data for a new demo by removing existing demo identifiers
   * @param data The data to clean
   * @returns The cleaned data
   */
  private static cleanDataForNewDemo(data: Partial<Template8Data>): Partial<Template8Data> {
    const cleanedData = { ...data };
    
    // Remove any existing demo identifiers that could cause confusion
    delete cleanedData._demoId;
    delete cleanedData._isEditingExisting;
    delete cleanedData._lastDatabaseUpdate;
    delete cleanedData._loadedFromDatabase;
    delete cleanedData._createdFromMinimalData;
    
    // Keep template source information but mark as new demo
    cleanedData._isNewDemo = true;
    cleanedData._createdAt = new Date().toISOString();
    
    return cleanedData;
  }

  /**
   * Loads a demo site from the database
   * @param demoId The ID of the demo to load
   * @returns The loaded demo site
   */
  static async loadDemo(demoId: string) {
    try {
      if (!demoId || demoId.trim() === '') {
        throw new Error('Demo ID is required');
      }

      const { data: demo, error } = await supabase
        .from('chairlinked_sites')
        .select('*')
        .eq('id', demoId)
        .single();

      if (error) {
        console.error('[DemoSavingService] Load error:', error);
        throw new Error(`Failed to load demo: ${error.message}`);
      }

      if (!demo) {
        throw new Error('Demo not found');
      }

      console.log('[DemoSavingService] Loaded demo:', {
        id: demo.id,
        businessName: demo.business_name,
        hasConfig: !!demo.generated_config
      });

      return demo;
    } catch (error) {
      console.error('[DemoSavingService] Error loading demo:', error);
      throw error;
    }
  }

  /**
   * Generates a unique slug for a demo site
   * @param businessName The business name to base the slug on
   * @returns A unique slug
   */
  static async generateUniqueSlug(businessName: string): Promise<string> {
    if (!businessName || businessName.trim() === '') {
      businessName = 'demo-site';
    }

    const baseSlug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);

    let slug = baseSlug || 'demo-site';
    let counter = 1;

    while (true) {
      try {
        const { data, error } = await supabase
          .from('chairlinked_sites')
          .select('id')
          .eq('site_slug', slug)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (!data) {
          // Slug is unique
          break;
        }

        // Slug exists, try with counter
        slug = `${baseSlug}-${counter}`;
        counter++;

        // Prevent infinite loops
        if (counter > 1000) {
          slug = `${baseSlug}-${Date.now()}`;
          break;
        }
      } catch (error) {
        console.error('[DemoSavingService] Error checking slug uniqueness:', error);
        // Fallback to timestamp-based slug
        slug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }

    return slug;
  }

  /**
   * Creates recovery data for a demo site
   * @param demo The demo site record
   * @param data The demo site data
   */
  private static async createRecoveryData(demo: any, data: Partial<Template8Data>) {
    try {
      const businessKey = (data.businessName || '')
        .toLowerCase().replace(/\s+/g, '-');
      
      if (businessKey) {
        // Generate the working URL for recovery
        const demoUrl = getWorkingUrl({
          slug: demo.site_slug,
          siteType: 'demo',
          status: 'draft'
        });

        const recoveryData = {
          id: demo.id,
          businessName: data.businessName,
          config: { ...data, _demoId: demo.id },
          recoveryMetadata: {
            savedAt: new Date().toISOString(),
            businessNameKey: businessKey,
            recoveryVersion: '2.1',
            demoUrl: demoUrl,
            isNewDemo: true
          }
        };
        
        // Store with multiple keys for better recovery
        sessionStorage.setItem(`business-recovery-${businessKey}`, JSON.stringify(recoveryData));
        sessionStorage.setItem(`demo-recovery-${demo.id}`, JSON.stringify(recoveryData));
        
        console.log('[DemoSavingService] Created recovery data for new demo:', {
          businessKey,
          demoId: demo.id
        });
      }
    } catch (error) {
      console.warn('[DemoSavingService] Failed to create recovery data:', error);
      // Don't throw - this is not critical for the main flow
    }
  }
}