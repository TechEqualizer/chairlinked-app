
import React from "react";
import ProgressSteps from "./ProgressSteps";
import BusinessInfoStep from "./BusinessInfoStep";
import BrandContentStep from "./BrandContentStep";
import ServicesStep from "./ServicesStep";
import ContactStep from "./ContactStep";

type StepComponentProps = {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  logoPreview?: string | null;
  onLogoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMagicGenerate?: () => void;
  isGenerating?: boolean;
  onNext: () => void;
  onPrevious?: () => void;
  canProceed: boolean;
  onSubmit?: (e: React.FormEvent) => void;
};

interface FormStepsManagerProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  formData: any;
  onInputChange: (field: string, value: any) => void;
  logoPreview: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMagicGenerate: () => void;
  isGenerating: boolean;
  selectedIndustry: any;
  canProceedToStep2: boolean;
  canProceedToStep3: boolean;
  canProceedToStep4: boolean;
  hasUserEditedContent: any;
}

const FormStepsManager: React.FC<FormStepsManagerProps> = ({
  currentStep,
  setCurrentStep,
  formData,
  onInputChange,
  logoPreview,
  onLogoUpload,
  onMagicGenerate,
  isGenerating,
  selectedIndustry,
  canProceedToStep2,
  canProceedToStep3,
  canProceedToStep4
}) => {
  const nextStep = () => setCurrentStep(step => Math.min(step + 1, 4));
  const prevStep = () => setCurrentStep(step => Math.max(step - 1, 1));

  return (
    <>
      <ProgressSteps currentStep={currentStep} totalSteps={4} />
      {currentStep === 1 && (
        <BusinessInfoStep
          formData={formData}
          onInputChange={onInputChange}
          logoPreview={logoPreview}
          onLogoUpload={onLogoUpload}
          onMagicGenerate={onMagicGenerate}
          isGenerating={isGenerating}
          onNext={nextStep}
          canProceed={canProceedToStep2}
        />
      )}
      {currentStep === 2 && (
        <BrandContentStep
          formData={formData}
          onInputChange={onInputChange}
          selectedIndustry={selectedIndustry}
          onNext={nextStep}
          onPrevious={prevStep}
          canProceed={canProceedToStep3}
        />
      )}
      {currentStep === 3 && (
        <ServicesStep
          formData={formData}
          onInputChange={onInputChange}
          selectedIndustry={selectedIndustry}
          onNext={nextStep}
          onPrevious={prevStep}
          canProceed={canProceedToStep4}
        />
      )}
      {currentStep === 4 && (
        <ContactStep
          formData={formData}
          onInputChange={onInputChange}
          onPrevious={prevStep}
          onSubmit={(e) => {e.preventDefault();}} // delegated by parent
          isGenerating={isGenerating}
        />
      )}
    </>
  );
};

export default FormStepsManager;
