import React from 'react';
import { useTemplate8Generator } from '@/hooks/useTemplate8Generator';
import { SimpleTest3Step } from '@/components/template8/generator/SimpleTest3Step';
import { ProfessionalInlineEditor } from '@/components/template8/editing/ProfessionalInlineEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

const Template8Generator: React.FC = () => {
  const {
    mode,
    generatedData,
    isEditingExistingDemo,
    hasRecoveredSession,
    showRecoveryMessage,
    handleGenerate,
    handleStartEditing,
    handleUpdate,
    handleDismissRecoveryMessage,
    getSessionDebugInfo
  } = useTemplate8Generator();

  // Simple recovery handlers
  const handleRecoveryConfirm = () => {
    console.log('[Template8Generator] Recovery confirmed');
    handleDismissRecoveryMessage();
  };

  const handleRecoveryDiscard = () => {
    console.log('[Template8Generator] Recovery discarded');
    handleDismissRecoveryMessage();
  };

  console.log('[Template8Generator] Render state:', {
    mode,
    hasGeneratedData: !!generatedData,
    isEditingExistingDemo,
    hasRecoveredSession,
    showRecoveryMessage,
    debugInfo: getSessionDebugInfo ? getSessionDebugInfo() : 'no debug info'
  });

  // If we have recovered data or are in template mode, show the editor
  if (mode === 'template' && generatedData) {
    console.log('[Template8Generator] Rendering editor with data:', {
      businessName: generatedData.businessName,
      tagline: generatedData.tagline,
      heroTitle: generatedData.heroTitle,
      heroSubtitle: generatedData.heroSubtitle,
      dataKeys: Object.keys(generatedData)
    });
    return (
      <ProfessionalInlineEditor
        pageData={generatedData}
        siteData={{
          id: generatedData._demoId || 'new-site',
          business_name: generatedData.businessName || 'New Business',
          lifecycle_stage: 'draft'
        }}
        onUpdate={(newData) => {
          console.log('🎨 [Template8Generator] Editor data received:', {
            isFullData: !!newData.businessName,
            businessName: newData.businessName,
            tagline: newData.tagline,
            heroTitle: newData.heroTitle,
            keys: Object.keys(newData),
            _testSync: newData._testSync,
            _immediateUpdate: newData._immediateUpdate,
            dataSize: JSON.stringify(newData).length
          });
          
          // The editor sends the complete data object, so we use it directly
          if (newData && typeof newData === 'object') {
            console.log('🔄 [Template8Generator] About to call handleUpdate with:', {
              businessName: newData.businessName,
              tagline: newData.tagline,
              heroTitle: newData.heroTitle,
              beforeUpdate: {
                businessName: generatedData?.businessName,
                tagline: generatedData?.tagline,
                heroTitle: generatedData?.heroTitle
              },
              _testSync: newData._testSync
            });
            
            // Update the generated data directly with the new complete data
            handleUpdate(newData);
            
            console.log('✅ [Template8Generator] Called handleUpdate - data should be updated in state');
            console.log('🔍 [Template8Generator] Current generatedData after update:', {
              businessName: generatedData?.businessName,
              tagline: generatedData?.tagline,
              heroTitle: generatedData?.heroTitle
            });
          }
        }}
        onSave={async () => {
          console.log('[Template8Generator] Save triggered');
          return Promise.resolve();
        }}
        onClose={() => {
          console.log('[Template8Generator] Editor closed');
          window.location.href = '/admin';
        }}
        isAdmin={true}
        onSaveSuccessNavigate={() => {
          console.log('[Template8Generator] Save success - navigating to admin');
          window.location.href = '/admin';
        }}
      />
    );
  }

  // Show recovery message if available
  if (showRecoveryMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              Session Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We found a previous editing session. Would you like to continue where you left off?
            </p>
            <div className="flex gap-2">
              <Button onClick={handleRecoveryConfirm} className="flex-1">
                Continue Editing
              </Button>
              <Button 
                onClick={handleRecoveryDiscard} 
                variant="outline"
                className="flex-1"
              >
                Start Fresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show generator form for new sites
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
              onClick={handleStartEditing}
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