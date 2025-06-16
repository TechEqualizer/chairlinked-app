
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/template8/design-system/components/Input";
import { Label } from "@/components/template8/design-system/components/Typography";
import { Upload, MapPin } from "lucide-react";
import { IndustryService } from "../services/IndustryService";
import MagicGenerateSection from "./MagicGenerateSection";

interface FormData {
  businessName: string;
  industry: string;
  customIndustry: string;
  location: string;
  logo?: File;
}

interface BusinessInfoStepProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
  logoPreview: string | null;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMagicGenerate: () => void;
  isGenerating: boolean;
  onNext: () => void;
  canProceed: boolean;
}

const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({
  formData,
  onInputChange,
  logoPreview,
  onLogoUpload,
  onMagicGenerate,
  isGenerating,
  onNext,
  canProceed
}) => {
  const industries = IndustryService.getIndustries();
  const isCustomIndustry = formData.industry === 'custom';

  const handleIndustryChange = (value: string) => {
    onInputChange('industry', value);
    if (value !== 'custom') {
      onInputChange('customIndustry', '');
    }
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="businessName" required>Business Name</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => onInputChange('businessName', e.target.value)}
            placeholder="Your Business Name"
            fullWidth
            className="text-lg"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="industry" required>Industry Type</Label>
          <select
            id="industry"
            value={formData.industry}
            onChange={(e) => handleIndustryChange(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select your industry...</option>
            {industries.map((industry) => (
              <option key={industry.id} value={industry.id}>
                {industry.name}
              </option>
            ))}
            <option value="custom">Other/Custom Industry</option>
          </select>
        </div>

        {isCustomIndustry && (
          <div className="md:col-span-2">
            <Label htmlFor="customIndustry" required>Custom Industry Name</Label>
            <Input
              id="customIndustry"
              value={formData.customIndustry}
              onChange={(e) => onInputChange('customIndustry', e.target.value)}
              placeholder="e.g., Pet Grooming, Life Coach, Consulting"
              fullWidth
            />
          </div>
        )}

        <div>
          <Label htmlFor="location">Business Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => onInputChange('location', e.target.value)}
              placeholder="City, State"
              className="pl-10"
              fullWidth
            />
          </div>
        </div>

        <div>
          <Label htmlFor="logo">Business Logo (Optional)</Label>
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-500 transition-colors cursor-pointer">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="h-16 mx-auto object-contain" />
              ) : (
                <div>
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload your logo</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onLogoUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <MagicGenerateSection
        businessName={formData.businessName}
        industry={isCustomIndustry ? formData.customIndustry : formData.industry}
        isGenerating={isGenerating}
        onMagicGenerate={onMagicGenerate}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="bg-purple-800 hover:bg-purple-900 text-white font-medium px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};

export default BusinessInfoStep;
