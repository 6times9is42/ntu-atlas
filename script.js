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
};

function searchLinks(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  let results = [];
  // Intent match first
  for (const [key, names] of Object.entries(intentMap)) {
    if (q.includes(key)) {
      names.forEach(n => {
        const link = allLinks.find(l => l.name === n);
        if (link && !results.find(r => r.name === link.name)) results.push(link);
      });
    }
  }
  // Fuzzy name/desc match
  allLinks.forEach(link => {
    if (!results.find(r => r.name === link.name)) {
      if (link.name.toLowerCase().includes(q) || link.desc.toLowerCase().includes(q) || link.cat.toLowerCase().includes(q)) {
        results.push(link);
      }
    }
  });
  return results.slice(0, 6);
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

/* ——— SCROLL REVEAL ——— */
const revealElements = document.querySelectorAll('.top-pick-card, .link-card, .fresh-item, .tool-item');
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
