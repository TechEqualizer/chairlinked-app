import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle, Save, Eye, ExternalLink, Settings, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChairLinkedRenderer from '@/components/chairlinked/ChairLinkedRenderer';
import { AdvancedSequentialEditor } from './AdvancedSequentialEditor';

// Import simplified section editors
import { SimpleHeroEditor } from './sections/SimpleHeroEditor';
import { SimpleServicesEditor } from './sections/SimpleServicesEditor';
import { SimpleTestimonialsEditor } from './sections/SimpleTestimonialsEditor';
import { SimpleGalleryEditor } from './sections/SimpleGalleryEditor';
import { SimpleBookingEditor } from './sections/SimpleBookingEditor';

interface SimpleSequentialEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
  onClose: () => void;
  isAdmin?: boolean;
  siteData?: {
    id: string;
    business_name: string;
    lifecycle_stage: string;
  };
}

interface EditorSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: React.ComponentType<any>;
  isCompleted?: boolean;
}

const EDITOR_SECTIONS: EditorSection[] = [
  {
    id: 'hero',
    title: 'Hero Section',
    description: 'Main headline, subheadline, and hero image',
    icon: '🎯',
    component: SimpleHeroEditor
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Your main services and offerings',
    icon: '💼',
    component: SimpleServicesEditor
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    description: 'Customer reviews and social proof',
    icon: '💬',
    component: SimpleTestimonialsEditor
  },
  {
    id: 'gallery',
    title: 'Gallery',
    description: 'Showcase your work with images',
    icon: '🖼️',
    component: SimpleGalleryEditor
  },
  {
    id: 'booking',
    title: 'Booking & Contact',
    description: 'Contact information and booking link',
    icon: '📅',
    component: SimpleBookingEditor
  }
];

