import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle, Save, Eye, Palette, Type, Image, Layout, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChairLinkedRenderer from '@/components/chairlinked/ChairLinkedRenderer';
import { ManualSaveButton } from './components/ManualSaveButton';

// Import advanced section editors (we'll create these)
import { AdvancedHeroEditor } from './advanced/AdvancedHeroEditor';
import { AdvancedServicesEditor } from './advanced/AdvancedServicesEditor';
import { AdvancedTestimonialsEditor } from './advanced/AdvancedTestimonialsEditor';
import { AdvancedGalleryEditor } from './advanced/AdvancedGalleryEditor';
import { AdvancedBookingEditor } from './advanced/AdvancedBookingEditor';
import { AdvancedNavbarEditor } from './advanced/AdvancedNavbarEditor';
import { AdvancedFooterEditor } from './advanced/AdvancedFooterEditor';

interface AdvancedSequentialEditorProps {
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

interface AdvancedEditorSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: React.ComponentType<any>;
  panels: string[];
}

const ADVANCED_EDITOR_SECTIONS: AdvancedEditorSection[] = [
  {
    id: 'navbar',
    title: 'Navigation',
    description: 'Menu, logo, and navigation controls',
    icon: '🧭',
    component: AdvancedNavbarEditor,
    panels: ['brand', 'layout', 'content']
  },
  {
    id: 'hero',
    title: 'Hero Section',
    description: 'Main headline, visuals, and call-to-action',
    icon: '🎯',
    component: AdvancedHeroEditor,
    panels: ['brand', 'typography', 'images', 'layout']
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Your main services and offerings',
    icon: '💼',
    component: AdvancedServicesEditor,
    panels: ['content', 'brand', 'layout']
  },
  {
    id: 'gallery',
    title: 'Gallery',
    description: 'Showcase your work with images',
    icon: '🖼️',
    component: AdvancedGalleryEditor,
    panels: ['images', 'layout', 'brand']
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    description: 'Customer reviews and social proof',
    icon: '💬',
    component: AdvancedTestimonialsEditor,
    panels: ['content', 'brand', 'layout']
  },
  {
    id: 'booking',
    title: 'Booking & Contact',
    description: 'Contact information and booking system',
    icon: '📅',
    component: AdvancedBookingEditor,
    panels: ['content', 'brand', 'layout']
  },
  {
    id: 'footer',
    title: 'Footer',
    description: 'Footer links, contact info, and social media',
    icon: '🔗',
    component: AdvancedFooterEditor,
    panels: ['content', 'brand', 'layout']
  }
];

export const AdvancedSequentialEditor: React.FC<AdvancedSequentialEditorProps> = ({
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
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const currentSection = ADVANCED_EDITOR_SECTIONS[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === ADVANCED_EDITOR_SECTIONS.length - 1;
  const progressPercentage = ((currentSectionIndex + 1) / ADVANCED_EDITOR_SECTIONS.length) * 100;

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

  const hasRequiredContent = (sectionId: string, data: any) => {
    switch (sectionId) {
      case 'hero':
        return data.heroTitle || data.headline;
      case 'services':
        return data.services && data.services.length > 0;
      case 'testimonials':
        return data.testimonials && data.testimonials.length > 0;
      case 'gallery':
        return data.gallery && data.gallery.images && data.gallery.images.length > 0;
      case 'booking':
        return data.bookingUrl || data.phone || data.email;
      default:
        return true; // Navbar and footer are always considered complete
    }
  };

  const goToNextSection = () => {
    if (!isLastSection) {
      setCurrentSectionIndex(prev => prev + 1);
      setActivePanel(null);
    }
  };

  const goToPreviousSection = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(prev => prev - 1);
      setActivePanel(null);
    }
  };


  const getPanelIcon = (panel: string) => {
    switch (panel) {
      case 'brand': return <Palette className="w-4 h-4" />;
      case 'typography': return <Type className="w-4 h-4" />;
      case 'images': return <Image className="w-4 h-4" />;
      case 'layout': return <Layout className="w-4 h-4" />;
      case 'content': return <Wand2 className="w-4 h-4" />;
      default: return <Palette className="w-4 h-4" />;
    }
  };

  const CurrentSectionComponent = currentSection.component;

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
                  <span className="hidden sm:inline">Advanced Editor</span>
                  <span className="sm:hidden">Pro Editor</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  <span className="hidden sm:inline">{siteData?.business_name} • </span>
                  Step {currentSectionIndex + 1} of {ADVANCED_EDITOR_SECTIONS.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1 sm:gap-2"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
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
        <div className="hidden lg:block lg:w-80 bg-white border-r">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Advanced Sections
            </h3>
            <div className="space-y-3">
              {ADVANCED_EDITOR_SECTIONS.map((section, index) => (
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

          {/* Advanced Control Panels */}
          <div className="border-t p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Advanced Controls</h4>
            <div className="grid grid-cols-2 gap-2">
              {currentSection.panels.map((panel) => (
                <button
                  key={panel}
                  onClick={() => setActivePanel(activePanel === panel ? null : panel)}
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-all ${
                    activePanel === panel
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  {getPanelIcon(panel)}
                  <span className="capitalize">{panel}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile section tabs */}
        <div className="lg:hidden bg-white border-b p-4">
          <div className="flex gap-2 overflow-x-auto">
            {ADVANCED_EDITOR_SECTIONS.map((section, index) => (
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

          {/* Mobile control panels */}
          <div className="mt-4">
            <div className="flex gap-2 overflow-x-auto">
              {currentSection.panels.map((panel) => (
                <button
                  key={panel}
                  onClick={() => setActivePanel(activePanel === panel ? null : panel)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                    activePanel === panel
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getPanelIcon(panel)}
                  <span className="capitalize">{panel}</span>
                </button>
              ))}
            </div>
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
                  activePanel={activePanel}
                  onPanelChange={setActivePanel}
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
              <ManualSaveButton
                onSave={onSave || (() => Promise.resolve())}
                pageData={sectionData}
                isDirty={true}
                isAutoSaving={false}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                onSaveSuccessNavigate={onClose}
                skipNavigationOnSave={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* Template8 Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full h-full flex flex-col">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white rounded-t-lg">
              <h3 className="text-base sm:text-lg font-semibold">Advanced Editor Preview</h3>
              <div className="flex items-center gap-2 sm:gap-3">
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