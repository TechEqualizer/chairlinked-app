import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Eye } from 'lucide-react';

interface SimpleEditInterfaceProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
  onClose: () => void;
  siteData?: {
    id: string;
    business_name: string;
    lifecycle_stage: string;
  };
}

export const SimpleEditInterface: React.FC<SimpleEditInterfaceProps> = ({
  pageData,
  onUpdate,
  onSave,
  onClose,
  siteData
}) => {
  const [formData, setFormData] = useState({
    businessName: pageData?.businessName || siteData?.business_name || '',
    heroTitle: pageData?.heroTitle || 'Welcome to Our Business',
    heroSubtitle: pageData?.heroSubtitle || 'Professional services you can trust',
    primaryColor: pageData?.primaryColor || '#8B5CF6',
    businessType: pageData?.businessType || 'business'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave();
      console.log('[SimpleEditInterface] Save successful');
    } catch (error) {
      console.error('[SimpleEditInterface] Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Edit Site Configuration
                </h1>
                <p className="text-sm text-gray-500">
                  {siteData?.business_name} • {siteData?.lifecycle_stage}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  placeholder="Enter business name"
                />
              </div>
              
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Input
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => handleChange('businessType', e.target.value)}
                  placeholder="e.g., photography, beauty, salon"
                />
              </div>
              
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    placeholder="#8B5CF6"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={formData.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  placeholder="Main headline"
                />
              </div>
              
              <div>
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  placeholder="Supporting text or description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Site Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Site ID:</span>
                  <p className="text-gray-900">{siteData?.id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Lifecycle Stage:</span>
                  <p className="text-gray-900 capitalize">{siteData?.lifecycle_stage}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Business Name:</span>
                  <p className="text-gray-900">{siteData?.business_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};