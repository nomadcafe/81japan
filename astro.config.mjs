import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://81japan.com',
  adapter: vercel(),
  trailingSlash: 'never',
  redirects: {
    '/submit.html': '/submit',
  },
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
