import hospitalsData from '../../public/hospitals.json';

export function loadHospitals() {
  return hospitalsData;
}

export function toSlug(name) {
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

export function hospitalSlug(h) {
  return h.slug || toSlug(h.jpName || h.name);
}
