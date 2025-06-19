
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleTest3Step } from '@/components/template8/generator/SimpleTest3Step';
import { SimpleSequentialEditor } from '@/components/template8/editing/SimpleSequentialEditor';
import { AdvancedSequentialEditor } from '@/components/template8/editing/AdvancedSequentialEditor';
import { ProfessionalInlineEditor } from '@/components/template8/editing/ProfessionalInlineEditor';

const Template8Generator: React.FC = () => {
  const { isAdmin } = useAuthContext();
  const [searchParams] = useSearchParams();
  const [generatedData, setGeneratedData] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorMode, setEditorMode] = useState<'simple' | 'advanced' | 'professional'>('simple');

  // Check for Demo Factory mode and pre-loaded data
  useEffect(() => {
    const mode = searchParams.get('mode');
    const source = searchParams.get('source');
    console.log('[Template8Generator] Page loaded with params:', { mode, source });
    console.log('[Template8Generator] Current editor mode:', editorMode);
    
    if (mode === 'advanced' && source === 'demo-factory') {
      console.log('[Template8Generator] Demo Factory mode detected - using Professional Editor');
      console.log('[Template8Generator] URL params:', { mode, source });
      setEditorMode('professional');
      
      // Check for pre-loaded demo data from Demo Factory
      const demoData = sessionStorage.getItem('template8GeneratedData');
      if (demoData) {
        try {
          const parsedData = JSON.parse(demoData);
          console.log('[Template8Generator] Loading Demo Factory data:', parsedData);
          setGeneratedData(parsedData);
          setShowEditor(true);
          
          // Clear the session storage after loading
          sessionStorage.removeItem('template8GeneratedData');
          sessionStorage.removeItem('template8BusinessName');
        } catch (error) {
          console.error('[Template8Generator] Error parsing demo data:', error);
        }
      }
    }
  }, [searchParams]);

  const handleGenerate = (formData: any) => {
    console.log('[Template8Generator] Form data received:', formData);
    
    // Transform form data into Template8Data structure
    const template8Data = {
      // Business Info
      businessName: formData.businessName,
      industry: formData.industry,
      
      // Hero Section
      heroTitle: `Welcome to ${formData.businessName}`,
      heroSubtitle: `Professional ${formData.primaryService} services`,
      heroCtaText: 'Book Appointment',
      heroImageUrl: '',
      
      // Services
      services: [
        {
          id: '1',
          title: formData.primaryService,
          description: `Professional ${formData.primaryService} services`,
          price: '$50', // Default price
          duration: '1 hour'
        }
      ],
      
      // Contact & Booking
      bookingUrl: formData.bookingUrl,
      phone: '',
      email: '',
      address: '',
      businessHours: '',
      
      // Initialize empty sections
      testimonials: [],
      gallery: [],
      socialLinks: {
        instagram: '',
        facebook: '',
        website: ''
      }
    };
    
    console.log('[Template8Generator] Generated template8Data:', template8Data);
    setGeneratedData(template8Data);
    setShowEditor(true);
  };

  const handleUpdate = (updates: any) => {
    console.log('[Template8Generator] Editor updates:', updates);
    setGeneratedData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    console.log('[Template8Generator] Saving generated site:', generatedData);
    // TODO: Implement save to database
    alert('Site saved! (MVP - implement database save)');
  };

  const handleClose = () => {
    setShowEditor(false);
    setGeneratedData(null);
    
    // If coming from Demo Factory, return there
    const source = searchParams.get('source');
    if (source === 'demo-factory') {
      window.location.href = '/admin/demo-factory';
    }
  };

  if (showEditor && generatedData) {
    console.log('[Template8Generator] Rendering editor with mode:', editorMode);
    console.log('[Template8Generator] Generated data:', generatedData);
    
    // Use Professional Editor for Demo Factory mode
    if (editorMode === 'professional') {
      console.log('[Template8Generator] Loading Professional Inline Editor');
      return (
        <ProfessionalInlineEditor
          pageData={generatedData}
          siteData={{
            id: 'new-site',
            business_name: generatedData.businessName,
            lifecycle_stage: 'draft'
          }}
          onUpdate={handleUpdate}
          onSave={handleSave}
          onClose={handleClose}
          isAdmin={isAdmin}
        />
      );
    }
    
    // Use Advanced Editor for advanced mode
    if (editorMode === 'advanced') {
      return (
        <AdvancedSequentialEditor
          pageData={generatedData}
          siteData={{
            id: 'new-site',
            business_name: generatedData.businessName,
            lifecycle_stage: 'draft'
          }}
          onUpdate={handleUpdate}
          onSave={handleSave}
          onClose={handleClose}
          isAdmin={isAdmin}
        />
      );
    }
    
    // Default Simple Editor for regular 3-step flow
    return (
      <SimpleSequentialEditor
        pageData={generatedData}
        siteData={{
          id: 'new-site',
          business_name: generatedData.businessName,
          lifecycle_stage: 'draft'
        }}
        onUpdate={handleUpdate}
        onSave={handleSave}
        onClose={handleClose}
        isAdmin={isAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Create Your Website in 3 Simple Steps
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 px-4">
            Get your professional website up and running in minutes
          </p>
        </div>
        
        <SimpleTest3Step 
          onGenerate={handleGenerate}
          isGenerating={false}
        />
      </div>
    </div>
  );
};

export default Template8Generator;
