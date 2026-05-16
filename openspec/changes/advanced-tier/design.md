# Technical Design

## Frontend Component
- `TierCard` component: displays tier name, price, and feature list
- Three cards rendered side by side on the dashboard
- Active/selected card is highlighted with a border
- "Change" button disabled (greyed out) if `bookingLocked === true`

## Data Model
- Add `tierPricing` config object (budget: £X, standard: £Y, premium: £Z) — static config, not DB
- Add `bookingLocked` boolean field to artist record (default: false)
- Existing `accommodationTier` field stores the selection

## Logic
- If `bookingLocked` is true: disable tier change button, show tooltip "Hotel booking confirmed — contact your advancing manager to change tier"
- On tier change: update `accommodationTier` in artist record, send notification email
- Email recipient: advancing team address (from config)

## Email notification
- Trigger: artist changes their tier
- Content: artist name, old tier, new tier, timestamp
- Sender: system email (from config)

## Testing
- Unit test: TierCard renders correctly for each tier
- Unit test: change button disabled when bookingLocked
- Integration test: tier change updates record and triggers email
- Manual smoke test: full flow on dashboard
