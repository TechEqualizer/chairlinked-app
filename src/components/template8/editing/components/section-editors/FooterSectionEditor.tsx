import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, Settings, Palette, Mail, Phone, Instagram } from "lucide-react";

interface FooterSectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
}

const FooterSectionEditor: React.FC<FooterSectionEditorProps> = ({
  pageData,
  onUpdate,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'social' | 'style'>('content');

  const handleUpdate = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: Link },
    { id: 'social', label: 'Social', icon: Instagram },
    { id: 'style', label: 'Style', icon: Palette }
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
                onChange={(e) => handleUpdate('businessName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={pageData.footerTagline || pageData.tagline || ''}
                onChange={(e) => handleUpdate('footerTagline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Short tagline or description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={pageData.contactEmail || ''}
                  onChange={(e) => handleUpdate('contactEmail', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@yourbusiness.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={pageData.phoneNumber || ''}
                  onChange={(e) => handleUpdate('phoneNumber', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={pageData.businessAddress || ''}
                onChange={(e) => handleUpdate('businessAddress', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Main St, City, State 12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copyright Text
              </label>
              <input
                type="text"
                value={pageData.copyrightText || `© ${new Date().getFullYear()} ${pageData.businessName || 'Your Business'}. All rights reserved.`}
                onChange={(e) => handleUpdate('copyrightText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Copyright notice"
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Handle
              </label>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">@</span>
                <input
                  type="text"
                  value={pageData.instagramHandle?.replace('@', '') || ''}
                  onChange={(e) => handleUpdate('instagramHandle', `@${e.target.value.replace('@', '')}`)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="yourbusiness"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={pageData.facebookUrl || ''}
                onChange={(e) => handleUpdate('facebookUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://facebook.com/yourbusiness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                value={pageData.twitterUrl || ''}
                onChange={(e) => handleUpdate('twitterUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://twitter.com/yourbusiness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={pageData.linkedinUrl || ''}
                onChange={(e) => handleUpdate('linkedinUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/company/yourbusiness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TikTok URL
              </label>
              <input
                type="url"
                value={pageData.tiktokUrl || ''}
                onChange={(e) => handleUpdate('tiktokUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://tiktok.com/@yourbusiness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={pageData.youtubeUrl || ''}
                onChange={(e) => handleUpdate('youtubeUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/c/yourbusiness"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showSocialLinks !== false}
                  onChange={(e) => handleUpdate('showSocialLinks', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Social Media Links</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pageData.footerBackgroundColor || '#1f2937'}
                  onChange={(e) => handleUpdate('footerBackgroundColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.footerBackgroundColor || '#1f2937'}
                  onChange={(e) => handleUpdate('footerBackgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="#1f2937"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pageData.footerTextColor || '#ffffff'}
                  onChange={(e) => handleUpdate('footerTextColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.footerTextColor || '#ffffff'}
                  onChange={(e) => handleUpdate('footerTextColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Layout
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'centered', label: 'Centered' },
                  { value: 'columns', label: 'Columns' },
                  { value: 'minimal', label: 'Minimal' },
                  { value: 'extended', label: 'Extended' }
                ].map((layout) => (
                  <button
                    key={layout.value}
                    onClick={() => handleUpdate('footerLayout', layout.value)}
                    className={`
                      px-3 py-2 rounded-lg border text-sm transition-colors
                      ${(pageData.footerLayout || 'centered') === layout.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {layout.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showFooterLogo !== false}
                  onChange={(e) => handleUpdate('showFooterLogo', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Logo in Footer</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showContactInfo !== false}
                  onChange={(e) => handleUpdate('showContactInfo', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Contact Information</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showCopyright !== false}
                  onChange={(e) => handleUpdate('showCopyright', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Copyright Notice</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.showChairLinkedBadge !== false}
                  onChange={(e) => handleUpdate('showChairLinkedBadge', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show "Powered by ChairLinked" Badge</span>
              </label>
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

export default FooterSectionEditor;