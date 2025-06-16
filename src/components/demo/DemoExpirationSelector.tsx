
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEMO_EXPIRATION_OPTIONS } from '@/types/demoTypes';
import { Clock } from 'lucide-react';

interface DemoExpirationSelectorProps {
  value: number;
  onChange: (hours: number) => void;
  disabled?: boolean;
}

export const DemoExpirationSelector: React.FC<DemoExpirationSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Clock size={16} />
        Demo Expiration
      </label>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val))}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select expiration time" />
        </SelectTrigger>
        <SelectContent>
          {DEMO_EXPIRATION_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