export const SimpleSequentialEditor: React.FC<SimpleSequentialEditorProps> = ({
  pageData,
  onUpdate,
  onSave,
  onClose,
  isAdmin = false,
  siteData
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionData, setSectionData] = useState(pageData || {});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingMode, setEditingMode] = useState<'mvp' | 'advanced'>('mvp');

  const currentSection = EDITOR_SECTIONS[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === EDITOR_SECTIONS.length - 1;
  const progressPercentage = ((currentSectionIndex + 1) / EDITOR_SECTIONS.length) * 100;

  // Auto-save when section data changes
  useEffect(() => {
    onUpdate(sectionData);
  }, [sectionData, onUpdate]);

  const handleSectionUpdate = (updates: any) => {
    setSectionData(prev => ({ ...prev, ...updates }));
    // Mark section as completed if it has required content
    if (hasRequiredContent(currentSection.id, updates)) {
      setCompletedSections(prev => new Set([...prev, currentSection.id]));
    }
  };

  const hasRequiredContent = (sectionId: string, data: any): boolean => {
    switch (sectionId) {
      case 'hero':
        return !!(data.heroTitle || data.headline);
      case 'services':
        return !!(data.services && data.services.length > 0 && data.services[0].title);
      case 'testimonials':
        return !!(data.testimonials && data.testimonials.length > 0 && data.testimonials[0].name && data.testimonials[0].text);
      case 'gallery':
        return !!(data.gallery && data.gallery.images && data.gallery.images.length > 0 && data.gallery.images[0].url);
      case 'booking':
        return !!(data.bookingUrl || data.phone || data.email);
      default:
        return true;
    }
  };

  const goToNextSection = () => {
    if (!isLastSection) {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const goToPreviousSection = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave();
        onClose();
      } catch (error) {
        console.error('Save failed:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      onClose();
    }
  };

  const CurrentSectionComponent = currentSection.component;

  // Render Advanced Editor if in advanced mode
  if (editingMode === 'advanced') {
    return (
      <AdvancedSequentialEditor
        pageData={sectionData}
        onUpdate={onUpdate}
        onSave={onSave}
        onClose={onClose}
        isAdmin={isAdmin}
        siteData={siteData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with progress */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="flex items-center gap-1 sm:gap-2 p-2 sm:px-3"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Editor</span>
                <span className="sm:hidden">Exit</span>
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  <span className="hidden sm:inline">Edit Your Website</span>
                  <span className="sm:hidden">Edit Site</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  <span className="hidden sm:inline">{siteData?.business_name} • </span>
                  Step {currentSectionIndex + 1} of {EDITOR_SECTIONS.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setEditingMode('mvp')}
                  className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm transition-all ${
                    editingMode === 'mvp'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  <span className="hidden sm:inline">MVP</span>
                </button>
                <button
                  onClick={() => setEditingMode('advanced')}
                  className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm transition-all ${
                    editingMode === 'advanced'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  <span className="hidden sm:inline">Pro</span>
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1 sm:gap-2"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview Site</span>
                <span className="sm:hidden">Preview</span>
              </Button>
              <span className="text-xs sm:text-sm text-gray-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Section selector sidebar - hidden on mobile, shows as tabs on mobile */}
        <div className="hidden lg:block lg:w-80 bg-white border-r p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Editing Sections
          </h3>
          <div className="space-y-3">
            {EDITOR_SECTIONS.map((section, index) => (
              <Card 
                key={section.id}
                className={`cursor-pointer transition-all ${
                  index === currentSectionIndex 
                    ? 'ring-2 ring-purple-500 bg-purple-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setCurrentSectionIndex(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{section.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{section.title}</h4>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                    {completedSections.has(section.id) && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mobile section tabs */}
        <div className="lg:hidden bg-white border-b p-4">
          <div className="flex gap-2 overflow-x-auto">
            {EDITOR_SECTIONS.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSectionIndex(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                  index === currentSectionIndex
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-sm">{section.icon}</span>
                <span className="text-sm font-medium">{section.title}</span>
                {completedSections.has(section.id) && (
                  <CheckCircle className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Current section editor */}
        <div className="flex-1 p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl">{currentSection.icon}</span>
                  {currentSection.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-2">{currentSection.description}</p>
              </div>

              {/* Section editor component */}
              <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 min-h-[400px] sm:min-h-[600px]">
                <CurrentSectionComponent
                  sectionData={sectionData}
                  onSectionUpdate={handleSectionUpdate}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="bg-white border-t p-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={goToPreviousSection}
            disabled={isFirstSection}
            className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Section</span>
            <span className="sm:hidden">Previous</span>
          </Button>

          <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            {!isLastSection ? (
              <Button
                onClick={goToNextSection}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <span className="hidden sm:inline">Next Section</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Finish & Save'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Template8 Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full h-full flex flex-col">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white rounded-t-lg">
              <h3 className="text-base sm:text-lg font-semibold">Template8 Site Preview</h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // For MVP, we'll show a simple preview. In production, this would open the actual site
                    window.open('/mvp-preview-placeholder', '_blank');
                  }}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Open in New Tab</span>
                  <span className="sm:hidden">Open</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden bg-gray-100">
              {/* Preview container with responsive scaling */}
              <div className="h-full overflow-auto">
                <div className="min-h-full bg-white preview-scale">
                  <ChairLinkedRenderer 
                    config={sectionData}
                    logoUrl={sectionData.logoUrl}
                    isProductionPreview={true}
                    siteType="demo"
                    readOnly={true}
                  />
                </div>
              </div>
              <style>{`
                .preview-scale {
                  transform: scale(0.7);
                  transform-origin: top left;
                  width: 142.857%;
                  height: 142.857%;
                }
                @media (max-width: 768px) {
                  .preview-scale {
                    transform: scale(0.5);
                    width: 200%;
                    height: 200%;
                  }
                }
                @media (max-width: 480px) {
                  .preview-scale {
                    transform: scale(0.4);
                    width: 250%;
                    height: 250%;
                  }
                }
              `}</style>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};