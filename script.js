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

/* ——— CONSTELLATION CANVAS ——— */
const canvas = document.getElementById('constellationCanvas');
const ctx = canvas.getContext('2d');

const NODES = [
  { label: 'NTULearn', x: 0.15, y: 0.3 },
  { label: 'STARS', x: 0.28, y: 0.55 },
  { label: 'Degree Audit', x: 0.44, y: 0.25 },
  { label: 'CareerAxis', x: 0.62, y: 0.45 },
  { label: 'Exchange', x: 0.78, y: 0.2 },
  { label: 'Library', x: 0.55, y: 0.72 },
  { label: 'Hall Portal', x: 0.36, y: 0.75 },
  { label: 'Financial Aid', x: 0.72, y: 0.68 },
  { label: 'Exam Timetable', x: 0.2, y: 0.68 },
  { label: 'Facilities', x: 0.88, y: 0.5 },
];

const EDGES = [
  [0,1],[0,2],[1,2],[2,3],[2,4],[3,4],[3,5],[3,7],[1,6],[5,6],[5,7],[7,9],[4,9],[6,8],[1,8]
];

let W, H;
let particles = [];
let mouseX = -1, mouseY = -1;
let animId;

function resize() {
  W = canvas.parentElement.clientWidth;
  H = canvas.parentElement.clientHeight;
  canvas.width = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(devicePixelRatio, devicePixelRatio);
}

function nodePos(n) {
  return { x: n.x * W, y: n.y * H };
}

function getThemeColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--ntu-red').trim() || '#c1272d';
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '193,39,45';
}

function drawFrame(t) {
  ctx.clearRect(0, 0, W, H);
  const red = getThemeColor();
  const rgb = hexToRgb(red);
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const textCol = isDark ? 'rgba(240,237,232,0.5)' : 'rgba(26,23,20,0.5)';
  const edgeCol = isDark ? 'rgba(240,237,232,0.06)' : 'rgba(26,23,20,0.08)';

  // Draw edges
  EDGES.forEach(([a,b]) => {
    const pa = nodePos(NODES[a]);
    const pb = nodePos(NODES[b]);
    ctx.beginPath();
    ctx.strokeStyle = edgeCol;
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 8]);
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  // Draw nodes
  NODES.forEach((n, i) => {
    const p = nodePos(n);
    const hover = Math.sqrt((p.x - mouseX)**2 + (p.y - mouseY)**2) < 40;
    const pulse = 1 + Math.sin(t * 0.002 + i * 0.8) * 0.12;
    const r = hover ? 8 : 4.5 * pulse;

    // Glow ring
    if (hover) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rgb},0.25)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Node fill
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = hover ? `rgba(${rgb},0.9)` : `rgba(${rgb},0.55)`;
    ctx.fill();

    // Node ring
    ctx.beginPath();
    ctx.arc(p.x, p.y, r + 2, 0, Math.PI * 2);
    ctx.strokeStyle = hover ? `rgba(${rgb},0.6)` : `rgba(${rgb},0.2)`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Label
    ctx.font = `400 11px 'DM Mono', monospace`;
    ctx.fillStyle = hover ? `rgba(${rgb},1)` : textCol;
    ctx.textAlign = p.x > W * 0.7 ? 'right' : 'left';
    const labelX = p.x > W * 0.7 ? p.x - 14 : p.x + 14;
    ctx.fillText(n.label, labelX, p.y + 4);
  });

  // Floating particles
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * (p.life / p.maxLife), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb},${p.life / p.maxLife * 0.6})`;
    ctx.fill();
  });

  animId = requestAnimationFrame(t2 => drawFrame(t2));
}

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  // Spawn particles
  if (Math.random() < 0.3) {
    particles.push({
      x: mouseX + (Math.random()-0.5)*20,
      y: mouseY + (Math.random()-0.5)*20,
      vx: (Math.random()-0.5)*0.8,
      vy: (Math.random()-0.5)*0.8,
      r: Math.random()*2+0.5,
      life: 40, maxLife: 40
    });
  }
});
canvas.addEventListener('mouseleave', () => { mouseX = -1; mouseY = -1; });

resize();
window.addEventListener('resize', () => { cancelAnimationFrame(animId); resize(); drawFrame(0); });
drawFrame(0);

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
