
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { PaymentStatusProvider } from "@/contexts/PaymentStatusContext";
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Lazy load dashboard pages
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const ModernDashboardPage = lazy(() => import("./pages/ModernDashboardPage"));
const DashboardBypass = lazy(() => import("./pages/DashboardBypass"));

// Lazy load admin pages
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminDemoSites = lazy(() => import("./pages/AdminDemoSites"));
const AdminTemplates = lazy(() => import("./pages/AdminTemplates"));
const AdminTeam = lazy(() => import("./pages/AdminTeam"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminCustomers = lazy(() => import("./pages/AdminCustomers"));
const AdminCustomerRequests = lazy(() => import("./pages/AdminCustomerRequests"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));

// Lazy load other pages
const Pricing = lazy(() => import("./pages/Pricing"));
const Auth = lazy(() => import("./pages/Auth"));

// Lazy load Template8Generator for demo creation
const Template8Generator = lazy(() => import("./pages/Template8Generator"));

// Import AdminEditDemo with lazy loading
const AdminEditDemo = lazy(() => import("./pages/AdminEditDemo"));

// Fix the CustomerContentEditor import to ensure proper lazy loading
const CustomerContentEditor = lazy(() => 
  import("./pages/CustomerContentEditor").catch(error => {
    console.error('Error loading CustomerContentEditor:', error);
    // Return a fallback component in case of import failure
    return {
      default: () => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">Loading Error</h1>
            <p className="text-gray-600">Failed to load content editor. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    };
  })
);

// Lazy load the PublishedSite component for handling site slugs
const PublishedSite = lazy(() => import("./pages/PublishedSite"));

// Lazy load the DemoSite component for handling demo slugs
const DemoSite = lazy(() => import("./pages/DemoSite"));

// Debug component for testing
const DebugDemo = lazy(() => import("./pages/DebugDemo"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <PaymentStatusProvider>
            <TooltipProvider>
              <Toaster />
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading...</p>
                  </div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<CustomerDashboard />} />
                  <Route path="/modern-dashboard" element={<ModernDashboardPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/demos" element={<AdminDemoSites />} />
                  <Route path="/admin/templates" element={<AdminTemplates />} />
                  <Route path="/admin/team" element={<AdminTeam />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/customers" element={<AdminCustomers />} />
                  <Route path="/admin/customer-requests" element={<AdminCustomerRequests />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  {/* Add the missing admin edit demo route */}
                  <Route path="/admin/edit-demo/:siteId" element={<AdminEditDemo />} />
                  <Route path="/template8-generator" element={<Template8Generator />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/dashboard/content-editor" element={<CustomerContentEditor />} />
                  {/* Development bypass route */}
                  {process.env.NODE_ENV === 'development' && (
                    <Route path="/dashboard-bypass" element={<DashboardBypass />} />
                  )}
                  {/* Debug route */}
                  {process.env.NODE_ENV === 'development' && (
                    <Route path="/debug-demo" element={<DebugDemo />} />
                  )}
                  {/* Dedicated demo route */}
                  <Route path="/demo/:slug" element={<DemoSite />} />
                  {/* Internal site route for admin/editing */}
                  <Route path="/site/:slug" element={<PublishedSite />} />
                  {/* Published site route - must be last to avoid conflicts */}
                  <Route path="/:slug" element={<PublishedSite />} />
                </Routes>
              </Suspense>
            </TooltipProvider>
          </PaymentStatusProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
