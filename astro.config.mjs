import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.81japan.com',
  adapter: vercel(),
  trailingSlash: 'never',
  redirects: {
    '/submit.html': '/submit',
  },
  integrations: [
    sitemap({
      serialize(item) {
        item.lastmod = new Date().toISOString();
        item.changefreq = item.url.includes('/hospital/') ? 'monthly' : 'weekly';
        item.priority = item.url === 'https://www.81japan.com/' ? 1.0
          : item.url.includes('/hospital/') ? 0.7
          : 0.8;
        return item;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
