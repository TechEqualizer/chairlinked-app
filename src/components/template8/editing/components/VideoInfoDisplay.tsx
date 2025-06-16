
import React from "react";
import { Video, Image as ImageIcon } from "lucide-react";
import { detectVideoPlatform, isDirectVideoUrl } from "../../utils/videoPlatforms";

interface VideoInfoDisplayProps {
  url: string;
  brandColor: string;
  mediaType: 'image' | 'video';
}

export const VideoInfoDisplay: React.FC<VideoInfoDisplayProps> = ({
  url,
  brandColor,
  mediaType
}) => {
  const getVideoInfo = (url: string) => {
    const platformInfo = detectVideoPlatform(url);
    if (platformInfo) {
      return {
        platform: platformInfo.platform.name,
        icon: platformInfo.platform.icon,
        thumbnail: platformInfo.platform.getThumbnail(platformInfo.id)
      };
    }
    if (isDirectVideoUrl(url)) {
      return {
        platform: 'Direct Video',
        icon: '🎥',
        thumbnail: null
      };
    }
    return null;
  };

  const videoInfo = mediaType === 'video' ? getVideoInfo(url) : null;

  return (
    <div className="absolute top-2 left-2 z-10">
      <div 
        className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium"
        style={{ backgroundColor: brandColor }}
      >
        {mediaType === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
        {videoInfo ? videoInfo.platform : mediaType}
      </div>
    </div>
  );
};
