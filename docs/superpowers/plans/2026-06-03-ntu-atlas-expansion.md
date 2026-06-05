# NTU Atlas Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand NTU Atlas from a 28-link portal directory into a comprehensive student resource with new portal categories, a filterable Clubs & Societies section, and a dedicated data layer.

**Architecture:** All data (portal links + club entries) moves from `script.js` into a new `data.js` file loaded first. The constellation map is removed. Three new portal tabs (Campus Life, IT & Tech, Student Services) are added to `index.html`. A Clubs & Societies section is inserted between the freshmen checklist and the direct access row; club cards are rendered dynamically by `script.js` from `allClubs` in `data.js`.

**Tech Stack:** Vanilla HTML, CSS custom properties, vanilla JS (ES6). No build toolchain. Served with Python's `http.server`. Use all relevant frontend skills (semantic HTML, ARIA, CSS transitions, responsive grid) consistent with the existing design system.

---

## File Map

| File | Role after this plan |
|------|---------------------|
| `data.js` | **New.** Single source of truth for all content: `allLinks` (portal links) and `allClubs` (club entries) |
| `index.html` | Structure only — no inline data, no constellation section, new tabs + panels, new clubs section |
| `style.css` | Existing styles + club card styles + clubs section layout; constellation CSS removed |
| `script.js` | Behaviour only — constellation code removed, `allLinks` declaration removed, club filter + search extended |

---

## Task 1: Create data.js

**Files:**
- Create: `data.js`

- [ ] **Step 1: Create `data.js` with `allLinks` (moved from script.js) and expanded entries**

`allLinks` moves verbatim from `script.js` lines 2–24, then extended with all new portal entries. The `cat` field for MOOC Transfer and MOOC Guide changes from `'Tools'` to `'Academics'`. New entries added for all new tabs.

