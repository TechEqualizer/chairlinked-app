
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/template8/design-system/components/Input";
import { Label } from "@/components/template8/design-system/components/Typography";
import { Mail, Phone, Instagram } from "lucide-react";

interface FormData {
  contactEmail: string;
  phoneNumber: string;
  instagramHandle: string;
}

interface ContactStepProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
  onPrevious: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
}

const ContactStep: React.FC<ContactStepProps> = ({
  formData,
  onInputChange,
  onPrevious,
  onSubmit,
  isGenerating
}) => {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="contactEmail" required>Contact Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => onInputChange('contactEmail', e.target.value)}
              placeholder="your@email.com"
              className="pl-10"
              fullWidth
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => onInputChange('phoneNumber', e.target.value)}
              placeholder="(555) 123-4567"
              className="pl-10"
              fullWidth
            />
          </div>
        </div>

        <div>
          <Label htmlFor="instagramHandle">Instagram Handle (Optional)</Label>
          <div className="relative">
            <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="instagramHandle"
              value={formData.instagramHandle}
              onChange={(e) => onInputChange('instagramHandle', e.target.value)}
              placeholder="@yourbusiness"
              className="pl-10"
              fullWidth
            />
          </div>
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
          type="submit"
          disabled={isGenerating || !formData.contactEmail.trim()}
          className="bg-purple-800 hover:bg-purple-900 text-white font-medium px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isGenerating ? 'Generating...' : 'Generate Website'}
        </button>
      </div>
    </motion.div>
  );
};

export default ContactStep;
