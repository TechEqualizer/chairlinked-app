
import { useState, useEffect } from "react";
import { IndustryService, IndustryConfig } from "../services/IndustryService";

export const useFormDataManager = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    businessName: "",
    industry: "",
    customIndustry: "",
    tagline: "",
    headline: "",
    subheadline: "",
    description: "",
    location: "",
    contactEmail: "",
    phoneNumber: "",
    instagramHandle: "",
    brandColor: "#8B5CF6",
    fontFamily: "Inter",
    useAIGeneration: true,
    services: []
  });

  const [selectedIndustry, setSelectedIndustry] = useState<IndustryConfig | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [hasUserEditedContent, setHasUserEditedContent] = useState({
    tagline: false,
    headline: false,
    subheadline: false
  });

  // --- AUTOFILL & EFFECTS ---
  useEffect(() => {
    const industryToUse = formData.industry === 'custom' ? null : formData.industry;
    if (industryToUse && formData.businessName && formData.useAIGeneration) {
      const industry = IndustryService.getIndustryById(industryToUse);
      if (industry) {
        setSelectedIndustry(industry);
        const updates: Partial<typeof formData> = {
          brandColor: industry.brandColors[0],
          fontFamily: industry.fontFamily
        };
        if (!hasUserEditedContent.tagline && industry.taglineTemplates?.length > 0) updates.tagline = industry.taglineTemplates[0];
        if (!hasUserEditedContent.headline && industry.headlineTemplates?.length > 0) updates.headline = industry.headlineTemplates[0];
        if (!hasUserEditedContent.subheadline && industry.subheadlineTemplates?.length > 0) updates.subheadline = industry.subheadlineTemplates[0];
        if (formData.services.length === 0 && industry.defaultServices) {
          updates.services = industry.defaultServices.map(service => ({
            title: service.title,
            description: service.description,
            price: service.price,
            duration: service.duration || ''
          }));
        }
        setFormData(prev => ({ ...prev, ...updates }));
      }
    } else if (formData.industry === 'custom') {
      setSelectedIndustry(null);
      const updates: Partial<typeof formData> = {
        brandColor: "#8B5CF6",
        fontFamily: "Inter"
      };
      if (!hasUserEditedContent.tagline) updates.tagline = `Professional ${formData.customIndustry || formData.businessName} Services`;
      if (!hasUserEditedContent.headline) updates.headline = `Expert ${formData.customIndustry || formData.businessName} You Can Trust`;
      if (!hasUserEditedContent.subheadline) updates.subheadline = 'Professional services delivered with expertise and care to meet your unique needs and exceed your expectations';
      setFormData(prev => ({ ...prev, ...updates }));
    }
  }, [formData.industry, formData.customIndustry, formData.businessName, formData.useAIGeneration, hasUserEditedContent]);

  // --- INPUT HANDLING ---
  const handleInputChange = (field: string, value: any) => {
    if (field === 'tagline' || field === 'headline' || field === 'subheadline') {
      setHasUserEditedContent(prev => ({ ...prev, [field]: true }));
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('logo', file);
      const reader = new FileReader();
      reader.onload = (e) => { setLogoPreview(e.target?.result as string); };
      reader.readAsDataURL(file);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    handleInputChange,
    handleLogoUpload,
    logoPreview,
    selectedIndustry,
    hasUserEditedContent
  };
};
