import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dzprimeacademy.live';
  const now = new Date();

  const publicRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/bot', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/dawarat', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/exams', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/card', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/ambassadors', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/leaderboard', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/community', priority: 0.7, changeFrequency: 'daily' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Root redirect entry
  sitemapEntries.push({
    url: baseUrl,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {
      languages: {
        ar: `${baseUrl}/ar`,
        fr: `${baseUrl}/fr`,
      },
    },
  });

  // Localized entries for Arabic and French
  for (const route of publicRoutes) {
    for (const locale of ['ar', 'fr']) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar${route.path}`,
            fr: `${baseUrl}/fr${route.path}`,
            'x-default': `${baseUrl}/ar${route.path}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
