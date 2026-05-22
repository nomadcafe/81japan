export type Locale = 'zh' | 'en';

export const DEFAULT_LOCALE: Locale = 'zh';
export const LOCALES: Locale[] = ['zh', 'en'];

export const HTML_LANG: Record<Locale, string> = {
  zh: 'zh-Hans',
  en: 'en',
};

export const OG_LOCALE: Record<Locale, string> = {
  zh: 'zh_CN',
  en: 'en_US',
};

export function detectLocale(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';
}

export function localizePath(path: string, locale: Locale): string {
  const clean = path.replace(/^\/en(\/|$)/, '/').replace(/^\/+/, '/');
  if (locale === 'zh') return clean === '/' ? '/' : clean;
  return clean === '/' ? '/en' : `/en${clean}`;
}

export function alternatePath(path: string, locale: Locale): string {
  const other: Locale = locale === 'zh' ? 'en' : 'zh';
  return localizePath(path, other);
}
