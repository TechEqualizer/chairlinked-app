/**
 * Fake Engagement Metrics Service
 * Generates realistic, encouraging metrics for customer sites to boost confidence
 * All metrics are designed to show positive growth and engagement
 */

interface FakeMetrics {
  totalViews: number;
  monthlyViews: number;
  uniqueVisitors: number;
  engagementScore: number;
  monthlyGrowth: number;
  weeklyGrowth: number;
  // Additional encouraging metrics
  bookingClicks: number;
  contactClicks: number;
  socialEngagement: number;
  averageSessionTime: string;
  topTrafficSources: Array<{ source: string; percentage: number }>;
  hourlyViews: Array<{ hour: number; views: number }>;
  demographicData: {
    ageGroups: Array<{ group: string; percentage: number }>;
    gender: Array<{ type: string; percentage: number }>;
    devices: Array<{ type: string; percentage: number }>;
  };
}

/**
 * Generate realistic base metrics based on site age and business type
 */
const generateBaseMetrics = (siteId: string, businessName?: string): FakeMetrics => {
  // Use site ID as seed for consistent metrics
  const seed = hashCode(siteId);
  const random = seededRandom(seed);
  
  // Determine business type influence
  const businessType = detectBusinessType(businessName || '');
  const typeMultiplier = getBusinessTypeMultiplier(businessType);
  
  // Calculate site age in days (simulated)
  const siteAge = Math.max(1, Math.floor(random() * 90) + 7); // 7-97 days old
  const ageMultiplier = Math.min(2, 1 + (siteAge / 90)); // More views for older sites
  
  // Base metrics with realistic ranges
  const baseViews = Math.floor((random() * 200 + 50) * typeMultiplier * ageMultiplier);
  const uniqueVisitorRatio = 0.6 + (random() * 0.3); // 60-90% unique visitors
  const engagementRate = 0.15 + (random() * 0.2); // 15-35% engagement rate
  
  const totalViews = baseViews;
  const monthlyViews = Math.floor(totalViews * (0.7 + random() * 0.3)); // 70-100% of total
  const uniqueVisitors = Math.floor(totalViews * uniqueVisitorRatio);
  const engagementScore = Math.floor(totalViews * engagementRate);
  
  // Growth metrics (always positive)
  const monthlyGrowth = Math.floor(random() * 25) + 8; // 8-33% growth
  const weeklyGrowth = Math.floor(random() * 8) + 2; // 2-10% weekly growth
  
  // Action metrics
  const bookingClicks = Math.floor(engagementScore * (0.3 + random() * 0.4)); // 30-70% of engagement
  const contactClicks = Math.floor(engagementScore * (0.2 + random() * 0.3)); // 20-50% of engagement
  const socialEngagement = Math.floor(engagementScore * (0.1 + random() * 0.2)); // 10-30% of engagement
  
  // Session time (realistic for business sites)
  const sessionMinutes = Math.floor(random() * 3) + 2; // 2-5 minutes
  const sessionSeconds = Math.floor(random() * 60);
  const averageSessionTime = `${sessionMinutes}:${sessionSeconds.toString().padStart(2, '0')}`;
  
  // Traffic sources (realistic distribution)
  const topTrafficSources = generateTrafficSources(random);
  
  // Hourly views pattern (business hours focused)
  const hourlyViews = generateHourlyPattern(totalViews, random);
  
  // Demographics (encouraging for business)
  const demographicData = generateDemographics(random);
  
  return {
    totalViews,
    monthlyViews,
    uniqueVisitors,
    engagementScore,
    monthlyGrowth,
    weeklyGrowth,
    bookingClicks,
    contactClicks,
    socialEngagement,
    averageSessionTime,
    topTrafficSources,
    hourlyViews,
    demographicData
  };
};

/**
 * Generate traffic sources with realistic business-focused distribution
 */
const generateTrafficSources = (random: () => number) => {
  const sources = [
    { source: 'Google Search', base: 40, variance: 20 },
    { source: 'Direct', base: 25, variance: 15 },
    { source: 'Social Media', base: 15, variance: 10 },
    { source: 'Referrals', base: 10, variance: 8 },
    { source: 'Email', base: 5, variance: 5 },
    { source: 'Ads', base: 5, variance: 5 }
  ];
  
  let total = 0;
  const result = sources.map(source => {
    const percentage = Math.max(1, source.base + (random() - 0.5) * source.variance);
    total += percentage;
    return { source: source.source, percentage };
  });
  
  // Normalize to 100%
  return result.map(item => ({
    ...item,
    percentage: Math.round((item.percentage / total) * 100)
  })).slice(0, 4); // Top 4 sources
};

/**
 * Generate hourly view pattern (business hours focused)
 */
const generateHourlyPattern = (totalViews: number, random: () => number) => {
  const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
    let weight = 1;
    
    // Business hours (9 AM - 6 PM) get higher weight
    if (hour >= 9 && hour <= 18) {
      weight = 3 + random();
    }
    // Evening hours (6 PM - 10 PM) moderate weight
    else if (hour >= 18 && hour <= 22) {
      weight = 2 + random() * 0.5;
    }
    // Night/early morning lower weight
    else {
      weight = 0.3 + random() * 0.5;
    }
    
    return { hour, weight };
  });
  
  const totalWeight = hourlyDistribution.reduce((sum, h) => sum + h.weight, 0);
  
  return hourlyDistribution.map(({ hour, weight }) => ({
    hour,
    views: Math.round((weight / totalWeight) * totalViews)
  }));
};

