import { supabase } from '@/integrations/supabase/client';

export interface EngagementData {
  hearts: number;
  comments: number;
  saves: number;
  traffic_score: number;
}

export interface EngagementTiers {
  min: number;
  max: number;
  hearts: { min: number; max: number };
  comments: { min: number; max: number };
  saves: { min: number; max: number };
}

// Enhanced industry multipliers with video boost
export const INDUSTRY_MULTIPLIERS: Record<string, number> = {
  'Hair Salon': 1.2,
  'Nail Salon': 1.1,
  'Spa & Wellness': 1.0,
  'Barber Shop': 0.9,
  'Makeup Artist': 1.4,
  'Esthetician': 1.1,
  'Massage Therapy': 0.8,
  'Personal Trainer': 1.3,
  'Life Coach': 1.0,
  'Photographer': 1.5,
  'Event Planner': 1.2,
  'Other': 1.0
};

// NEW: Video content multipliers
export const VIDEO_CONTENT_MULTIPLIERS = {
  none: 1.0,      // No video content
  low: 1.2,       // 1-25% video content
  medium: 1.5,    // 26-50% video content
  high: 2.0,      // 51-75% video content
  dominant: 2.5   // 76%+ video content
};

export const FOLLOWER_TIERS: Record<string, EngagementTiers> = {
  micro: {
    min: 0,
    max: 499,
    hearts: { min: 3, max: 12 },
    comments: { min: 1, max: 3 },
    saves: { min: 1, max: 2 }
  },
  small: {
    min: 500,
    max: 999,
    hearts: { min: 15, max: 40 },
    comments: { min: 3, max: 8 },
    saves: { min: 2, max: 5 }
  },
  medium: {
    min: 1000,
    max: 5000,
    hearts: { min: 50, max: 100 },
    comments: { min: 8, max: 15 },
    saves: { min: 5, max: 12 }
  },
  large: {
    min: 5001,
    max: Infinity,
    hearts: { min: 100, max: 500 },
    comments: { min: 15, max: 30 },
    saves: { min: 10, max: 25 }
  }
};

export function calculateEngagementTier(followerCount: number): EngagementTiers {
  for (const tier of Object.values(FOLLOWER_TIERS)) {
    if (followerCount >= tier.min && followerCount <= tier.max) {
      return tier;
    }
  }
  return FOLLOWER_TIERS.micro; // Default fallback
}

export function calculateVideoContentRatio(content: any[]): number {
  if (!content || content.length === 0) return 0;
  
  const videoCount = content.filter(item => 
    item.mediaType === 'video' || 
    item.type === 'video' ||
    (item.items && item.items.some((subItem: any) => subItem.type === 'video'))
  ).length;
  
  return videoCount / content.length;
}

export function getVideoMultiplier(videoRatio: number): number {
  if (videoRatio === 0) return VIDEO_CONTENT_MULTIPLIERS.none;
  if (videoRatio <= 0.25) return VIDEO_CONTENT_MULTIPLIERS.low;
  if (videoRatio <= 0.50) return VIDEO_CONTENT_MULTIPLIERS.medium;
  if (videoRatio <= 0.75) return VIDEO_CONTENT_MULTIPLIERS.high;
  return VIDEO_CONTENT_MULTIPLIERS.dominant;
}

export function generateInitialEngagement(
  followerCount: number, 
  industry?: string,
  galleryContent?: any[],
  storiesContent?: any[]
): EngagementData {
  const tier = calculateEngagementTier(followerCount);
  const industryMultiplier = industry ? (INDUSTRY_MULTIPLIERS[industry] || 1.0) : 1.0;
  
  // Calculate video content ratio across gallery and stories
  const allContent = [...(galleryContent || []), ...(storiesContent || [])];
  const videoRatio = calculateVideoContentRatio(allContent);
  const videoMultiplier = getVideoMultiplier(videoRatio);
  
  // Apply both industry and video multipliers
  const totalMultiplier = industryMultiplier * videoMultiplier;
  
  const baseHearts = Math.floor(Math.random() * (tier.hearts.max - tier.hearts.min + 1)) + tier.hearts.min;
  const baseComments = Math.floor(Math.random() * (tier.comments.max - tier.comments.min + 1)) + tier.comments.min;
  const baseSaves = Math.floor(Math.random() * (tier.saves.max - tier.saves.min + 1)) + tier.saves.min;
  
  return {
    hearts: Math.floor(baseHearts * totalMultiplier),
    comments: Math.floor(baseComments * totalMultiplier),
    saves: Math.floor(baseSaves * totalMultiplier),
    traffic_score: 0
  };
}

export async function saveEngagementData(siteId: string, engagement: EngagementData) {
  try {
    const { data, error } = await supabase
      .from('chairlinked_engagement')
      .upsert({
        site_id: siteId,
        hearts: engagement.hearts,
        comments: engagement.comments,
        saves: engagement.saves,
        traffic_score: engagement.traffic_score,
        last_updated: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving engagement data:', error);
    return { data: null, error };
  }
}

export async function getEngagementData(siteId: string): Promise<EngagementData | null> {
  try {
    const { data, error } = await supabase
      .from('chairlinked_engagement')
      .select('hearts, comments, saves, traffic_score')
      .eq('site_id', siteId)
      .single();

    if (error || !data) return null;
    return data as EngagementData;
  } catch (error) {
    console.error('Error fetching engagement data:', error);
    return null;
  }
}

export async function trackVisitor(siteId: string, visitorId: string) {
  try {
    const { data, error } = await supabase
      .from('chairlinked_traffic')
      .upsert({
        site_id: siteId,
        visitor_identifier: visitorId,
        visit_count: 1,
        last_visit: new Date().toISOString()
      }, {
        onConflict: 'site_id,visitor_identifier'
      })
      .select();

    if (error) throw error;
    
    // Check if we should boost engagement
    await checkAndBoostEngagement(siteId);
    
    return { data, error: null };
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return { data: null, error };
  }
}

async function checkAndBoostEngagement(siteId: string) {
  try {
    // Get current traffic score
    const { data: trafficData } = await supabase
      .from('chairlinked_traffic')
      .select('visit_count')
      .eq('site_id', siteId);

    if (!trafficData) return;

    const totalVisits = trafficData.reduce((sum, row) => sum + row.visit_count, 0);
    
    // Get current engagement
    const engagement = await getEngagementData(siteId);
    if (!engagement) return;

    // Boost engagement every 25 visits
    const newTrafficScore = Math.floor(totalVisits / 25);
    
    if (newTrafficScore > engagement.traffic_score) {
      const boostMultiplier = 1 + (Math.random() * 0.05 + 0.05); // 5-10% boost
      
      const boostedEngagement: EngagementData = {
        hearts: Math.floor(engagement.hearts * boostMultiplier),
        comments: Math.floor(engagement.comments * boostMultiplier),
        saves: Math.floor(engagement.saves * boostMultiplier),
        traffic_score: newTrafficScore
      };

      await saveEngagementData(siteId, boostedEngagement);
    }
  } catch (error) {
    console.error('Error boosting engagement:', error);
  }
}
