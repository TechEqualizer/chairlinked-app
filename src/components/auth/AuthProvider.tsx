
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth, UserProfile } from '@/hooks/useAuth';
import { User, Session } from '@supabase/supabase-js';
import { ClaimAccountService } from '@/services/ClaimAccountService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  retryProfileFetch: () => Promise<void>;
  isAdmin: boolean;
  isCustomer: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  // Destructure all needed values from the auth hook
  const {
    user,
    session,
    profile,
    loading,
    authError,
    signUp: authSignUp,
    signIn: authSignIn,
    signOut: authSignOut,
    retryProfileFetch: authRetryProfileFetch
  } = auth;

  const signUp = async (email: string, password: string, fullName?: string) => {
    const result = await authSignUp(email, password, fullName);
    
    // If signup was successful and we have user data, try to link any existing demo claims
    if (!result.error && user) {
      setTimeout(async () => {
        const linkResult = await ClaimAccountService.linkClaimToAccount(
          email, 
          user.id
        );
        
        if (linkResult.success && linkResult.linkedClaims > 0) {
          console.log(`Linked ${linkResult.linkedClaims} existing claims to new account`);
        }
      }, 1000); // Small delay to ensure profile creation is complete
    }
    
    return result;
  };

  const signIn = async (email: string, password: string) => {
    return authSignIn(email, password);
  };

  const signOut = async () => {
    return authSignOut();
  };

  const retryProfileFetch = async () => {
    return authRetryProfileFetch();
  };

  // FIXED: More robust admin status check
  const isAdmin = useMemo(() => {
    const adminStatus = profile?.role === 'admin' || profile?.role === 'super_admin';
    console.log('[AuthProvider] Admin status check:', {
      hasProfile: !!profile,
      role: profile?.role,
      isAdmin: adminStatus,
      userId: user?.id,
      userEmail: user?.email
    });
    return adminStatus;
  }, [profile?.role, user?.id, user?.email]);

  const isCustomer = profile?.role === 'customer';

  console.log('[AuthProvider] Current auth state:', {
    loading,
    isAuthenticated: !!user,
    hasProfile: !!profile,
    isAdmin,
    authError,
    userId: user?.id,
    profileRole: profile?.role,
    userEmail: user?.email
  });

  const contextValue = {
    user,
    session,
    profile,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    retryProfileFetch,
    isAdmin,
    isCustomer,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
