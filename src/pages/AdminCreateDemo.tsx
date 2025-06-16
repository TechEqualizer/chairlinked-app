
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/components/auth/AuthProvider';

const AdminCreateDemo: React.FC = () => {
  const { isAdmin, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[AdminCreateDemo] Component mounted', { isAdmin, loading });
    
    if (!loading) {
      if (!isAdmin) {
        console.log('[AdminCreateDemo] User not admin, redirecting to auth');
        navigate('/auth');
      } else {
        console.log('[AdminCreateDemo] Admin user confirmed, redirecting to template8-generator');
        // Redirect admins to the Template8 generator for demo creation
        navigate('/template8-generator');
      }
    }
  }, [isAdmin, loading, navigate]);

  // Show loading while determining redirect
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-200 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default AdminCreateDemo;
