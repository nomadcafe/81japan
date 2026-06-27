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
  '妇人科': 'Gynecology',
  '产妇人科': 'Ob/Gyn',
  '女性内科': "Women's Internal Medicine",
  '耳鼻咽喉科': 'ENT',
  '乳腺外科': 'Breast Surgery',
  '乳癌检查': 'Breast Cancer Screening',
  '不孕治疗': 'Infertility Treatment',
  '妇科检诊': 'Gynecological Screening',
  '体外受精': 'IVF',
  '生殖医疗': 'Reproductive Medicine',
  '子宫颈癌检查': 'Cervical Cancer Screening',
  '心脏血管外科': 'Cardiovascular Surgery',
  '放射线诊断科': 'Diagnostic Radiology',
  '新生儿科': 'Neonatology',
  '齿科': 'Dental',
  '齿科口腔外科': 'Dental & Oral Surgery',
  '血液内科': 'Hematology',
  '内分泌代谢内科': 'Endocrinology & Metabolism',
  '呼吸器内科': 'Respiratory Medicine',
  '急诊科': 'Emergency',
  '美容皮肤科': 'Cosmetic Dermatology',
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

const BADGE_EN: Record<string, string> = {
  '拠点病院': 'Hub hospital',
  '19语言通译': '19-lang interpreting',
  '国際検診': 'Intl checkup',
  '新': 'New',
  '365天': '365 days',
  '中国大使馆指定': 'China Embassy designated',
  '中文网站': 'Chinese website',
  '中文官网': 'Chinese website',
  'JMIP认证': 'JMIP certified',
  '微信对应': 'WeChat',
  '中文母语接诊': 'Native Chinese doctor',
  '周日营业': 'Open Sundays',
  '周日开诊': 'Open Sundays',
  '中文心理诊疗': 'Chinese mental health',
  '中文神经内科': 'Chinese neurology',
  '翻译免费': 'Free interpreting',
  'JCI+JMIP认证': 'JCI+JMIP certified',
  '24h急诊': '24h ER',
  'JMIP+JIH认证': 'JMIP+JIH certified',
  '中国・四国首家': 'First in Chugoku-Shikoku',
  '50+语言通译': '50+ languages',
  'JCI认证': 'JCI certified',
  '中文门诊': 'Chinese clinic',
  '中文应诊': 'Chinese consults',
  '中英文常驻': 'CN/EN on-site',
  '关空旁': 'By Kansai Airport',
  '华人医生': 'Chinese doctor',
  '中文翻译团队': 'Chinese interpreter team',
  '年中无休': 'Open year-round',
  '土日诊疗': 'Weekend care',
  '医疗翻译': 'Medical interpreter',
  '中文诊疗': 'Chinese care',
  '在线诊疗': 'Telemedicine',
};

export function badgeLabel(label: string, locale: Locale): string {
  if (locale === 'zh') return label;
  return BADGE_EN[label] || label;
}
