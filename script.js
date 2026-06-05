/* ——— SEARCH FUNCTION ——— */
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const intentMap = {
  'grades': ['Transcript', 'Degree Audit', 'S/U Option'],
  'grade': ['Transcript', 'Degree Audit', 'S/U Option'],
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
  'email': ['NTU Email'],
  'office': ['Microsoft 365'],
  'it': ['IT Service Desk'],
  'graduation': ['Graduation'],
  'international': ['Global Relations Office'],
  'osa': ['Office of Student Affairs'],
  'ssc': ['Student Service Centre'],
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
        results.push({ name: escapeHtml(club.name), cat: 'Club', url: club.instagram ? `https://instagram.com/${escapeHtml(club.instagram)}` : '#' });
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
  searchResults.innerHTML = results.map(r => `
    <a class="search-result-item" href="${r.url}" target="_blank" rel="noopener">
      <span class="search-result-name">${r.name}</span>
      <span class="search-result-cat">${r.cat}</span>
    </a>
  `).join('');
  searchResults.classList.add('active');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    searchResults.querySelectorAll('.search-result-item').forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(6px)';
      item.style.transition = `opacity 0.2s ease ${i * 30}ms, transform 0.2s ease ${i * 30}ms`;
      requestAnimationFrame(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
    });
  }
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

/* ——— THEME PERSISTENCE ——— */
(function() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    const iconSunEl = document.getElementById('iconSun');
    const iconMoonEl = document.getElementById('iconMoon');
    if (iconSunEl && iconMoonEl) {
      iconSunEl.style.display = saved === 'dark' ? 'none' : 'block';
      iconMoonEl.style.display = saved === 'dark' ? 'block' : 'none';
    }
  }
})();

/* ——— THEME TOGGLE ——— */
const toggle = document.getElementById('themeToggle');
const iconSun = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');

toggle.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  iconSun.style.display = isDark ? 'none' : 'block';
  iconMoon.style.display = isDark ? 'block' : 'none';
  toggle.setAttribute('aria-label', isDark ? 'Switch to dark mode' : 'Switch to light mode');
});

/* ——— NAV SCROLL STATE ——— */
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

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
const ACADEMICS_GROUP_ORDER = ['Core academic', 'Results', 'Registration', 'Resources', 'MOOCs'];

function renderPortals() {
  for (const [cat, panelId] of Object.entries(CAT_PANEL_MAP)) {
    const grid = document.querySelector(`#${panelId} .links-grid`);
    if (!grid) continue;
    const catLinks = allLinks.filter(l => l.cat === cat);
    const groups = cat === 'Academics' ? ACADEMICS_GROUP_ORDER : [null];
    let html = '';
    for (const group of groups) {
      const groupLinks = catLinks.filter(l => l.group === group);
      if (!groupLinks.length) continue;
      if (group !== null) html += `<div class="links-subgroup-label" aria-hidden="true">${escapeHtml(group)}</div>`;
      for (const link of groupLinks) {
        const name = escapeHtml(link.name);
        const tag = escapeHtml(link.tag);
        const desc = escapeHtml(link.desc);
        const url = escapeHtml(link.url);
        html += `<a class="link-card" href="${url}" target="_blank" rel="noopener" aria-label="${name}"><span class="link-card-tag">${tag}</span><span class="link-card-name">${name}</span><span class="link-card-desc">${desc}</span><div class="link-card-footer"><span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span></div></a>`;
      }
    }
    grid.innerHTML = html;
  }
}

renderPortals();

/* ——— CLUBS & SOCIETIES ——— */
const clubsGrid = document.getElementById('clubsGrid');
const clubsCount = document.getElementById('clubsCount');

// Escapes text before inserting into innerHTML to prevent XSS.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const instagramSVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`;
function renderClubs(filter) {
  const filtered = filter === 'All' ? allClubs : allClubs.filter(c => c.type === filter);
  const count = filtered.length;
  clubsCount.textContent = `${count} ${count === 1 ? 'club' : 'clubs'}`;
  clubsCount.setAttribute('aria-label', `${count} ${count === 1 ? 'club' : 'clubs'}`);

  clubsGrid.innerHTML = filtered.map(club => {
    const name = escapeHtml(club.name);
    const type = escapeHtml(club.type);
    const desc = escapeHtml(club.desc);
    const handle = club.instagram ? escapeHtml(club.instagram) : null;

    const igLink = handle
      ? `<a class="club-social-link" href="https://instagram.com/${handle}" target="_blank" rel="noopener" aria-label="${name} on Instagram">${instagramSVG}@${handle}</a>`
      : '';
    return `
      <div class="club-card" role="listitem">
        <span class="club-card-tag">${type}</span>
        <span class="club-card-name">${name}</span>
        <span class="club-card-desc">${desc}</span>
        <div class="club-card-links">${igLink}</div>
      </div>`;
  }).join('');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clubsGrid.classList.remove('fade-in');
    void clubsGrid.offsetWidth;
    clubsGrid.classList.add('fade-in');
  }
}

document.querySelectorAll('.club-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.club-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    renderClubs(tab.dataset.filter);
  });
  tab.addEventListener('keydown', e => {
    const tabs = Array.from(document.querySelectorAll('.club-tab'));
    const idx = tabs.indexOf(e.target);
    if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx + 1) % tabs.length].focus(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].focus(); }
  });
});

renderClubs('All');

/* ——— SCROLL REVEAL ——— */
const revealElements = document.querySelectorAll('.top-pick-card, .link-card, .fresh-item, .tool-item, .club-card, h2.section-title');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

const prefersReducedMotionReveal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
revealElements.forEach((el, i) => {
  if (prefersReducedMotionReveal) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = `opacity 0.5s ease ${(i % 8) * 0.06}s, transform 0.5s ease ${(i % 8) * 0.06}s, background 0.2s ease`;
  io.observe(el);
});

/* ——— LEGAL MODAL ——— */
const legalModal = document.getElementById('legalModal');
const legalModalTitle = document.getElementById('legalModalTitle');
const legalModalBody = document.getElementById('legalModalBody');
let modalTrigger = null;

const legalContent = {
  about: {
    title: 'About NTU Atlas',
    body: `<p>NTU Atlas is a student-built directory of NTU's digital ecosystem — portals, campus services, clubs and societies — all in one place.</p>
<p>Built and maintained by NTU students. Not affiliated with or endorsed by Nanyang Technological University.</p>
<p>Want to suggest a link, report a broken one, or contribute? <a class="modal-link" href="https://t.me/ntulinksss" target="_blank" rel="noopener">Join the community on Telegram →</a></p>`
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

