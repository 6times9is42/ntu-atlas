/* NTU Atlas events worker
   - cron: reads public Telegram channels, extracts events with Groq, stores them in KV
   - email: accepts forwarded announcement emails from allowed senders
   - fetch: serves GET /api/events to the site */
import PostalMime from 'postal-mime';
import { fetchChannel } from './telegram.js';
import { extractEvents } from './extract.js';

const STORE_KEY = 'events';
const FIRST_RUN_POSTS = 15;
const BATCH = 10;

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

async function saveEvents(env, incoming) {
  const store = await loadStore(env);
  const byId = new Map(store.events.map(e => [e.id, e]));
  for (const e of incoming) {
    e.id = eventId(e);
    byId.set(e.id, { ...byId.get(e.id), ...e });
  }
  const cutoff = Date.now() - 12 * 36e5;
  const events = [...byId.values()]
    .filter(e => new Date(e.end || e.start).getTime() > cutoff)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 300);
  await env.EVENTS_KV.put(STORE_KEY, JSON.stringify({ updated: new Date().toISOString(), events }));
  return events.length;
}

async function ingestTelegram(env) {
  const found = [];
  for (const channel of list(env.TELEGRAM_CHANNELS)) {
    const lastKey = `tg:${channel}:last`;
    const last = parseInt(await env.EVENTS_KV.get(lastKey) || '0', 10);
    let posts = (await fetchChannel(channel)).filter(p => p.id > last);
    if (!last) posts = posts.slice(-FIRST_RUN_POSTS);
    for (let i = 0; i < posts.length; i += BATCH) {
      const chunk = posts.slice(i, i + BATCH);
      const events = await extractEvents(env, chunk.map(p => ({ ref: String(p.id), postedAt: p.postedAt, text: p.text })));
      for (const e of events) {
        const post = chunk.find(p => String(p.id) === String(e.ref));
        delete e.ref;
        e.source = { type: 'telegram', channel, url: post ? post.url : `https://t.me/${channel}` };
        found.push(e);
      }
    }
    if (posts.length) await env.EVENTS_KV.put(lastKey, String(Math.max(...posts.map(p => p.id))));
  }
  return saveEvents(env, found);
}

async function ingestEmail(message, env) {
  const from = String(message.from || '').toLowerCase();
  if (!list(env.ALLOWED_FORWARDERS).includes(from)) {
    message.setReject('This address only accepts forwards from NTU Atlas maintainers.');
    return;
  }
  const mail = await new PostalMime().parse(message.raw);
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
      const count = await ingestTelegram(env);
      return json({ ok: true, stored: count });
    }
    return json({ error: 'not found' }, 404);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(ingestTelegram(env));
  },
  async email(message, env, ctx) {
    await ingestEmail(message, env);
  },
};
