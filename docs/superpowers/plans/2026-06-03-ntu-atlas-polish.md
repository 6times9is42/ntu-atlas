# NTU Atlas Polish & Legitimacy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the NTU Atlas UI (remove clutter), add accessible legal modal pages, and layer in fluid CSS animations with full `prefers-reduced-motion` support.

**Architecture:** All changes are to the three existing vanilla files (`index.html`, `style.css`, `script.js`). No new files except the plan itself. Animations are pure CSS `@keyframes` where possible; JS handles only nav scroll class, search stagger, and the legal modal. All interactive additions respect ARIA patterns already established in the codebase.

**Tech Stack:** Vanilla HTML, CSS custom properties, vanilla JS (ES6). Static site served by Python `http.server` at `http://localhost:8080`.

---

## File Map

| File | Changes in this plan |
|------|---------------------|
| `index.html` | Remove 4 UI elements; add modal overlay; add footer legal links; add `.bg-glow` div |
| `style.css` | Remove 8 CSS rule blocks; add modal, glow, and animation styles; add `prefers-reduced-motion` overrides |
| `script.js` | Add modal logic + content; add nav scroll listener; update search to stagger results; extend scroll-reveal to section titles |

---

## Task 1: UI Cleanup

**Files:**
- Modify: `index.html`
- Modify: `style.css`

- [ ] **Step 1: Remove hero stats block from `index.html`**

Find and delete this entire block (lines 65–79):
```html
    <div class="hero-stats" aria-label="Site statistics">
      <div class="hero-stat">
        <span class="hero-stat-num">41</span>
        <span class="hero-stat-label">Links</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-num">10</span>
        <span class="hero-stat-label">Categories</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-num">1</span>
        <span class="hero-stat-label">University</span>
      </div>
    </div>
```

- [ ] **Step 2: Remove "Student Portal" span from `index.html`**

Find and delete this exact line:
```html
    <span class="nav-logo-sub">Student Portal</span>
```

- [ ] **Step 3: Remove Community nav button from `index.html`**

Find and delete this exact line:
```html
    <a href="https://t.me/ntulinksss" target="_blank" rel="noopener" class="nav-pill" aria-label="Join the NTU community on Telegram">Community</a>
```

- [ ] **Step 4: Remove all `.link-card-ext` spans from `index.html`**

Every portal card has one identical span. Remove all of them with this Python one-liner run from the project root:

```bash
cd /Users/yashvardhan21/Documents/Projects/ntu-atlas
python3 -c "
import re, sys
with open('index.html', 'r') as f: c = f.read()
c = re.sub(r'\s*<span class=\"link-card-ext\">.*?</span>', '', c)
with open('index.html', 'w') as f: f.write(c)
"
```

Verify: `grep -c "link-card-ext" index.html` — must return `0`.

- [ ] **Step 5: Remove hero stats CSS from `style.css`**

Delete these four rule blocks (lines ~230–252):
```css
.hero-stats {
  display: flex;
  gap: 32px;
  flex-shrink: 0;
}
.hero-stat {
  text-align: right;
}
.hero-stat-num {
  font-family: 'Instrument Serif', serif;
  font-size: 32px;
  color: var(--text-primary);
  display: block;
  line-height: 1;
}
.hero-stat-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-top: 4px;
  display: block;
}
```

- [ ] **Step 6: Simplify `.hero-sub-row` CSS in `style.css`**

The sub-row now only has one child (`.hero-desc`). Remove `justify-content: space-between` and `flex-wrap: wrap`. Change its definition to:

Find:
```css
.hero-sub-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}
```
Replace with:
```css
.hero-sub-row {
  display: block;
}
```

And update `.hero-desc` to allow more width — find:
```css
.hero-desc {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 440px;
}
```
Replace with:
```css
.hero-desc {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 560px;
}
```

- [ ] **Step 7: Remove nav-pill CSS from `style.css`**

Delete these two rule blocks (lines ~127–144):
```css
.nav-pill {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 20px;
  transition: all 0.2s ease;
}
.nav-pill:hover {
  color: var(--text-primary);
  border-color: var(--border-hover);
  background: var(--bg-hover);
}
```

- [ ] **Step 8: Remove nav-logo-sub CSS from `style.css`**

Delete:
```css
.nav-logo-sub {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 300;
  color: var(--text-tertiary);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

- [ ] **Step 9: Remove link-card-ext CSS from `style.css`**

Delete these three rule blocks (lines ~605–618):
```css
.link-card-ext {
  width: 24px; height: 24px;
  border: 1px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.link-card:hover .link-card-ext {
  border-color: var(--ntu-red);
  background: var(--ntu-red-dim);
}
.link-card-ext svg { width: 10px; height: 10px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
```

- [ ] **Step 10: Fix link-card-footer CSS in `style.css`**

Find:
```css
.link-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}
```
Replace with:
```css
.link-card-footer {
  display: flex;
  align-items: center;
  margin-top: 4px;
}
```

- [ ] **Step 11: Remove hero-stats media query rules from `style.css`**

In the `@media (max-width: 900px)` block, delete:
```css
  .hero-stats { gap: 20px; }
```

In the `@media (max-width: 600px)` block, delete:
```css
  .hero-stats { display: none; }
```

- [ ] **Step 12: Verify in browser**

Hard-refresh `http://localhost:8080`. Check:
- Hero shows label + title + description + scroll hint only (no stat numbers)
- Nav shows "NTU Atlas" only (no "Student Portal" subtitle) and theme toggle only (no Community button)
- Portal cards show "Go →" without the small circular external-link icon
- No JS errors in DevTools console
- `grep -c "link-card-ext\|hero-stat\|nav-pill\|nav-logo-sub" style.css` returns `0`

- [ ] **Step 13: Commit**

```bash
cd /Users/yashvardhan21/Documents/Projects/ntu-atlas
git add index.html style.css
git commit -m "refactor: remove hero stats, nav subtitle, community button, card ext icon"
```

---

## Task 2: Legal Modal System

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `script.js`

- [ ] **Step 1: Add modal overlay HTML to `index.html`**

Find `<script src="data.js"></script>` near the bottom of `index.html`. Insert the following block immediately before it:

```html
<!-- Legal Modal -->
<div id="legalModal" role="dialog" aria-modal="true" aria-labelledby="legalModalTitle" hidden aria-hidden="true">
  <div class="modal-panel">
    <button class="modal-close" id="legalModalClose" aria-label="Close">&times;</button>
    <h2 class="modal-title" id="legalModalTitle"></h2>
    <div class="modal-body" id="legalModalBody"></div>
  </div>
</div>

```

- [ ] **Step 2: Add footer legal links to `index.html`**

Find the footer's `<div class="footer-right">` block. It currently ends with `</div>` after the `footer-ntu-badge` div. Insert the `footer-legal` div as the last child of `footer-right`, before its closing `</div>`:

```html
    <div class="footer-legal">
      <button class="footer-legal-link" data-modal="about">About</button>
      <span aria-hidden="true">·</span>
      <button class="footer-legal-link" data-modal="disclaimer">Disclaimer</button>
      <span aria-hidden="true">·</span>
      <button class="footer-legal-link" data-modal="privacy">Privacy Policy</button>
    </div>
```

The full `footer-right` div should look like:
```html
  <div class="footer-right">
    <div class="footer-credit">
      Not affiliated with Nanyang Technological University.<br>
      Maintained by the student community.
    </div>
    <div class="footer-ntu-badge">
      <div class="footer-ntu-dot" aria-hidden="true"></div>
      Singapore · NTU Campus
    </div>
    <div class="footer-legal">
      <button class="footer-legal-link" data-modal="about">About</button>
      <span aria-hidden="true">·</span>
      <button class="footer-legal-link" data-modal="disclaimer">Disclaimer</button>
      <span aria-hidden="true">·</span>
      <button class="footer-legal-link" data-modal="privacy">Privacy Policy</button>
    </div>
  </div>
```

- [ ] **Step 3: Add modal and footer-legal CSS to `style.css`**

Find the `/* ——— CLUBS & SOCIETIES ——— */` comment in `style.css`. Insert the following block immediately before it:

```css
/* ——— LEGAL MODAL ——— */
#legalModal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
#legalModal[hidden] { display: none; }

.modal-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 48px;
  max-width: 640px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.modal-close:hover {
  color: var(--text-primary);
  border-color: var(--border-hover);
}

.modal-title {
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-body p {
  font-size: 14px;
  font-weight: 300;
  color: var(--text-secondary);
  line-height: 1.7;
}
.modal-body code {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  background: var(--bg-card);
  padding: 2px 6px;
  border-radius: 3px;
  color: var(--text-secondary);
}
.modal-link {
  color: var(--ntu-red);
  text-decoration: none;
}
.modal-link:hover { text-decoration: underline; }

.footer-legal {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  justify-content: flex-end;
}
.footer-legal-link {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  padding: 0;
  transition: color 0.2s;
}
.footer-legal-link:hover { color: var(--text-secondary); }
.footer-legal > span { color: var(--text-tertiary); font-size: 10px; }

```

- [ ] **Step 4: Add modal JS to `script.js`**

Append the following block to the **end** of `script.js`:

```js
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
  const focusable = getFocusable(legalModal);
  if (focusable.length) focusable[0].focus();
}

function closeModal() {
  legalModal.setAttribute('hidden', '');
  legalModal.setAttribute('aria-hidden', 'true');
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
```

- [ ] **Step 5: Verify modal behaviour**

Hard-refresh `http://localhost:8080`. Test:
1. Click "About" in footer — modal opens, title reads "About NTU Atlas", Telegram link visible
2. Click "Disclaimer" — content changes correctly
3. Click "Privacy Policy" — content mentions `localStorage`
4. Press Escape — modal closes, focus returns to the button that opened it
5. Click outside the modal panel (on the dark overlay) — closes
6. Tab through modal — focus stays trapped inside (cycles between close button and any links)
7. Open modal, then toggle theme — modal respects CSS variables (dark/light)
8. No console errors

- [ ] **Step 6: Commit**

```bash
cd /Users/yashvardhan21/Documents/Projects/ntu-atlas
git add index.html style.css script.js
git commit -m "feat: add legal modal system (About, Disclaimer, Privacy Policy)"
```

---

## Task 3: Background Radial Glow

**Files:**
- Modify: `index.html`
- Modify: `style.css`

- [ ] **Step 1: Add `.bg-glow` div to `index.html`**

Find the existing `<!-- Grid background -->` div (line 14). Insert the glow div immediately after it:

```html
<!-- Grid background -->
<div class="grid-bg" aria-hidden="true"></div>

<!-- Radial glow background -->
<div class="bg-glow" aria-hidden="true"></div>
```

- [ ] **Step 2: Add radial glow CSS to `style.css`**

Find the `/* ——— GRID BACKGROUND ——— */` comment block. Insert the following block immediately after the `.grid-bg` rule closes (after `}`) and before the `/* ——— TOPOGRAPHIC LINES ——— */` comment:

```css
/* ——— RADIAL GLOW ——— */
.bg-glow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.bg-glow::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  top: -100px;
  left: -100px;
  background: radial-gradient(circle, var(--ntu-red), transparent 70%);
  opacity: 0.08;
  border-radius: 50%;
  animation: glowDrift1 18s ease-in-out infinite alternate;
}

.bg-glow::after {
  content: '';
  position: absolute;
  width: 800px;
  height: 800px;
  bottom: -200px;
  right: -100px;
  background: radial-gradient(circle, #6080a0, transparent 70%);
  opacity: 0.05;
  border-radius: 50%;
  animation: glowDrift2 22s ease-in-out infinite alternate;
}

@keyframes glowDrift1 {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(60px, 40px) scale(1.1); }
}

@keyframes glowDrift2 {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-50px, -60px) scale(1.15); }
}

[data-theme="light"] .bg-glow::before { opacity: 0.04; }
[data-theme="light"] .bg-glow::after  { opacity: 0.025; }

@media (prefers-reduced-motion: reduce) {
  .bg-glow::before, .bg-glow::after { animation-play-state: paused; }
}

```

- [ ] **Step 3: Verify glow renders**

Hard-refresh `http://localhost:8080`. In dark mode:
- A subtle warm red glow is faintly visible in the upper-left of the viewport
- A cool blue-grey glow is faintly visible in the lower-right
- Both drift slowly (if prefers-reduced-motion is not set)
- Switch to light mode — glows are even more subtle
- Glow divs do not intercept any mouse events (hover/click on cards still works)

- [ ] **Step 4: Commit**

```bash
cd /Users/yashvardhan21/Documents/Projects/ntu-atlas
git add index.html style.css
git commit -m "feat: add radial glow background animation"
```

---

## Task 4: Element Animations

**Files:**
- Modify: `style.css`
- Modify: `script.js`

- [ ] **Step 1: Add `--bg-primary-rgb` custom properties to `style.css`**

In `:root`, add after `--bg-primary: #0d0d0d;`:
```css
  --bg-primary-rgb: 13, 13, 13;
```

In `[data-theme="light"]`, add after `--bg-primary: #f7f4ef;`:
```css
  --bg-primary-rgb: 247, 244, 239;
```

- [ ] **Step 2: Add card hover lift to `style.css`**

Find `.link-card` base rule. It currently has `transition: background 0.2s`. Replace that with:
```css
  transition: background 0.2s, transform 0.2s ease, box-shadow 0.2s ease;
```

Find `.link-card:hover` rule (currently just sets `background: var(--bg-hover)`). Add:
```css
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
```

Find `.club-card` base rule. It currently has `transition: background 0.2s`. Replace with:
```css
  transition: background 0.2s, transform 0.2s ease, box-shadow 0.2s ease;
```

Find `.club-card:hover` rule. Add:
```css
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
```

- [ ] **Step 3: Add hero em shimmer to `style.css`**

Find the `/* ——— PAGE LOAD ANIMATION ——— */` section. After the existing `@keyframes fadeUp` block and the three hero animation rules, append:

```css
@keyframes accentShimmer {
  0%, 100% { color: var(--ntu-red); }
  50% { color: #e84040; }
}
.hero-title em {
  animation: accentShimmer 4s ease-in-out infinite;
}
```

- [ ] **Step 4: Add tab panel crossfade to `style.css`**

Find `.cat-panel.active { display: block; }`. Replace it with:
```css
.cat-panel.active {
  display: block;
  animation: panelFadeIn 0.15s ease;
}
@keyframes panelFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

Add CSS for clubs grid fade (triggered by JS adding a class after re-render):
```css
#clubsGrid.fade-in { animation: panelFadeIn 0.15s ease; }
```

- [ ] **Step 5: Add nav scroll state CSS to `style.css`**

After the existing `nav { ... }` rule block, add:
```css
nav.scrolled {
  background: rgba(var(--bg-primary-rgb), 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
```

- [ ] **Step 6: Add `prefers-reduced-motion` overrides to `style.css`**

Find the end of the existing `@media (max-width: 600px)` block. After the `.sr-only` rule, add:

```css
@media (prefers-reduced-motion: reduce) {
  .link-card:hover, .club-card:hover {
    transform: none;
    box-shadow: none;
  }
  .hero-title em { animation: none; color: var(--ntu-red); }
  .cat-panel.active, #clubsGrid.fade-in { animation: none; }
  nav.scrolled {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: var(--bg-primary);
  }
}
```

- [ ] **Step 7: Add nav scroll listener to `script.js`**

Find the `/* ——— THEME TOGGLE ——— */` section. Immediately after the closing `});` of the theme toggle listener, add:

```js
/* ——— NAV SCROLL STATE ——— */
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });
```

- [ ] **Step 8: Add clubs grid fade-in on re-render to `script.js`**

Find the `renderClubs` function. After `clubsGrid.innerHTML = filtered.map(...).join('');`, add:

```js
  clubsGrid.classList.remove('fade-in');
  void clubsGrid.offsetWidth; // force reflow so animation restarts
  clubsGrid.classList.add('fade-in');
