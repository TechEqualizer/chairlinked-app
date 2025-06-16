
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Star, CheckCircle, Quote } from 'lucide-react';
import { usePricingActions } from '@/hooks/usePricingActions';
import { PlanSelector } from './payment/PlanSelector';
import { PaymentSummary } from './payment/PaymentSummary';
import { DemoSitePreview } from './payment/DemoSitePreview';
import { PRICING_TIERS, SETUP_FEE } from './payment/constants';

interface ClaimedSite {
  id: string;
  business_name: string;
  site_slug: string;
  logo_url?: string;
  status: string;
  created_at: string;
  claimed_at: string;
}

interface DashboardPaymentPromptProps {
  onPaymentSuccess?: () => void;
  claimedSite?: ClaimedSite | null;
}

export const DashboardPaymentPrompt: React.FC<DashboardPaymentPromptProps> = ({
  onPaymentSuccess,
  claimedSite
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('pro');
  const { loading, handleCombinedPayment } = usePricingActions();

  const selectedTierData = PRICING_TIERS.find(t => t.value === selectedTier);
  const totalToday = selectedTierData ? SETUP_FEE + selectedTierData.monthlyAmount : SETUP_FEE;
  const totalTodayFormatted = (totalToday / 100).toFixed(2);

  const handlePayment = () => {
    if (selectedTier) {
      handleCombinedPayment(selectedTier);
    }
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      business: "Bella Beauty Salon",
      content: "ChairLinked transformed my business! Online bookings increased 300% and my clients love the professional look.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Marcus Rodriguez",
      business: "Elite Barbershop",
      content: "The setup was so easy and the results were immediate. Best investment I've made for my shop.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Lisa Chen",
      business: "Serenity Spa",
      content: "Professional website + booking system for the price of a simple website elsewhere. Amazing value!",
      rating: 5,
      avatar: "LC"
    }
  ];

  const benefits = [
    "Professional website designed for your business",
    "Integrated online booking system",
    "Mobile-optimized for all devices",
    "SEO optimized to attract new customers",
    "24/7 customer support",
    "Analytics and insights dashboard"
  ];

  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {/* Main Payment Card */}
      <div className="max-w-6xl mx-auto">
        <Card className="beautiful-shadow border-0 rounded-3xl sm:rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 text-center py-8 sm:py-12 px-4 sm:px-8">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 bg-purple-600 rounded-full">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                Welcome to ChairLinked!
              </CardTitle>
            </div>
            <p className="text-slate-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Choose your plan and get started today with setup fee + first month subscription to unlock your full dashboard experience.
            </p>
            
            {/* Benefits Preview */}
            <div className="mt-8 sm:mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm sm:text-base text-slate-700 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    <span className="text-left">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-8">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-6">
                {/* Demo Site Preview */}
                {claimedSite && (
                  <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Your Claimed Site</h3>
                    <DemoSitePreview claimedSite={claimedSite} />
                  </div>
                )}
                
                <PlanSelector 
                  tiers={PRICING_TIERS}
                  selectedTier={selectedTier}
                  onTierChange={setSelectedTier}
                />

                {/* Additional Benefits for Mobile */}
                <div className="lg:hidden space-y-3">
                  <h4 className="font-semibold text-slate-900">What's Included:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {benefits.slice(3).map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <PaymentSummary
                selectedTierData={selectedTierData}
                totalTodayFormatted={totalTodayFormatted}
                loading={loading}
                onPayment={handlePayment}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
            Trusted by 1,000+ Beauty & Wellness Professionals
          </h3>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of successful business owners who've transformed their online presence with ChairLinked.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-0 beautiful-shadow rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{testimonial.name}</h4>
                    <p className="text-slate-600 text-xs sm:text-sm">{testimonial.business}</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mb-2" />
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 border border-green-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-700">1,000+</div>
                <div className="text-green-600 text-sm sm:text-base">Active Businesses</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-green-300"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-700">4.9/5</div>
                <div className="text-green-600 text-sm sm:text-base">Customer Rating</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-green-300"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-700">24/7</div>
                <div className="text-green-600 text-sm sm:text-base">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
