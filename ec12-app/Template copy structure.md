# EC12 Email Templates — Copy Structure Guide

This document is your starting point for writing and editing email template files.
It explains how to structure the content, how to use field placeholders,
and what makes each section appear or not appear in the final draft.

---

## The two-layer system

There are two separate things that work together to produce an email draft:

**1. The template file (your job)**
A `.docx` file in the `0. Copy Templates` folder on Google Drive.
This is where all the actual writing lives — the tone, the sentences, the hotel descriptions.
You write it in plain language. You do not need to know anything technical.

**2. The logic layer (developer's job)**
A separate config file in the codebase that says:
- Which section appears for which type of artist
- Which `{{field}}` placeholder maps to which piece of data in Monday.com
- What conditions apply (e.g. "only show soundcheck section for live acts")

You never touch the logic layer. If a new condition is needed, ask the developer to add it.

---

## File naming

One template file per stage. Hotels, transfers, and angel content are universal and shared across all stages.

| File | Purpose |
|---|---|
| `Hotels.docx` | All hotel descriptions — used by all stages |
| `Transfers.docx` | Ground transfer content and timing guidelines |
| `Angel.docx` | Guest liaison / angel explanation |
| `Mainstage.docx` | Mainstage-specific content (catering, DR, contacts) |
| `Hangar.docx` | Hangar-specific content |
| `Backyard.docx` | Backyard-specific content |
| `BOOHA.docx` | BOOHA-specific content |
| `Hideout.docx` | Hideout-specific content |
| `The Beach.docx` | The Beach-specific content |
| `Ping Pong Stage.docx` | Ping Pong Stage-specific content |
| `Stables.docx` | Stables-specific content |

---

## Section structure

Each file is divided into named sections. A section is just a **bold heading** followed by the body text.

The heading name tells the system what this block is called.
The body is what gets included in the email.

**Example:**

---
**Hotel intro**

Cluj is a relatively small city with a limited but carefully selected range of hotel partners. We've built strong relationships with each property to ensure fast turnarounds and the standard of care our artists expect.

---
**Radisson Blu**

Radisson Blu Hotel overlooks one of the oldest recreational public gardens in Europe.
Check-in: {{hotel checkin time}} | Check-out: {{hotel checkout time}}
Breakfast: {{breakfast info}}

---

The heading names must match exactly what the developer has registered in the logic layer.
If you rename a heading, tell the developer so they can update the mapping.

---

## Field placeholders

Anywhere you want live data from Monday.com to appear, use double curly brackets:
`{{field name}}`

Write them exactly as listed below — spelling and spacing matter.
The system replaces them automatically when generating a draft.

### Artist & show

| Placeholder | What it inserts |
|---|---|
| `{{artist name}}` | The artist's name |
| `{{act type}}` | Live / DJ |
| `{{stage}}` | Stage name (e.g. Hangar) |
| `{{show date}}` | Date of performance |
| `{{show time}}` | Show start time |
| `{{show end time}}` | Show end time |
| `{{soundcheck time}}` | Soundcheck start time (live acts) |
| `{{soundcheck duration}}` | Soundcheck length in minutes |
| `{{line check time}}` | Line check time (DJs) |
| `{{load in time}}` | Load-in start time |
| `{{load in duration}}` | Load-in duration in minutes |

### Contacts

| Placeholder | What it inserts |
|---|---|
| `{{advancing contact name}}` | Name of the advancing contact (TM, production, etc.) |
| `{{advancing contact role}}` | Their role / job title |
| `{{dos contact name}}` | Day of show contact name |
| `{{angel name}}` | Allocated angel's name |
| `{{angel phone}}` | Allocated angel's phone number |
| `{{backstage contact name}}` | Backstage manager or stage manager name |
| `{{backstage contact phone}}` | Their phone number |
| `{{transport coordinator phone}}` | Transport coordinator contact |

### Party size

| Placeholder | What it inserts |
|---|---|
| `{{party size}}` | Total A-party headcount |
| `{{crew size}}` | Crew headcount |
| `{{room count}}` | Number of hotel rooms allocated |
| `{{festival nights covered}}` | How many nights the festival covers |

### Hotel & accommodation

| Placeholder | What it inserts |
|---|---|
| `{{a-party hotel}}` | Hotel name for artist / management |
| `{{crew hotel}}` | Hotel name for crew |
| `{{check-in date}}` | Hotel check-in date |
| `{{check-out date}}` | Hotel check-out date |
| `{{hotel checkin time}}` | Hotel's standard check-in time |
| `{{hotel checkout time}}` | Hotel's standard check-out time |
| `{{breakfast info}}` | Breakfast availability and times |

### Travel

| Placeholder | What it inserts |
|---|---|
| `{{travel mode}}` | Flying / Nightliner / Self-driving / Mixed |
| `{{arrival flight}}` | Arrival flight number |
| `{{arrival date}}` | Arrival date |
| `{{arrival time}}` | Arrival time at CLJ |
| `{{departure flight}}` | Departure flight number |
| `{{departure date}}` | Departure date |
| `{{departure time}}` | Departure time |
| `{{nightliner reg}}` | Nightliner registration number(s) |

### Ground transfers

| Placeholder | What it inserts |
|---|---|
| `{{airport to hotel pickup}}` | Pickup time from airport to hotel |
| `{{hotel to soundcheck pickup}}` | Hotel pickup time for soundcheck (live acts) |
| `{{hotel to show pickup}}` | Hotel pickup time for show |
| `{{hotel to airport pickup}}` | Hotel pickup time for airport drop-off |
| `{{festival gate}}` | Festival entry gate for this stage |

### Stage-specific

| Placeholder | What it inserts |
|---|---|
| `{{catering type}}` | Type of catering at this stage (full service / self-serve / etc.) |
| `{{dressing room details}}` | Dressing room info or lounge details |
| `{{bar type}}` | Whether there's a bar or self-serve fridge |

---

## Conditional sections — how they work

Some sections only appear for certain types of artists. You do not control this in the template file — the logic layer handles it. But you should be aware of the main conditions so you write the right content in each section.

| Section heading | Appears when |
|---|---|
| Soundcheck | Artist is a **live act** |
| Line check | Artist is a **DJ** |
| Load in | Artist is a **live act** |
| Flights | Artist is **flying** |
| Nightliner | Artist is **on a nightliner** |
| Own vehicle | Artist is **self-driving** |
| Truck drivers | Artist has **a truck / cargo vehicle** |
| Crew hotel | Artist has a **separate crew hotel** |
| Shuttles | Only used when no dedicated vehicle is offered |

If you want to add a new conditional section, write the content and agree with the developer what condition triggers it. They register it in the logic layer.

---

## Missing data — how the tool handles it

When the tool generates a draft, it checks the status of each data field:

- **Confirmed** — the field fills in automatically with the real value
- **Asked but not answered** — the section is rewritten as a polite chase, referencing that it was already requested
- **Not yet asked** — the section is written as a first-time request

You write the content assuming data is confirmed. The tool adapts the phrasing for the other two states automatically. You do not need to write three versions of every paragraph.

---

## Tips for writing template content

- Write in the EC hospitality tone — warm, professional, informative but not corporate
- Use `{{field}}` placeholders wherever a piece of information would normally be typed manually
- If a section references data that might not be confirmed yet, still write it as if confirmed — the tool handles the alternative phrasing
- Keep section headings consistent — any rename must be flagged to the developer
- Don't leave template-specific notes or comments inside the body text — use a separate document for that
- When in doubt about whether something should be a `{{field}}` or fixed text, ask: "does this change per artist?" If yes, make it a field

---

## What to build first

Start with `Hotels.docx` — it's universal and high-impact. Use the existing Word document as your source and restructure it using the format above:

1. Bold heading = section name (e.g. **Radisson Blu**)
2. Body = the hotel description, with `{{field}}` placeholders where specific data appears
3. Repeat for each hotel

Then move to stage-specific files, starting with `Mainstage.docx`.
