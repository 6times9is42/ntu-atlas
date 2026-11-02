// Checks how NTU's events listing is read. Run with: npm test
import assert from 'node:assert/strict';
import { parseNtuEvents, fetchNtuEvents } from '../src/ntu.js';

const good = { title: ' Talk ', url: 'https://www.ntu.edu.sg/events/detail/2026/11/05/x', tag: 'Conferences & Seminars', description: 'About it', location: 'LT1', alldayevent: 0, eventstart: '20261105T183000', eventend: '20261105T210000' };
const [e] = parseNtuEvents({ items: [good] });
assert.equal(e.title, 'Talk');
assert.equal(e.start, '2026-11-05T18:30:00+08:00');
assert.equal(e.end, '2026-11-05T21:00:00+08:00');
assert.equal(e.category, 'Talks');
assert.equal(e.source.url, good.url);

assert.equal(parseNtuEvents({ items: [{ ...good, url: 'https://evil.com/x' }] }).length, 0);
assert.equal(parseNtuEvents({ items: [{ ...good, eventstart: 'soon' }] }).length, 0);
assert.equal(parseNtuEvents({ items: [{ ...good, title: '' }] }).length, 0);
assert.equal(parseNtuEvents({ items: [{ ...good, eventend: null }] })[0].end, null);
assert.equal(parseNtuEvents(null).length, 0);

console.log('ntu checks passed');
if (process.argv[2] === 'live') console.log((await fetchNtuEvents()).map(x => `${x.start} ${x.title}`).join('\n'));
