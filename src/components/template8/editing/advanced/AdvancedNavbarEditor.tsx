import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Upload, Palette, Layout, Wand2, Star, Menu, Home, Info, Briefcase, Image as ImageIcon, Phone } from 'lucide-react';

interface AdvancedNavbarEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
}

export const AdvancedNavbarEditor: React.FC<AdvancedNavbarEditorProps> = ({
  sectionData,
  onSectionUpdate,
  activePanel,
  onPanelChange
}) => {
  const [navbarData, setNavbarData] = useState({
    businessName: sectionData.businessName || 'Your Business',
    logoUrl: sectionData.logoUrl || '',
    tagline: sectionData.tagline || '',
    navItems: sectionData.navItems || [
      { id: '1', label: 'Home', href: '#home', icon: 'home' },
      { id: '2', label: 'About', href: '#about', icon: 'info' },
      { id: '3', label: 'Services', href: '#services', icon: 'briefcase' },
      { id: '4', label: 'Gallery', href: '#gallery', icon: 'image' },
      { id: '5', label: 'Contact', href: '#contact', icon: 'phone' }
    ],
    navStyle: sectionData.navStyle || 'modern',
    navPosition: sectionData.navPosition || 'sticky',
    showLogo: sectionData.showLogo !== false,
    showTagline: sectionData.showTagline !== false,
    brandColor: sectionData.brandColor || '#8B5CF6',
    backgroundColor: sectionData.backgroundColor || '#ffffff',
    textColor: sectionData.textColor || '#374151',
    ...sectionData
  });

  const updateNavbarData = (updates: any) => {
    const newData = { ...navbarData, ...updates };
    setNavbarData(newData);
    onSectionUpdate(newData);
  };

  const updateNavItem = (itemId: string, field: string, value: any) => {
    const updatedItems = navbarData.navItems.map((item: any) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateNavbarData({ navItems: updatedItems });
  };

  const addNavItem = () => {
    const newItem = {
      id: Date.now().toString(),
      label: 'New Item',
      href: '#new',
      icon: 'menu'
    };
    updateNavbarData({ navItems: [...navbarData.navItems, newItem] });
  };

  const removeNavItem = (itemId: string) => {
    const updatedItems = navbarData.navItems.filter((item: any) => item.id !== itemId);
    updateNavbarData({ navItems: updatedItems });
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      home: Home,
      info: Info,
      briefcase: Briefcase,
      image: ImageIcon,
      phone: Phone,
      menu: Menu
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Menu;
    return <IconComponent className="w-4 h-4" />;
  };

  const renderBrandPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Brand Identity</h4>
      
      <div>
        <Label htmlFor="brandColor">Primary Brand Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="brandColor"
            type="color"
            value={navbarData.brandColor}
            onChange={(e) => updateNavbarData({ brandColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={navbarData.brandColor}
            onChange={(e) => updateNavbarData({ brandColor: e.target.value })}
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
            value={navbarData.backgroundColor}
            onChange={(e) => updateNavbarData({ backgroundColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={navbarData.backgroundColor}
            onChange={(e) => updateNavbarData({ backgroundColor: e.target.value })}
            placeholder="#ffffff"
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
            value={navbarData.textColor}
            onChange={(e) => updateNavbarData({ textColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={navbarData.textColor}
            onChange={(e) => updateNavbarData({ textColor: e.target.value })}
            placeholder="#374151"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Color Schemes</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Light', bg: '#ffffff', text: '#374151', brand: '#8B5CF6' },
            { name: 'Dark', bg: '#1f2937', text: '#f9fafb', brand: '#a855f7' },
            { name: 'Minimal', bg: '#f9fafb', text: '#111827', brand: '#6366f1' },
            { name: 'Elegant', bg: '#000000', text: '#ffffff', brand: '#fbbf24' }
          ].map((scheme) => (
            <button
              key={scheme.name}
              onClick={() => updateNavbarData({
                backgroundColor: scheme.bg,
                textColor: scheme.text,
                brandColor: scheme.brand
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
                <div className="w-2 h-2 rounded" style={{ backgroundColor: scheme.brand }} />
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
      <h4 className="font-semibold text-gray-900">Navigation Layout</h4>
      
      <div>
        <Label>Navigation Style</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Modern', value: 'modern' },
            { name: 'Classic', value: 'classic' },
            { name: 'Minimal', value: 'minimal' },
            { name: 'Bold', value: 'bold' }
          ].map((style) => (
            <button
              key={style.value}
              onClick={() => updateNavbarData({ navStyle: style.value })}
              className={`p-2 border rounded text-sm ${
                navbarData.navStyle === style.value
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
        <Label>Navigation Position</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Sticky', value: 'sticky' },
            { name: 'Fixed', value: 'fixed' },
            { name: 'Static', value: 'static' },
            { name: 'Floating', value: 'floating' }
          ].map((position) => (
            <button
              key={position.value}
              onClick={() => updateNavbarData({ navPosition: position.value })}
              className={`p-2 border rounded text-sm ${
                navbarData.navPosition === position.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {position.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Display Options</Label>
        <div className="space-y-3 mt-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={navbarData.showLogo}
              onChange={(e) => updateNavbarData({ showLogo: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show logo/business name</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={navbarData.showTagline}
              onChange={(e) => updateNavbarData({ showTagline: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Show tagline</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderContentPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Navigation Templates</h4>
      
      <div className="space-y-3">
        {[
          {
            name: 'Hair Salon',
            items: [
              { label: 'Home', href: '#home', icon: 'home' },
              { label: 'Services', href: '#services', icon: 'briefcase' },
              { label: 'Gallery', href: '#gallery', icon: 'image' },
              { label: 'Pricing', href: '#pricing', icon: 'menu' },
              { label: 'Book Now', href: '#contact', icon: 'phone' }
            ]
          },
          {
            name: 'Beauty Spa',
            items: [
              { label: 'Home', href: '#home', icon: 'home' },
              { label: 'About', href: '#about', icon: 'info' },
              { label: 'Treatments', href: '#services', icon: 'briefcase' },
              { label: 'Gallery', href: '#gallery', icon: 'image' },
              { label: 'Contact', href: '#contact', icon: 'phone' }
            ]
          },
          {
            name: 'Photography',
            items: [
              { label: 'Home', href: '#home', icon: 'home' },
              { label: 'Portfolio', href: '#gallery', icon: 'image' },
              { label: 'Services', href: '#services', icon: 'briefcase' },
              { label: 'About', href: '#about', icon: 'info' },
              { label: 'Contact', href: '#contact', icon: 'phone' }
            ]
          }
        ].map((template) => (
          <button
            key={template.name}
            onClick={() => {
              const newItems = template.items.map((item, index) => ({
                id: Date.now() + index,
                ...item
              }));
              updateNavbarData({ navItems: newItems });
            }}
            className="w-full p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-sm">{template.name}</div>
            <div className="text-xs text-gray-600 mt-1">
              {template.items.map(item => item.label).join(' • ')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Business Identity */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Identity</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={navbarData.businessName}
              onChange={(e) => updateNavbarData({ businessName: e.target.value })}
              placeholder="Your Business Name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="tagline">Tagline (Optional)</Label>
            <Input
              id="tagline"
              value={navbarData.tagline}
              onChange={(e) => updateNavbarData({ tagline: e.target.value })}
              placeholder="Your professional tagline"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="logoUrl">Logo URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="logoUrl"
                value={navbarData.logoUrl}
                onChange={(e) => updateNavbarData({ logoUrl: e.target.value })}
                placeholder="https://your-logo-url.com/logo.png"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const placeholderUrl = `https://images.unsplash.com/photo-${Date.now()}?w=200&h=100&fit=crop`;
                      updateNavbarData({ logoUrl: placeholderUrl });
                    }
                  };
                  input.click();
                }}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Navigation Menu</h4>
          <Button onClick={addNavItem} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Menu Item
          </Button>
        </div>

        <div className="space-y-4">
          {navbarData.navItems.map((item: any, index: number) => (
            <Card key={item.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Menu Item {index + 1}</h5>
                  {navbarData.navItems.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNavItem(item.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => updateNavItem(item.id, 'label', e.target.value)}
                      placeholder="Menu label"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Link</Label>
                    <Input
                      value={item.href}
                      onChange={(e) => updateNavItem(item.id, 'href', e.target.value)}
                      placeholder="#section or URL"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Icon</Label>
                    <div className="flex gap-2 mt-1">
                      <div className="flex items-center justify-center w-10 h-10 border rounded bg-gray-50">
                        {getIconComponent(item.icon)}
                      </div>
                      <select
                        value={item.icon}
                        onChange={(e) => updateNavItem(item.id, 'icon', e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md"
                      >
                        <option value="home">Home</option>
                        <option value="info">Info</option>
                        <option value="briefcase">Briefcase</option>
                        <option value="image">Image</option>
                        <option value="phone">Phone</option>
                        <option value="menu">Menu</option>
                      </select>
                    </div>
                  </div>
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
              {activePanel === 'brand' && <Palette className="w-4 h-4" />}
              {activePanel === 'layout' && <Layout className="w-4 h-4" />}
              {activePanel === 'content' && <Wand2 className="w-4 h-4" />}
              <span className="capitalize">{activePanel} Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePanel === 'brand' && renderBrandPanel()}
            {activePanel === 'layout' && renderLayoutPanel()}
            {activePanel === 'content' && renderContentPanel()}
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      <Card>
        <CardContent className="p-0">
          <div 
            className="p-4 border-b"
            style={{ 
              backgroundColor: navbarData.backgroundColor,
              color: navbarData.textColor 
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {navbarData.showLogo && navbarData.logoUrl && (
                  <img 
                    src={navbarData.logoUrl} 
                    alt="Logo"
                    className="h-8 w-auto"
                  />
                )}
                <div>
                  <div className="font-bold text-lg">{navbarData.businessName}</div>
                  {navbarData.showTagline && navbarData.tagline && (
                    <div className="text-sm opacity-75">{navbarData.tagline}</div>
                  )}
                </div>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                {navbarData.navItems.slice(0, 5).map((item: any) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-2 hover:opacity-75 transition-opacity"
                    style={{ color: navbarData.textColor }}
                  >
                    {getIconComponent(item.icon)}
                    <span className="text-sm">{item.label}</span>
                  </a>
                ))}
              </nav>
              
              <div className="md:hidden">
                <Menu className="w-6 h-6" style={{ color: navbarData.textColor }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Advanced Navigation Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Keep navigation simple with 5-7 main items</li>
              <li>• Use descriptive labels that customers understand</li>
              <li>• Make sure your logo is high quality and properly sized</li>
              <li>• Consider a sticky navbar for easy access while scrolling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};