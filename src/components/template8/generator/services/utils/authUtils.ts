
import { supabase } from '@/integrations/supabase/client';

export class AuthUtils {
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.warn('[AuthUtils] Auth check failed:', error.message);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('[AuthUtils] Unexpected auth error:', error);
      return null;
    }
  }
}
