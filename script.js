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
  if (window.setHeading) setHeading(results[0].cat);
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
  legalModalTitle.focus();
}

function closeModal() {
  legalModal.setAttribute('hidden', '');
  legalModal.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('body > *:not(#legalModal)').forEach(el => el.removeAttribute('inert'));
  document.body.style.overflow = '';
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
const tabLists = document.querySelectorAll('.cat-tabs, .club-tabs');
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

/* ——— COMPASS DIAL ——— */
const DIAL_CATS = Object.keys(CAT_PANEL_MAP);
const dialEl = document.querySelector('.dial');
let heading = 0;
function setHeading(cat) {
  const idx = DIAL_CATS.indexOf(cat);
  if (!dialEl || idx === -1) return;
  const target = idx * 36;
  const delta = ((target - heading) % 360 + 540) % 360 - 180;
  heading += delta;
  dialEl.querySelector('.dial-needle').style.transform = `rotate(${heading}deg)`;
  dialEl.querySelectorAll('.dial-label').forEach((l, i) => l.classList.toggle('is-on', i === idx));
  dialEl.querySelectorAll('.dial-marks circle').forEach((c, i) => c.classList.toggle('is-on', i === idx));
  dialEl.querySelector('.dial-readout-deg').textContent = String(target).padStart(3, '0') + '°';
  dialEl.querySelector('.dial-readout-name').textContent = cat;
}
window.setHeading = setHeading;

if (dialEl) {
  const NS = 'http://www.w3.org/2000/svg';
  const ticks = dialEl.querySelector('.dial-ticks');
  for (let d = 0; d < 360; d += 5) {
    const major = d % 30 === 0, mid = d % 10 === 0;
    const r1 = 148 - (major ? 16 : mid ? 11 : 6);
    const a = d * Math.PI / 180;
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', (Math.sin(a) * r1).toFixed(2));
    line.setAttribute('y1', (-Math.cos(a) * r1).toFixed(2));
    line.setAttribute('x2', (Math.sin(a) * 144).toFixed(2));
    line.setAttribute('y2', (-Math.cos(a) * 144).toFixed(2));
    line.setAttribute('class', d === 0 ? 'is-north' : major ? 'is-major' : mid ? 'is-mid' : '');
    ticks.appendChild(line);
  }
  const marks = dialEl.querySelector('.dial-marks');
  const labels = dialEl.querySelector('.dial-labels');
  DIAL_CATS.forEach((cat, i) => {
    const a = i * 36 * Math.PI / 180;
    const x = Math.sin(a), y = -Math.cos(a);
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', (x * 157).toFixed(2));
    c.setAttribute('cy', (y * 157).toFixed(2));
    c.setAttribute('r', '3');
    marks.appendChild(c);
    const b = document.createElement('button');
    b.type = 'button';
    b.tabIndex = -1;
    b.className = 'dial-label';
    b.style.cssText = `--x:${x.toFixed(3)};--y:${y.toFixed(3)};--n:${i};` +
      `--tx:${x > .2 ? '0%' : x < -.2 ? '-100%' : '-50%'};--ty:${Math.abs(x) <= .2 ? (y < 0 ? '-100%' : '0%') : '-50%'}`;
    b.innerHTML = `<span class="dial-label-deg">${String(i * 36).padStart(3, '0')}°</span><span>${escapeHtml(cat)}</span>`;
    b.addEventListener('mouseenter', () => setHeading(cat));
    b.addEventListener('click', () => {
      document.getElementById('tab-' + CAT_PANEL_MAP[cat].replace('panel-', '')).click();
      document.getElementById('portals').scrollIntoView();
    });
    labels.appendChild(b);
  });
  const needle = dialEl.querySelector('.dial-needle');
  needle.style.transition = 'none';
  needle.style.transform = 'rotate(-140deg)';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    needle.style.transition = '';
    needle.style.transform = 'rotate(0deg)';
  }));
}

/* ——— "/" FOCUSES SEARCH ——— */
document.addEventListener('keydown', e => {
  if (e.key !== '/' || e.metaKey || e.ctrlKey) return;
  const t = e.target;
  if (t.matches('input, textarea, [contenteditable]')) return;
  e.preventDefault();
  searchInput.focus();
});
