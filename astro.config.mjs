import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const SITE = 'https://www.81japan.com';

// 旧 CJK slug → 新罗马字 slug 的 301 重定向（由 nameEn 生成，见 src/data/hospital-redirects.json）
const hospitalRedirects = JSON.parse(
  readFileSync(new URL('./src/data/hospital-redirects.json', import.meta.url), 'utf-8'),
);

// slug → updated（YYYY-MM）。详情页的 lastmod 用数据里的实际更新月份，
// 而不是构建时间——否则每次部署都在告诉 Google「369 个页面全变了」，lastmod 会被无视。
const hospitals = JSON.parse(
  readFileSync(new URL('./src/data/hospitals.json', import.meta.url), 'utf-8'),
);
const updatedBySlug = new Map(hospitals.map((h) => [h.slug, h.updated]));

// 这些页面自身是 noindex，放进 sitemap 只会在 Search Console 里报
// 「已提交的网址被标记为 noindex」。
const EXCLUDED = new Set([
  `${SITE}/submit`,
  `${SITE}/en/submit`,
  `${SITE}/404`,
  `${SITE}/en/404`,
]);

const BUILD_TIME = new Date().toISOString();

export default defineConfig({
  site: SITE,
  adapter: vercel(),
  trailingSlash: 'never',
  redirects: {
    '/submit.html': '/submit',
    ...hospitalRedirects,
  },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED.has(page.replace(/\/$/, '')),
      serialize(item) {
        // 注：loc 由 sitemap 集成按 trailingSlash: 'never' 归一化，这里改不动，
        // 所以首页两种写法都要认。
        const isHome = item.url === SITE || item.url === `${SITE}/`;

        const hospitalMatch = item.url.match(/\/hospital\/([^/]+)$/);
        if (hospitalMatch) {
          const updated = updatedBySlug.get(decodeURIComponent(hospitalMatch[1]));
          // updated 是 YYYY-MM，补成当月 1 号
          item.lastmod = updated ? `${updated.replace(/-(\d)$/, '-0$1')}-01` : BUILD_TIME;
          item.changefreq = 'monthly';
          item.priority = 0.7;
        } else {
          item.lastmod = BUILD_TIME;
          item.changefreq = 'weekly';
          item.priority = isHome ? 1.0 : 0.8;
        }
        return item;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
