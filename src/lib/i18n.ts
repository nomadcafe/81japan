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

const DEPT_EN: Record<string, string> = {
  '内科': 'Internal Medicine',
  '外科': 'Surgery',
  '儿科': 'Pediatrics',
  '产科': 'Obstetrics',
  '妇科': 'Gynecology',
  '妇产科': 'Ob/Gyn',
  '整形外科': 'Orthopedics',
  '皮肤科': 'Dermatology',
  '皮肤美容科': 'Cosmetic Dermatology',
  '眼科': 'Ophthalmology',
  '牙科': 'Dental',
  '神经科': 'Neurology',
  '神经内科': 'Neurology',
  '精神科': 'Psychiatry',
  '心脏内科': 'Cardiology',
  '循环器内科': 'Cardiology',
  '呼吸内科': 'Respiratory Medicine',
  '消化内科': 'Gastroenterology',
  '消化器科': 'Gastroenterology',
  '胃肠科': 'Gastroenterology',
  '肾脏内科': 'Nephrology',
  '人工透析内科': 'Dialysis',
  '泌尿器科': 'Urology',
  '脑神经外科': 'Neurosurgery',
  '骨外科': 'Orthopedic Surgery',
  '肿瘤科': 'Oncology',
  '放射科': 'Radiology',
  '放射线科': 'Radiology',
  '理学疗法科': 'Physical Therapy',
  '急诊': 'Emergency',
  '健诊': 'Health Check',
  '渡航外来': 'Travel Clinic',
  '预防医学': 'Preventive Medicine',
};

export function deptLabel(dept: string, locale: Locale): string {
  if (locale === 'zh') return dept;
  return DEPT_EN[dept] || dept;
}

export function hospitalName(h: { name: string; nameEn?: string }, locale: Locale): string {
  return locale === 'en' && h.nameEn ? h.nameEn : h.name;
}
