import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Calendar, Phone, Mail, MapPin } from 'lucide-react';

interface SimpleBookingEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
}

export const SimpleBookingEditor: React.FC<SimpleBookingEditorProps> = ({
  sectionData,
  onSectionUpdate
}) => {
  const [bookingData, setBookingData] = useState({
    bookingUrl: sectionData.bookingUrl || '',
    bookingText: sectionData.bookingText || 'Book Appointment',
    phone: sectionData.phone || '',
    email: sectionData.email || '',
    address: sectionData.address || '',
    businessHours: sectionData.businessHours || '',
    ...sectionData
  });

  const updateBookingData = (updates: any) => {
    const newData = { ...bookingData, ...updates };
    setBookingData(newData);
    onSectionUpdate(newData);
  };

  const testBookingLink = () => {
    if (bookingData.bookingUrl) {
      window.open(bookingData.bookingUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          How can customers book with you?
        </h3>
        <p className="text-gray-600">
          Add your booking link and contact information so customers can easily reach you.
        </p>
      </div>

      {/* Booking Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Online Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="booking-url">Booking Link *</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="booking-url"
                value={bookingData.bookingUrl}
                onChange={(e) => updateBookingData({ bookingUrl: e.target.value })}
                placeholder="https://calendly.com/your-name or https://acuityscheduling.com/..."
                className="flex-1"
              />
              {bookingData.bookingUrl && (
                <Button
                  variant="outline"
                  onClick={testBookingLink}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Test
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Add your Calendly, Acuity, Square, or other booking platform link
            </p>
          </div>

          <div>
            <Label htmlFor="booking-text">Button Text</Label>
            <Input
              id="booking-text"
              value={bookingData.bookingText}
              onChange={(e) => updateBookingData({ bookingText: e.target.value })}
              placeholder="Book Appointment"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={bookingData.phone}
                onChange={(e) => updateBookingData({ phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={bookingData.email}
                onChange={(e) => updateBookingData({ email: e.target.value })}
                placeholder="hello@yourbusiness.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              value={bookingData.address}
              onChange={(e) => updateBookingData({ address: e.target.value })}
              placeholder="123 Main St, City, State 12345"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="business-hours">Business Hours</Label>
            <Textarea
              id="business-hours"
              value={bookingData.businessHours}
              onChange={(e) => updateBookingData({ businessHours: e.target.value })}
              placeholder="Mon-Fri: 9AM-6PM&#10;Sat: 9AM-4PM&#10;Sun: Closed"
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {bookingData.bookingUrl && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Booking Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div>
                <h4 className="font-semibold text-gray-900">Ready to get started?</h4>
                <p className="text-gray-600">Book your appointment online</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                {bookingData.bookingText}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600">💡</div>
          <div>
            <h4 className="font-medium text-blue-900">Booking Integration Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Most popular: Calendly, Acuity Scheduling, Square Appointments</li>
              <li>• The booking link will open in a new window</li>
              <li>• Make sure your booking system is set up before adding the link</li>
              <li>• Test the link to ensure it works correctly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};