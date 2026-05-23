# Page Plan

## Overview

Different exercises require fundamentally different interaction models.
Rather than one page per exercise, exercises are grouped by *how the student interacts with them*.
Each page template handles a category of exercises, driven by URL parameters.

---

## Status Summary

| Page             | Status        |
|------------------|---------------|
| `practice.html`  | ✅ Complete   |
| `choice.html`    | ✅ Complete   |
| `fractions.html` | ✅ Complete   |
| `conversions.html` | ✅ Complete (not in original plan) |
| `clock.html`     | ✅ Complete   |
| `money.html`     | ✅ Complete (count mode only; make mode not started) |
| `numberline.html`| ✅ Complete   |
| `rounding.html`  | ✅ Complete   |
| `placevalue.html`| ✅ Complete   |
| `geometry.html`  | ✅ Complete   |
| `graphs.html`    | ✅ Complete   |
| `pemdas.html`    | ✅ Complete (steps mode not implemented) |

---

## Page Templates

---

### 1. `practice.html` — Numeric Answer ✅ Complete

**Interaction:** Student enters a number using on-screen or keyboard input.

**Used by:**
- Simple Operations: Addition, Subtraction, Multiplication, Division (all digit levels)

**Layout:**
- Vertical problem display (top number, operator, bottom number, line)
- Number pad (0–9, decimal, negative, delete)
- Check button — auto-submits on correct answer
- Previous question display
- Score tracker

**URL params:** `?mode=multiply&digits=2`

---

### 2. `choice.html` — Multiple Choice ✅ Complete

**Interaction:** Student reads a question and picks from 2–4 answer buttons.

**Used by:**
- Odd & Even (Level 1, 2)
- Comparing numbers: Two-Digit (Level 1), Three-Digit (Level 2)
- Prime & Composite (Level 4)
- 2D Shapes (Level 1)
- Factors & Multiples (Level 4) — identify which is a factor/multiple

**Layout:**
- Question text displayed large at top
- 2–4 large answer buttons below (arranged in a 2x2 grid or row)
- No typing — just click
- Correct/wrong feedback on button (color flash), then next question
- Score tracker

**URL params:** `?exercise=oddeven` or `?exercise=prime-composite`

**Notes:**
- Answer buttons need a brief color flash (green/red) before advancing
- Wrong answer should not immediately advance — let the student try again or show the answer after N attempts

---

### 3. `numberline.html` — Number Line ✅ Complete

**Interaction:** A number line SVG is shown. Student types the marked value using the number pad, or selects from multiple choice (fractions mode).

**Exercises**

| Exercise | URL param | Input | Level |
|---|---|---|---|
| Whole number identification | `?exercise=ordering` | Numeric | 1 |
| Counting forward (missing number) | `?exercise=count-forward` | Numeric | 1 |
| Counting backward (missing number) | `?exercise=count-backward` | Numeric | 1 |
| Count from any number (hop arrows) | `?exercise=count-from` | Numeric | 1 |
| Fractions on a number line | `?exercise=fractions` | Multiple choice | 3 |
| Negative numbers | `?exercise=negative` | Numeric (± button) | 5 |

Multiple exercises can be mixed: `?exercise=count-forward,count-backward`

**SVG approach:**
- Wide landscape SVG (320×90 viewBox, max 360px rendered width)
- `ordering` / `negative`: full integer line, labels every 5, pink dot at marked value
- `count-forward` / `count-backward`: 5-value sequence, missing value shown as pink "?" above the line
- `count-from`: segment around start→answer, blue hop arrows above line, green dot at start / pink dot at answer
- `fractions`: 0–1 line, ticks at 1/denom intervals, fraction labels (auto-simplified), pink dot
- Denominators: 2, 3, 4, 6, 8; answer as multiple choice from same/mixed denominator pool

---

### 4. `clock.html` — Clock Face ✅ Complete

**Interaction:** A clock face is shown. Student answers what time it shows, or the student is told a time and drags hands to set it.

**Used by:**
- Time to Hour / Half Hour (Level 1)
- Time to 5 Minutes (Level 2)
- Elapsed Time (Level 3)

**Layout:**
- Large analog clock SVG, centered
- Mode A ("What time is it?"): Read the clock → type or select time
- Mode B ("Set the clock"): Drag hands to show given time
- Elapsed mode: Two clocks (start time, end time) — answer how much time passed

**URL params:** `?mode=read&precision=hour` or `?mode=set&precision=5min` or `?mode=elapsed`

---

### 5. `money.html` — Counting Money ✅ Complete

**Interaction:** Coins and bills displayed. Student enters total value or selects correct amount.

**Used by:**
- Counting Money (Level 2)

