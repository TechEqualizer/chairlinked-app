import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useEnhancedPaymentStatus } from '@/hooks/useEnhancedPaymentStatus';
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuthContext();
  const { subscribed, setup_fee_paid, loading, error } = useEnhancedPaymentStatus();

  console.log('[Index] Payment status check:', { 
    isAuthenticated, 
    subscribed, 
    setup_fee_paid, 
    loading, 
    error,
    timestamp: new Date().toISOString() 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-600">ChairLinked</div>
          <div className="space-x-4">
            {isAuthenticated ? (
              <>
                {subscribed && setup_fee_paid && (
                  <Link to="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                )}
                <Link to="/pricing">
                  <Button>Upgrade Plan</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/pricing">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            We Create Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {" "}ChairLinked
            </span>
            <br />
            Website For You
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional websites created by our expert team. We handle everything from design to launch - 
            you just focus on running your business.
          </p>

          <div className="space-x-4 mb-12">
            {isAuthenticated ? (
              <>
                {subscribed && setup_fee_paid ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="text-lg px-8 py-6">
                      View My Dashboard
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/pricing">
                    <Button size="lg" className="text-lg px-8 py-6">
                      Get My Website Made
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    View Plans
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/pricing">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Get My Website Made
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Design</h3>
              <p className="text-gray-600">Our team creates beautiful, professional websites tailored to your business needs.</p>
            </div>
            
            <div className="text-center p-6">
              <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your professional website live quickly with our streamlined creation process.</p>
            </div>
            
            <div className="text-center p-6">
              <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Results-Driven</h3>
              <p className="text-gray-600">Track performance with built-in analytics and optimized for maximum engagement.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel (Development Only) */}
    </div>
  );
};

export default Index;
