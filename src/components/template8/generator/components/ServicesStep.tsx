
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/template8/design-system/components/Input";
import { Label } from "@/components/template8/design-system/components/Typography";
import { Button } from "@/components/template8/design-system/components/Button";
import { Plus, X, Info } from "lucide-react";

interface Service {
  title: string;
  description: string;
  price: string;
  duration?: string;
}

interface FormData {
  services: Service[];
  industry: string;
}

interface ServicesStepProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
  selectedIndustry: any;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

const ServicesStep: React.FC<ServicesStepProps> = ({
  formData,
  onInputChange,
  selectedIndustry,
  onNext,
  onPrevious,
  canProceed
}) => {
  const [services, setServices] = useState<Service[]>(formData.services || []);

  // Initialize services from industry defaults when component mounts or industry changes
  useEffect(() => {
    if (selectedIndustry && selectedIndustry.defaultServices && (!services.length || services.length === 0)) {
      const defaultServices = selectedIndustry.defaultServices.map((service: any) => ({
        title: service.title,
        description: service.description,
        price: service.price,
        duration: service.duration || ''
      }));
      setServices(defaultServices);
      onInputChange('services', defaultServices);
    }
  }, [selectedIndustry, onInputChange]);

  // Update parent form data when services change
  useEffect(() => {
    onInputChange('services', services);
  }, [services, onInputChange]);

  const addService = () => {
    const newService: Service = {
      title: '',
      description: '',
      price: '',
      duration: ''
    };
    setServices([...services, newService]);
  };

  const removeService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const updatedServices = services.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    );
    setServices(updatedServices);
  };

  const hasValidServices = services.length > 0 && services.every(service => 
    service.title.trim() && service.description.trim() && service.price.trim()
  );

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">AI Photo Enhancement</h3>
            <p className="text-sm text-blue-700">
              Adding your services helps our AI generate more accurate and relevant stock photos for your website, 
              creating a better visual representation of your business.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Your Services</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addService}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Service
          </Button>
        </div>

        {services.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">No services added yet</p>
            <Button
              type="button"
              variant="primary"
              onClick={addService}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Your First Service
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <Label className="font-medium">Service {index + 1}</Label>
                {services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor={`service-title-${index}`}>Service Name *</Label>
                  <Input
                    id={`service-title-${index}`}
                    value={service.title}
                    onChange={(e) => updateService(index, 'title', e.target.value)}
                    placeholder="e.g., Haircut & Style"
                    fullWidth
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor={`service-description-${index}`}>Description *</Label>
                  <textarea
                    id={`service-description-${index}`}
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    placeholder="Brief description of the service"
                    className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <Label htmlFor={`service-price-${index}`}>Price *</Label>
                  <Input
                    id={`service-price-${index}`}
                    value={service.price}
                    onChange={(e) => updateService(index, 'price', e.target.value)}
                    placeholder="$75"
                    fullWidth
                  />
                </div>

                <div>
                  <Label htmlFor={`service-duration-${index}`}>Duration (Optional)</Label>
                  <Input
                    id={`service-duration-${index}`}
                    value={service.duration || ''}
                    onChange={(e) => updateService(index, 'duration', e.target.value)}
                    placeholder="60 min"
                    fullWidth
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        
        <button
          type="button"
          onClick={onNext}
          disabled={!hasValidServices}
          className="bg-purple-800 hover:bg-purple-900 text-white font-medium px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};

export default ServicesStep;
