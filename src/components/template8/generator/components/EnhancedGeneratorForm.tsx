import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/template8/design-system/components/Card";
import { useFormDataManager } from "./FormDataManager";
import FormStepsManager from "./FormStepsManager";

interface EnhancedGeneratorFormProps {
  onGenerate: (data: any) => void;
  isGenerating?: boolean;
}

const EnhancedGeneratorForm: React.FC<EnhancedGeneratorFormProps> = ({
  onGenerate,
  isGenerating = false
}) => {
  const {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    handleInputChange,
    handleLogoUpload,
    logoPreview,
    selectedIndustry,
    hasUserEditedContent
  } = useFormDataManager();

  // Validation: can move to a utils file if desired
  const canProceedToStep2 = Boolean(
    formData.businessName.trim() && formData.industry &&
    (formData.industry !== 'custom' || formData.customIndustry.trim())
  );
  const canProceedToStep3 = Boolean(
    canProceedToStep2 && 
    formData.tagline.trim() && 
    formData.headline.trim() && 
    formData.subheadline.trim()
  );
  const canProceedToStep4 = Boolean(
    canProceedToStep3 && 
    formData.services.length > 0 &&
    formData.services.every(service => service.title.trim() && service.description.trim() && service.price.trim())
  );

  // Magic generate handler
  const handleMagicGenerate = () => {
    const { IndustryService } = require("../services/IndustryService");
    const industryName = formData.industry === 'custom' ? formData.customIndustry : formData.industry;
    if (!formData.businessName || !industryName) { return; }
    const industryContent = IndustryService.generateIndustryContent(
      formData.industry === 'custom' ? 'custom' : formData.industry, 
      formData.businessName
    );
    const generationData = {
      ...formData,
      ...industryContent,
      headline: formData.headline || industryContent?.headline,
      subheadline: formData.subheadline || industryContent?.subheadline,
      industry: formData.industry === 'custom' ? formData.customIndustry : formData.industry,
      useAdvancedGeneration: true
    };
    onGenerate(generationData);
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { IndustryService } = require("../services/IndustryService");
    const industryToUse = formData.industry === 'custom' ? 'custom' : formData.industry;
    const industryContent = industryToUse ? 
      IndustryService.generateIndustryContent(industryToUse, formData.businessName) : null;
    const generationData = {
      ...formData,
      ...industryContent,
      headline: formData.headline || industryContent?.headline,
      subheadline: formData.subheadline || industryContent?.subheadline,
      industry: formData.industry === 'custom' ? formData.customIndustry : formData.industry
    };
    onGenerate(generationData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card variant="default" elevation="lg">
        <CardHeader>
          <CardTitle className="text-center">
            Create Your Professional Website
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormStepsManager
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              formData={formData}
              onInputChange={handleInputChange}
              logoPreview={logoPreview}
              onLogoUpload={handleLogoUpload}
              onMagicGenerate={handleMagicGenerate}
              isGenerating={isGenerating}
              selectedIndustry={selectedIndustry}
              canProceedToStep2={canProceedToStep2}
              canProceedToStep3={canProceedToStep3}
              canProceedToStep4={canProceedToStep4}
              hasUserEditedContent={hasUserEditedContent}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedGeneratorForm;
