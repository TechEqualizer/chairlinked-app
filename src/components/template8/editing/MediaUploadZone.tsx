
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MediaDisplay } from "./components/MediaDisplay";
import { UploadInterface } from "./components/UploadInterface";
import { handleFileSelect, handleVideoUrlSubmit, getAspectClasses } from "./utils/mediaHandlers";

interface MediaUploadZoneProps {
  currentMedia?: string;
  mediaType?: 'image' | 'video';
  onMediaChange: (mediaUrl: string, type: 'image' | 'video') => void;
  aspectRatio?: string;
  className?: string;
  brandColor?: string;
  showDimensionHint?: boolean;
  acceptVideo?: boolean;
}

const MediaUploadZone: React.FC<MediaUploadZoneProps> = ({
  currentMedia,
  mediaType = 'image',
  onMediaChange,
  aspectRatio = "16:9",
  className = "",
  brandColor = "#8B5CF6",
  showDimensionHint = true,
  acceptVideo = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [activeTab, setActiveTab] = useState("upload");

  const aspectClasses = getAspectClasses();
  const acceptTypes = acceptVideo ? "image/*,video/*" : "image/*";

  const handleClick = () => {
    if (activeTab === "upload") {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMediaChange("", 'image');
    setVideoUrl("");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    setUrlError("");
  };

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event, onMediaChange, setIsUploading);
  };

  const onVideoUrlSubmit = () => {
    handleVideoUrlSubmit(videoUrl, onMediaChange, setVideoUrl, setUrlError);
  };

  const onFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Improved dynamic sizing with better minimum heights
  const containerClasses = currentMedia 
    ? `${aspectClasses[aspectRatio as keyof typeof aspectClasses] || "aspect-video"}`
    : activeTab === "link" && acceptVideo
    ? "min-h-[420px]" // Increased from 360px to accommodate video link interface
    : "min-h-[320px]"; // Increased from 280px for better upload interface

  return (
    <motion.div
      whileHover={{ scale: currentMedia ? 1.02 : 1.01 }}
      onClick={handleClick}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed 
        hover:border-opacity-80 transition-all overflow-hidden bg-gray-50/80 backdrop-blur-sm
        hover:bg-gray-100/80 hover:shadow-lg
        ${containerClasses}
        ${className}
      `}
      style={{
        borderColor: currentMedia ? brandColor + '80' : '#9CA3AF',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        onChange={onFileSelect}
        className="hidden"
      />
      
      {currentMedia ? (
        <MediaDisplay
          currentMedia={currentMedia}
          mediaType={mediaType}
          brandColor={brandColor}
          onRemove={handleRemove}
        />
      ) : (
        <div className="flex flex-col h-full p-4" onClick={(e) => e.stopPropagation()}>
          <UploadInterface
            isUploading={isUploading}
            acceptVideo={acceptVideo}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            videoUrl={videoUrl}
            urlError={urlError}
            brandColor={brandColor}
            showDimensionHint={showDimensionHint}
            aspectRatio={aspectRatio}
            onFileUploadClick={onFileUploadClick}
            onUrlChange={handleUrlChange}
            onVideoUrlSubmit={onVideoUrlSubmit}
          />
        </div>
      )}
    </motion.div>
  );
};

export default MediaUploadZone;
