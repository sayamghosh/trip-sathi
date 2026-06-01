import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tripsathi.vercel.app';

  const staticPages = [
    '',
    '/about',
    '/packages',
    '/guides',
    '/gallery',
    '/search',
    '/become-a-guide',
  ];

  const sitemap: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return sitemap;
}