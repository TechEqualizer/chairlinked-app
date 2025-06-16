
import React from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useClaimedSite } from '@/hooks/useClaimedSite';
import { Loader2, ExternalLink, Edit, AlertTriangle } from 'lucide-react';
import { ModernDashboardSidebar } from '@/components/dashboard/ModernDashboardSidebar';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { SitePreviewSection } from '@/components/dashboard/SitePreviewSection';
import { CustomizationRequestsTable } from '@/components/dashboard/CustomizationRequestsTable';
import { SiteConversionCard } from '@/components/dashboard/SiteConversionCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardBypass: React.FC = () => {
  const { user } = useAuthContext();
  const { claimedSite, loading: siteLoading, error } = useClaimedSite();
  const navigate = useNavigate();

  if (siteLoading) {
    return (
      <div className="min-h-screen bg-zinc-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-zinc-200 gap-6 p-6">
      <ModernDashboardSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Development Warning */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="text-sm font-medium text-orange-800">Development Bypass</h3>
                  <p className="text-xs text-orange-600">This route bypasses payment checks for testing purposes</p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
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
                      🎉 Claimed Site: {claimedSite.business_name}
                    </h3>
                    <p className="text-green-700 text-sm">
                      Status: <span className="font-medium capitalize">{claimedSite.status}</span>
                      {claimedSite.status === 'draft' && " • Our team is working on your customizations"}
                      {claimedSite.status === 'published' && " • Your demo site is ready for review"}
                      {claimedSite.status === 'live' && " • Your website is live and ready!"}
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
                    <Button
                      onClick={() => window.open(`/${claimedSite.site_slug}`, '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Site
                    </Button>
                  </div>
                </div>
              </div>

              {/* Metrics Cards */}
              <MetricsCards siteId={claimedSite.id} />
              
              {/* Site Preview */}
              <SitePreviewSection site={claimedSite} />
              
              {/* Customization Requests */}
              <CustomizationRequestsTable />
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
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">
                    Error loading your sites: {error}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardBypass;
