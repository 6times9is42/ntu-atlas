/* Reads NTU's public events listing (the JSON behind ntu.edu.sg/events). Already structured, so no model is needed. */
import { CATEGORIES } from './extract.js';
import { cleanUrl } from './safety.js';

const ENDPOINT = 'https://www.ntu.edu.sg/events/GetEvents/';
const CATEGORY_BY_TAG = { 'conferences & seminars': 'Talks', 'workshops': 'Workshops', 'exhibitions': 'Arts', 'performances': 'Arts', 'sports': 'Sports', 'careers': 'Careers' };

// "20261105T183000" in Singapore time becomes "2026-11-05T18:30:00+08:00"
function isoFrom(stamp) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/.exec(String(stamp || ''));
  return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}+08:00` : null;
}

export function parseNtuEvents(data) {
  return (data && Array.isArray(data.items) ? data.items : []).flatMap(item => {
    const start = isoFrom(item.eventstart);
    const url = cleanUrl(item.url);
    if (!start || !url || new URL(url).hostname !== 'www.ntu.edu.sg' || typeof item.title !== 'string' || !item.title.trim()) return [];
    const category = CATEGORY_BY_TAG[String(item.tag).toLowerCase()];
    return [{
      title: item.title.trim(),
      start,
      end: isoFrom(item.eventend),
      allDay: Boolean(item.alldayevent),
      venue: item.location || null,
      organiser: 'NTU',
      category: CATEGORIES.includes(category) ? category : 'Other',
      description: String(item.description || '').trim().slice(0, 160),
      link: null,
      source: { type: 'ntu', url },
    }];
  });
}

export async function fetchNtuEvents() {
  const res = await fetch(ENDPOINT, { headers: { 'user-agent': 'NTU-Atlas-Events/1.0 (+https://ntuatlas.com)' } });
  if (!res.ok) throw new Error(`NTU events: HTTP ${res.status}`);
  return parseNtuEvents(await res.json());
}
