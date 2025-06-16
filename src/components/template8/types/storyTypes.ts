
export interface StoryItem {
  type: 'image' | 'video';
  media: string;
  caption?: string;
  duration?: number;
}

export interface InstagramStory {
  id: number;
  image: string;
  coverType?: 'image' | 'video'; // Add support for video cover type
  title: string;
  ctaText?: string;
  items: StoryItem[];
}

export interface StoryCarouselProps {
  stories?: InstagramStory[];
  activeIndex: number;
  viewedStories?: number[];
  onStoryClick: (id: number, index: number) => void;
  onActiveIndexChange?: (index: number) => void;
  brandColor?: string;
  fontClass?: string;
}

export interface StoryViewerProps {
  stories?: InstagramStory[];
  initialStoryIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onStoryChange?: (index: number) => void;
  businessName?: string;
  brandColor?: string;
  onBookingClick?: (storyTitle?: string) => void;
}