```js
/* ——— PORTAL LINKS ——— */
const allLinks = [
  /* Academics */
  { name: 'NTULearn', desc: 'Course materials, assignments, announcements', cat: 'Academics', url: 'https://ntulearn.ntu.edu.sg/ultra/institution-page' },
  { name: 'Degree Audit', desc: 'View grades and track AU progress', cat: 'Academics', url: 'https://wish.wis.ntu.edu.sg/pls/webexe/ldap_login.login?w_url=https://wish.wis.ntu.edu.sg/pls/webexe/dars_result_ro.main_display' },
  { name: 'STARS', desc: 'Register for courses and plan timetable', cat: 'Academics', url: 'https://wish.wis.ntu.edu.sg/pls/webexe/ldap_login.login?w_url=https://wish.wis.ntu.edu.sg/pls/webexe/aus_stars_planner.main' },
  { name: 'Exam Seating', desc: 'Exam venue and seat number', cat: 'Academics', url: 'https://sso.wis.ntu.edu.sg/webexe88/owa/sso_login1.asp?t=1&p2=https://wis.ntu.edu.sg/webexe/owa/oes_main.main&extra=&pg=' },
  { name: 'Exam Timetable', desc: 'Exam schedule for current semester', cat: 'Academics', url: 'https://wis.ntu.edu.sg/webexe/owa/exam_timetable_und.main' },
  { name: 'Transcript', desc: 'View grades history', cat: 'Academics', url: 'https://wis.ntu.edu.sg/webexe/owa/request_transcript_und.LoginN?pType=SH' },
  { name: 'S/U Option', desc: 'Satisfactory/Unsatisfactory grading election', cat: 'Academics', url: 'https://sso.wis.ntu.edu.sg/webexe88/owa/sso_login1.asp?t=1&p2=https://wis.ntu.edu.sg/pls/webexe/aus_su_opt.display&extra=&pg=' },
  { name: 'Class Schedule', desc: 'Browse available classes for any module', cat: 'Academics', url: 'https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main' },
  { name: 'LOA Form', desc: 'Leave of absence application form', cat: 'Academics', url: 'https://entuedu.sharepoint.com/sites/Student/dept/sasd/oas/Shared%20Documents/Forms/display.aspx?id=%2Fsites%2FStudent%2Fdept%2Fsasd%2Foas%2FShared%20Documents%2FCandidature%2FShort%20Leave%20Application%20Form0324%2Epdf' },
  { name: 'Academic Calendar', desc: 'Semester dates, recess weeks, exam periods and public holidays', cat: 'Academics', url: 'https://www.ntu.edu.sg/education/academic-calendar' },
  { name: 'Library Catalogue', desc: 'Search NTU library holdings — books, journals, databases and e-resources', cat: 'Academics', url: 'https://libportal.ntu.edu.sg/' },
  { name: 'Turnitin', desc: 'Plagiarism detection and originality checking tool, accessed through NTULearn course shells', cat: 'Academics', url: 'https://ntulearn.ntu.edu.sg/ultra/institution-page' },
  { name: 'MOOC Transfer', desc: 'Credit transfer portal for approved online MOOCs. Submit completed certificates for AU recognition.', cat: 'Academics', url: 'https://sso.wis.ntu.edu.sg/webexe88/owa/sso_login1.asp?t=&p2=https://venus2.wis.ntu.edu.sg/MOOC/Student/Login.aspx&extra=&pg=' },
  { name: 'MOOC Guide', desc: 'Approved MOOC platforms and eligibility for AU credit under NTU\'s recognition programme', cat: 'Academics', url: 'https://www.ntu.edu.sg/admissions/matriculation/mooc' },
  /* Career */
  { name: 'CareerAxis', desc: 'Internships, jobs and career events', cat: 'Career', url: 'https://careeraxis.ntu.edu.sg/students' },
  { name: 'Work Study Scheme', desc: 'Paid on-campus student opportunities that fit around your academic schedule', cat: 'Career', url: 'https://entuedu.sharepoint.com/sites/Student/dept/sasd/sao/SitePages/WSS/WSS.aspx' },
  /* Exchange */
  { name: 'Exchange Portal', desc: 'Semester exchanges and global programmes at partner universities worldwide', cat: 'Exchange', url: 'https://gem.ntu.edu.sg/' },
  { name: 'Course Matching', desc: 'Match overseas courses to NTU equivalents for credit transfer approval', cat: 'Exchange', url: 'https://sso.wis.ntu.edu.sg/webexe88/owa/sso_login1.asp?t=1&p2=https://wis.ntu.edu.sg/pls/lms/instep_past_subj_matching.show_rec_INSTEP' },
  /* Facilities */
  { name: 'Library Booking', desc: 'Study rooms and library spaces across NTU\'s library network', cat: 'Facilities', url: 'https://libcalendar.ntu.edu.sg/' },
  { name: 'Facilities Booking', desc: 'Sports courts, function rooms and multi-purpose halls for club or personal use', cat: 'Facilities', url: 'https://ntu.facilitiesbooking.com/bookings.aspx' },
  { name: 'Sports & Rec Centre', desc: 'Book facilities at the Sports & Recreation Centre — gym, pools, courts and fitness classes', cat: 'Facilities', url: 'https://www.ntu.edu.sg/life-at-ntu/sports-and-recreation' },
  /* Finance */
  { name: 'Financial Aid', desc: 'Scholarships, bursaries, tuition grants and financial assistance for undergraduates', cat: 'Finance', url: 'https://www.ntu.edu.sg/admissions/undergraduate/financial-matters/financial-aid' },
  /* Housing */
  { name: 'Hall Portal', desc: 'Apply for on-campus housing, manage your hall room and submit maintenance requests', cat: 'Housing', url: 'https://ntusg.starrezhousing.com/StarRezStudentPortal/60E2C0B3/1/1/Home-Home?UrlToken=CFD12569' },
  /* Community */
  { name: 'NTU ConfessIt', desc: 'Anonymous confessions from the NTU student body — the unfiltered pulse of campus life', cat: 'Community', url: 'https://t.me/ntuconfessit' },
  { name: 'NTU Marketplace', desc: 'Student-to-student trading for textbooks, electronics, furniture and campus essentials', cat: 'Community', url: 'https://t.me/ntumarketplace' },
  { name: 'NTU Atlas Community', desc: 'Suggest new links, report broken ones and connect with fellow students', cat: 'Community', url: 'https://t.me/ntulinksss' },
  { name: 'OSA Clubs Directory', desc: 'Official NTU list of all recognised clubs and societies managed by the Office of Student Affairs', cat: 'Community', url: 'https://www.ntu.edu.sg/student-services/office-of-student-affairs/clubs-and-societies' },
  /* Campus Life */
  { name: 'Campus Shuttle', desc: 'Real-time NTU campus bus timings and routes — also available as the NTU Campus Shuttle mobile app', cat: 'Campus Life', url: 'https://transport.ntu.edu.sg/' },
  { name: 'Campus Map', desc: 'Interactive NTU campus map — find buildings, bus stops, canteens and facilities', cat: 'Campus Life', url: 'https://maps.ntu.edu.sg/maps' },
  { name: 'Food & Beverage', desc: 'NTU canteen locations, operating hours and food options across the campus', cat: 'Campus Life', url: 'https://www.ntu.edu.sg/life-at-ntu/amenities/foodandbeverage' },
  { name: 'Student Health Centre', desc: 'Book GP consultations, vaccinations and health screenings at the on-campus clinic', cat: 'Campus Life', url: 'https://www.ntu.edu.sg/life-at-ntu/student-health-services' },
  { name: 'Counselling Services', desc: 'Free and confidential counselling and psychological support for all NTU students', cat: 'Campus Life', url: 'https://www.ntu.edu.sg/student-services/welfare-counselling-guidance' },
  /* IT & Tech */
  { name: 'NTU VPN', desc: 'Access NTU intranet resources off-campus using the official Cisco AnyConnect VPN', cat: 'IT & Tech', url: 'https://ntuvpn.ntu.edu.sg/' },
  { name: 'eduroam Setup', desc: 'Connect to eduroam Wi-Fi on campus and at partner institutions worldwide', cat: 'IT & Tech', url: 'https://www.ntu.edu.sg/ntunetwork/eduroam' },
  { name: 'NTU Email', desc: 'Access your NTU student email inbox via Outlook — check regularly for official communications', cat: 'IT & Tech', url: 'https://outlook.office365.com/' },
  { name: 'Microsoft 365', desc: 'Free Microsoft 365 suite for NTU students — Word, Excel, PowerPoint, Teams and OneDrive', cat: 'IT & Tech', url: 'https://www.ntu.edu.sg/ntunetwork/microsoft-365' },
  { name: 'IT Service Desk', desc: 'Report IT issues, request software licences and get help with NTU tech services', cat: 'IT & Tech', url: 'https://entuedu.sharepoint.com/sites/Student/dept/imsc/SitePages/Home.aspx' },
  /* Student Services */
  { name: 'Student Service Centre', desc: 'One-stop counter for academic records, letters, graduation matters and general admin', cat: 'Student Services', url: 'https://www.ntu.edu.sg/student-services/student-service-centre' },
  { name: 'Office of Student Affairs', desc: 'OSA oversees student life, welfare, clubs, and non-academic student matters', cat: 'Student Services', url: 'https://www.ntu.edu.sg/student-services/office-of-student-affairs' },
  { name: 'Global Relations Office', desc: 'Support and resources for international students studying at NTU', cat: 'Student Services', url: 'https://www.ntu.edu.sg/gro' },
  { name: 'Graduation', desc: 'Graduation eligibility checks, ceremony registration and collection of certificates', cat: 'Student Services', url: 'https://www.ntu.edu.sg/student-services/academic-services/graduation' },
];

/* ——— CLUBS DATA ——— */
/* NOTE: Verify all Instagram handles and Telegram links before publishing.
   Add/correct entries as you source them from official club pages.
   instagram: handle only (no @, no URL) — null if unavailable
   telegram: full URL — null if unavailable */
const allClubs = [
  /* Sports */
  { name: 'Badminton Club', type: 'Sports', desc: 'Competitive and recreational badminton for all skill levels, with inter-varsity training.', instagram: 'ntubadminton', telegram: null },
  { name: 'Basketball Club', type: 'Sports', desc: 'Men\'s and women\'s basketball teams competing in inter-varsity leagues and friendly tournaments.', instagram: 'ntu.basketball', telegram: null },
  { name: 'Football Club', type: 'Sports', desc: 'NTU\'s flagship football club, fielding teams in the Institute-Varsity-Polytechnic (IVP) league.', instagram: 'ntufootball', telegram: null },
  { name: 'Swimming Club', type: 'Sports', desc: 'Competitive swimming and water polo, with training sessions in the NTU Olympic-size pool.', instagram: 'ntuswimmingclub', telegram: null },
  { name: 'Tennis Club', type: 'Sports', desc: 'Tennis training and inter-varsity competition for beginners through to advanced players.', instagram: 'ntutennisclub', telegram: null },
  { name: 'Rock Climbing Club', type: 'Sports', desc: 'Bouldering, lead and top-rope climbing sessions at the NTU climbing wall and beyond.', instagram: 'nturockclimbing', telegram: null },
  { name: 'Volleyball Club', type: 'Sports', desc: 'Men\'s and women\'s volleyball teams with regular training and inter-varsity fixtures.', instagram: 'ntuvbc', telegram: null },
  { name: 'Table Tennis Club', type: 'Sports', desc: 'Casual and competitive table tennis for all levels, with IVP representation.', instagram: 'ntutabletennis', telegram: null },
  /* Arts */
  { name: 'Choir', type: 'Arts', desc: 'NTU\'s premier choral ensemble performing Western classical and Asian repertoire at local and international events.', instagram: 'ntuchoir', telegram: null },
  { name: 'Symphonic Band', type: 'Arts', desc: 'Full concert band performing across Singapore and at international band festivals.', instagram: 'ntusymphonicband', telegram: null },
  { name: 'Dance Ensemble', type: 'Arts', desc: 'Contemporary and traditional dance performances, open to dancers of all backgrounds.', instagram: 'ntudance', telegram: null },
  { name: 'Drama Society', type: 'Arts', desc: 'English-language theatre productions, workshops and improv sessions throughout the year.', instagram: 'ntudrama', telegram: null },
  { name: 'Guitar Ensemble', type: 'Arts', desc: 'Classical and fingerstyle guitar ensemble with regular public performances and masterclasses.', instagram: 'ntuguitarensemble', telegram: null },
  /* Cultural */
  { name: 'Chinese Society', type: 'Cultural', desc: 'Celebrating Chinese culture through language, arts, festivals and community events.', instagram: 'ntuchinesociety', telegram: null },
  { name: 'Tamil Language Society', type: 'Cultural', desc: 'Promoting Tamil language, literature and South Indian culture within the NTU community.', instagram: 'ntutamilsociety', telegram: null },
  { name: 'Malay Cultural Society', type: 'Cultural', desc: 'Preserving and promoting Malay language, arts and culture through performances and workshops.', instagram: 'ntumcs', telegram: null },
  { name: 'Korean Cultural Club', type: 'Cultural', desc: 'Korean language classes, K-pop, food events and cultural exchange within NTU.', instagram: 'ntukcc', telegram: null },
  { name: 'Japanese Cultural Club', type: 'Cultural', desc: 'Japanese language, anime, manga, food and cultural events for enthusiasts and learners.', instagram: 'ntujcc', telegram: null },
  { name: 'Indian Cultural Society', type: 'Cultural', desc: 'Celebrating the diversity of Indian culture through dance, music, festivals and food.', instagram: 'ntuindian', telegram: null },
  /* Academic */
  { name: 'IEEE NTU Student Branch', type: 'Academic', desc: 'IEEE student chapter hosting technical workshops, industry talks and networking events for engineers.', instagram: 'ieeestu.ntu', telegram: null },
  { name: 'NTU Computing Society', type: 'Academic', desc: 'Hackathons, coding competitions, tech talks and career networking for computing students.', instagram: 'ntucomputingsociety', telegram: 'https://t.me/NTUComputingSociety' },
  { name: 'Entrepreneurship Society', type: 'Academic', desc: 'Startup pitches, founder talks and innovation bootcamps for aspiring student entrepreneurs.', instagram: 'ntues', telegram: null },
  { name: 'Investment Club', type: 'Academic', desc: 'Stock pitching competitions, investment simulations and finance industry networking for NTU students.', instagram: 'ntuinvestmentclub', telegram: null },
  /* Uniformed */
  { name: 'Naval Volunteer Force', type: 'Uniformed', desc: 'NTU\'s uniformed naval unit under NUSS — seamanship, leadership and community service.', instagram: 'ntunvf', telegram: null },
  { name: 'St John\'s Brigade', type: 'Uniformed', desc: 'First aid training, community service and emergency response as part of St John Brigade Singapore.', instagram: 'ntusjab', telegram: null },
  { name: 'Red Cross Youth', type: 'Uniformed', desc: 'Humanitarian volunteering, disaster preparedness and blood donation drives on campus.', instagram: 'ntu_redcross', telegram: null },
  /* Welfare */
  { name: 'Students\' Union', type: 'Welfare', desc: 'The official representative body of NTU students — advocating for student welfare and organising campus-wide events.', instagram: 'ntusu', telegram: null },
  { name: 'Project Heartware', type: 'Welfare', desc: 'Student-run voluntary welfare organisation connecting NTU students with community service opportunities.', instagram: 'projectheartware', telegram: null },
  { name: 'Green Club', type: 'Welfare', desc: 'Sustainability initiatives, eco-campaigns and green living advocacy across the NTU campus.', instagram: 'ntugreenclub', telegram: null },
];
```

