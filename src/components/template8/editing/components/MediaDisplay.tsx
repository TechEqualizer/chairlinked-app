
import React from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoInfoDisplay } from "./VideoInfoDisplay";
import { detectVideoPlatform, isDirectVideoUrl } from "../../utils/videoPlatforms";

interface MediaDisplayProps {
  currentMedia: string;
  mediaType: 'image' | 'video';
  brandColor: string;
  onRemove: (e: React.MouseEvent) => void;
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({
  currentMedia,
  mediaType,
  brandColor,
  onRemove
}) => {
  const platformInfo = detectVideoPlatform(currentMedia);

  return (
    <>
      {mediaType === 'video' ? (
        <div className="relative w-full h-full">
          {platformInfo ? (
            <div className="w-full h-full bg-black/90 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">{platformInfo.platform.icon}</div>
                <div className="text-sm font-medium">{platformInfo.platform.name}</div>
                <div className="text-xs opacity-75 mt-1">Video Link</div>
              </div>
            </div>
          ) : (
            <video
              src={currentMedia}
              className="w-full h-full object-cover"
              controls={false}
              muted
              loop
              autoPlay
            />
          )}
        </div>
      ) : (
        <img
          src={currentMedia}
          alt="Current media"
          className="w-full h-full object-cover"
        />
      )}
      
      <VideoInfoDisplay
        url={currentMedia}
        brandColor={brandColor}
        mediaType={mediaType}
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 h-6 w-6"
      >
        <X size={12} />
      </Button>
      
      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="text-center text-white">
          <Upload className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">Change Media</p>
        </div>
      </div>
    </>
  );
};
