
import { generateSlug } from './slug.utils';
import { generateShareableUrl } from '../../../utils/urlGenerator';

export function generateChairLinkedUrl(businessName: string, siteType: 'demo' | 'live' = 'live'): string {
  const slug = generateSlug(businessName);
  return generateShareableUrl({
    slug,
    siteType,
    status: 'published' // Assuming published for this legacy function
  });
}

export function generateDemoUrl(businessName: string): string {
  return generateChairLinkedUrl(businessName, 'demo');
}

export function generateLiveUrl(businessName: string): string {
  return generateChairLinkedUrl(businessName, 'live');
}
