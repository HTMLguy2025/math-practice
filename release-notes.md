# Version 2.1.0

## New exercises

- **Clock & Time** — Three new exercise modes on `clock.html`:
  - Read the clock to the hour or half hour (Level 1)
  - Read the clock to the nearest 5 minutes (Level 2)
  - Elapsed time: given a start time and an end time, calculate how much time has passed (Level 3)

- **Counting Money** — `money.html` with coin and bill display. Three difficulty tiers via optional modifiers:
  - Coins only (pennies, nickels, dimes, quarters)
  - Include small bills ($1, $5)
  - Include large bills ($10, $20)

- **Money Arithmetic** — Add and subtract dollar amounts directly on `money.html`. Three amount ranges to choose from, each requiring a single choice before starting:
  - Up to $9.99
  - Up to $99.99
  - Up to $999.99

- **Rounding** — `rounding.html` with highlighted hint digits to guide the rounding decision:
  - Round to the nearest 10 (Level 3)
  - Round to the nearest 100 (Level 3)

## Improvements

- Counting Money and Money Arithmetic share a single page; the layout switches automatically between coin display and vertical arithmetic problem depending on the exercise
- Money answer input uses two separate boxes (dollars and cents) with automatic focus switching
- Operation groups with required single-choice options (radio buttons) now work correctly — previously the selected option was not passed through to the exercise
