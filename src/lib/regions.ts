// 地区（region）元数据：URL slug + 侧栏标签，供首页侧栏与地区落地页共用。
// key 与 hospitals.json 中 h.region 的取值一致。

export interface RegionMeta {
  key: string;      // 数据中的 region 取值，如 '大阪'
  slug: string;     // URL 片段，如 'osaka'
  labelZh: string;  // 侧栏标签（中文），如 '大阪・关西'
  labelEn: string;  // 侧栏标签（英文），如 'Osaka'
  nameZh: string;   // 简称（中文），如 '大阪'
  nameEn: string;   // 简称（英文），如 'Osaka'
}

// 顺序与首页侧栏一致
export const REGIONS: RegionMeta[] = [
  { key: '东京', slug: 'tokyo',     labelZh: '东京・关东',   labelEn: 'Tokyo',     nameZh: '东京',   nameEn: 'Tokyo' },
  { key: '千叶', slug: 'chiba',     labelZh: '千叶',         labelEn: 'Chiba',     nameZh: '千叶',   nameEn: 'Chiba' },
  { key: '埼玉', slug: 'saitama',   labelZh: '埼玉',         labelEn: 'Saitama',   nameZh: '埼玉',   nameEn: 'Saitama' },
  { key: '横浜', slug: 'yokohama',  labelZh: '横浜・神奈川', labelEn: 'Yokohama',  nameZh: '横浜',   nameEn: 'Yokohama' },
  { key: '大阪', slug: 'osaka',     labelZh: '大阪・关西',   labelEn: 'Osaka',     nameZh: '大阪',   nameEn: 'Osaka' },
  { key: '京都', slug: 'kyoto',     labelZh: '京都・关西',   labelEn: 'Kyoto',     nameZh: '京都',   nameEn: 'Kyoto' },
  { key: '神户', slug: 'kobe',      labelZh: '神户・关西',   labelEn: 'Kobe',      nameZh: '神户',   nameEn: 'Kobe' },
  { key: '福冈', slug: 'fukuoka',   labelZh: '福冈・九州',   labelEn: 'Fukuoka',   nameZh: '福冈',   nameEn: 'Fukuoka' },
  { key: '札幌', slug: 'hokkaido',  labelZh: '北海道',       labelEn: 'Hokkaido',  nameZh: '札幌',   nameEn: 'Sapporo' },
  { key: '名古屋', slug: 'nagoya',  labelZh: '名古屋・中部', labelEn: 'Nagoya',    nameZh: '名古屋', nameEn: 'Nagoya' },
  { key: '广岛', slug: 'hiroshima', labelZh: '广岛・中国',   labelEn: 'Hiroshima', nameZh: '广岛',   nameEn: 'Hiroshima' },
  { key: '冈山', slug: 'okayama',   labelZh: '冈山・中国',   labelEn: 'Okayama',   nameZh: '冈山',   nameEn: 'Okayama' },
  { key: '浜松', slug: 'hamamatsu', labelZh: '浜松・静冈',   labelEn: 'Hamamatsu', nameZh: '浜松',   nameEn: 'Hamamatsu' },
  { key: '仙台', slug: 'sendai',    labelZh: '仙台・东北',   labelEn: 'Sendai',    nameZh: '仙台',   nameEn: 'Sendai' },
  { key: '冲绳', slug: 'okinawa',   labelZh: '冲绳',         labelEn: 'Okinawa',   nameZh: '冲绳',   nameEn: 'Okinawa' },
];

export function regionByKey(key: string): RegionMeta | undefined {
  return REGIONS.find((r) => r.key === key);
}

export function regionBySlug(slug: string): RegionMeta | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

// ── 地区 × 语言 组合页 ──
// 只为「同一地区内该语言家数 ≥ 阈值」的组合建独立落地页，避免内容过薄被判为门口页。
export const REGION_LANG_MIN = 8;

// 可建组合页的语言 → URL slug
export const LANG_SLUG: Record<string, string> = {
  '中文': 'chinese',
  '英文': 'english',
  '越南语': 'vietnamese',
};

export function langBySlug(slug: string): string | undefined {
  return Object.keys(LANG_SLUG).find((k) => LANG_SLUG[k] === slug);
}

export interface RegionLangCombo {
  regionKey: string;
  langKey: string;
  count: number;
}

// 统计达到阈值的 地区×语言 组合。传入 loadHospitals() 的结果。
export function regionLangCombos(
  hospitals: Array<{ region?: string; langs?: string[] }>,
): RegionLangCombo[] {
  const counts: Record<string, number> = {};
  for (const h of hospitals) {
    if (!h.region) continue;
    for (const l of h.langs || []) {
      if (l in LANG_SLUG) {
        counts[`${h.region}|${l}`] = (counts[`${h.region}|${l}`] || 0) + 1;
      }
    }
  }
  const out: RegionLangCombo[] = [];
  for (const [k, count] of Object.entries(counts)) {
    if (count < REGION_LANG_MIN) continue;
    const [regionKey, langKey] = k.split('|');
    if (!regionByKey(regionKey)) continue;
    out.push({ regionKey, langKey, count });
  }
  return out;
}
