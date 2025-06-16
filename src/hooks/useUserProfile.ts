
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface UserProfileData {
  full_name: string;
  email: string;
  company: string;
  phone: string;
}

export const useUserProfile = () => {
  const { user, profile } = useAuthContext();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<UserProfileData>({
    full_name: '',
    email: '',
    company: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchExtendedProfile();
    }
  }, [user, profile]);

  const fetchExtendedProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get extended profile data
      const { data: extendedProfile, error } = await supabase
        .from('user_profiles_extended')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching extended profile:', error);
        return;
      }

      // Set profile data combining main profile and extended profile
      setProfileData({
        full_name: profile?.full_name || '',
        email: profile?.email || user.email || '',
        company: extendedProfile?.company || '',
        phone: extendedProfile?.phone || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UserProfileData) => {
    if (!user) return { error: 'No user found' };

    try {
      setSaving(true);
      
      // Check if email has changed - this requires special handling
      const currentEmail = profile?.email || user.email || '';
      const emailChanged = data.email !== currentEmail;
      
      if (emailChanged) {
        // Handle email change through Supabase Auth
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email
        });
        
        if (emailError) {
          console.error('Email update error:', emailError);
          throw new Error(`Failed to update email: ${emailError.message}`);
        }
        
        toast({
          title: "Email Update",
          description: "A confirmation email has been sent to your new email address"
        });
      }

      // Update main profile (only full_name, skip email as it's handled above)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: data.full_name
        })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw new Error(`Failed to update profile: ${profileError.message}`);
      }

      // Try to update extended profile first
      const { error: updateError } = await supabase
        .from('user_profiles_extended')
        .update({
          company: data.company,
          phone: data.phone
        })
        .eq('user_id', user.id);

      // If update didn't affect any rows, try to insert
      if (updateError && updateError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('user_profiles_extended')
          .insert({
            user_id: user.id,
            company: data.company,
            phone: data.phone
          });

        if (insertError) {
          console.error('Extended profile insert error:', insertError);
          throw new Error(`Failed to create extended profile: ${insertError.message}`);
        }
      } else if (updateError) {
        console.error('Extended profile update error:', updateError);
        throw new Error(`Failed to update extended profile: ${updateError.message}`);
      }

      // Update local state
      setProfileData(data);
      
      toast({
        title: "Success",
        description: emailChanged 
          ? "Profile updated successfully. Please check your email to confirm the email change."
          : "Profile updated successfully"
      });

      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      return { error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  return {
    profileData,
    loading,
    saving,
    updateProfile,
    refetch: fetchExtendedProfile
  };
};
