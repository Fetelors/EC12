# Implementation Tasks

- [ ] Add `bookingLocked` field to artist data model (default: false)
- [ ] Add `tierPricing` static config (budget/standard/premium prices)
- [ ] Build `TierCard` component (name, price, features, selected state)
- [ ] Render three TierCards on artist dashboard
- [ ] Highlight currently selected tier
- [ ] Disable change button when `bookingLocked === true` with tooltip
- [ ] Wire tier change action to update artist record
- [ ] Implement email notification on tier change
- [ ] Write unit tests for TierCard component
- [ ] Write unit test for booking lock logic
- [ ] Write integration test for tier change → email flow
- [ ] Manual smoke test on dashboard
