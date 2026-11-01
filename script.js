/* ——— SEARCH FUNCTION ——— */
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const intentMap = {
  'grades': ['Transcript', 'Degree Audit', 'FGO Option'],
  'grade': ['Transcript', 'Degree Audit', 'FGO Option'],
  'gpa': ['Transcript', 'Degree Audit'],
  'housing': ['Hall Portal'],
  'hall': ['Hall Portal'],
  'dorm': ['Hall Portal'],
  'room': ['Hall Portal', 'Library Booking', 'Facilities Booking'],
  'internship': ['CareerAxis', 'Work Study Scheme'],
  'job': ['CareerAxis', 'Work Study Scheme'],
  'career': ['CareerAxis'],
  'register': ['STARS'],
  'module': ['STARS', 'NTULearn', 'Class Schedule'],
  'course': ['STARS', 'NTULearn', 'Class Schedule', 'MOOC Transfer'],
  'exam': ['Exam Timetable', 'Exam Seating'],
  'money': ['Financial Aid'],
  'scholarship': ['Financial Aid'],
  'bursary': ['Financial Aid'],
  'overseas': ['Exchange Portal', 'Course Matching'],
  'exchange': ['Exchange Portal', 'Course Matching'],
  'library': ['Library Booking'],
  'study room': ['Library Booking'],
  'booking': ['Library Booking', 'Facilities Booking'],
  'sport': ['Facilities Booking'],
  'sports': ['Sports & Rec Centre'],
  'bus': ['Campus Shuttle'],
  'shuttle': ['Campus Shuttle'],
  'map': ['Campus Map'],
  'canteen': ['Food & Beverage'],
  'food': ['Food & Beverage'],
  'health': ['Student Health Centre', 'Counselling Services'],
  'counsel': ['Counselling Services'],
  'mental': ['Counselling Services'],
  'vpn': ['NTU VPN'],
  'wifi': ['eduroam Setup'],
  'email': ['IT Service Desk'],
  'office': ['IT Service Desk'],
  'it': ['IT Service Desk'],
  'graduation': ['Graduation'],
  'international': ['Global Education Office'],
  'osa': ['One Stop @ SAC'],
  'ssc': ['One Stop @ SAC'],
};

function searchLinks(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  let results = [];

  // Intent match on portal links first
  for (const [key, names] of Object.entries(intentMap)) {
    if (q.includes(key)) {
      names.forEach(n => {
        const link = allLinks.find(l => l.name === n);
        if (link && !results.find(r => r.name === link.name)) results.push(link);
      });
    }
  }
  // Fuzzy portal link match
  allLinks.forEach(link => {
    if (!results.find(r => r.name === link.name)) {
      if (link.name.toLowerCase().includes(q) || link.desc.toLowerCase().includes(q) || link.cat.toLowerCase().includes(q)) {
        results.push(link);
      }
    }
  });
  // Club match — shown with cat: 'Club'
  allClubs.forEach(club => {
    if (!results.find(r => r.name === club.name)) {
      if (club.name.toLowerCase().includes(q) || club.desc.toLowerCase().includes(q) || club.type.toLowerCase().includes(q)) {
        results.push({ name: club.name, cat: 'Club', url: club.instagram ? `https://instagram.com/${club.instagram}` : '#' });
      }
    }
  });

  return results.slice(0, 8);
}

searchInput.addEventListener('input', () => {
  const q = searchInput.value;
  const results = searchLinks(q);
  if (results.length === 0 || !q.trim()) {
    searchResults.innerHTML = '';
    searchResults.classList.remove('active');
    return;
  }
  searchResults.innerHTML = '';
  results.forEach(r => {
    const a = document.createElement('a');
    a.className = 'search-result-item';
    a.href = r.url;
    a.target = '_blank';
    a.rel = 'noopener';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'search-result-name';
    nameSpan.textContent = r.name;
    a.style.setProperty('--line', `var(--l-${CAT_LINE[r.cat] || 'slate'})`);
    const catSpan = document.createElement('span');
    catSpan.className = 'search-result-cat';
    catSpan.textContent = r.cat;
    a.appendChild(nameSpan);
    a.appendChild(catSpan);
    searchResults.appendChild(a);
  });
  searchResults.classList.add('active');
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { searchResults.classList.remove('active'); return; }
  if (e.key === 'ArrowDown') {
    const first = searchResults.querySelector('.search-result-item');
    if (first && searchResults.classList.contains('active')) { e.preventDefault(); first.focus(); }
  }
});

searchResults.addEventListener('keydown', e => {
  const items = Array.from(searchResults.querySelectorAll('.search-result-item'));
  const idx = items.indexOf(document.activeElement);
  if (idx === -1) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); (items[idx + 1] || items[0]).focus(); }
  if (e.key === 'ArrowUp') { e.preventDefault(); idx === 0 ? searchInput.focus() : items[idx - 1].focus(); }
  if (e.key === 'Escape') { searchResults.classList.remove('active'); searchInput.focus(); }
});

document.addEventListener('click', e => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.classList.remove('active');
  }
});

searchInput.addEventListener('focus', () => {
  if (searchInput.value.trim()) {
    const results = searchLinks(searchInput.value);
    if (results.length > 0) searchResults.classList.add('active');
  }
});

/* ——— TABS ——— */
document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    document.querySelectorAll('.cat-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) panel.classList.add('active');
  });
  tab.addEventListener('keydown', e => {
    const tabs = Array.from(document.querySelectorAll('.cat-tab'));
    const idx = tabs.indexOf(e.target);
    if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx + 1) % tabs.length].focus(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].focus(); }
  });
});

/* ——— THEME TOGGLE ——— */
const toggle = document.getElementById('themeToggle');

