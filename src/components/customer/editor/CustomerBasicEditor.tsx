
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CustomerBasicEditorProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export const CustomerBasicEditor: React.FC<CustomerBasicEditorProps> = ({
  data,
  onUpdate
}) => {
  const handleInputChange = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleSocialProofChange = (field: string, value: string) => {
    const socialProof = data?.socialProof || {};
    onUpdate({
      socialProof: {
        ...socialProof,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Content</h3>
        <p className="text-sm text-gray-600 mb-6">Edit your main website content and messaging</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={data?.businessName || ''}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Your Business Name"
            />
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <Label htmlFor="headline">Main Headline</Label>
            <Textarea
              id="headline"
              value={data?.headline || ''}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              placeholder="Welcome to [Your Business Name]"
              rows={2}
            />
            <p className="text-xs text-gray-500">This is the first thing visitors see</p>
          </div>

          {/* Description/Subheadline */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data?.description || data?.subheadline || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what you do and what makes you special..."
              rows={3}
            />
          </div>

          {/* Call-to-Action Button */}
          <div className="space-y-2">
            <Label htmlFor="ctaText">Call-to-Action Button Text</Label>
            <Input
              id="ctaText"
              value={data?.ctaText || ''}
              onChange={(e) => handleInputChange('ctaText', e.target.value)}
              placeholder="Book Now"
            />
          </div>
        </div>
      </Card>

      {/* Social Proof Section */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Social Proof</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Years of Experience</Label>
            <Input
              id="yearsExperience"
              value={data?.socialProof?.yearsExperience || ''}
              onChange={(e) => handleSocialProofChange('yearsExperience', e.target.value)}
              placeholder="5+"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientsServed">Happy Clients</Label>
            <Input
              id="clientsServed"
              value={data?.socialProof?.clientsServed || ''}
              onChange={(e) => handleSocialProofChange('clientsServed', e.target.value)}
              placeholder="500+"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Input
              id="rating"
              value={data?.socialProof?.rating || ''}
              onChange={(e) => handleSocialProofChange('rating', e.target.value)}
              placeholder="4.9/5"
            />
          </div>
        </div>
      </Card>

      {/* SEO Section */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">SEO & Meta Information</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Page Title (SEO)</Label>
            <Input
              id="metaTitle"
              value={data?.metaTitle || `${data?.businessName || 'Business'} - Professional Services`}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              placeholder="Professional Beauty Services | Your Business Name"
            />
            <p className="text-xs text-gray-500">Appears in search results and browser tabs</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
            <Textarea
              id="metaDescription"
              value={data?.metaDescription || ''}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              placeholder="Professional beauty services with expert stylists. Book your appointment today!"
              rows={2}
              maxLength={160}
            />
            <p className="text-xs text-gray-500">Brief description for search engines (160 characters max)</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
