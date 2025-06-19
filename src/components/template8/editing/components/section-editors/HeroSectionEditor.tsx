import React, { useState } from "react";
import { motion } from "framer-motion";
import { Type, Image, Palette, Layout, Zap } from "lucide-react";

interface HeroSectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
}

const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({
  pageData,
  onUpdate,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'images' | 'style' | 'layout'>('content');

  const handleTextUpdate = (field: string, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleColorUpdate = (field: string, color: string) => {
    onUpdate({ [field]: color });
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Layout }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex rounded-lg bg-gray-100 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all flex-1
                ${activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={pageData.businessName || ''}
                onChange={(e) => handleTextUpdate('businessName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={pageData.tagline || ''}
                onChange={(e) => handleTextUpdate('tagline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tagline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={pageData.description || ''}
                onChange={(e) => handleTextUpdate('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call-to-Action Text
              </label>
              <input
                type="text"
                value={pageData.ctaText || ''}
                onChange={(e) => handleTextUpdate('ctaText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Get Started"
              />
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Image
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={pageData.heroImage || ''}
                  onChange={(e) => handleTextUpdate('heroImage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter image URL"
                />
                {pageData.heroImage && (
                  <div className="relative rounded-lg overflow-hidden border">
                    <img
                      src={pageData.heroImage}
                      alt="Hero preview"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Images ({pageData.heroImages?.length || 0})
              </label>
              <div className="space-y-2">
                {pageData.heroImages?.map((image: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <img
                      src={image}
                      alt={`Background ${index + 1}`}
                      className="w-12 h-12 object-cover rounded-lg border"
                    />
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => {
                        const newImages = [...(pageData.heroImages || [])];
                        newImages[index] = e.target.value;
                        onUpdate({ heroImages: newImages });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter image URL"
                    />
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const newImages = [...(pageData.heroImages || []), ''];
                    onUpdate({ heroImages: newImages });
                  }}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm"
                >
                  + Add Background Image
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pageData.brandColor || '#8B5CF6'}
                  onChange={(e) => handleColorUpdate('brandColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.brandColor || '#8B5CF6'}
                  onChange={(e) => handleColorUpdate('brandColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="#8B5CF6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pageData.backgroundColor || '#ffffff'}
                  onChange={(e) => handleColorUpdate('backgroundColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.backgroundColor || '#ffffff'}
                  onChange={(e) => handleColorUpdate('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={pageData.fontFamily || 'Inter, sans-serif'}
                onChange={(e) => handleTextUpdate('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Playfair Display, serif">Playfair Display</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
                <option value="Roboto, sans-serif">Roboto</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">AI Enhancement</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Automatically optimize your hero section layout and styling
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Enhance with AI
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Alignment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handleTextUpdate('textAlign', align)}
                    className={`
                      px-3 py-2 rounded-lg border text-sm capitalize transition-colors
                      ${(pageData.textAlign || 'center') === align
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Save Changes
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionEditor;