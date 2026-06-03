# NTU Atlas — Polish & Legitimacy Design
**Date:** 2026-06-03

## Overview

Three areas of improvement to the existing NTU Atlas static site (`index.html`, `style.css`, `script.js`):

1. **UI cleanup** — remove clutter from the hero, nav, and portal cards
2. **Legal pages** — privacy policy, disclaimer, and about page accessible via footer modals
3. **Animations** — radial glow background atmosphere and six element micro-interaction enhancements, all accessible

---

## 1. UI Cleanup

### 1.1 Remove hero stats block

Delete the entire `.hero-stats` div from `index.html` (the "41 Links / 10 Categories / 1 University" block). The hero section becomes: label → title → description → scroll hint. No replacement.

Also remove the corresponding `.hero-stats`, `.hero-stat`, `.hero-stat-num`, `.hero-stat-label` CSS rules from `style.css`, and any `@media` breakpoint rules that reference those selectors.

### 1.2 Remove "Student Portal" nav subtitle

Delete `<span class="nav-logo-sub">Student Portal</span>` from `index.html`. The nav logo becomes "NTU Atlas" only. Remove `.nav-logo-sub` CSS rule from `style.css`.

### 1.3 Remove Community nav button

Delete the `<a class="nav-pill" ...>Community</a>` anchor from `index.html`. The `nav-right` div then contains only the theme toggle button. Remove the `.nav-pill` CSS rule from `style.css`.

### 1.4 Remove external link icon from portal cards

Delete every `<span class="link-card-ext">...</span>` element from all portal cards in `index.html`. These are the small external-link SVG icons at the bottom-right of each card. The `.link-card-go` "Go →" element remains.

Update `.link-card-footer` CSS: remove `justify-content: space-between` (the "Go →" element will left-align by flex default). Remove `.link-card-ext` CSS rules from `style.css`.

---

## 2. Legal & Legitimacy Pages

### 2.1 Content

Three modal overlays, each with minimal honest content:

**About**
- What NTU Atlas is: a student-built directory of NTU's digital ecosystem
- Not affiliated with Nanyang Technological University
- Maintained by the student community; link to the Telegram community (replaces the removed Community nav button)
- Open to contributions

**Disclaimer**
- Not affiliated with or endorsed by NTU
- Links are student-maintained and may become outdated or inaccurate
- Use links at your own discretion
- For official NTU information, refer to ntu.edu.sg

**Privacy Policy**
- No cookies, no analytics, no tracking scripts
- No user accounts, no data collection of any kind
- External links go to third-party sites with their own privacy policies
- The site itself stores only a single `localStorage` key for the user's dark/light theme preference

### 2.2 Implementation

**Modal structure** — one shared `<div id="legalModal">` overlay added to `index.html` before the closing `</body>`. It contains:
- A close button (×)
- A `<h2 id="legalModalTitle">` for the title
- A `<div id="legalModalBody">` for the content

Three static content strings (About, Disclaimer, Privacy) are defined in `script.js`. Clicking a footer link calls `openModal(type)` which sets the title and body innerHTML, then shows the overlay. Closing via the × button, Escape key, or clicking outside the modal content area.

**ARIA** — modal uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby="legalModalTitle"`. Focus is trapped inside the modal while open; returns to the triggering element on close.

**Footer links** — a new row added to the footer:
```html
<div class="footer-legal">
  <button class="footer-legal-link" data-modal="about">About</button>
  <span aria-hidden="true">·</span>
  <button class="footer-legal-link" data-modal="disclaimer">Disclaimer</button>
  <span aria-hidden="true">·</span>
  <button class="footer-legal-link" data-modal="privacy">Privacy Policy</button>
</div>
```

### 2.3 Styles

Modal overlay: `position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); z-index: 1000`. Modal panel: max 640px wide, centred, uses existing `--bg-secondary`, `--border`, `--text-primary` variables. Close button top-right. Content area scrollable if long.

---

## 3. Animations

### 3.1 Background radial glow

Two radial gradient blobs placed as `::before` and `::after` pseudo-elements on `body` (or a dedicated `.bg-glow` div), with `position: fixed; pointer-events: none; z-index: 0`.

**Blob 1** — NTU red (`var(--ntu-red)`) at 8% opacity, ~600px diameter, anchored top-left (`top: -100px; left: -100px`). Animates with `@keyframes glowDrift1`: translates `60px, 40px` and scales `1.1` over 18s, `ease-in-out infinite alternate`.

**Blob 2** — cool neutral (`#6080a0`) at 5% opacity, ~800px diameter, anchored bottom-right (`bottom: -200px; right: -100px`). Animates with `@keyframes glowDrift2`: translates `-50px, -60px` and scales `1.15` over 22s, `ease-in-out infinite alternate`.

