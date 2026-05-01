# EC12 Build Session Summary
**Last updated:** 2026-04-30
**Latest commit:** f7b5e80 (pushed to GitHub)

---

## What exists right now

### Main portal
**File:** `src/portal/index.html` (~1,740 lines, single self-contained HTML)
**Open in Chrome** from Finder — no server needed.

**Why single file:** Babel standalone uses XHR to load external JSX, which Chrome blocks on `file://`. All JSX is inlined as `<script type="text/babel">` blocks.

### Seven views

| Route | View | Notes |
|---|---|---|
| `#welcome` | Landing page | Default. No top nav. Stats + view-card grid |
| `#tracker` | Artist Tracker | Full pipeline table, 8 steps, filters, search, drawer |
| `#email` | Email Draft Center | Cadence selector, auto-draft, copy button |
| `#timeline` | General Timeline | Foldable Gantt: in-town + show-day by stage |
| `#schedule` | Stage Schedule | Visual timetable per day/stage. Google Sheets sync UI ready, not wired |
| `#flights` | Flights & Transfers | Flight manifest + Arrival/Internal/Departure transfer filter |
| `#itinerary` | Artist Itinerary | Passcode gate (PIN: 4827 for demo) |
| `#settings` | Settings | Field mapping, templates, team, brand, integrations |

### Supporting files
- `src/portal/data.js` — 14 mock artists, 8 stages, 7 hotels, 8 angels (used while Monday.com is not connected)
- `src/portal/i18n.js` — EN/RO translations + `window.makeT()` helper
- `src/shared/theme.css` — full design system
- `src/shared/monday-client.js` — Monday.com GraphQL API client (four-state logic)
- `config/monday-columns.js` — board + column IDs (all placeholders — fill once boards are live)

### Project root (legacy/reference)
- `EC12 - Program.xlsx` — festival schedule (3 sheets)
- `EC12_Change_Plan_1777576221.xlsx` — user stories by persona
- `Schedule_later version code.gs` — Google Apps Script backend for schedule
- `Schedule_later version html` — enhanced schedule viewer (v5b)

---

## Design system

- **Background:** Lava lamp (SVG metaball filter + 7 JS blobs)
  - Settles after 10 s to 8% amplitude (3 s ease)
  - Gentle cursor pull when settled
- **Fonts:** General Sans (display), Geist (body), Geist Mono (mono)
- **Palette:** `#f5f3ee` canvas, teal/lime/blue accents, amber = warning, red = needed
- **Status:** confirmed (teal) / partial (blue) / pending (amber) / needed (red) / idle (grey)
- **Tweaks panel:** bottom-right float — language, blob, dark mode, accent colours

---

## Next to build (in priority order)

1. **User permissions system** — 4 levels: Owner / Admin / User / Viewer
   - Login screen for protected views
   - Role-based view rendering

2. **Team views** (password-protected per role):
   - Angel: assigned artists' timings + info
   - Driver: transfer assignments + delayed flights
   - Backstage: stage-level arrivals + advancing notes
   - Riders coordinator: rider requirements + alternatives

3. **Itinerary enhancement:**
   - Passkey = Monday item ID (artist or travel party member)
   - Travel party member level shows personal + adjacent band info

4. **Stage Schedule → Google Sheets sync:**
   - Wire up the "Sync Sheet" button to the Apps Script web app endpoint
   - Configure URL in Settings → Integrations
   - Existing backend: `Schedule_later version code.gs`

5. **Fill Monday.com column IDs** once boards exist (run the query in `config/get-columns.graphql`)

---

## Deferred (do not start until full infrastructure confirmed)

- Partial state logic for travel (segment passenger sum vs party size)
- Partial state logic for transfers (route types by flight timing + act type)
- Email Draft Center .docx template reading (mammoth.js + File System Access API)
- Control Panel (stage category → downstream rules)
- Config/Mapping page ({{field}} → Monday column translator)
- Hosting / deployment

---

## How to continue in a new session

1. Open `src/portal/index.html` in Chrome to see current state
2. Read `MEMORY.md` in the Claude memory folder — all decisions indexed there
3. Check `EC12_Change_Plan_1777576221.xlsx` for full user stories by persona
4. Start with whichever "Next to build" item the user prioritises
