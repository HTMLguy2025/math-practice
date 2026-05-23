# Version 2.2.0

## New pages

- **Graphs** — `graphs.html` with five exercise types navigable from the matching level:
  - **Bar Graphs** — Vertical bar chart with y-axis label, colored bars, and a highlighted pink bar for single-category questions (Level 2)
  - **Picture Graphs** — Emoji symbol rows with a title, column count labels, and a highlighted pink category label (Level 2)
  - **Scaled Bar Graphs** — Same as bar graphs but values are multiples of 2, 3, 4, or 5; scale shown on y-axis (Level 3)
  - **Scaled Picture Graphs** — Same as picture graphs but each symbol represents multiple items; scale shown in key row (Level 3)
  - **Pie Graphs** — Percentage-based questions; raw integer counts displayed inside slices (each count × 5 = its percentage); 20 tick marks around the circumference at every 5% interval; exploded highlighted slice; legend on the right (Level 4)

## Graph question types

- "How many [items] does [category] have?" — reads one bar/row/slice
- "Which category has the most/fewest?" — comparison across all categories
- "How many more does A have than B?" — difference between two values
- "How many in A and B combined?" — sum of two values
- Pie-specific: "What percentage of [items] does [category] represent?", "What percentage more does A have than B?", "What percentage do A and B make up combined?"

## Graph design

- SCENARIOS system: each scenario owns a `yLabel`, `xLabel`, emoji, category list, and natural-language sentence templates so question text reads naturally (e.g., "How many goals did Cal score?" rather than "How many of category A?")
- Full category names used in questions; short names kept on graph axes
- Bar graph: rotated y-axis label, x-axis label, colored bars, pink highlight
- Picture graph: scenario title row, per-column count labels above symbols, pink category highlight

## Other changes

- **Place Value** — Hundreds, Tens & Ones exercise now always asks for the raw digit in a named place (e.g., "What digit is in the tens place?"), consistent with the Tens & Ones exercise
- **Place Value** — Removed "Multiples of 10" exercise from Level 1

---
