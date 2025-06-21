
import { supabase } from '@/integrations/supabase/client';

export class AuthUtils {
  static async getCurrentUser() {
    try {
      console.log('[AuthUtils] Checking current user authentication...');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.warn('[AuthUtils] Auth check failed:', error.message);
        return null;
      }
      
      if (!user) {
        console.warn('[AuthUtils] No authenticated user found');
        return null;
      }
      
      console.log('[AuthUtils] Authenticated user found:', {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      });
      
      return user;
    } catch (error) {
      console.error('[AuthUtils] Unexpected auth error:', error);
      return null;
    }
  }
}
