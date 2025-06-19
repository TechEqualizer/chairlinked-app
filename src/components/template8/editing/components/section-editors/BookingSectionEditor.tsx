import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Link, Palette, Type } from "lucide-react";

interface BookingSectionEditorProps {
  pageData: any;
  onUpdate: (updates: any) => void;
  onSave?: () => Promise<void>;
}

const BookingSectionEditor: React.FC<BookingSectionEditorProps> = ({
  pageData,
  onUpdate,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'settings'>('content');

  const handleUpdate = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Calendar }
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
                Section Title
              </label>
              <input
                type="text"
                value={pageData.bookingTitle || 'Book Your Session'}
                onChange={(e) => handleUpdate('bookingTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Section title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Subtitle
              </label>
              <input
                type="text"
                value={pageData.bookingSubtitle || 'Ready to get started? Schedule your appointment today!'}
                onChange={(e) => handleUpdate('bookingSubtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Section subtitle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call-to-Action Text
              </label>
              <input
                type="text"
                value={pageData.ctaText || 'Book Now'}
                onChange={(e) => handleUpdate('ctaText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Button text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Link
              </label>
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={pageData.bookingLink || ''}
                  onChange={(e) => handleUpdate('bookingLink', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://calendly.com/yourbusiness"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Link to your booking system (Calendly, Acuity, etc.)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Information
              </label>
              <div className="space-y-2">
                <input
                  type="email"
                  value={pageData.contactEmail || ''}
                  onChange={(e) => handleUpdate('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@yourbusiness.com"
                />
                
                <input
                  type="tel"
                  value={pageData.phoneNumber || ''}
                  onChange={(e) => handleUpdate('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                value={pageData.bookingDescription || ''}
                onChange={(e) => handleUpdate('bookingDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional details about booking, pricing, etc."
              />
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'solid', label: 'Solid' },
                  { value: 'outline', label: 'Outline' },
                  { value: 'gradient', label: 'Gradient' },
                  { value: 'minimal', label: 'Minimal' }
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => handleUpdate('buttonStyle', style.value)}
                    className={`
                      px-3 py-2 rounded-lg border text-sm transition-colors
                      ${(pageData.buttonStyle || 'solid') === style.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pageData.buttonColor || pageData.brandColor || '#8B5CF6'}
                  onChange={(e) => handleUpdate('buttonColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.buttonColor || pageData.brandColor || '#8B5CF6'}
                  onChange={(e) => handleUpdate('buttonColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="#8B5CF6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' }
                ].map((size) => (
                  <button
                    key={size.value}
                    onClick={() => handleUpdate('buttonSize', size.value)}
                    className={`
                      px-3 py-2 rounded-lg border text-sm transition-colors
                      ${(pageData.buttonSize || 'medium') === size.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pageData.bookingBackgroundColor || '#f8fafc'}
                  onChange={(e) => handleUpdate('bookingBackgroundColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={pageData.bookingBackgroundColor || '#f8fafc'}
                  onChange={(e) => handleUpdate('bookingBackgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="#f8fafc"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Alignment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handleUpdate('bookingTextAlign', align)}
                    className={`
                      px-3 py-2 rounded-lg border text-sm capitalize transition-colors
                      ${(pageData.bookingTextAlign || 'center') === align
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

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.enableInstantBooking !== false}
                  onChange={(e) => handleUpdate('enableInstantBooking', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable Instant Booking</span>
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
                  checked={pageData.showBusinessHours !== false}
                  onChange={(e) => handleUpdate('showBusinessHours', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Business Hours</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pageData.requireFormFill || false}
                  onChange={(e) => handleUpdate('requireFormFill', e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Require Contact Form</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Platform
              </label>
              <select
                value={pageData.bookingPlatform || 'calendly'}
                onChange={(e) => handleUpdate('bookingPlatform', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="calendly">Calendly</option>
                <option value="acuity">Acuity Scheduling</option>
                <option value="booksy">Booksy</option>
                <option value="square">Square Appointments</option>
                <option value="custom">Custom Link</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Hours
              </label>
              <textarea
                value={pageData.businessHours || 'Mon-Fri: 9AM-6PM\nSat: 10AM-4PM\nSun: Closed'}
                onChange={(e) => handleUpdate('businessHours', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Mon-Fri: 9AM-6PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Instructions
              </label>
              <textarea
                value={pageData.bookingInstructions || ''}
                onChange={(e) => handleUpdate('bookingInstructions', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Special instructions for booking"
              />
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

export default BookingSectionEditor;