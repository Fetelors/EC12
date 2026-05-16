# Technical Design

## Architecture
Simple form field addition following existing patterns in the artist intake form.

## Database / Storage
- Add `accommodationTier` field to artist record
- Values: 'budget', 'standard', 'premium'
- Default: 'standard'

## Frontend
- Add dropdown select on intake form
- Label: "Accommodation Preference"
- Options: Budget, Standard, Premium

## API / Data Layer
- Include tier in artist GET response
- Accept tier in artist PATCH/update request

## Testing
- Unit test for tier validation
- Integration test for form submission
- Manual smoke test: submit form, verify saved value appears in summary
