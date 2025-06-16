
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface UserSettingsData {
  email_notifications: boolean;
  demo_views_notifications: boolean;
  client_feedback_notifications: boolean;
  team_updates_notifications: boolean;
  auto_save_demos: boolean;
  public_demo_urls: boolean;
  analytics_tracking: boolean;
}

export const useUserSettings = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettingsData>({
    email_notifications: true,
    demo_views_notifications: true,
    client_feedback_notifications: true,
    team_updates_notifications: false,
    auto_save_demos: true,
    public_demo_urls: true,
    analytics_tracking: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        setSettings({
          email_notifications: data.email_notifications,
          demo_views_notifications: data.demo_views_notifications,
          client_feedback_notifications: data.client_feedback_notifications,
          team_updates_notifications: data.team_updates_notifications,
          auto_save_demos: data.auto_save_demos,
          public_demo_urls: data.public_demo_urls,
          analytics_tracking: data.analytics_tracking
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettingsData>) => {
    if (!user) return { error: 'No user found' };

    try {
      setSaving(true);
      
      const updatedSettings = { ...settings, ...newSettings };

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings
        });

      if (error) throw error;

      setSettings(updatedSettings);
      
      toast({
        title: "Success",
        description: "Settings updated successfully"
      });

      return { error: null };
    } catch (error) {
      console.error('Error updating settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update settings';
      
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
    settings,
    loading,
    saving,
    updateSettings,
    refetch: fetchSettings
  };
};
