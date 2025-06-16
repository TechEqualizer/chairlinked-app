
import React from "react";
import { Upload, Link, Image, Video, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadInterfaceProps {
  isUploading: boolean;
  acceptVideo: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  videoUrl: string;
  urlError: string;
  brandColor: string;
  showDimensionHint: boolean;
  aspectRatio: string;
  onFileUploadClick: () => void;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoUrlSubmit: () => void;
}

export const UploadInterface: React.FC<UploadInterfaceProps> = ({
  isUploading,
  acceptVideo,
  activeTab,
  setActiveTab,
  videoUrl,
  urlError,
  brandColor,
  showDimensionHint,
  aspectRatio,
  onFileUploadClick,
  onUrlChange,
  onVideoUrlSubmit
}) => {
  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mb-3"></div>
        <p className="text-sm text-gray-600">Uploading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation - More compact design */}
      {acceptVideo && (
        <div className="flex bg-gray-100 rounded-lg p-0.5 mb-3">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "upload"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Upload size={14} />
            Upload
          </button>
          <button
            onClick={() => setActiveTab("link")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "link"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Link size={14} />
            Video Link
          </button>
        </div>
      )}

      {/* Content Area - Better space utilization */}
      <div className="flex-1 flex flex-col justify-center">
        {activeTab === "upload" ? (
          <div className="text-center">
            <div className="mb-3">
              <div 
                className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: brandColor + '20' }}
              >
                {acceptVideo ? <Video size={20} style={{ color: brandColor }} /> : <Image size={20} style={{ color: brandColor }} />}
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                {acceptVideo ? "Upload Media" : "Upload Image"}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {acceptVideo ? "Choose an image or video file" : "Choose an image file"}
              </p>
            </div>
            
            <Button
              onClick={onFileUploadClick}
              className="mb-3"
              style={{ backgroundColor: brandColor }}
            >
              <Upload size={16} className="mr-2" />
              Choose File
            </Button>
            
            {showDimensionHint && (
              <p className="text-xs text-gray-500">
                Recommended: {aspectRatio === "1:1" ? "Square" : aspectRatio === "16:9" ? "Landscape" : aspectRatio} format
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <div 
                className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: brandColor + '20' }}
              >
                <Globe size={20} style={{ color: brandColor }} />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">Add Video Link</h3>
              <p className="text-sm text-gray-600">
                Paste a YouTube, Vimeo, or direct video URL
              </p>
            </div>
            
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={onUrlChange}
                className={`w-full ${urlError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              
              {urlError && (
                <p className="text-sm text-red-600">{urlError}</p>
              )}
              
              <Button
                onClick={onVideoUrlSubmit}
                disabled={!videoUrl.trim()}
                className="w-full"
                style={{ backgroundColor: brandColor }}
              >
                <Link size={16} className="mr-2" />
                Add Video
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 text-center space-y-0.5 pt-2">
              <p>Supported platforms:</p>
              <p>YouTube • Vimeo • Direct MP4 links</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