- [ ] **Step 2: Verify in browser console**

Open `http://localhost:8080/index.html`, open DevTools Console and run:
```js
// These should be undefined — data.js not loaded yet (expected at this stage)
console.log(typeof allLinks, typeof allClubs);
```
Expected output: `undefined undefined` (data.js not wired in yet — fixed in Task 2)

- [ ] **Step 3: Commit**

```bash
git add data.js
git commit -m "feat: add data.js with allLinks and allClubs arrays"
```

---

## Task 2: Wire data.js into index.html and remove allLinks from script.js

**Files:**
- Modify: `index.html:622`
- Modify: `script.js:1-24`

- [ ] **Step 1: Add `data.js` script tag in `index.html` before `script.js`**

Replace line 622 of `index.html`:
```html
<script src="script.js"></script>
```
With:
```html
<script src="data.js"></script>
<script src="script.js"></script>
```

- [ ] **Step 2: Remove `allLinks` declaration from `script.js`**

Delete lines 1–24 of `script.js` (the entire `const allLinks = [...]` block — the comment line and closing `];`). The file should now start at:
```js
/* ——— SEARCH FUNCTION ——— */
const searchInput = document.getElementById('searchInput');
```

- [ ] **Step 3: Verify in browser**

Hard-refresh `http://localhost:8080/index.html`. Open DevTools Console:
```js
console.log(allLinks.length, typeof allClubs);
```
Expected: `41 object` (or however many entries are in data.js at this point)