function syncToggleLabel() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}
syncToggleLabel();

toggle.addEventListener('click', () => {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  const apply = () => html.setAttribute('data-theme', next);
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(apply);
  else apply();
  try { localStorage.setItem('theme', next); } catch (e) {}
  syncToggleLabel();
});

/* ——— NAV SCROLL STATE ——— */
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ——— PORTALS ——— */
const CAT_PANEL_MAP = {
  'Academics': 'panel-academics',
  'Career': 'panel-career',
  'Exchange': 'panel-exchange',
  'Facilities': 'panel-facilities',
  'Finance': 'panel-finance',
  'Housing': 'panel-housing',
  'Community': 'panel-community',
  'Campus Life': 'panel-campuslife',
  'IT & Tech': 'panel-ittech',
  'Student Services': 'panel-services',
};
const CAT_LINE = {
  'Academics': 'red',
  'Career': 'amber',
  'Exchange': 'sky',
  'Facilities': 'green',
  'Finance': 'olive',
  'Housing': 'brown',
  'Community': 'purple',
  'Campus Life': 'pink',
  'IT & Tech': 'teal',
  'Student Services': 'slate',
  'Club': 'yellow',
};
const ACADEMICS_GROUP_ORDER = ['Core academic', 'Results', 'Registration', 'Resources', 'MOOCs'];

function renderPortals() {
  for (const [cat, panelId] of Object.entries(CAT_PANEL_MAP)) {
    const grid = document.querySelector(`#${panelId} .links-grid`);
    if (!grid) continue;
    const catLinks = allLinks.filter(l => l.cat === cat);
    const groups = cat === 'Academics' ? ACADEMICS_GROUP_ORDER : [null];
    let html = '';
    let i = 0;
    for (const group of groups) {
      const groupLinks = catLinks.filter(l => l.group === group);
      if (!groupLinks.length) continue;
      if (group !== null) html += `<div class="links-subgroup-label" aria-hidden="true" style="--i:${i++}"><span>${escapeHtml(group)}</span></div>`;
      for (const link of groupLinks) {
        const name = escapeHtml(link.name);
        const tag = escapeHtml(link.tag);
        const desc = escapeHtml(link.desc);
        const url = escapeHtml(link.url);
        html += `<a class="link-card" href="${url}" target="_blank" rel="noopener" style="--i:${i++}"><span class="link-card-tag">${tag}</span><span class="link-card-name">${name}</span><span class="link-card-desc">${desc}</span></a>`;
      }
    }
    grid.innerHTML = html;
    grid.classList.toggle('is-long', catLinks.length > 6);
  }
}

renderPortals();

/* ——— CLUBS & SOCIETIES ——— */
const clubsGrid = document.getElementById('clubsGrid');
const clubsCount = document.getElementById('clubsCount');

const clubsMore = document.getElementById('clubsMore');
const CLUBS_PREVIEW = 24;
let clubFilter = 'All';
let clubsExpanded = false;

const instagramSVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`;
function renderClubs(filter) {
  const filtered = filter === 'All' ? allClubs : allClubs.filter(c => c.type === filter);
  const count = filtered.length;
  clubsCount.textContent = `${count} ${count === 1 ? 'club' : 'clubs'}`;
  clubsCount.setAttribute('aria-label', `${count} ${count === 1 ? 'club' : 'clubs'}`);

  const shown = clubsExpanded ? filtered : filtered.slice(0, CLUBS_PREVIEW);
  clubsGrid.innerHTML = shown.map((club, i) => {
    const name = escapeHtml(club.name);
    const type = escapeHtml(club.type);
    const desc = escapeHtml(club.desc);
    const handle = club.instagram ? escapeHtml(club.instagram) : null;

    const igLink = handle
      ? `<a class="club-social-link" href="https://instagram.com/${handle}" target="_blank" rel="noopener" aria-label="${name} on Instagram">${instagramSVG}@${handle}</a>`
      : '';
    return `
      <div class="club-card" role="listitem" data-type="${type}" style="--i:${i}">
        <span class="club-card-tag">${type}</span>
        <span class="club-card-name">${name}</span>
        <span class="club-card-desc">${desc}</span>
        <div class="club-card-links">${igLink}</div>
      </div>`;
  }).join('');

  const hiddenCount = count - shown.length;
  clubsMore.hidden = hiddenCount <= 0;
  clubsMore.textContent = `Show all ${count} ${filter === 'All' ? '' : filter.toLowerCase() + ' '}clubs`;
}

clubsMore.addEventListener('click', () => {
  const firstNew = clubsGrid.children.length;
  clubsExpanded = true;
  renderClubs(clubFilter);
  const next = clubsGrid.children[firstNew];
  const link = next && next.querySelector('a');
  if (link) link.focus({ preventScroll: true });
});

document.querySelectorAll('.club-tab').forEach(tab => {
  const filter = tab.dataset.filter;
  const n = filter === 'All' ? allClubs.length : allClubs.filter(c => c.type === filter).length;
  if (filter !== 'All') tab.dataset.type = filter;
  tab.insertAdjacentHTML('beforeend', ` <span class="club-tab-count" aria-hidden="true">${n}</span>`);
  tab.addEventListener('click', () => {
    document.querySelectorAll('.club-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    clubFilter = filter;
    clubsExpanded = false;
    renderClubs(filter);
  });
  tab.addEventListener('keydown', e => {
    const tabs = Array.from(document.querySelectorAll('.club-tab'));
    const idx = tabs.indexOf(e.target);
    if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx + 1) % tabs.length].focus(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].focus(); }
  });
});

renderClubs('All');

/* ——— LEGAL MODAL ——— */
const legalModal = document.getElementById('legalModal');
const legalModalTitle = document.getElementById('legalModalTitle');
const legalModalBody = document.getElementById('legalModalBody');
let modalTrigger = null;

const legalContent = {
  about: {
    title: 'About NTU Atlas',
    body: `<p>NTU Atlas is a student-built directory of NTU's digital ecosystem — portals, campus services, clubs and societies — all in one place.</p>
