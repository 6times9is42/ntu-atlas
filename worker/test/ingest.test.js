// Checks a run stays inside its budget, resumes where it stopped and survives a failing channel. Run with: npm test
import assert from 'node:assert/strict';
import worker from '../src/index.js';

const kv = new Map();
const EVENTS_KV = { get: async (k, type) => { const v = kv.get(k); return v && type === 'json' ? JSON.parse(v) : v ?? null; }, put: async (k, v) => { kv.set(k, v); } };
const page = (ch, n) => Array.from({ length: n }, (_, i) => `<div data-post="${ch}/${i + 1}"><div class="tgme_widget_message_text">Announcement number ${i + 1} from the channel, long enough to count.</div><time datetime="2026-11-01T00:00:00+00:00"></time></div>`).join('');
let groqCalls = 0;
globalThis.fetch = async (url, opts) => {
  url = String(url);
  if (url.includes('GetEvents')) return new Response(JSON.stringify({ items: [] }));
  if (url.includes('t.me/s/bad')) return new Response('', { status: 500 });
  const tg = url.match(/t\.me\/s\/(\w+)/);
  if (tg) return new Response(page(tg[1], 9));
  groqCalls++;
  // A malformed event from the model must be dropped, not stall the channel
  if (groqCalls === 1) return new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify({ events: [{ ref: '1', title: 'Bad', start: 1730000000000 }, { ref: '1', title: ['x'], start: '2026-12-01T10:00:00+08:00' }] }) } }] }));
  const ref = JSON.parse(opts.body).messages[1].content.match(/Announcement (\d+)/)[1];
  const content = JSON.stringify({ events: [{ ref, title: `Event ${groqCalls}`, start: `2026-12-${String(groqCalls % 28 + 1).padStart(2, '0')}T10:00:00+08:00`, category: 'Talks' }] });
  return new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { content } }] }));
};
const log = console.log; console.log = () => {};
const env = { EVENTS_KV, GROQ_API_KEY: 'test', BATCH_PAUSE_MS: 0, TELEGRAM_CHANNELS: Array.from({ length: 12 }, (_, i) => `ch${i}`).concat('bad').join(',') };
const run = async () => { let job; await worker.scheduled({}, env, { waitUntil: p => { job = p; } }); await job; };

await run();
assert.equal(groqCalls, 25);
assert.equal(kv.get('tg:next-channel'), '8');
assert.equal(kv.get('tg:ch8:last'), '3');
await run();
assert.equal(groqCalls, 36);
assert.equal(kv.get('tg:next-channel'), '0');
assert.equal(kv.get('tg:ch11:last'), '9');
assert.equal(JSON.parse(kv.get('events')).events.length > 20, true);
await run();
assert.equal(groqCalls, 36);
console.log = log;
console.log('ingest checks passed');
