// Theme engine — loaded first on every page. Reads the saved theme, works out a
// full palette, and publishes it as CSS variables on <html> before first paint.
// Presets are fixed palettes; a custom colour is turned into one by keeping its
// hue and choosing button / accent shades that stay readable against the page.
(() => {
    'use strict';

    const STORAGE_KEY = 'mpTheme';

    // ---------- colour maths ----------
    const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

    const hexToRgb = (hex) => {
        const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
        if (!m) return null;
        const n = parseInt(m[1], 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const rgbToHex = ([r, g, b]) =>
        '#' + [r, g, b].map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');

    const rgbToHsl = ([r, g, b]) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const l = (max + min) / 2;
        const d = max - min;
        if (d === 0) return [0, 0, l];
        const s = d / (1 - Math.abs(2 * l - 1));
        let h;
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        return [(h * 60 + 360) % 360, s, l];
    };

    const hslToRgb = (h, s, l) => {
        h = ((h % 360) + 360) % 360;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        if (h < 60)       [r, g, b] = [c, x, 0];
        else if (h < 120) [r, g, b] = [x, c, 0];
        else if (h < 180) [r, g, b] = [0, c, x];
        else if (h < 240) [r, g, b] = [0, x, c];
        else if (h < 300) [r, g, b] = [x, 0, c];
        else              [r, g, b] = [c, 0, x];
        return [(r + m) * 255, (g + m) * 255, (b + m) * 255].map(Math.round);
    };

    // WCAG relative luminance and contrast ratio
    const luminance = ([r, g, b]) => {
        const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const contrast = (a, b) => {
        const la = luminance(a), lb = luminance(b);
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    };

    // The colour with this hue/saturation whose luminance is `targetY`.
    // Luminance rises monotonically with HSL lightness, so bisect.
    const byLuminance = (h, s, targetY) => {
        let lo = 0, hi = 1;
        for (let i = 0; i < 28; i++) {
            const mid = (lo + hi) / 2;
            if (luminance(hslToRgb(h, s, mid)) < targetY) lo = mid; else hi = mid;
        }
        return hslToRgb(h, s, (lo + hi) / 2);
    };

    const css  = (rgb) => 'rgb(' + rgb.join(', ') + ')';
    const chan = (rgb) => rgb.join(', ');

    // ---------- palette ----------
    // Everything the stylesheets reference. Solid colours come as `--x` and,
    // where the CSS needs transparency, as `--x-rgb` too.
    const buildVars = (c) => ({
        '--bg': css(c.bg),               '--bg-rgb': chan(c.bg),
        '--panel-rgb': chan(c.panel),    '--panel-deep-rgb': chan(c.panelDeep),
        '--field-outer': css(c.fieldOuter),
        '--field-inner': css(c.fieldInner),
        '--field-active': css(c.fieldActive),
        '--btn': css(c.btn),             '--btn-rgb': chan(c.btn),
        '--btn-hover': css(c.btnHover),
        '--btn-active': css(c.btnActive),
        '--btn-2': css(c.btn2),
        '--btn-2-hover': css(c.btn2Hover),
        '--accent': css(c.accent),       '--accent-rgb': chan(c.accent),
        '--accent-hi': css(c.accentHi),  '--accent-hi-rgb': chan(c.accentHi),
        '--primary': css(c.primary),     '--primary-rgb': chan(c.primary),
        '--primary-hover': css(c.primaryHover),
        '--primary-active': css(c.primaryActive),
        '--grad-a': css(c.gradA),
        '--grad-b': css(c.gradB),        '--grad-b-rgb': chan(c.gradB),
        '--trim': css(c.trim),           '--trim-rgb': chan(c.trim),
        '--text-rgb': chan(c.text),
        '--text-hi-rgb': chan(c.textHi),
        '--text-body': css(c.textBody),
    });

    // The original look, exactly.
    const MIDNIGHT = {
        bg: [18, 18, 31], panel: [22, 22, 40], panelDeep: [14, 14, 26],
        fieldOuter: [10, 10, 20], fieldInner: [28, 30, 50], fieldActive: [38, 42, 72],
        btn: [35, 50, 85], btnHover: [52, 75, 120], btnActive: [20, 32, 60],
        btn2: [31, 46, 80], btn2Hover: [38, 56, 96],
        accent: [90, 130, 200], accentHi: [138, 212, 255],
        primary: [60, 100, 170], primaryHover: [45, 80, 145], primaryActive: [30, 58, 110],
        gradA: [79, 195, 247], gradB: [124, 108, 240], trim: [124, 108, 240],
        text: [190, 205, 218], textHi: [227, 234, 245], textBody: [176, 188, 212],
    };

    // The secondary colour drives the second end of gradients and the thin trims
    // (card borders, header line, panel outlines).
    const secondaryParts = (hex) => {
        const rgb = hexToRgb(hex) || [124, 108, 240];
        const [hs, s0] = rgbToHsl(rgb);
        const grey = s0 < 0.08;
        const sat = (lo, hi) => (grey ? s0 : clamp(s0, lo, hi));
        return {
            gradB: byLuminance(hs, sat(0.55, 0.9), 0.30),
            trim:  byLuminance(hs, sat(0.40, 0.8), 0.22),
        };
    };

    // With no secondary chosen, take the hue 40 degrees round the wheel.
    const autoSecondary = (hex) => {
        const [h, s0] = rgbToHsl(hexToRgb(hex) || [60, 100, 170]);
        return rgbToHex(hslToRgb(h + 40, s0 < 0.08 ? s0 : 0.7, 0.55));
    };

    // Turn any colour into a dark theme in its own hue.
    const derive = (hex, secondaryHex) => {
        const rgb = hexToRgb(hex) || [60, 100, 170];
        const [h, s0] = rgbToHsl(rgb);
        const grey = s0 < 0.08;                          // greys stay grey
        const sat = (lo, hi) => (grey ? s0 : clamp(s0, lo, hi));
        const tint = grey ? s0 : clamp(clamp(s0, 0.32, 0.78) * 0.45, 0.18, 0.40);

        // Buttons keep the picked colour's own brightness, but only within the
        // band where light text stays strongly readable (>= 7:1) and the
        // button still stands out from the page background.
        const btnY = clamp(luminance(rgb), 0.034, 0.075);
        const bs = sat(0.32, 0.70);
        const as = sat(0.45, 0.80);

        const c = {
            bg:          hslToRgb(h, tint, 0.085),
            panel:       hslToRgb(h, tint, 0.12),
            panelDeep:   hslToRgb(h, tint, 0.075),
            fieldOuter:  hslToRgb(h, tint * 0.9, 0.055),
            fieldInner:  hslToRgb(h, tint * 0.9, 0.14),
            fieldActive: hslToRgb(h, tint * 0.9, 0.2),
            btn:         byLuminance(h, bs, btnY),
            btnHover:    byLuminance(h, bs, Math.min(btnY * 1.75, 0.15)),
            btnActive:   byLuminance(h, bs, btnY * 0.5),
            btn2:        byLuminance(h, bs, btnY * 0.88),
            btn2Hover:   byLuminance(h, bs, Math.min(btnY * 1.3, 0.15)),
            accent:      byLuminance(h, as, 0.30),
            accentHi:    byLuminance(h, sat(0.6, 0.9), 0.55),
            primary:     byLuminance(h, sat(0.4, 0.7), 0.13),
            primaryHover:  byLuminance(h, sat(0.4, 0.7), 0.17),
            primaryActive: byLuminance(h, sat(0.4, 0.7), 0.07),
            gradA:       byLuminance(h, sat(0.6, 0.9), 0.42),
            text:        hslToRgb(h, grey ? s0 : 0.27, 0.80),
            textHi:      hslToRgb(h, grey ? s0 : 0.30, 0.93),
            textBody:    hslToRgb(h, grey ? s0 : 0.28, 0.76),
            ...secondaryParts(secondaryHex || autoSecondary(hex)),
        };
        return c;
    };

    // ---------- presets ----------
    const PRESETS = [
        { id: 'midnight',  name: 'Midnight',  base: '#3c64aa', secondary: '#7c6cf0', colors: MIDNIGHT },
        { id: 'forest',    name: 'Forest',    base: '#2f9e5a', secondary: '#d9b44a' },
        { id: 'ember',     name: 'Ember',     base: '#e0632a', secondary: '#d94f6b' },
        { id: 'amethyst',  name: 'Amethyst',  base: '#8a63e0', secondary: '#e66fb0' },
        { id: 'rose',      name: 'Rose',      base: '#d9507f', secondary: '#f0a35e' },
    ];
    const DEFAULT_THEME = { type: 'preset', id: 'midnight' };

    const presetOf = (theme) => PRESETS.find(x => x.id === theme.id) || PRESETS[0];

    const colorsFor = (theme) => {
        if (theme.type === 'custom') return derive(theme.color, theme.secondary);
        const p = presetOf(theme);
        if (p.colors) return theme.secondary ? { ...p.colors, ...secondaryParts(theme.secondary) } : p.colors;
        return derive(p.base, theme.secondary || p.secondary);
    };

    // The secondary colour actually in effect (what the picker should show).
    const effectiveSecondary = (theme) => theme.secondary
        || (theme.type === 'custom' ? autoSecondary(theme.color) : presetOf(theme).secondary);

    // How readable the result is — shown in the settings panel.
    const report = (colors) => ({
        textOnButton:   contrast(colors.textHi, colors.btn),
        textOnHover:    contrast(colors.textHi, colors.btnHover),
        whiteOnPrimary: contrast([255, 255, 255], colors.primary),
        buttonOnPage:   contrast(colors.btn, colors.bg),
    });

    // ---------- storage / apply ----------
    const normalise = (t) => {
        const sec = t && t.secondary && hexToRgb(t.secondary) ? { secondary: rgbToHex(hexToRgb(t.secondary)) } : {};
        if (t && t.type === 'custom' && hexToRgb(t.color)) {
            return { type: 'custom', color: rgbToHex(hexToRgb(t.color)), ...sec };
        }
        if (t && t.type === 'preset' && PRESETS.some(p => p.id === t.id)) {
            return { type: 'preset', id: t.id, ...sec };
        }
        return DEFAULT_THEME;
    };

    const getSaved = () => {
        try { return normalise(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
        catch (e) { return DEFAULT_THEME; }
    };

    const save = (theme) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalise(theme))); } catch (e) {}
    };

    let current = DEFAULT_THEME;

    const apply = (theme) => {
        current = normalise(theme);
        const colors = colorsFor(current);
        const vars = buildVars(colors);
        const root = document.documentElement;
        Object.keys(vars).forEach(k => root.style.setProperty(k, vars[k]));
        root.setAttribute('data-theme', current.type === 'custom' ? 'custom' : current.id);
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta && document.head) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        if (meta) meta.content = css(colors.bg);
        return colors;
    };

    apply(getSaved());

    // Keep other open tabs in step.
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) apply(getSaved());
    });

    window.MPTheme = {
        presets: PRESETS,
        defaultTheme: DEFAULT_THEME,
        getSaved, save, apply,
        current: () => current,
        colorsFor, report, derive, effectiveSecondary,
        baseColorOf: (theme) => theme.type === 'custom'
            ? theme.color
            : (PRESETS.find(p => p.id === theme.id) || PRESETS[0]).base,
        css, hexToRgb, rgbToHex,
    };
})();
