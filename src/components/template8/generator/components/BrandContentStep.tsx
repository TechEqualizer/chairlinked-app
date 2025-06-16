
import React from "react";
import { motion } from "framer-motion";
import { Input, Textarea } from "@/components/template8/design-system/components/Input";
import { Label } from "@/components/template8/design-system/components/Typography";
import { IndustryConfig } from "../services/IndustryService";

interface FormData {
  tagline: string;
  headline: string;
  subheadline: string;
  description: string;
  brandColor: string;
  fontFamily: string;
  useAIGeneration: boolean;
}

interface BrandContentStepProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
  selectedIndustry: IndustryConfig | null;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

const BrandContentStep: React.FC<BrandContentStepProps> = ({
  formData,
  onInputChange,
  selectedIndustry,
  onNext,
  onPrevious,
  canProceed
}) => {
  console.log('[BrandContentStep] Rendering with formData:', {
    headline: formData.headline,
    subheadline: formData.subheadline,
    selectedIndustry: selectedIndustry?.name,
    useAIGeneration: formData.useAIGeneration
  });

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customize Your Brand Content</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.useAIGeneration}
            onChange={(e) => onInputChange('useAIGeneration', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">Use AI suggestions</span>
        </label>
      </div>

      <div>
        <Label htmlFor="tagline">Business Tagline</Label>
        <Input
          id="tagline"
          value={formData.tagline}
          onChange={(e) => onInputChange('tagline', e.target.value)}
          placeholder="Your compelling tagline"
          fullWidth
        />
        {selectedIndustry && formData.useAIGeneration && selectedIndustry.taglineTemplates && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">AI suggestions:</p>
            {selectedIndustry.taglineTemplates.slice(0, 3).map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onInputChange('tagline', template)}
                className="block w-full text-left px-3 py-1 text-sm bg-gray-50 rounded hover:bg-gray-100"
              >
                {template}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="headline">Main Headline</Label>
        <Input
          id="headline"
          value={formData.headline}
          onChange={(e) => onInputChange('headline', e.target.value)}
          placeholder="Your powerful main headline"
          fullWidth
        />
        {selectedIndustry && formData.useAIGeneration && selectedIndustry.headlineTemplates && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">AI suggestions:</p>
            {selectedIndustry.headlineTemplates.slice(0, 3).map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onInputChange('headline', template)}
                className="block w-full text-left px-3 py-1 text-sm bg-gray-50 rounded hover:bg-gray-100"
              >
                {template}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="subheadline">Subheadline</Label>
        <Textarea
          id="subheadline"
          value={formData.subheadline}
          onChange={(e) => onInputChange('subheadline', e.target.value)}
          placeholder="Supporting text that elaborates on your headline"
          fullWidth
          rows={2}
        />
        {selectedIndustry && formData.useAIGeneration && selectedIndustry.subheadlineTemplates && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">AI suggestions:</p>
            {selectedIndustry.subheadlineTemplates.slice(0, 2).map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onInputChange('subheadline', template)}
                className="block w-full text-left px-3 py-1 text-sm bg-gray-50 rounded hover:bg-gray-100"
              >
                {template}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="description">Additional Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Any additional details about your business"
          fullWidth
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brandColor">Brand Color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.brandColor}
              onChange={(e) => onInputChange('brandColor', e.target.value)}
              className="w-12 h-10 rounded border"
            />
            <Input
              value={formData.brandColor}
              onChange={(e) => onInputChange('brandColor', e.target.value)}
              className="flex-1"
            />
          </div>
          {selectedIndustry && selectedIndustry.brandColors && (
            <div className="flex gap-2 mt-2">
              {selectedIndustry.brandColors.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onInputChange('brandColor', color)}
                  className="w-6 h-6 rounded border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="fontFamily">Font Style</Label>
          <select
            id="fontFamily"
            value={formData.fontFamily}
            onChange={(e) => onInputChange('fontFamily', e.target.value)}
            className="w-full h-10 px-3 rounded border border-gray-300"
          >
            <option value="Inter">Inter (Modern)</option>
            <option value="Playfair Display">Playfair Display (Elegant)</option>
            <option value="Roboto">Roboto (Clean)</option>
            <option value="Open Sans">Open Sans (Friendly)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="bg-purple-800 hover:bg-purple-900 text-white font-medium px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};

export default BrandContentStep;