Search for "ntulearn" — results should still appear.

- [ ] **Step 4: Commit**

```bash
git add index.html script.js
git commit -m "feat: wire data.js, remove allLinks from script.js"
```

---

## Task 3: Remove constellation map

**Files:**
- Modify: `index.html:522-533`
- Modify: `script.js:141-284`
- Modify: `style.css:743-782` and `style.css:987`

- [ ] **Step 1: Remove constellation section from `index.html`**

Delete lines 522–533 (the entire `<!-- Constellation visual -->` section including its closing `</section>` tag):
```html
<!-- Constellation visual -->
<section class="constellation-section" aria-label="Campus portal constellation map">
  <div class="section-header" style="padding: 0; margin-bottom: 28px;">
    <h2 class="section-title">Portal map</h2>
    <span class="section-count">Interactive</span>
  </div>
  <div class="constellation-wrap">
    <canvas id="constellationCanvas" aria-label="Animated constellation map showing NTU portals as connected nodes" role="img"></canvas>
    <span class="constellation-label" aria-hidden="true">NTU digital ecosystem</span>
    <span class="constellation-hint" aria-hidden="true">Hover to interact</span>
  </div>
</section>
```

- [ ] **Step 2: Remove constellation JS from `script.js`**

Delete lines 141–284 — everything from `/* ——— CONSTELLATION CANVAS ——— */` through `drawFrame(0);` (inclusive). The file should jump from the tabs section straight to `/* ——— SCROLL REVEAL ——— */`.

- [ ] **Step 3: Remove constellation CSS from `style.css`**

Delete lines 743–782 (`.constellation-section`, `.constellation-wrap`, `#constellationCanvas`, `.constellation-label`, `.constellation-hint` blocks).

On line 987 (the 900px media query), remove `.constellation-section` from the padding list:

Before:
```css
.search-section, .top-picks, .cat-section, .fresh-section, .tools-section, .constellation-section, .marquee-wrap { padding-left: 24px; padding-right: 24px; }
```
After:
```css
.search-section, .top-picks, .cat-section, .fresh-section, .tools-section, .marquee-wrap { padding-left: 24px; padding-right: 24px; }
```

- [ ] **Step 4: Verify in browser**

Hard-refresh `http://localhost:8080/index.html`. Confirm:
- No canvas / "Portal map" section visible between freshmen checklist and direct access row
- No JS errors in DevTools Console
- Theme toggle and search still work

- [ ] **Step 5: Commit**

```bash
git add index.html script.js style.css
git commit -m "remove: constellation map section, JS, and CSS"
```

---

## Task 4: Update portal tabs HTML

**Files:**
- Modify: `index.html:183-446`

This task makes all changes to the portals section in one commit: drop Tools tab, expand existing panels, add 3 new tab buttons and panels, update section count.

