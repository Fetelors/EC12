# Technical Design

## Frontend
- Textarea component in artist detail drawer/view
- Auto-save on blur (debounced 500ms) with visual save indicator
- Read-only in artist-facing itinerary view

## Data Model
- Add `internalNotes` string field to artist record (default: empty string)

## Logic
- Save notes to data layer on change
- No character limit (long-form notes expected)

## Testing
- Unit test: textarea renders with existing notes
- Unit test: save triggers on blur
- Integration test: notes persist after page reload