**Light theme** — opacity halved (`4%` and `2.5%`) so blobs don't overpower the light background.

**`prefers-reduced-motion`** — `animation-play-state: paused` on both blobs. The static tinted shapes remain; only motion stops.

### 3.2 Card hover lift

Add to `.link-card:hover` and `.club-card:hover`:
```css
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(0,0,0,0.15);
```
Add `transition: transform 0.2s ease, box-shadow 0.2s ease` to `.link-card` and `.club-card` base rules (alongside existing `transition: background 0.2s`).

Under `prefers-reduced-motion`: `transform: none; box-shadow: none` on hover.

### 3.3 Nav scroll state

A `scrolled` class is added to `<nav>` via a `scroll` event listener in `script.js` when `window.scrollY > 60`.

CSS for `nav.scrolled`:
```css
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
background: rgba(var(--bg-primary-rgb), 0.85);
border-bottom: 1px solid var(--border);
```

This requires adding `--bg-primary-rgb` CSS custom property alongside the existing `--bg-primary` (the RGB triplet without the `rgb()` wrapper, e.g. `13, 13, 13`).

Under `prefers-reduced-motion`: `backdrop-filter` is skipped; just the border and a solid background colour applied.

### 3.4 Tab panel crossfade

When a portal tab or club filter tab is activated, the newly-shown panel fades in over 150ms.

Tab panels use `display: none` / `display: block` via `.active`. The crossfade is implemented with a CSS `@keyframes` animation applied to `.cat-panel.active`:

```css
@keyframes panelFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.cat-panel.active {
  animation: panelFadeIn 0.15s ease;
}
```

No JS changes needed. For the clubs grid re-render (via `renderClubs()`), the same effect is achieved by adding a brief CSS animation class to `#clubsGrid` after each re-render in `script.js`.

Under `prefers-reduced-motion`: skip the animation entirely — `@media (prefers-reduced-motion: reduce) { .cat-panel.active { animation: none; } }`.

### 3.5 Search result stagger

Each search result item gets `opacity: 0; transform: translateY(6px)` initially, then transitions to visible with a `30ms * index` delay. Applied via inline `style` when results are rendered in `script.js`.

Under `prefers-reduced-motion`: items appear instantly (no transform, no delay).

### 3.6 Section title reveal

Extend the existing `IntersectionObserver` scroll-reveal logic in `script.js` to also observe `h2.section-title` elements. They start `opacity: 0; transform: translateY(12px)` and transition to visible when entering the viewport.

The existing `fadeUp` `@keyframes` can be reused.

### 3.7 Hero `<em>` shimmer

The `<em>place.</em>` text in the hero title cycles slowly between NTU red and a slightly warmer red-orange:

```css
@keyframes accentShimmer {
  0%, 100% { color: var(--ntu-red); }
  50% { color: #e84040; }
}
.hero-title em {
  animation: accentShimmer 4s ease-in-out infinite;
}
```

Under `prefers-reduced-motion`: no animation; `color: var(--ntu-red)` static.

---

## 4. Files Affected

| File | Changes |
|------|---------|
| `index.html` | Remove hero stats, nav subtitle, Community button, all `.link-card-ext` spans; add legal modal HTML; add footer legal links; add `.bg-glow` div |
| `style.css` | Remove stats/pill/ext CSS; add glow blob, card lift, nav scroll, tab fade, search stagger, section reveal, hero shimmer styles; add modal styles; add `prefers-reduced-motion` overrides |
| `script.js` | Add modal open/close/focus-trap logic; add legal content strings; add nav scroll listener; add tab crossfade; add search stagger; extend scroll-reveal to section titles |

---

## 5. Accessibility Guarantees

- All new animations respect `prefers-reduced-motion: reduce` — either paused or replaced with instant state changes
- Modal: `role="dialog"`, `aria-modal="true"`, focus trap, Escape to close, focus returns to trigger
- Footer legal links are `<button>` elements (keyboard accessible, not `<a href="#">`)
- Radial blobs are decorative: `pointer-events: none`, no ARIA role needed
- Nav scroll state changes are visual only — no content or structure changes
