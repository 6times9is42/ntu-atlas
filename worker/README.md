# NTU Atlas events feed

A Cloudflare Worker that keeps `ntuatlas.com/api/events` filled with upcoming NTU events.

- **Every two hours** it reads public Telegram channels (the NTU Students' Union by default),
  asks Groq to turn new announcements into structured events, and stores them in Workers KV.
- **Forwarded emails** sent to an address you set up are processed the same way.
- The site fetches `/api/events`. Until this Worker is live, the Events section simply stays hidden.

Nothing is reviewed before it's published, so the site links every event to its source.

## One-time setup

You need Node.js 18+ and the Cloudflare account that hosts ntuatlas.com.

1. **Get a Groq key.** Sign in at https://console.groq.com → API Keys → Create. The free tier is plenty
   (one request every two hours).
2. **Install and log in** (from this `worker` folder):
   ```bash
   npm install
   npx wrangler login
   ```
3. **Create the KV store** and paste the `id` it prints into `wrangler.toml` (replace `REPLACE_WITH_YOUR_KV_NAMESPACE_ID`):
   ```bash
   npx wrangler kv namespace create EVENTS_KV
   ```
4. **Add the secrets** (each command asks you to paste the value):
   ```bash
   npx wrangler secret put GROQ_API_KEY
   npx wrangler secret put ADMIN_TOKEN
   ```
   `ADMIN_TOKEN` is any long random string you make up. It lets you trigger a refresh by hand.
5. **Deploy:**
   ```bash
   npx wrangler deploy
   ```
   This also attaches the Worker to `ntuatlas.com/api/*` and schedules the two-hourly run.
6. **Fill it straight away** instead of waiting for the first scheduled run:
   ```bash
   curl -X POST https://ntuatlas.com/api/refresh -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```
   Then open https://ntuatlas.com/api/events to see what was stored. The Events section appears on the site
   once that returns successfully.

To watch it run: `npx wrangler tail`.

## Adding more sources

- **More Telegram channels:** add their usernames to `TELEGRAM_CHANNELS` in `wrangler.toml`
  (comma-separated, public channels only) and redeploy.
- **Venue pins:** the site places events on its campus map by matching the venue text against
  `venues.js` in the site root. Add aliases there when an event shows "Not on the map".

## Email forwarding (optional)

This lets you forward event announcements from your school inbox.

1. In the Cloudflare dashboard: **ntuatlas.com → Email → Email Routing → Get started**
   (it adds the DNS records for you).
2. **Routing rules → Create address**, e.g. `events@ntuatlas.com`, action **Send to a Worker** →
   `ntu-atlas-events`.
3. Put the address(es) you'll forward from in `ALLOWED_FORWARDERS` in `wrangler.toml` and redeploy.
   Mail from anyone else is rejected.
4. Forward announcements to `events@ntuatlas.com`, by hand or with an Outlook rule
   (Settings → Mail → Rules → "Forward to"). NTU's mail system may block automatic forwarding to
   outside addresses; if a rule doesn't go through, forwarding by hand still works.

Only forward mass announcements (clubs, offices, the SU), never personal mail. The Worker keeps
only the extracted event details, not the email itself.

## Local testing

```bash
npm run test:telegram     # fetches the live NTUSU channel and prints what the parser sees
npm run dev               # runs the Worker locally; visit http://localhost:8787/__scheduled to fire the cron
```
Put local secrets in `worker/.dev.vars` (git-ignored):
```
GROQ_API_KEY=...
ADMIN_TOKEN=...
```
