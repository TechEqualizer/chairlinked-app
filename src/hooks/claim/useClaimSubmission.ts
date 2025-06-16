
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { DemoClaimData } from '@/types/demoTypes';

export const useClaimSubmission = (demoSiteId: string, onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (formData: DemoClaimData, isAlreadyClaimed: boolean) => {
    if (isAlreadyClaimed) {
      toast({
        title: "Site already claimed",
        description: "This demo site has already been claimed by another user.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Starting integrated claim + account creation process');
    
    // Dev mode simulation
    const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';
    if (isDevMode) {
      console.log('Dev mode: Simulating claim process');
      
      // Create account first to set auth state
      console.log('Dev mode: Creating account with auth');
      const signUpResult = await signUp(formData.email, formData.password, formData.name);
      
      if (signUpResult.error) {
        console.error('Dev mode: Account creation failed:', signUpResult.error);
        toast({
          title: "Account creation failed",
          description: "Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log('Dev mode: Account created successfully, user:', signUpResult.data?.user?.email);
      
      toast({
        title: "Account created & site claimed! 🎉",
        description: "Welcome! Redirecting to your dashboard...",
        duration: 4000,
      });
      
      // Give a bit more time for auth state to propagate
      setTimeout(() => {
        console.log('Dev mode: Redirecting to dashboard');
        navigate('/dashboard');
        onSuccess();
      }, 2000);
      
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Create Supabase auth account
      console.log('Step 1: Creating user account');
      const signUpResult = await signUp(formData.email, formData.password, formData.name);

      if (signUpResult.error) {
        console.error('Account creation failed:', signUpResult.error);
        
        if (signUpResult.error.message?.includes('already registered')) {
          toast({
            title: "Account already exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account creation failed",
            description: signUpResult.error.message || "Failed to create account. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      // Step 2: Create the demo claim record
      console.log('Step 2: Creating demo claim record');
      const { error: claimError } = await supabase
        .from('demo_prospect_leads')
        .insert({
          demo_site_id: demoSiteId,
          name: formData.name,
          email: formData.email,
          phone: null,
          business_name: null,
          business_details: null,
          message: null
        });

      if (claimError) {
        console.error('Claim creation failed:', claimError);
        
        if (claimError.code === '23505' && claimError.message.includes('unique_demo_site_claim')) {
          toast({
            title: "Site already claimed",
            description: "This demo site has already been claimed by another user.",
            variant: "destructive",
          });
          return;
        }
        throw claimError;
      }

      // Step 3: Create claimed_sites record for dashboard access
      console.log('Step 3: Creating claimed_sites record');
      const { error: claimedSiteError } = await supabase
        .from('claimed_sites')
        .insert({
          user_id: signUpResult.data?.user?.id,
          site_id: demoSiteId,
          business_name: formData.name, // Use name as business name initially
          site_slug: `${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          status: 'claimed',
          claimed_at: new Date().toISOString(),
          site_type: 'demo'
        });

      if (claimedSiteError) {
        console.warn('Failed to create claimed_sites record:', claimedSiteError);
      }

      // Step 4: Update chairlinked_sites with prospect info
      console.log('Step 4: Updating site with prospect info');
      try {
        const { error: updateError } = await supabase
          .from('chairlinked_sites')
          .update({ 
            user_id: signUpResult.data?.user?.id,
            prospect_name: formData.name,
            prospect_email: formData.email,
            lifecycle_stage: 'claimed'
          })
          .eq('id', demoSiteId);

        if (updateError) {
          console.warn('Failed to update site, but claim was successful:', updateError);
        }
      } catch (linkError) {
        console.warn('Site update failed, but claim was successful:', linkError);
      }

      console.log('Integrated claim + account creation completed successfully');

      toast({
        title: "Account created & site claimed! 🎉",
        description: "Welcome! Redirecting to your dashboard...",
        duration: 4000,
      });

      // Redirect immediately to dashboard - they're now logged in
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

      onSuccess();

    } catch (error) {
      console.error('Error during integrated claim + account creation:', error);
      toast({
        title: "Error",
        description: "Failed to complete the process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
};
