
import React from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { Template8GalleryImage } from '../hooks/useTemplate8Data';
import { detectVideoPlatform, isDirectVideoUrl } from '../utils/videoPlatforms';

interface GalleryMediaRendererProps {
  image: Template8GalleryImage;
  mutedVideos: Set<number>;
  onVideoRef: (element: HTMLVideoElement | null, id: number) => void;
  onToggleMute: (id: number) => void;
  onSetMutedVideos: (setter: (prev: Set<number>) => Set<number>) => void;
}

const GalleryMediaRenderer: React.FC<GalleryMediaRendererProps> = ({
  image,
  mutedVideos,
  onVideoRef,
  onToggleMute,
  onSetMutedVideos
}) => {
  // Add robust null safety checks
  if (!image) {
    console.warn('[GalleryMediaRenderer] Received null/undefined image');
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No media</span>
      </div>
    );
  }

  if (!image.image) {
    console.warn('[GalleryMediaRenderer] Image object missing image URL:', image);
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Invalid media</span>
      </div>
    );
  }

  const isVideo = image.mediaType === 'video';
  
  const getAutoPlayEmbedUrl = (platformInfo: any, id: string) => {
    try {
      const { platform } = platformInfo;
      const baseUrl = platform.getEmbedUrl(id);
      
      if (platform.name === 'YouTube') {
        return `${baseUrl}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1`;
      } else if (platform.name === 'Vimeo') {
        return `${baseUrl}?autoplay=1&muted=1&loop=1&controls=0`;
      } else if (platform.name === 'Wistia') {
        return `${baseUrl}?autoplay=1&muted=1&controls=0`;
      }
      
      return baseUrl;
    } catch (error) {
      console.error('[GalleryMediaRenderer] Error generating embed URL:', error);
      return '';
    }
  };

  if (!isVideo) {
    return (
      <img
        src={image.image}
        alt={`Gallery post ${image.id}`}
        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        onError={(e) => {
          console.error('[GalleryMediaRenderer] Image load error:', image.image);
          e.currentTarget.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158";
        }}
      />
    );
  }

  // Handle video content with error handling
  try {
    const platformInfo = detectVideoPlatform(image.image);
    
    if (platformInfo) {
      // Platform video (YouTube, Vimeo, etc.)
      const embedUrl = getAutoPlayEmbedUrl(platformInfo, platformInfo.id);
      if (!embedUrl) {
        throw new Error('Failed to generate embed URL');
      }

      return (
        <div className="relative w-full h-full bg-black flex items-center justify-center group">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`Video ${image.id}`}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none" />
        </div>
      );
    } else if (isDirectVideoUrl(image.image)) {
      // Direct video file
      return (
        <div className="relative w-full h-full group">
          <video
            ref={(el) => onVideoRef && onVideoRef(el, image.id)}
            src={image.image}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => {
              if (onSetMutedVideos) {
                onSetMutedVideos(prev => new Set([...prev, image.id]));
              }
            }}
            onError={(e) => {
              console.error('[GalleryMediaRenderer] Video load error:', image.image);
            }}
          />
          
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          
          {onToggleMute && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute(image.id);
              }}
              className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              {mutedVideos.has(image.id) ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
          )}
        </div>
      );
    }
  } catch (error) {
    console.error('[GalleryMediaRenderer] Video processing error:', error);
  }

  // Fallback for invalid video URLs or errors
  return (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
      <div className="text-center text-white">
        <Play className="w-12 h-12 mx-auto mb-2 opacity-60" />
        <p className="text-sm opacity-75">Video unavailable</p>
      </div>
    </div>
  );
};

export default GalleryMediaRenderer;