<p>Built and maintained by an NTU student. Not affiliated with or endorsed by Nanyang Technological University.</p>
<p>Want to suggest a link, report a broken one, or contribute? <a class="modal-link" href="https://t.me/+vuhtJw7fENg5OTll" target="_blank" rel="noopener">Join the community on Telegram →</a></p>`
  },
  disclaimer: {
    title: 'Disclaimer',
    body: `<p>NTU Atlas is an independent student project and is not affiliated with, endorsed by, or connected to Nanyang Technological University.</p>
<p>Links are student-maintained and may become outdated or inaccurate over time. Use them at your own discretion.</p>
<p>For official NTU information, always refer to <a class="modal-link" href="https://www.ntu.edu.sg" target="_blank" rel="noopener">ntu.edu.sg</a>.</p>`
  },
  privacy: {
    title: 'Privacy Policy',
    body: `<p>NTU Atlas does not collect any personal data. There are no cookies, no analytics, no tracking scripts, and no user accounts.</p>
<p>The only data stored on your device is a single <code>localStorage</code> entry that remembers your dark or light theme preference. It is stored locally in your browser and never transmitted anywhere.</p>
<p>External links on this site lead to third-party websites, each governed by their own privacy policies.</p>`
  }
};

function getFocusable(container) {
  return Array.from(container.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ));
}

function openModal(type) {
  const c = legalContent[type];
  if (!c) return;
  legalModalTitle.textContent = c.title;
  legalModalBody.innerHTML = c.body;
  legalModal.removeAttribute('hidden');
  legalModal.setAttribute('aria-hidden', 'false');
  document.querySelectorAll('body > *:not(#legalModal)').forEach(el => el.setAttribute('inert', ''));
  document.body.style.overflow = 'hidden';
  if (window.lenis) window.lenis.stop();
  legalModalTitle.focus();
}

function closeModal() {
  legalModal.setAttribute('hidden', '');
  legalModal.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('body > *:not(#legalModal)').forEach(el => el.removeAttribute('inert'));
  document.body.style.overflow = '';
  if (window.lenis) window.lenis.start();
  if (modalTrigger) { modalTrigger.focus(); modalTrigger = null; }
}

document.querySelectorAll('.footer-legal-link').forEach(btn => {
  btn.addEventListener('click', () => {
    modalTrigger = btn;
    openModal(btn.dataset.modal);
  });
});

document.getElementById('legalModalClose').addEventListener('click', closeModal);

legalModal.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key !== 'Tab') return;
  const focusable = getFocusable(legalModal);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

legalModal.addEventListener('click', e => {
  if (e.target === legalModal) closeModal();
});



/* ——— SEGMENTED TAB INDICATOR ——— */
function moveInk(list, animate) {
  const ink = list.querySelector('.tab-ink');
  const active = list.querySelector('.active');
  if (!ink || !active) return;
  ink.classList.toggle('no-anim', !animate);
  ink.style.width = active.offsetWidth + 'px';
  ink.style.transform = `translateX(${active.offsetLeft}px)`;
}
const tabLists = document.querySelectorAll('.cat-tabs, .club-tabs, .events-tabs');
tabLists.forEach(list => {
  list.insertAdjacentHTML('afterbegin', '<span class="tab-ink" aria-hidden="true"></span>');
  list.addEventListener('click', e => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    moveInk(list, true);
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  });
});
const placeInk = () => tabLists.forEach(l => moveInk(l, false));
placeInk();
if (document.fonts) document.fonts.ready.then(placeInk);
window.addEventListener('resize', placeInk);

/* ——— "/" FOCUSES SEARCH ——— */
document.addEventListener('keydown', e => {
  if (e.key !== '/' || e.metaKey || e.ctrlKey) return;
  const t = e.target;
  if (t.matches('input, textarea, [contenteditable]')) return;
  e.preventDefault();
  searchInput.focus();
});

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ——— HERO CONTOUR FIELD ———
   Animated topographic lines (marching squares over 3D Perlin noise).
   The pointer raises a hill in the field, so the contours swirl around it. */
(function () {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  const hero = canvas.parentElement;
  const ctx = canvas.getContext('2d');

  const perm = new Uint8Array(512);
  const base = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [base[i], base[j]] = [base[j], base[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = base[i & 255];
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  function grad(h, x, y, z) {
    h &= 15;
    const u = h < 8 ? x : y, v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }
  function noise(x, y, z) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z, B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
    return lerp(
      lerp(lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u), lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u), v),
      lerp(lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u), lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v),
      w);
  }

  const CELL = 12, STEP = 0.075, LEVELS = 13;
  // marching-squares segments per case: pairs of edges (0 top, 1 right, 2 bottom, 3 left)
  const CASES = [[], [3, 2], [2, 1], [3, 1], [0, 1], [3, 0, 2, 1], [0, 2], [3, 0], [3, 0], [0, 2], [0, 1, 3, 2], [0, 1], [3, 1], [2, 1], [3, 2], []];
  let W = 0, H = 0, cols = 0, rows = 0, field, dpr = 1;
  let colors = {};
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, amp: 0, tAmp: 0 };

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    colors = { line: cs.getPropertyValue('--ink-3').trim(), hot: cs.getPropertyValue('--needle').trim() };
    colors.dark = document.documentElement.getAttribute('data-theme') === 'dark';
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    cols = Math.ceil(W / CELL) + 1; rows = Math.ceil(H / CELL) + 1;
    field = new Float32Array(cols * rows);
    if (!pointer.x) { pointer.x = pointer.tx = W * .72; pointer.y = pointer.ty = H * .45; }
  }

  function draw(t) {
    pointer.x += (pointer.tx - pointer.x) * .07;
    pointer.y += (pointer.ty - pointer.y) * .07;
    pointer.amp += (pointer.tAmp - pointer.amp) * .04;
    const z = t * .00006 + (window.__flow || 0), r2 = 2 * 150 * 150; // scrolling stirs the contours
    for (let j = 0; j < rows; j++) {
      const y = j * CELL;
      for (let i = 0; i < cols; i++) {
        const x = i * CELL;
        const dx = x - pointer.x, dy = y - pointer.y;
        field[j * cols + i] = noise(x * .0021, y * .0021, z) + .4 * noise(x * .005 + 7.1, y * .005 + 3.3, z * 1.7)
          + pointer.amp * Math.exp(-(dx * dx + dy * dy) / r2);
      }
    }
    const paths = Array.from({ length: LEVELS * 2 + 1 }, () => new Path2D());
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = field[j * cols + i], b = field[j * cols + i + 1], c = field[(j + 1) * cols + i + 1], d = field[(j + 1) * cols + i];
        const lo = Math.min(a, b, c, d), hi = Math.max(a, b, c, d);
        let k0 = Math.ceil(lo / STEP), k1 = Math.floor(hi / STEP);
        if (k0 > k1) continue;
        k0 = Math.max(k0, -LEVELS); k1 = Math.min(k1, LEVELS);
        const x0 = i * CELL, y0 = j * CELL;
        for (let k = k0; k <= k1; k++) {
          const L = k * STEP;
          const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
          const segs = CASES[idx];
          const path = paths[k + LEVELS];
          for (let s = 0; s < segs.length; s += 2) {
            for (let e = 0; e < 2; e++) {
              const edge = segs[s + e];
              let px, py;
              if (edge === 0) { px = x0 + CELL * (L - a) / (b - a); py = y0; }
              else if (edge === 1) { px = x0 + CELL; py = y0 + CELL * (L - b) / (c - b); }
              else if (edge === 2) { px = x0 + CELL * (L - d) / (c - d); py = y0 + CELL; }
              else { px = x0; py = y0 + CELL * (L - a) / (d - a); }
              e === 0 ? path.moveTo(px, py) : path.lineTo(px, py);
            }
          }
        }
      }
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 340);
    glow.addColorStop(0, colors.hot);
    glow.addColorStop(1, colors.line);
    ctx.strokeStyle = glow;
    paths.forEach((p, n) => {
      const index = (n - LEVELS) % 4 === 0;
      ctx.lineWidth = index ? 1.1 : .7;
      ctx.globalAlpha = (index ? .55 : .26) * (colors.dark ? 1 : .85);
      ctx.stroke(p);
    });
    ctx.globalAlpha = 1;
  }

  let running = false, visible = true, raf = 0;
  function frame(t) { draw(t); raf = running ? requestAnimationFrame(frame) : 0; }
  function setRunning(on) {
    on = on && !reduceMotion && visible && !document.hidden;
    if (on === running) return;
    running = on;
    if (on) raf = requestAnimationFrame(frame); else cancelAnimationFrame(raf);
  }

  readColors(); resize(); draw(performance.now());
  requestAnimationFrame(() => canvas.classList.add('is-on'));
  setRunning(true);

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; setRunning(true); }).observe(hero);
  document.addEventListener('visibilitychange', () => setRunning(true));
  new MutationObserver(() => { readColors(); if (!running) draw(performance.now()); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); draw(performance.now()); }, 120); });

  const lat = document.getElementById('coordLat'), lon = document.getElementById('coordLon');
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    pointer.tx = e.clientX - r.left; pointer.ty = e.clientY - r.top; pointer.tAmp = .55;
    lat.textContent = (1.3483 + (.5 - pointer.ty / H) * .012).toFixed(4) + '° N';
    lon.textContent = (103.6831 + (pointer.tx / W - .5) * .018).toFixed(4) + '° E';
  });
  hero.addEventListener('pointerleave', () => { pointer.tAmp = 0; });
})();

/* ——— MARQUEE ——— speed follows scroll velocity */
(function () {
  const wrap = document.querySelector('.marquee');
  const track = wrap && wrap.querySelector('.marquee-track');
  if (!track) return;
  const names = ['NTULearn', 'STARS', 'Degree Audit', 'CareerAxis', 'Exam Timetable', 'Library Booking', 'Hall Portal', 'Exchange Portal', 'Financial Aid', 'Campus Shuttle'];
  const items = names.map(n => allLinks.find(l => l.name === n)).filter(Boolean);
  const set = hidden => items.map(l =>
    `<a class="marquee-item" href="${escapeHtml(l.url)}" target="_blank" rel="noopener"${hidden ? ' tabindex="-1" aria-hidden="true"' : ''}>${escapeHtml(l.name)}</a>`).join('');
  track.innerHTML = set(false) + set(true);
  if (reduceMotion) return;

  let x = 0, v = 0, lastY = scrollY, half = 0, on = false, hover = false;
  const measure = () => { half = track.scrollWidth / 2; };
  measure();
  window.addEventListener('resize', measure);
  if (document.fonts) document.fonts.ready.then(measure);
  wrap.addEventListener('pointerenter', () => { hover = true; });
  wrap.addEventListener('pointerleave', () => { hover = false; });
  function tick() {
    const dy = scrollY - lastY; lastY = scrollY;
    v += (Math.max(-40, Math.min(40, dy)) * .25 - v) * .1;
    x -= (hover ? .15 : .6) + v;
    if (x <= -half) x += half;
    if (x > 0) x -= half;
    track.style.transform = `translate3d(${x}px,0,0) skewX(${Math.max(-14, Math.min(14, -v * 1.6)).toFixed(2)}deg)`;
    if (on) requestAnimationFrame(tick);
  }
  new IntersectionObserver(([e]) => {
    const was = on; on = e.isIntersecting;
    if (on && !was) { lastY = scrollY; requestAnimationFrame(tick); }
  }).observe(wrap);
})();

/* ——— SCROLL REVEALS ——— */
(function () {
  document.querySelectorAll('.section-title').forEach(h => {
    h.innerHTML = `<span class="line"><span>${h.innerHTML}</span></span>`;
  });
  const targets = [];
  document.querySelectorAll('.section-header').forEach(h => targets.push(h));
  document.querySelectorAll('.section-count, .cat-section, .club-tabs, .clubs-grid, .marquee').forEach(el => { el.dataset.reveal = ''; targets.push(el); });
  document.querySelectorAll('.top-pick-card, .tool-item').forEach(el => {
    el.dataset.reveal = '';
    el.style.setProperty('--rd', Array.from(el.parentElement.children).indexOf(el) % 4);
    targets.push(el);
  });
  if (!('IntersectionObserver' in window)) { targets.forEach(t => t.classList.add('is-in')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    e.target.querySelectorAll('[data-reveal]').forEach(c => { if (!c.closest('.clubs-grid, .cat-section') || c === e.target) c.classList.add('is-in'); });
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px' });
  targets.forEach(t => io.observe(t));
})();

/* ——— FRESHMEN: vertical scroll drives the horizontal route ——— */
(function () {
  const section = document.querySelector('.fresh-section');
  const pin = section && section.querySelector('.fresh-pin');
  const track = section && section.querySelector('.fresh-banner');
  const bar = section && section.querySelector('.fresh-progress span');
  if (!track) return;
  const mq = matchMedia('(min-width: 761px)');
  let dist = 0, padTop = 0;

  function update() {
    if (!section.classList.contains('is-pinned')) {
      bar.style.setProperty('--p', (track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)).toFixed(4));
      return;
    }
    // Measured live: content above (e.g. a shorter portal tab) can move this section at any time
    const start = section.getBoundingClientRect().top + padTop;
    const p = dist > 0 ? Math.min(1, Math.max(0, -start / dist)) : 0;
    track.style.transform = `translate3d(${-p * dist}px,0,0)`;
    bar.style.setProperty('--p', p.toFixed(4));
  }
  function layout() {
    const pinned = mq.matches && !reduceMotion;
    section.classList.toggle('is-pinned', pinned);
    track.style.transform = '';
    section.style.height = '';
    if (pinned) {
      padTop = parseFloat(getComputedStyle(section).paddingTop);
      dist = Math.max(0, track.offsetWidth - pin.clientWidth);
      // a short hold at the end so the last steps settle before the page moves on
      section.style.height = `${pin.offsetHeight + dist + padTop + innerHeight * .3}px`;
    }
    update();
  }
  layout();
  if (document.fonts) document.fonts.ready.then(layout);
  window.addEventListener('resize', layout);
  window.addEventListener('scroll', update, { passive: true });
  track.addEventListener('scroll', update, { passive: true });
})();

/* ——— POINTER: spotlight, magnetic buttons, trailing cursor ——— */
(function () {
  if (!finePointer) return;
  document.querySelectorAll('.tool-item, .club-card, .links-grid, .fresh-item').forEach(el => el.classList.add('spot'));
  new MutationObserver(() => clubsGrid.querySelectorAll('.club-card:not(.spot)').forEach(el => el.classList.add('spot')))
    .observe(clubsGrid, { childList: true });

  document.addEventListener('pointermove', e => {
    const s = e.target.closest && e.target.closest('.spot');
    if (!s) return;
    const r = s.getBoundingClientRect();
    s.style.setProperty('--mx', `${e.clientX - r.left}px`);
    s.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });

  if (reduceMotion) return;
  document.querySelectorAll('.top-pick-arrow, .theme-toggle, .clubs-more').forEach(el => {
    const host = el.closest('.top-pick-card') || el;
    host.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const pull = v => Math.max(-14, Math.min(14, v * .18));
      el.style.translate = `${pull(dx)}px ${pull(dy)}px`;
    });
    host.addEventListener('pointerleave', () => { el.style.translate = ''; });
    el.style.transition += ', translate .5s cubic-bezier(.23,1,.32,1)';
  });

  const cur = document.createElement('div');
  cur.className = 'cursor';
  cur.setAttribute('aria-hidden', 'true');
  cur.innerHTML = '<svg class="cursor-needle" viewBox="0 0 32 32"><polygon class="m-n" points="16,3 20,16 12,16"/><polygon class="m-s" points="16,29 20,16 12,16"/></svg>';
  const curNeedle = cur.firstChild;
  const heroEl = document.querySelector('.hero');
  let heading = 0, lastX = null, lastY = null;
  document.body.appendChild(cur);
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, moving = false;
  function loop() {
    const dx = tx - x, dy = ty - y;
    x += dx * .2; y += dy * .2;
    moving = Math.abs(dx) + Math.abs(dy) > .1;
    // Squash and stretch along the direction of travel, like a drop of ink
    const stretch = moving && !cur.classList.contains('is-map') && !cur.classList.contains('is-text') ? Math.min(Math.hypot(dx, dy) / 110, .45) : 0;
    cur.style.transform = stretch > .01
      ? `translate3d(${x}px,${y}px,0) rotate(${Math.atan2(dy, dx)}rad) scale(${1 + stretch},${1 - stretch * .55})`
      : `translate3d(${x}px,${y}px,0)`;
    if (moving) requestAnimationFrame(loop);
  }
  document.addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    cur.classList.add('is-on');
    const t = e.target;
    cur.classList.toggle('is-text', !!(t.closest && t.closest('input')));
    cur.classList.toggle('is-link', !!(t.closest && t.closest('a, button')) && !cur.classList.contains('is-text'));
    cur.classList.toggle('is-map', !!(heroEl && heroEl.contains(t)) && !cur.classList.contains('is-text') && !cur.classList.contains('is-link'));
    if (lastX !== null) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (dx * dx + dy * dy > 9) {
        const target = Math.atan2(dx, -dy) * 180 / Math.PI;
        heading += ((target - heading) % 360 + 540) % 360 - 180;
        curNeedle.style.transform = `rotate(${heading}deg)`;
      }
    }
    lastX = e.clientX; lastY = e.clientY;
    if (!moving) { moving = true; requestAnimationFrame(loop); }
  }, { passive: true });
  document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
})();

/* ——— COMPASS: back to top ——— */
(function () {
  const btn = document.getElementById('compassTop');
  if (!btn) return;
  const needle = btn.querySelector('.ct-needle');
  const ring = btn.querySelector('.ct-progress');
  const C = 2 * Math.PI * 24;
  let ticking = false;
  function update() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, scrollY / max) : 0;
    btn.classList.toggle('is-on', scrollY > innerHeight * .8);
    ring.style.strokeDashoffset = (C * (1 - p)).toFixed(2);
    needle.style.transform = `rotate(${(p * 360).toFixed(1)}deg)`;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
  btn.addEventListener('click', () => {
    if (window.lenis) window.lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    document.querySelector('.nav-logo').focus({ preventScroll: true });
  });
})();

/* ——— EVENTS ———
   Reads /api/events (served by the Cloudflare Worker in /worker). If the feed
   isn't reachable the whole section stays hidden, so the page never shows a
   broken block. */
(function () {
  const section = document.getElementById('events');
  if (!section) return;
  const list = document.getElementById('eventsList');
  const meta = document.getElementById('eventsMeta');
  const map = document.getElementById('eventsMap');
  const placeEl = document.getElementById('eventsMapPlace');
  const bearingEl = document.getElementById('eventsMapBearing');
  const TZ = 'Asia/Singapore';
  const HOUR = 36e5;
  let events = [];
  let range = 'week';

  const dayKey = d => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d);
  const fmtDay = d => new Intl.DateTimeFormat('en-SG', { timeZone: TZ, day: 'numeric' }).format(d);
  const fmtMon = d => new Intl.DateTimeFormat('en-SG', { timeZone: TZ, month: 'short' }).format(d);
  const fmtWd = d => new Intl.DateTimeFormat('en-SG', { timeZone: TZ, weekday: 'short' }).format(d);
  const fmtTime = d => new Intl.DateTimeFormat('en-SG', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true })
    .format(d).replace(':00', '').replace(/\s?(am|pm)/i, (m, p) => p.toLowerCase());
  const endOf = e => e.end ? new Date(e.end) : new Date(new Date(e.start).getTime() + (e.allDay ? 24 : 2) * HOUR);

  /* venue text → known venue */
  function findVenue(text) {
    if (!text || typeof NTU_VENUES === 'undefined') return null;
    const t = ` ${text.toLowerCase()} `;
    let best = null, bestLen = 0;
    NTU_VENUES.forEach(v => v.aliases.forEach(a => {
      const hit = a.length <= 3 ? new RegExp(`[^a-z]${a}[^a-z]`).test(t) : t.includes(a);
      if (hit && a.length > bestLen) { best = v; bestLen = a.length; }
    }));
    return best;
  }
  const PX_PER_M = 0.19;
  function project(v) {
    const dx = (v.lon - NTU_CENTRE.lon) * 111320 * Math.cos(NTU_CENTRE.lat * Math.PI / 180);
    const dy = (v.lat - NTU_CENTRE.lat) * 110574;
    return { x: dx * PX_PER_M, y: -dy * PX_PER_M, metres: Math.hypot(dx, dy), bearing: (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360 };
  }

  /* ——— map ——— */
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const venueNodes = {};
  let needle, heading = 0;
  function buildMap() {
    el('circle', { class: 'em-face', r: 178 }, map);
    [250, 500, 750].forEach(m => {
      el('circle', { class: 'em-ring', r: m * PX_PER_M }, map);
      el('text', { class: 'em-ring-label', x: 4, y: -m * PX_PER_M - 4 }, map).textContent = `${m} m`;
    });
    const ticks = el('g', { class: 'em-ticks' }, map);
    for (let d = 0; d < 360; d += 5) {
      const a = d * Math.PI / 180, r1 = d % 45 === 0 ? 164 : 170;
      el('line', {
        x1: (Math.sin(a) * r1).toFixed(1), y1: (-Math.cos(a) * r1).toFixed(1),
        x2: (Math.sin(a) * 176).toFixed(1), y2: (-Math.cos(a) * 176).toFixed(1),
        class: d === 0 ? 'is-north' : d % 45 === 0 ? 'is-major' : ''
      }, ticks);
    }
    el('text', { class: 'em-north', y: -186 }, map).textContent = 'N';
    (typeof NTU_VENUES === 'undefined' ? [] : NTU_VENUES).forEach(v => {
      const p = project(v);
      const g = el('g', { class: 'em-venue', transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})` }, map);
      el('circle', { class: 'em-ripple', r: 7 }, g);
      el('circle', { class: 'dot', r: 4.5 }, g);
      const label = el('text', { class: 'em-label', y: -12, 'text-anchor': p.x > 60 ? 'end' : p.x < -60 ? 'start' : 'middle' }, g);
      label.textContent = v.name;
      venueNodes[v.key] = g;
    });
    needle = el('g', { class: 'em-needle' }, map);
    el('polygon', { class: 'm-n', points: '0,-46 6,0 -6,0' }, needle);
    el('polygon', { class: 'm-s', points: '0,46 6,0 -6,0' }, needle);
    el('circle', { class: 'em-pin', r: 4 }, map);
  }
  function focusVenue(v, venueText) {
    Object.values(venueNodes).forEach(n => n.classList.remove('is-on'));
    if (!v) {
      placeEl.textContent = venueText ? venueText : 'Point at an event to find it';
      bearingEl.textContent = venueText ? 'Not on the map' : '';
      return;
    }
    venueNodes[v.key].classList.add('is-on');
    const p = project(v);
    heading += ((p.bearing - heading) % 360 + 540) % 360 - 180;
    needle.style.transform = `rotate(${heading.toFixed(1)}deg)`;
    placeEl.textContent = v.name;
    bearingEl.textContent = `${Math.round(p.metres / 10) * 10} m, ${String(Math.round(p.bearing)).padStart(3, '0')}°`;
  }

  /* ——— list ——— */
  function inRange(e, now) {
    const s = new Date(e.start), en = endOf(e);
    if (en < now) return false;
    if (range === 'now') return s <= now;
    if (range === 'today') return dayKey(s) <= dayKey(now) && dayKey(en) >= dayKey(now);
    if (range === 'week') return s < new Date(now.getTime() + 7 * 24 * HOUR);
    return true;
  }
  const EMPTY = {
    now: ['Nothing live right now', 'Check today or this week for what’s coming up.'],
    today: ['Nothing on today', 'This week has more.'],
    week: ['A quiet week so far', 'See all upcoming events.'],
    all: ['No upcoming events yet', 'New ones are added every couple of hours.'],
  };
  function render() {
    const now = new Date();
    const shown = events.filter(e => inRange(e, now)).sort((a, b) => new Date(a.start) - new Date(b.start));
    Object.values(venueNodes).forEach(n => n.classList.remove('has-event'));
    if (!shown.length) {
      const [t, d] = EMPTY[range];
      list.innerHTML = `<li class="events-empty"><strong>${t}</strong>${d}</li>`;
      focusVenue(null);
      return;
    }
    list.innerHTML = shown.map((e, i) => {
      const s = new Date(e.start), en = endOf(e);
      const live = s <= now && en >= now;
      const v = findVenue(e.venue);
      if (v) venueNodes[v.key].classList.add('has-event');
      const time = e.allDay ? 'All day' : `${fmtTime(s)}${e.end ? ` – ${fmtTime(en)}` : ''}`;
      const kicker = [live ? '<span class="event-live">Live now</span>' : '', e.category ? `<span>${escapeHtml(e.category)}</span>` : '', e.organiser ? `<span>${escapeHtml(e.organiser)}</span>` : ''].join('');
      return `<li class="event fill" style="--i:${i}" data-idx="${events.indexOf(e)}" data-venue="${v ? v.key : ''}">
        <div class="event-date"><span class="event-day">${fmtDay(s)}</span><span class="event-mon">${fmtMon(s)}</span><span class="event-wd">${fmtWd(s)}</span></div>
        <div class="event-body">
          <div class="event-kicker">${kicker}</div>
          <h3 class="event-title">${escapeHtml(e.title)}</h3>
          <p class="event-meta"><span>${time}</span>${e.venue ? `<span class="event-venue">${escapeHtml(e.venue)}</span>` : ''}</p>
          ${e.description ? `<p class="event-desc">${escapeHtml(e.description)}</p>` : ''}
        </div>
        <div class="event-actions">
          ${httpUrl(e.link) ? `<a class="event-btn is-primary fill" href="${escapeHtml(httpUrl(e.link))}" target="_blank" rel="noopener">Sign up</a>` : ''}
          <button type="button" class="event-btn fill" data-ics>Add to calendar</button>
          ${e.source && httpUrl(e.source.url) ? `<a class="event-src" href="${escapeHtml(httpUrl(e.source.url))}" target="_blank" rel="noopener">Source</a>` : ''}
        </div>
      </li>`;
    }).join('');
    const first = shown[0];
    focusVenue(findVenue(first.venue), first.venue);
  }

  list.addEventListener('pointerover', e => {
    const row = e.target.closest('.event');
    if (!row || row.dataset.idx === undefined) return;
    const ev = events[row.dataset.idx];
    focusVenue(findVenue(ev.venue), ev.venue);
  });
  list.addEventListener('focusin', e => {
    const row = e.target.closest('.event');
    if (row && row.dataset.idx !== undefined) { const ev = events[row.dataset.idx]; focusVenue(findVenue(ev.venue), ev.venue); }
  });

  /* ——— add to calendar ——— */
  const icsDate = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const icsText = t => String(t || '').replace(/\\/g, '\\\\').replace(/[,;]/g, m => '\\' + m).replace(/\r\n|\r|\n/g, '\\n').replace(/[\u0000-\u001f\u007f]/g, '');
  const httpUrl = link => {
    if (typeof link !== 'string' || /[\u0000-\u001f\u007f]/.test(link)) return '';
    try { const u = new URL(link); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch { return ''; }
  };
  list.addEventListener('click', e => {
    const btn = e.target.closest('[data-ics]');
    if (!btn) return;
    const ev = events[btn.closest('.event').dataset.idx];
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NTU Atlas//Events//EN', 'BEGIN:VEVENT',
      `UID:${icsText(ev.id) || icsDate(new Date(ev.start))}@ntuatlas.com`, `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(new Date(ev.start))}`, `DTEND:${icsDate(endOf(ev))}`,
      `SUMMARY:${icsText(ev.title)}`, ev.venue ? `LOCATION:${icsText(ev.venue)}, NTU Singapore` : '',
      ev.description ? `DESCRIPTION:${icsText(ev.description)}` : '', httpUrl(ev.link) ? `URL:${httpUrl(ev.link)}` : '',
      'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = `${ev.title.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'event'}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  section.querySelectorAll('.events-tab').forEach(tab => tab.addEventListener('click', () => {
    section.querySelectorAll('.events-tab').forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', t === tab); });
    range = tab.dataset.range;
    render();
  }));

  function ago(iso) {
    const m = Math.round((Date.now() - new Date(iso)) / 6e4);
    return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`;
  }
  function show(data) {
    events = (data.events || []).filter(e => e && e.title && e.start && !isNaN(new Date(e.start)));
    section.hidden = false;
    document.querySelector('.nav-events').hidden = false;
    if (!map.childNodes.length) buildMap();
    const upcoming = events.filter(e => endOf(e) >= new Date()).length;
    meta.textContent = `${upcoming} upcoming${data.updated ? `, updated ${ago(data.updated)}` : ''}`;
    // Default to the widest view that has something in it
    if (!events.some(e => inRange(e, new Date()))) {
      const all = section.querySelector('[data-range="all"]');
      if (all) all.click(); else render();
    } else render();
    if (typeof placeInk === 'function') placeInk();
  }
  list.innerHTML = '<li class="event is-skeleton"><div></div><div><span style="width:30%"></span><span style="width:70%"></span><span style="width:50%"></span></div></li>';
  window.__showEvents = show;
  fetch('/api/events', { headers: { accept: 'application/json' } })
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(show)
    .catch(() => { section.hidden = true; });
})();

/* ——— LIQUID MOTION ——— */

/* Smooth, weighted scrolling. Native scroll stays underneath, so sticky
   sections, anchors and scroll listeners all keep working. */
(function () {
  if (reduceMotion || !window.Lenis) return;
  const lenis = new Lenis({ lerp: .09, wheelMultiplier: 1 });
  window.lenis = lenis;
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id === '#' ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: target === 0 ? 0 : -80, duration: 1.4 });
    if (id !== '#') history.replaceState(null, '', id);
  });
})();

/* Retire the intro curtain once it has lifted */
(function () {
  const intro = document.querySelector('.intro');
  if (!intro) return;
  if (!document.documentElement.classList.contains('has-intro')) { intro.remove(); return; }
  intro.addEventListener('animationend', e => { if (e.animationName === 'introLift') intro.remove(); });
  // never let the curtain linger, e.g. if animations are paused in a background tab
  setTimeout(() => intro.remove(), 2400);
})();

/* Rolling letters on nav and footer links */
document.querySelectorAll('.nav-links a, .footer-legal-link').forEach(el => {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.innerHTML = `<span class="roll" aria-hidden="true">${[...text].map((ch, i) => `<span style="--i:${i}">${escapeHtml(ch)}</span>`).join('')}</span>`;
});

/* Liquid fills pour in from the pointer's entry point and drain toward its exit */
(function () {
  if (!finePointer) return;
  const setOrigin = (el, e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--fx', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
    el.style.setProperty('--fy', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
  };
  document.addEventListener('pointerover', e => {
    const el = e.target.closest && e.target.closest('.fill');
    if (el && !el.contains(e.relatedTarget)) setOrigin(el, e);
  });
  document.addEventListener('pointerout', e => {
    const el = e.target.closest && e.target.closest('.fill');
    if (el && !el.contains(e.relatedTarget)) setOrigin(el, e);
  });
})();

/* One loop reads scroll velocity and lets a few things respond to it:
   section headings lean, the hero contours stir, and the footer's edge sloshes. */
(function () {
  if (reduceMotion) return;
  const heads = Array.from(document.querySelectorAll('.section-header'));
  const footer = document.querySelector('footer');
  const wave = footer && footer.querySelector('.footer-wave path');
  let lastY = scrollY, vel = 0, skew = 0;
  let bulge = 0, bulgeV = 0, footerOn = false;
  if (footer) new IntersectionObserver(([e]) => { footerOn = e.isIntersecting; }, { rootMargin: '200px 0px' }).observe(footer);
  window.__flow = 0;
  function frame(t) {
    const dy = scrollY - lastY; lastY = scrollY;
    vel += (dy - vel) * .2;
    window.__flow += Math.abs(dy) * .0005;

    const target = Math.max(-5, Math.min(5, vel * .18));
    if (Math.abs(target - skew) > .01 || Math.abs(skew) > .01) {
      skew += (target - skew) * .15;
      const v = Math.abs(skew) < .01 ? '' : `skewY(${skew.toFixed(2)}deg)`;
      heads.forEach(h => { h.style.transform = v; });
    }

    if (wave && footerOn) {
      // a damped spring chases the scroll speed; a slow swell keeps the surface alive
      bulgeV += (Math.max(-60, Math.min(60, vel * 2.2)) - bulge) * .08;
      bulgeV *= .84;
      bulge += bulgeV;
      const swell = Math.sin(t / 900) * 8;
      const mid = 60;
      wave.setAttribute('d', `M0,${mid} C360,${(mid - bulge - swell).toFixed(1)} 1080,${(mid - bulge + swell).toFixed(1)} 1440,${mid} L1440,121 L0,121 Z`);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