- [ ] **Step 1: Replace the tab button row**

Replace lines 187–196 (the `<div class="cat-tabs" ...>` block) with:
```html
    <div class="cat-tabs" role="tablist" aria-label="Portal categories">
      <button class="cat-tab active" role="tab" aria-selected="true" aria-controls="panel-academics" id="tab-academics">Academics</button>
      <button class="cat-tab" role="tab" aria-selected="false" aria-controls="panel-career" id="tab-career">Career</button>
      <button class="cat-tab" role="tab" aria-selected="false" aria-controls="panel-exchange" id="tab-exchange">Exchange</button>
      <button class="cat-tab" role="tab" aria-selected="false" aria-controls="panel-facilities" id="tab-facilities">Facilities</button>
      <button class="cat-tab" role="tab" aria-selected="false" aria-controls="panel-finance" id="tab-finance">Finance</button>
      <button class="cat-tab" role="tab" aria-selected="false" aria-controls="panel-housing" id="tab-housing">Housing</button>
      <button class="cat-tab" role="tab" aria-selected="false" aria-controls="panel-community" id="tab-community">Community</button>
      <button class="cat-tab" role="tab" aria-selected="false" aria-controls="panel-campuslife" id="tab-campuslife">Campus Life</button>
      <button class="cat-tab" role="tab" aria-selected="false" aria-controls="panel-ittech" id="tab-ittech">IT &amp; Tech</button>
      <button class="cat-tab" role="tab" aria-selected="false" aria-controls="panel-services" id="tab-services">Student Services</button>
    </div>
```

- [ ] **Step 2: Update section count**

Change line 184:
```html
    <span class="section-count" aria-label="8 categories">08 categories</span>
```
To:
```html
    <span class="section-count" aria-label="10 categories">10 categories</span>
```

- [ ] **Step 3: Add new cards to the Academics panel**

Inside `panel-academics`, after the last existing card (the LOA Form `</a>` at the end of the Registration subgroup), add:

```html
        <div class="links-subgroup-label" aria-hidden="true">Resources</div>
        <a class="link-card" href="https://www.ntu.edu.sg/education/academic-calendar" target="_blank" rel="noopener" aria-label="Academic calendar">
          <span class="link-card-tag">Calendar</span>
          <span class="link-card-name">Academic Calendar</span>
          <span class="link-card-desc">Semester dates, recess weeks, exam periods and public holidays for the current and upcoming academic year.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://libportal.ntu.edu.sg/" target="_blank" rel="noopener" aria-label="Library catalogue">
          <span class="link-card-tag">Library</span>
          <span class="link-card-name">Library Catalogue</span>
          <span class="link-card-desc">Search NTU library holdings — books, journals, databases and e-resources from all campus libraries.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://ntulearn.ntu.edu.sg/ultra/institution-page" target="_blank" rel="noopener" aria-label="Turnitin plagiarism checker">
          <span class="link-card-tag">Integrity</span>
          <span class="link-card-name">Turnitin</span>
          <span class="link-card-desc">Plagiarism detection and originality checking — accessed through your NTULearn course shell submission links.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <div class="links-subgroup-label" aria-hidden="true">MOOCs</div>
        <a class="link-card" href="https://sso.wis.ntu.edu.sg/webexe88/owa/sso_login1.asp?t=&p2=https://venus2.wis.ntu.edu.sg/MOOC/Student/Login.aspx&extra=&pg=" target="_blank" rel="noopener" aria-label="MOOC credit transfer">
          <span class="link-card-tag">Credit</span>
          <span class="link-card-name">MOOC Transfer</span>
          <span class="link-card-desc">Credit transfer portal for approved online MOOCs. Submit completed certificates for AU recognition.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://www.ntu.edu.sg/admissions/matriculation/mooc" target="_blank" rel="noopener" aria-label="MOOC information page">
          <span class="link-card-tag">Info</span>
          <span class="link-card-name">MOOC Guide</span>
          <span class="link-card-desc">Which platforms and courses qualify for AU credit under NTU's MOOC recognition programme.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
```

- [ ] **Step 4: Add SRC card to Facilities panel**

Inside `panel-facilities`, after the existing Facilities Booking `</a>`, add:
```html
        <a class="link-card" href="https://www.ntu.edu.sg/life-at-ntu/sports-and-recreation" target="_blank" rel="noopener" aria-label="Sports and Recreation Centre">
          <span class="link-card-tag">Sports</span>
          <span class="link-card-name">Sports &amp; Rec Centre</span>
          <span class="link-card-desc">Book the gym, swimming pools, courts and fitness classes at the NTU Sports & Recreation Centre.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
```

- [ ] **Step 5: Add OSA Clubs Directory card to Community panel**

Inside `panel-community`, after the NTU Atlas Community `</a>`, add:
```html
        <a class="link-card" href="https://www.ntu.edu.sg/student-services/office-of-student-affairs/clubs-and-societies" target="_blank" rel="noopener" aria-label="OSA clubs and societies directory">
          <span class="link-card-tag">Directory</span>
          <span class="link-card-name">OSA Clubs Directory</span>
          <span class="link-card-desc">Official NTU list of all recognised clubs and societies managed by the Office of Student Affairs.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
```

- [ ] **Step 6: Delete the Tools tab panel**

Remove the entire `<!-- Tools -->` comment and its `<div class="cat-panel" id="panel-tools" ...>` block (currently lines 423–445 before earlier edits shifted them). The block looks like:
```html
    <!-- Tools -->
    <div class="cat-panel" id="panel-tools" role="tabpanel" aria-labelledby="tab-tools">
      <div class="links-grid">
        ...MOOC cards...
      </div>
    </div>
```
(These cards have already been moved to Academics in Step 3 above.)

