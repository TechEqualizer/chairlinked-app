
import React from "react";
import { Separator } from "@/components/ui/separator";

interface ContentTabProps {
  pageData: any;
  onUpdate: (updates: any) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ pageData, onUpdate }) => {
  const handleSocialProofChange = (field: string, value: string) => {
    onUpdate({
      socialProof: {
        ...pageData.socialProof,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Content Editor Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Content Editor</h4>
      </div>
      
      <Separator className="my-3" />

      {/* Headline */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Headline</label>
        <textarea
          value={pageData.headline || ''}
          onChange={(e) => onUpdate({ headline: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          placeholder="Main headline"
          rows={2}
        />
      </div>

      {/* Subheadline */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Subheadline</label>
        <textarea
          value={pageData.subheadline || ''}
          onChange={(e) => onUpdate({ subheadline: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          placeholder="Supporting description"
          rows={3}
        />
      </div>

      {/* CTA Text */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Button Text</label>
        <input
          type="text"
          value={pageData.ctaText || ''}
          onChange={(e) => onUpdate({ ctaText: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="Call to action text"
        />
      </div>

      {/* Social Proof */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Social Proof</label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            value={pageData.socialProof?.yearsExperience || ''}
            onChange={(e) => handleSocialProofChange('yearsExperience', e.target.value)}
            className="px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
            placeholder="Years"
          />
          <input
            type="text"
            value={pageData.socialProof?.clientsServed || ''}
            onChange={(e) => handleSocialProofChange('clientsServed', e.target.value)}
            className="px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
            placeholder="Clients"
          />
          <input
            type="text"
            value={pageData.socialProof?.rating || ''}
            onChange={(e) => handleSocialProofChange('rating', e.target.value)}
            className="px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
            placeholder="Rating"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentTab;
