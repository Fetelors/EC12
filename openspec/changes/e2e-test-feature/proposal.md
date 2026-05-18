# E2E Test Feature: Artist Notes Field

## What are we building?
A free-text notes field on the artist record for the advancing team to log internal notes.

## Why?
The team currently uses a separate spreadsheet for notes, causing version drift. Centralising notes in the portal saves time and reduces errors.

## Scope
- Add a notes textarea to the artist detail view
- Notes are saved per-artist to the data layer
- Notes are visible only to logged-in advancing team (not the artist portal)

## Success Criteria
- Notes field visible in artist detail view
- Text saved on blur / explicit save button
- Notes persist across page reloads
