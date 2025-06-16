
import React, { useState } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Trash2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ModernCustomerSettings: React.FC = () => {
  const { user, profile } = useAuthContext();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Reset",
      description: "A password reset link has been sent to your email.",
    });
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Account Settings
        </h1>
        <p className="text-slate-600 text-lg">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700">Full Name</Label>
                <Input 
                  id="fullName" 
                  defaultValue={profile?.full_name || user?.email?.split('@')[0] || ''} 
                  placeholder="Enter your full name"
                  className="beautiful-shadow-sm border-slate-200 rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  defaultValue={user?.email || ''} 
                  placeholder="Enter your email"
                  className="beautiful-shadow-sm border-slate-200 rounded-xl h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel"
                placeholder="Enter your phone number"
                className="beautiful-shadow-sm border-slate-200 rounded-xl h-12"
              />
            </div>
            <Button 
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl h-12 px-8 beautiful-shadow"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 beautiful-shadow-sm">
              <div className="space-y-1">
                <Label htmlFor="email-notifications" className="text-sm font-semibold text-slate-800">Email Notifications</Label>
                <p className="text-sm text-slate-600">Receive updates about your website and requests</p>
              </div>
              <Switch 
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator className="border-slate-200" />
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 beautiful-shadow-sm">
              <div className="space-y-1">
                <Label htmlFor="marketing-emails" className="text-sm font-semibold text-slate-800">Marketing Emails</Label>
                <p className="text-sm text-slate-600">Receive tips, updates, and promotional content</p>
              </div>
              <Switch 
                id="marketing-emails"
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-emerald-50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 beautiful-shadow-sm">
              <Label className="text-sm font-semibold text-slate-800">Password</Label>
              <p className="text-sm text-slate-600 mb-3">Last changed 3 months ago</p>
              <Button 
                variant="outline" 
                onClick={handleChangePassword}
                className="border-slate-300 hover:bg-slate-100 rounded-xl h-10"
              >
                Change Password
              </Button>
            </div>
            <Separator className="border-slate-200" />
            <div className="p-4 rounded-xl bg-slate-50 beautiful-shadow-sm">
              <Label className="text-sm font-semibold text-slate-800">Two-Factor Authentication</Label>
              <p className="text-sm text-slate-600 mb-3">Add an extra layer of security to your account</p>
              <Button 
                variant="outline"
                className="border-slate-300 hover:bg-slate-100 rounded-xl h-10"
              >
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="beautiful-shadow border-0 rounded-2xl overflow-hidden border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200">
            <CardTitle className="flex items-center gap-3 text-xl text-red-700">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <Label className="text-sm font-semibold text-red-800">Delete Account</Label>
              <p className="text-sm text-red-600 mb-3">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button 
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 rounded-xl h-10"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernCustomerSettings;
