
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/components/auth/AuthProvider';
import AuthLoadingScreen from '@/components/auth/AuthLoadingScreen';
import AuthErrorScreen from '@/components/auth/AuthErrorScreen';
import AuthForm from '@/components/auth/AuthForm';

const Auth: React.FC = () => {
  const [authTimeout, setAuthTimeout] = useState(false);
  
  const { signIn, signUp, isAuthenticated, profile, loading: authLoading, authError } = useAuthContext();
  const navigate = useNavigate();

  // Reduced timeout for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      if (authLoading && !isAuthenticated) {
        console.log('[Auth] Auth loading timeout reached');
        setAuthTimeout(true);
      }
    }, 5000); // 5 second timeout instead of 8

    return () => clearTimeout(timer);
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    console.log('[Auth] Auth state changed:', {
      isAuthenticated,
      authLoading,
      hasProfile: !!profile,
      authTimeout,
      authError,
      profileRole: profile?.role,
      profileEmail: profile?.email,
      timestamp: new Date().toISOString()
    });

    // Redirect authenticated users - ENHANCED LOGIC
    if (isAuthenticated && !authLoading && !authTimeout && !authError && profile) {
      console.log('[Auth] Redirecting authenticated user with profile:', {
        role: profile.role,
        email: profile.email,
        userId: profile.user_id
      });
      
      const timer = setTimeout(() => {
        if (profile.role === 'admin') {
          console.log('[Auth] Redirecting admin to /admin');
          navigate('/admin');
        } else {
          console.log('[Auth] Redirecting user to /dashboard');
          navigate('/dashboard');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, profile, authLoading, authTimeout, authError, navigate]);

  const handleAuthSubmit = async (email: string, password: string, fullName?: string, isLogin?: boolean) => {
    console.log('[Auth] handleAuthSubmit called:', { email, isLogin, timestamp: new Date().toISOString() });
    
    let result;
    if (isLogin) {
      console.log('[Auth] Submitting login form');
      result = await signIn(email, password);
      if (!result.error) {
        console.log('[Auth] Login successful, waiting for redirect');
        return;
      }
    } else {
      console.log('[Auth] Submitting signup form');
      result = await signUp(email, password, fullName);
      if (!result.error) {
        throw new Error('Please check your email for the confirmation link!');
      }
    }

    if (result.error) {
      console.error('[Auth] Form submission error:', result.error);
      throw new Error(result.error.message);
    }
  };

  const handleForceLogin = () => {
    console.log('[Auth] Force login attempt - bypassing loading states');
    setAuthTimeout(false);
    window.location.reload();
  };

  const handleRefresh = () => {
    console.log('[Auth] Refreshing page');
    window.location.reload();
  };

  // Show loading with skip option
  if (authLoading && !authTimeout && !authError) {
    return <AuthLoadingScreen onSkipLoading={() => setAuthTimeout(true)} />;
  }

  // Show error state with better recovery options
  if (authTimeout || authError) {
    return (
      <AuthErrorScreen 
        authError={authError}
        onTryAgain={handleForceLogin}
        onRefresh={handleRefresh}
      />
    );
  }

  return <AuthForm onSubmit={handleAuthSubmit} />;
};

export default Auth;
