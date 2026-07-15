import { MetadataRoute } from 'next';
import { siteConfig } from '../config/site';
import { getAllTourPlans } from '../services/tourPlan.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl;

  const staticPages = [
    '',
    '/about',
    '/packages',
    '/guides',
    '/gallery',
    '/search',
    '/become-a-guide',
    '/terms',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Individual guide/tour-plan pages are real, publicly indexable content -
  // best-effort fetch so a backend hiccup during a build doesn't break the
  // whole sitemap, just falls back to the static routes above.
  let planEntries: MetadataRoute.Sitemap = [];
  try {
    const plans = await getAllTourPlans();
    planEntries = plans.map((plan) => ({
      url: `${baseUrl}/guides/${plan._id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('sitemap: failed to fetch tour plans, using static routes only', error);
  }

  return [...staticEntries, ...planEntries];
}
