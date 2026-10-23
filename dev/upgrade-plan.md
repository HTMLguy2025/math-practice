# Upgrade Plan: Daily Points, My Progress, Tutorials, Coaching

**Status: Phases 1 and 2 built (4.0.0, uncommitted). Decisions taken: weekends optional, wrong = 0 points, no migration of old streaks, hints (Phase 4) wanted. Next: Phase 3 (tutorials).**

Target: **4.0.0** (the streak change is breaking). Ship in phases; each phase is a working release.

## What exists today (facts the plan builds on)

- 81 launchable activities across 12 page templates (fractions 22, practice 12, geometry 12, money 9, numberline 5, graphs 5, choice 5, conversions 3, clock 3, rounding 2, placevalue 2, pemdas 1). 15 more are "coming soon".
- Points exist only on the four simple-operation modes (`practice.js`). Streaks are per operation, stored in cookies, and only saved when the player presses Finish.
- The activity list lives inline in `index.html` (`LEVELS`). No other page can read it.
- `mix.js` already watches `#questionsAnswered` / `#questionscorrect` on every page. That same hook can award points everywhere without rewriting 12 pages.
- All data is per browser (cookies / localStorage). No accounts, so progress does not sync between devices.

## Decisions I need from you (my recommendation in bold)

1. **Weekends:** keep the weekday-only streak, but let weekend practice count in the calendar and for bonuses without being required. (Today weekend practice earns nothing.)
2. **Wrong answers:** **0 points**. Alternative: 1 point for trying.
3. **Existing streaks:** **merge into one: take the longest still-alive streak and the best-ever, sum bonuses.** Alternative: start everyone at zero.
4. **Tutorial voice:** **optional read-aloud button (browser speech, no audio files), off by default.** Matters for pre-readers.
5. **Tutorial opens as an overlay on the practice page**, so the player's session and score are not lost. Alternative: separate page.
6. **Phase 4 (coaching hints)** is my reading of "better advice on how to do the problems". Confirm it is wanted.
7. **Progress backup:** **add Export / Import of progress as a file** (browser data can be cleared). Alternative: skip.

## Shared foundation (do first)

**`activities.js` becomes the single registry.** Move the `LEVELS` data out of `index.html`. Each activity gets: a stable key, page, params, label, level, **difficulty tier (1-10)**, and **tutorial topic id**. Points, the calendar breakdown, tutorial links, and the Mix & Match catalog all read it. A dev check script fails if any activity has no tier or no tutorial, so nothing gets missed as activities are added.

## Phase 1: One daily point balance

**Scoring**
- New `points.js` on every exercise page. On each correct answer it looks up the activity's tier and adds points. Wrong answers add nothing. Easier = fewer points, harder = more.
- Starting scale (tune after playtesting). Existing modifiers stay: negatives +1, decimals +2.

| Tier | Examples |
|---|---|
| 1 | counting, odd/even, tens and ones, hour clock, 1-digit add/subtract |
| 2 | skip counting, 5-minute clock, coins, simple graphs, 1-digit multiply/divide |
| 3 | 2-digit add/subtract, rounding, elapsed time, like-denominator fractions, simplify |
| 4 | 2-digit multiply/divide, money add/subtract, fractions on a number line |
| 5 | 3-digit add/subtract, prime/composite, area, perimeter, angles, unlike denominators |
| 6 | 3-digit multiply/divide, converting fractions, pie graphs, coordinates, volume |
| 7-8 | multiply/divide fractions, percent conversions, negatives on a line, PEMDAS, nested fractions |

- With a goal near 50, that is about 50 easy answers or about 8 hard ones, so variety and difficulty both pay off.

**Storage and streak**
- New ledger in `localStorage`: one record per date holding points, answered, correct, the goal in force that day, bonus earned, and a per-activity breakdown. Points are written **on every answer**, not only at Finish, which fixes today's "forgot to press Finish, lost my points" problem.
- One streak. A day counts when points reach the goal. Goal stays 50 plus the streak length, capped at 120. Bonus at goal + 20, once per day.
- Replace the four per-operation streak strips on the launcher with one streak banner: flame, day count, today's progress bar, bonuses.
- Every page shows "Today: N / goal" in the header, and Finish gets the green outline at the goal and the flame at the bonus (today only practice.html does).
- Mix & Match earns points automatically, because embedded pages record to the same ledger (the host must not also record, or it double counts).
- One-time migration of the old cookies per decision 3. `dev-test.js` day offset keeps working for testing.

