import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface SimpleTest3StepProps {
  onGenerate: (data: any) => void;
  isGenerating?: boolean;
}

const INDUSTRIES = [
  'Hair Salon',
  'Beauty Spa', 
  'Photography',
  'Other'
];

export const SimpleTest3Step: React.FC<SimpleTest3StepProps> = ({
  onGenerate,
  isGenerating = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    primaryService: '',
    bookingUrl: ''
  });

  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    onGenerate(formData);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Step 1: Business Basics</h3>
      
      <div>
        <Label htmlFor="businessName">Business Name *</Label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) => updateFormData({ businessName: e.target.value })}
          placeholder="e.g., Bella's Hair Studio"
        />
      </div>

      <div>
        <Label htmlFor="industry">Industry *</Label>
        <Select value={formData.industry} onValueChange={(value) => updateFormData({ industry: value })}>
          <SelectTrigger>
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
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Step 2: Main Service</h3>
      
      <div>
        <Label htmlFor="primaryService">Primary Service *</Label>
        <Input
          id="primaryService"
          value={formData.primaryService}
          onChange={(e) => updateFormData({ primaryService: e.target.value })}
          placeholder="e.g., Haircut & Styling"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Step 3: Booking</h3>
      
      <div>
        <Label htmlFor="bookingUrl">Booking URL *</Label>
        <Input
          id="bookingUrl"
          value={formData.bookingUrl}
          onChange={(e) => updateFormData({ bookingUrl: e.target.value })}
          placeholder="https://calendly.com/your-link"
        />
      </div>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">Create Your Website</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-4 sm:px-6">
        {/* Progress */}
        <div className="flex justify-between mb-6 sm:mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`flex-1 h-2 mx-1 rounded ${step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Current Step */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {currentStep < 3 ? (
            <Button onClick={nextStep} className="w-full sm:w-auto order-1 sm:order-2">
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Continue</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isGenerating} className="w-full sm:w-auto order-1 sm:order-2">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Create Website</span>
              <span className="sm:hidden">Create</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};