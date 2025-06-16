
import React from "react";
import { motion } from "framer-motion";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, totalSteps }) => {
  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Business Information";
      case 2: return "Brand & Content";
      case 3: return "Contact & Finalization";
      default: return "";
    }
  };

  return (
    <>
      {/* Progress Steps */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-purple-700 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}
              animate={{
                scale: step === currentStep ? 1.1 : 1,
                backgroundColor: step <= currentStep ? '#6D28D9' : '#E5E7EB'
              }}
            >
              {step}
            </motion.div>
            {step < totalSteps && (
              <div className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-purple-700' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {getStepTitle(currentStep)}
        </p>
      </div>
    </>
  );
};

export default ProgressSteps;
