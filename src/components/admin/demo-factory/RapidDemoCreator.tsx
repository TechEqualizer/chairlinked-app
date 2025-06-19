import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Palette, 
  Image, 
  Type, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Target,
  Wand2,
  Crown,
  Gem,
  Scissors,
  Camera,
  Dumbbell,
  Users
} from 'lucide-react';

interface RapidDemoCreatorProps {
  onCreateDemo: (demoConfig: any) => void;
  onPreview: (config: any) => void;
}

// Industry Templates with Template8 configurations
const INDUSTRY_TEMPLATES = [
  {
    id: 'hair-luxury',
    category: 'Hair Salons',
    name: 'Luxury Hair Studio',
    icon: Crown,
    description: 'Premium salon with luxury branding',
    conversionRate: '24%',
    template8Config: {
      industry: 'Hair Salon',
      visualStyle: 'luxury',
      brandColors: {
        primary: '#D4AF37',
        secondary: '#000000',
        accent: '#F5F5DC'
      },
      typography: 'elegant',
      heroStyle: 'split-luxury',
      serviceStyle: 'premium-cards'
    },
    sampleContent: {
      businessName: 'Bella Luxury Studio',
      heroTitle: 'Transform Your Look with Luxury Hair Services',
      heroSubtitle: 'Experience premium hair styling in an elegant atmosphere',
      services: [
        { title: 'Luxury Color Treatment', price: '$120', duration: '2 hours' },
        { title: 'Premium Cut & Style', price: '$85', duration: '1.5 hours' },
        { title: 'Hair Extensions', price: '$200', duration: '3 hours' }
      ]
    }
  },
  {
    id: 'hair-modern',
    category: 'Hair Salons',
    name: 'Modern Urban Salon',
    icon: Scissors,
    description: 'Contemporary styling with urban edge',
    conversionRate: '19%',
    template8Config: {
      industry: 'Hair Salon',
      visualStyle: 'modern',
      brandColors: {
        primary: '#2D3748',
        secondary: '#ED8936',
        accent: '#F7FAFC'
      },
      typography: 'modern',
      heroStyle: 'centered-bold',
      serviceStyle: 'grid-modern'
    },
    sampleContent: {
      businessName: 'Urban Edge Salon',
      heroTitle: 'Bold Styles for Bold People',
      heroSubtitle: 'Contemporary cuts and colors that make a statement',
      services: [
        { title: 'Signature Cut', price: '$65', duration: '1 hour' },
        { title: 'Creative Color', price: '$95', duration: '2 hours' },
        { title: 'Style & Finish', price: '$35', duration: '30 min' }
      ]
    }
  },
  {
    id: 'beauty-spa',
    category: 'Beauty & Makeup',
    name: 'Luxury Beauty Spa',
    icon: Gem,
    description: 'High-end beauty treatments',
    conversionRate: '22%',
    template8Config: {
      industry: 'Beauty Spa',
      visualStyle: 'luxury',
      brandColors: {
        primary: '#E53E3E',
        secondary: '#FED7E2',
        accent: '#FFFFFF'
      },
      typography: 'elegant',
      heroStyle: 'overlay-elegant',
      serviceStyle: 'spa-premium'
    },
    sampleContent: {
      businessName: 'Radiant Beauty Spa',
      heroTitle: 'Reveal Your Natural Radiance',
      heroSubtitle: 'Luxury beauty treatments that transform and rejuvenate',
      services: [
        { title: 'Luxury Facial', price: '$150', duration: '1.5 hours' },
        { title: 'Professional Makeup', price: '$85', duration: '1 hour' },
        { title: 'Eyebrow Sculpting', price: '$45', duration: '45 min' }
      ]
    }
  },
  {
    id: 'photography-pro',
    category: 'Photography',
    name: 'Professional Portrait Studio',
    icon: Camera,
    description: 'High-end portrait photography',
    conversionRate: '18%',
    template8Config: {
      industry: 'Photography',
      visualStyle: 'artistic',
      brandColors: {
        primary: '#1A202C',
        secondary: '#A0AEC0',
        accent: '#EDF2F7'
      },
      typography: 'clean',
      heroStyle: 'gallery-showcase',
      serviceStyle: 'portfolio-grid'
    },
    sampleContent: {
      businessName: 'Artisan Portrait Studio',
      heroTitle: 'Capturing Life\'s Beautiful Moments',
      heroSubtitle: 'Professional photography that tells your unique story',
      services: [
        { title: 'Portrait Session', price: '$250', duration: '2 hours' },
        { title: 'Family Photography', price: '$350', duration: '2.5 hours' },
        { title: 'Professional Headshots', price: '$180', duration: '1 hour' }
      ]
    }
  },
  {
    id: 'fitness-boutique',
    category: 'Fitness & Wellness',
    name: 'Boutique Fitness Studio',
    icon: Dumbbell,
    description: 'Premium personal training',
    conversionRate: '16%',
    template8Config: {
      industry: 'Fitness',
      visualStyle: 'energetic',
      brandColors: {
        primary: '#38A169',
        secondary: '#68D391',
        accent: '#F0FFF4'
      },
      typography: 'bold',
      heroStyle: 'action-hero',
      serviceStyle: 'training-cards'
    },
    sampleContent: {
      businessName: 'Elite Fitness Studio',
      heroTitle: 'Transform Your Body, Transform Your Life',
      heroSubtitle: 'Personal training that delivers real results',
      services: [
        { title: 'Personal Training', price: '$75', duration: '1 hour' },
        { title: 'Group Classes', price: '$25', duration: '45 min' },
        { title: 'Nutrition Coaching', price: '$60', duration: '1 hour' }
      ]
    }
  }
];

