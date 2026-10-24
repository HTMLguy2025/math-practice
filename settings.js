// Settings gear + theme panel for the launcher. Builds its own DOM; all colour
// work lives in theme.js (window.MPTheme).
(() => {
    const T = window.MPTheme;
    if (!T) return;

    const GEAR_SVG =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="3"/>' +
        '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>' +
        '</svg>';

    const el = (tag, cls, html) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html !== undefined) e.innerHTML = html;
        return e;
    };

    const gear = el('button', 'settings-gear', GEAR_SVG);
    gear.type = 'button';
    gear.id = 'settingsBtn';
    gear.setAttribute('aria-label', 'Settings');
    gear.setAttribute('aria-expanded', 'false');
    gear.setAttribute('aria-controls', 'settingsPanel');

    const panel = el('div', 'settings-panel');
    panel.id = 'settingsPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Settings');

    const head = el('div', 'sp-head', '<span class="sp-title">Settings</span>');
    const closeBtn = el('button', 'sp-close', '&#x2715;');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close settings');
    head.appendChild(closeBtn);
    panel.appendChild(head);

    panel.appendChild(el('p', 'sp-label', 'Theme'));

    const presetsEl = el('div', 'sp-presets');
    presetsEl.setAttribute('role', 'radiogroup');
    presetsEl.setAttribute('aria-label', 'Preset themes');
    const presetBtns = T.presets.map(p => {
        const colors = T.colorsFor({ type: 'preset', id: p.id });
        const b = el('button', 'sp-preset',
            '<span class="sp-swatch"><i style="background:' + T.css(colors.bg) + '"></i>' +
            '<i style="background:' + T.css(colors.btnHover) + '"></i>' +
            '<i style="background:linear-gradient(90deg,' + T.css(colors.gradA) + ',' + T.css(colors.gradB) + ')"></i></span>' +
            '<span>' + p.name + '</span>');
        b.type = 'button';
        b.setAttribute('role', 'radio');
        b.dataset.id = p.id;
        b.addEventListener('click', () => choose({ type: 'preset', id: p.id }));   // a fresh preset drops any secondary override
        presetsEl.appendChild(b);
        return b;
    });
    panel.appendChild(presetsEl);

    panel.appendChild(el('p', 'sp-label', 'Custom color'));
    const custom = el('div', 'sp-custom');
    const picker = el('label', 'sp-picker');
    const input = document.createElement('input');
    input.type = 'color';
    input.setAttribute('aria-label', 'Pick a theme color');
    picker.appendChild(input);
    const customText = el('div', 'sp-custom-text',
        '<div class="sp-custom-title">Pick any color</div><div class="sp-hex"></div>');
    custom.appendChild(picker);
    custom.appendChild(customText);
    panel.appendChild(custom);
    const hexEl = customText.querySelector('.sp-hex');

    panel.appendChild(el('p', 'sp-label sp-label-gap', 'Secondary color'));
    const secRow = el('div', 'sp-custom sp-secondary');
    const secPicker = el('label', 'sp-picker');
    const secInput = document.createElement('input');
    secInput.type = 'color';
    secInput.setAttribute('aria-label', 'Pick a secondary color');
    secPicker.appendChild(secInput);
    const secText = el('div', 'sp-custom-text',
        '<div class="sp-custom-title">Gradients &amp; trims</div><div class="sp-hex"></div>');
    const secReset = el('button', 'sp-mini', 'Reset');
    secReset.type = 'button';
    secRow.appendChild(secPicker);
    secRow.appendChild(secText);
    secRow.appendChild(secReset);
    panel.appendChild(secRow);
    const secHex = secText.querySelector('.sp-hex');

    const preview = el('div', 'sp-preview',
        '<span>Button</span><span class="hover">Hover</span><span class="primary">Finish</span>');
    const gradBar = el('div', 'sp-gradbar');
    panel.appendChild(preview);
    panel.appendChild(gradBar);
    const contrastEl = el('div', 'sp-contrast');
    panel.appendChild(contrastEl);

    // Grade level (changes how many points each activity earns)
    panel.appendChild(el('p', 'sp-label sp-label-gap', 'Grade level'));
    const gradeSel = el('select', 'sp-select');
    gradeSel.setAttribute('aria-label', 'Grade level');
    const P = window.MPPoints;
    if (P) {
        const none = el('option', '', 'Not set (no adjustment)');
        none.value = 'skip';
        gradeSel.appendChild(none);
        P.GRADES.forEach(g => { const o = el('option', '', g.label); o.value = g.id; gradeSel.appendChild(o); });
        gradeSel.addEventListener('change', () => P.setGrade(gradeSel.value));
        panel.appendChild(gradeSel);
        panel.appendChild(el('p', 'sp-note', 'Easier activities earn fewer points as the grade goes up, and harder ones earn more.'));
    }

    const resetBtn = el('button', 'sp-reset', 'Reset to default');
    resetBtn.type = 'button';
    panel.appendChild(resetBtn);

    // Reflect the current theme in the controls.
    const sync = () => {
        if (P) gradeSel.value = P.getGrade() || 'skip';
        const theme = T.current();
        presetBtns.forEach(b => {
            b.setAttribute('aria-checked', String(theme.type === 'preset' && theme.id === b.dataset.id));
        });
        custom.classList.toggle('active', theme.type === 'custom');
        const base = T.baseColorOf(theme);
        if (input.value.toLowerCase() !== base.toLowerCase()) input.value = base;
        picker.style.background = base;
        hexEl.textContent = theme.type === 'custom' ? base.toUpperCase() : 'Adapts buttons to your color';

        const sec = T.effectiveSecondary(theme);
        if (secInput.value.toLowerCase() !== sec.toLowerCase()) secInput.value = sec;
        secPicker.style.background = sec;
        secHex.textContent = theme.secondary ? sec.toUpperCase() : 'Theme default';
        secReset.style.visibility = theme.secondary ? 'visible' : 'hidden';

        const r = T.report(T.colorsFor(theme));
        const grade = r.textOnButton >= 7 ? 'AAA' : r.textOnButton >= 4.5 ? 'AA' : 'low';
        contrastEl.textContent = 'Text on buttons: ' + r.textOnButton.toFixed(1) + ':1 (' + grade + ')';
    };

    const choose = (theme) => {
        T.apply(theme);
        T.save(theme);
        sync();
    };

    // Picking a main colour keeps any secondary the player has chosen.
    input.addEventListener('input', () => {
        const keep = T.current().secondary;
        choose(keep ? { type: 'custom', color: input.value, secondary: keep } : { type: 'custom', color: input.value });
    });
    secInput.addEventListener('input', () => choose({ ...T.current(), secondary: secInput.value }));
    secReset.addEventListener('click', () => {
        const { secondary, ...rest } = T.current();
        choose(rest);
    });
    resetBtn.addEventListener('click', () => choose(T.defaultTheme));

    // Open / close
    const setOpen = (open) => {
        panel.classList.toggle('open', open);
        gear.setAttribute('aria-expanded', String(open));
        if (open) sync();
    };
    const isOpen = () => panel.classList.contains('open');

    gear.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!isOpen()); });
    closeBtn.addEventListener('click', () => { setOpen(false); gear.focus(); });
    document.addEventListener('click', (e) => {
        if (isOpen() && !panel.contains(e.target) && !gear.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) { setOpen(false); gear.focus(); }
    });

    // Another tab changed the theme — stay in step.
    window.addEventListener('storage', () => { if (isOpen()) sync(); });

    document.body.appendChild(gear);
    document.body.appendChild(panel);
    sync();
})();
