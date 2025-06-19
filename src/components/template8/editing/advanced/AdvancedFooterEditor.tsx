import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Palette, Layout, Wand2, Star, ExternalLink, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface AdvancedFooterEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
}

export const AdvancedFooterEditor: React.FC<AdvancedFooterEditorProps> = ({
  sectionData,
  onSectionUpdate,
  activePanel,
  onPanelChange
}) => {
  const [footerData, setFooterData] = useState({
    businessName: sectionData.businessName || 'Your Business',
    description: sectionData.description || 'Professional services you can trust',
    phone: sectionData.phone || '',
    email: sectionData.email || '',
    address: sectionData.address || '',
    businessHours: sectionData.businessHours || 'Monday - Friday: 9AM - 6PM',
    socialLinks: sectionData.socialLinks || {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    quickLinks: sectionData.quickLinks || [
      { id: '1', label: 'About Us', href: '#about' },
      { id: '2', label: 'Services', href: '#services' },
      { id: '3', label: 'Gallery', href: '#gallery' },
      { id: '4', label: 'Contact', href: '#contact' }
    ],
    legalLinks: sectionData.legalLinks || [
      { id: '1', label: 'Privacy Policy', href: '/privacy' },
      { id: '2', label: 'Terms of Service', href: '/terms' }
    ],
    copyrightText: sectionData.copyrightText || `© ${new Date().getFullYear()} Your Business. All rights reserved.`,
    footerStyle: sectionData.footerStyle || 'modern',
    showSocial: sectionData.showSocial !== false,
    showQuickLinks: sectionData.showQuickLinks !== false,
    showContact: sectionData.showContact !== false,
    backgroundColor: sectionData.backgroundColor || '#1f2937',
    textColor: sectionData.textColor || '#f9fafb',
    accentColor: sectionData.accentColor || '#8B5CF6',
    ...sectionData
  });

  const updateFooterData = (updates: any) => {
    const newData = { ...footerData, ...updates };
    setFooterData(newData);
    onSectionUpdate(newData);
  };

  const updateQuickLink = (linkId: string, field: string, value: any) => {
    const updatedLinks = footerData.quickLinks.map((link: any) =>
      link.id === linkId ? { ...link, [field]: value } : link
    );
    updateFooterData({ quickLinks: updatedLinks });
  };

  const addQuickLink = () => {
    const newLink = {
      id: Date.now().toString(),
      label: 'New Link',
      href: '#new'
    };
    updateFooterData({ quickLinks: [...footerData.quickLinks, newLink] });
  };

  const removeQuickLink = (linkId: string) => {
    const updatedLinks = footerData.quickLinks.filter((link: any) => link.id !== linkId);
    updateFooterData({ quickLinks: updatedLinks });
  };

  const updateLegalLink = (linkId: string, field: string, value: any) => {
    const updatedLinks = footerData.legalLinks.map((link: any) =>
      link.id === linkId ? { ...link, [field]: value } : link
    );
    updateFooterData({ legalLinks: updatedLinks });
  };

  const addLegalLink = () => {
    const newLink = {
      id: Date.now().toString(),
      label: 'New Policy',
      href: '/new-policy'
    };
    updateFooterData({ legalLinks: [...footerData.legalLinks, newLink] });
  };

  const removeLegalLink = (linkId: string) => {
    const updatedLinks = footerData.legalLinks.filter((link: any) => link.id !== linkId);
    updateFooterData({ legalLinks: updatedLinks });
  };

  const getSocialIcon = (platform: string) => {
    const icons = {
      facebook: Facebook,
      instagram: Instagram,
      twitter: Twitter,
      linkedin: Linkedin
    };
    const IconComponent = icons[platform as keyof typeof icons] || ExternalLink;
    return <IconComponent className="w-4 h-4" />;
  };

  const renderContentPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Footer Templates</h4>
      
      <div className="space-y-3">
        {[
          {
            name: 'Hair Salon',
            data: {
              description: 'Transform your look with our professional hair services',
              quickLinks: [
                { label: 'Hair Services', href: '#services' },
                { label: 'Our Stylists', href: '#team' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Book Online', href: '#booking' }
              ],
              businessHours: 'Tue-Sat: 9AM-7PM, Sun: 10AM-4PM'
            }
          },
          {
            name: 'Beauty Spa',
            data: {
              description: 'Relax and rejuvenate with our luxury spa treatments',
              quickLinks: [
                { label: 'Spa Services', href: '#services' },
                { label: 'Treatments', href: '#treatments' },
                { label: 'Gift Cards', href: '#gifts' },
                { label: 'Memberships', href: '#membership' }
              ],
              businessHours: 'Mon-Sun: 10AM-8PM'
            }
          },
          {
            name: 'Photography Studio',
            data: {
              description: 'Capturing life\'s precious moments with artistic vision',
              quickLinks: [
                { label: 'Portfolio', href: '#gallery' },
                { label: 'Photography Packages', href: '#services' },
                { label: 'About the Photographer', href: '#about' },
                { label: 'Client Reviews', href: '#testimonials' }
              ],
              businessHours: 'Mon-Fri: 10AM-6PM, Weekends by appointment'
            }
          }
        ].map((template) => (
          <button
            key={template.name}
            onClick={() => {
              const newLinks = template.data.quickLinks.map((link, index) => ({
                id: Date.now() + index,
                ...link
              }));
              updateFooterData({
                description: template.data.description,
                quickLinks: newLinks,
                businessHours: template.data.businessHours
              });
            }}
            className="w-full p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-sm">{template.name}</div>
            <div className="text-xs text-gray-600 mt-1">
              {template.data.description.substring(0, 50)}...
            </div>
          </button>
        ))}
      </div>

      <div>
        <Label>Business Hours Templates</Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {[
            'Monday - Friday: 9AM - 6PM',
            'Tuesday - Saturday: 9AM - 7PM, Sunday: 10AM - 4PM',
            'Monday - Sunday: 10AM - 8PM',
            'By Appointment Only'
          ].map((hours) => (
            <button
              key={hours}
              onClick={() => updateFooterData({ businessHours: hours })}
              className="p-2 border rounded text-sm hover:bg-gray-50 text-left"
            >
              {hours}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBrandPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Footer Styling</h4>
      
      <div>
        <Label htmlFor="backgroundColor">Background Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="backgroundColor"
            type="color"
            value={footerData.backgroundColor}
            onChange={(e) => updateFooterData({ backgroundColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={footerData.backgroundColor}
            onChange={(e) => updateFooterData({ backgroundColor: e.target.value })}
            placeholder="#1f2937"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="textColor">Text Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="textColor"
            type="color"
            value={footerData.textColor}
            onChange={(e) => updateFooterData({ textColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={footerData.textColor}
            onChange={(e) => updateFooterData({ textColor: e.target.value })}
            placeholder="#f9fafb"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="accentColor">Accent Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="accentColor"
            type="color"
            value={footerData.accentColor}
            onChange={(e) => updateFooterData({ accentColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={footerData.accentColor}
            onChange={(e) => updateFooterData({ accentColor: e.target.value })}
            placeholder="#8B5CF6"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Color Schemes</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Dark', bg: '#1f2937', text: '#f9fafb', accent: '#8B5CF6' },
            { name: 'Light', bg: '#f9fafb', text: '#1f2937', accent: '#6366f1' },
            { name: 'Brand', bg: '#8B5CF6', text: '#ffffff', accent: '#fbbf24' },
            { name: 'Minimal', bg: '#ffffff', text: '#374151', accent: '#10b981' }
          ].map((scheme) => (
            <button
              key={scheme.name}
              onClick={() => updateFooterData({
                backgroundColor: scheme.bg,
                textColor: scheme.text,
                accentColor: scheme.accent
              })}
              className="p-2 border rounded text-sm hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: scheme.bg }}
                />
                <span className="text-xs font-medium">{scheme.name}</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded" style={{ backgroundColor: scheme.accent }} />
                <div className="w-2 h-2 rounded" style={{ backgroundColor: scheme.text }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLayoutPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Footer Layout</h4>
      
      <div>
        <Label>Footer Style</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Modern', value: 'modern' },
            { name: 'Classic', value: 'classic' },
            { name: 'Minimal', value: 'minimal' },
            { name: 'Detailed', value: 'detailed' }
          ].map((style) => (
            <button
              key={style.value}
              onClick={() => updateFooterData({ footerStyle: style.value })}
              className={`p-2 border rounded text-sm ${
                footerData.footerStyle === style.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Content Sections</Label>
        <div className="space-y-3 mt-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={footerData.showContact}
              onChange={(e) => updateFooterData({ showContact: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show contact information</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={footerData.showQuickLinks}
              onChange={(e) => updateFooterData({ showQuickLinks: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show quick links</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={footerData.showSocial}
              onChange={(e) => updateFooterData({ showSocial: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show social media links</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Business Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={footerData.businessName}
              onChange={(e) => updateFooterData({ businessName: e.target.value })}
              placeholder="Your Business Name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              value={footerData.description}
              onChange={(e) => updateFooterData({ description: e.target.value })}
              placeholder="A brief description of your business"
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="businessHours">Business Hours</Label>
            <Input
              id="businessHours"
              value={footerData.businessHours}
              onChange={(e) => updateFooterData({ businessHours: e.target.value })}
              placeholder="Monday - Friday: 9AM - 6PM"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="copyrightText">Copyright Text</Label>
            <Input
              id="copyrightText"
              value={footerData.copyrightText}
              onChange={(e) => updateFooterData({ copyrightText: e.target.value })}
              placeholder="© 2024 Your Business. All rights reserved."
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4 text-gray-500" />
              <Input
                id="phone"
                value={footerData.phone}
                onChange={(e) => updateFooterData({ phone: e.target.value })}
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
                value={footerData.email}
                onChange={(e) => updateFooterData({ email: e.target.value })}
                placeholder="hello@yourbusiness.com"
                className="flex-1"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Business Address</Label>
            <div className="flex items-start gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-500 mt-3" />
              <Textarea
                id="address"
                value={footerData.address}
                onChange={(e) => updateFooterData({ address: e.target.value })}
                placeholder="123 Main Street, City, State 12345"
                className="flex-1"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Social Media Links</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(footerData.socialLinks).map(([platform, url]) => (
            <div key={platform}>
              <Label htmlFor={platform} className="flex items-center gap-2">
                {getSocialIcon(platform)}
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Label>
              <Input
                id={platform}
                value={url as string}
                onChange={(e) => updateFooterData({
                  socialLinks: {
                    ...footerData.socialLinks,
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

      {/* Quick Links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Quick Links</h4>
          <Button onClick={addQuickLink} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Link
          </Button>
        </div>

        <div className="space-y-3">
          {footerData.quickLinks.map((link: any, index: number) => (
            <Card key={link.id} className="border-gray-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <Input
                      value={link.label}
                      onChange={(e) => updateQuickLink(link.id, 'label', e.target.value)}
                      placeholder="Link label"
                    />
                    <Input
                      value={link.href}
                      onChange={(e) => updateQuickLink(link.id, 'href', e.target.value)}
                      placeholder="Link URL"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuickLink(link.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Legal Links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Legal Links</h4>
          <Button onClick={addLegalLink} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Legal Link
          </Button>
        </div>

        <div className="space-y-3">
          {footerData.legalLinks.map((link: any, index: number) => (
            <Card key={link.id} className="border-gray-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <Input
                      value={link.label}
                      onChange={(e) => updateLegalLink(link.id, 'label', e.target.value)}
                      placeholder="Policy name"
                    />
                    <Input
                      value={link.href}
                      onChange={(e) => updateLegalLink(link.id, 'href', e.target.value)}
                      placeholder="Policy URL"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLegalLink(link.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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
      <Card>
        <CardContent className="p-0">
          <div 
            className="p-6"
            style={{ 
              backgroundColor: footerData.backgroundColor,
              color: footerData.textColor 
            }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Business Info */}
              <div>
                <h3 className="font-bold text-lg mb-3" style={{ color: footerData.textColor }}>
                  {footerData.businessName}
                </h3>
                <p className="text-sm opacity-75 mb-4">
                  {footerData.description}
                </p>
                {footerData.showContact && (
                  <div className="space-y-2 text-sm">
                    {footerData.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{footerData.phone}</span>
                      </div>
                    )}
                    {footerData.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{footerData.email}</span>
                      </div>
                    )}
                    {footerData.businessHours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{footerData.businessHours}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Links */}
              {footerData.showQuickLinks && (
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: footerData.textColor }}>
                    Quick Links
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {footerData.quickLinks.slice(0, 4).map((link: any) => (
                      <li key={link.id}>
                        <a 
                          href={link.href} 
                          className="hover:opacity-75 transition-opacity"
                          style={{ color: footerData.textColor }}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Social & Legal */}
              <div>
                {footerData.showSocial && (
                  <>
                    <h4 className="font-semibold mb-3" style={{ color: footerData.textColor }}>
                      Follow Us
                    </h4>
                    <div className="flex gap-3 mb-4">
                      {Object.entries(footerData.socialLinks).map(([platform, url]) => (
                        url && (
                          <a 
                            key={platform}
                            href={url as string}
                            className="p-2 rounded hover:opacity-75 transition-opacity"
                            style={{ backgroundColor: footerData.accentColor }}
                          >
                            {getSocialIcon(platform)}
                          </a>
                        )
                      ))}
                    </div>
                  </>
                )}
                
                <div className="text-xs opacity-75">
                  <div className="flex gap-4 mb-2">
                    {footerData.legalLinks.map((link: any) => (
                      <a 
                        key={link.id}
                        href={link.href}
                        className="hover:opacity-75"
                        style={{ color: footerData.textColor }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                  <div style={{ color: footerData.textColor }}>
                    {footerData.copyrightText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Advanced Footer Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Include essential business information for credibility</li>
              <li>• Add social media links to build your online presence</li>
              <li>• Keep legal links accessible for compliance</li>
              <li>• Use contrasting colors for better readability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};