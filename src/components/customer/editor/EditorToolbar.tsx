
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save, Globe } from 'lucide-react';

interface EditorToolbarProps {
  displayBusinessName: string;
  status: 'published' | 'draft' | string;
  siteType: string;
  hasChanges: boolean;
  onRevert: () => void;
  isSaving: boolean;
  onSave: () => void;
  isPublishing: boolean;
  onPublish: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  displayBusinessName,
  status,
  siteType,
  hasChanges,
  onRevert,
  isSaving,
  onSave,
  isPublishing,
  onPublish,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between w-full h-16 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">{displayBusinessName}</h2>
        <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                status === 'published' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
                {status === 'published' ? 'Published' : 'Unpublished Changes'}
            </span>
            {siteType === 'live' && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                LIVE SITE
                </span>
            )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {hasChanges && (
          <Button
            onClick={onRevert}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Revert
          </Button>
        )}
        
        <Button
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>

        <Button
          onClick={onPublish}
          disabled={!hasChanges || isPublishing}
          size="sm"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Globe className="w-4 h-4" />
          {isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </div>
  );
};
