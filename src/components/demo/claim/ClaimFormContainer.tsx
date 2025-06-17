
import React from 'react';
import { ClaimFormFields } from './ClaimFormFields';
import { ClaimFormActions } from './ClaimFormActions';
import { useClaimForm } from '@/hooks/useClaimForm';
import { CheckCircle, Sparkles } from 'lucide-react';

interface ClaimFormContainerProps {
  demoSiteId: string;
  timeRemaining?: string;
  isExpired?: boolean;
  onSuccess: (formData: { email: string; name: string }) => void;
  onCancel: () => void;
  businessName?: string;
}

export const ClaimFormContainer: React.FC<ClaimFormContainerProps> = ({
  demoSiteId,
  onSuccess,
  onCancel,
  businessName
}) => {
  const {
    formData,
    setFormData,
    completedFields,
    isSubmitting,
    handleSubmit,
    isAlreadyClaimed,
    checkingClaim
  } = useClaimForm(demoSiteId, () => onSuccess({ email: formData.email, name: formData.name }), businessName);

  if (checkingClaim) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-center space-y-1">
          <div className="w-4 h-4 mx-auto border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-xs">Checking...</p>
        </div>
      </div>
    );
  }

  if (isAlreadyClaimed) {
    return (
      <div className="text-center py-4 px-3 space-y-2">
        <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-900">Already Claimed</h3>
          <p className="text-gray-600 text-xs max-w-xs mx-auto">
            This demo has been claimed by another user.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors text-xs font-medium"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-3">
      {/* Responsive Header */}
      <div className="text-center mb-4 sm:mb-3">
        <div className="flex items-center justify-center gap-2 sm:gap-1.5 mb-2 sm:mb-1">
          <Sparkles className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-purple-600" />
          <h2 className="text-lg sm:text-base font-bold sm:font-semibold text-gray-900">Claim This Site</h2>
        </div>
        <p className="text-gray-600 text-sm sm:text-xs leading-relaxed px-2 sm:px-0">Create your account to claim this demo and get started</p>
      </div>

      {/* Responsive Form */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-2">
        <ClaimFormFields
          formData={formData}
          setFormData={setFormData}
          completedFields={completedFields}
        />

        <ClaimFormActions
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
};
