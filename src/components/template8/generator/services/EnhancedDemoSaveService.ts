
import type { Template8Data } from '../types/GeneratorTypes';
import type { SaveResult, EnhancedSaveOptions, SaveStrategy } from './types/SaveServiceTypes';
import { AuthUtils } from './utils/authUtils';
import { DemoDataUtils } from './utils/demoDataUtils';
import { DemoCreator } from './operations/DemoCreator';
import { DemoUpdater } from './operations/DemoUpdater';
import { RecoveryUtils } from './utils/recoveryUtils';
import { DemoIdUtils } from './utils/demoIdUtils';
import { supabase } from '@/integrations/supabase/client';

/**
 * Production-ready demo saving service with comprehensive error handling
 */
export class EnhancedDemoSaveService {
  /**
   * Main save method with enhanced error recovery
   */
  static async saveDemo(data: Partial<Template8Data>, options?: EnhancedSaveOptions): Promise<SaveResult> {
    const {
      existingDemoId,
      isEditingExisting,
      forceCreate = false,
      maxRetries = 2
    } = options || {};

    console.log('[EnhancedDemoSaveService] Starting enhanced save process:', {
      hasExistingId: !!existingDemoId,
      businessName: data.businessName,
      isEditingExisting,
      forceCreate
    });

    // Step 1: Validate and sanitize input data
    const sanitizedData = this.sanitizeInputData(data);
    const validation = DemoDataUtils.validateDemoData(sanitizedData);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Data validation failed: ${validation.error}`
      };
    }

    // Step 2: Authenticate user
    const currentUser = await AuthUtils.getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: 'Authentication required. Please log in to save your demo.',
        requiresAuth: true
      };
    }

    // Step 3: Comprehensive demo ID recovery
    const recoveredDemoId = this.recoverValidDemoId(sanitizedData, existingDemoId);
    
    // Step 4: Determine save strategy
    const saveStrategy = await this.determineSaveStrategy(
      recoveredDemoId, 
      isEditingExisting, 
      forceCreate, 
      currentUser.id
    );

    console.log('[EnhancedDemoSaveService] Save strategy determined:', saveStrategy);

    // Step 5: Execute save with retry logic
    return this.executeSaveWithRetry(
      sanitizedData, 
      saveStrategy, 
      currentUser.id, 
      maxRetries
    );
  }

  /**
   * Sanitizes input data to ensure clean save
   */
  private static sanitizeInputData(data: Partial<Template8Data>): Partial<Template8Data> {
    const cleaned = DemoIdUtils.cleanInvalidDemoIds(data);
    
    // Remove internal tracking fields
    const internalFields = [
      '_isEditingExisting',
      '_lastDatabaseUpdate',
      '_loadedFromDatabase',
      '_createdFromMinimalData'
    ];
    
    internalFields.forEach(field => {
      if (cleaned[field as keyof Template8Data]) {
        delete cleaned[field as keyof Template8Data];
      }
    });

    return cleaned;
  }

  /**
   * Comprehensive demo ID recovery from all sources
   */
  private static recoverValidDemoId(data: Partial<Template8Data>, explicitDemoId?: string): string | null {
    // Priority 1: Explicit demo ID parameter
    if (explicitDemoId) {
      const sanitized = DemoIdUtils.sanitizeDemoId(explicitDemoId);
      if (sanitized) return sanitized;
    }

    // Priority 2: Demo ID from data - use _demoId property
    const fromData = DemoIdUtils.sanitizeDemoId(data._demoId);
    if (fromData) return fromData;

    // Priority 3: Session and URL recovery
    return DemoIdUtils.recoverDemoId(data);
  }

  /**
   * Determines the appropriate save strategy
   */
  private static async determineSaveStrategy(
    demoId: string | null, 
    isEditingExisting?: boolean, 
    forceCreate?: boolean,
    userId?: string
  ): Promise<SaveStrategy> {
    
    if (forceCreate) {
      return { action: 'create', reason: 'Force create requested' };
    }

    if (!demoId) {
      return { action: 'create', reason: 'No valid demo ID found' };
    }

    if (!isEditingExisting) {
      return { action: 'create', reason: 'Not in editing mode' };
    }

    // Verify demo exists and user has permission
    try {
      const { data: existingDemo, error } = await supabase
        .from('chairlinked_sites')
        .select('id, user_id, admin_user_id')
        .eq('id', demoId)
        .single();

      if (error || !existingDemo) {
        console.warn('[EnhancedDemoSaveService] Demo not found, will create new:', error?.message);
        return { action: 'create', reason: 'Demo not found in database' };
      }

      // Check user permission
      const hasPermission = existingDemo.user_id === userId || existingDemo.admin_user_id === userId;
      if (!hasPermission) {
        console.warn('[EnhancedDemoSaveService] User lacks permission, will create new');
        return { action: 'create', reason: 'User lacks permission to update demo' };
      }

      return { action: 'update', demoId, reason: 'Valid demo found with permission' };
    } catch (error) {
      console.error('[EnhancedDemoSaveService] Error checking demo existence:', error);
      return { action: 'create', reason: 'Database error during verification' };
    }
  }

  /**
   * Executes save operation with retry logic
   */
  private static async executeSaveWithRetry(
    data: Partial<Template8Data>,
    strategy: SaveStrategy,
    userId: string,
    maxRetries: number
  ): Promise<SaveResult> {
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[EnhancedDemoSaveService] Save attempt ${attempt}/${maxRetries}:`, {
          action: strategy.action,
          demoId: strategy.demoId,
          reason: strategy.reason
        });

        let result: SaveResult;

        if (strategy.action === 'create') {
          result = await DemoCreator.createNewDemo(data, userId);
        } else {
          result = await DemoUpdater.updateExistingDemo(data, strategy.demoId!, userId);
        }

        if (result.success) {
          console.log('[EnhancedDemoSaveService] Save successful on attempt:', attempt);
          
          // Create recovery data on successful save
          if (result.url) {
            RecoveryUtils.dispatchSaveEvents(result.url, data.businessName!, strategy.action === 'create');
          }
          
          return result;
        }

        // If update failed due to ID issues, try creating new demo
        if (strategy.action === 'update' && attempt < maxRetries && 
            (result.error?.includes('uuid') || result.error?.includes('ID'))) {
          console.log('[EnhancedDemoSaveService] Update failed, switching to create strategy');
          strategy.action = 'create';
          strategy.demoId = undefined;
          strategy.reason = 'Fallback to create after update failure';
          continue;
        }

        // If this was the last attempt, return the error
        if (attempt === maxRetries) {
          return result;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));

      } catch (error) {
        console.error(`[EnhancedDemoSaveService] Save attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          return {
            success: false,
            error: `Save failed after ${maxRetries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`
          };
        }
      }
    }

    return {
      success: false,
      error: 'All save attempts exhausted'
    };
  }
}