- [ ] **Step 7: Add Campus Life panel**

After the closing `</div>` of the Community panel, add:
```html
    <!-- Campus Life -->
    <div class="cat-panel" id="panel-campuslife" role="tabpanel" aria-labelledby="tab-campuslife">
      <div class="links-grid">
        <a class="link-card" href="https://transport.ntu.edu.sg/" target="_blank" rel="noopener" aria-label="NTU campus shuttle tracker">
          <span class="link-card-tag">Transport</span>
          <span class="link-card-name">Campus Shuttle</span>
          <span class="link-card-desc">Real-time NTU bus timings and routes. Also available as the NTU Campus Shuttle mobile app on iOS and Android.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://maps.ntu.edu.sg/maps" target="_blank" rel="noopener" aria-label="NTU campus map">
          <span class="link-card-tag">Navigation</span>
          <span class="link-card-name">Campus Map</span>
          <span class="link-card-desc">Interactive NTU campus map — find buildings, bus stops, canteens, lecture theatres and facilities by name or block.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://www.ntu.edu.sg/life-at-ntu/amenities/foodandbeverage" target="_blank" rel="noopener" aria-label="NTU food and beverage guide">
          <span class="link-card-tag">Food</span>
          <span class="link-card-name">Food &amp; Beverage</span>
          <span class="link-card-desc">NTU canteen locations, operating hours and food options across all campus dining areas.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://www.ntu.edu.sg/life-at-ntu/student-health-services" target="_blank" rel="noopener" aria-label="Student Health Centre">
          <span class="link-card-tag">Health</span>
          <span class="link-card-name">Student Health Centre</span>
          <span class="link-card-desc">Book GP consultations, vaccinations and health screenings at the on-campus clinic.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://www.ntu.edu.sg/student-services/welfare-counselling-guidance" target="_blank" rel="noopener" aria-label="NTU counselling services">
          <span class="link-card-tag">Wellness</span>
          <span class="link-card-name">Counselling Services</span>
          <span class="link-card-desc">Free and confidential counselling and psychological support for all NTU students — no referral needed.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
      </div>
    </div>
```

- [ ] **Step 8: Add IT & Tech panel**

After the Campus Life closing `</div>`, add:
```html
    <!-- IT & Tech -->
    <div class="cat-panel" id="panel-ittech" role="tabpanel" aria-labelledby="tab-ittech">
      <div class="links-grid">
        <a class="link-card" href="https://ntuvpn.ntu.edu.sg/" target="_blank" rel="noopener" aria-label="NTU VPN">
          <span class="link-card-tag">Network</span>
          <span class="link-card-name">NTU VPN</span>
          <span class="link-card-desc">Access NTU intranet resources from off-campus using the official Cisco AnyConnect VPN client.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://www.ntu.edu.sg/ntunetwork/eduroam" target="_blank" rel="noopener" aria-label="eduroam Wi-Fi setup">
          <span class="link-card-tag">Wi-Fi</span>
          <span class="link-card-name">eduroam Setup</span>
          <span class="link-card-desc">Connect to eduroam on campus and at partner institutions worldwide using your NTU credentials.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://outlook.office365.com/" target="_blank" rel="noopener" aria-label="NTU student email">
          <span class="link-card-tag">Email</span>
          <span class="link-card-name">NTU Email</span>
          <span class="link-card-desc">Your NTU student Outlook inbox — check regularly for official university communications and alerts.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://www.ntu.edu.sg/ntunetwork/microsoft-365" target="_blank" rel="noopener" aria-label="Microsoft 365 for NTU students">
          <span class="link-card-tag">Software</span>
          <span class="link-card-name">Microsoft 365</span>
          <span class="link-card-desc">Free Microsoft 365 suite for NTU students — Word, Excel, PowerPoint, Teams and 1TB OneDrive storage.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://entuedu.sharepoint.com/sites/Student/dept/imsc/SitePages/Home.aspx" target="_blank" rel="noopener" aria-label="NTU IT Service Desk">
          <span class="link-card-tag">Support</span>
          <span class="link-card-name">IT Service Desk</span>
          <span class="link-card-desc">Report IT issues, request software licences and get help with NTU computing and network services.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
      </div>
    </div>
```

- [ ] **Step 9: Add Student Services panel**

After IT & Tech closing `</div>`, add:
```html
    <!-- Student Services -->
    <div class="cat-panel" id="panel-services" role="tabpanel" aria-labelledby="tab-services">
      <div class="links-grid">
        <a class="link-card" href="https://www.ntu.edu.sg/student-services/student-service-centre" target="_blank" rel="noopener" aria-label="Student Service Centre">
          <span class="link-card-tag">Admin</span>
          <span class="link-card-name">Student Service Centre</span>
          <span class="link-card-desc">One-stop counter for academic records, official letters, graduation matters and general student administration.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://www.ntu.edu.sg/student-services/office-of-student-affairs" target="_blank" rel="noopener" aria-label="Office of Student Affairs">
          <span class="link-card-tag">Welfare</span>
          <span class="link-card-name">Office of Student Affairs</span>
          <span class="link-card-desc">OSA oversees student life, welfare, clubs and societies, and all non-academic student matters at NTU.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://www.ntu.edu.sg/gro" target="_blank" rel="noopener" aria-label="Global Relations Office for international students">
          <span class="link-card-tag">International</span>
          <span class="link-card-name">Global Relations Office</span>
          <span class="link-card-desc">Support, resources and immigration advice for international students studying at NTU.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
        <a class="link-card" href="https://www.ntu.edu.sg/student-services/academic-services/graduation" target="_blank" rel="noopener" aria-label="Graduation and convocation information">
          <span class="link-card-tag">Graduation</span>
          <span class="link-card-name">Graduation</span>
          <span class="link-card-desc">Eligibility checks, convocation ceremony registration and collection of degree certificates.</span>
          <div class="link-card-footer">
            <span class="link-card-go">Go <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
            <span class="link-card-ext"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
          </div>
        </a>
      </div>
    </div>
```

