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
  searchResults.innerHTML = results.map(r => `
    <a class="search-result-item" href="${r.url}" target="_blank" rel="noopener">
      <span class="search-result-name">${r.name}</span>
      <span class="search-result-cat">${r.cat}</span>
    </a>
  `).join('');
  searchResults.classList.add('active');
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
const iconSun = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');

toggle.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  iconSun.style.display = isDark ? 'none' : 'block';
  iconMoon.style.display = isDark ? 'block' : 'none';
  toggle.setAttribute('aria-label', isDark ? 'Switch to dark mode' : 'Switch to light mode');
});

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
const telegramSVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;

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
    const tgUrl = club.telegram ? escapeHtml(club.telegram) : null;

    const igLink = handle
      ? `<a class="club-social-link" href="https://instagram.com/${handle}" target="_blank" rel="noopener" aria-label="${name} on Instagram">${instagramSVG}@${handle}</a>`
      : '';
    const tgLink = tgUrl
      ? `<a class="club-social-link" href="${tgUrl}" target="_blank" rel="noopener" aria-label="${name} on Telegram">${telegramSVG}Telegram</a>`
      : '';
    return `
      <div class="club-card" role="listitem">
        <span class="club-card-tag">${type}</span>
        <span class="club-card-name">${name}</span>
        <span class="club-card-desc">${desc}</span>
        <div class="club-card-links">${igLink}${tgLink}</div>
      </div>`;
  }).join('');
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
const revealElements = document.querySelectorAll('.top-pick-card, .link-card, .fresh-item, .tool-item, .club-card');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = `opacity 0.5s ease ${(i % 8) * 0.06}s, transform 0.5s ease ${(i % 8) * 0.06}s, background 0.2s ease`;
  io.observe(el);
});

