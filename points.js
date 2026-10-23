// Daily points, streak and bonuses — one balance for the whole app.
//
// Every correct answer on any activity earns points (see activities.js for how
// many). Points are saved the moment they are earned, so nothing is lost if the
// player leaves without pressing Finish.
//
// Rules
//   - A day's goal is 50 + the current streak length, capped at 120. It is fixed
//     when the day starts, so earning points never moves the goal.
//   - Reaching the goal on a weekday extends the streak (or starts a new one).
//   - Weekends are optional: practice is recorded, never breaks the streak, and
//     can still earn a bonus while a streak is alive.
//   - A streak is alive if it was last extended today or on the previous
//     weekday; otherwise it has lapsed and counts as zero.
//   - Reaching goal + 20 earns one bonus for the day (while a streak is alive).
//
// Pages: records answers on exercise pages, shows "Today: N / goal" and lights
// up the Finish button; the Mix & Match host only displays; the launcher uses
// the data API (MPPoints.summary) to draw the streak banner.
(() => {
    'use strict';

    const KEY = 'mpLedger';
    const BASE_GOAL = 50, GOAL_CAP = 120, BONUS_MARGIN = 20;

    // ---------- dates (dev-test.js can shift "today" for testing) ----------
    const todayDate = () => (typeof getToday === 'function' ? getToday() : new Date());
    const dstr = (d) => d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
    const isWeekday = (d) => d.getDay() !== 0 && d.getDay() !== 6;
    const prevWeekday = (date) => {
        const d = new Date(date);
        do { d.setDate(d.getDate() - 1); } while (!isWeekday(d));
        return d;
    };

    // ---------- storage ----------
    const emptyLedger = () => ({ v: 1, days: {}, streak: { count: 0, last: null, best: 0 }, bonuses: 0 });

    const load = () => {
        try {
            const o = JSON.parse(localStorage.getItem(KEY));
            if (o && o.v === 1 && o.days && o.streak) return o;
        } catch (e) {}
        return emptyLedger();
    };
    const save = (ledger) => {
        try { localStorage.setItem(KEY, JSON.stringify(ledger)); } catch (e) {}
    };

    // ---------- streak rules ----------
    const streakAlive = (ledger, today) => {
        const s = ledger.streak;
        return s.count > 0 && !!s.last && (s.last === dstr(today) || s.last >= dstr(prevWeekday(today)));
    };
    const aliveCount = (ledger, today) => (streakAlive(ledger, today) ? ledger.streak.count : 0);
    const goalFor = (ledger, today) => Math.min(BASE_GOAL + aliveCount(ledger, today), GOAL_CAP);

    const dayRecord = (ledger, today) => {
        const key = dstr(today);
        if (!ledger.days[key]) {
            // p points, a answered, c correct, g goal, s streak extended, b bonus earned
            ledger.days[key] = { p: 0, a: 0, c: 0, g: goalFor(ledger, today), s: 0, b: 0, act: {} };
        }
        return ledger.days[key];
    };

    const evaluate = (ledger, day, today) => {
        const key = dstr(today);
        if (isWeekday(today) && !day.s && day.p >= day.g) {
            const alive = streakAlive(ledger, today);
            ledger.streak.count = alive ? ledger.streak.count + 1 : 1;
            if (!alive) ledger.bonuses = 0;            // a fresh streak starts with no bonuses
            ledger.streak.last = key;
            ledger.streak.best = Math.max(ledger.streak.best, ledger.streak.count);
            day.s = 1;
        }
        if (!day.b && day.p >= day.g + BONUS_MARGIN && streakAlive(ledger, today)) {
            ledger.bonuses += 1;
            day.b = 1;
        }
    };

    // ---------- public data API ----------
    // Record one answered question. `points` is what a correct answer earns (0 when wrong).
    const record = ({ points = 0, correct = false, key = 'unknown' } = {}) => {
        const ledger = load();
        const today = todayDate();
        const day = dayRecord(ledger, today);
        const earned = correct ? Math.max(0, points) : 0;
        day.a += 1;
        day.c += correct ? 1 : 0;
        day.p += earned;
        const act = day.act[key] || (day.act[key] = [0, 0, 0]);
        act[0] += earned; act[1] += 1; act[2] += correct ? 1 : 0;
        evaluate(ledger, day, today);
        save(ledger);
        render();
        return summary();
    };

    const summary = () => {
        const ledger = load();
        const today = todayDate();
        const day = ledger.days[dstr(today)];
        const goal = day ? day.g : goalFor(ledger, today);
        const points = day ? day.p : 0;
        const alive = streakAlive(ledger, today);
        return {
            date: dstr(today),
            weekday: isWeekday(today),
            points, goal,
            answered: day ? day.a : 0,
            correct: day ? day.c : 0,
            goalMet: points >= goal,
            bonusReady: points >= goal + BONUS_MARGIN,
            extendedToday: !!(day && day.s),
            bonusEarnedToday: !!(day && day.b),
            streak: alive ? ledger.streak.count : 0,
            best: ledger.streak.best,
            bonuses: alive ? ledger.bonuses : 0,
        };
    };

    const FLAME_HTML =
        '<span class="finish-flame" aria-hidden="true">' +
            '<svg viewBox="0 0 22 30" xmlns="http://www.w3.org/2000/svg" overflow="visible">' +
                '<circle class="ember-1" cx="9"  cy="5" r="1.2" fill="#ff9800"/>' +
                '<circle class="ember-2" cx="13" cy="3" r="1.0" fill="#ffcc02"/>' +
                '<circle class="ember-3" cx="8"  cy="7" r="0.9" fill="#ff6d00"/>' +
                '<g class="flame-body">' +
                    '<path d="M11,30 C4,25 1,18 4,11 C6,6 9,2 11,-1 C13,2 16,6 18,11 C21,18 18,25 11,30Z" fill="#ff4500"/>' +
                    '<path d="M11,27 C6,22 4,17 7,11 C9,7 11,4 11,1 C11,4 13,7 15,11 C18,17 16,22 11,27Z" fill="#ff6d00"/>' +
                    '<g class="flame-inner"><path d="M11,24 C8,20 7,16 9,12 C10,10 11,8 11,8 C11,8 12,10 13,12 C15,16 14,20 11,24Z" fill="#ffd600"/></g>' +
                    '<path d="M11,9 C10,6 10,3 11,0 C12,3 12,6 11,9Z" fill="#fff9c4" opacity="0.85"/>' +
                '</g>' +
            '</svg>' +
            '<span class="text-ember te-1"></span><span class="text-ember te-2"></span><span class="text-ember te-3"></span>' +
        '</span>';

    // ---------- on-page display ----------
    let row = null;

    const ensureRow = () => {
        if (row && row.isConnected) return row;
        row = document.getElementById('dailyPointsRow');
        if (!row) {
            const host = document.querySelector('.scoreDisplay') || document.querySelector('.header');
            if (!host) return null;
            row = document.createElement('div');
            row.id = 'dailyPointsRow';
            row.className = 'dailyPointsRow';
            host.appendChild(row);
        }
        return row;
    };

    function render() {
        const r = ensureRow();
        if (!r) return;
        const s = summary();
        r.textContent = 'Today: ' + s.points + ' / ' + s.goal + ' pts';
        r.title = s.weekday
            ? 'Points from every activity. Reach the goal to keep your streak going.'
            : 'Weekend: practice is optional and never breaks your streak.';
        r.classList.toggle('goal-met', s.goalMet && !s.bonusReady);
        r.classList.toggle('bonus-ready', s.bonusReady);

        const finish = document.getElementById('finishButton');
        if (finish) {
            finish.classList.toggle('goal-met', s.goalMet && !s.bonusReady);
            finish.classList.toggle('bonus-ready', s.bonusReady);
            const flame = finish.querySelector('.finish-flame');
            if (s.bonusReady && !flame) finish.insertAdjacentHTML('beforeend', FLAME_HTML);
            if (!s.bonusReady && flame) flame.remove();
        }
    }

    // ---------- page wiring ----------
    const init = () => {
        const answeredEl = document.getElementById('questionsAnswered');
        const correctEl  = document.getElementById('questionscorrect');
        if (!answeredEl || !correctEl) return;     // launcher etc.: data API only

        render();
        window.addEventListener('storage', (e) => { if (e.key === KEY) render(); });

        // The Mix & Match host only displays; the embedded exercise records.
        if (document.body.classList.contains('mix-host')) {
            window.addEventListener('message', (e) => {
                if (e.data && e.data.type === 'mix:answered') render();
            });
            return;
        }
        // The simple-operation page scores each question by its own digits and
        // modifiers, so it records answers itself.
        if (window.MP_POINTS_MANUAL) return;

        const page = MPActivities.pageOf(location.pathname);
        const params = new URLSearchParams(location.search);
        const { tier, unknown } = MPActivities.tierFor(page, params);
        if (unknown.length) console.warn('No difficulty tier for', unknown.join(', '), '- using', tier);
        const key = MPActivities.activityKey(page, params);

        // Every page bumps these two counters when a question is answered, so
        // watching them is a page-agnostic "answered" signal (as mix.js does).
        let lastAnswered = parseInt(answeredEl.textContent) || 0;
        let lastCorrect  = parseInt(correctEl.textContent)  || 0;
        const observer = new MutationObserver(() => {
            const answered = parseInt(answeredEl.textContent) || 0;
            const correct  = parseInt(correctEl.textContent)  || 0;
            const newAnswers = answered - lastAnswered;
            const newCorrect = Math.min(correct - lastCorrect, newAnswers);
            lastAnswered = answered;
            lastCorrect  = correct;
            for (let i = 0; i < newAnswers; i++) {
                record({ points: tier, correct: i < newCorrect, key });
            }
        });
        [answeredEl, correctEl].forEach(el =>
            observer.observe(el, { childList: true, characterData: true, subtree: true })
        );
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

    window.MPPoints = {
        record, summary, render, load, save, KEY,
        todayDate, dstr, isWeekday,
        BASE_GOAL, GOAL_CAP, BONUS_MARGIN,
    };
})();
