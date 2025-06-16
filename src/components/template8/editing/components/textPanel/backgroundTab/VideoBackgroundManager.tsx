
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { isValidVideoUrl } from "../../../../utils/videoPlatforms";

interface VideoBackgroundManagerProps {
  backgroundVideo?: string;
  onVideoSubmit: (url: string) => void;
  onRemove: () => void;
}

const VideoBackgroundManager: React.FC<VideoBackgroundManagerProps> = ({
  backgroundVideo,
  onVideoSubmit,
  onRemove
}) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const handleSubmit = () => {
    if (!videoUrl.trim()) {
      setUrlError("Please enter a video URL");
      return;
    }

    if (!isValidVideoUrl(videoUrl)) {
      setUrlError("Please enter a valid YouTube or Wistia URL");
      return;
    }

    setUrlError("");
    onVideoSubmit(videoUrl);
    setVideoUrl("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-600">Video Background</label>
        {backgroundVideo && (
          <button
            onClick={onRemove}
            className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove video background"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      
      {!backgroundVideo ? (
        <div className="space-y-2">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setUrlError("");
            }}
            placeholder="Enter YouTube or Wistia URL"
            className="w-full px-2 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          {urlError && (
            <p className="text-xs text-red-500">{urlError}</p>
          )}
          <button
            onClick={handleSubmit}
            className="w-full px-2 py-2 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Video Background
          </button>
        </div>
      ) : (
        <div className="p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Current video:</p>
          <p className="text-xs text-gray-800 break-all">{backgroundVideo}</p>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-1">Supports YouTube and Wistia videos</p>
    </div>
  );
};

export default VideoBackgroundManager;
