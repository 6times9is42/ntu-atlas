/* Checks on untrusted input: who really sent an email, and which links may reach the site. */

const CONTROL = /[\u0000-\u001f\u007f]/;

// Returns the normalised URL, or null unless it's plain http(s) without embedded credentials
export function cleanUrl(link) {
  if (typeof link !== 'string' || CONTROL.test(link)) return null;
  let url;
  try { url = new URL(link); } catch { return null; }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
  return url.href;
}

// The model may only repeat a link that is written in the announcement it read
export function linkFromSource(link, sourceText) {
  if (typeof link !== 'string' || typeof sourceText !== 'string') return null;
  return sourceText.includes(link) ? cleanUrl(link) : null;
}

const sameOrgDomain = (found, domain) => found === domain || found.endsWith(`.${domain}`);

/* True only if Cloudflare's own Authentication-Results header shows the sender's domain
   passed DMARC or DKIM. Pass the first such header in the message: a receiver adds its
   result on top, so anything below it may have been written by the sender. */
export function senderVerified(authResults, from) {
  const domain = String(from || '').toLowerCase().split('@')[1];
  if (!domain || typeof authResults !== 'string') return false;
  const [server, ...results] = authResults.toLowerCase().replace(/\s+/g, ' ').split(';').map(s => s.trim());
  if (server.split(/\s+/)[0] !== 'mx.cloudflare.net') return false;
  return results.some(r => {
    const dmarc = r.match(/^dmarc=pass\b.*\bheader\.from=([^\s;]+)/);
    if (dmarc) return sameOrgDomain(dmarc[1], domain);
    const dkim = r.match(/^dkim=pass\b.*\bheader\.(?:d|i)=@?([^\s;]+)/);
    return dkim ? sameOrgDomain(dkim[1], domain) : false;
  });
}
