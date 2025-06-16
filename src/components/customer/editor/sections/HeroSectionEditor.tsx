
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SimpleEditorData } from '@/hooks/useSimpleCustomerEditor';
import { ImageUploadField } from '@/components/ui/ImageUploadField';

interface HeroSectionEditorProps {
  data: SimpleEditorData;
  onUpdateField: (field: keyof SimpleEditorData, value: string) => void;
}

export const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({
  data,
  onUpdateField,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🎯 Hero Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input
              id="business-name"
              value={data.businessName}
              onChange={(e) => onUpdateField('businessName', e.target.value)}
              placeholder="Your Business Name"
            />
          </div>

          {/* Logo Upload */}
          <ImageUploadField
            label="Business Logo"
            value={data.logoUrl || ''}
            onChange={(url) => onUpdateField('logoUrl', url)}
            placeholder="Enter logo URL or upload logo file"
            aspectRatio="aspect-[3/1]"
            showPreview={true}
          />

          {/* Hero Background Image */}
          <ImageUploadField
            label="Hero Background Image"
            value={data.heroImageUrl || ''}
            onChange={(url) => onUpdateField('heroImageUrl', url)}
            placeholder="Enter hero image URL or upload background image"
            aspectRatio="aspect-video"
            showPreview={true}
          />

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={data.tagline}
              onChange={(e) => onUpdateField('tagline', e.target.value)}
              placeholder="Your business tagline"
            />
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <Label htmlFor="headline">Main Headline</Label>
            <Input
              id="headline"
              value={data.headline}
              onChange={(e) => onUpdateField('headline', e.target.value)}
              placeholder="Compelling main headline"
            />
          </div>

          {/* Subheadline */}
          <div className="space-y-2">
            <Label htmlFor="subheadline">Subheadline</Label>
            <Input
              id="subheadline"
              value={data.subheadline}
              onChange={(e) => onUpdateField('subheadline', e.target.value)}
              placeholder="Supporting subheadline"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => onUpdateField('description', e.target.value)}
              placeholder="Brief description of your business"
              rows={3}
            />
          </div>

          {/* CTA Text */}
          <div className="space-y-2">
            <Label htmlFor="cta-text">Call-to-Action Button Text</Label>
            <Input
              id="cta-text"
              value={data.ctaText}
              onChange={(e) => onUpdateField('ctaText', e.target.value)}
              placeholder="e.g., Get Started, Book Now"
            />
          </div>

          {/* Brand Color Picker */}
          <div className="space-y-2">
            <Label htmlFor="primary-color">Brand Color</Label>
            <div className="flex items-center gap-3">
              <input
                id="primary-color"
                type="color"
                value={data.primaryColor}
                onChange={(e) => onUpdateField('primaryColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                value={data.primaryColor}
                onChange={(e) => onUpdateField('primaryColor', e.target.value)}
                placeholder="#6B46C1"
                className="flex-1 font-mono"
              />
            </div>
            <p className="text-xs text-gray-500">
              This color will be used throughout your website for buttons, accents, and branding
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