- [ ] **Step 10: Verify in browser**

Hard-refresh `http://localhost:8080/index.html`. Click every tab — confirm:
- Tools tab is gone
- Academics tab shows MOOC Transfer and MOOC Guide cards in a "MOOCs" subgroup, plus Academic Calendar, Library Catalogue, Turnitin in a "Resources" subgroup
- Facilities shows SRC card
- Community shows OSA Clubs Directory card
- Campus Life tab shows 5 new cards
- IT & Tech tab shows 5 new cards
- Student Services tab shows 4 new cards

- [ ] **Step 11: Commit**

```bash
git add index.html
git commit -m "feat: expand portal tabs — drop Tools, add Campus Life / IT & Tech / Student Services"
```

---

## Task 5: Add Clubs & Societies CSS

**Files:**
- Modify: `style.css` (append before the responsive media queries)

- [ ] **Step 1: Add club section and card styles to `style.css`**

Insert the following block immediately before the `/* ——— RESPONSIVE ——— */` comment (which precedes the `@media (max-width: 900px)` rule):

```css
/* ——— CLUBS & SOCIETIES ——— */
.clubs-section {
  position: relative;
  z-index: 1;
  padding: 0 48px;
  margin-bottom: 80px;
}

.clubs-section-wrap {
  border: 1px solid var(--border);
  border-top: none;
}

.club-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border);
  border-top: 1px solid var(--border);
  overflow-x: auto;
  scrollbar-width: none;
}
.club-tabs::-webkit-scrollbar { display: none; }

.club-tab {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  padding: 14px 22px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: all 0.2s;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  flex-shrink: 0;
}
.club-tab:hover { color: var(--text-secondary); }
.club-tab.active {
  color: var(--text-primary);
  border-bottom-color: var(--ntu-red);
}

.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0;
}

.club-card {
  padding: 28px 28px 24px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: background 0.2s;
  position: relative;
  overflow: hidden;
}
.club-card:hover { background: var(--bg-hover); }

.club-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: var(--ntu-red);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.25s ease;
}
.club-card:hover::before { transform: scaleY(1); }

.club-card-tag {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ntu-red);
  font-weight: 400;
}

.club-card-name {
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  line-height: 1.3;
}

.club-card-desc {
  font-size: 12px;
  font-weight: 300;
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
}

.club-card-links {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.club-social-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-family: 'DM Mono', monospace;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  text-decoration: none;
  padding: 5px 10px;
  border: 1px solid var(--border);
  border-radius: 20px;
  transition: all 0.2s;
}
.club-social-link:hover {
  color: var(--text-primary);
  border-color: var(--border-hover);
  background: var(--bg-hover);
}
.club-social-link svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}
.club-card:hover .club-social-link {
  border-color: var(--border-hover);
}
```

- [ ] **Step 2: Add clubs to responsive rules**

In the `@media (max-width: 900px)` block, add `.clubs-section` to the padding list:

Before:
```css
  .search-section, .top-picks, .cat-section, .fresh-section, .tools-section, .marquee-wrap { padding-left: 24px; padding-right: 24px; }
```
After:
```css
  .search-section, .top-picks, .cat-section, .fresh-section, .clubs-section, .tools-section, .marquee-wrap { padding-left: 24px; padding-right: 24px; }
```

In the `@media (max-width: 600px)` block, add:
```css
  .clubs-grid { grid-template-columns: 1fr; }
```

- [ ] **Step 3: Verify (structure only — clubs section not yet in HTML)**

Hard-refresh. No visual change expected yet. Open DevTools → check no CSS parse errors in the Styles panel.

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "feat: add club card and clubs section CSS"
```

---

## Task 6: Add Clubs & Societies HTML section

**Files:**
- Modify: `index.html` — insert section between freshmen section and `<!-- Quick tools row -->`

- [ ] **Step 1: Insert clubs section**

Find the line `<!-- Quick tools row -->` (currently line ~536) and insert the following block immediately before it:

```html
<!-- Clubs & Societies -->
<section class="clubs-section" aria-labelledby="clubsHeading">
  <div class="section-header" style="padding: 0; margin-bottom: 0;">
    <h2 class="section-title" id="clubsHeading">Clubs &amp; Societies</h2>
    <span class="section-count" id="clubsCount" aria-live="polite"></span>
  </div>
  <div class="clubs-section-wrap">
    <div class="club-tabs" role="tablist" aria-label="CCA categories">
      <button class="club-tab active" role="tab" aria-selected="true" data-filter="All" id="club-tab-all" aria-controls="clubsGrid">All</button>
      <button class="club-tab" role="tab" aria-selected="false" data-filter="Sports" id="club-tab-sports" aria-controls="clubsGrid">Sports</button>
      <button class="club-tab" role="tab" aria-selected="false" data-filter="Arts" id="club-tab-arts" aria-controls="clubsGrid">Arts</button>
      <button class="club-tab" role="tab" aria-selected="false" data-filter="Cultural" id="club-tab-cultural" aria-controls="clubsGrid">Cultural</button>
      <button class="club-tab" role="tab" aria-selected="false" data-filter="Academic" id="club-tab-academic" aria-controls="clubsGrid">Academic</button>
      <button class="club-tab" role="tab" aria-selected="false" data-filter="Uniformed" id="club-tab-uniformed" aria-controls="clubsGrid">Uniformed</button>
      <button class="club-tab" role="tab" aria-selected="false" data-filter="Welfare" id="club-tab-welfare" aria-controls="clubsGrid">Welfare</button>
    </div>
    <div class="clubs-grid" id="clubsGrid" role="list" aria-label="Clubs and societies"></div>
  </div>
