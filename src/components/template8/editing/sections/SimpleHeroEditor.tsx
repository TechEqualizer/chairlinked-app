import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface SimpleHeroEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
}

export const SimpleHeroEditor: React.FC<SimpleHeroEditorProps> = ({
  sectionData,
  onSectionUpdate
}) => {
  const [heroData, setHeroData] = useState({
    heroTitle: sectionData.heroTitle || sectionData.headline || '',
    heroSubtitle: sectionData.heroSubtitle || sectionData.subheadline || '',
    heroCtaText: sectionData.heroCtaText || sectionData.ctaText || 'Get Started',
    heroImageUrl: sectionData.heroImageUrl || sectionData.heroImage || '',
    ...sectionData
  });

  const updateHeroData = (updates: any) => {
    const newData = { ...heroData, ...updates };
    setHeroData(newData);
    onSectionUpdate(newData);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you'd upload to a service like Cloudinary
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      updateHeroData({ heroImageUrl: imageUrl });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          What's your main message?
        </h3>
        <p className="text-gray-600">
          Create a compelling hero section that grabs attention and explains what you do.
        </p>
      </div>

      {/* Hero Content */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-title">Main Headline *</Label>
            <Input
              id="hero-title"
              value={heroData.heroTitle}
              onChange={(e) => updateHeroData({ heroTitle: e.target.value })}
              placeholder="e.g., Professional Hair Styling That Makes You Feel Amazing"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              value={heroData.heroSubtitle}
              onChange={(e) => updateHeroData({ heroSubtitle: e.target.value })}
              placeholder="A brief description of what makes your service special..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hero-cta">Call-to-Action Button Text</Label>
            <Input
              id="hero-cta"
              value={heroData.heroCtaText}
              onChange={(e) => updateHeroData({ heroCtaText: e.target.value })}
              placeholder="Book Now, Get Started, etc."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Hero Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-image">Image URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="hero-image"
                value={heroData.heroImageUrl}
                onChange={(e) => updateHeroData({ heroImageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="flex-1"
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Use a high-quality image that represents your work
            </p>
          </div>

          {heroData.heroImageUrl && (
            <div className="mt-4">
              <Label>Preview</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <img
                  src={heroData.heroImageUrl}
                  alt="Hero preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {heroData.heroTitle && (
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">Hero Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-6 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {heroData.heroTitle}
              </h1>
              {heroData.heroSubtitle && (
                <p className="text-lg text-gray-600 mb-6">
                  {heroData.heroSubtitle}
                </p>
              )}
              <Button className="bg-purple-600 hover:bg-purple-700">
                {heroData.heroCtaText}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600">💡</div>
          <div>
            <h4 className="font-medium text-blue-900">Hero Section Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Keep your headline clear and benefit-focused</li>
              <li>• Use high-quality images that showcase your work</li>
              <li>• Make your call-to-action specific and actionable</li>
              <li>• Test different versions to see what works best</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};