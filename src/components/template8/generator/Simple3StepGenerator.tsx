import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Upload, Sparkles, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Simple3StepGeneratorProps {
  onGenerate: (data: any) => void;
  isGenerating?: boolean;
}

interface FormData {
  // Step 1: Business Basics
  businessName: string;
  industry: string;
  customIndustry: string;
  logoUrl: string;
  
  // Step 2: Services & Pricing (simplified)
  primaryService: string;
  serviceDescription: string;
  averagePrice: string;
  
  // Step 3: Booking & Contact
  bookingUrl: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
}

const INDUSTRIES = [
  'Hair Salon',
  'Beauty Spa',
  'Nail Salon',
  'Massage Therapy',
  'Photography',
  'Makeup Artist',
  'Fitness Training',
  'Life Coaching',
  'Consulting',
  'Other'
];

const STEP_CONFIG = [
  {
    id: 1,
    title: 'Business Basics',
    description: 'Tell us about your business',
    icon: '🏢'
  },
  {
    id: 2,
    title: 'Main Service',
    description: 'What\'s your primary offering?',
    icon: '💼'
  },
  {
    id: 3,
    title: 'Booking & Contact',
    description: 'How do customers reach you?',
    icon: '📞'
  }
];

export const Simple3StepGenerator: React.FC<Simple3StepGeneratorProps> = ({
  onGenerate,
  isGenerating = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    industry: '',
    customIndustry: '',
    logoUrl: '',
    primaryService: '',
    serviceDescription: '',
    averagePrice: '',
    bookingUrl: '',
    phone: '',
    email: '',
    address: '',
    businessHours: ''
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedToStep2 = () => {
    return formData.businessName.trim() && formData.industry && 
           (formData.industry !== 'Other' || formData.customIndustry.trim());
  };

  const canProceedToStep3 = () => {
    return canProceedToStep2() && formData.primaryService.trim() && 
           formData.serviceDescription.trim();
  };

  const canSubmit = () => {
    return canProceedToStep3() && (formData.bookingUrl.trim() || formData.phone.trim() || formData.email.trim());
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuickGenerate = () => {
    // Auto-fill with intelligent defaults
    const industryName = formData.industry === 'Other' ? formData.customIndustry : formData.industry;
    const businessName = formData.businessName;
    
    // Generate sample content based on industry
    const sampleContent = generateSampleContent(industryName, businessName);
    
    setFormData(prev => ({
      ...prev,
      ...sampleContent
    }));
  };

  const generateSampleContent = (industry: string, businessName: string) => {
    const industryTemplates: Record<string, any> = {
      'Hair Salon': {
        primaryService: 'Hair Cut & Style',
        serviceDescription: 'Professional haircuts, coloring, and styling services for all hair types',
        averagePrice: '$65',
        businessHours: 'Mon-Fri: 9AM-7PM\nSat: 9AM-5PM\nSun: 10AM-4PM'
      },
      'Beauty Spa': {
        primaryService: 'Facial Treatments',
        serviceDescription: 'Relaxing facial treatments and skincare services',
        averagePrice: '$85',
        businessHours: 'Mon-Fri: 10AM-8PM\nSat: 9AM-6PM\nSun: 10AM-5PM'
      },
      'Photography': {
        primaryService: 'Portrait Photography',
        serviceDescription: 'Professional portrait and event photography services',
        averagePrice: '$150',
        businessHours: 'By Appointment\nMon-Sat: 9AM-6PM'
      }
    };

    return industryTemplates[industry] || {
      primaryService: 'Professional Service',
      serviceDescription: 'High-quality professional services tailored to your needs',
      averagePrice: '$75',
      businessHours: 'Mon-Fri: 9AM-6PM'
    };
  };

  const handleSubmit = () => {
    const generationData = {
      // Map to existing Template8 structure
      businessName: formData.businessName,
      industry: formData.industry === 'Other' ? formData.customIndustry : formData.industry,
      logoUrl: formData.logoUrl,
      headline: `Professional ${formData.primaryService} Services`,
      subheadline: formData.serviceDescription,
      tagline: `Quality ${formData.primaryService} You Can Trust`,
      services: [
        {
          id: '1',
          title: formData.primaryService,
          description: formData.serviceDescription,
          price: formData.averagePrice,
          duration: '60 mins'
        }
      ],
      bookingUrl: formData.bookingUrl,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      businessHours: formData.businessHours,
      // Add some default testimonials and gallery
      testimonials: [
        {
          id: '1',
          name: 'Sarah M.',
          text: `Amazing ${formData.primaryService.toLowerCase()} service! Highly recommend ${formData.businessName}.`,
          rating: 5
        }
      ],
      gallery: {
        images: [
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&w=800',
            caption: 'Our professional work'
          }
        ]
      }
    };

    onGenerate(generationData);
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {STEP_CONFIG.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${index < STEP_CONFIG.length - 1 ? 'flex-1' : ''}`}
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
              currentStep >= step.id
                ? 'bg-purple-600 border-purple-600 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-400'
            }`}>
              <span className="text-xl">{step.icon}</span>
            </div>
            {index < STEP_CONFIG.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-purple-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {STEP_CONFIG[currentStep - 1].title}
        </h3>
        <p className="text-gray-600">
          {STEP_CONFIG[currentStep - 1].description}
        </p>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="business-name">Business Name *</Label>
        <Input
          id="business-name"
          value={formData.businessName}
          onChange={(e) => updateFormData('businessName', e.target.value)}
          placeholder="e.g., Sarah's Hair Studio"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="industry">Industry *</Label>
        <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.industry === 'Other' && (
        <div>
          <Label htmlFor="custom-industry">Custom Industry *</Label>
          <Input
            id="custom-industry"
            value={formData.customIndustry}
            onChange={(e) => updateFormData('customIndustry', e.target.value)}
            placeholder="Describe your business type"
            className="mt-1"
          />
        </div>
      )}

      <div>
        <Label htmlFor="logo-url">Logo URL (optional)</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="logo-url"
            value={formData.logoUrl}
            onChange={(e) => updateFormData('logoUrl', e.target.value)}
            placeholder="https://your-logo-url.com/logo.png"
            className="flex-1"
          />
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
      </div>

      {formData.businessName && formData.industry && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h4 className="font-medium text-purple-900">Quick Setup Available!</h4>
          </div>
          <p className="text-sm text-purple-800 mb-3">
            We can auto-fill the next steps with smart defaults for {formData.industry.toLowerCase()} businesses.
          </p>
          <Button
            onClick={handleQuickGenerate}
            variant="outline"
            className="text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Quick Generate Content
          </Button>
        </div>
      )}
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="primary-service">Primary Service *</Label>
        <Input
          id="primary-service"
          value={formData.primaryService}
          onChange={(e) => updateFormData('primaryService', e.target.value)}
          placeholder="e.g., Hair Cut & Style, Facial Treatment, Photography Session"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="service-description">Service Description *</Label>
        <Textarea
          id="service-description"
          value={formData.serviceDescription}
          onChange={(e) => updateFormData('serviceDescription', e.target.value)}
          placeholder="Describe what's included in your main service..."
          className="mt-1"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="average-price">Starting Price (optional)</Label>
        <Input
          id="average-price"
          value={formData.averagePrice}
          onChange={(e) => updateFormData('averagePrice', e.target.value)}
          placeholder="e.g., $65, $50-80, Starting at $45"
          className="mt-1"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600">💡</div>
          <div>
            <h4 className="font-medium text-blue-900">Service Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Focus on your most popular service first</li>
              <li>• You can add more services later</li>
              <li>• Be specific about what's included</li>
              <li>• Price ranges work well (e.g., $50-80)</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Calendar className="w-5 h-5" />
            Online Booking (Recommended)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="booking-url">Booking Link</Label>
            <Input
              id="booking-url"
              value={formData.bookingUrl}
              onChange={(e) => updateFormData('bookingUrl', e.target.value)}
              placeholder="https://calendly.com/your-name or https://acuity..."
              className="mt-1"
            />
            <p className="text-sm text-purple-700 mt-1">
              Add your Calendly, Acuity, Square, or other booking platform link
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="hello@yourbusiness.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Business Address (optional)</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              placeholder="123 Main St, City, State 12345"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="business-hours">Business Hours (optional)</Label>
            <Textarea
              id="business-hours"
              value={formData.businessHours}
              onChange={(e) => updateFormData('businessHours', e.target.value)}
              placeholder="Mon-Fri: 9AM-6PM&#10;Sat: 9AM-4PM&#10;Sun: Closed"
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-green-600">✅</div>
          <div>
            <h4 className="font-medium text-green-900">You're almost ready!</h4>
            <p className="text-sm text-green-800 mt-1">
              We'll create a professional website with your information and you can customize it further after generation.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Create Your Professional Website
          </CardTitle>
          <p className="text-center text-gray-600">
            Get a beautiful website in just 3 simple steps
          </p>
        </CardHeader>
        <CardContent>
          {renderProgressBar()}

          <AnimatePresence mode="wait">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-sm text-gray-500">
              Step {currentStep} of 3
            </div>

            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !canProceedToStep2()) ||
                  (currentStep === 2 && !canProceedToStep3())
                }
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit() || isGenerating}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Create Website
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { Simple3StepGenerator };