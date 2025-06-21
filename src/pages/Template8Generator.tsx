
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleTest3Step } from '@/components/template8/generator/SimpleTest3Step';
import { SimpleSequentialEditor } from '@/components/template8/editing/SimpleSequentialEditor';
import { AdvancedSequentialEditor } from '@/components/template8/editing/AdvancedSequentialEditor';
import { ProfessionalInlineEditor } from '@/components/template8/editing/ProfessionalInlineEditor';

const Template8Generator: React.FC = () => {
  const { isAdmin } = useAuthContext();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [generatedData, setGeneratedData] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorMode, setEditorMode] = useState<'simple' | 'advanced' | 'professional'>('simple');

  // Check for direct editor access or Demo Factory mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    const source = searchParams.get('source');
    const skipForm = searchParams.get('skip-form');
    const directEdit = searchParams.get('edit');
    const isDirectEditorRoute = location.pathname === '/editor';
    
    console.log('[Template8Generator] Page loaded with params:', { mode, source, skipForm, directEdit, pathname: location.pathname });
    console.log('[Template8Generator] Current editor mode:', editorMode);
    
    // Allow direct access to editor without form
    if (skipForm === 'true' || directEdit === 'true' || mode === 'edit' || isDirectEditorRoute) {
      console.log('[Template8Generator] Direct editor access detected');
      setEditorMode('professional');
      
      // Create minimal data structure for new site
      const minimalData = {
        businessName: 'New Business',
        industry: 'Beauty & Wellness',
        heroTitle: 'Welcome to Your Business',
        heroSubtitle: 'Professional services for your needs',
        heroCtaText: 'Book Appointment',
        heroImageUrl: '',
        services: [{
          id: '1',
          title: 'Service 1',
          description: 'Professional service description',
          price: '$50',
          duration: '1 hour'
        }],
        bookingUrl: '',
        phone: '',
        email: '',
        address: '',
        businessHours: '',
        testimonials: [],
        gallery: [],
        socialLinks: {
          instagram: '',
          facebook: '',
          website: ''
        }
      };
      
      setGeneratedData(minimalData);
      setShowEditor(true);
      return;
    }
    
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
  }, [searchParams, location.pathname]);

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
    console.log('[Template8Generator] Auto-saving site data:', generatedData);
    // Auto-save is handled by session/local storage - no disruptive alerts needed
    // Manual saves from the bottom toolbar will show appropriate feedback
    return Promise.resolve();
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

  // Create Demo Factory specific navigation function for save button
  const handleDemoFactorySaveNavigation = () => {
    const source = searchParams.get('source');
    if (source === 'demo-factory') {
      console.log('[Template8Generator] Navigating back to Demo Factory after save');
      window.location.href = '/admin/demo-factory';
    } else {
      // Default admin navigation for non-Demo Factory saves
      window.location.href = '/admin';
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
          onSaveSuccessNavigate={handleDemoFactorySaveNavigation}
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

  const handleSkipToEditor = () => {
    console.log('[Template8Generator] Skipping to editor');
    setEditorMode('professional');
    
    // Create minimal data structure for new site
    const minimalData = {
      businessName: 'New Business',
      industry: 'Beauty & Wellness',
      heroTitle: 'Welcome to Your Business',
      heroSubtitle: 'Professional services for your needs',
      heroCtaText: 'Book Appointment',
      heroImageUrl: '',
      services: [{
        id: '1',
        title: 'Service 1',
        description: 'Professional service description',
        price: '$50',
        duration: '1 hour'
      }],
      bookingUrl: '',
      phone: '',
      email: '',
      address: '',
      businessHours: '',
      testimonials: [],
      gallery: [],
      socialLinks: {
        instagram: '',
        facebook: '',
        website: ''
      }
    };
    
    setGeneratedData(minimalData);
    setShowEditor(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Create Your Website in 3 Simple Steps
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 px-4 mb-4">
            Get your professional website up and running in minutes
          </p>
          
          {/* Skip to Editor Button */}
          <div className="mb-6">
            <Button 
              onClick={handleSkipToEditor}
              variant="outline"
              className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-medium px-6 py-2"
            >
              Skip Form - Go Directly to Editor
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              For experienced users who want to start editing immediately
            </p>
          </div>
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