const VISUAL_STYLE_PRESETS = [
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Premium, elegant design',
    colors: ['#D4AF37', '#000000', '#F5F5DC'],
    icon: Crown
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary style',
    colors: ['#2D3748', '#ED8936', '#F7FAFC'],
    icon: Zap
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple, clean design',
    colors: ['#1A202C', '#A0AEC0', '#FFFFFF'],
    icon: Type
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Vibrant, energetic style',
    colors: ['#E53E3E', '#FED7E2', '#FFF5F5'],
    icon: Sparkles
  }
];

export const RapidDemoCreator: React.FC<RapidDemoCreatorProps> = ({
  onCreateDemo,
  onPreview
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [customization, setCustomization] = useState({
    businessName: '',
    heroTitle: '',
    heroSubtitle: '',
    primaryColor: '',
    secondaryColor: ''
  });
  const [step, setStep] = useState<'template' | 'style' | 'customize' | 'preview'>('template');

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setCustomization({
      businessName: template.sampleContent.businessName,
      heroTitle: template.sampleContent.heroTitle,
      heroSubtitle: template.sampleContent.heroSubtitle,
      primaryColor: template.template8Config.brandColors.primary,
      secondaryColor: template.template8Config.brandColors.secondary
    });
    setStep('style');
  };

  const handleStyleSelect = (style: any) => {
    setSelectedStyle(style);
    setStep('customize');
  };

  const handleCreateDemo = () => {
    const demoConfig = {
      template: selectedTemplate,
      style: selectedStyle,
      customization,
      template8Data: {
        // Core business info
        businessName: customization.businessName,
        industry: selectedTemplate.template8Config.industry,
        
        // Hero section
        heroTitle: customization.heroTitle,
        heroSubtitle: customization.heroSubtitle,
        heroCtaText: 'Book Now',
        heroImageUrl: '',
        
        // Services from template
        services: selectedTemplate.sampleContent.services,
        
        // Branding
        brandColor: customization.primaryColor,
        secondaryColor: customization.secondaryColor,
        visualStyle: selectedTemplate.template8Config.visualStyle,
        
        // Template8 configuration
        ...selectedTemplate.template8Config,
        
        // Demo metadata
        _demoMetadata: {
          templateId: selectedTemplate.id,
          styleId: selectedStyle?.id,
          createdAt: new Date().toISOString(),
          createdBy: 'demo-factory'
        }
      }
    };
    
    onCreateDemo(demoConfig);
  };

  const handlePreview = () => {
    const previewConfig = {
      businessName: customization.businessName,
      heroTitle: customization.heroTitle,
      heroSubtitle: customization.heroSubtitle,
      services: selectedTemplate.sampleContent.services,
      brandColor: customization.primaryColor,
      ...selectedTemplate.template8Config
    };
    
    onPreview(previewConfig);
  };

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Industry Template</h2>
        <p className="text-gray-600">Choose a high-converting Template8 configuration</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDUSTRY_TEMPLATES.map((template) => (
          <Card 
            key={template.id} 
            className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
            onClick={() => handleTemplateSelect(template)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <template.icon className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {template.conversionRate} convert
                </Badge>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{template.category}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStyleSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Visual Style</h2>
        <p className="text-gray-600">Select the design theme for {selectedTemplate?.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {VISUAL_STYLE_PRESETS.map((style) => (
          <Card 
            key={style.id}
            className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
            onClick={() => handleStyleSelect(style)}
          >
            <CardContent className="p-4">
              <div className="text-center">
                <div className="p-3 bg-gray-50 rounded-lg mb-3 mx-auto w-fit">
                  <style.icon className="w-6 h-6 text-gray-600" />
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{style.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{style.description}</p>
                
                <div className="flex justify-center gap-1">
                  {style.colors.map((color, index) => (
                    <div 
                      key={index}
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={() => setStep('template')}>
          Back to Templates
        </Button>
      </div>
    </div>
  );

  const renderCustomization = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Demo Content</h2>
        <p className="text-gray-600">Fine-tune the content for {selectedTemplate?.name}</p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={customization.businessName}
                onChange={(e) => setCustomization(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Enter business name"
              />
            </div>
            
            <div>
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={customization.heroTitle}
                onChange={(e) => setCustomization(prev => ({ ...prev, heroTitle: e.target.value }))}
                placeholder="Main headline"
              />
            </div>
            
            <div>
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={customization.heroSubtitle}
                onChange={(e) => setCustomization(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                placeholder="Supporting description"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Brand Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={customization.primaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={customization.primaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={customization.secondaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={customization.secondaryColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={() => setStep('style')}>
          Back to Styles
        </Button>
        <Button onClick={handlePreview} variant="outline">
          <Target className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button onClick={handleCreateDemo} className="bg-blue-600 hover:bg-blue-700">
          <Wand2 className="w-4 h-4 mr-2" />
          Create Demo
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Zap className="w-8 h-8 text-blue-600" />
            Rapid Demo Creator
          </h1>
          <p className="text-gray-600 mt-2">
            Create professional Template8 demos in minutes
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'template' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
            }`}>
              1
            </div>
            <div className="w-16 h-1 bg-gray-200">
              <div className={`h-full bg-blue-600 transition-all ${
                step !== 'template' ? 'w-full' : 'w-0'
              }`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'style' ? 'bg-blue-600 text-white' : 
              step === 'customize' || step === 'preview' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <div className="w-16 h-1 bg-gray-200">
              <div className={`h-full bg-blue-600 transition-all ${
                step === 'customize' || step === 'preview' ? 'w-full' : 'w-0'
              }`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'customize' || step === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Content */}
        {step === 'template' && renderTemplateSelection()}
        {step === 'style' && renderStyleSelection()}
        {step === 'customize' && renderCustomization()}
      </div>
    </div>
  );
};