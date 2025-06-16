
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AccountCreationPromptProps {
  email: string;
  name: string;
  demoSiteId: string;
  onAccountCreated?: () => void;
  onSkip?: () => void;
}

export const AccountCreationPrompt: React.FC<AccountCreationPromptProps> = ({
  email,
  name,
  demoSiteId,
  onAccountCreated,
  onSkip
}) => {
  const [createAccount, setCreateAccount] = useState(true);
  const [password, setPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateAccount = async () => {
    if (!password || password.length < 6) {
      toast({
        title: "Password required",
        description: "Please enter a password with at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const redirectUrl = `${window.location.origin}/customer-dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in to your customer dashboard.",
            duration: 6000,
          });
        } else {
          throw error;
        }
      } else {
        // Link the demo to the new user account
        if (data.user) {
          await supabase
            .from('demo_user_claims')
            .insert({
              demo_site_id: demoSiteId,
              user_id: data.user.id,
              claimed_email: email
            });
        }

        toast({
          title: "Account created!",
          description: "Check your email to confirm your account and access your dashboard.",
          duration: 8000,
        });
        onAccountCreated?.();
      }
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendInvite = async () => {
    try {
      // Here you could implement an invitation email system
      toast({
        title: "Invitation sent!",
        description: "We'll send you an email with instructions to access your dashboard.",
        duration: 6000,
      });
      onSkip?.();
    } catch (error) {
      console.error('Error sending invite:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    if (checked === 'indeterminate') return;
    setCreateAccount(checked);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
      <div className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Track Your Website Progress
        </h3>
        <p className="text-gray-600">
          Create an account to access your customer dashboard and track your website's development.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="create-account"
            checked={createAccount}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="create-account" className="text-sm font-medium">
            Create account now (recommended)
          </Label>
        </div>

        {createAccount ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Choose a password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 6 characters)"
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleCreateAccount}
                disabled={isCreating}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isCreating ? "Creating..." : "Create Account"}
              </Button>
              <Button
                variant="outline"
                onClick={onSkip}
                className="flex-1"
              >
                Skip for now
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={handleSendInvite}
              variant="outline"
              className="flex-1 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Send me instructions
            </Button>
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1"
            >
              Skip for now
            </Button>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 text-center">
        Your dashboard will show your website's progress, customization requests, and more.
      </div>
    </div>
  );
};
