import type { Template8Data } from '../../types/GeneratorTypes';

export class DemoDataUtils {
  static validateDemoData(data: Partial<Template8Data>): { isValid: boolean; error?: string } {
    if (!data.businessName || data.businessName.trim() === '') {
      return {
        isValid: false,
        error: 'Business name is required'
      };
    }

    if (typeof data.businessName !== 'string') {
      return {
        isValid: false,
        error: 'Business name must be a string'
      };
    }

    return {
      isValid: true
    };
  }

  static shouldCreateNewDemo(demoId: string | null, isEditingExisting?: boolean): boolean {
    // If no demo ID, always create new
    if (!demoId) {
      return true;
    }

    // If not in editing mode, create new
    if (!isEditingExisting) {
      return true;
    }

    // If demo ID is invalid format, create new
    if (!this.isValidUUID(demoId)) {
      return true;
    }

    // Otherwise, update existing
    return false;
  }

  private static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
