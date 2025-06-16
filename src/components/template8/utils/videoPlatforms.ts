
export interface VideoPlatform {
  name: string;
  icon: string;
  extractId: (url: string) => string | null;
  getThumbnail: (id: string) => string;
  getEmbedUrl: (id: string) => string;
  getLoopParams: (id: string) => string;
  getAutoplayParams: () => string;
}

export const videoPlatforms: Record<string, VideoPlatform> = {
  youtube: {
    name: 'YouTube',
    icon: '🎥',
    extractId: (url: string) => {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/
      ];
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      return null;
    },
    getThumbnail: (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
    getEmbedUrl: (id: string) => `https://www.youtube.com/embed/${id}`,
    getLoopParams: (id: string) => `&loop=1&playlist=${id}`,
    getAutoplayParams: () => '&autoplay=1&mute=1'
  },
  vimeo: {
    name: 'Vimeo',
    icon: '📹',
    extractId: (url: string) => {
      const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      return match ? match[1] : null;
    },
    getThumbnail: (id: string) => `https://vumbnail.com/${id}.jpg`,
    getEmbedUrl: (id: string) => `https://player.vimeo.com/video/${id}`,
    getLoopParams: (id: string) => '&loop=1',
    getAutoplayParams: () => '&autoplay=1&muted=1'
  },
  wistia: {
    name: 'Wistia',
    icon: '🎬',
    extractId: (url: string) => {
      const match = url.match(/wistia\.com\/medias\/([^?&]+)/);
      return match ? match[1] : null;
    },
    getThumbnail: (id: string) => `https://embed-ssl.wistia.com/deliveries/${id}.jpg`,
    getEmbedUrl: (id: string) => `https://fast.wistia.net/embed/iframe/${id}`,
    getLoopParams: (id: string) => '&loop=true',
    getAutoplayParams: () => '&autoPlay=true&muted=true'
  }
};

export const detectVideoPlatform = (url: string): { platform: VideoPlatform; id: string } | null => {
  for (const [key, platform] of Object.entries(videoPlatforms)) {
    const id = platform.extractId(url);
    if (id) {
      return { platform, id };
    }
  }
  return null;
};

export const isDirectVideoUrl = (url: string): boolean => {
  return /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(url);
};

export const isValidVideoUrl = (url: string): boolean => {
  return detectVideoPlatform(url) !== null || isDirectVideoUrl(url);
};