```

The full updated section inside `renderClubs` (after the innerHTML assignment) should look like:
```js
  clubsGrid.innerHTML = filtered.map(club => { ... }).join('');
  clubsGrid.classList.remove('fade-in');
  void clubsGrid.offsetWidth;
  clubsGrid.classList.add('fade-in');
```

- [ ] **Step 9: Add search result stagger to `script.js`**

Find the `searchInput.addEventListener('input', ...)` handler. After `searchResults.classList.add('active');`, add:

```js
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
```

- [ ] **Step 10: Extend scroll reveal to section titles in `script.js`**

Find the scroll reveal section (`/* ——— SCROLL REVEAL ——— */`). Update the `querySelectorAll` selector on the first line:

From:
```js
const revealElements = document.querySelectorAll('.top-pick-card, .link-card, .fresh-item, .tool-item, .club-card');
```
To:
```js
const revealElements = document.querySelectorAll('.top-pick-card, .link-card, .fresh-item, .tool-item, .club-card, h2.section-title');
```

Also add a `prefers-reduced-motion` guard to the scroll reveal setup. Replace the `revealElements.forEach` block:

From:
```js
revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = `opacity 0.5s ease ${(i % 8) * 0.06}s, transform 0.5s ease ${(i % 8) * 0.06}s, background 0.2s ease`;
  io.observe(el);
});
```
To:
```js
const prefersReducedMotionReveal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
revealElements.forEach((el, i) => {
  if (prefersReducedMotionReveal) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = `opacity 0.5s ease ${(i % 8) * 0.06}s, transform 0.5s ease ${(i % 8) * 0.06}s, background 0.2s ease`;
  io.observe(el);
});
```

- [ ] **Step 11: Verify all animations in browser**

Hard-refresh `http://localhost:8080`. Test each animation:

