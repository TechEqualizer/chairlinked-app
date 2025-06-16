
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export function useProfileManager() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Create user profile if it doesn't exist
  const createUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('[useProfileManager] Attempting to create profile for user:', userId);
      
      // Get user info from auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('[useProfileManager] Could not get user info:', userError);
        setAuthError('Failed to get user information');
        return null;
      }

      console.log('[useProfileManager] Got user info:', { 
        id: user.id, 
        email: user.email,
        metadata: user.user_metadata 
      });

      // All new users get 'customer' role by default
      const profileData = {
        user_id: userId,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email || '',
        role: 'customer' as const
      };

      console.log('[useProfileManager] Creating profile with data:', profileData);

      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single();

      if (insertError) {
        console.error('[useProfileManager] Failed to create profile:', insertError);
        setAuthError('Failed to create user profile');
        return null;
      }

      console.log('[useProfileManager] Profile created successfully:', newProfile);
      return newProfile;
    } catch (err) {
      console.error('[useProfileManager] Profile creation failed:', err);
      setAuthError('Failed to create user profile');
      return null;
    }
  }, []);

  // Enhanced profile fetching with automatic profile creation
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('[useProfileManager] Fetching profile for user:', userId);
      
      // Force fresh fetch from database
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('[useProfileManager] Raw profile fetch result:', { 
        profileData, 
        error,
        userId 
      });

      if (error) {
        console.warn('[useProfileManager] Profile fetch error:', error);
        // Try to create a profile if it doesn't exist
        return await createUserProfile(userId);
      }

      if (!profileData) {
        console.log('[useProfileManager] No profile found, attempting to create one');
        return await createUserProfile(userId);
      }

      console.log('[useProfileManager] Profile fetched successfully:', {
        id: profileData.id,
        email: profileData.email,
        role: profileData.role,
        userId: profileData.user_id
      });
      
      return profileData;
    } catch (err) {
      console.error('[useProfileManager] Profile fetch failed:', err);
      // Try to create a profile as fallback
      return await createUserProfile(userId);
    }
  }, [createUserProfile]);

  // Retry profile fetch function
  const retryProfileFetch = useCallback(async (user: any) => {
    if (user) {
      console.log('[useProfileManager] Retrying profile fetch for user:', user.id);
      setAuthError(null);
      const profile = await fetchUserProfile(user.id);
      console.log('[useProfileManager] Retry fetch result:', profile);
      setProfile(profile);
    }
  }, [fetchUserProfile]);

  return {
    profile,
    setProfile,
    authError,
    setAuthError,
    fetchUserProfile,
    retryProfileFetch
  };
}
