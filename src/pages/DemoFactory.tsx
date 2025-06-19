import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DemoFactoryInterface } from '@/components/admin/demo-factory/DemoFactoryInterface';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';

const DemoFactory: React.FC = () => {
  const { isAdmin, user, loading, profile } = useAuthContext();

  // Debug logging
  console.log('[DemoFactory] Auth state:', {
    loading,
    isAdmin,
    hasUser: !!user,
    hasProfile: !!profile,
    profileRole: profile?.role,
    profileEmail: profile?.email
  });

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // If no user, redirect to auth
  if (!user) {
    console.log('[DemoFactory] No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // If user exists but no profile or not admin, show access denied
  if (!profile || !isAdmin) {
    console.log('[DemoFactory] Access denied:', { hasProfile: !!profile, isAdmin, role: profile?.role });
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-4">
            Demo Factory is only available to admin users.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Current role: {profile?.role || 'No role assigned'}
          </p>
          <button 
            onClick={() => window.location.href = '/admin'} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <DemoFactoryInterface />
    </AdminLayout>
  );
};

export default DemoFactory;