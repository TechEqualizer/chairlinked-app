
import React, { useState, useRef, useEffect } from "react";
import { X, Volume2, VolumeX, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { detectVideoPlatform, isDirectVideoUrl } from "../../utils/videoPlatforms";

interface StoryItem {
  type: 'image' | 'video';
  media: string;
  caption?: string;
  duration?: number;
}

interface StoryMediaDisplayProps {
  item: StoryItem | null;
  onError: () => void;
  onVideoEnd: () => void;
  hasError: boolean;
  onSkip: () => void;
}

const StoryMediaDisplay: React.FC<StoryMediaDisplayProps> = ({
  item,
  onError,
  onVideoEnd,
  hasError,
  onSkip
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showClickHint, setShowClickHint] = useState(true);
  const [showRipple, setShowRipple] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowClickHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setRipplePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    }

    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
    setShowClickHint(false);
  };

  const handlePlatformVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setRipplePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    }

    setIsMuted(!isMuted);
    setShowClickHint(false);
  };

  const getAutoPlayEmbedUrl = (platformInfo: any, id: string) => {
    const { platform } = platformInfo;
    const baseUrl = platform.getEmbedUrl(id);
    
    if (platform.name === 'YouTube') {
      const muteParam = isMuted ? '&mute=1' : '&mute=0';
      return `${baseUrl}?autoplay=1${muteParam}&loop=1&playlist=${id}&controls=0&modestbranding=1`;
    } else if (platform.name === 'Vimeo') {
      const muteParam = isMuted ? '&muted=1' : '&muted=0';
      return `${baseUrl}?autoplay=1${muteParam}&loop=1&controls=0`;
    } else if (platform.name === 'Wistia') {
      const muteParam = isMuted ? '&muted=1' : '&muted=0';
      return `${baseUrl}?autoplay=1${muteParam}&controls=0`;
    }
    
    return baseUrl;
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 sm:p-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 bg-gray-800 rounded-full flex items-center justify-center">
          <X size={24} className="sm:hidden text-gray-400" />
          <X size={32} className="hidden sm:block text-gray-400" />
        </div>
        <p className="text-gray-400 mb-2 text-sm sm:text-base">Unable to load media</p>
        <button 
          onClick={onSkip} 
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded text-xs sm:text-sm transition-colors cursor-pointer touch-manipulation"
        >
          Skip to next
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center text-gray-400 text-sm sm:text-base">
        No content available
      </div>
    );
  }

  if (item.type === "image") {
    return (
      <img 
        src={item.media} 
        alt={item.caption || ""} 
        className="w-full h-full object-cover"
        onError={onError}
      />
    );
  }

  if (item.type === "video") {
    const platformInfo = detectVideoPlatform(item.media);
    
    if (platformInfo) {
      // Platform video - show iframe embed with click overlay
      return (
        <div 
          ref={containerRef}
          className="relative w-full h-full cursor-pointer group"
          onClick={handlePlatformVideoClick}
        >
          <iframe
            src={getAutoPlayEmbedUrl(platformInfo, platformInfo.id)}
            className="w-full h-full pointer-events-none"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={onError}
          />
          
          {/* Click overlay */}
          <div className="absolute inset-0 bg-transparent" />
          
          {/* Mute indicator */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 pointer-events-none">
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white animate-pulse" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Click hint */}
          <AnimatePresence>
            {showClickHint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm pointer-events-none"
              >
                Tap to {isMuted ? 'unmute' : 'mute'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple effect */}
          <AnimatePresence>
            {showRipple && (
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                className="absolute w-4 h-4 bg-white rounded-full pointer-events-none"
                style={{
                  left: ripplePosition.x - 8,
                  top: ripplePosition.y - 8,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      );
    } else if (isDirectVideoUrl(item.media)) {
      // Direct video file
      return (
        <div 
          ref={containerRef}
          className="relative w-full h-full group cursor-pointer"
          onClick={handleVideoClick}
        >
          <video 
            ref={videoRef}
            src={item.media}
            autoPlay 
            muted 
            loop
            playsInline
            className="w-full h-full object-cover"
            onEnded={onVideoEnd}
            onError={onError}
          />
          
          {/* Mute/Unmute Button - Always visible */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 pointer-events-none">
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white animate-pulse" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Click hint */}
          <AnimatePresence>
            {showClickHint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm pointer-events-none"
              >
                Tap to {isMuted ? 'unmute' : 'mute'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple effect */}
          <AnimatePresence>
            {showRipple && (
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                className="absolute w-4 h-4 bg-white rounded-full pointer-events-none"
                style={{
                  left: ripplePosition.x - 8,
                  top: ripplePosition.y - 8,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      );
    } else {
      // Invalid video URL
      return (
        <div className="flex flex-col items-center justify-center text-center p-4 sm:p-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <X size={24} className="sm:hidden text-gray-400" />
            <X size={32} className="hidden sm:block text-gray-400" />
          </div>
          <p className="text-gray-400 mb-2 text-sm sm:text-base">Invalid video URL</p>
          <button 
            onClick={onSkip} 
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded text-xs sm:text-sm transition-colors cursor-pointer touch-manipulation"
          >
            Skip to next
          </button>
        </div>
      );
    }
  }

  return null;
};

export default StoryMediaDisplay;
