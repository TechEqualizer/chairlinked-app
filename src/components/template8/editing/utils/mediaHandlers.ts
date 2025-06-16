
import { isValidVideoUrl } from "../../utils/videoPlatforms";

export const handleFileSelect = async (
  event: React.ChangeEvent<HTMLInputElement>,
  onMediaChange: (mediaUrl: string, type: 'image' | 'video') => void,
  setIsUploading: (uploading: boolean) => void
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setIsUploading(true);
  
  try {
    const fileType = file.type.startsWith('video/') ? 'video' : 'image';
    const objectUrl = URL.createObjectURL(file);
    onMediaChange(objectUrl, fileType);
  } catch (error) {
    console.error('Error uploading file:', error);
  } finally {
    setIsUploading(false);
  }
};

export const handleVideoUrlSubmit = (
  videoUrl: string,
  onMediaChange: (mediaUrl: string, type: 'image' | 'video') => void,
  setVideoUrl: (url: string) => void,
  setUrlError: (error: string) => void
) => {
  if (!videoUrl.trim()) {
    setUrlError("Please enter a video URL");
    return;
  }

  if (!isValidVideoUrl(videoUrl)) {
    setUrlError("Please enter a valid video URL from YouTube, Vimeo, Wistia, or direct video file");
    return;
  }

  setUrlError("");
  onMediaChange(videoUrl, 'video');
  setVideoUrl("");
};

export const getAspectClasses = () => ({
  "16:9": "aspect-video",
  "4:5": "aspect-[4/5]",
  "1:1": "aspect-square",
  "9:16": "aspect-[9/16]",
});
