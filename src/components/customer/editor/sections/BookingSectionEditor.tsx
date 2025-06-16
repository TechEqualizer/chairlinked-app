
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SimpleEditorData, BusinessHours, SocialLinks } from '@/hooks/useSimpleCustomerEditor';

interface BookingSectionEditorProps {
  data: SimpleEditorData;
  onUpdateField: (field: keyof SimpleEditorData, value: any) => void;
}

export const BookingSectionEditor: React.FC<BookingSectionEditorProps> = ({
  data,
  onUpdateField,
}) => {
  const businessHours = data.businessHours || {};
  const socialLinks = data.socialLinks || {};

  const updateBusinessHours = (day: keyof BusinessHours, value: string) => {
    const updatedHours = { ...businessHours, [day]: value };
    onUpdateField('businessHours', updatedHours);
  };

  const updateSocialLinks = (platform: keyof SocialLinks, value: string) => {
    const updatedLinks = { ...socialLinks, [platform]: value };
    onUpdateField('socialLinks', updatedLinks);
  };

  const updateServices = (value: string) => {
    const services = value.split('\n').filter(s => s.trim() !== '');
    onUpdateField('services', services);
  };

  const updateSpecialties = (value: string) => {
    const specialties = value.split('\n').filter(s => s.trim() !== '');
    onUpdateField('specialties', specialties);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📅 Booking & Contact Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookingUrl">Booking/Appointment URL</Label>
              <Input
                id="bookingUrl"
                value={data.bookingUrl || ''}
                onChange={(e) => onUpdateField('bookingUrl', e.target.value)}
                placeholder="https://your-booking-system.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={data.address || ''}
                onChange={(e) => onUpdateField('address', e.target.value)}
                placeholder="123 Main St, City, State 12345"
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Business Hours</Label>
            {[
              { key: 'monday', label: 'Monday' },
              { key: 'tuesday', label: 'Tuesday' },
              { key: 'wednesday', label: 'Wednesday' },
              { key: 'thursday', label: 'Thursday' },
              { key: 'friday', label: 'Friday' },
              { key: 'saturday', label: 'Saturday' },
              { key: 'sunday', label: 'Sunday' }
            ].map(({ key, label }) => (
              <div key={key} className="grid grid-cols-3 gap-3 items-center">
                <Label className="text-sm">{label}</Label>
                <Input
                  value={businessHours[key as keyof BusinessHours] || ''}
                  onChange={(e) => updateBusinessHours(key as keyof BusinessHours, e.target.value)}
                  placeholder="9:00 AM - 5:00 PM"
                  className="col-span-2"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Social Media Links</Label>
            {[
              { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourbusiness' },
              { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourbusiness' },
              { key: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/yourbusiness' },
              { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourbusiness' },
              { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/yourbusiness' }
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={socialLinks[key as keyof SocialLinks] || ''}
                  onChange={(e) => updateSocialLinks(key as keyof SocialLinks, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="services">Services (one per line)</Label>
              <Textarea
                id="services"
                value={(data.services || []).join('\n')}
                onChange={(e) => updateServices(e.target.value)}
                placeholder="Hair Cutting&#10;Hair Coloring&#10;Styling&#10;Extensions"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties (one per line)</Label>
              <Textarea
                id="specialties"
                value={(data.specialties || []).join('\n')}
                onChange={(e) => updateSpecialties(e.target.value)}
                placeholder="Balayage&#10;Wedding Hair&#10;Color Correction&#10;Curly Hair"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
