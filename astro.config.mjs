import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://81japan.com',
  integrations: [
    sitemap({
      serialize(item) {
        if (item.url === 'https://81japan.com') {
          item.url = 'https://81japan.com/';
        } else if (!item.url.endsWith('.html') && !item.url.endsWith('/')) {
          item.url += '.html';
        }
        return item;
      },
    }),
  ],
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
});
