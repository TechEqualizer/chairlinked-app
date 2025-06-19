import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, DollarSign } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration?: string;
}

interface SimpleServicesEditorProps {
  sectionData: any;
  onSectionUpdate: (updates: any) => void;
}

export const SimpleServicesEditor: React.FC<SimpleServicesEditorProps> = ({
  sectionData,
  onSectionUpdate
}) => {
  const [services, setServices] = useState<Service[]>(
    sectionData.services || [
      { id: '1', title: '', description: '', price: '', duration: '' }
    ]
  );

  const updateServices = (updatedServices: Service[]) => {
    setServices(updatedServices);
    onSectionUpdate({ services: updatedServices });
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: '',
      description: '',
      price: '',
      duration: ''
    };
    updateServices([...services, newService]);
  };

  const removeService = (serviceId: string) => {
    if (services.length > 1) {
      updateServices(services.filter(s => s.id !== serviceId));
    }
  };

  const updateService = (serviceId: string, field: keyof Service, value: string) => {
    updateServices(
      services.map(service => 
        service.id === serviceId 
          ? { ...service, [field]: value }
          : service
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          What services do you offer?
        </h3>
        <p className="text-gray-600">
          Add your main services with descriptions and pricing. You can always add more later.
        </p>
      </div>

      <div className="grid gap-4">
        {services.map((service, index) => (
          <Card key={service.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Service {index + 1}</CardTitle>
                {services.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(service.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`service-title-${service.id}`}>Service Name *</Label>
                  <Input
                    id={`service-title-${service.id}`}
                    value={service.title}
                    onChange={(e) => updateService(service.id, 'title', e.target.value)}
                    placeholder="e.g., Hair Cut & Style"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`service-price-${service.id}`}>Price</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id={`service-price-${service.id}`}
                      value={service.price}
                      onChange={(e) => updateService(service.id, 'price', e.target.value)}
                      placeholder="65"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`service-description-${service.id}`}>Description</Label>
                <Textarea
                  id={`service-description-${service.id}`}
                  value={service.description}
                  onChange={(e) => updateService(service.id, 'description', e.target.value)}
                  placeholder="Brief description of what's included in this service..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor={`service-duration-${service.id}`}>Duration (optional)</Label>
                <Input
                  id={`service-duration-${service.id}`}
                  value={service.duration}
                  onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                  placeholder="e.g., 60 mins"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={addService}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Service
        </Button>
      </div>

      {services.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600">💡</div>
            <div>
              <h4 className="font-medium text-blue-900">Tips for great service listings:</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Use clear, specific service names</li>
                <li>• Include what's covered in each service</li>
                <li>• Price ranges are fine (e.g., "$50-80")</li>
                <li>• Add time estimates to help customers plan</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};