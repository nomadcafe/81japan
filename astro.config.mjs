import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// 旧 CJK slug → 新罗马字 slug 的 301 重定向（由 nameEn 生成，见 src/data/hospital-redirects.json）
const hospitalRedirects = JSON.parse(
  readFileSync(new URL('./src/data/hospital-redirects.json', import.meta.url), 'utf-8'),
);

export default defineConfig({
  site: 'https://www.81japan.com',
  adapter: vercel(),
  trailingSlash: 'never',
  redirects: {
    '/submit.html': '/submit',
    ...hospitalRedirects,
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
