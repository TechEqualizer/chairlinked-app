import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Palette, Type, Layout, Wand2, DollarSign, Clock, Star } from 'lucide-react';

interface AdvancedServicesEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
  activePanel: string | null;
  onPanelChange: (panel: string | null) => void;
}

export const AdvancedServicesEditor: React.FC<AdvancedServicesEditorProps> = ({
  sectionData,
  onSectionUpdate,
  activePanel,
  onPanelChange
}) => {
  const [servicesData, setServicesData] = useState({
    services: sectionData.services || [
      { id: '1', title: '', description: '', price: '', duration: '', featured: false }
    ],
    sectionTitle: sectionData.sectionTitle || 'Our Services',
    sectionSubtitle: sectionData.sectionSubtitle || 'Professional services tailored to your needs',
    servicesLayout: sectionData.servicesLayout || 'grid',
    serviceCardStyle: sectionData.serviceCardStyle || 'modern',
    brandColor: sectionData.brandColor || '#8B5CF6',
    textColor: sectionData.textColor || '#374151',
    ...sectionData
  });

  const updateServicesData = (updates: any) => {
    const newData = { ...servicesData, ...updates };
    setServicesData(newData);
    onSectionUpdate(newData);
  };

  const updateService = (serviceId: string, field: string, value: any) => {
    const updatedServices = servicesData.services.map((service: any) =>
      service.id === serviceId ? { ...service, [field]: value } : service
    );
    updateServicesData({ services: updatedServices });
  };

  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      title: '',
      description: '',
      price: '',
      duration: '',
      featured: false
    };
    updateServicesData({ services: [...servicesData.services, newService] });
  };

  const removeService = (serviceId: string) => {
    const updatedServices = servicesData.services.filter((service: any) => service.id !== serviceId);
    updateServicesData({ services: updatedServices });
  };

  const renderContentPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Service Templates</h4>
      
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'Hair Services', services: ['Haircut & Style', 'Color Treatment', 'Hair Extensions'] },
          { name: 'Beauty Services', services: ['Facial Treatment', 'Makeup Application', 'Eyebrow Shaping'] },
          { name: 'Wellness', services: ['Massage Therapy', 'Aromatherapy', 'Relaxation Package'] },
          { name: 'Photography', services: ['Portrait Session', 'Event Photography', 'Product Photos'] }
        ].map((template) => (
          <button
            key={template.name}
            onClick={() => {
              const newServices = template.services.map((title, index) => ({
                id: Date.now() + index,
                title,
                description: `Professional ${title.toLowerCase()} service`,
                price: '$' + (50 + index * 25),
                duration: '1 hour',
                featured: index === 0
              }));
              updateServicesData({ services: newServices });
            }}
            className="p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium text-sm">{template.name}</div>
            <div className="text-xs text-gray-600 mt-1">
              {template.services.slice(0, 2).join(', ')}...
            </div>
          </button>
        ))}
      </div>

      <div>
        <Label>Quick Price Templates</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            { name: 'Budget', prices: ['$25', '$35', '$45'] },
            { name: 'Premium', prices: ['$75', '$100', '$125'] },
            { name: 'Luxury', prices: ['$150', '$200', '$250'] }
          ].map((template) => (
            <button
              key={template.name}
              onClick={() => {
                const updatedServices = servicesData.services.map((service: any, index: number) => ({
                  ...service,
                  price: template.prices[index] || template.prices[0]
                }));
                updateServicesData({ services: updatedServices });
              }}
              className="p-2 border rounded text-sm hover:bg-gray-50"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBrandPanel = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-900">Service Branding</h4>
      
      <div>
        <Label htmlFor="brandColor">Primary Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="brandColor"
            type="color"
            value={servicesData.brandColor}
            onChange={(e) => updateServicesData({ brandColor: e.target.value })}
            className="w-16 h-10 p-1 rounded"
          />
          <Input
            value={servicesData.brandColor}
            onChange={(e) => updateServicesData({ brandColor: e.target.value })}
            placeholder="#8B5CF6"
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <Label>Service Card Style</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { name: 'Modern', value: 'modern' },
            { name: 'Classic', value: 'classic' },
            { name: 'Minimal', value: 'minimal' },
            { name: 'Bold', value: 'bold' }
          ].map((style) => (
            <button
              key={style.value}
              onClick={() => updateServicesData({ serviceCardStyle: style.value })}
              className={`p-2 border rounded text-sm ${
                servicesData.serviceCardStyle === style.value
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
      <h4 className="font-semibold text-gray-900">Layout Options</h4>
      
      <div>
        <Label>Services Layout</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            { name: 'Grid', value: 'grid' },
            { name: 'List', value: 'list' },
            { name: 'Cards', value: 'cards' }
          ].map((layout) => (
            <button
              key={layout.value}
              onClick={() => updateServicesData({ servicesLayout: layout.value })}
              className={`p-2 border rounded text-sm ${
                servicesData.servicesLayout === layout.value
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {layout.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Columns per Row</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[1, 2, 3].map((cols) => (
            <button
              key={cols}
              onClick={() => updateServicesData({ servicesColumns: cols })}
              className={`p-2 border rounded text-sm ${
                servicesData.servicesColumns === cols
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {cols} Column{cols > 1 ? 's' : ''}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Section</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="sectionTitle">Section Title</Label>
            <Input
              id="sectionTitle"
              value={servicesData.sectionTitle}
              onChange={(e) => updateServicesData({ sectionTitle: e.target.value })}
              placeholder="Our Services"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sectionSubtitle">Section Subtitle</Label>
            <Textarea
              id="sectionSubtitle"
              value={servicesData.sectionSubtitle}
              onChange={(e) => updateServicesData({ sectionSubtitle: e.target.value })}
              placeholder="Professional services tailored to your needs"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Services List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Service Items</h4>
          <Button onClick={addService} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>

        <div className="space-y-4">
          {servicesData.services.map((service: any, index: number) => (
            <Card key={service.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-medium text-gray-900">Service {index + 1}</h5>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateService(service.id, 'featured', !service.featured)}
                      className={`p-1 rounded ${
                        service.featured ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                      }`}
                      title="Mark as featured"
                    >
                      <Star className="w-4 h-4" fill={service.featured ? 'currentColor' : 'none'} />
                    </button>
                    {servicesData.services.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(service.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Service Name</Label>
                    <Input
                      value={service.title}
                      onChange={(e) => updateService(service.id, 'title', e.target.value)}
                      placeholder="Service name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Price</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <Input
                        value={service.price}
                        onChange={(e) => updateService(service.id, 'price', e.target.value)}
                        placeholder="50"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={service.description}
                      onChange={(e) => updateService(service.id, 'description', e.target.value)}
                      placeholder="Describe this service"
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Duration</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <Input
                        value={service.duration}
                        onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                        placeholder="1 hour"
                        className="flex-1"
                      />
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
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {servicesData.sectionTitle}
            </h2>
            <p className="text-gray-600">
              {servicesData.sectionSubtitle}
            </p>
          </div>
          
          <div className={`grid gap-4 ${
            servicesData.servicesLayout === 'grid' 
              ? `grid-cols-1 md:grid-cols-${servicesData.servicesColumns || 2}` 
              : 'grid-cols-1'
          }`}>
            {servicesData.services.slice(0, 2).map((service: any) => (
              <div 
                key={service.id}
                className={`bg-white p-4 rounded-lg border ${
                  service.featured ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{service.title || 'Service Name'}</h4>
                  {service.featured && <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />}
                </div>
                <p className="text-gray-600 text-sm mb-3">{service.description || 'Service description'}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold" style={{ color: servicesData.brandColor }}>
                    {service.price || '$50'}
                  </span>
                  <span className="text-sm text-gray-500">{service.duration || '1 hour'}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Advanced Services Tips:</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Use featured services to highlight your most popular offerings</li>
              <li>• Keep descriptions clear and benefit-focused</li>
              <li>• Consider package deals for related services</li>
              <li>• Update pricing regularly to stay competitive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};