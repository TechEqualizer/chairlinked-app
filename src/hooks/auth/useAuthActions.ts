
import { supabase } from '@/integrations/supabase/client';

export function useAuthActions() {
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('[useAuthActions] Starting signup for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      console.log('[useAuthActions] Signup result:', { data, error });
      
      if (error) {
        console.error('[useAuthActions] Signup error:', error);
        return { data, error };
      }

      // Check if user was created successfully
      if (data.user) {
        console.log('[useAuthActions] User created successfully:', data.user.id);
        
        // Small delay to allow trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify profile was created
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
          
        if (profileError) {
          console.warn('[useAuthActions] Profile not found, but signup succeeded:', profileError);
        } else {
          console.log('[useAuthActions] Profile created successfully:', profile);
        }
      }
      
      return { data, error };
    } catch (err) {
      console.error('[useAuthActions] Signup failed:', err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[useAuthActions] Starting signin for:', email);
      
      // Clear any existing session data first
      console.log('[useAuthActions] Clearing existing session data');
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[useAuthActions] Signin result:', { 
        user: data.user?.id, 
        email: data.user?.email,
        error 
      });
      
      return { error };
    } catch (err) {
      console.error('[useAuthActions] Signin failed:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      console.log('[useAuthActions] Starting signout');
      
      // Clear all local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      
      console.log('[useAuthActions] Signout result:', { error });
      return { error };
    } catch (err) {
      console.error('[useAuthActions] Signout failed:', err);
      return { error: err };
    }
  };

  return {
    signUp,
    signIn,
    signOut
  };
}
