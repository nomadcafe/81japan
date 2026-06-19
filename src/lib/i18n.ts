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
  '骨科': 'Orthopedics',
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
  '急救': 'Emergency',
  '健诊': 'Health Check',
  '体检': 'Health Checkup',
  '健康体检': 'Health Checkup',
  '渡航外来': 'Travel Clinic',
  '渡航医学': 'Travel Medicine',
  '预防医学': 'Preventive Medicine',
  '综合内科': 'General Internal Medicine',
  '小儿科': 'Pediatrics',
  '心脏科': 'Cardiology',
  '脑神经内科': 'Neurology',
  '脑神经科': 'Neurology',
  '消化器内科': 'Gastroenterology',
  '肝脏内科': 'Hepatology',
  '泌尿科': 'Urology',
  '耳鼻喉科': 'ENT',
  '糖尿病': 'Diabetes',
  '糖尿病内科': 'Diabetes',
  '风湿科': 'Rheumatology',
  '过敏科': 'Allergy',
  '感染症': 'Infectious Diseases',
  '感染科': 'Infectious Diseases',
  '乳腺科': 'Breast Clinic',
  '心疗内科': 'Psychosomatic Medicine',
  '康复': 'Rehabilitation',
  '康复科': 'Rehabilitation',
  '透析': 'Dialysis',
  '发热外来': 'Fever Clinic',
  '疫苗': 'Vaccination',
  '预防接种': 'Vaccination',
  '儿童牙科': 'Pediatric Dentistry',
  '矫正牙科': 'Orthodontics',
  '口腔外科': 'Oral Surgery',
  '种植牙': 'Dental Implants',
  '中医': 'Traditional Chinese Medicine',
  '汉方': 'Kampo Medicine',
  '汉方内科': 'Kampo Internal Medicine',
  '汉方妇科': 'Kampo Gynecology',
  '肿瘤汉方': 'Kampo Oncology',
  '针灸': 'Acupuncture',
};

export function deptLabel(dept: string, locale: Locale): string {
  if (locale === 'zh') return dept;
  return DEPT_EN[dept] || dept;
}

const REGION_EN: Record<string, string> = {
  '东京': 'Tokyo',
  '千叶': 'Chiba',
  '埼玉': 'Saitama',
  '横浜': 'Yokohama',
  '大阪': 'Osaka',
  '京都': 'Kyoto',
  '神户': 'Kobe',
  '福冈': 'Fukuoka',
  '札幌': 'Hokkaido',
  '名古屋': 'Nagoya',
  '广岛': 'Hiroshima',
  '冈山': 'Okayama',
  '浜松': 'Hamamatsu',
  '仙台': 'Sendai',
  '冲绳': 'Okinawa',
};

export function regionLabel(region: string, locale: Locale): string {
  if (locale === 'zh') return region;
  return REGION_EN[region] || region;
}

export function hospitalName(h: { name?: string; nameEn?: string }, locale: Locale): string {
  return (locale === 'en' && h.nameEn ? h.nameEn : h.name) || '';
}
