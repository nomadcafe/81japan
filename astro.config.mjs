import { readFileSync, writeFileSync } from 'node:fs';
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

// 全站安全响应头。静态页不经过 middleware，所以在构建末尾直接写进
// .vercel/output/config.json 的路由表（排在最前，continue 让后续路由照常匹配）。
// 页面里有大量内联脚本和 onclick，暂不上 script-src；先把不影响现有功能的几项收紧。
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Content-Security-Policy': "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
};

const securityHeaders = {
  name: 'security-headers',
  hooks: {
    'astro:build:done': () => {
      const configUrl = new URL('./.vercel/output/config.json', import.meta.url);
      const config = JSON.parse(readFileSync(configUrl, 'utf-8'));
      config.routes = [{ src: '/(.*)', headers: SECURITY_HEADERS, continue: true }, ...(config.routes ?? [])];
      writeFileSync(configUrl, JSON.stringify(config, null, 2));
    },
  },
};

export default defineConfig({
  site: SITE,
  adapter: vercel(),
  trailingSlash: 'never',
  redirects: {
    '/submit.html': '/submit',
    ...hospitalRedirects,
  },
  integrations: [
    securityHeaders,
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
