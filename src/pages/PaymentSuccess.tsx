
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { usePaymentSuccess } from '@/hooks/usePaymentSuccess';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refetch } = usePaymentStatus();
  const { convertDemoSiteToLive } = usePaymentSuccess();
  const { toast } = useToast();
  const [conversionStatus, setConversionStatus] = useState<'pending' | 'converting' | 'success' | 'error'>('pending');
  const [retryCount, setRetryCount] = useState(0);
  
  const paymentType = searchParams.get('type');
  const tier = searchParams.get('tier');

  const attemptConversion = async () => {
    setConversionStatus('converting');
    const result = await convertDemoSiteToLive(false);
    
    if (result.success) {
      setConversionStatus('success');
      toast({
        title: "Site Converted Successfully! 🎉",
        description: `Your ${result.siteName} website is now live and ready for customers.`,
      });
    } else {
      setConversionStatus('error');
      if (retryCount < 2) {
        // Auto-retry up to 2 times
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          attemptConversion();
        }, 2000);
      } else {
        toast({
          title: "Site Conversion Issue",
          description: "We'll convert your site automatically. You can also do this manually from your dashboard.",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    // Refresh payment status when landing on success page
    const timer = setTimeout(() => {
      refetch();
    }, 2000);

    // Convert demo site to live site after successful payment
    const conversionTimer = setTimeout(() => {
      attemptConversion();
    }, 3000);

    // For combined payments, automatically redirect to dashboard
    if (paymentType === 'combined') {
      const redirectTimer = setTimeout(() => {
        toast({
          title: "Redirecting to Dashboard",
          description: "Taking you to your customer dashboard...",
        });
        
        navigate('/dashboard');
      }, 8000); // Increased delay to allow site conversion

      return () => {
        clearTimeout(timer);
        clearTimeout(conversionTimer);
        clearTimeout(redirectTimer);
      };
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(conversionTimer);
    };
  }, [refetch, paymentType, toast, navigate]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewPricing = () => {
    navigate('/pricing');
  };

  const handleRetryConversion = () => {
    setRetryCount(0);
    attemptConversion();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {paymentType === 'setup' && (
              <>
                <p className="text-gray-600">
                  Your $29 setup fee has been processed successfully. Now choose your monthly subscription plan.
                </p>
                <Button onClick={handleViewPricing} className="w-full">
                  Choose Subscription Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}
            
            {(paymentType === 'subscription' || paymentType === 'combined') && (
              <>
                <p className="text-gray-600">
                  Welcome to ChairLinked! Your {tier ? `${tier.charAt(0).toUpperCase() + tier.slice(1)} plan` : 'subscription'} is now active.
                  {paymentType === 'combined' && ' Your setup fee and first month have been processed.'}
                </p>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-green-700 mb-1 font-medium">What's included:</div>
                  <div className="text-green-600 text-sm space-y-1">
                    <div>• Access to your customer dashboard</div>
                    <div>• Site metrics and analytics</div>
                    <div>• Your demo site is now live!</div>
                    <div>• Monthly billing continues automatically</div>
                    <div>• Cancel or change plan anytime</div>
                  </div>
                </div>

                {/* Site Conversion Status */}
                <div className={`p-3 rounded-lg ${
                  conversionStatus === 'success' ? 'bg-green-50' :
                  conversionStatus === 'converting' ? 'bg-blue-50' :
                  conversionStatus === 'error' ? 'bg-orange-50' :
                  'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {conversionStatus === 'converting' && <Loader2 className="w-4 h-4 animate-spin text-blue-700" />}
                    {conversionStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-700" />}
                    {conversionStatus === 'error' && <AlertTriangle className="w-4 h-4 text-orange-700" />}
                    <span className={`font-medium ${
                      conversionStatus === 'success' ? 'text-green-700' :
                      conversionStatus === 'converting' ? 'text-blue-700' :
                      conversionStatus === 'error' ? 'text-orange-700' :
                      'text-gray-700'
                    }`}>
                      {conversionStatus === 'pending' && 'Preparing to convert your site...'}
                      {conversionStatus === 'converting' && 'Converting your demo site to live...'}
                      {conversionStatus === 'success' && 'Site successfully converted to live!'}
                      {conversionStatus === 'error' && 'Site conversion in progress...'}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    conversionStatus === 'success' ? 'text-green-600' :
                    conversionStatus === 'converting' ? 'text-blue-600' :
                    conversionStatus === 'error' ? 'text-orange-600' :
                    'text-gray-600'
                  }`}>
                    {conversionStatus === 'pending' && 'This will remove demo watermarks and claim buttons.'}
                    {conversionStatus === 'converting' && 'Please wait while we update your site...'}
                    {conversionStatus === 'success' && 'Your site is now live without any demo elements.'}
                    {conversionStatus === 'error' && 'You can manually convert from your dashboard if needed.'}
                  </p>
                  
                  {conversionStatus === 'error' && retryCount >= 2 && (
                    <Button 
                      onClick={handleRetryConversion}
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                    >
                      Retry Conversion
                    </Button>
                  )}
                </div>

                <Button onClick={handleGoToDashboard} className="w-full">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}

            <Button 
              variant="outline" 
              onClick={handleViewPricing} 
              className="w-full"
            >
              View Pricing Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