## Phase 2: My progress

- New `progress.html` linked from the launcher (next to the settings gear or as a card under Levels).
- **Month calendar**, previous/next month buttons. Each day shows points and a status: nothing, started but under the goal, goal met (streak day), bonus (gold with flame), weekend (dimmed), today ringed. Status is also shown with a symbol or text, not color alone.
- Tapping a day opens details: points and goal, correct / answered and accuracy, and the top activities that day.
- Summary row: current streak, best streak, month total, active days, bonuses.
- Each day stores the goal that applied, so old days stay correct when goals change.
- Limitation: history starts on the release date. Old cookies hold only today's number, so the past cannot be backfilled.
- Uses the theme variables; works at phone width.

## Phase 3: Tutorials and links

**Content.** 81 activities collapse into roughly 30-35 topics (for example: counting, number line, odd/even, comparing, place value, telling time, coins, money math, graphs, skip counting, the four operations, negatives, decimals, rounding, fraction basics, adding/subtracting fractions, simplifying, converting, multiplying/dividing fractions, PEMDAS, area, perimeter, angles, symmetry, coordinates, volume, percent conversions, prime/composite). Each is 5-8 short steps.

**Engine** (`tutorial.js`, `tutorial.html?topic=…`). Tutorials are data: a list of steps, each with a caption and a scripted animation.
- Reusable animated visuals: dots and ten-frames, base-ten blocks, a hopping marker on a number line, clock hands that sweep, fraction bars and pizza slices, coin stacks, multiplication arrays, building bar charts, a coordinate grid.
- Controls: play/pause, next/back, replay, speed, step dots. Captions use large, simple words.
- Ends with a **"Your turn"** of 2-3 easy guided questions with instant friendly feedback, then **Start practicing**.
- Respects reduced-motion (steps become static slides). Optional read-aloud per decision 4.

**Links from every activity** (the "all activities link to a tutorial" requirement)
- New `help.js` on every exercise page adds a "How to" button. It works out the activity from the page and URL and looks up its topic in the registry, so no per-page wiring and no activity can be missed (the check script enforces it).
- Launcher: a small "?" on every activity button, a link inside the operation menu, and a **Tutorials** hub grouped by level, with a watched check mark per topic.
- In Mix & Match the host header shows the link for whichever exercise is on screen.

**Order of work.** Build the engine and 4 representative tutorials first (addition with a ten-frame, counting on a number line, telling time, adding fractions). Review those with you before writing the other ~30. Writing the tutorials is the largest part of the whole upgrade.

## Phase 4: Coaching hints (in the moment)

- After a wrong answer, and from an optional Hint button, show a short worked explanation of **that exact question**, in kid-friendly words: "8 + 5: start at 8 and count up 5: 9, 10, 11, 12, 13." It reuses the tutorial visuals.
- Shared `coach.js`; each of the 12 pages calls it from its wrong-answer branch. Tone: encouraging, no red-heavy "wrong" messaging.
- Optional: using a hint halves that question's points.

## Releases

- 4.0.0: foundation + Phase 1 + Phase 2 (points and calendar), with release notes explaining the new streak.
- 4.1.0: tutorials engine, hub, links, first topics. Further 4.x releases add the remaining topics and the coaching hints.
- Update `dev/nextUpdate.md`: its stated goal ("practice, not learn concepts") changes with tutorials.

## Testing

- Registry check: every activity has a tier and a tutorial; no duplicate keys.
- Simulated days (the existing day-offset hook) for streak start, continue, lapse, weekend, bonus, and goal growth.
- Seed ledgers to test the calendar across month boundaries, empty months, and many-activity days.
- Migration test with old cookies present; double-count test in Mix & Match.
- Same default-look comparison approach used for themes; phone widths; all themes; no console errors.

## Main risks

- **Tutorial volume:** about 30 animated lessons is real writing and visual work. Mitigated by the data-driven engine and the review gate after 4.
- **Tier calibration:** points need playtesting so no single activity is a farming shortcut. Mitigation: all tiers live in one table; optional later cap or diminishing returns per activity per day.
- **Registry move:** extracting `LEVELS` out of `index.html` touches the launcher and Mix & Match. Low risk, but done first and verified before anything builds on it.
- **Browser-only storage:** progress does not follow the student between devices; the Export/Import file is the mitigation.