1. **Background glow** — visible subtle tint in hero corners, drifts slowly
2. **Card hover lift** — hover any portal or club card: lifts 2px, faint shadow appears, red bar still slides in
3. **Hero em shimmer** — "place." in the hero title slowly shifts between red tones on a ~4s loop
4. **Tab crossfade** — click portal tabs: panel content fades in rather than snapping
5. **Clubs grid fade** — click club filter tabs: grid fades in with new content
6. **Nav scroll state** — scroll down past the hero: nav gains blur + border. Scroll back to top: border disappears
7. **Search stagger** — type in search bar: results appear with a staggered slide-up, not all at once
8. **Section title reveal** — scroll down: `h2` section headings ("Most visited", "All portals", etc.) fade up as they enter the viewport
9. **Theme toggle** — all animations adapt to light theme correctly
10. No console errors

- [ ] **Step 12: Commit**

```bash
cd /Users/yashvardhan21/Documents/Projects/ntu-atlas
git add style.css script.js
git commit -m "feat: add card lift, nav scroll, tab crossfade, search stagger, section reveal, hero shimmer"
```

---

## Self-Review Notes

**Spec coverage check:**
- 1.1 Hero stats removal → Task 1 Steps 1, 5, 11 ✓
- 1.2 Nav subtitle removal → Task 1 Steps 2, 8 ✓
- 1.3 Community button removal → Task 1 Steps 3, 7 ✓
- 1.4 link-card-ext removal → Task 1 Steps 4, 9, 10 ✓
- 2.1 Modal content (About/Disclaimer/Privacy) → Task 2 Step 4 ✓
- 2.2 Modal implementation (ARIA, focus trap, keyboard) → Task 2 Step 4 ✓
- 2.3 Modal styles → Task 2 Step 3 ✓
- 3.1 Radial glow → Task 3 ✓
- 3.2 Card hover lift → Task 4 Step 2 ✓
- 3.3 Nav scroll state → Task 4 Steps 1, 5, 7 ✓
- 3.4 Tab panel crossfade → Task 4 Steps 4, 8 ✓
- 3.5 Search stagger → Task 4 Step 9 ✓
- 3.6 Section title reveal → Task 4 Step 10 ✓
- 3.7 Hero em shimmer → Task 4 Step 3 ✓
- All `prefers-reduced-motion` overrides → Task 3 Step 2, Task 4 Steps 6, 10 ✓
- Accessibility (modal ARIA, focus trap, Escape) → Task 2 Step 4 ✓
