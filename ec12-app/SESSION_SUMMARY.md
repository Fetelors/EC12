# EC12 Build Session — Summary
**Date:** 2026-04-30
**Status:** Artist Tracker v2 committed. Moving to Email Draft Center next.

---

## What was built

### Shared infrastructure
| File | Purpose |
|---|---|
| `src/shared/monday-client.js` | Single Monday.com API client used by all components. Handles fetch, write, column parsing, and the four-state (not_asked / asked / partial / confirmed) tracking logic |
| `src/shared/theme.css` | Full design system: Inter + Barlow Condensed fonts, brand palette (dark/stormy teal, plum, amber, sage), neon status colours (pink/gold/green), all component tokens |
| `config/monday-columns.js` | Central map of every Monday.com board ID and column ID — fill this in once boards are set up |
| `config/get-columns.graphql` | GraphQL query to run in Monday.com API Explorer to find column IDs |

### Artist Tracker (`src/artist-overview/index.html`)
- Pipeline table showing all artists with tier, origin, lead, booked by
- 8 advancing step dots (neon colour-coded: idle / asked / partial / confirmed / blocked)
- Advanced filter panel with dimensions auto-built from data: Travel Mode, Flights, Transfers, Hotel, Party Size, Rider, Dietary, TM Contact
- Four-state filter per dimension: `○ Not requested` / `~ Asked` / `◑ Partial` / `✓ Confirmed`
- Active filter chips with clear-all
- Artist detail panel (slide-in): full action checklist per step, three-state per action
- Create artist modal → writes to Monday.com + adds locally immediately
- Settings panel: API key, board ID, workspace URL
- Falls back to demo data (6 mock artists) when not connected
- First git commit: `4494c9b`

### Claude Code config (`.claude/`)
| File | Purpose |
|---|---|
| `settings.json` | Pre-approved permissions for ec12-app read/write/git |
| `commands/ec12-commit.md` | `/ec12-commit` — guided git commit scoped to ec12-app |
| `commands/ec12-memory.md` | `/ec12-memory` — review conversation, decide what to save |
| `commands/ec12-monday.md` | `/ec12-monday` — walk through Monday.com column ID setup |

---

## Key decisions made

| Decision | Detail |
|---|---|
| Monday.com = single source of truth | All 5 components read/write to Monday. No separate database. |
| Four-state system | not_asked → asked → partial → confirmed (+ blocked as override) |
| Partial for travel | Deferred — sum of travel segment passengers vs total party size |
| Partial for transfers | Deferred — route types required depend on flight timing + act type (live needs soundcheck route) |
| Hosting | Not decided yet — deferred |
| Font | Inter (UI) + Barlow Condensed (logo only) |
| Status colours | Neon: pink = needed, gold = asked, dry sage = partial, green = confirmed |
| Brand colours | Dark teal (nav/surfaces), stormy teal (actions), plum/amber/sage (accents/badges) |

---

## Monday.com boards needed

| Board | Used by |
|---|---|
| Artists | All components — core artist info, status steps |
| Schedule / Programme | Schedule component, Arrivals Board |
| Flights | Arrivals Board, Artist Itinerary, transfer logic |
| Hotels | Artist Itinerary, Arrivals Board |
| Ground Transfers | Arrivals Board, Artist Itinerary |

Column IDs are all placeholders in `config/monday-columns.js` — need to be filled once boards exist.

---

## Components remaining to build

1. **Email Draft Center** — next up
   - Reads artist data from Monday.com
   - Four-state per data field (not_asked / asked / partial / confirmed)
   - Auto-generates email drafts based on what's missing
   - Writes confirmed data back to Monday.com
   - Shares state with Artist Tracker (emailModules key in localStorage)

2. **Schedule** — after Email
   - Reads stage timings, soundchecks from Monday.com programme board
   - Connects to Arrivals Board for transfer timing logic

3. **Arrivals Board** — after Schedule
   - Four views: by stage / by flight / by hotel / by date
   - User stories to be shared by user before building

4. **Artist Itinerary** — after Arrivals
   - Per-artist document shared WITH the artist
   - Generated from Monday.com logistics data

5. **Navigation hub** — last
   - Links all components together

---

## Deferred work (do not start until full infrastructure is confirmed)

- **Partial state logic for travel**: sum of travel segment passengers must equal total party size
- **Partial state logic for transfers**: required route types depend on flight-to-show-time gap and act type (live = needs soundcheck route)
- **Hosting decision**: domain not yet chosen
- **Advanced filter criteria**: user will specify additional filter dimensions once more components exist

---

## How to continue in a new session

1. Read `MEMORY.md` in the Claude memory folder — all key decisions are indexed there
2. Run `/ec12-monday` to configure Monday.com column IDs when ready
3. Next task: build `src/email-draft-center/index.html`