**Layout:**
- Images of coins/bills shown in a group
- Student types total value (e.g., "$1.35") using number pad
- OR: Student is given an amount and selects which coins make it up (drag/tap coins)

**URL params:** `?mode=count` or `?mode=make`

**Notes:**
- Use SVG or PNG coin/bill images
- Handle cents formatting carefully

---

### 6. `fractions.html` — Fraction Input / Fraction Problems ✅ Complete

**Interaction:** Student enters a fraction (numerator and denominator separately), or selects from choices.

**Used by:**
- Halves / Thirds / Fourths / Sixths / Eighths (Level 3)
- Equivalent fractions (Level 4)
- Add / Subtract fractions with like denominators (Level 4)
- Mixed numbers and improper fractions (Level 4)
- Add / Subtract with unlike denominators (Level 5)
- Multiply fractions (Level 5)
- Divide fractions (Level 5)

**Layout:**
- Problem displayed as a proper fraction layout (stacked numerator/denominator with line)
- Two separate input fields: numerator box and denominator box
- Tab or arrow key moves between fields
- Check button

**URL params:** `?exercise=add-like` or `?exercise=equivalent` etc.

**Notes:**
- Mixed number mode needs a whole number field + fraction field
- Visual fraction bar (shaded rectangle) could optionally appear for Level 3 simpler exercises

---

### 7. `rounding.html` — Rounding ✅ Complete

**Interaction:** Student sees a number and must round it to the nearest 10 or 100. Enters answer with number pad.

**Used by:**
- To Nearest 10 (Level 3)
- To Nearest 100 (Level 3)

**Layout:**
- Question: "Round 347 to the nearest 10"
- Large number display
- Number pad input (same as practice.html)

**URL params:** `?precision=10` or `?precision=100`

**Notes:**
- Could share the same page as practice.html with a special mode, but the question format is different enough to warrant its own template

---

### 8. `placevalue.html` — Place Value ✅ Complete

**Interaction:** A place value chart shows a number with one digit highlighted in pink. Student picks from 4 choices.

| Exercise | URL param | Level |
|---|---|---|
| Tens & Ones | `?exercise=tens-ones` | 1 |
| Multiples of 10 | `?exercise=multiples-of-10` | 1 |
| Hundreds, Tens & Ones | `?exercise=hundreds-tens-ones` | 2 |

**Question types (mixed randomly per question):**
- `tens-ones` / `hundreds-tens-ones`: "What is the **value** of the pink digit?" or "What **place** is the pink digit in?"
- `multiples-of-10`: "How many tens are in N?" (chart view) or "What number equals N tens?" (prompt view)

**Display:** Inline-flex place value chart — each column shows a large digit with its place label (Ones / Tens / Hundreds). The highlighted cell turns pink with an underline.

---

### 9. `geometry.html` — Geometry / Visual ✅ Complete

**Interaction:** A shape or diagram is shown. Student identifies, measures, or classifies it.

---

#### Exercises

| Exercise | URL param | Input method | Level | Status |
|---|---|---|---|---|
| Area — Triangle | `?exercise=area-triangle` | Numeric | 4 | ✅ |
| Area — Square | `?exercise=area-square` | Numeric | 4 | ✅ |
| Area — Rectangle | `?exercise=area-rectangle` | Numeric | 4 | ✅ |
| Area — Circle | `?exercise=area-circle` | Numeric | 4 | ✅ |
| Perimeter — Triangle | `?exercise=perimeter-triangle` | Numeric | 4 | ✅ |
| Perimeter — Square | `?exercise=perimeter-square` | Numeric | 4 | ✅ |
| Perimeter — Rectangle | `?exercise=perimeter-rectangle` | Numeric | 4 | ✅ |
| Circumference — Circle | `?exercise=perimeter-circle` | Numeric | 4 | ✅ |
| Angle Measurement | `?exercise=angles` | Multiple choice | 4 | ✅ |
| Symmetry | `?exercise=symmetry` | Multiple choice | 4 | ✅ |
| Classifying 2D Shapes | `?exercise=classify-shapes` | Multiple choice | 4 | ✅ |
| Volume | `?exercise=volume` | Numeric | 5 | ✅ |
| Coordinate Planes | `?exercise=coordinates` | Two numeric inputs (x, y) | 5 | ✅ |

Multiple exercises can be mixed by comma-separating params: `?exercise=area-triangle,area-square`

---

#### SVG generation — as built

- **Area / Perimeter** — Each shape is its own exercise. SVG shows the shape with labeled dimensions. Triangles use an even base to guarantee integer area; circles use π ≈ 3.14 with rounding. Triangle sides minimum 5 units.
  - Shapes: triangle (labeled base + height), square, rectangle, circle (labeled radius)
  - Right-angle marker drawn on right triangles
  - For perimeter-circle the question says "circumference" and uses C = 2πr

