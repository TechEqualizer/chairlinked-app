
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { DemoClaimData } from '@/types/demoTypes';
import { Button } from '@/components/ui/button';

interface ClaimFormFieldsProps {
  formData: DemoClaimData;
  setFormData: React.Dispatch<React.SetStateAction<DemoClaimData>>;
  completedFields: Set<string>;
}

interface FieldError {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const ClaimFormFields: React.FC<ClaimFormFieldsProps> = ({
  formData,
  setFormData,
  completedFields
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<FieldError>({});
  const [touched, setTouched] = React.useState<Set<string>>(new Set());

  // Real-time validation
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        // Also validate confirm password if it exists
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (formData.confirmPassword && value === formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (touched.has(name)) {
      validateField(name, value);
    }
  };

  const handleFieldBlur = (name: string, value: string) => {
    setTouched(prev => new Set([...prev, name]));
    validateField(name, value);
  };

  return (
    <div className="space-y-3 sm:space-y-2">
      {/* Name Field */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-1">Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-2.5 flex items-center pointer-events-none">
            <User className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-gray-400" />
          </div>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            onBlur={(e) => handleFieldBlur('name', e.target.value)}
            placeholder="Your name"
            required
            className={`pl-10 sm:pl-8 h-10 sm:h-8 text-sm rounded-md transition-colors ${
              errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 
              'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
            }`}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-1">Email</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-2.5 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-gray-400" />
          </div>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            onBlur={(e) => handleFieldBlur('email', e.target.value)}
            placeholder="your@email.com"
            required
            className={`pl-10 sm:pl-8 h-10 sm:h-8 text-sm rounded-md transition-colors ${
              errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 
              'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-1">Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-2.5 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-gray-400" />
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            onBlur={(e) => handleFieldBlur('password', e.target.value)}
            placeholder="Password (6+ chars)"
            required
            className={`pl-10 sm:pl-8 pr-10 sm:pr-8 h-10 sm:h-8 text-sm rounded-md transition-colors ${
              errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 
              'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
            }`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-2 sm:px-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-gray-400" /> : <Eye className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-gray-400" />}
          </Button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-1">Confirm Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-2.5 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-gray-400" />
          </div>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
            onBlur={(e) => handleFieldBlur('confirmPassword', e.target.value)}
            placeholder="Confirm password"
            required
            className={`pl-10 sm:pl-8 pr-10 sm:pr-8 h-10 sm:h-8 text-sm rounded-md transition-colors ${
              errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 
              'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
            }`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-2 sm:px-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-gray-400" /> : <Eye className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-gray-400" />}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Terms Agreement */}
      <div className="pt-2 sm:pt-1">
        <div className="flex items-start space-x-3 sm:space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, agreeToTerms: checked as boolean })
            }
            className="mt-1 sm:mt-0.5 h-4 w-4 sm:h-3.5 sm:w-3.5 flex-shrink-0"
          />
          <label
            htmlFor="terms"
            className="text-xs sm:text-xs text-gray-600 leading-relaxed cursor-pointer"
          >
            I agree to the{' '}
            <a href="/terms" target="_blank" className="text-purple-600 hover:text-purple-700 font-medium underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" className="text-purple-600 hover:text-purple-700 font-medium underline">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>
    </div>
  );
};
