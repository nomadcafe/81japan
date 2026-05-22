import { defineCollection, z } from 'astro:content';
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
    addressShort: z.string().optional(),
    phone: z.string().optional(),
    langs: z.array(z.string()).optional(),
    langDetail: z.string().optional(),
    depts: z.array(z.string()).optional(),
    hours: z.string().optional(),
    hoursShort: z.string().optional(),
    closed: z.string().optional(),
    note: z.string().optional(),
    warning: z.string().optional(),
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
