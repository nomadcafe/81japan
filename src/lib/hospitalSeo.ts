// 医院详情页结构化数据（JSON-LD）辅助：语言代码、机构类型、邮编拆分。
// 中英两套详情页共用，保证输出一致。
import { sortLangs, langLabel, type Locale } from './i18n';

type H = { name?: string; jpName?: string; langs?: string[]; langDetail?: string };

// 语言 → BCP-47 代码
export const LANG_BCP47: Record<string, string> = {
  '中文': 'zh', '英文': 'en', '粤语': 'yue', '台语': 'nan', '韩文': 'ko', '俄文': 'ru',
  '越南语': 'vi', '法文': 'fr', '德文': 'de', '泰文': 'th', '印尼文': 'id',
};

// 匹配 langDetail / langs 里出现的语言（长词在前，避免“中文/英文”被子串截断）
const LANG_TOKEN_RE = /越南语|印尼文|中文|英文|粤语|台语|韩文|俄文|法文|德文|泰文/g;

// 页面出现过的语言词（去重，保留出现顺序），供“服务语言”区块显示与判断
export function langTokensOf(h: H): string[] {
  const src = h.langDetail || (h.langs || []).join(' ');
  return [...new Set(src.match(LANG_TOKEN_RE) || [])];
}

// 对应的 BCP-47 语言代码，供 availableLanguage / knowsLanguage
export function langCodes(h: H): string[] {
  return langTokensOf(h).map((t) => LANG_BCP47[t] || t);
}

// 机构类型：含「病院/医療センター」判为 Hospital，其余诊所判为 MedicalClinic
export function medicalType(h: H): 'Hospital' | 'MedicalClinic' {
  const n = `${h.jpName || ''} ${h.name || ''}`;
  return /病院|医院|医療センター|メディカルセンター|総合病院|综合医院|医疗中心/.test(n)
    ? 'Hospital'
    : 'MedicalClinic';
}

// 从地址中拆出邮编（〒XXX-XXXX）与其余街道部分
export function splitPostal(addr?: string): { postalCode?: string; streetAddress?: string } {
  if (!addr) return {};
  const m = addr.match(/〒?\s*(\d{3})-?(\d{4})/);
  if (!m) return { streetAddress: addr };
  const postalCode = `${m[1]}-${m[2]}`;
  const streetAddress = addr.replace(m[0], '').trim() || undefined;
  return { postalCode, streetAddress };
}

// 去掉 jpName 末尾的法人后缀（如「（医療法人）」「（医療法人 順心会）」），用于标题显示
export function cleanJpName(jp?: string): string {
  if (!jp) return '';
  return jp.replace(/[（(](医療法人|社会福祉法人|一般社団法人|公益財団法人|医療法人社団|医療法人財団)[^）)]*[）)]\s*$/, '').trim();
}

// 机构名词：Hospital→医院/Hospital，其余→诊所/Clinic
export function typeNoun(h: H, locale: Locale): string {
  const isHospital = medicalType(h) === 'Hospital';
  return locale === 'zh' ? (isHospital ? '医院' : '诊所') : (isHospital ? 'Hospital' : 'Clinic');
}

// 标题用的语言短语：按规范顺序取前 max 种，中文用「・」、英文用「 & 」连接
export function featuredLangLabel(h: H, locale: Locale, max = 2): string {
  const langs = sortLangs([...new Set(h.langs || [])]).slice(0, max);
  const labels = langs.map((l) => langLabel(l, locale));
  if (!labels.length) return locale === 'zh' ? '外语' : 'Multilingual';
  return locale === 'zh' ? labels.join('・') : labels.join(' & ');
}
