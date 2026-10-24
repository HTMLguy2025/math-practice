// Grade picker for the launcher: asks once (first visit, or when the saved choice is
// gone) and lets Settings reopen it. The choice lives in points.js (MPPoints.getGrade).
(() => {
    'use strict';
    const P = window.MPPoints;
    if (!P) return;

    const waiting = [];
    let overlay = null;

    const done = () => { while (waiting.length) waiting.shift()(); };

    const close = () => {
        if (overlay) { overlay.remove(); overlay = null; }
        document.removeEventListener('keydown', onKey, true);
        done();
    };
    const onKey = (e) => { if (e.key === 'Escape' && P.getGrade()) { e.stopPropagation(); close(); } };

    const choose = (id) => { P.setGrade(id); close(); };

    const open = () => {
        if (overlay) return;
        overlay = document.createElement('div');
        overlay.className = 'grade-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'gradeTitle');
        const card = document.createElement('div');
        card.className = 'grade-card';
        card.innerHTML = '<h2 id="gradeTitle">What grade are you in?</h2>' +
            '<p>This helps decide how many points each activity is worth. Easy activities earn less as you move up, and harder ones earn more. You can change it any time in Settings.</p>';
        const grid = document.createElement('div');
        grid.className = 'grade-grid';
        const current = P.getGrade();
        P.GRADES.forEach(g => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'grade-btn' + (g.id === 'adult' ? ' wide' : '') + (g.id === current ? ' on' : '');
            b.textContent = g.id === 'K' ? 'K' : g.id === 'adult' ? g.label : g.id;
            b.title = g.label;
            b.setAttribute('aria-label', g.label);
            b.addEventListener('click', () => choose(g.id));
            grid.appendChild(b);
        });
        card.appendChild(grid);
        const skip = document.createElement('button');
        skip.type = 'button';
        skip.className = 'grade-skip';
        skip.textContent = current ? 'Cancel' : 'Skip for now';
        skip.addEventListener('click', () => { if (!current) P.setGrade('skip'); close(); });
        card.appendChild(skip);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        document.addEventListener('keydown', onKey, true);
        const first = grid.querySelector('.on') || grid.firstChild;
        if (first) first.focus();
    };

    window.MPGrade = {
        open,
        // run fn once a grade has been chosen (straight away if one already is)
        whenChosen: (fn) => { if (P.getGrade()) fn(); else waiting.push(fn); },
        label: () => { const g = P.GRADES.find(x => x.id === P.getGrade()); return g ? g.label : 'Not set'; },
    };

    const init = () => { if (!P.getGrade()) open(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
