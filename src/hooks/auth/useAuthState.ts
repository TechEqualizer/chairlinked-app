
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useProfileManager } from './useProfileManager';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    profile,
    setProfile,
    authError,
    setAuthError,
    fetchUserProfile
  } = useProfileManager();

  useEffect(() => {
    console.log('[useAuthState] Initializing auth state management');
    let mounted = true;
    let profileFetched = false;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuthState] Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setAuthError(null);
        
        if (session?.user && !profileFetched) {
          profileFetched = true;
          setTimeout(async () => {
            if (mounted) {
              const profile = await fetchUserProfile(session.user.id);
              if (mounted) {
                setProfile(profile);
                setLoading(false);
              }
            }
          }, 0);
        } else if (!session?.user) {
          console.log('[useAuthState] No user, clearing profile');
          setProfile(null);
          setLoading(false);
          profileFetched = false;
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log('[useAuthState] Checking for existing session');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[useAuthState] Error getting session:', error);
          setAuthError('Authentication error');
          setLoading(false);
          return;
        }

        if (!mounted) return;

        console.log('[useAuthState] Initial session check:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && !profileFetched) {
          profileFetched = true;
          const profile = await fetchUserProfile(session.user.id);
          if (mounted) {
            setProfile(profile);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('[useAuthState] Auth initialization failed:', err);
        if (mounted) {
          setAuthError('Failed to initialize authentication');
          setLoading(false);
        }
      }
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('[useAuthState] Auth initialization timeout');
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    initializeAuth();

    return () => {
      mounted = false;
      profileFetched = false;
      clearTimeout(timeoutId);
      console.log('[useAuthState] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []); // Remove fetchUserProfile from dependencies to prevent cycles

  return {
    user,
    session,
    profile,
    loading,
    authError,
    setLoading,
    setAuthError
  };
}
