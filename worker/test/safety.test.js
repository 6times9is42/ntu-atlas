// Checks the email sender and link rules. Run with: npm test
import assert from 'node:assert/strict';
import { cleanUrl, linkFromSource, senderVerified } from '../src/safety.js';

const me = 'me@e.ntu.edu.sg';

assert.equal(senderVerified('mx.cloudflare.net; dkim=pass header.d=e.ntu.edu.sg header.s=x; spf=pass; dmarc=pass header.from=e.ntu.edu.sg', me), true);
assert.equal(senderVerified('mx.cloudflare.net; dmarc=pass header.from=e.ntu.edu.sg', me), true);
assert.equal(senderVerified('mx.cloudflare.net; dkim=pass header.d=e.ntu.edu.sg', me), true);
assert.equal(senderVerified('mx.cloudflare.net; dkim=pass header.d=evil.com; spf=pass; dmarc=none header.from=e.ntu.edu.sg', me), false);
assert.equal(senderVerified('mx.cloudflare.net; dkim=pass header.d=note.ntu.edu.sg.evil.com', me), false);
assert.equal(senderVerified('mx.cloudflare.net; dkim=fail header.d=e.ntu.edu.sg; dmarc=fail header.from=e.ntu.edu.sg', me), false);
assert.equal(senderVerified('mx.cloudflare.net; spf=pass smtp.mailfrom=e.ntu.edu.sg', me), false);
assert.equal(senderVerified('mail.evil.com; dkim=pass header.d=e.ntu.edu.sg', me), false);
assert.equal(senderVerified('mx.cloudflare.net;\r\n dkim=pass\r\n header.d=e.ntu.edu.sg', me), true);
assert.equal(senderVerified(undefined, me), false);
assert.equal(senderVerified('mx.cloudflare.net; dkim=pass header.d=e.ntu.edu.sg', 'nobody'), false);

assert.equal(cleanUrl('https://ntu.edu.sg/a?b=1'), 'https://ntu.edu.sg/a?b=1');
assert.equal(cleanUrl('javascript:alert(1)'), null);
assert.equal(cleanUrl('data:text/html,x'), null);
assert.equal(cleanUrl('https://user:pw@evil.com/'), null);
assert.equal(cleanUrl('https://ntu.edu.sg/\r\nATTENDEE:mailto:x@evil.com'), null);
assert.equal(cleanUrl(42), null);

const post = 'Register here (https://forms.cloud.microsoft/r/abc) by Friday.';
assert.equal(linkFromSource('https://forms.cloud.microsoft/r/abc', post), 'https://forms.cloud.microsoft/r/abc');
assert.equal(linkFromSource('https://evil.com/phish', post), null);
assert.equal(linkFromSource('https://evil.com/phish', undefined), null);

console.log('safety checks passed');
