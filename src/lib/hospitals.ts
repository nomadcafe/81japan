import { getCollection, type CollectionEntry } from 'astro:content';

type HospitalData = CollectionEntry<'hospitals'>['data'];

export type Hospital = Omit<HospitalData, '_order'> & { slug: string };

export async function loadHospitals(): Promise<Hospital[]> {
  const entries = await getCollection('hospitals');
  return entries
    .slice()
    .sort((a, b) => a.data._order - b.data._order)
    .map((e) => {
      const { _order, ...data } = e.data;
      return { ...data, slug: e.id };
    });
}

export function hospitalSlug(h: Hospital): string {
  return h.slug;
}
