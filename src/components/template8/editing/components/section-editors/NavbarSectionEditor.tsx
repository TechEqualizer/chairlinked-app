import React, { useState } from "react";
import { motion } from "framer-motion";
import { Type, Upload, Palette, Settings } from "lucide-react";

interface NavbarSectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
}

const NavbarSectionEditor: React.FC<NavbarSectionEditorProps> = ({
  pageData,
  onUpdate,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'style' | 'settings'>('branding');

  const handleUpdate = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const tabs = [
    { id: 'branding', label: 'Branding', icon: Type },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings }
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
        {activeTab === 'branding' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={pageData.businessName || ''}
                onChange={(e) => handleUpdate('businessName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={pageData.logoUrl || ''}
                  onChange={(e) => handleUpdate('logoUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter logo URL"
                />
                
                {pageData.logoUrl && (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <img
                      src={pageData.logoUrl}
                      alt="Logo preview"
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-sm text-gray-600">Logo preview</span>
                  </div>
                )}
                
                <button className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call-to-Action Button
              </label>
              <input
                type="text"
                value={pageData.ctaText || ''}
                onChange={(e) => handleUpdate('ctaText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Book Now, Get Started"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Link
              </label>
              <input
                type="url"
                value={pageData.bookingLink || ''}
                onChange={(e) => handleUpdate('bookingLink', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pageData.navbarBackgroundColor || '#ffffff'}
                  onChange={(e) => handleUpdate('navbarBackgroundColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.navbarBackgroundColor || '#ffffff'}
                  onChange={(e) => handleUpdate('navbarBackgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pageData.brandColor || '#8B5CF6'}
                  onChange={(e) => handleUpdate('brandColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.brandColor || '#8B5CF6'}
                  onChange={(e) => handleUpdate('brandColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="#8B5CF6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Navbar Style
              </label>
              <div className="space-y-2">
                {[
                  { value: 'transparent', label: 'Transparent' },
                  { value: 'solid', label: 'Solid Background' },
                  { value: 'blur', label: 'Blur Background' }
                ].map((style) => (
                  <label key={style.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="navbarStyle"
                      value={style.value}
                      checked={(pageData.navbarStyle || 'solid') === style.value}
                      onChange={(e) => handleUpdate('navbarStyle', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{style.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <div className="space-y-2">
                {[
                  { value: 'static', label: 'Static' },
                  { value: 'sticky', label: 'Sticky (follows scroll)' },
                  { value: 'fixed', label: 'Fixed' }
                ].map((position) => (
                  <label key={position.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="navbarPosition"
                      value={position.value}
                      checked={(pageData.navbarPosition || 'sticky') === position.value}
                      onChange={(e) => handleUpdate('navbarPosition', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{position.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showLogo !== false}
                  onChange={(e) => handleUpdate('showLogo', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Logo</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showNavigation !== false}
                  onChange={(e) => handleUpdate('showNavigation', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Navigation Menu</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showCTA !== false}
                  onChange={(e) => handleUpdate('showCTA', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show CTA Button</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.enableMobileMenu !== false}
                  onChange={(e) => handleUpdate('enableMobileMenu', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable Mobile Menu</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Navigation Items
              </label>
              <div className="space-y-2">
                {(pageData.navigationItems || ['Home', 'Gallery', 'About', 'Contact']).map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...(pageData.navigationItems || ['Home', 'Gallery', 'About', 'Contact'])];
                        newItems[index] = e.target.value;
                        handleUpdate('navigationItems', newItems);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Navigation item"
                    />
                    <button
                      onClick={() => {
                        const newItems = [...(pageData.navigationItems || ['Home', 'Gallery', 'About', 'Contact'])];
                        newItems.splice(index, 1);
                        handleUpdate('navigationItems', newItems);
                      }}
                      className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const newItems = [...(pageData.navigationItems || ['Home', 'Gallery', 'About', 'Contact']), 'New Item'];
                    handleUpdate('navigationItems', newItems);
                  }}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors text-sm"
                >
                  + Add Navigation Item
                </button>
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

export default NavbarSectionEditor;