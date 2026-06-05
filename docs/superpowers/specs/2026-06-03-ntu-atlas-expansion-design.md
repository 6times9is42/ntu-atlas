# NTU Atlas — Expansion Design
**Date:** 2026-06-03

## Overview

Expand NTU Atlas from a 28-link portal directory into a comprehensive student resource covering campus life, IT, student services, and clubs & societies. The site remains a static HTML/CSS/JS project with no build toolchain.

---

## 1. What Changes

### Remove
- **Constellation map section** — decorative canvas animation with no navigation value; removed entirely from `index.html` and `script.js`

### Keep unchanged
- Hero, marquee ticker, search, "Most visited" (top 3), freshmen checklist, direct access row, footer
- **Hero stats** (`28 links`, `9 categories`) must be updated to reflect the final link and tab counts after all additions are complete

### Data architecture change
- Move all link data out of `script.js` into a new **`data.js`** file (loaded before `script.js` in `index.html`)
- `data.js` exports two arrays: `allLinks` (portal links) and `allClubs` (clubs data)
- Keeps `script.js` focused on behaviour, not content

---

## 2. Page Structure (in order)

1. Hero
2. Marquee
3. Search
4. Most visited
5. All portals ← expanded tabs
6. Freshmen checklist
7. **Clubs & Societies** ← new section
8. Direct access row
9. Footer

---

## 3. Portals — Tab Changes

Current 8 tabs become 10. **Tools tab is dropped**; its two links move to Academics.

| Tab | Change |
|-----|--------|
| Academics | Add: Academic Calendar, Library Catalogue, Turnitin. Absorb: MOOC Transfer, MOOC Guide (from Tools) |
| Career | No change |
| Exchange | No change |
| Facilities | Add: Sports & Recreation Centre (SRC) booking |
| Finance | No change |
| Housing | No change |
| Community | Add: NTU OSA Clubs Directory link; existing 3 Telegram links remain; additional school/year-group Telegram links added as cards using the same link-card pattern |
| **Campus Life** | New. Links: NTU Bus app, Campus map (maps.ntu.edu.sg), Canteen locator, Student Health Centre, Counselling Services |
| **IT & Tech** | New. Links: NTU VPN, eduroam setup guide, NTU Email (Outlook), Microsoft 365 for students, IT Service Desk |
| **Student Services** | New. Links: Student Service Centre (SSC), OSA portal, International Students Office, Graduation/Convocation |

---

## 4. Clubs & Societies Section

### Position
Sits between the freshmen checklist and the direct access row. Same visual language as the rest of the page (card grid, tab filters, NTU red accents).

### Filter tabs
Seven tabs: **All · Sports · Arts · Cultural · Academic · Uniformed · Welfare**

The active tab filters the visible cards. Same tab interaction pattern as the portals section.

### Club card anatomy
Each card shows:
- **Type tag** — small uppercase label (e.g. `SPORTS`, `CULTURAL`)
- **Club name** — prominent
- **Short description** — 1–2 sentences, what the club does
- **Instagram link** — icon + handle, opens `instagram.com/<handle>`
- **Telegram link** — icon + link (shown only if available)
- Hover: left red accent bar slides in (same as link cards)

### Data structure (in `data.js`)
```js
const allClubs = [
  {
    name: 'NTU Choir',
    type: 'Arts',           // matches filter tab labels
    desc: 'Choral ensemble performing Western and Asian repertoire.',
    instagram: 'ntuchoir',
    telegram: 'https://t.me/ntuchoir', // null if unavailable
  },
  // ...
];
```

### Search integration
The existing search bar is extended to also match clubs by name, type, and description. Results show a `CLUB` category badge to distinguish from portal links.

---

## 5. Files Affected

| File | Change |
|------|--------|
| `index.html` | Remove constellation section; add `<script src="data.js">` before `script.js`; add clubs section HTML; add 3 new portal tab buttons and panels |
| `style.css` | Add club card styles (reuses most link-card styles); add club filter tab styles (reuses cat-tab styles) |
| `script.js` | Remove constellation canvas code; extend search to include `allClubs`; add club filter tab logic |
| `data.js` | New file. Contains `allLinks` (moved from script.js) and `allClubs` |

---

## 6. Frontend Skills to Apply

Per user instruction, all relevant frontend skills are to be used during implementation:
- Semantic HTML and ARIA roles consistent with existing patterns
- CSS custom properties for theming (all new styles use existing `--*` variables)
- Smooth transitions and hover states matching the existing design system
- Responsive layout: club grid collapses to single column on mobile (matching `.links-grid` behaviour)
- Accessibility: filter tabs use `role="tab"` / `aria-selected` / `aria-controls` pattern already established
