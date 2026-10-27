import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';

function toSlug(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/[（(][^）)]*[）)]/g, '')
    .split(/[\/／・]/)[0]
    .trim()
    .replace(/['']/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

const PLACEHOLDER_MSG = 'phone 不能是占位号码（如 03-1234-XXXX）；未核实就删掉该字段';
const noPlaceholderDigits = (v: string) => !/[xX]{2,}/.test(v);

const hospitals = defineCollection({
  loader: file('src/data/hospitals.json', {
    parser: (text) => {
      const arr = JSON.parse(text) as Array<Record<string, unknown>>;
      return arr.map((h, i) => ({
        ...h,
        id: (h.slug as string) || toSlug((h.jpName as string) || (h.name as string)),
        _order: i,
      }));
    },
  }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    jpName: z.string().optional(),
    region: z.string().optional(),
    address: z.string().optional(),
    addressEn: z.string().optional(),
    addressShort: z.string().optional(),
    addressShortEn: z.string().optional(),
    // 占位号码（03-1234-XXXX 之类）此前会照原样显示，还会进 JSON-LD 的
    // telephone —— 等于把编出来的号码当真号发布。号码没核实就整个留空，
    // 详情页与卡片都已经会跳过缺失的 phone。
    phone: z.string().refine(noPlaceholderDigits, PLACEHOLDER_MSG).optional(),
    phoneEn: z.string().refine(noPlaceholderDigits, PLACEHOLDER_MSG).optional(),
    langs: z.array(z.string()).optional(),
    langDetail: z.string().optional(),
    langDetailEn: z.string().optional(),
    depts: z.array(z.string()).optional(),
    hours: z.string().optional(),
    hoursEn: z.string().optional(),
    hoursShort: z.string().optional(),
    hoursShortEn: z.string().optional(),
    closed: z.string().optional(),
    closedEn: z.string().optional(),
    note: z.string().optional(),
    noteEn: z.string().optional(),
    warning: z.string().optional(),
    warningEn: z.string().optional(),
    updated: z
      .string()
      .regex(/^\d{4}-\d{1,2}$/, 'updated must be YYYY-MM'),
    searchKeys: z.string().optional(),
    slug: z.string().optional(),
    extraBadges: z
      .array(
        z.object({
          label: z.string(),
          type: z.string().optional(),
        }),
      )
      .optional(),
    _order: z.number(),
  }),
});

export const collections = { hospitals };