</section>

```

- [ ] **Step 2: Verify clubs section appears**

Hard-refresh. The "Clubs & Societies" heading and filter tabs should appear between the freshmen section and the direct access row. The grid will be empty — that's expected until Task 7.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Clubs & Societies section HTML"
```

---

## Task 7: Clubs filter logic and extended search in script.js

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add club card renderer and filter logic**

Append the following block to the **end** of `script.js` (after the scroll reveal code):

```js
/* ——— CLUBS & SOCIETIES ——— */
const clubsGrid = document.getElementById('clubsGrid');
const clubsCount = document.getElementById('clubsCount');

// Escapes text before inserting into innerHTML to prevent XSS.
// All club fields (name, desc, type, instagram handle) pass through this.
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
```

- [ ] **Step 2: Extend the search function to include clubs**

Find the `searchLinks` function in `script.js`. Replace it with:

```js
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
```

Also extend `intentMap` with club-related keywords. Find the closing `};` of `intentMap` and add before it:

```js
  'club': ['CareerAxis'],   // placeholder — clubs are rendered via renderClubs
  'cca': ['CareerAxis'],
  'society': ['CareerAxis'],
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
```

- [ ] **Step 3: Verify in browser**

Hard-refresh `http://localhost:8080/index.html`:
1. Clubs & Societies section now shows all 30 club cards with Instagram links
2. Clicking "Sports" filter shows only sports clubs; count updates
3. Keyboard arrow keys cycle through filter tabs
4. Search for "choir" — shows NTU Choir with `CLUB` badge in results
5. Search for "bus" — shows Campus Shuttle portal result

- [ ] **Step 4: Apply scroll reveal to club cards**

In the scroll reveal block near the bottom of `script.js`, update the selector to include `.club-card`:

Before:
```js
const revealElements = document.querySelectorAll('.top-pick-card, .link-card, .fresh-item, .tool-item');
```
After:
```js
const revealElements = document.querySelectorAll('.top-pick-card, .link-card, .fresh-item, .tool-item, .club-card');
```

**Note:** Because club cards are rendered dynamically, the scroll reveal observer must run after `renderClubs('All')`. Move the entire scroll reveal block to the **end** of `script.js`, after the `renderClubs('All')` call.

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "feat: clubs filter tabs, dynamic rendering, extended search"
```

---

## Task 8: Update hero stats

**Files:**
- Modify: `index.html:67` and `index.html:71`

- [ ] **Step 1: Count final portal links**

Open DevTools Console on `http://localhost:8080/index.html` and run:
```js
console.log('Links:', allLinks.length, 'Clubs:', allClubs.length, 'Categories: 10');
```
Note the exact numbers.

- [ ] **Step 2: Update hero stat numbers in `index.html`**

Update the three `.hero-stat-num` spans (lines ~67 and ~71) to reflect final counts. Based on the links defined in Task 1, expected values are:

```html
<span class="hero-stat-num">41</span>
<span class="hero-stat-label">Links</span>
```
```html
<span class="hero-stat-num">10</span>
<span class="hero-stat-label">Categories</span>
```
The `1 University` stat stays as-is.

Also update the hero description to reflect the expanded scope:
```html
<p class="hero-desc">
  A curated directory of NTU's digital ecosystem — portals, campus services, clubs and societies. Built for students, especially those navigating university for the first time.
</p>
```

- [ ] **Step 3: Verify in browser**

Hard-refresh. Hero stats should read the correct updated numbers.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: update hero stats and description for expanded content"
```

---

## Task 9: Final browser verification

No file changes — this is a full manual walkthrough.

- [ ] Hard-refresh `http://localhost:8080/index.html`
- [ ] No errors in DevTools Console
- [ ] Theme toggle switches dark ↔ light cleanly; all new sections respect CSS variables
- [ ] All 10 portal tabs open and display their cards correctly; hover states animate
- [ ] Freshmen checklist still visible and correct
- [ ] Clubs & Societies section:
  - All 7 filter tabs work; card count updates
  - Arrow key navigation on filter tabs works
  - Club cards show tag, name, description, Instagram pill
  - Club cards animate in on scroll (scroll reveal)
  - Cards respect dark/light theme
- [ ] Search:
  - Searching "choir" returns NTU Choir with `CLUB` badge
  - Searching "vpn" returns NTU VPN portal result
  - Searching "bus" returns Campus Shuttle
  - Closing search results on outside click still works
- [ ] Responsive: narrow browser to 375px width:
  - Portal tab row scrolls horizontally
  - Club filter tab row scrolls horizontally
  - Clubs grid collapses to single column
  - Hero stats hide (≤600px)
- [ ] Direct access row and footer unchanged
