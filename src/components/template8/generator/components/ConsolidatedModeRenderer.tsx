
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/template8/design-system/components/Button";
import { ArrowLeft, Edit3 } from "lucide-react";
import Template8GeneratorForm from "../Template8GeneratorForm";
import Template8Layout from "../../Template8Layout";
import EnhancedFullScreenEditingFlow from "../../editing/EnhancedFullScreenEditingFlow";
import AdminControls from "../../../admin/AdminControls";
import AdminBanner from "./AdminBanner";
import AdminModeIndicator from "./AdminModeIndicator";
import ErrorBoundary from "./ErrorBoundary";
import { Spinner } from "@/components/template8/design-system/components/Spinner";
import { Card } from "@/components/template8/design-system/components/Card";
import { GeneratorMode, Template8Data } from '../types/GeneratorTypes';

/**
 * Consolidated Mode Renderer
 * Renders the appropriate UI based on the current generator mode
 */
interface ConsolidatedModeRendererProps {
  mode: GeneratorMode;
  generatedData: Partial<Template8Data> | null;
  isGenerating: boolean;
  error: string | null;
  isAdmin: boolean;
  isSavingDemo: boolean;
  isTemplatePreview: boolean;
  onGenerate: (data: any) => void;
  onUpdate: (updates: Partial<Template8Data>) => void;
  onSave: () => Promise<void>;
  onSaveAsDemo: () => Promise<void>;
  onBackToForm: () => void;
  onStartEditing: () => void;
  onCloseEditing: () => void;
  onNavigateToAdmin: () => void;
  onResetToForm: () => void;
}

const ConsolidatedModeRenderer: React.FC<ConsolidatedModeRendererProps> = ({
  mode,
  generatedData,
  isGenerating,
  error,
  isAdmin,
  isSavingDemo,
  isTemplatePreview,
  onGenerate,
  onUpdate,
  onSave,
  onSaveAsDemo,
  onBackToForm,
  onStartEditing,
  onCloseEditing,
  onNavigateToAdmin,
  onResetToForm
}) => {
  return (
    <ErrorBoundary isProductionPreview={isTemplatePreview}>
      <AnimatePresence mode="wait">
        {mode === 'form' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="w-full">
              {/* Admin Header */}
              {isAdmin && (
                <div className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center">
                  <Button
                    onClick={onNavigateToAdmin}
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit3 className="w-4 h-4" />}
                  >
                    Admin Dashboard
                  </Button>
                  <AdminBanner />
                </div>
              )}
              
              <Template8GeneratorForm 
                onGenerate={onGenerate} 
                isGenerating={isGenerating} 
              />
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center max-w-2xl mx-auto"
                >
                  {error}
                </motion.div>
              )}

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 flex justify-center"
                >
                  <Spinner 
                    size="lg" 
                    label="Generating your creative template..." 
                    color="#8B5CF6"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : mode === 'editing' ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EnhancedFullScreenEditingFlow
              pageData={generatedData}
              onUpdate={onUpdate}
              onSave={onSave}
              onClose={onCloseEditing}
              isAdmin={isAdmin}
              onSaveAsDemo={onSaveAsDemo}
              isSavingDemo={isSavingDemo}
              onNavigateToAdmin={onNavigateToAdmin}
            />
          </motion.div>
        ) : (
          <motion.div
            key="template"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {/* Header Controls - only show if not in template preview */}
            {!isTemplatePreview && (
              <div className="fixed top-4 left-4 z-50 flex gap-2">
                <Button
                  onClick={onBackToForm}
                  variant="outline"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back to Form
                </Button>
                
                <Button
                  onClick={onStartEditing}
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit3 className="w-4 h-4" />}
                >
                  Edit
                </Button>
                
                {isAdmin && (
                  <AdminControls
                    onNavigateToAdmin={onNavigateToAdmin}
                    onSaveAsDemo={onSaveAsDemo}
                    isSavingDemo={isSavingDemo}
                  />
                )}
              </div>
            )}

            {/* Admin Mode Indicator - Top Right - only show if not in template preview */}
            {isAdmin && !isTemplatePreview && (
              <div className="fixed top-4 right-4 z-50">
                <AdminModeIndicator
                  onResetToForm={onResetToForm}
                  onNavigateToAdmin={onNavigateToAdmin}
                />
              </div>
            )}

            {/* Loading Overlay */}
            {(isGenerating || isSavingDemo) && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
                <Card variant="glass" elevation="lg" className="p-6">
                  <Spinner 
                    size="lg" 
                    label={isGenerating ? "Generating..." : "Saving demo..."} 
                    color="#8B5CF6"
                  />
                </Card>
              </div>
            )}

            {/* Template8 with generated data */}
            <Template8Layout
              businessName={generatedData?.businessName || "Generated Business"}
              initialData={generatedData}
              isChairLinkedMode={false}
              isProductionPreview={isTemplatePreview}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default ConsolidatedModeRenderer;
