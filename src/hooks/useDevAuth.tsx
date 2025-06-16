import { useState, useEffect } from 'react';
import { AuthReturn, UserProfile } from './auth/types';

// Development-only authentication bypass
export function useDevAuth(): AuthReturn {
  const [isDevMode] = useState(() => import.meta.env.VITE_DEV_MODE === 'true');
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock user for development
  const mockUser = {
    id: 'dev-user-123',
    email: 'dev@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockProfile: UserProfile = {
    id: 'dev-user-123',
    email: 'dev@example.com',
    full_name: 'Dev Super Admin',
    role: 'super_admin', // Set as super_admin for full access
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockSession = {
    user: mockUser,
    access_token: 'dev-token',
    token_type: 'bearer',
    expires_at: Date.now() + 3600000,
  };

  useEffect(() => {
    if (isDevMode) {
      // Auto-login in dev mode
      setUser(mockUser);
      setSession(mockSession);
      setProfile(mockProfile);
    }
  }, [isDevMode]);

  const signIn = async (email: string, password: string) => {
    if (isDevMode) {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use the provided email instead of mock email
      const devUser = { ...mockUser, email };
      const devProfile = { ...mockProfile, email, full_name: email.split('@')[0] };
      
      setUser(devUser);
      setSession({ ...mockSession, user: devUser });
      setProfile(devProfile);
      setLoading(false);
      return { error: null };
    }
    return { error: { message: 'Dev mode not enabled' } };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (isDevMode) {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use the provided email and name instead of mock data
      const devUser = { ...mockUser, email };
      const devProfile = { ...mockProfile, email, full_name: fullName || email.split('@')[0] };
      const devSession = { ...mockSession, user: devUser };
      
      setUser(devUser);
      setSession(devSession);
      setProfile(devProfile);
      setLoading(false);
      return { data: { user: devUser }, error: null };
    }
    return { data: null, error: { message: 'Dev mode not enabled' } };
  };

  const signOut = async () => {
    if (isDevMode) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return { error: null };
    }
    return { error: { message: 'Dev mode not enabled' } };
  };

  const retryProfileFetch = async () => {
    // No-op in dev mode
  };

  return {
    user,
    session,
    profile,
    loading,
    authError: null,
    signUp,
    signIn,
    signOut,
    retryProfileFetch,
    isAdmin: profile?.role === 'admin' || profile?.role === 'super_admin',
    isCustomer: profile?.role === 'customer',
    isAuthenticated: !!user,
  };
}