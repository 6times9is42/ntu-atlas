/* NTU Atlas events worker
   - cron: reads NTU's events page and public Telegram channels (extracting those with Groq), stores events in KV
   - email: accepts forwarded announcement emails from allowed senders
   - fetch: serves GET /api/events to the site */
import PostalMime from 'postal-mime';
import { fetchChannel } from './telegram.js';
import { fetchNtuEvents } from './ntu.js';
import { extractEvents } from './extract.js';
import { senderVerified, sameEvent } from './safety.js';

const STORE_KEY = 'events';
const NEXT_CHANNEL_KEY = 'tg:next-channel';
const FIRST_RUN_POSTS = 9;
// Groq's free tier allows 8,000 tokens a minute, and big batches lose posts
const BATCH = 3;
const BATCH_PAUSE_MS = 20000;
// A Cloudflare run allows 50 outside requests: one page per channel, one for NTU, and this many Groq calls
const MAX_BATCHES_PER_RUN = 25;

const list = s => String(s || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);

async function loadStore(env) {
  return (await env.EVENTS_KV.get(STORE_KEY, 'json')) || { updated: null, events: [] };
}

function eventId(e) {
  const key = `${e.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()}|${e.start.slice(0, 10)}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return `ev${(h >>> 0).toString(36)}`;
}

const trust = e => (e.source && e.source.type === 'telegram' ? 1 : 0);

async function saveEvents(env, incoming) {
  const store = await loadStore(env);
  const byId = new Map(store.events.map(e => [e.id, e]));
  for (const e of incoming) {
    e.id = eventId(e);
    byId.set(e.id, { ...byId.get(e.id), ...e });
  }
  const cutoff = Date.now() - 12 * 36e5;
  // Channels cross-post the same event under slightly different titles. NTU's own listing wins over Telegram.
  const kept = [];
  for (const e of [...byId.values()].sort((a, b) => trust(a) - trust(b))) {
    if (new Date(e.end || e.start).getTime() > cutoff && !kept.some(k => sameEvent(k, e))) kept.push(e);
  }
  const events = kept.sort((a, b) => new Date(a.start) - new Date(b.start)).slice(0, 300);
  await env.EVENTS_KV.put(STORE_KEY, JSON.stringify({ updated: new Date().toISOString(), events }));
  return events.length;
}

// Returns false if the batch budget ran out before this channel was finished
async function readChannel(env, channel, found, budget) {
  const lastKey = `tg:${channel}:last`;
  const last = parseInt(await env.EVENTS_KV.get(lastKey) || '0', 10);
  let posts = (await fetchChannel(channel)).filter(p => p.id > last);
  if (!last) posts = posts.slice(-FIRST_RUN_POSTS);
  for (let i = 0; i < posts.length; i += BATCH) {
    if (budget.left <= 0) return false;
    budget.left--;
    if (budget.used++) await new Promise(r => setTimeout(r, env.BATCH_PAUSE_MS === undefined ? BATCH_PAUSE_MS : Number(env.BATCH_PAUSE_MS)));
    const chunk = posts.slice(i, i + BATCH);
    const events = await extractEvents(env, chunk.map(p => ({ ref: String(p.id), postedAt: p.postedAt, text: p.text })));
    for (const e of events) {
      const post = chunk.find(p => String(p.id) === String(e.ref));
      delete e.ref;
      e.source = { type: 'telegram', channel, url: post ? post.url : `https://t.me/${channel}` };
      found.push(e);
    }
    // Save before moving the marker, so a run that gets cut off never loses events
    if (events.length) await saveEvents(env, found);
    await env.EVENTS_KV.put(lastKey, String(Math.max(...chunk.map(p => p.id))));
  }
  return true;
}

// One source failing must not cost the others their events; a failed channel retries next run.
// When the budget runs out, the next run picks up from the unfinished channel.
async function ingestSources(env) {
  const found = [];
  try { found.push(...await fetchNtuEvents()); } catch (err) { console.log('NTU events failed:', err.message); }
  const channels = list(env.TELEGRAM_CHANNELS);
  const first = parseInt(await env.EVENTS_KV.get(NEXT_CHANNEL_KEY) || '0', 10) % channels.length || 0;
  const budget = { left: MAX_BATCHES_PER_RUN, used: 0 };
  let resumeAt = 0;
  for (let n = 0; n < channels.length; n++) {
    const at = (first + n) % channels.length;
    try {
      if (!await readChannel(env, channels[at], found, budget)) { resumeAt = at; break; }
    } catch (err) { console.log(`Telegram ${channels[at]} failed:`, err.message); }
  }
  await env.EVENTS_KV.put(NEXT_CHANNEL_KEY, String(resumeAt));
  return saveEvents(env, found);
}

async function ingestEmail(message, env) {
  const from = String(message.from || '').toLowerCase();
  if (!list(env.ALLOWED_FORWARDERS).includes(from)) {
    message.setReject('This address only accepts forwards from NTU Atlas maintainers.');
    return;
  }
  const mail = await new PostalMime().parse(message.raw);
  // A From address can be forged, so the header must match and its domain must pass authentication
  const headerFrom = String(mail.from && mail.from.address || '').toLowerCase();
  const authResults = (mail.headers || []).find(h => h.key === 'authentication-results');
  if (!list(env.ALLOWED_FORWARDERS).includes(headerFrom) || !senderVerified(authResults && authResults.value, headerFrom)) {
    console.log('Email rejected: sender failed authentication', authResults ? authResults.value : 'no Authentication-Results header');
    message.setReject('This address only accepts forwards from NTU Atlas maintainers.');
    return;
  }
  const text = (mail.text || (mail.html || '').replace(/<[^>]+>/g, ' ')).replace(/\s+\n/g, '\n').trim();
  const events = await extractEvents(env, [{ ref: 'email', postedAt: mail.date || new Date().toISOString(), text: `Subject: ${mail.subject || ''}\n\n${text}` }]);
  events.forEach(e => { delete e.ref; e.source = { type: 'email' }; });
  await saveEvents(env, events);
}

const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', ...extra },
});

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/api/events' && req.method === 'GET') {
      const store = await loadStore(env);
      return json(store, 200, { 'cache-control': 'public, max-age=300' });
    }
    if (url.pathname === '/api/refresh' && req.method === 'POST') {
      if (!env.ADMIN_TOKEN || req.headers.get('authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return json({ error: 'unauthorised' }, 401);
      const count = await ingestSources(env);
      return json({ ok: true, stored: count });
    }
    return json({ error: 'not found' }, 404);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(ingestSources(env));
  },
  async email(message, env, ctx) {
    await ingestEmail(message, env);
  },
};
