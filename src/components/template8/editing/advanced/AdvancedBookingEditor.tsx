import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Layout, Wand2, Star, Phone, Mail, MapPin, Calendar, Clock, ExternalLink } from 'lucide-react';

interface AdvancedBookingEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
}

export const AdvancedBookingEditor: React.FC<AdvancedBookingEditorProps> = ({
  sectionData,
  onSectionUpdate,
  activePanel,
  onPanelChange
}) => {
  const [bookingData, setBookingData] = useState({
    sectionTitle: sectionData.sectionTitle || 'Book Your Appointment',
    sectionSubtitle: sectionData.sectionSubtitle || 'Ready to get started? Schedule your appointment today',
    bookingUrl: sectionData.bookingUrl || '',
    phone: sectionData.phone || '',
    email: sectionData.email || '',
    address: sectionData.address || '',
    businessHours: sectionData.businessHours || [
      { day: 'Monday', hours: '9:00 AM - 6:00 PM', closed: false },
      { day: 'Tuesday', hours: '9:00 AM - 6:00 PM', closed: false },
      { day: 'Wednesday', hours: '9:00 AM - 6:00 PM', closed: false },
      { day: 'Thursday', hours: '9:00 AM - 6:00 PM', closed: false },
      { day: 'Friday', hours: '9:00 AM - 6:00 PM', closed: false },
      { day: 'Saturday', hours: '10:00 AM - 4:00 PM', closed: false },
      { day: 'Sunday', hours: 'Closed', closed: true }
    ],
    showHours: sectionData.showHours !== false,
    showContact: sectionData.showContact !== false,
    bookingButtonText: sectionData.bookingButtonText || 'Book Now',
    bookingStyle: sectionData.bookingStyle || 'prominent',
    brandColor: sectionData.brandColor || '#8B5CF6',
    backgroundColor: sectionData.backgroundColor || '#f9fafb',
    socialLinks: sectionData.socialLinks || {
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: ''
    },
    ...sectionData
  });

  const updateBookingData = (updates: any) => {
    const newData = { ...bookingData, ...updates };
    setBookingData(newData);
    onSectionUpdate(newData);
  };

  const updateBusinessHour = (index: number, field: string, value: any) => {
    const updatedHours = bookingData.businessHours.map((hour: any, i: number) =>
      i === index ? { ...hour, [field]: value } : hour
    );
    updateBookingData({ businessHours: updatedHours });
  };

  const renderContentPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Quick Setup Templates</h4>
      
      <div className="space-y-3">
        {[
          {
            name: 'Hair Salon',
            data: {
              sectionTitle: 'Book Your Hair Appointment',
              sectionSubtitle: 'Transform your look with our professional stylists',
              bookingButtonText: 'Schedule Hair Service',
              businessHours: [
                { day: 'Monday', hours: 'Closed', closed: true },
                { day: 'Tuesday', hours: '9:00 AM - 7:00 PM', closed: false },
                { day: 'Wednesday', hours: '9:00 AM - 7:00 PM', closed: false },
                { day: 'Thursday', hours: '9:00 AM - 7:00 PM', closed: false },
                { day: 'Friday', hours: '9:00 AM - 7:00 PM', closed: false },
                { day: 'Saturday', hours: '8:00 AM - 6:00 PM', closed: false },
                { day: 'Sunday', hours: '10:00 AM - 4:00 PM', closed: false }
              ]
            }
          },
          {
            name: 'Beauty Spa',
            data: {
              sectionTitle: 'Relax & Rejuvenate',
              sectionSubtitle: 'Book your spa experience and unwind in luxury',
              bookingButtonText: 'Book Spa Treatment',
              businessHours: [
                { day: 'Monday', hours: '10:00 AM - 8:00 PM', closed: false },
                { day: 'Tuesday', hours: '10:00 AM - 8:00 PM', closed: false },
                { day: 'Wednesday', hours: '10:00 AM - 8:00 PM', closed: false },
                { day: 'Thursday', hours: '10:00 AM - 8:00 PM', closed: false },
                { day: 'Friday', hours: '10:00 AM - 8:00 PM', closed: false },
                { day: 'Saturday', hours: '9:00 AM - 6:00 PM', closed: false },
                { day: 'Sunday', hours: '11:00 AM - 5:00 PM', closed: false }
              ]
            }
          },
          {
            name: 'Photography Studio',
            data: {
              sectionTitle: 'Book Your Photoshoot',
              sectionSubtitle: 'Capture your special moments with professional photography',
              bookingButtonText: 'Schedule Session',
              businessHours: [
                { day: 'Monday', hours: '10:00 AM - 6:00 PM', closed: false },
                { day: 'Tuesday', hours: '10:00 AM - 6:00 PM', closed: false },
                { day: 'Wednesday', hours: '10:00 AM - 6:00 PM', closed: false },
                { day: 'Thursday', hours: '10:00 AM - 6:00 PM', closed: false },
                { day: 'Friday', hours: '10:00 AM - 6:00 PM', closed: false },
                { day: 'Saturday', hours: '9:00 AM - 7:00 PM', closed: false },
                { day: 'Sunday', hours: 'By Appointment', closed: false }
              ]
            }
          }
        ].map((template) => (
          <button
            key={template.name}
            onClick={() => updateBookingData(template.data)}
            className="w-full p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-sm">{template.name}</div>
            <div className="text-xs text-gray-600 mt-1">
              Apply {template.name.toLowerCase()} booking setup
            </div>
          </button>
        ))}
      </div>

      <div>
        <Label>Popular Booking Platforms</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Square', url: 'https://squareup.com/appointments' },
            { name: 'Acuity', url: 'https://acuityscheduling.com' },
            { name: 'Calendly', url: 'https://calendly.com' },
            { name: 'Booksy', url: 'https://booksy.com' }
          ].map((platform) => (
            <button
              key={platform.name}
              onClick={() => updateBookingData({ bookingUrl: platform.url })}
              className="p-2 border rounded text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <ExternalLink className="w-3 h-3" />
              {platform.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBrandPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Booking Section Styling</h4>
      
      <div>
        <Label htmlFor="brandColor">Primary Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="brandColor"
            type="color"
            value={bookingData.brandColor}
            onChange={(e) => updateBookingData({ brandColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={bookingData.brandColor}
            onChange={(e) => updateBookingData({ brandColor: e.target.value })}
            placeholder="#8B5CF6"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="backgroundColor">Background Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="backgroundColor"
            type="color"
            value={bookingData.backgroundColor}
            onChange={(e) => updateBookingData({ backgroundColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={bookingData.backgroundColor}
            onChange={(e) => updateBookingData({ backgroundColor: e.target.value })}
            placeholder="#f9fafb"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Booking Button Style</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Prominent', value: 'prominent' },
            { name: 'Subtle', value: 'subtle' },
            { name: 'Outline', value: 'outline' },
            { name: 'Gradient', value: 'gradient' }
          ].map((style) => (
            <button
              key={style.value}
              onClick={() => updateBookingData({ bookingStyle: style.value })}
              className={`p-2 border rounded text-sm ${
                bookingData.bookingStyle === style.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLayoutPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Section Layout</h4>
      
      <div>
        <Label>Information Display</Label>
        <div className="space-y-3 mt-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={bookingData.showContact}
              onChange={(e) => updateBookingData({ showContact: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show contact information</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={bookingData.showHours}
              onChange={(e) => updateBookingData({ showHours: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show business hours</span>
          </label>
        </div>
      </div>

      <div>
        <Label>Section Layout Style</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Centered', value: 'centered' },
            { name: 'Split', value: 'split' },
            { name: 'Card', value: 'card' },
            { name: 'Banner', value: 'banner' }
          ].map((layout) => (
            <button
              key={layout.value}
              onClick={() => updateBookingData({ sectionLayout: layout.value })}
              className={`p-2 border rounded text-sm ${
                bookingData.sectionLayout === layout.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {layout.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking & Contact Section</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="sectionTitle">Section Title</Label>
            <Input
              id="sectionTitle"
              value={bookingData.sectionTitle}
              onChange={(e) => updateBookingData({ sectionTitle: e.target.value })}
              placeholder="Book Your Appointment"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sectionSubtitle">Section Subtitle</Label>
            <Textarea
              id="sectionSubtitle"
              value={bookingData.sectionSubtitle}
              onChange={(e) => updateBookingData({ sectionSubtitle: e.target.value })}
              placeholder="Ready to get started? Schedule your appointment today"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Booking Information */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Booking & Contact Details</h4>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="bookingUrl">Booking URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="bookingUrl"
                value={bookingData.bookingUrl}
                onChange={(e) => updateBookingData({ bookingUrl: e.target.value })}
                placeholder="https://your-booking-system.com"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => bookingData.bookingUrl && window.open(bookingData.bookingUrl, '_blank')}
                disabled={!bookingData.bookingUrl}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="bookingButtonText">Button Text</Label>
            <Input
              id="bookingButtonText"
              value={bookingData.bookingButtonText}
              onChange={(e) => updateBookingData({ bookingButtonText: e.target.value })}
              placeholder="Book Now"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="w-4 h-4 text-gray-500" />
                <Input
                  id="phone"
                  value={bookingData.phone}
                  onChange={(e) => updateBookingData({ phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  value={bookingData.email}
                  onChange={(e) => updateBookingData({ email: e.target.value })}
                  placeholder="hello@yourbusiness.com"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Business Address</Label>
            <div className="flex items-start gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-500 mt-3" />
              <Textarea
                id="address"
                value={bookingData.address}
                onChange={(e) => updateBookingData({ address: e.target.value })}
                placeholder="123 Main Street, City, State 12345"
                className="flex-1"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Business Hours</h4>
        
        <div className="space-y-3">
          {bookingData.businessHours.map((hour: any, index: number) => (
            <div key={hour.day} className="flex items-center gap-3">
              <div className="w-20 text-sm font-medium text-gray-700">
                {hour.day}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hour.closed}
                    onChange={(e) => updateBusinessHour(index, 'closed', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Closed</span>
                </label>
                {!hour.closed && (
                  <Input
                    value={hour.hours}
                    onChange={(e) => updateBusinessHour(index, 'hours', e.target.value)}
                    placeholder="9:00 AM - 6:00 PM"
                    className="flex-1"
                  />
                )}
                {hour.closed && (
                  <div className="flex-1 text-sm text-gray-500">Closed</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Social Media Links</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(bookingData.socialLinks).map(([platform, url]) => (
            <div key={platform}>
              <Label htmlFor={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Label>
              <Input
                id={platform}
                value={url as string}
                onChange={(e) => updateBookingData({
                  socialLinks: {
                    ...bookingData.socialLinks,
                    [platform]: e.target.value
                  }
                })}
                placeholder={`https://${platform}.com/yourhandle`}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Panel */}
      {activePanel && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {activePanel === 'content' && <Wand2 className="w-4 h-4" />}
              {activePanel === 'brand' && <Palette className="w-4 h-4" />}
              {activePanel === 'layout' && <Layout className="w-4 h-4" />}
              <span className="capitalize">{activePanel} Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePanel === 'content' && renderContentPanel()}
            {activePanel === 'brand' && renderBrandPanel()}
            {activePanel === 'layout' && renderLayoutPanel()}
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      <Card style={{ backgroundColor: bookingData.backgroundColor }}>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {bookingData.sectionTitle}
            </h2>
            <p className="text-gray-600 mb-6">
              {bookingData.sectionSubtitle}
            </p>
            <Button 
              style={{ backgroundColor: bookingData.brandColor }}
              className="hover:opacity-90"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {bookingData.bookingButtonText}
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {bookingData.showContact && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  {bookingData.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{bookingData.phone}</span>
                    </div>
                  )}
                  {bookingData.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{bookingData.email}</span>
                    </div>
                  )}
                  {bookingData.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span>{bookingData.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {bookingData.showHours && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Business Hours</h4>
                <div className="space-y-1 text-sm">
                  {bookingData.businessHours.slice(0, 4).map((hour: any) => (
                    <div key={hour.day} className="flex justify-between">
                      <span className="text-gray-600">{hour.day}</span>
                      <span className={hour.closed ? 'text-gray-500' : 'text-gray-900'}>
                        {hour.closed ? 'Closed' : hour.hours}
                      </span>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 pt-1">
                    + {bookingData.businessHours.length - 4} more days
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Advanced Booking Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Use a reliable booking system that sends confirmation emails</li>
              <li>• Keep your business hours updated for holidays and special events</li>
              <li>• Make contact information easily accessible</li>
              <li>• Consider offering online booking for convenience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};