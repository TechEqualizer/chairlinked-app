
import React from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { PaymentGateEnhanced } from '@/components/PaymentGateEnhanced';
import { useClaimedSiteQuery } from '@/hooks/useClaimedSiteQuery';
import { useEnhancedPaymentStatus } from '@/hooks/useEnhancedPaymentStatus';
import { Loader2, ExternalLink, Edit, RefreshCw } from 'lucide-react';
import { ModernDashboardSidebar } from '@/components/dashboard/ModernDashboardSidebar';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { SitePreviewSection } from '@/components/dashboard/SitePreviewSection';
import { SiteConversionCard } from '@/components/dashboard/SiteConversionCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const { data: claimedSite, isLoading, error, refetch } = useClaimedSiteQuery();
  const { setup_fee_paid, subscribed, refetch: refetchPaymentStatus } = useEnhancedPaymentStatus();
  const navigate = useNavigate();
  
  // Check if user has paid (setup fee + subscription)
  const hasFullAccess = Boolean(setup_fee_paid) && Boolean(subscribed);

  // Debug logging
  console.log('[CustomerDashboard] State:', {
    user: user?.email,
    claimedSite: claimedSite?.business_name,
    setup_fee_paid,
    subscribed,
    hasFullAccess,
    isLoading,
    error
  });

  const handleForceRefresh = () => {
    refetch();
    refetchPaymentStatus();
  };

  // Show simple loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-200 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If user hasn't paid, show only the payment screen without sidebar
  if (!hasFullAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 py-4 sm:py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PaymentGateEnhanced 
            feature="your full dashboard experience" 
            showIntegratedPrompt={true}
            claimedSite={claimedSite}
          />
        </div>
      </div>
    );
  }

  // Full dashboard for paid users
  return (
    <div className="min-h-screen flex w-full bg-zinc-200 gap-6 p-6">
      <ModernDashboardSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Force Refresh Button */}
          {error && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Connection Issue</h3>
                  <p className="text-xs text-amber-600">Unable to load site data</p>
                </div>
                <Button
                  onClick={handleForceRefresh}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Header for paid users */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.email?.split('@')[0] || 'there'}!
            </h1>
            <p className="text-slate-600 text-lg">
              {claimedSite ? "Here's how your ChairLinked website is performing" : "Welcome to your ChairLinked dashboard"}
            </p>
          </div>

          {claimedSite ? (
            <>
              {/* Site Conversion Status */}
              <SiteConversionCard claimedSite={claimedSite} />

              {/* Claimed Site Status */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 beautiful-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-1">
                      🎉 {claimedSite.site_type === 'live' ? 'Live Site' : 'Claimed Site'}: {claimedSite.business_name}
                    </h3>
                    <p className="text-green-700 text-sm">
                      Status: <span className="font-medium capitalize">{claimedSite.status}</span>
                      {claimedSite.status === 'draft' && " • Our team is working on your customizations"}
                      {claimedSite.status === 'published' && " • Your demo site is ready for review"}
                      {claimedSite.status === 'live' && claimedSite.site_type === 'live' && " • Your professional website is live!"}
                      {claimedSite.site_type === 'live' && " • No ChairLinked branding"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate('/dashboard/content-editor')}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Content
                    </Button>
                  </div>
                </div>
              </div>

              {/* Metrics Cards */}
              <MetricsCards siteId={claimedSite.id} />
              
              {/* Site Preview */}
              <SitePreviewSection site={claimedSite} />
            </>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center beautiful-shadow border-0">
              <h3 className="text-xl font-semibold mb-4">Ready to Get Your Website?</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Our expert team will create a beautiful ChairLinked website for your business. 
                You can also claim a demo site if you've found one you like.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.href = '/pricing'}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl mr-4 font-medium beautiful-shadow"
                >
                  Get My Website Made
                </Button>
                <Button 
                  onClick={() => window.location.href = 'mailto:support@chairlinked.com?subject=Website Creation Request'}
                  variant="outline"
                  className="bg-slate-600 text-white px-8 py-3 rounded-xl hover:bg-slate-700 font-medium beautiful-shadow"
                >
                  Contact Our Team
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
