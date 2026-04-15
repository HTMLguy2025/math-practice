# Page Plan

## Overview

Different exercises require fundamentally different interaction models.
Rather than one page per exercise, exercises are grouped by *how the student interacts with them*.
Each page template handles a category of exercises, driven by URL parameters.

---

## Page Templates

---

### 1. `practice.html` — Numeric Answer (already exists)

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

### 2. `choice.html` — Multiple Choice

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

### 3. `numberline.html` — Number Line

**Interaction:** A number line is displayed. Student drags a marker or clicks a position to place an answer, or types a number to identify what the marker points to.

**Used by:**
- Ordering numbers on a number line (Level 1)
- Fractions on a number line (Level 3)
- Negative numbers on a number line (Level 5)
- Counting forward/backward (Level 1)

**Layout:**
- SVG or canvas number line, horizontal, centered
- Labeled tick marks (scale adjusts per exercise)
- Draggable point or clickable region
- "What number is this?" or "Place X on the number line" prompt
- Confirm button

**URL params:** `?exercise=fractions` or `?exercise=negative`

**Notes:**
- Scale and range need to be configurable per exercise type
- Fraction mode needs fraction labels (1/2, 1/4, etc.) on tick marks
- Snap-to-tick behavior for ease of use on touch

---

### 4. `clock.html` — Clock Face

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

### 5. `money.html` — Counting Money

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

### 6. `fractions.html` — Fraction Input / Fraction Problems

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

### 7. `rounding.html` — Rounding

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

### 8. `placevalue.html` — Place Value

**Interaction:** A number is shown. Student identifies a specific digit's place value, or fills in a place value chart.

**Used by:**
- Tens & Ones (Level 1)
- Multiples of 10 (Level 1)
- Hundreds, Tens, Ones (Level 2)

**Layout:**
- A number displayed large
- Place value chart (columns labeled: Hundreds | Tens | Ones)
- Highlighted digit with question: "What is the value of the underlined digit?"
- Multiple choice or numeric input

**URL params:** `?exercise=tens-ones` or `?exercise=hundreds`

---

### 9. `geometry.html` — Geometry / Visual

**Interaction:** A shape or diagram is shown. Student identifies, measures, or classifies it.

**Used by:**
- Angle Measurement (Level 4) — read a protractor
- Lines & Rays (Level 4) — identify from diagram
- Symmetry (Level 4) — identify line of symmetry
- Area & Perimeter (Level 3, 4) — given dimensions, calculate
- Volume (Level 5) — given a rectangular prism, calculate
- Classifying 2D Shapes (Level 5)
- Coordinate Planes (Level 5)

**Layout:**
- SVG diagram centered at top (shape, angle, grid, etc.)
- Question below
- Input method varies by exercise:
  - Numeric entry (area, perimeter, volume)
  - Multiple choice (classify, identify)
  - Click on diagram (symmetry line, coordinate point)

**URL params:** `?exercise=area-perimeter` or `?exercise=angles` etc.

**Notes:**
- This is the most complex template — diagrams need to be randomly generated
- Coordinate plane mode needs a clickable grid
- May be worth splitting into sub-templates if complexity gets too high

---

### 10. `graphs.html` — Data / Graphs

**Interaction:** A bar graph or picture graph is displayed. Student answers questions about the data.

**Used by:**
- Bar Graphs (Level 2)
- Picture Graphs (Level 2)
- Scaled Bar Graphs (Level 3)
- Scaled Picture Graphs (Level 3)

**Layout:**
- SVG graph rendered at top (randomly generated data)
- Question below (e.g., "How many apples were sold on Tuesday?")
- Numeric input or multiple choice answer

**URL params:** `?type=bar&scaled=false` or `?type=picture&scaled=true`

---

### 11. `pemdas.html` — Order of Operations

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
