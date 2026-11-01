// Fetches the live NTUSU channel preview and prints what the parser sees.
import { fetchChannel } from '../src/telegram.js';

const posts = await fetchChannel(process.argv[2] || 'ntusu');
console.log(`${posts.length} posts parsed`);
for (const p of posts.slice(-3)) console.log(`\n#${p.id} ${p.postedAt}\n${p.text.slice(0, 400)}`);
