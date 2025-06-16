import React from 'react';
import { useTemplate8Generator } from '@/hooks/useTemplate8Generator';
import ConsolidatedModeRenderer from './components/ConsolidatedModeRenderer';
import { TemplateSelector } from './components/TemplateSelector';
import UniversalErrorBoundary from '@/components/common/UniversalErrorBoundary';
import MobileOptimizationNotice from '@/components/common/MobileOptimizationNotice';
import HelpDocumentation from '@/components/common/HelpDocumentation';
import { PerformanceMonitor, PerformanceTracker } from '@/components/common/PerformanceMonitor';

/**
 * Consolidated Template8 Generator Layout
 * Combines all previous layout functionality into a single, clean component
 */
const Template8GeneratorLayout: React.FC = () => {
  // Track performance for the generator initialization
  React.useEffect(() => {
    PerformanceTracker.startTimer('generator-init');
    return () => {
      PerformanceTracker.endTimer('generator-init');
    };
  }, []);

  const {
    // State
    mode,
    generatedData,
    isGenerating,
    error,
    isSavingDemo,
    showTemplateSelector,
    isTemplatePreview,
    isAdmin,
    showRecoveryMessage,
    
    // Actions
    handleGenerate,
    handleSelectTemplate,
    handleSkipTemplate,
    handleUpdate,
    handleSave,
    handleSaveAsDemo,
    handleBackToForm,
    handleStartEditing,
    handleCloseEditing,
    handleNavigateToAdmin,
    handleResetToForm,
    handleDismissRecoveryMessage
  } = useTemplate8Generator();

  return (
    <PerformanceMonitor>
      <UniversalErrorBoundary context="Template8 Generator">
        <div className="min-h-screen bg-gray-50">
          <MobileOptimizationNotice />
          
          {/* Session Recovery Message */}
          {showRecoveryMessage && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-2">Session Restored</h3>
                <p className="text-gray-600 mb-4">
                  Your previous editing session has been recovered. You can continue where you left off.
                </p>
                <button
                  onClick={handleDismissRecoveryMessage}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          {showTemplateSelector && !isTemplatePreview ? (
            <UniversalErrorBoundary context="Template Selector">
              <TemplateSelector
                onSelectTemplate={handleSelectTemplate}
                onSkipTemplate={handleSkipTemplate}
              />
            </UniversalErrorBoundary>
          ) : (
            <UniversalErrorBoundary context="Generator Mode Renderer">
              <ConsolidatedModeRenderer
                mode={mode}
                generatedData={generatedData}
                isGenerating={isGenerating}
                error={error}
                isAdmin={isAdmin}
                isSavingDemo={isSavingDemo}
                isTemplatePreview={isTemplatePreview}
                onGenerate={handleGenerate}
                onUpdate={handleUpdate}
                onSave={handleSave}
                onSaveAsDemo={handleSaveAsDemo}
                onBackToForm={handleBackToForm}
                onStartEditing={handleStartEditing}
                onCloseEditing={handleCloseEditing}
                onNavigateToAdmin={handleNavigateToAdmin}
                onResetToForm={handleResetToForm}
              />
            </UniversalErrorBoundary>
          )}

          <HelpDocumentation />
        </div>
      </UniversalErrorBoundary>
    </PerformanceMonitor>
  );
};

export default Template8GeneratorLayout;
