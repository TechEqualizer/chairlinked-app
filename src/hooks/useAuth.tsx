
import { useAuthState } from './auth/useAuthState';
import { useAuthActions } from './auth/useAuthActions';
import { useProfileManager } from './auth/useProfileManager';
import { useDevAuth } from './useDevAuth';
import { AuthReturn } from './auth/types';

export type { UserProfile } from './auth/types';

export function useAuth(): AuthReturn {
  // Use dev auth in development mode
  const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
  const devAuth = useDevAuth();
  
  if (isDevMode) {
    return devAuth;
  }
  const {
    user,
    session,
    profile,
    loading,
    authError
  } = useAuthState();

  const { signUp, signIn, signOut } = useAuthActions();
  const { retryProfileFetch } = useProfileManager();

  const isAdmin = profile?.role === 'admin';
  const isCustomer = profile?.role === 'customer';

  console.log('[useAuth] Current state:', {
    loading,
    isAuthenticated: !!user,
    hasProfile: !!profile,
    isAdmin,
    authError,
    userId: user?.id
  });

  return {
    user,
    session,
    profile,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    retryProfileFetch: () => retryProfileFetch(user),
    isAdmin,
    isCustomer,
    isAuthenticated: !!user
  };
}
