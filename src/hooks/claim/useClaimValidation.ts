
import { useToast } from '@/hooks/use-toast';
import { DemoClaimData } from '@/types/demoTypes';

export const useClaimValidation = () => {
  const { toast } = useToast();

  const validateForm = (formData: DemoClaimData) => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms agreement required",
        description: "Please agree to the terms and privacy policy to continue.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateForm };
};
