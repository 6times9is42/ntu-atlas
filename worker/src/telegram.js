/* Reads a public Telegram channel through its web preview (t.me/s/<channel>). */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#33': '!', '#39': "'" };

export function htmlToText(html) {
  return html
    .replace(/<i class="emoji"[^>]*>.*?<\/i>/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g, (m, href, text) => {
      const t = text.replace(/<[^>]+>/g, '');
      return t.trim() === href || href.startsWith('?') ? t : `${t} (${href})`;
    })
    .replace(/<[^>]+>/g, '')
    .replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e) => {
      if (ENTITIES[e]) return ENTITIES[e];
      if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
      return m;
    })
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function parseChannel(html, channel) {
  const posts = [];
  const parts = html.split(`data-post="${channel}/`).slice(1);
  for (const part of parts) {
    const id = parseInt(part, 10);
    const textMatch = part.match(/tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/);
    const timeMatch = part.match(/<time datetime="([^"]+)"/);
    if (!id || !textMatch) continue;
    const text = htmlToText(textMatch[1]);
    if (text.length < 40) continue;
    posts.push({ id, postedAt: timeMatch ? timeMatch[1] : null, text, url: `https://t.me/${channel}/${id}` });
  }
  return posts;
}

export async function fetchChannel(channel) {
  const res = await fetch(`https://t.me/s/${channel}`, { headers: { 'user-agent': 'NTU-Atlas-Events/1.0 (+https://ntuatlas.com)' } });
  if (!res.ok) throw new Error(`Telegram ${channel}: HTTP ${res.status}`);
  return parseChannel(await res.text(), channel);
}
