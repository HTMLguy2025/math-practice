// My progress — a month calendar drawn from the daily points ledger (points.js).
(() => {
    'use strict';

    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                    'August', 'September', 'October', 'November', 'December'];
    const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const pad = (n) => String(n).padStart(2, '0');
    const keyOf = (y, m, d) => y + '-' + pad(m + 1) + '-' + pad(d);   // m is 0-based

    const el = (tag, cls, text) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    };

    const today = MPPoints.todayDate();
    const todayKey = MPPoints.dstr(today);
    let view = { y: today.getFullYear(), m: today.getMonth() };
    let selected = todayKey;

    // ---------- helpers ----------
    const statusOf = (day, date) => {
        const key = MPPoints.dstr(date);
        if (key > todayKey) return 'future';
        if (day && day.b) return 'bonus';
        if (day && day.p >= day.g && day.p > 0) return 'goal';
        if (day && day.p > 0) return 'started';
        return 'none';
    };

    const earliestMonth = (ledger) => {
        const keys = Object.keys(ledger.days).filter(k => ledger.days[k].p > 0 || ledger.days[k].a > 0).sort();
        const first = keys.length ? keys[0] : todayKey;
        return { y: +first.slice(0, 4), m: +first.slice(5, 7) - 1 };
    };

    const sameOrBefore = (a, b) => a.y < b.y || (a.y === b.y && a.m <= b.m);

    // ---------- top stats ----------
    const renderStats = (ledger) => {
        const s = MPPoints.summary();
        const box = document.getElementById('stats');
        box.innerHTML = '';
        [
            [s.streak + (s.streak === 1 ? ' day' : ' days'), 'Current streak', s.streak > 0 ? 'flame' : ''],
            [s.best + (s.best === 1 ? ' day' : ' days'), 'Best streak', ''],
            [String(s.bonuses), s.bonuses === 1 ? 'Bonus this streak' : 'Bonuses this streak', s.bonuses > 0 ? 'gold' : ''],
            [s.points + ' / ' + s.goal, "Today's points", ''],
        ].forEach(([value, label, cls]) => {
            const card = el('div', 'card stat');
            card.appendChild(el('div', 'stat-value' + (cls ? ' ' + cls : ''), value));
            card.appendChild(el('div', 'stat-label', label));
            box.appendChild(card);
        });
    };

    // ---------- calendar ----------
    const renderCalendar = (ledger) => {
        const { y, m } = view;
        document.getElementById('monthTitle').textContent = MONTHS[m] + ' ' + y;

        const first = new Date(y, m, 1);
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const lead = first.getDay();                      // Sunday-first grid

        const grid = document.getElementById('grid');
        grid.innerHTML = '';
        for (let i = 0; i < lead; i++) grid.appendChild(el('div', 'pad'));

        let pts = 0, active = 0, goals = 0, bonuses = 0;
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(y, m, d, 12);
            const key = keyOf(y, m, d);
            const day = ledger.days[key];
            const status = statusOf(day, date);
            const weekend = date.getDay() === 0 || date.getDay() === 6;

            if (day) {
                pts += day.p;
                if (day.p > 0) active++;
                if (status === 'goal' || status === 'bonus') goals++;
                if (day.b) bonuses++;
            }

            const b = el('button', 'day');
            b.type = 'button';
            if (weekend) b.classList.add('rest');
            if (status === 'started' || status === 'goal' || status === 'bonus') b.classList.add(status);
            if (key === todayKey) b.classList.add('today');
            if (key === selected) b.classList.add('selected');
            if (status === 'future') b.disabled = true;
            b.dataset.key = key;

            b.appendChild(el('span', 'd-num', String(d)));
            if (day && day.p > 0) b.appendChild(el('span', 'd-pts', String(day.p)));
            else b.appendChild(el('span', 'd-pts', ''));
            const mark = { bonus: '★', goal: '✓', started: '•' }[status];
            if (mark) b.appendChild(el('span', 'd-mark', mark));

            const words = {
                bonus: 'bonus earned', goal: 'goal reached', started: 'started, goal not reached',
                none: weekend ? 'rest day, no practice' : 'no practice', future: 'upcoming',
            }[status];
            b.setAttribute('aria-label', MONTHS[m] + ' ' + d + ': ' + (day ? day.p + ' points, ' : '') + words);
            b.addEventListener('click', () => { selected = key; render(); });
            grid.appendChild(b);
        }

        const sum = document.getElementById('monthSum');
        sum.innerHTML = '';
        const parts = [[pts, 'points'], [active, active === 1 ? 'active day' : 'active days'],
                       [goals, goals === 1 ? 'goal day' : 'goal days'], [bonuses, bonuses === 1 ? 'bonus' : 'bonuses']];
        parts.forEach(([n, label], i) => {
            if (i) sum.appendChild(document.createTextNode('  ·  '));
            sum.appendChild(el('b', '', String(n)));
            sum.appendChild(document.createTextNode(' ' + label));
        });

        const earliest = earliestMonth(ledger);
        document.getElementById('prevBtn').disabled = sameOrBefore(view, earliest);
        document.getElementById('nextBtn').disabled = view.y === today.getFullYear() && view.m === today.getMonth();
    };

    // ---------- day details ----------
    const renderDetail = (ledger) => {
        const box = document.getElementById('detail');
        box.innerHTML = '';
        if (!selected || +selected.slice(0, 4) !== view.y || +selected.slice(5, 7) - 1 !== view.m) {
            box.appendChild(el('p', 'empty', 'Tap a day to see how it went.'));
            return;
        }
        const date = new Date(+selected.slice(0, 4), +selected.slice(5, 7) - 1, +selected.slice(8, 10), 12);
        const day = ledger.days[selected];
        const status = statusOf(day, date);
        const weekend = date.getDay() === 0 || date.getDay() === 6;

        box.appendChild(el('h3', '', WEEKDAYS[date.getDay()] + ', ' + MONTHS[date.getMonth()] + ' ' + date.getDate()));

        let text, cls = '';
        if (status === 'bonus') { text = 'Bonus earned' + (day.s ? ' · streak day' : ''); cls = 'bonus'; }
        else if (status === 'goal') { text = day.s ? 'Goal reached · streak day' : 'Goal reached'; cls = 'goal'; }
        else if (status === 'started') text = 'Started: ' + day.p + ' of ' + day.g + ' points toward the goal';
        else if (weekend) text = 'Rest day. Practice is optional on weekends.';
        else text = 'No practice this day.';
        box.appendChild(el('p', 'status ' + cls, text));

        if (!day || day.a === 0) return;

        const facts = el('div', 'facts');
        const fact = (label, value) => {
            const s = el('span');
            s.appendChild(document.createTextNode(label + ' '));
            s.appendChild(el('b', '', value));
            facts.appendChild(s);
        };
        fact('Points', day.p + ' (goal ' + day.g + ')');
        fact('Correct', day.c + ' of ' + day.a + (day.a ? ' (' + Math.round((day.c / day.a) * 100) + '%)' : ''));
        box.appendChild(facts);

        const rows = Object.keys(day.act).map(k => ({ key: k, p: day.act[k][0], a: day.act[k][1], c: day.act[k][2] }))
            .sort((x, y) => y.p - x.p || y.a - x.a).slice(0, 8);
        const max = Math.max(1, ...rows.map(r => r.p));
        rows.forEach(r => {
            const row = el('div', 'act');
            row.appendChild(el('div', 'act-name', MPActivities.labelForKey(r.key)));
            row.appendChild(el('div', 'act-pts', r.p + (r.p === 1 ? ' pt' : ' pts')));
            row.appendChild(el('div', 'act-sub', r.c + ' of ' + r.a + ' correct'));
            const bar = el('div', 'act-bar');
            const fill = document.createElement('i');
            fill.style.width = Math.round((r.p / max) * 100) + '%';
            bar.appendChild(fill);
            row.appendChild(bar);
            box.appendChild(row);
        });
        if (Object.keys(day.act).length > rows.length) {
            box.appendChild(el('p', 'empty', '+ ' + (Object.keys(day.act).length - rows.length) + ' more'));
        }
    };

    function render() {
        const ledger = MPPoints.load();
        renderStats(ledger);
        renderCalendar(ledger);
        renderDetail(ledger);
    }

    // ---------- month navigation ----------
    const shiftMonth = (delta) => {
        let m = view.m + delta, y = view.y;
        if (m < 0) { m = 11; y--; }
        if (m > 11) { m = 0; y++; }
        view = { y, m };
        // Keep a day selected: today if it is in view, otherwise none.
        selected = (y === today.getFullYear() && m === today.getMonth()) ? todayKey : null;
        render();
    };
    document.getElementById('prevBtn').addEventListener('click', () => shiftMonth(-1));
    document.getElementById('nextBtn').addEventListener('click', () => shiftMonth(1));

    // ---------- backup: save / load a copy ----------
    const msg = document.getElementById('backupMsg');
    const say = (text, kind) => { msg.textContent = text; msg.className = kind || ''; };

    const isDateKey = (k) => /^\d{4}-\d{2}-\d{2}$/.test(k);
    const num = (v) => (typeof v === 'number' && isFinite(v) && v >= 0 ? Math.floor(v) : null);

    // Accept only a well-formed ledger; rebuild it field by field so nothing odd gets in.
    const cleanLedger = (raw) => {
        if (!raw || raw.v !== 1 || typeof raw.days !== 'object' || !raw.days || typeof raw.streak !== 'object' || !raw.streak) {
            throw new Error('That file is not a Math Practice progress file.');
        }
        const keys = Object.keys(raw.days);
        if (keys.length > 5000) throw new Error('That file has too many days.');
        const out = { v: 1, days: {}, streak: { count: 0, last: null, best: 0 }, bonuses: 0 };
        keys.forEach(k => {
            const d = raw.days[k];
            if (!isDateKey(k) || !d || typeof d !== 'object') throw new Error('The file has a day that cannot be read (' + k + ').');
            const rec = { p: num(d.p), a: num(d.a), c: num(d.c), g: num(d.g) };
            if (Object.values(rec).some(v => v === null)) throw new Error('The file has a day with bad numbers (' + k + ').');
            rec.s = d.s ? 1 : 0;
            rec.b = d.b ? 1 : 0;
            rec.act = {};
            const acts = d.act && typeof d.act === 'object' ? Object.keys(d.act) : [];
            if (acts.length > 400) throw new Error('The file has a day with too many activities (' + k + ').');
            acts.forEach(a => {
                const t = d.act[a];
                if (typeof a !== 'string' || a.length > 200 || !Array.isArray(t) || t.length !== 3 || t.some(v => num(v) === null)) {
                    throw new Error('The file has an activity that cannot be read (' + k + ').');
                }
                rec.act[a] = t.map(num);
            });
            out.days[k] = rec;
        });
        const st = raw.streak;
        const count = num(st.count), best = num(st.best), bonuses = num(raw.bonuses);
        if (count === null || best === null || bonuses === null || !(st.last === null || (typeof st.last === 'string' && isDateKey(st.last)))) {
            throw new Error('The streak information in that file cannot be read.');
        }
        out.streak = { count, last: st.last, best };
        out.bonuses = bonuses;
        return out;
    };

    document.getElementById('exportBtn').addEventListener('click', () => {
        const ledger = MPPoints.load();
        const n = Object.keys(ledger.days).length;
        const blob = new Blob([JSON.stringify(ledger, null, 1)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'math-practice-progress-' + todayKey + '.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        say('Saved ' + n + (n === 1 ? ' day' : ' days') + ' of progress.', 'ok');
    });

    const fileInput = document.getElementById('importFile');
    document.getElementById('importBtn').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        fileInput.value = '';
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { say('That file is too big to be a progress file.', 'bad'); return; }
        const reader = new FileReader();
        reader.onload = () => {
            let clean;
            try { clean = cleanLedger(JSON.parse(String(reader.result))); }
            catch (e) { say(e instanceof SyntaxError ? 'That file is not a Math Practice progress file.' : e.message, 'bad'); return; }
            const n = Object.keys(clean.days).length;
            if (!window.confirm('Replace the progress saved in this browser with this copy (' + n + (n === 1 ? ' day' : ' days') + ')?')) {
                say('Nothing was changed.');
                return;
            }
            MPPoints.save(clean);
            selected = todayKey;
            view = { y: today.getFullYear(), m: today.getMonth() };
            render();
            say('Loaded ' + n + (n === 1 ? ' day' : ' days') + ' of progress.', 'ok');
        };
        reader.onerror = () => say('That file could not be read.', 'bad');
        reader.readAsText(file);
    });

    window.addEventListener('storage', (e) => { if (e.key === MPPoints.KEY) render(); });

    // Exposed so the import checks can be exercised without a file picker.
    window.MPProgress = { cleanLedger, render };
    render();
})();
