
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save, Globe, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EditorHeaderProps {
  businessName: string;
  siteStatus: string;
  siteType: string;
  saving: boolean;
  hasChanges: boolean;
  claimedSiteLoading: boolean;
  onSave: () => void;
  onPublish: () => void;
  onRefresh: () => void;
  saveError?: string | null;
  lastSaveTime?: Date | null;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  businessName,
  siteStatus,
  siteType,
  saving,
  hasChanges,
  claimedSiteLoading,
  onSave,
  onPublish,
  onRefresh,
  saveError,
  lastSaveTime,
}) => {
  const navigate = useNavigate();
  const isLiveSite = siteType === 'live';

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-xl font-semibold">{businessName || 'Edit Your Website'}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>Status: {siteStatus}</span>
              {isLiveSite && <span className="text-green-600 font-medium">• Live Site</span>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={onRefresh}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            disabled={claimedSiteLoading}
          >
            <RefreshCw className={`w-4 h-4 ${claimedSiteLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {/* Enhanced save status indicators */}
          {saving && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </div>
          )}
          
          {saveError && !saving && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="max-w-48 truncate" title={saveError}>
                Save failed
              </span>
            </div>
          )}
          
          {!saving && !saveError && lastSaveTime && !hasChanges && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>
                Saved {lastSaveTime.toLocaleTimeString()}
              </span>
            </div>
          )}
          
          {hasChanges && !saving && !saveError && (
            <div className="text-sm text-orange-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              Unsaved changes
            </div>
          )}
          <Button
            onClick={onSave}
            disabled={!hasChanges || saving}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button
            onClick={onPublish}
            disabled={saving}
            size="sm"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Globe className="w-4 h-4" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};
