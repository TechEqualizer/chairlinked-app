
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Grip } from 'lucide-react';

interface CustomerServicesEditorProps {
  data: any;
  onUpdate: (updates: any) => void;
}

export const CustomerServicesEditor: React.FC<CustomerServicesEditorProps> = ({
  data,
  onUpdate
}) => {
  const services = data?.services || [];

  const handleServiceUpdate = (index: number, field: string, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    onUpdate({ services: updatedServices });
  };

  const handleAddService = () => {
    const newService = {
      title: "New Service",
      description: "Service description",
      price: "Starting at $50"
    };
    onUpdate({ services: [...services, newService] });
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    onUpdate({ services: updatedServices });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Services</h3>
          <p className="text-sm text-gray-600">Manage your service offerings</p>
        </div>
        <Button onClick={handleAddService} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </div>

      <div className="space-y-4">
        {services.map((service: any, index: number) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-2 cursor-move">
                <Grip className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Service Name
                  </label>
                  <Input
                    value={service.title || ''}
                    onChange={(e) => handleServiceUpdate(index, 'title', e.target.value)}
                    placeholder="e.g., Haircut & Style"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Description
                  </label>
                  <Textarea
                    value={service.description || ''}
                    onChange={(e) => handleServiceUpdate(index, 'description', e.target.value)}
                    placeholder="Describe this service..."
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Price
                  </label>
                  <Input
                    value={service.price || ''}
                    onChange={(e) => handleServiceUpdate(index, 'price', e.target.value)}
                    placeholder="e.g., Starting at $75"
                  />
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveService(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
        
        {services.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No services added yet</p>
            <Button onClick={handleAddService} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Service
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
