// Tutorial player — plays a lesson (see MPTutorials.define) as an animated,
// step-by-step explanation, then asks a few quick questions.
//
// A step never advances by itself. When its animation finishes, the Next
// button lights up and the learner moves on when ready.
//
// Scene kinds drawn here: tenframe, numberline, sequence, clock, fractionbar.
// The rest live in tutorial-scenes.js and register themselves in
// window.MPTutorialScenes using the helpers exported below as MPTutorialKit.
// A scene is `async (stage, spec, ctx)`; the same spec always draws the same
// picture, so jumping between steps is safe.
//   ctx.instant  draw the finished picture with no animation
//   ctx.alive()  false once the learner has moved to another step
//   ctx.wait(ms) pause (scaled by the speed setting)
(() => {
    'use strict';

    const NS = 'http://www.w3.org/2000/svg';
    const COLORS = { a: '#4fc3f7', b: '#ffb74d', c: '#81c784', d: '#f06292' };
    const GOLD = '#ffd54f';
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- tiny DOM helpers ----------
    const sv = (tag, attrs, parent) => {
        const e = document.createElementNS(NS, tag);
        Object.keys(attrs || {}).forEach(k => e.setAttribute(k, attrs[k]));
        if (parent) parent.appendChild(e);
        return e;
    };
    const el = (tag, cls, text, parent) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        if (parent) parent.appendChild(e);
        return e;
    };
    const svgText = (parent, x, y, text, size, fill, extra) => {
        const t = sv('text', Object.assign({
            x, y, 'font-size': size, fill: fill || 'rgb(var(--text-hi-rgb))',
            'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-weight': 600,
        }, extra || {}), parent);
        t.textContent = text;
        return t;
    };
    const makeSvg = (stage) => {
        stage.innerHTML = '';
        return sv('svg', { viewBox: '0 0 640 360', preserveAspectRatio: 'xMidYMid meet', role: 'img' }, stage);
    };
    const anim = (node, name, ms, delay, ctx) => {
        if (ctx.instant) return;
        node.style.animation = name + ' ' + ms + 'ms ease-out ' + Math.round(delay) + 'ms both';
    };
    const fmtNum = (v) => (v < 0 ? '−' + Math.abs(v) : String(v));

    // ======================= core scenes =======================

    // ---- ten-frame: add past ten by filling the frame first ----
    const tenframe = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const { a, b, phase } = spec;
        const total = a + b;
        const CELL = 56, FX = 50, FY = 120;
        const cell = (i) => [FX + (i % 5) * CELL + CELL / 2, FY + Math.floor(i / 5) * CELL + CELL / 2];
        const extra = (j) => [410 + (j % 5) * 38 + 19, 134 + Math.floor(j / 5) * 38 + 19];
        const need = Math.max(0, Math.min(b, 10 - a));
        const rest = b - need;

        const showSum = phase === 'sum';
        const eq = svgText(svg, 320, 52, a + ' + ' + b + ' = ' + (showSum ? total : '?'), 46);
        if (showSum) { eq.setAttribute('fill', COLORS.c); anim(eq, 'tp-pop', 500, 0, ctx); }

        for (let i = 0; i < 10; i++) {
            const [cx, cy] = cell(i);
            sv('rect', { x: cx - CELL / 2 + 2, y: cy - CELL / 2 + 2, width: CELL - 4, height: CELL - 4, rx: 6,
                style: 'fill:rgba(255,255,255,0.04);stroke:rgba(var(--accent-rgb),0.7);stroke-width:2' }, svg);
        }
        const dot = (x, y, color, delay) => {
            const c = sv('circle', { cx: x, cy: y, r: 20, fill: color }, svg);
            c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'center';
            anim(c, 'tp-pop', 380, delay, ctx);
            return c;
        };

        if (phase === 'intro') { await ctx.wait(500); return; }

        for (let i = 0; i < a; i++) dot(...cell(i), COLORS.a, phase === 'a' ? i * 110 : 0);
        if (phase === 'a') { await ctx.wait(a * 110 + 450); return; }

        // the second group waits to the right; once settled, the first few of them sit in the frame
        const settled = phase === 'leftover' || phase === 'sum';
        const movers = [];
        for (let j = 0; j < b; j++) {
            if (settled && j < need) { dot(...cell(a + j), COLORS.b, 0); continue; }
            const [ex, ey] = extra(settled ? j - need : j);
            const d = dot(ex, ey, COLORS.b, phase === 'b' ? j * 110 : 0);
            if (phase === 'move' && j < need) movers.push([d, j]);
            if (phase === 'leftover') d.style.animation = 'tp-pulse 1.1s ease-in-out infinite';
        }
        if (phase === 'b') { await ctx.wait(b * 110 + 450); return; }

        if (phase === 'move') {
            await ctx.wait(450);
            for (const [d, j] of movers) {
                if (!ctx.alive()) return;
                const [tx, ty] = cell(a + j);
                const sx = +d.getAttribute('cx'), sy = +d.getAttribute('cy');
                if (ctx.instant) { d.setAttribute('cx', tx); d.setAttribute('cy', ty); continue; }
                d.style.animation = 'none';
                const run = d.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(' + (tx - sx) + 'px,' + (ty - sy) + 'px)' }],
                    { duration: 700 / ctx.speed, easing: 'ease-in-out', fill: 'forwards' });
                await ctx.wait(520);
                run.onfinish = () => { d.setAttribute('cx', tx); d.setAttribute('cy', ty); run.cancel(); };
            }
            await ctx.wait(800);
            return;
        }

        svgText(svg, FX + 2.5 * CELL, 100, a + need >= 10 ? '10' : String(a + need), 30, COLORS.c);
        if (rest > 0) svgText(svg, 410 + 95, 108, rest + ' left over', 22, COLORS.b);
        if (showSum) {
            const line = svgText(svg, 320, 318, '10 + ' + rest + ' = ' + total, 36, 'rgb(var(--accent-hi-rgb))');
            anim(line, 'tp-fade', 500, 200, ctx);
        }
        await ctx.wait(900);
    };

    // ---- number line: marks, hops of any size, custom labels ----
    //   {min, max, tickEvery, labelEvery, labels[], start, hops, dir, stepSize, counts,
    //    hopLabels[], marks:[{v,color,label}], annos:[{v,text,color}], notes, noLand}
    const numberline = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const { min, max } = spec;
        const tickEvery = spec.tickEvery || 1;
        const labelEvery = spec.labelEvery || 1;
        const X0 = 50, X1 = 590, Y = 210;
        const px = (v) => X0 + ((v - min) / (max - min)) * (X1 - X0);
        const ticks = [];
        for (let v = min; v <= max + 1e-9; v += tickEvery) ticks.push(v);
        const lab = (v) => (spec.labels ? spec.labels[Math.round((v - min) / tickEvery)] : fmtNum(v));
        const dense = ticks.length / labelEvery > 14 || (spec.labels && String(spec.labels[0]).length > 3);
        const fs = dense ? 17 : 22;
        const hasHops = spec.start !== undefined && spec.hops;

        const line = sv('line', { x1: X0 - 10, y1: Y, x2: X1 + 10, y2: Y,
            style: 'stroke:rgb(var(--text-rgb));stroke-width:4;stroke-linecap:round' }, svg);
        if (!ctx.instant) { line.style.strokeDasharray = 640; line.style.setProperty('--len', 640); line.style.animation = 'tp-draw 700ms ease-out both'; }
        ticks.forEach((v, i) => {
            const t = sv('line', { x1: px(v), y1: Y - 10, x2: px(v), y2: Y + 10,
                style: 'stroke:rgb(var(--text-rgb));stroke-width:3' }, svg);
            const els = [t];
            if (i % labelEvery === 0) els.push(svgText(svg, px(v), Y + 34, lab(v), fs, 'rgb(var(--text-rgb))', { 'data-tick': lab(v) }));
            els.forEach(x => { x.style.transformBox = 'fill-box'; x.style.transformOrigin = 'center'; anim(x, 'tp-pop', 300, 300 + i * Math.min(30, 600 / ticks.length), ctx); });
        });
        await ctx.wait(700 + Math.min(ticks.length * 30, 600));
        if (!ctx.alive()) return;

        if (spec.notes) {
            const l = svgText(svg, 130, 300, '← smaller', 24, COLORS.a);
            const r = svgText(svg, 510, 300, 'bigger →', 24, COLORS.b);
            anim(l, 'tp-fade', 500, 0, ctx); anim(r, 'tp-fade', 500, 400, ctx);
            await ctx.wait(1000);
            return;
        }

        (spec.marks || []).forEach((m, i) => {
            const c = sv('circle', { cx: px(m.v), cy: Y, r: 12, fill: COLORS[m.color || 'b'],
                style: 'stroke:rgb(var(--bg-rgb));stroke-width:3' }, svg);
            const t = svgText(svg, px(m.v), Y - 40, m.label !== undefined ? m.label : fmtNum(m.v), 30, COLORS[m.color || 'b']);
            [c, t].forEach(x => { x.style.transformBox = 'fill-box'; x.style.transformOrigin = 'center'; anim(x, 'tp-pop', 350, i * 350, ctx); });
        });
        (spec.annos || []).forEach((a, i) => {
            const t = svgText(svg, px(a.v), Y + 112, a.text, 19, COLORS[a.color || 'c']);
            sv('line', { x1: px(a.v), y1: Y + 56, x2: px(a.v), y2: Y + 98,
                style: 'stroke:' + COLORS[a.color || 'c'] + ';stroke-width:2;stroke-dasharray:5 4' }, svg);
            anim(t, 'tp-fade', 400, 300 + i * 250, ctx);
        });
        if ((spec.marks || []).length || (spec.annos || []).length) await ctx.wait(500 + ((spec.marks || []).length + (spec.annos || []).length) * 300);
        if (!hasHops) return;

        const dir = spec.dir || 1, size = spec.stepSize || 1;
        const marker = sv('circle', { cx: px(spec.start), cy: Y - 4, r: 13, fill: COLORS.b,
            style: 'stroke:rgb(var(--bg-rgb));stroke-width:3' }, svg);
        anim(marker, 'tp-pop', 350, 0, ctx);
        const startLabel = svgText(svg, px(spec.start), Y + 72, 'start', 20, COLORS.b);
        anim(startLabel, 'tp-fade', 400, 100, ctx);
        await ctx.wait(800);

        let cur = spec.start;
        for (let k = 1; k <= spec.hops; k++) {
            if (!ctx.alive()) return;
            const nxt = cur + dir * size;
            const x0 = px(cur), x1 = px(nxt), xm = (x0 + x1) / 2;
            const arc = sv('path', { d: 'M ' + x0 + ' ' + (Y - 14) + ' Q ' + xm + ' ' + (Y - 90) + ' ' + x1 + ' ' + (Y - 14),
                fill: 'none', style: 'stroke:' + COLORS.a + ';stroke-width:4;stroke-linecap:round' }, svg);
            if (!ctx.instant) { arc.style.strokeDasharray = 300; arc.style.setProperty('--len', 300); arc.style.animation = 'tp-draw 420ms ease-out both'; }
            if (ctx.instant) { marker.setAttribute('cx', x1); }
            else {
                const base = px(spec.start);
                marker.animate([{ transform: 'translate(' + (x0 - base) + 'px,0)' }, { transform: 'translate(' + (x1 - base) + 'px,0)' }],
                    { duration: 480 / ctx.speed, easing: 'ease-in-out', fill: 'forwards' });
            }
            const text = spec.hopLabels ? spec.hopLabels[k - 1]
                : (spec.counts ? lab(nxt) : (dir > 0 ? '+' : '−') + size);
            const bubble = svgText(svg, xm, Y - 104, text, spec.hopLabels ? 22 : 26, COLORS.a);
            anim(bubble, 'tp-pop', 300, 200, ctx);
            const tick = svg.querySelector('text[data-tick="' + lab(nxt) + '"]');
            if (tick) { tick.setAttribute('fill', COLORS.a); tick.setAttribute('font-size', fs + 6); }
            await ctx.wait(720);
            cur = nxt;
        }
        if (!ctx.alive()) return;
        const ring = sv('circle', { cx: px(cur), cy: Y, r: 22, fill: 'none',
            style: 'stroke:' + COLORS.c + ';stroke-width:4' }, svg);
        ring.style.transformBox = 'fill-box'; ring.style.transformOrigin = 'center';
        anim(ring, 'tp-pop', 400, 0, ctx);
        if (!spec.noLand) {
            const near = Math.abs(px(cur) - px(spec.start)) < 130;   // keep clear of the "start" label
            const done = svgText(svg, px(cur), Y + (near ? 110 : 76), 'lands on ' + lab(cur), 24, COLORS.c);
            anim(done, 'tp-fade', 400, 150, ctx);
        }
        await ctx.wait(900);
    };

    // ---- sequence with a missing number ----
    const sequence = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const items = spec.items;
        const W = 96, GAP = 28;
        const total = items.length * W + (items.length - 1) * GAP;
        const x0 = (640 - total) / 2;
        const nums = items.filter(v => typeof v === 'number');
        const diff = nums.length > 1 ? nums[1] - nums[0] : 1;
        let qBox = null, qText = null;
        items.forEach((v, i) => {
            const x = x0 + i * (W + GAP);
            const missing = v === '?';
            const box = sv('rect', { x, y: 120, width: W, height: W, rx: 14,
                style: missing ? 'fill:rgba(255,255,255,0.04);stroke:' + GOLD + ';stroke-width:4;stroke-dasharray:10 8'
                               : 'fill:rgba(var(--btn-rgb),1);stroke:rgba(var(--accent-rgb),0.8);stroke-width:3' }, svg);
            const t = svgText(svg, x + W / 2, 120 + W / 2, v, String(v).length > 3 ? 36 : 48, missing ? GOLD : 'rgb(var(--text-hi-rgb))');
            [box, t].forEach(s => { s.style.transformBox = 'fill-box'; s.style.transformOrigin = 'center'; anim(s, 'tp-pop', 350, i * 160, ctx); });
            if (missing) { qBox = box; qText = t; }
            if (i < items.length - 1) {
                const sx = x + W + GAP / 2;
                const step = svgText(svg, sx, 100, '+' + diff, 22, COLORS.a);
                anim(step, 'tp-fade', 400, 500 + i * 160, ctx);
            }
        });
        await ctx.wait(items.length * 160 + 700);
        if (spec.reveal !== undefined && qBox && ctx.alive()) {
            await ctx.wait(500);
            qText.textContent = spec.reveal;
            qText.setAttribute('fill', COLORS.c);
            qBox.style.stroke = COLORS.c; qBox.style.strokeDasharray = 'none';
            [qBox, qText].forEach(s => anim(s, 'tp-pop', 450, 0, ctx));
            await ctx.wait(800);
        } else if (qBox) {
            qBox.style.animation = 'tp-pulse 1.2s ease-in-out infinite';
        }
    };

    // ---- analog clock (minuteNumbers shows 5, 10, 15... around the outside) ----
    const clock = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const CX = 230, CY = 180, R = 140;
        sv('circle', { cx: CX, cy: CY, r: R, style: 'fill:var(--field-inner);stroke:rgb(var(--text-rgb));stroke-width:5' }, svg);
        for (let i = 0; i < 60; i++) {
            const ang = (i * 6 * Math.PI) / 180, long = i % 5 === 0;
            sv('line', { x1: CX + Math.sin(ang) * (R - 6), y1: CY - Math.cos(ang) * (R - 6),
                x2: CX + Math.sin(ang) * (R - (long ? 18 : 11)), y2: CY - Math.cos(ang) * (R - (long ? 18 : 11)),
                style: 'stroke:rgba(var(--text-rgb),' + (long ? 0.9 : 0.4) + ');stroke-width:' + (long ? 3 : 1.5) }, svg);
        }
        for (let n = 1; n <= 12; n++) {
            const ang = (n * 30 * Math.PI) / 180;
            const t = svgText(svg, CX + Math.sin(ang) * (R - 40), CY - Math.cos(ang) * (R - 40), n, 28);
            t.style.transformBox = 'fill-box'; t.style.transformOrigin = 'center';
            anim(t, 'tp-pop', 300, n * 45, ctx);
            if (spec.minuteNumbers) {
                const m = svgText(svg, CX + Math.sin(ang) * (R + 20), CY - Math.cos(ang) * (R + 20), n * 5, 17, COLORS.b);
                anim(m, 'tp-fade', 400, 500 + n * 60, ctx);
            }
        }

        const show = spec.show || 'both';
        const hl = spec.highlight;
        const angles = (h, m) => ({ min: m * 6, hour: (h % 12) * 30 + m * 0.5 });
        const to = angles(spec.h || 12, spec.m || 0);
        const from = spec.fromH !== undefined ? angles(spec.fromH, spec.fromM || 0) : to;

        const makeHand = (len, width, name) => {
            const g = sv('g', {}, svg);
            g.style.transformOrigin = CX + 'px ' + CY + 'px';
            const on = hl === name || hl === 'both';
            const dim = hl && !on;
            sv('line', { x1: CX, y1: CY + 12, x2: CX, y2: CY - len, 'stroke-linecap': 'round',
                style: 'stroke:' + (on ? 'rgb(var(--accent-hi-rgb))' : 'rgb(var(--text-hi-rgb))') + ';stroke-width:' + width +
                       ';opacity:' + (dim ? 0.4 : 1) + (on ? ';filter:drop-shadow(0 0 6px rgba(var(--accent-hi-rgb),0.9))' : '') }, g);
            return g;
        };
        const hands = [];
        if (show === 'hour' || show === 'both') hands.push(['hour', makeHand(78, 11, 'hour')]);
        if (show === 'both') hands.push(['min', makeHand(112, 6, 'minute')]);
        sv('circle', { cx: CX, cy: CY, r: 9, style: 'fill:rgb(var(--text-hi-rgb))' }, svg);

        const setAngles = (set) => hands.forEach(([k, g]) => { g.style.transform = 'rotate(' + set[k] + 'deg)'; });
        setAngles(from);
        if (hands.length) anim(hands[0][1], 'tp-fade', 400, 300, ctx);

        if (hands.length) {
            const lg = sv('g', {}, svg);
            const rows = [['short hand: hours', 8]];
            if (show === 'both') rows.push(['long hand: minutes', 4]);
            rows.forEach(([text, w], i) => {
                sv('line', { x1: 410, y1: 70 + i * 36, x2: 440, y2: 70 + i * 36, 'stroke-linecap': 'round',
                    style: 'stroke:rgb(var(--text-hi-rgb));stroke-width:' + w }, lg);
                const t = sv('text', { x: 452, y: 70 + i * 36, 'font-size': 20, 'dominant-baseline': 'central',
                    fill: 'rgb(var(--text-rgb))' }, lg);
                t.textContent = text;
            });
            anim(lg, 'tp-fade', 500, 500, ctx);
        }
        if (spec.label) {
            const lab = svgText(svg, 500, 250, spec.label, 64, COLORS.c);
            anim(lab, 'tp-pop', 500, 400, ctx);
        }

        await ctx.wait(700);
        if (spec.fromH !== undefined && ctx.instant) {
            setAngles(to);
        } else if (spec.fromH !== undefined && ctx.alive()) {
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
            hands.forEach(([, g]) => { g.style.transition = ctx.instant ? 'none' : 'transform ' + (1600 / ctx.speed) + 'ms ease-in-out'; });
            setAngles(to);
            await ctx.wait(1900);
        }
    };

    // ---- fraction bars (items may differ in parts; string labels are shown as plain text) ----
    const fractionbar = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const items = spec.items;
        const BARW = items.length > 5 ? 120 : 140, OPW = 50, BY = 110, BH = 70;
        const widths = items.map(it => (it.op ? OPW : BARW));
        const total = widths.reduce((s, w) => s + w, 0);
        let x = (640 - total) / 2;
        const nums = [], dens = [];
        let firstLabelX = 0;

        items.forEach((it, idx) => {
            const w = widths[idx];
            if (it.op) {
                const t = svgText(svg, x + w / 2, BY + BH / 2, it.op, 44, 'rgb(var(--text-hi-rgb))');
                anim(t, 'tp-fade', 400, idx * 200, ctx);
            } else {
                const color = COLORS[it.color || 'a'];
                const pw = w / it.parts;
                const grp = sv('g', {}, svg);
                anim(grp, 'tp-fade', 400, idx * 200, ctx);
                for (let p = 0; p < it.parts; p++) {
                    const r = sv('rect', { x: x + p * pw, y: BY, width: pw, height: BH,
                        style: 'stroke:rgb(var(--text-hi-rgb));stroke-width:3;fill:' + (p < it.fill ? color : 'rgba(255,255,255,0.05)') }, grp);
                    if (it.pop && p < it.fill) {
                        r.style.transformBox = 'fill-box'; r.style.transformOrigin = 'center';
                        anim(r, 'tp-pop', 350, 400 + p * 220, ctx);
                    }
                }
                const cx = x + w / 2;
                if (!firstLabelX) firstLabelX = cx;
                if (Array.isArray(it.label)) {
                    const n = svgText(svg, cx, 218, it.label[0], 34, 'rgb(var(--text-hi-rgb))');
                    sv('line', { x1: cx - 22, y1: 241, x2: cx + 22, y2: 241, style: 'stroke:rgb(var(--text-hi-rgb));stroke-width:3' }, svg);
                    const d = svgText(svg, cx, 266, it.label[1], 34, 'rgb(var(--text-hi-rgb))');
                    nums.push(n); dens.push(d);
                    [n, d].forEach(t => anim(t, 'tp-fade', 400, idx * 200 + 200, ctx));
                } else if (it.label === '?') {
                    anim(svgText(svg, cx, 240, '?', 44, GOLD), 'tp-fade', 400, idx * 200 + 200, ctx);
                } else if (it.label !== undefined) {
                    anim(svgText(svg, cx, 240, it.label, 34, 'rgb(var(--text-hi-rgb))'), 'tp-fade', 400, idx * 200 + 200, ctx);
                }
            }
            x += w;
        });

        const mark = (list, on) => list.forEach(t => {
            if (!on) return;
            t.setAttribute('fill', GOLD);
            t.style.transformBox = 'fill-box'; t.style.transformOrigin = 'center';
            t.style.animation = 'tp-pulse 1.1s ease-in-out infinite';
        });

        if (spec.callouts && nums.length) {
            const c1 = sv('text', { x: firstLabelX + 50, y: 218, 'font-size': 19, 'dominant-baseline': 'central', fill: GOLD }, svg);
            c1.textContent = '← top: how many parts we have';
            const c2 = sv('text', { x: firstLabelX + 50, y: 266, 'font-size': 19, 'dominant-baseline': 'central', fill: COLORS.a }, svg);
            c2.textContent = '← bottom: equal parts in all';
            anim(c1, 'tp-fade', 500, 700, ctx); anim(c2, 'tp-fade', 500, 1400, ctx);
            await ctx.wait(2100);
        }
        await ctx.wait(items.length * 200 + 500);
        if (!ctx.alive()) return;
        mark(nums, spec.highlight === 'tops');
        mark(dens, spec.highlight === 'bottoms');
        if (spec.eq) {
            const e = svgText(svg, 320, 326, spec.eq, 38, 'rgb(var(--accent-hi-rgb))');
            anim(e, 'tp-pop', 450, 0, ctx);
        }
        await ctx.wait(items.some(it => it.pop) ? 1500 : 600);
    };

    const CORE = { tenframe, numberline, sequence, clock, fractionbar };

    window.MPTutorialKit = { sv, el, svgText, makeSvg, anim, fmtNum, COLORS, GOLD, reduceMotion };
    window.MPTutorialScenes = window.MPTutorialScenes || {};

    // ======================= player =======================

    const start = (root, topicId, opts) => {
        opts = opts || {};
        const SCENES = Object.assign({}, CORE, window.MPTutorialScenes);
        const topic = MPTutorials.topic(topicId);
        const lesson = MPTutorials.lesson(topicId);
        root.innerHTML = '';
        if (!topic || !lesson) {
            el('p', 'tp-missing', 'That tutorial is not available yet.', root);
            el('a', 'tp-btn', 'See all tutorials', root).href = 'tutorials.html';
            return;
        }

        const state = { step: 0, token: 0, done: false, speed: 1,
                        voice: localStorage.getItem('mpTutorialVoice') === '1' };
        const canSpeak = 'speechSynthesis' in window;
        const steps = lesson.steps;

        // ---- layout ----
        const head = el('header', 'tp-head', undefined, root);
        const back = el(opts.embed ? 'button' : 'a', 'tp-back', opts.embed ? '✕ Close' : '← All tutorials', head);
        if (opts.embed) back.type = 'button'; else back.href = 'tutorials.html';
        const titleBox = el('div', 'tp-titlebox', undefined, head);
        el('div', 'tp-group', topic.group, titleBox);
        el('h1', 'tp-title', topic.title, titleBox);

        const stageWrap = el('div', 'tp-stagewrap', undefined, root);
        const stage = el('div', 'tp-stage', undefined, stageWrap);
        const caption = el('p', 'tp-caption', undefined, root);
        caption.setAttribute('aria-live', 'polite');

        const dots = el('div', 'tp-dots', undefined, root);
        const dotBtns = steps.map((_, i) => {
            const d = el('button', 'tp-dot', undefined, dots);
            d.type = 'button';
            d.setAttribute('aria-label', 'Go to step ' + (i + 1) + ' of ' + steps.length);
            d.addEventListener('click', () => goto(i));
            return d;
        });

        const controls = el('div', 'tp-controls', undefined, root);
        const mk = (label, cls) => { const b = el('button', 'tp-btn ' + (cls || ''), label, controls); b.type = 'button'; return b; };
        const bBack = mk('‹ Back');
        const bReplay = mk('↻ Replay');
        const bNext = mk('Next ›', 'tp-next');
        const opts2 = el('div', 'tp-opts', undefined, controls);
        const bSpeed = el('button', 'tp-mini', 'Speed: normal', opts2); bSpeed.type = 'button';
        const bVoice = el('button', 'tp-mini', undefined, opts2); bVoice.type = 'button';
        if (!canSpeak) bVoice.hidden = true;

        const turnBar = el('div', 'tp-turnbar', undefined, root);
        const bTurn = el('button', 'tp-btn tp-primary', 'Your turn ›', turnBar);
        bTurn.type = 'button';
        turnBar.hidden = true;

        const tryPanel = el('section', 'tp-try', undefined, root);
        tryPanel.hidden = true;

        // ---- speech ----
        const speak = (text) => new Promise(resolve => {
            if (!state.voice || !canSpeak) return resolve();
            try {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(text);
                u.rate = 0.9; u.lang = 'en-US';
                u.onend = u.onerror = () => resolve();
                window.speechSynthesis.speak(u);
            } catch (e) { resolve(); }
        });
        const stopSpeaking = () => { try { if (canSpeak) window.speechSynthesis.cancel(); } catch (e) {} };

        // ---- state -> buttons ----
        const isLast = () => state.step >= steps.length - 1;
        const hasTry = !!(lesson.tryIt && lesson.tryIt.length);
        const syncUi = () => {
            bBack.disabled = state.step === 0;
            bNext.disabled = isLast();
            // The cue: once the animation has finished, light up what comes next.
            bNext.classList.toggle('ready', state.done && !isLast());
            bTurn.classList.toggle('ready', state.done && isLast());
            bVoice.textContent = 'Read aloud: ' + (state.voice ? 'on' : 'off');
            bVoice.setAttribute('aria-pressed', String(state.voice));
            bSpeed.textContent = 'Speed: ' + (state.speed === 1 ? 'normal' : 'slow');
            dotBtns.forEach((d, i) => { d.classList.toggle('on', i === state.step); d.classList.toggle('done', i < state.step); });
            turnBar.hidden = !(isLast() && hasTry);
        };

        // ---- playing a step ----
        const goto = async (i) => {
            const id = ++state.token;
            state.step = Math.max(0, Math.min(steps.length - 1, i));
            state.done = false;
            const ctx = {
                get speed() { return state.speed; },
                instant: reduceMotion,
                alive: () => state.token === id,
                wait: (ms) => new Promise(r => setTimeout(r, ctx.instant ? 0 : ms / state.speed)),
            };
            const s = steps[state.step];
            stopSpeaking();
            caption.textContent = s.say;
            caption.classList.remove('in'); void caption.offsetWidth; caption.classList.add('in');
            syncUi();

            const spoken = speak(s.say);
            try { await SCENES[s.scene.kind](stage, s.scene, ctx); }
            catch (e) { console.error('Tutorial scene failed', e); }
            if (!ctx.alive()) return;
            await spoken;
            if (!ctx.alive()) return;
            state.done = true;
            if (isLast()) MPTutorials.markSeen(topicId);
            syncUi();
        };

        bNext.addEventListener('click', () => goto(state.step + 1));
        bBack.addEventListener('click', () => goto(state.step - 1));
        bReplay.addEventListener('click', () => goto(state.step));
        bSpeed.addEventListener('click', () => { state.speed = state.speed === 1 ? 0.6 : 1; syncUi(); });
        bVoice.addEventListener('click', () => {
            state.voice = !state.voice;
            localStorage.setItem('mpTutorialVoice', state.voice ? '1' : '0');
            if (!state.voice) stopSpeaking();
            syncUi();
        });
        back.addEventListener('click', () => { if (opts.embed) opts.onClose && opts.onClose(); });

        // ---- "your turn" questions ----
        const runTryIt = () => {
            state.token++;
            stopSpeaking();
            controls.hidden = true; dots.hidden = true; turnBar.hidden = true;
            tryPanel.hidden = false;
            let q = 0;

            const finish = () => {
                MPTutorials.markSeen(topicId);
                stageWrap.hidden = false;
                const svg = makeSvg(stage);
                const ring = sv('circle', { cx: 320, cy: 180, r: 90, fill: 'none', style: 'stroke:' + COLORS.c + ';stroke-width:12' }, svg);
                ring.style.transformBox = 'fill-box'; ring.style.transformOrigin = 'center';
                if (!reduceMotion) ring.style.animation = 'tp-pop 500ms ease-out both';
                const tick = sv('path', { d: 'M 280 182 L 310 212 L 365 150', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
                    style: 'stroke:' + COLORS.c + ';stroke-width:14' }, svg);
                if (!reduceMotion) { tick.style.strokeDasharray = 160; tick.style.setProperty('--len', 160); tick.style.animation = 'tp-draw 600ms ease-out 350ms both'; }
                caption.textContent = 'Great job! You are ready to practice.';
                tryPanel.innerHTML = '';
                const row = el('div', 'tp-endrow', undefined, tryPanel);
                if (opts.embed) {
                    const b = el('button', 'tp-btn tp-primary ready', 'Back to my practice', row);
                    b.type = 'button';
                    b.addEventListener('click', () => opts.onClose && opts.onClose());
                } else if (lesson.practice) {
                    const a = el('a', 'tp-btn tp-primary ready', 'Start practicing', row);
                    a.href = lesson.practice;
                }
                const again = el('button', 'tp-btn', 'Watch again', row);
                again.type = 'button';
                again.addEventListener('click', () => {
                    tryPanel.hidden = true; controls.hidden = false; dots.hidden = false; stageWrap.hidden = false;
                    goto(0);
                });
            };

            const ask = () => {
                const item = lesson.tryIt[q];
                tryPanel.innerHTML = '';
                el('div', 'tp-qcount', 'Question ' + (q + 1) + ' of ' + lesson.tryIt.length, tryPanel);
                caption.textContent = item.prompt;
                caption.classList.remove('in'); void caption.offsetWidth; caption.classList.add('in');
                stageWrap.hidden = !item.scene;
                if (item.scene) SCENES[item.scene.kind](stage, item.scene, { instant: true, speed: 1, alive: () => true, wait: () => Promise.resolve() });
                else stage.innerHTML = '';
                const choices = el('div', 'tp-choices', undefined, tryPanel);
                const msg = el('p', 'tp-feedback', undefined, tryPanel);
                msg.setAttribute('aria-live', 'polite');
                let solved = false;
                item.choices.forEach(c => {
                    const b = el('button', 'tp-choice', c, choices);
                    b.type = 'button';
                    b.addEventListener('click', () => {
                        if (solved) return;
                        if (c === item.answer) {
                            solved = true;
                            b.classList.add('right');
                            msg.textContent = 'Yes! ' + (q + 1 < lesson.tryIt.length ? '' : 'You did it!');
                            msg.className = 'tp-feedback ok';
                            setTimeout(() => { q++; if (q < lesson.tryIt.length) ask(); else finish(); }, 1100);
                        } else {
                            b.classList.add('wrong'); b.disabled = true;
                            msg.textContent = 'Not quite. Hint: ' + item.hint;
                            msg.className = 'tp-feedback bad';
                        }
                    });
                });
            };
            ask();
        };
        bTurn.addEventListener('click', runTryIt);

        // keyboard: arrows move between steps; Space or Enter takes the highlighted next action
        root.ownerDocument.addEventListener('keydown', (e) => {
            const onControl = e.target.closest && e.target.closest('button, a, input');
            if (e.key === 'Escape' && opts.embed) { opts.onClose && opts.onClose(); return; }
            if (!tryPanel.hidden || onControl) return;
            if (e.key === 'ArrowRight') { if (!isLast()) goto(state.step + 1); }
            else if (e.key === 'ArrowLeft') { if (state.step > 0) goto(state.step - 1); }
            else if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                if (!isLast()) goto(state.step + 1); else if (hasTry && state.done) runTryIt();
            }
        });

        goto(0);
    };

    window.MPTutorialPlayer = { start, scenes: () => Object.assign({}, CORE, window.MPTutorialScenes) };
})();