/**
 * Generate encouraging demographic data
 */
const generateDemographics = (random: () => number) => {
  return {
    ageGroups: [
      { group: '25-34', percentage: 28 + Math.floor(random() * 10) },
      { group: '35-44', percentage: 25 + Math.floor(random() * 8) },
      { group: '18-24', percentage: 18 + Math.floor(random() * 8) },
      { group: '45-54', percentage: 15 + Math.floor(random() * 6) },
      { group: '55+', percentage: 8 + Math.floor(random() * 6) }
    ],
    gender: [
      { type: 'Female', percentage: 45 + Math.floor(random() * 20) },
      { type: 'Male', percentage: 35 + Math.floor(random() * 15) },
      { type: 'Other/Undisclosed', percentage: 5 + Math.floor(random() * 5) }
    ],
    devices: [
      { type: 'Mobile', percentage: 55 + Math.floor(random() * 15) },
      { type: 'Desktop', percentage: 30 + Math.floor(random() * 15) },
      { type: 'Tablet', percentage: 10 + Math.floor(random() * 10) }
    ]
  };
};

/**
 * Detect business type from business name
 */
const detectBusinessType = (businessName: string): string => {
  const name = businessName.toLowerCase();
  
  if (name.includes('salon') || name.includes('hair')) return 'salon';
  if (name.includes('spa') || name.includes('beauty')) return 'spa';
  if (name.includes('nail')) return 'nails';
  if (name.includes('massage')) return 'massage';
  if (name.includes('photo') || name.includes('studio')) return 'photography';
  if (name.includes('fitness') || name.includes('gym')) return 'fitness';
  if (name.includes('coach')) return 'coaching';
  
  return 'general';
};

/**
 * Get business type multiplier for metrics
 */
const getBusinessTypeMultiplier = (type: string): number => {
  const multipliers: Record<string, number> = {
    salon: 1.2,      // High local search volume
    spa: 1.1,        // Good local engagement
    nails: 1.0,      // Standard engagement
    massage: 1.1,    // Good wellness interest
    photography: 1.3, // Visual content performs well
    fitness: 1.4,    // High engagement industry
    coaching: 0.9,   // Niche market
    general: 1.0
  };
  
  return multipliers[type] || 1.0;
};

/**
 * Simple hash function for consistent seeding
 */
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

/**
 * Seeded random number generator for consistent results
 */
const seededRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

/**
 * Generate time-series data for charts
 */
export const generateTimeSeriesData = (siteId: string, days: number = 30) => {
  const seed = hashCode(siteId + 'timeseries');
  const random = seededRandom(seed);
  
  const data = [];
  const baseValue = 5 + random() * 10; // 5-15 base daily views
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some growth trend and weekly patterns
    const growthFactor = 1 + (days - i) * 0.01; // Slight upward trend
    const weekdayFactor = date.getDay() >= 1 && date.getDay() <= 5 ? 1.2 : 0.8; // Weekdays higher
    const randomFactor = 0.7 + random() * 0.6; // Random variation
    
    const value = Math.round(baseValue * growthFactor * weekdayFactor * randomFactor);
    
    data.push({
      date: date.toISOString().split('T')[0],
      views: value,
      visitors: Math.floor(value * (0.6 + random() * 0.3)),
      engagement: Math.floor(value * (0.1 + random() * 0.2))
    });
  }
  
  return data;
};

/**
 * Main function to get fake engagement metrics for a site
 */
export const getFakeEngagementMetrics = (siteId: string, businessName?: string): FakeMetrics => {
  // Cache results for consistency during session
  const cacheKey = `fake_metrics_${siteId}`;
  const cached = sessionStorage.getItem(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const metrics = generateBaseMetrics(siteId, businessName);
  sessionStorage.setItem(cacheKey, JSON.stringify(metrics));
  
  return metrics;
};

/**
 * Get encouraging insight messages based on metrics
 */
export const getEngagementInsights = (metrics: FakeMetrics): string[] => {
  const insights = [];
  
  if (metrics.monthlyGrowth > 15) {
    insights.push(`🚀 Your site traffic grew ${metrics.monthlyGrowth}% this month - excellent growth!`);
  }
  
  if (metrics.bookingClicks > 5) {
    insights.push(`📅 ${metrics.bookingClicks} visitors clicked your booking button this month`);
  }
  
  if (metrics.socialEngagement > 3) {
    insights.push(`💖 Your content received ${metrics.socialEngagement} social interactions`);
  }
  
  if (metrics.averageSessionTime) {
    insights.push(`⏱️ Visitors spend an average of ${metrics.averageSessionTime} exploring your site`);
  }
  
  insights.push(`🎯 Your site attracted ${metrics.uniqueVisitors} unique visitors this month`);
  
  return insights.slice(0, 3); // Return top 3 insights
};