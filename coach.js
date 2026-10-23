// The coach: a worked example for the exact question on screen.
//
//   MPCoach.question(q)         a new question is showing (q = {kind, ...numbers})
//   MPCoach.answered(q, ok)     the player just answered q; a miss offers "Show me how"
//   MPCoach.register(kind, fn)  fn(q) -> {title, steps:[{say, scene}]}  (coach-explain*.js)
//   MPCoach.applyPenalty(pts, ok)   points.js calls this: a hint halves what a correct answer earns
//
// The worked example opens in the same overlay as the tutorials (tutorial.html?coach=1) and
// uses the same animated scenes, so it looks like the lessons and steps with the glowing Next.
(() => {
    'use strict';

    const explainers = {};
    const st = { current: null, missed: null, answeredQ: null, shown: null };
    let bar = null, hintBtn = null, missBox = null, missBtn = null;

    const lessonFor = (q) => {
        const fn = q && explainers[q.kind];
        if (!fn) return null;
        try {
            const L = fn(q);
            return L && L.steps && L.steps.length ? L : null;
        } catch (e) { console.warn('Coach could not explain', q, e); return null; }
    };

    const sync = () => {
        if (!bar) return;
        const canHint = !!(st.current && explainers[st.current.kind]);
        hintBtn.hidden = !canHint;
        missBox.hidden = !st.missed;
        bar.hidden = hintBtn.hidden && missBox.hidden;
    };

    const open = (q, button) => {
        const L = lessonFor(q);
        if (!L || !window.MPHelp) return;
        st.shown = L;
        // Looking at the working for the question that is still on screen counts as a hint.
        if (q === st.current) q.hinted = true;
        MPHelp.openCoach(button);
    };

    const build = () => {
        if (bar || !document.body) return;
        bar = document.createElement('div');
        bar.className = 'coachBar';
        bar.setAttribute('role', 'group');
        bar.setAttribute('aria-label', 'Coach');

        hintBtn = document.createElement('button');
        hintBtn.type = 'button';
        hintBtn.className = 'coachBtn';
        hintBtn.textContent = 'Hint';
        hintBtn.title = 'Show me how to solve this one (it earns half the points)';
        hintBtn.addEventListener('click', () => open(st.current, hintBtn));

        missBox = document.createElement('div');
        missBox.className = 'coachMiss';
        const msg = document.createElement('span');
        msg.textContent = 'Not quite.';
        missBtn = document.createElement('button');
        missBtn.type = 'button';
        missBtn.className = 'coachBtn coachGlow';
        missBtn.textContent = 'Show me how';
        missBtn.addEventListener('click', () => open(st.missed, missBtn));
        const x = document.createElement('button');
        x.type = 'button';
        x.className = 'coachX';
        x.textContent = '✕';
        x.setAttribute('aria-label', 'Dismiss');
        x.addEventListener('click', () => { st.missed = null; sync(); });
        missBox.append(msg, missBtn, x);

        bar.append(hintBtn, missBox);
        document.body.appendChild(bar);
        sync();
    };

    window.MPCoach = {
        register: (kind, fn) => { explainers[kind] = fn; },
        has: (kind) => !!explainers[kind],
        lessonFor,

        question: (q) => { st.current = q || null; sync(); },
        // call this just before the answer is scored, so applyPenalty knows which question it was
        answered: (q, ok) => { st.answeredQ = q || null; st.missed = ok || !q || !explainers[q.kind] ? null : q; sync(); },

        // what the overlay's iframe reads
        frameLesson: () => st.shown,

        applyPenalty: (points, ok) => {
            const used = !!(st.answeredQ && st.answeredQ.hinted);
            return used && ok && points > 0 ? Math.max(1, Math.floor(points / 2)) : points;
        },
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
    else build();
})();
