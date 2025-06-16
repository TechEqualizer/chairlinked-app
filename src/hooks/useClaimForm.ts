
import { useState, useEffect } from 'react';
import { DemoClaimData } from '@/types/demoTypes';
import { useClaimValidation } from './claim/useClaimValidation';
import { useClaimStatus } from './claim/useClaimStatus';
import { useClaimSubmission } from './claim/useClaimSubmission';

export const useClaimForm = (demoSiteId: string, onSuccess: () => void) => {
  const [formData, setFormData] = useState<DemoClaimData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());

  const { validateForm } = useClaimValidation();
  const { isAlreadyClaimed, checkingClaim } = useClaimStatus(demoSiteId);
  const { isSubmitting, handleSubmit: submitClaim } = useClaimSubmission(demoSiteId, onSuccess);

  // Track completed fields for progress
  useEffect(() => {
    const completed = new Set<string>();
    if (formData.name) completed.add('name');
    if (formData.email) completed.add('email');
    if (formData.password && formData.password.length >= 6) completed.add('password');
    if (formData.confirmPassword && formData.confirmPassword === formData.password) completed.add('confirmPassword');
    if (formData.agreeToTerms) completed.add('terms');
    setCompletedFields(completed);
  }, [formData]);

  const progress = (completedFields.size / 5) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    await submitClaim(formData, isAlreadyClaimed);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    });
  };

  return {
    formData,
    setFormData,
    completedFields,
    isSubmitting,
    progress,
    handleSubmit,
    resetForm,
    isAlreadyClaimed,
    checkingClaim
  };
};