- **Angle Measurement** — Two rays from a common vertex with a degree arc. Angle range 15°–165°, excluding 83°–97° to avoid trivial 90° guesses. Four multiple-choice options with nearby decoys.

- **Symmetry** — Polygon drawn from a fixed set: equilateral triangle, isosceles triangle, scalene triangle, right triangle, rectangle, square. Asks "How many lines of symmetry?" Interior angle in degrees labeled at every vertex.

- **Classifying 2D Shapes** — Reuses the same polygon SVG as symmetry. Two question modes alternated randomly: name by side count (triangle / quadrilateral / …) or classify a triangle by sides (equilateral / isosceles / scalene / right).

- **Volume** — Rectangular prism in isometric projection (three visible parallelogram faces). Dimensions labeled l, w, h (integers 2–9). Student computes l × w × h.

- **Coordinate Planes** — 10×10 grid (x: −5 to 5, y: −5 to 5) with labeled axes and arrowheads. A pink dot is plotted at a random non-origin integer coordinate. Student types x then y in two separate input boxes; Tab / arrow keys switch focus. On desktop (≥600px) the grid and input pad sit side-by-side so neither is off-screen.

---

#### Notes / deviations from original plan

- Lines & Rays exercise was cut — not added.
- Area & Perimeter were split into fully separate exercises rather than a two-sub-question flow on one SVG.
- Coordinate Planes: read-mode only (student reads the plotted point). Click-to-place mode not implemented.

---

### 10. `graphs.html` — Data / Graphs ✅ Complete

**Interaction:** A bar graph or picture graph is shown with randomly generated data. Student picks from 4 multiple-choice answers.

| Exercise | URL param | Level |
|---|---|---|
| Bar Graphs | `?type=bar` | 2 |
| Picture Graphs | `?type=picture` | 2 |
| Scaled Bar Graphs | `?type=bar&scaled=true` | 3 |
| Scaled Picture Graphs | `?type=picture&scaled=true` | 3 |
| Pie Graphs | `?type=pie` | 4 |

Multiple types can be mixed: `?type=bar,picture`

**Question types (mixed randomly):**
- "How many [items] are shown for [category]?" — reads one bar/row
- "Which category has the most/fewest [items]?" — comparison across all bars
- "How many more does A have than B?" — difference between two bars
- "How many in A and B combined?" — sum of two bars

**SVG approach:**
- Bar graph: viewBox 400×220, plot area x=50–380 y=10–170, colored bars with y-axis grid lines and tick labels. Highlighted bar turns pink for "how many" questions.
- Picture graph: one row per category, emoji symbols spaced in a grid, key row at bottom showing scale. Highlighted row has pink label.
- Unscaled (Level 2): each value is a whole number 1–8. Scale = 1 (each symbol = 1).
- Scaled (Level 3): each value is a multiple of 2, 3, 4, or 5. Scale shown in picture graph key.
- Decoys for numeric answers: nearby multiples of the scale value. Decoys for category answers: the other category names.
- **Pie graph**: Percentage-based questions. Values are generated as unique multiples of 5 summing to 100 (so each value is directly a whole-number percentage). Percentage labels drawn inside each slice. Highlighted slice explodes outward. Legend on the right shows full category names. Four question types: "What percentage did X represent?", "Which category had the most/least?", "What percentage more did X have than Y?", "What percentage did X and Y make up combined?" Decoys are ±5/10/15/20% from the correct answer.

---

### 11. `pemdas.html` — Order of Operations ✅ Complete

**Interaction:** Student is shown a multi-step equation and enters the answer.

**Used by:**
- Long Equations / PEMDAS (Level 5)

**Layout:**
- Equation displayed horizontally in large text
- Number pad for numeric answer
- Optionally: step-by-step mode showing intermediate results

**URL params:** `?steps=true` or `?steps=false`

---

## Implementation Priority

| Priority | Page             | Reason                                         |
|----------|------------------|------------------------------------------------|
| 1        | `choice.html`    | Simple to build, covers many exercises         |
| 2        | `rounding.html`  | Close to practice.html, small extension        |
| 3        | `fractions.html` | High coverage across Levels 3–5                |
| 4        | `placevalue.html`| Good early-grade coverage                      |
| 5        | `numberline.html`| Moderate complexity, high educational value    |
| 6        | `clock.html`     | Self-contained, needed for Levels 1–3          |
| 7        | `geometry.html`  | High complexity — SVG generation required      |
| 8        | `graphs.html`    | Moderate complexity — chart generation         |
| 9        | `money.html`     | Moderate complexity — image assets needed      |
| 10       | `pemdas.html`    | Equation parser required                       |
