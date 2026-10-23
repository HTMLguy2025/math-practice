// "How to" button for activities. Adds a small button beside the page title
// that opens the matching tutorial in an overlay, so the practice session (and
// its score) carries on untouched underneath.
//
// Exercise pages attach themselves. The Mix & Match host calls
// MPHelp.forHref(href) whenever a different exercise comes on screen.
// A page with no finished tutorial simply shows no button.
(() => {
    'use strict';

    const SHORT = { negatives: 'Negatives', decimals: 'Decimals' };

    let overlay = null, opener = null, holder = null, note = null;

    const close = () => {
        if (!overlay) return;
        overlay.remove();
        overlay = null;
        document.documentElement.style.overflow = '';
        document.removeEventListener('keydown', onKey, true);
        window.removeEventListener('message', onMessage);
        if (opener && opener.isConnected) opener.focus();
        opener = null;
    };
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    const onMessage = (e) => {
        if (overlay && e.data && e.data.type === 'tutorial:close') close();
    };

    const open = (topicId, fromButton, src) => {
        close();
        opener = fromButton || null;
        overlay = document.createElement('div');
        overlay.className = 'help-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Tutorial');
        const panel = document.createElement('div');
        panel.className = 'help-panel';
        const frame = document.createElement('iframe');
        frame.title = 'Tutorial';
        frame.src = src || MPTutorials.url(topicId, true);
        panel.appendChild(frame);
        overlay.appendChild(panel);
        overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) close(); });
        document.body.appendChild(overlay);
        document.documentElement.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey, true);
        window.addEventListener('message', onMessage);
        frame.addEventListener('load', () => { try { frame.contentWindow.focus(); } catch (e) {} });
    };

    // "You might need some paper": beside the exercise name, so the header stays the same height.
    const renderNote = (anchor, topicIds) => {
        if (note) { note.remove(); note = null; }
        if (!anchor || !MPTutorials.needsPaper(topicIds)) return;
        note = document.createElement('span');
        note.className = 'paperNote';
        note.textContent = '*You might need some paper';
        const mode = anchor.parentElement && anchor.parentElement.querySelector('.modeIndicator');
        if (!mode) { anchor.insertAdjacentElement('afterend', note); return; }
        // the exercise name and the note share one line (the name element is moved, not replaced)
        let row = mode.parentElement;
        if (!row.classList.contains('modeRow')) {
            row = document.createElement('div');
            row.className = 'modeRow';
            mode.insertAdjacentElement('beforebegin', row);
            row.appendChild(mode);
        }
        row.appendChild(note);
    };

    // Draw the button(s) for these topics, replacing any shown before.
    const render = (anchor, topicIds, allTopicIds) => {
        if (holder) { holder.remove(); holder = null; }
        renderNote(anchor, allTopicIds || topicIds);
        if (!anchor || !topicIds.length) return;
        holder = document.createElement('div');
        holder.className = 'helpRow';
        topicIds.forEach((id, i) => {
            const t = MPTutorials.topic(id);
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'helpBtn';
            b.textContent = '? ' + (i === 0 ? 'How to' : (SHORT[id] || t.title));
            b.title = 'Tutorial: ' + t.title;
            b.setAttribute('aria-label', 'Open the tutorial: ' + t.title);
            b.addEventListener('click', () => open(id, b));
            holder.appendChild(b);
        });
        anchor.insertAdjacentElement('afterend', holder);
    };

    const readyFor = (href) => {
        const u = new URL(href, location.href);
        return MPTutorials.readyTopicsFor(MPActivities.pageOf(u.pathname), u.searchParams);
    };

    const init = () => {
        const params = new URLSearchParams(location.search);
        if (params.get('mix') === '1' && window.self !== window.top) return;   // the Mix & Match host shows it instead
        if (document.body.classList.contains('mix-host')) return;               // host calls forHref itself
        const anchor = document.querySelector('.header .title1');
        if (!anchor) return;
        const page = MPActivities.pageOf(location.pathname);
        render(anchor, MPTutorials.readyTopicsFor(page, params), MPTutorials.topicsFor(page, params));
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

    window.MPHelp = {
        open,
        // The coach's worked example for one question (see coach.js).
        openCoach: (fromButton) => open(null, fromButton, 'tutorial.html?coach=1&embed=1'),
        close,
        forHref: (href) => {
            const anchor = document.querySelector('.header .title1');
            render(anchor, href ? readyFor(href) : [], href ? MPTutorials.topicsForHref(href) : []);
        },
    };
})();
