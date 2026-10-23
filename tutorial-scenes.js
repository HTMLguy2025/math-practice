// Extra scene kinds for the tutorial player (see tutorial-player.js for the
// contract). Each one registers in window.MPTutorialScenes:
//
//   lines        worked steps as text, with fractions and colours   {lines[], reveal, size}
//   columns      column addition / subtraction, decimals too        {op, a, b, upto, done}
//   longmult     multiplying on paper, partial products              {a, b, upto, sum, done}
//   longdiv      long division with the bracket                      {divisor, dividend, upto, extra, done}
//   stack        right-aligned numbers with a rule                   {rows[], reveal}
//   array        rows x columns of dots                             {rows, cols, runTotals, eq}
//   share        dealing items out equally                          {total, groups, phase}
//   takeaway     crossing items out                                 {total, away, phase}
//   pairs        odd / even by making pairs                         {n, phase}
//   arrays       every rectangle a number can make                  {n, reveal, verdict}
//   coins        coins and bills with a running total               {items[cents], reveal, names}
//   bargraph     bar graph, optional reading line                   {title, cats, vals, max, step, highlight, read, eq}
//   picturegraph picture graph with a key                           {title, rows[{name,n}], each, highlight, eq}
//   piegraph     pie graph                                          {slices[{name,pct}], highlight, eq}
//   grid100      hundred square (fractions, decimals, percents)     {fill, lines[], eq}
//   fracline     fractions on a 0-1 number line                     {den, mark, hops, alsoMark, label}
//   placevalue   place-value columns with blocks                    {digits, upto, highlight}
//   rect         perimeter, area and half of a rectangle            {w, h, show, eq}
//   circle       radius, diameter, circumference, area              {show}
//   angle        angles, optional protractor                        {deg, protractor, rest, name}
//   symmetry     folding and lines of symmetry                      {shape, lines, fold, wrong, count}
//   polygon      shapes by sides, ticks and right angles            {sides|points, items, count, name}
//   coordplane   a coordinate grid with a walked path               {points, walk}
//   prism        a box built from unit cubes                        {l, w, h, layers}
(() => {
    'use strict';
    const K = window.MPTutorialKit;
    const { sv, el, svgText, makeSvg, anim, fmtNum, COLORS, GOLD } = K;
    const S = window.MPTutorialScenes;
    const TXT = 'rgb(var(--text-hi-rgb))';
    const SOFT = 'rgb(var(--text-rgb))';
    const popOf = (n) => { n.style.transformBox = 'fill-box'; n.style.transformOrigin = 'center'; return n; };
    const eqText = (svg, spec, ctx, y) => {
        if (!spec.eq) return;
        anim(svgText(svg, 320, y || 334, spec.eq, 34, 'rgb(var(--accent-hi-rgb))'), 'tp-pop', 450, 300, ctx);
    };

    // ======================= lines (HTML) =======================
    // Markup: [3/4] fraction, [(3/4)/5] fraction over a whole number, {a:text} colour (a b c y), x^2 power.
    const MARK_SRC = /\[\((-?[\w.]+)\/([\w.]+)\)\/([\w.]+)\]|\[(-?[\w.]+)\/([\w.]+)\]|\{([abcdy]):([^}]*)\}|\^(-?\w+)/.source;
    const minus = (s) => String(s).replace(/-/g, '−');
    const frac = (parent, n, d, big) => {
        const f = el('span', 'frac' + (big ? ' big' : ''), undefined, parent);
        el('span', 'n', undefined, f).append(typeof n === 'string' ? document.createTextNode(minus(n)) : n);
        el('span', 'd', minus(d), f);
        return f;
    };
    const markup = (text, parent) => {
        let last = 0, m;
        const MARK = new RegExp(MARK_SRC, 'g');   // fresh per call: markup() recurses into colours
        while ((m = MARK.exec(text))) {
            if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
            if (m[1] !== undefined) {
                const inner = document.createElement('span');
                frac(inner, m[1], m[2]);
                frac(parent, inner, m[3], true);
            } else if (m[4] !== undefined) {
                frac(parent, m[4], m[5]);
            } else if (m[6] !== undefined) {
                const s = el('span', 'c-' + m[6], undefined, parent);
                markup(m[7], s);
            } else if (m[8] !== undefined) {
                el('sup', undefined, minus(m[8]), parent);
            }
            last = MARK.lastIndex;
        }
        if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
    };

    S.lines = async (stage, spec, ctx) => {
        stage.innerHTML = '';
        const box = el('div', 'tp-lines' + (spec.size ? ' ' + spec.size : ''), undefined, stage);
        const reveal = spec.reveal === undefined ? spec.lines.length : spec.reveal;
        spec.lines.slice(0, reveal).forEach((ln, i) => {
            const obj = typeof ln === 'string' ? { t: ln } : ln;
            const row = el('div', 'tp-line' + (obj.dim ? ' dim' : ''), undefined, box);
            markup(obj.t, row);
            if (!ctx.instant && i === reveal - 1) row.style.animation = 'tp-rise 550ms ease-out both';
        });
        await ctx.wait(800);
    };

    // ======================= columns =======================
    S.columns = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const add = spec.op === '+';
        const split = (s) => { const p = String(s).split('.'); return { i: p[0], d: p[1] || '' }; };
        const A = split(spec.a), B = split(spec.b);
        const dec = Math.max(A.d.length, B.d.length);
        const intLen = Math.max(A.i.length, B.i.length);
        const digitsOf = (P) => (P.i.padStart(intLen, '0') + P.d.padEnd(dec, '0')).split('').map(Number);
        const fakeOf = (P) => (P.i.padStart(intLen, '0').split('').map((_, k) => k < intLen - P.i.length)
            .concat(P.d.padEnd(dec, '0').split('').map((_, k) => k >= P.d.length)));
        const a = digitsOf(A), b = digitsOf(B), fa = fakeOf(A), fb = fakeOf(B);
        const n = a.length;

        // work out every column, right to left
        const steps = [];
        let carry = 0;
        for (let c = n - 1; c >= 0; c--) {
            if (add) {
                const sum = a[c] + b[c] + carry;
                steps.push({ col: c, digit: sum % 10, out: sum >= 10 ? 1 : 0, sum, carryIn: carry });
                carry = sum >= 10 ? 1 : 0;
            } else {
                let d = a[c] - carry - b[c], out = 0;
                if (d < 0) { d += 10; out = 1; }
                steps.push({ col: c, digit: d, out, carryIn: carry });
                carry = out;
            }
        }
        const lead = add && carry ? 1 : 0;

        const CW = 58, DP = 24, ROW = { carry: 84, top: 140, bot: 208, line: 244, res: 304 };
        // room is always kept for a carried-out digit on the left and the sign on the right
        const left = 320 - ((n - 1) * CW + (dec ? DP : 0)) / 2;
        const xOf = (c) => left + c * CW + (dec && c >= intLen ? DP : 0);
        const upto = Math.min(spec.upto || 0, steps.length);
        const finished = upto === steps.length;
        const focus = !spec.done && upto > 0 ? steps[upto - 1].col : (upto === 0 ? n - 1 : -1);

        if (focus >= 0) {
            const hl = sv('rect', { x: xOf(focus) - CW / 2 + 3, y: 100, width: CW - 6, height: 226, rx: 10,
                style: 'fill:rgba(var(--accent-rgb),0.16);stroke:rgba(var(--accent-rgb),0.6);stroke-width:2' }, svg);
            anim(hl, 'tp-fade', 350, 0, ctx);
        }
        const digit = (x, y, v, fake, color, size) => svgText(svg, x, y, v, size || 54, color || (fake ? 'rgba(var(--text-rgb),0.35)' : TXT));
        for (let c = 0; c < n; c++) {
            digit(xOf(c), ROW.top, a[c], fa[c]);
            digit(xOf(c), ROW.bot, b[c], fb[c]);
        }
        if (dec) {
            const px = left + intLen * CW - CW / 2 + DP / 2 + 2;
            [ROW.top, ROW.bot, ROW.res].forEach(y => svgText(svg, px, y + 8, '.', 54, TXT));
        }
        // the sign sits after the bottom number, as it is written on paper here
        svgText(svg, xOf(n - 1) + CW, ROW.bot, add ? '+' : '−', 46, 'rgb(var(--text-rgb))');
        sv('line', { x1: xOf(0) - CW + 6, y1: ROW.line, x2: xOf(n - 1) + CW * 1.5 - 6, y2: ROW.line,
            style: 'stroke:rgb(var(--text-hi-rgb));stroke-width:4;stroke-linecap:round' }, svg);

        // finished columns
        steps.slice(0, upto).forEach((st, k) => {
            const latest = k === upto - 1;
            const color = spec.done && finished ? COLORS.c : (latest ? GOLD : TXT);
            const r = digit(xOf(st.col), ROW.res, st.digit, false, color);
            if (latest) { popOf(r); anim(r, 'tp-pop', 450, 200, ctx); }
            if (st.out && st.col > 0) {
                if (add) {
                    const c1 = svgText(svg, xOf(st.col - 1), ROW.carry, '1', 30, COLORS.b);
                    if (latest) anim(c1, 'tp-pop', 400, 650, ctx);
                } else {
                    // paper borrowing: cross out the lender, write one less above it, and a small 1 in front of the borrower
                    const lx = xOf(st.col - 1), v = a[st.col - 1] - 1;
                    const cut = sv('line', { x1: lx - 14, y1: ROW.top + 16, x2: lx + 14, y2: ROW.top - 16,
                        style: 'stroke:' + COLORS.d + ';stroke-width:4;stroke-linecap:round' }, svg);
                    const nd = svgText(svg, lx, ROW.top - 48, v < 0 ? 9 : v, 30, COLORS.b);
                    if (latest) { anim(cut, 'tp-fade', 400, 450, ctx); anim(nd, 'tp-pop', 400, 650, ctx); }
                }
            }
            if (!add && st.out && a[st.col] - st.carryIn >= 0) {
                const one = svgText(svg, xOf(st.col) - (st.carryIn ? 24 : 22), ROW.top - (st.carryIn ? 48 : 30), '1', 22, COLORS.b);
                if (latest) anim(one, 'tp-pop', 400, 300, ctx);
            }
        });
        if (finished && lead) {
            const r = digit(xOf(0) - CW, ROW.res, 1, false, spec.done ? COLORS.c : GOLD);
            popOf(r); anim(r, 'tp-pop', 450, 300, ctx);
        }
        if (upto === 0) {
            const hint = svgText(svg, xOf(n - 1), ROW.res, 'start here', 20, COLORS.b);
            anim(hint, 'tp-fade', 500, 400, ctx);
        }
        await ctx.wait(1300);
    };

    // ======================= longmult (multiplying on paper) =======================
    // One single-digit multiplication per `upto`, right to left, a row of partial products
    // per digit of the bottom number (with the place-holder zeros), then the sum if `sum`.
    S.longmult = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const A = String(spec.a).split('').map(Number).reverse();     // ones first
        const B = String(spec.b).split('').map(Number).reverse();
        const n = A.length, m = B.length, W = n + m;
        const steps = [];
        for (let j = 0; j < m; j++) {
            let carry = 0;
            for (let i = 0; i < n; i++) {
                const p = A[i] * B[j] + carry;
                steps.push({ j, i, p, digit: p % 10, carry: Math.floor(p / 10), last: i === n - 1 });
                carry = Math.floor(p / 10);
            }
        }
        const upto = Math.min(spec.upto || 0, steps.length);
        const latest = upto > 0 ? steps[upto - 1] : null;
        const rows = m > 1 ? 4 + m : 4;
        const RH = Math.min(56, 322 / rows), FS = Math.min(52, RH * 0.9);
        const CW = Math.min(58, 540 / (W + 2));
        const Y = (idx) => 34 + idx * RH + RH / 2;
        const xr = 320 + ((W - 1) * CW) / 2 - CW / 2;
        const X = (k) => xr - k * CW;
        const rule = (idx, extra) => sv('line', { x1: X(W - 1) - CW / 2, y1: 34 + idx * RH, x2: xr + CW * (extra ? 1.5 : 0.5), y2: 34 + idx * RH,
            style: 'stroke:rgb(var(--text-hi-rgb));stroke-width:4;stroke-linecap:round' }, svg);
        const finished = upto === steps.length;
        const green = spec.done && finished && !spec.sum;

        A.forEach((d, i) => svgText(svg, X(i), Y(1), d, FS, latest && latest.i === i && !spec.done ? GOLD : TXT));
        B.forEach((d, j) => svgText(svg, X(j), Y(2), d, FS, latest && latest.j === j && !spec.done ? GOLD : TXT));
        svgText(svg, xr + CW, Y(2), '×', FS * 0.85, SOFT);
        rule(3, true);
        if (m > 1 && spec.sum) rule(3 + m, true);

        steps.slice(0, upto).forEach((st, k) => {
            const isLatest = k === upto - 1;
            const color = green && st.j === 0 && m === 1 ? COLORS.c : (isLatest ? GOLD : TXT);
            const t = svgText(svg, X(st.i + st.j), Y(3 + st.j), st.digit, FS, color);
            if (isLatest) { popOf(t); anim(t, 'tp-pop', 450, 200, ctx); }
            if (st.last && st.carry) {
                const t2 = svgText(svg, X(st.i + st.j + 1), Y(3 + st.j), st.carry, FS, color);
                if (isLatest) { popOf(t2); anim(t2, 'tp-pop', 450, 300, ctx); }
            } else if (!st.last && latest && st.j === latest.j && st.carry) {
                const c = svgText(svg, X(st.i + 1), Y(0), st.carry, FS * 0.55, COLORS.b);
                if (isLatest) anim(c, 'tp-pop', 400, 500, ctx);
            }
        });
        for (let j = 1; j < m; j++) {
            if (!steps.slice(0, upto).some(s => s.j === j)) continue;
            for (let z = 0; z < j; z++) svgText(svg, X(z), Y(3 + j), 0, FS, COLORS.b);
        }
        if (spec.sum && m > 1) {
            const total = String(Number(spec.a) * Number(spec.b)).split('').reverse();
            total.forEach((d, k) => {
                const t = svgText(svg, X(k), Y(3 + m), d, FS, spec.done ? COLORS.c : GOLD);
                popOf(t); anim(t, 'tp-pop', 450, 250 + k * 90, ctx);
            });
        }
        await ctx.wait(1300);
    };

    // ======================= longdiv (long division with the bracket) =======================
    // One working step per `upto`: quotient digit, product, line, remainder with the next digit brought down.
    // `extra` adds that many zeros after a decimal point so the division can carry on.
    S.longdiv = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const D = spec.divisor, extra = spec.extra || 0;
        const ints = String(spec.dividend).split('').map(Number), nI = ints.length;
        const digits = ints.concat(Array(extra).fill(0));
        const all = [];
        let r = 0, started = false;
        digits.forEach((d, k) => {
            const cur = r * 10 + d, q = Math.floor(cur / D);
            if (!started && q === 0 && k < digits.length - 1) { r = cur; return; }
            started = true;
            all.push({ k, cur, q, prod: q * D, rem: cur - q * D });
            r = cur - q * D;
        });
        const upto = Math.min(spec.upto || 0, all.length);
        const rows = 2 + 2 * all.length;
        const RH = Math.min(50, 330 / rows), FS = Math.min(46, RH * 0.88);
        const CW = Math.min(54, 400 / (digits.length + 1)), GAP = extra ? CW * 0.45 : 0;
        const dw = String(D).length * CW * 0.75;
        const total = dw + 26 + digits.length * CW + GAP;
        const xB = 320 - total / 2 + dw + 10;                          // the bracket
        const X = (k) => xB + 14 + CW / 2 + k * CW + (k >= nI ? GAP : 0);
        const Y = (idx) => 18 + idx * RH + RH / 2;
        const dot = (parent, y, color) => svgText(parent, (X(nI - 1) + X(nI)) / 2, y + FS * 0.2, '.', FS, color);

        svgText(svg, xB - 12, Y(1), D, FS, GOLD, { 'text-anchor': 'end' });
        sv('path', { d: 'M ' + (X(digits.length - 1) + CW / 2 + 4) + ' ' + (18 + RH) + ' L ' + xB + ' ' + (18 + RH) + ' L ' + xB + ' ' + (18 + 2 * RH),
            fill: 'none', style: 'stroke:rgb(var(--text-hi-rgb));stroke-width:4;stroke-linecap:round;stroke-linejoin:round' }, svg);
        digits.forEach((d, k) => svgText(svg, X(k), Y(1), d, FS, k >= nI ? 'rgba(var(--text-rgb),0.45)' : TXT));
        if (extra) dot(svg, Y(1), TXT);

        const final = spec.done && upto === all.length;
        all.slice(0, upto).forEach((st, s) => {
            const latest = s === upto - 1;
            const col = latest && !spec.done ? GOLD : TXT;
            const q = svgText(svg, X(st.k), Y(0), st.q, FS, final ? COLORS.c : col);
            if (latest) { popOf(q); anim(q, 'tp-pop', 450, 150, ctx); }
            if (s === 0 && st.k >= nI) svgText(svg, X(nI - 1), Y(0), 0, FS, final ? COLORS.c : TXT);
            if (extra && st.k >= nI) dot(svg, Y(0), final ? COLORS.c : TXT);
            // product row, right-aligned on this step's column, with a minus sign in front
            const ps = String(st.prod).split('');
            const first = st.k - ps.length + 1;
            const g = sv('g', {}, svg);
            ps.forEach((d, t) => svgText(g, X(first + t), Y(2 + 2 * s), d, FS, col));
            svgText(g, X(first) - CW * 0.62, Y(2 + 2 * s), '−', FS * 0.8, SOFT);
            sv('line', { x1: X(first) - CW / 2, y1: 18 + (3 + 2 * s) * RH, x2: X(st.k) + CW / 2, y2: 18 + (3 + 2 * s) * RH,
                style: 'stroke:rgb(var(--text-hi-rgb));stroke-width:3;stroke-linecap:round' }, g);
            // remainder, with the next digit brought down beside it
            const next = digits[st.k + 1];
            const hasNext = next !== undefined;
            const rs = st.rem === 0 && hasNext ? [] : String(st.rem).split('');
            const end = hasNext ? st.k + 1 : st.k;
            const chars = hasNext ? rs.concat([String(next)]) : rs;
            chars.forEach((d, t) => {
                const k2 = end - chars.length + 1 + t;
                svgText(g, X(k2), Y(3 + 2 * s), d, FS, hasNext && t === chars.length - 1 ? COLORS.b : (!hasNext && st.rem === 0 ? COLORS.c : col));
            });
            if (latest) { popOf(g); anim(g, 'tp-fade', 450, 350, ctx); }
        });
        await ctx.wait(1400);
    };

    // ======================= stack (right-aligned numbers with a rule) =======================
    // rows: strings, or {t, op, c, note}; {rule:true} draws the line.
    S.stack = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const rows = spec.rows, shown = spec.reveal === undefined ? rows.length : spec.reveal;
        const RH = Math.min(66, 300 / rows.length), FS = Math.min(54, RH * 0.85);
        const xr = 360;
        rows.slice(0, shown).forEach((rw, i) => {
            const o = typeof rw === 'string' ? { t: rw } : rw, y = 36 + i * RH + RH / 2;
            const latest = i === shown - 1;
            if (o.rule) {
                const l = sv('line', { x1: xr - 220, y1: y, x2: xr + 70, y2: y, style: 'stroke:rgb(var(--text-hi-rgb));stroke-width:4;stroke-linecap:round' }, svg);
                if (latest) anim(l, 'tp-fade', 350, 0, ctx);
                return;
            }
            const t = svgText(svg, xr, y, o.t, FS, o.c ? COLORS[o.c] : TXT, { 'text-anchor': 'end' });
            if (o.op) svgText(svg, xr + 38, y, o.op, FS * 0.85, SOFT);
            if (o.note) anim(svgText(svg, xr + 100, y, o.note, 22, SOFT, { 'text-anchor': 'start' }), 'tp-fade', 450, latest ? 400 : 0, ctx);
            if (latest) { popOf(t); anim(t, 'tp-pop', 450, 100, ctx); }
        });
        await ctx.wait(1200);
    };

    // ======================= array =======================
    S.array = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const { rows, cols } = spec;
        const P = 42, R = 16;
        const w = cols * P, x0 = 320 - w / 2 + P / 2 - (spec.runTotals ? 36 : 0), y0 = 60;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const d = sv('circle', { cx: x0 + c * P, cy: y0 + r * P, r: R, fill: r % 2 ? COLORS.b : COLORS.a }, svg);
                popOf(d); anim(d, 'tp-pop', 320, r * 380 + c * 55, ctx);
            }
            if (spec.runTotals) {
                const t = svgText(svg, x0 + cols * P + 30, y0 + r * P, (r + 1) * cols, 28, COLORS.c);
                anim(t, 'tp-fade', 400, r * 380 + cols * 55 + 100, ctx);
            }
        }
        eqText(svg, spec, ctx, Math.min(334, y0 + rows * P + 30));
        await ctx.wait(rows * 380 + cols * 55 + 700);
    };

    // ======================= share =======================
    S.share = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const { total, groups, phase } = spec;
        const src = (i) => [320 + (i % 8 - 3.5) * 40, 62 + Math.floor(i / 8) * 40];
        const pw = 600 / groups;
        const plateX = (g) => 20 + pw * g + pw / 2;
        const dest = (i) => {
            const g = i % groups, slot = Math.floor(i / groups);
            return [plateX(g) + (slot % 2 - 0.5) * 38, 252 + Math.floor(slot / 2) * 34 - 6];
        };
        for (let g = 0; g < groups; g++) {
            sv('ellipse', { cx: plateX(g), cy: 268, rx: Math.min(80, pw / 2 - 8), ry: 40,
                style: 'fill:rgba(255,255,255,0.05);stroke:rgba(var(--accent-rgb),0.7);stroke-width:3' }, svg);
        }
        const dots = [];
        for (let i = 0; i < total; i++) {
            const settled = phase === 'result';
            const [x, y] = settled ? dest(i) : src(i);
            const d = sv('circle', { cx: x, cy: y, r: 14, fill: COLORS[['a', 'b', 'c', 'd'][i % groups % 4]] }, svg);
            popOf(d);
            if (phase === 'items') anim(d, 'tp-pop', 300, i * 70, ctx);
            dots.push(d);
        }
        if (phase === 'items') { await ctx.wait(total * 70 + 500); return; }
        if (phase === 'share') {
            await ctx.wait(500);
            for (let i = 0; i < total; i++) {
                if (!ctx.alive()) return;
                const [tx, ty] = dest(i), [sx, sy] = src(i);
                if (ctx.instant) { dots[i].setAttribute('cx', tx); dots[i].setAttribute('cy', ty); continue; }
                const run = dots[i].animate([{ transform: 'translate(0,0)' }, { transform: 'translate(' + (tx - sx) + 'px,' + (ty - sy) + 'px)' }],
                    { duration: 520 / ctx.speed, easing: 'ease-in-out', fill: 'forwards' });
                run.onfinish = () => { dots[i].setAttribute('cx', tx); dots[i].setAttribute('cy', ty); run.cancel(); };
                await ctx.wait(300);
            }
            await ctx.wait(700);
            return;
        }
        for (let g = 0; g < groups; g++) {
            anim(svgText(svg, plateX(g), 322, total / groups, 34, COLORS.c), 'tp-pop', 400, g * 150, ctx);
        }
        eqText(svg, spec, ctx, 24);
        await ctx.wait(900);
    };

    // ======================= takeaway =======================
    S.takeaway = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const { total, away, phase } = spec;
        const per = Math.ceil(total / 2);
        const pos = (i) => [320 + ((i % per) - (per - 1) / 2) * 50, 100 + Math.floor(i / per) * 62];
        const gone = (i) => i >= total - away;
        const dots = [];
        for (let i = 0; i < total; i++) {
            const [x, y] = pos(i);
            const d = sv('circle', { cx: x, cy: y, r: 20, fill: COLORS.a }, svg);
            popOf(d);
            if (phase === 'items') anim(d, 'tp-pop', 320, i * 90, ctx);
            dots.push(d);
        }
        if (phase === 'items') { await ctx.wait(total * 90 + 500); return; }
        const crossed = [];
        for (let i = total - away; i < total; i++) {
            const [x, y] = pos(i);
            if (phase === 'left') dots[i].style.opacity = 0.18;
            const g = sv('g', {}, svg);
            [[-1, -1, 1, 1], [-1, 1, 1, -1]].forEach(([a1, b1, a2, b2]) => {
                const l = sv('line', { x1: x + a1 * 17, y1: y + b1 * 17, x2: x + a2 * 17, y2: y + b2 * 17,
                    style: 'stroke:' + COLORS.d + ';stroke-width:6;stroke-linecap:round' }, g);
                if (phase === 'cross' && !ctx.instant) { l.style.strokeDasharray = 50; l.style.setProperty('--len', 50); l.style.animation = 'tp-draw 300ms ease-out ' + ((i - (total - away)) * 450 + 200) + 'ms both'; }
            });
            crossed.push(g);
        }
        if (phase === 'cross') { await ctx.wait(away * 450 + 800); return; }
        const left = total - away;
        for (let i = 0; i < left; i++) dots[i].style.animation = 'tp-pulse 1.2s ease-in-out infinite';
        anim(svgText(svg, 320, 300, left + ' left', 52, COLORS.c), 'tp-pop', 450, 300, ctx);
        await ctx.wait(1000);
    };

    // ======================= pairs =======================
    S.pairs = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const { n, phase } = spec;
        const P = 56, x0 = 320 - ((n - 1) * P) / 2, y = 150;
        for (let i = 0; i < n; i++) {
            const d = sv('circle', { cx: x0 + i * P, cy: y, r: 20, fill: COLORS.a }, svg);
            popOf(d); anim(d, 'tp-pop', 320, phase === 'items' ? i * 110 : 0, ctx);
        }
        if (phase === 'items') {
            anim(svgText(svg, 320, 250, n + ' dots', 40), 'tp-fade', 400, n * 110, ctx);
            await ctx.wait(n * 110 + 600); return;
        }
        const pairs = Math.floor(n / 2);
        for (let p = 0; p < pairs; p++) {
            const r = sv('rect', { x: x0 + p * 2 * P - 26, y: y - 30, width: P + 52, height: 60, rx: 30, fill: 'none',
                style: 'stroke:' + COLORS.c + ';stroke-width:4' }, svg);
            anim(r, 'tp-fade', 400, p * 450, ctx);
        }
        if (n % 2) {
            const lone = sv('circle', { cx: x0 + (n - 1) * P, cy: y, r: 30, fill: 'none',
                style: 'stroke:' + GOLD + ';stroke-width:4;stroke-dasharray:8 6' }, svg);
            anim(lone, 'tp-fade', 400, pairs * 450, ctx);
            anim(svgText(svg, x0 + (n - 1) * P, y + 66, 'no partner', 20, GOLD), 'tp-fade', 400, pairs * 450 + 200, ctx);
        }
        anim(svgText(svg, 320, 285, n + (n % 2 ? ' is odd' : ' is even'), 46, n % 2 ? GOLD : COLORS.c), 'tp-pop', 450, pairs * 450 + 400, ctx);
        await ctx.wait(pairs * 450 + 1200);
    };

    // ======================= arrays (every rectangle for a number) =======================
    S.arrays = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const n = spec.n;
        const arr = [];
        for (let r = 1; r * r <= n; r++) if (n % r === 0) arr.push([r, n / r]);
        const shown = spec.reveal === undefined ? arr.length : spec.reveal;
        const gap = 54;
        const P = Math.max(14, Math.min(38, (590 - gap * (arr.length - 1)) / arr.reduce((s, [, c]) => s + c, 0)));
        const widths = arr.map(([, c]) => c * P);
        const total = widths.reduce((s, w) => s + w, 0) + gap * (arr.length - 1);
        let x = 320 - total / 2;
        arr.forEach(([r, c], k) => {
            if (k < shown) {
                const g = sv('g', {}, svg);
                for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
                    sv('circle', { cx: x + j * P + P / 2, cy: 110 + i * P, r: P * 0.38, fill: COLORS[['a', 'b', 'c'][k % 3]] }, g);
                }
                anim(g, 'tp-pop', 450, k * 500, ctx);
                popOf(g);
                anim(svgText(svg, x + (c * P) / 2, 110 + r * P + 20, r + ' × ' + c, 28), 'tp-fade', 400, k * 500 + 250, ctx);
            }
            x += c * P + gap;
        });
        if (spec.verdict) {
            const word = spec.verdict === 'prime' ? 'only 1 way: prime' : spec.verdict === 'composite' ? arr.length + ' ways: composite' : spec.verdict;
            anim(svgText(svg, 320, 300, word, 38, spec.verdict === 'prime' ? COLORS.b : COLORS.c), 'tp-pop', 450, shown * 500 + 300, ctx);
        }
        await ctx.wait(shown * 500 + 1100);
    };

    // ======================= coins =======================
    const COIN = {
        1:    { r: 24, fill: '#b87333', text: '1¢', name: 'penny' },
        5:    { r: 28, fill: '#aeb4bb', text: '5¢', name: 'nickel' },
        10:   { r: 23, fill: '#c9d3da', text: '10¢', name: 'dime' },
        25:   { r: 33, fill: '#d6dadf', text: '25¢', name: 'quarter' },
        100:  { bill: true, fill: '#4a7c4e', text: '$1' },
        500:  { bill: true, fill: '#4a7c4e', text: '$5' },
        1000: { bill: true, fill: '#4a7c4e', text: '$10' },
        2000: { bill: true, fill: '#4a7c4e', text: '$20' },
    };
    const money = (c) => (c < 100 ? c + '¢' : '$' + (c / 100).toFixed(2));
    S.coins = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const items = spec.items;
        const shown = spec.reveal === undefined ? items.length : spec.reveal;
        // flow the items into rows
        let x = 40, y = 110, rowH = 0;
        const place = items.map(c => {
            const d = COIN[c], w = d.bill ? 112 : d.r * 2, h = d.bill ? 58 : d.r * 2;
            if (x + w > 610) { x = 40; y += rowH + 34; rowH = 0; }
            const p = { c, d, cx: x + w / 2, cy: y + h / 2, w, h };
            x += w + 16; rowH = Math.max(rowH, h);
            return p;
        });
        // centre the first row horizontally when everything fits on one row
        const maxX = Math.max(...place.map(p => p.cx + p.w / 2));
        const shift = place.every(p => p.cy === place[0].cy) ? (640 - (maxX + 40)) / 2 : 0;
        let sum = 0;
        place.forEach((p, i) => {
            if (i >= shown) return;
            sum += p.c;
            const g = sv('g', {}, svg);
            if (p.d.bill) {
                sv('rect', { x: p.cx - p.w / 2 + shift, y: p.cy - p.h / 2, width: p.w, height: p.h, rx: 6,
                    style: 'fill:' + p.d.fill + ';stroke:#cfe8d0;stroke-width:3' }, g);
                svgText(g, p.cx + shift, p.cy, p.d.text, 28, '#fff');
            } else {
                sv('circle', { cx: p.cx + shift, cy: p.cy, r: p.d.r, style: 'fill:' + p.d.fill + ';stroke:rgba(0,0,0,0.35);stroke-width:3' }, g);
                svgText(g, p.cx + shift, p.cy, p.d.text, p.d.r > 26 ? 20 : 17, '#222');
            }
            if (spec.names && p.d.name) svgText(g, p.cx + shift, p.cy + p.d.r + 20, p.d.name, 18, SOFT);
            popOf(g); anim(g, 'tp-pop', 350, i * 380, ctx);
            if (spec.hideTotal) return;
            const run = svgText(svg, p.cx + shift, p.cy - (p.d.bill ? 46 : p.d.r + 20), money(sum), 22, GOLD);
            anim(run, 'tp-fade', 350, i * 380 + 250, ctx);
        });
        if (!spec.hideTotal) anim(svgText(svg, 320, 330, 'Total: ' + money(sum), 40, COLORS.c), 'tp-pop', 450, shown * 380 + 200, ctx);
        await ctx.wait(shown * 380 + 900);
    };

    // ======================= graphs =======================
    S.bargraph = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const { cats, vals } = spec;
        const X0 = 100, X1 = 600, Y0 = 290, Y1 = 78;
        const max = spec.max || Math.max(...vals), step = spec.step || 1;
        const yOf = (v) => Y0 - ((Y0 - Y1) * v) / max;
        const hl = [].concat(spec.highlight === undefined ? [] : spec.highlight);
        if (spec.title) svgText(svg, 350, 40, spec.title, 24, SOFT);
        for (let v = 0; v <= max; v += step) {
            sv('line', { x1: X0, y1: yOf(v), x2: X1, y2: yOf(v), style: 'stroke:rgba(var(--text-rgb),' + (v ? 0.14 : 0.7) + ');stroke-width:' + (v ? 1 : 3) }, svg);
            svgText(svg, X0 - 18, yOf(v), v, 18, SOFT);
        }
        sv('line', { x1: X0, y1: Y1 - 6, x2: X0, y2: Y0, style: 'stroke:rgba(var(--text-rgb),0.7);stroke-width:3' }, svg);
        const bw = Math.min(70, (X1 - X0) / cats.length - 20), pitch = (X1 - X0) / cats.length;
        cats.forEach((c, i) => {
            const cx = X0 + pitch * i + pitch / 2, top = yOf(vals[i]);
            const dim = hl.length && !hl.includes(i);
            const bar = sv('rect', { x: cx - bw / 2, y: top, width: bw, height: Y0 - top, rx: 4,
                style: 'fill:' + COLORS[['a', 'b', 'c', 'd'][i % 4]] + ';opacity:' + (dim ? 0.3 : 1) + (hl.includes(i) ? ';stroke:' + GOLD + ';stroke-width:4' : '') }, svg);
            bar.style.transformBox = 'fill-box'; bar.style.transformOrigin = 'bottom';
            if (!ctx.instant) bar.style.animation = 'tp-grow 600ms ease-out ' + i * 140 + 'ms both';
            svgText(svg, cx, Y0 + 24, c, 19, dim ? 'rgba(var(--text-rgb),0.5)' : TXT);
        });
        const wait = cats.length * 140 + 800;
        await ctx.wait(wait);
        if (spec.read !== undefined && ctx.alive()) {
            const i = spec.read, cx = X0 + pitch * i + pitch / 2, yy = yOf(vals[i]);
            const h = sv('line', { x1: cx, y1: yy, x2: X0, y2: yy, style: 'stroke:' + GOLD + ';stroke-width:3;stroke-dasharray:8 6' }, svg);
            if (!ctx.instant) { h.style.strokeDasharray = '8 6'; anim(h, 'tp-fade', 500, 0, ctx); }
            const t = svgText(svg, X0 - 18, yy, vals[i], 22, GOLD);
            anim(t, 'tp-pop', 400, 400, ctx);
            await ctx.wait(900);
        }
        eqText(svg, spec, ctx, 340);
        if (spec.eq) await ctx.wait(700);
    };

    S.picturegraph = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const rows = spec.rows, each = spec.each || 1;
        const hl = [].concat(spec.highlight === undefined ? [] : spec.highlight);
        if (spec.title) svgText(svg, 320, 34, spec.title, 24, SOFT);
        const key = sv('g', {}, svg);
        sv('rect', { x: 456, y: 56, width: 160, height: 40, rx: 8, style: 'fill:rgba(255,255,255,0.05);stroke:rgba(var(--accent-rgb),0.6);stroke-width:2' }, key);
        sv('circle', { cx: 480, cy: 76, r: 12, fill: COLORS.b }, key);
        svgText(key, 548, 76, '= ' + each + ' ' + (spec.unit || (each === 1 ? 'student' : 'students')), 17, TXT);
        anim(key, 'tp-fade', 500, 0, ctx);
        const RH = 62, y0 = 128;
        rows.forEach((r, i) => {
            const y = y0 + i * RH;
            const dim = hl.length && !hl.includes(i);
            svgText(svg, 70, y, r.name, 22, dim ? 'rgba(var(--text-rgb),0.5)' : TXT, { 'text-anchor': 'middle' });
            for (let k = 0; k < r.n; k++) {
                const c = sv('circle', { cx: 150 + k * 40, cy: y, r: 14, fill: COLORS.b,
                    style: 'opacity:' + (dim ? 0.3 : 1) + (hl.includes(i) ? ';stroke:' + GOLD + ';stroke-width:3' : '') }, svg);
                popOf(c); anim(c, 'tp-pop', 300, i * 250 + k * 90, ctx);
            }
        });
        await ctx.wait(rows.length * 250 + 800);
        eqText(svg, spec, ctx, 340);
        if (spec.eq) await ctx.wait(700);
    };

    S.piegraph = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const sl = spec.slices;
        const CX = 215, CY = 188, R = 120;
        const hl = [].concat(spec.highlight === undefined ? [] : spec.highlight);
        let ang = -Math.PI / 2;
        sl.forEach((s, i) => {
            const a1 = ang, a2 = ang + (s.pct / 100) * Math.PI * 2, mid = (a1 + a2) / 2;
            const ox = hl.includes(i) ? Math.cos(mid) * 16 : 0, oy = hl.includes(i) ? Math.sin(mid) * 16 : 0;
            const x1 = CX + ox + R * Math.cos(a1), y1 = CY + oy + R * Math.sin(a1);
            const x2 = CX + ox + R * Math.cos(a2), y2 = CY + oy + R * Math.sin(a2);
            const dim = hl.length && !hl.includes(i);
            const p = sv('path', { d: 'M ' + (CX + ox) + ' ' + (CY + oy) + ' L ' + x1 + ' ' + y1 + ' A ' + R + ' ' + R + ' 0 ' + (s.pct > 50 ? 1 : 0) + ' 1 ' + x2 + ' ' + y2 + ' Z',
                style: 'fill:' + COLORS[['a', 'b', 'c', 'd'][i % 4]] + ';opacity:' + (dim ? 0.35 : 1) + ';stroke:rgb(var(--bg-rgb));stroke-width:3' }, svg);
            popOf(p); anim(p, 'tp-pop', 450, i * 220, ctx);
            const t = svgText(svg, CX + ox + Math.cos(mid) * R * 0.62, CY + oy + Math.sin(mid) * R * 0.62, s.pct + '%', 24, '#10101c');
            anim(t, 'tp-fade', 400, i * 220 + 300, ctx);
            // legend
            const ly = 90 + i * 52;
            sv('rect', { x: 400, y: ly - 14, width: 28, height: 28, rx: 5, style: 'fill:' + COLORS[['a', 'b', 'c', 'd'][i % 4]] + ';opacity:' + (dim ? 0.35 : 1) }, svg);
            const lt = svgText(svg, 442, ly, s.name, 24, dim ? 'rgba(var(--text-rgb),0.5)' : TXT, { 'text-anchor': 'start' });
            anim(lt, 'tp-fade', 400, i * 220 + 200, ctx);
            ang = a2;
        });
        await ctx.wait(sl.length * 220 + 800);
        eqText(svg, spec, ctx, 340);
        if (spec.eq) await ctx.wait(700);
    };

    // ======================= grid100 =======================
    S.grid100 = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const U = 28, X0 = 44, Y0 = 40;
        for (let i = 0; i < 100; i++) {
            const r = Math.floor(i / 10), c = i % 10;
            const on = i < spec.fill;
            const q = sv('rect', { x: X0 + c * U, y: Y0 + r * U, width: U - 3, height: U - 3, rx: 3,
                style: 'fill:' + (on ? COLORS[spec.color || 'a'] : 'rgba(255,255,255,0.06)') + ';stroke:rgba(var(--text-rgb),0.25);stroke-width:1' }, svg);
            if (on) { popOf(q); anim(q, 'tp-pop', 260, Math.min(i * 14, 1500), ctx); }
        }
        (spec.lines || []).forEach((t, i) => {
            const x = svgText(svg, 470, 90 + i * 56, t, i === 0 ? 46 : 28, i === 0 ? COLORS.c : TXT);
            anim(x, 'tp-fade', 450, 700 + i * 350, ctx);
        });
        eqText(svg, spec, ctx, 340);
        await ctx.wait(Math.min(spec.fill * 14, 1500) + 900 + (spec.lines || []).length * 350);
    };

    // ======================= fracline =======================
    S.fracline = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const den = spec.den, X0 = 70, X1 = 570, Y = 200;
        const px = (i) => X0 + ((X1 - X0) * i) / den;
        const l = sv('line', { x1: X0 - 14, y1: Y, x2: X1 + 14, y2: Y, style: 'stroke:rgb(var(--text-rgb));stroke-width:4;stroke-linecap:round' }, svg);
        if (!ctx.instant) { l.style.strokeDasharray = 640; l.style.setProperty('--len', 640); l.style.animation = 'tp-draw 700ms ease-out both'; }
        const stackedFrac = (cx, cy, n, d, size, color) => {
            svgText(svg, cx, cy - size * 0.55, n, size, color);
            sv('line', { x1: cx - size * 0.5, y1: cy, x2: cx + size * 0.5, y2: cy, style: 'stroke:' + color + ';stroke-width:2.5' }, svg);
            svgText(svg, cx, cy + size * 0.6, d, size, color);
        };
        for (let i = 0; i <= den; i++) {
            const t = sv('line', { x1: px(i), y1: Y - 14, x2: px(i), y2: Y + 14, style: 'stroke:rgb(var(--text-rgb));stroke-width:3' }, svg);
            popOf(t); anim(t, 'tp-pop', 300, 300 + i * 70, ctx);
            if (i === 0 || i === den) {
                anim(svgText(svg, px(i), Y + 46, i === 0 ? '0' : '1', 30, TXT), 'tp-fade', 400, 400 + i * 70, ctx);
            } else if (spec.den > 1 && spec.den <= 10 && !spec.hideLabels) {
                const g = sv('g', {}, svg);
                stackedFrac(px(i), Y + 56, i, den, 20, 'rgb(var(--text-rgb))');
                g.remove();
            }
        }
        await ctx.wait(700 + den * 70);
        if (spec.mark !== undefined && ctx.alive()) {
            const m = spec.mark;
            if (spec.hops) {
                for (let k = 1; k <= m; k++) {
                    const x0 = px(k - 1), x1 = px(k), xm = (x0 + x1) / 2;
                    const arc = sv('path', { d: 'M ' + x0 + ' ' + (Y - 12) + ' Q ' + xm + ' ' + (Y - 66) + ' ' + x1 + ' ' + (Y - 12),
                        fill: 'none', style: 'stroke:' + COLORS.a + ';stroke-width:4;stroke-linecap:round' }, svg);
                    if (!ctx.instant) { arc.style.strokeDasharray = 300; arc.style.setProperty('--len', 300); arc.style.animation = 'tp-draw 350ms ease-out both'; }
                    await ctx.wait(450);
                }
            }
            const dot = sv('circle', { cx: px(m), cy: Y, r: 15, fill: COLORS.b, style: 'stroke:rgb(var(--bg-rgb));stroke-width:3' }, svg);
            popOf(dot); anim(dot, 'tp-pop', 400, 0, ctx);
            if (spec.label !== false) {
                const g = sv('g', {}, svg);
                stackedFrac(px(m), 112, m, den, 34, COLORS.b);
                anim(g, 'tp-fade', 400, 200, ctx);
            }
            if (spec.alsoMark) {
                const { n, d } = spec.alsoMark;
                stackedFrac(px((den * n) / d), 284, n, d, 30, COLORS.c);
                const eq = svgText(svg, 320, 338, 'same spot, so they are equal', 22, COLORS.c);
                anim(eq, 'tp-fade', 500, 500, ctx);
            }
            await ctx.wait(900);
        }
    };

    // ======================= placevalue =======================
    S.placevalue = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const digits = String(spec.digits).split('').map(Number);
        const n = digits.length;
        const names = ['Ones', 'Tens', 'Hundreds', 'Thousands'];
        const shown = spec.upto === undefined ? n : spec.upto;
        const CW = 170, x0 = 320 - (n * CW) / 2 + CW / 2;
        for (let k = 0; k < n; k++) {
            const pos = n - 1 - k;                    // 0 = ones
            if (pos >= shown) continue;
            const cx = x0 + k * CW, d = digits[k];
            const on = spec.highlight === pos;
            const box = sv('rect', { x: cx - CW / 2 + 8, y: 28, width: CW - 16, height: 304, rx: 14,
                style: 'fill:' + (on ? 'rgba(var(--accent-rgb),0.2)' : 'rgba(255,255,255,0.03)') + ';stroke:' + (on ? 'var(--accent-hi)' : 'rgba(var(--text-rgb),0.25)') + ';stroke-width:' + (on ? 4 : 2) }, svg);
            anim(box, 'tp-fade', 400, k * 150, ctx);
            svgText(svg, cx, 56, names[pos], 22, on ? 'rgb(var(--accent-hi-rgb))' : SOFT);
            anim(popOf(svgText(svg, cx, 116, d, 64, on ? GOLD : TXT)), 'tp-pop', 400, k * 150 + 150, ctx);
            const g = sv('g', {}, svg);
            if (pos === 0) {
                for (let i = 0; i < d; i++) sv('circle', { cx: cx + ((i % 3) - 1) * 34, cy: 192 + Math.floor(i / 3) * 34, r: 12, fill: COLORS.a }, g);
            } else if (pos === 1) {
                for (let i = 0; i < d; i++) sv('rect', { x: cx - 68 + i * 15, y: 156, width: 11, height: 100, rx: 2, fill: COLORS.b }, g);
            } else {
                for (let i = 0; i < d; i++) sv('rect', { x: cx - 60 + (i % 3) * 42, y: 150 + Math.floor(i / 3) * 42, width: 36, height: 36, rx: 4, fill: COLORS.c }, g);
            }
            anim(g, 'tp-pop', 450, k * 150 + 300, ctx); popOf(g);
            if (on) {
                const v = d * Math.pow(10, pos);
                anim(svgText(svg, cx, 312, d + ' ' + names[pos].toLowerCase() + ' = ' + v, 21, GOLD), 'tp-fade', 450, 500, ctx);
            }
        }
        await ctx.wait(shown * 150 + 1000);
    };

    // ======================= rect =======================
    S.rect = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const { w, h, show } = spec;
        const u = Math.min(380 / w, 190 / h, 56);
        const W = w * u, H = h * u, X = 320 - W / 2, Y = 82;
        const fillStyle = 'fill:rgba(var(--accent-rgb),0.12);stroke:rgb(var(--text-hi-rgb));stroke-width:4';
        if (show === 'half') {
            sv('rect', { x: X, y: Y, width: W, height: H, style: 'fill:none;stroke:rgba(var(--text-rgb),0.45);stroke-width:3;stroke-dasharray:8 6' }, svg);
            const t = sv('polygon', { points: X + ',' + (Y + H) + ' ' + (X + W) + ',' + (Y + H) + ' ' + X + ',' + Y,
                style: 'fill:' + COLORS.b + ';fill-opacity:0.55;stroke:rgb(var(--text-hi-rgb));stroke-width:4' }, svg);
            anim(t, 'tp-fade', 500, 400, ctx);
        } else {
            sv('rect', { x: X, y: Y, width: W, height: H, style: fillStyle }, svg);
        }
        svgText(svg, 320, Y - 22, spec.topLabel || w, 28, COLORS.a);
        svgText(svg, X - 30, Y + H / 2, spec.sideLabel || h, 28, COLORS.b);
        if (show === 'perimeter') {
            const sides = [[X, Y, X + W, Y, w], [X + W, Y, X + W, Y + H, h], [X + W, Y + H, X, Y + H, w], [X, Y + H, X, Y, h]];
            let run = 0;
            for (let i = 0; i < sides.length; i++) {
                const [x1, y1, x2, y2, len] = sides[i];
                const l = sv('line', { x1, y1, x2, y2, style: 'stroke:' + GOLD + ';stroke-width:8;stroke-linecap:round' }, svg);
                const L = Math.hypot(x2 - x1, y2 - y1);
                if (!ctx.instant) { l.style.strokeDasharray = L; l.style.setProperty('--len', L); l.style.animation = 'tp-draw 600ms ease-out ' + i * 650 + 'ms both'; }
                run += len;
            }
            anim(svgText(svg, 320, Y + H + 52, w + ' + ' + h + ' + ' + w + ' + ' + h + ' = ' + run, 36, COLORS.c), 'tp-pop', 450, 4 * 650, ctx);
            await ctx.wait(4 * 650 + 900);
            return;
        }
        if (show === 'area') {
            for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
                const q = sv('rect', { x: X + c * u + 2, y: Y + r * u + 2, width: u - 4, height: u - 4, rx: 3, style: 'fill:' + COLORS.c + ';fill-opacity:0.7' }, svg);
                popOf(q); anim(q, 'tp-pop', 260, (r * w + c) * 55, ctx);
            }
            anim(svgText(svg, 320, Y + H + 52, spec.eq || (h + ' rows of ' + w + ' = ' + w * h), 36, COLORS.c), 'tp-pop', 450, w * h * 55 + 200, ctx);
            await ctx.wait(w * h * 55 + 900);
            return;
        }
        if (show === 'half') {
            eqText(svg, { eq: spec.eq }, ctx, Y + H + 52);
        } else if (spec.eq) {
            eqText(svg, spec, ctx, Y + H + 52);
        }
        await ctx.wait(1100);
    };

    // ======================= circle =======================
    S.circle = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const edge = 'fill:rgba(var(--accent-rgb),0.14);stroke:rgb(var(--text-hi-rgb));stroke-width:4';
        if (spec.show === 'parts') {
            const CX = 320, CY = 190, R = 110;
            sv('circle', { cx: CX, cy: CY, r: R, style: edge }, svg);
            const d = sv('line', { x1: CX - R, y1: CY, x2: CX + R, y2: CY, style: 'stroke:' + COLORS.b + ';stroke-width:6;stroke-linecap:round' }, svg);
            const r = sv('line', { x1: CX, y1: CY, x2: CX, y2: CY - R, style: 'stroke:' + COLORS.a + ';stroke-width:6;stroke-linecap:round' }, svg);
            if (!ctx.instant) [d, r].forEach((n, i) => { const L = i ? R : 2 * R; n.style.strokeDasharray = L; n.style.setProperty('--len', L); n.style.animation = 'tp-draw 700ms ease-out ' + (i ? 400 : 1200) + 'ms both'; });
            sv('circle', { cx: CX, cy: CY, r: 7, fill: TXT }, svg);
            anim(svgText(svg, CX + 60, CY - R / 2, 'radius', 26, COLORS.a, { 'text-anchor': 'start' }), 'tp-fade', 500, 900, ctx);
            anim(svgText(svg, CX, CY + 34, 'diameter', 26, COLORS.b), 'tp-fade', 500, 1800, ctx);
            anim(svgText(svg, CX - 62, CY - 20, 'center', 20, SOFT), 'tp-fade', 500, 300, ctx);
            await ctx.wait(2500);
            return;
        }
        if (spec.show === 'circ') {
            const R = 56, CX = 150, CY = 120;
            sv('circle', { cx: CX, cy: CY, r: R, style: edge }, svg);
            sv('line', { x1: CX - R, y1: CY, x2: CX + R, y2: CY, style: 'stroke:' + COLORS.b + ';stroke-width:6;stroke-linecap:round' }, svg);
            svgText(svg, CX, CY - 22, 'd', 26, COLORS.b);
            const D = R * 2, Y = 250, XS = 80;
            anim(svgText(svg, 320, 190, 'lay the diameter along the edge:', 22, SOFT), 'tp-fade', 500, 600, ctx);
            for (let i = 0; i < 3; i++) {
                const b = sv('rect', { x: XS + i * (D + 6), y: Y - 22, width: D, height: 44, rx: 6, style: 'fill:' + COLORS.b + ';fill-opacity:0.75' }, svg);
                popOf(b); anim(b, 'tp-pop', 450, 1100 + i * 600, ctx);
                anim(svgText(svg, XS + i * (D + 6) + D / 2, Y, 'd', 24, '#10101c'), 'tp-fade', 300, 1300 + i * 600, ctx);
            }
            const bit = sv('rect', { x: XS + 3 * (D + 6), y: Y - 22, width: D * 0.14, height: 44, rx: 3, style: 'fill:' + COLORS.d }, svg);
            popOf(bit); anim(bit, 'tp-pop', 450, 3100, ctx);
            anim(svgText(svg, XS + 3 * (D + 6) + 10, Y + 46, 'a little bit more', 20, COLORS.d, { 'text-anchor': 'middle' }), 'tp-fade', 500, 3400, ctx);
            anim(svgText(svg, 320, 326, 'about 3.14 diameters around', 28, COLORS.c), 'tp-pop', 450, 3600, ctx);
            await ctx.wait(4300);
            return;
        }
        // area: one r x r square, then how many fit in the circle
        const R = 66, CX = 150, CY = 185;
        sv('circle', { cx: CX, cy: CY, r: R, style: edge }, svg);
        const sq = sv('rect', { x: CX, y: CY - R, width: R, height: R, style: 'fill:' + COLORS.b + ';fill-opacity:0.6;stroke:' + COLORS.b + ';stroke-width:3' }, svg);
        anim(sq, 'tp-fade', 500, 500, ctx);
        svgText(svg, CX + R / 2, CY - R / 2, 'r×r', 22, '#10101c');
        anim(svgText(svg, 360, 70, 'squares that are r × r:', 22, SOFT), 'tp-fade', 500, 900, ctx);
        for (let i = 0; i < 3; i++) {
            const b = sv('rect', { x: 290 + i * (R + 8), y: 100, width: R, height: R, rx: 4, style: 'fill:' + COLORS.b + ';fill-opacity:0.7' }, svg);
            popOf(b); anim(b, 'tp-pop', 400, 1200 + i * 450, ctx);
        }
        const bit = sv('rect', { x: 290 + 3 * (R + 8), y: 100, width: R * 0.14, height: R, style: 'fill:' + COLORS.d }, svg);
        popOf(bit); anim(bit, 'tp-pop', 400, 2600, ctx);
        anim(svgText(svg, 400, 220, 'about 3.14 of them cover the circle', 22, COLORS.c), 'tp-fade', 500, 3000, ctx);
        anim(svgText(svg, 400, 270, 'area = π × r × r', 40, COLORS.c), 'tp-pop', 450, 3500, ctx);
        await ctx.wait(4200);
    };

    // ======================= angle =======================
    S.angle = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const V = [320, 296], L = 210, deg = spec.deg;
        const at = (a, r) => [V[0] + r * Math.cos((a * Math.PI) / 180), V[1] - r * Math.sin((a * Math.PI) / 180)];
        if (spec.protractor) {
            sv('path', { d: 'M ' + at(0, 205).join(' ') + ' A 205 205 0 0 0 ' + at(180, 205).join(' ') + ' Z',
                style: 'fill:rgba(255,255,255,0.04);stroke:rgba(var(--text-rgb),0.5);stroke-width:2' }, svg);
            for (let a = 0; a <= 180; a += 10) {
                const long = a % 30 === 0;
                const p1 = at(a, 205), p2 = at(a, long ? 185 : 195);
                sv('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], style: 'stroke:rgba(var(--text-rgb),0.75);stroke-width:' + (long ? 3 : 1.5) }, svg);
                if (long) { const t = at(a, 170); svgText(svg, t[0], t[1], a, 16, SOFT); }
            }
        }
        const base = sv('line', { x1: V[0], y1: V[1], x2: V[0] + L, y2: V[1], style: 'stroke:rgb(var(--text-hi-rgb));stroke-width:6;stroke-linecap:round' }, svg);
        // arc
        const arcR = 62, e = at(deg, arcR), s = at(0, arcR);
        const isRight = deg === 90;
        if (isRight) {
            const q = sv('path', { d: 'M ' + (V[0] + 34) + ' ' + V[1] + ' L ' + (V[0] + 34) + ' ' + (V[1] - 34) + ' L ' + V[0] + ' ' + (V[1] - 34),
                fill: 'none', style: 'stroke:' + GOLD + ';stroke-width:5' }, svg);
            anim(q, 'tp-fade', 500, 700, ctx);
        } else {
            const arc = sv('path', { d: 'M ' + s[0] + ' ' + s[1] + ' A ' + arcR + ' ' + arcR + ' 0 ' + (deg > 180 ? 1 : 0) + ' 0 ' + e[0] + ' ' + e[1],
                fill: 'none', style: 'stroke:' + GOLD + ';stroke-width:5' }, svg);
            anim(arc, 'tp-fade', 500, 900, ctx);
        }
        // moving ray
        const g = sv('g', {}, svg);
        g.style.transformOrigin = V[0] + 'px ' + V[1] + 'px';
        sv('line', { x1: V[0], y1: V[1], x2: V[0] + L, y2: V[1], style: 'stroke:' + COLORS.b + ';stroke-width:6;stroke-linecap:round' }, g);
        g.style.transform = 'rotate(' + (ctx.instant ? -deg : 0) + 'deg)';
        sv('circle', { cx: V[0], cy: V[1], r: 8, fill: TXT }, svg);
        const lab = at(deg / 2, arcR + 38);
        const name = spec.name ? spec.name : null;
        if (!spec.hideDeg) {
            const dtext = svgText(svg, lab[0] + (deg > 150 ? 0 : 10), lab[1] + (deg > 150 ? -14 : 0), deg + '°', 30, GOLD);
            anim(dtext, 'tp-pop', 450, 1300, ctx);
        }
        if (name) anim(svgText(svg, 130, 70, name, 34, COLORS.c), 'tp-fade', 500, 1500, ctx);
        if (spec.rest) {
            const r2 = at((deg + 180) / 2, arcR + 38);
            anim(svgText(svg, r2[0] - 10, r2[1], (180 - deg) + '°', 30, COLORS.d), 'tp-pop', 450, 1900, ctx);
        }
        await ctx.wait(100);
        if (!ctx.instant) {
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
            g.style.transition = 'transform ' + (1100 / ctx.speed) + 'ms ease-in-out';
            g.style.transform = 'rotate(' + -deg + 'deg)';
        }
        await ctx.wait(spec.rest ? 2400 : 1900);
    };

    // ======================= symmetry =======================
    let clipId = 0;
    S.symmetry = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const CX = 320, CY = 172;
        const SHAPES = {
            rectangle: [[-130, -80], [130, -80], [130, 80], [-130, 80]],
            square: [[-90, -90], [90, -90], [90, 90], [-90, 90]],
            triangle: [[0, -90], [110, 85], [-110, 85]],
            parallelogram: [[-90, -80], [150, -80], [90, 80], [-150, 80]],
        };
        const pts = SHAPES[spec.shape].map(([x, y]) => [CX + x, CY + y]);
        const poly = pts.map(p => p.join(',')).join(' ');
        const shapeStyle = 'fill:rgba(var(--accent-rgb),0.22);stroke:rgb(var(--text-hi-rgb));stroke-width:4;stroke-linejoin:round';
        const LINES = { v: [CX, CY - 125, CX, CY + 125], h: [CX - 175, CY, CX + 175, CY], d1: [CX - 120, CY - 120, CX + 120, CY + 120], d2: [CX + 120, CY - 120, CX - 120, CY + 120] };
        const fold = spec.fold;

        if (fold) {
            const id = 'clip' + (++clipId);
            const defs = sv('defs', {}, svg);
            const mk = (name, x, y, w, h) => { const c = sv('clipPath', { id: id + name }, defs); sv('rect', { x, y, width: w, height: h }, c); };
            if (fold === 'v') { mk('a', 0, 0, CX, 360); mk('b', CX, 0, 340, 360); } else { mk('a', 0, 0, 640, CY); mk('b', 0, CY, 640, 200); }
            const A = sv('polygon', { points: poly, 'clip-path': 'url(#' + id + 'a)', style: 'fill:' + COLORS.a + ';fill-opacity:0.8;stroke:rgb(var(--text-hi-rgb));stroke-width:4;stroke-linejoin:round' }, svg);
            const B = sv('g', { 'clip-path': 'url(#' + id + 'b)' }, svg);
            const Bg = sv('g', {}, B);
            sv('polygon', { points: poly, style: 'fill:' + COLORS.b + ';fill-opacity:0.8;stroke:rgb(var(--text-hi-rgb));stroke-width:4;stroke-linejoin:round' }, Bg);
            Bg.style.transformOrigin = CX + 'px ' + CY + 'px';
            const l = LINES[fold];
            sv('line', { x1: l[0], y1: l[1], x2: l[2], y2: l[3], style: 'stroke:' + GOLD + ';stroke-width:4;stroke-dasharray:10 8' }, svg);
            await ctx.wait(900);
            if (!ctx.instant && ctx.alive()) {
                await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
                // fold the second half over the line; it lands on the first half
                B.removeAttribute('clip-path');
                Bg.style.transition = 'transform ' + (1500 / ctx.speed) + 'ms ease-in-out';
                Bg.style.transform = fold === 'v' ? 'scaleX(-1)' : 'scaleY(-1)';
                await ctx.wait(1800);
                anim(svgText(svg, 320, 334, 'the halves match exactly!', 30, COLORS.c), 'tp-pop', 450, 0, ctx);
                await ctx.wait(900);
            } else {
                B.removeAttribute('clip-path');
                Bg.style.transform = fold === 'v' ? 'scaleX(-1)' : 'scaleY(-1)';
                svgText(svg, 320, 334, 'the halves match exactly!', 30, COLORS.c);
            }
            return;
        }
        sv('polygon', { points: poly, style: shapeStyle }, svg);
        (spec.lines || []).forEach((k, i) => {
            const l = LINES[k];
            const n = sv('line', { x1: l[0], y1: l[1], x2: l[2], y2: l[3], style: 'stroke:' + GOLD + ';stroke-width:4;stroke-dasharray:10 8' }, svg);
            anim(n, 'tp-fade', 500, 300 + i * 500, ctx);
        });
        if (spec.wrong) {
            const l = LINES[spec.wrong];
            const n = sv('line', { x1: l[0], y1: l[1], x2: l[2], y2: l[3], style: 'stroke:' + COLORS.d + ';stroke-width:4;stroke-dasharray:10 8' }, svg);
            anim(n, 'tp-fade', 500, 400, ctx);
            anim(svgText(svg, 320, 334, 'not a line of symmetry: the halves do not match', 24, COLORS.d), 'tp-fade', 500, 900, ctx);
        } else if (spec.count !== undefined) {
            anim(svgText(svg, 320, 334, spec.count === 0 ? 'no lines of symmetry' : spec.count + (spec.count === 1 ? ' line of symmetry' : ' lines of symmetry'), 34, spec.count === 0 ? COLORS.d : COLORS.c), 'tp-pop', 450, (spec.lines || []).length * 500 + 400, ctx);
        }
        await ctx.wait(((spec.lines || []).length + 2) * 500 + 600);
    };

    // ======================= polygon =======================
    const UNIT = {
        square: [[-1, -1], [1, -1], [1, 1], [-1, 1]],
        right: [[-1, 1], [1, 1], [-1, -1]],
        isosceles: [[0, -1], [0.8, 1], [-0.8, 1]],
        scalene: [[-0.95, 1], [1, 0.55], [-0.25, -1]],
    };
    const regular = (n) => Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        return [Math.cos(a), Math.sin(a)];
    });
    const drawPoly = (svg, cx, cy, R, def, ctx, delay) => {
        const unit = def.points ? (typeof def.points === 'string' ? UNIT[def.points] : def.points) : regular(def.sides);
        const stretch = def.stretch || 1;
        const P = unit.map(([x, y]) => [cx + x * R * stretch * (def.sides === 4 || def.points === 'square' ? 0.82 : 1), cy + y * R * (def.sides === 4 || def.points === 'square' ? 0.82 : 1)]);
        const poly = sv('polygon', { points: P.map(p => p.join(',')).join(' '),
            style: 'fill:rgba(var(--accent-rgb),0.22);stroke:rgb(var(--text-hi-rgb));stroke-width:4;stroke-linejoin:round' }, svg);
        popOf(poly); anim(poly, 'tp-pop', 450, delay, ctx);
        const n = P.length;
        for (let i = 0; i < n; i++) {
            const a = P[i], b = P[(i + 1) % n];
            const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
            const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
            const nx = -dy / len, ny = dx / len;
            const out = (mx - cx) * nx + (my - cy) * ny >= 0 ? 1 : -1;
            const tk = def.ticks ? def.ticks[i] : 0;
            for (let t = 0; t < tk; t++) {
                const off = (t - (tk - 1) / 2) * 9, tx = mx + (dx / len) * off;
                const ty = my + (dy / len) * off;
                sv('line', { x1: tx - nx * 8, y1: ty - ny * 8, x2: tx + nx * 8, y2: ty + ny * 8, style: 'stroke:' + GOLD + ';stroke-width:3.5' }, svg);
            }
            if (def.count) {
                const t = svgText(svg, mx + out * nx * 30, my + out * ny * 30, i + 1, 26, GOLD);
                anim(t, 'tp-pop', 350, delay + 500 + i * 450, ctx);
            }
            if (def.rightAngles) {
                const prev = P[(i + n - 1) % n], c = P[i];
                const v1 = [prev[0] - c[0], prev[1] - c[1]], v2 = [b[0] - c[0], b[1] - c[1]];
                const dot = v1[0] * v2[0] + v1[1] * v2[1];
                if (Math.abs(dot) < 1e-6 * Math.hypot(...v1) * Math.hypot(...v2) + 1) {
                    const u1 = [v1[0] / Math.hypot(...v1), v1[1] / Math.hypot(...v1)], u2 = [v2[0] / Math.hypot(...v2), v2[1] / Math.hypot(...v2)];
                    const s = 16;
                    sv('path', { d: 'M ' + (c[0] + u1[0] * s) + ' ' + (c[1] + u1[1] * s) + ' L ' + (c[0] + (u1[0] + u2[0]) * s) + ' ' + (c[1] + (u1[1] + u2[1]) * s) + ' L ' + (c[0] + u2[0] * s) + ' ' + (c[1] + u2[1] * s),
                        fill: 'none', style: 'stroke:' + COLORS.c + ';stroke-width:3.5' }, svg);
                }
            }
        }
        return n;
    };
    S.polygon = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        if (spec.items) {
            const k = spec.items.length, w = 600 / k;
            spec.items.forEach((it, i) => {
                const cx = 20 + w * i + w / 2;
                drawPoly(svg, cx, 160, Math.min(78, w / 2 - 16), it, ctx, i * 300);
                if (it.label) anim(svgText(svg, cx, 290, it.label, 24, COLORS.c), 'tp-fade', 450, 600 + i * 300, ctx);
                if (it.sub) anim(svgText(svg, cx, 322, it.sub, 18, SOFT), 'tp-fade', 450, 800 + i * 300, ctx);
            });
            await ctx.wait(spec.items.length * 300 + 1400);
            return;
        }
        const n = drawPoly(svg, 320, 165, 112, spec, ctx, 0);
        if (spec.name) anim(svgText(svg, 320, 318, spec.name, 40, COLORS.c), 'tp-pop', 450, spec.count ? 500 + n * 450 : 600, ctx);
        await ctx.wait((spec.count ? 500 + n * 450 : 700) + 900);
    };

    // ======================= coordplane =======================
    S.coordplane = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const U = 30, CX = 320, CY = 190, R = 5;
        const X = (x) => CX + x * U, Y = (y) => CY - y * U;
        for (let i = -R; i <= R; i++) {
            sv('line', { x1: X(i), y1: Y(-R), x2: X(i), y2: Y(R), style: 'stroke:rgba(var(--text-rgb),0.15);stroke-width:1' }, svg);
            sv('line', { x1: X(-R), y1: Y(i), x2: X(R), y2: Y(i), style: 'stroke:rgba(var(--text-rgb),0.15);stroke-width:1' }, svg);
            if (i !== 0) {
                svgText(svg, X(i), Y(0) + 15, fmtNum(i), 15, SOFT);
                svgText(svg, X(0) - 15, Y(i), fmtNum(i), 15, SOFT);
            }
        }
        sv('line', { x1: X(-R) - 8, y1: Y(0), x2: X(R) + 12, y2: Y(0), style: 'stroke:rgb(var(--text-hi-rgb));stroke-width:3' }, svg);
        sv('line', { x1: X(0), y1: Y(-R) + 8, x2: X(0), y2: Y(R) - 12, style: 'stroke:rgb(var(--text-hi-rgb));stroke-width:3' }, svg);
        svgText(svg, X(R) + 26, Y(0), 'x', 22, COLORS.a);
        svgText(svg, X(0), Y(R) - 24, 'y', 22, COLORS.b);
        (spec.points || []).forEach((p, i) => {
            const d = sv('circle', { cx: X(p.x), cy: Y(p.y), r: 8, fill: COLORS[p.color || 'd'] }, svg);
            popOf(d); anim(d, 'tp-pop', 350, 400 + i * 300, ctx);
            if (p.label) anim(svgText(svg, X(p.x) + 8, Y(p.y) - 20, p.label, 20, COLORS[p.color || 'd']), 'tp-fade', 400, 600 + i * 300, ctx);
        });
        if (spec.walk) {
            const { x, y } = spec.walk;
            const d = sv('circle', { cx: X(0), cy: Y(0), r: 9, fill: COLORS.b, style: 'stroke:rgb(var(--bg-rgb));stroke-width:3' }, svg);
            popOf(d); anim(d, 'tp-pop', 350, 300, ctx);
            const h = sv('line', { x1: X(0), y1: Y(0), x2: X(x), y2: Y(0), style: 'stroke:' + COLORS.a + ';stroke-width:5;stroke-dasharray:9 7;stroke-linecap:round' }, svg);
            const v = sv('line', { x1: X(x), y1: Y(0), x2: X(x), y2: Y(y), style: 'stroke:' + COLORS.b + ';stroke-width:5;stroke-dasharray:9 7;stroke-linecap:round' }, svg);
            const lh = svgText(svg, (X(0) + X(x)) / 2, Y(0) + (y >= 0 ? 34 : -22), 'across ' + fmtNum(x), 20, COLORS.a);
            const lv = svgText(svg, X(x) + (x >= 0 ? 52 : -52), (Y(0) + Y(y)) / 2, (y >= 0 ? 'up ' : 'down ') + Math.abs(y), 20, COLORS.b);
            const lend = svgText(svg, X(x) + (x >= 0 ? 24 : -24), Y(y) + (y >= 0 ? -20 : 30), '(' + fmtNum(x) + ', ' + fmtNum(y) + ')', 26, COLORS.c);
            if (ctx.instant) { d.setAttribute('cx', X(x)); d.setAttribute('cy', Y(y)); }
            else {
                h.style.opacity = 0; v.style.opacity = 0; lh.style.opacity = 0; lv.style.opacity = 0; lend.style.opacity = 0;
                await ctx.wait(700);
                h.style.opacity = 1; lh.style.opacity = 1;
                d.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(' + (X(x) - X(0)) + 'px,0)' }], { duration: 900 / ctx.speed, easing: 'ease-in-out', fill: 'forwards' });
                await ctx.wait(1200);
                v.style.opacity = 1; lv.style.opacity = 1;
                d.animate([{ transform: 'translate(' + (X(x) - X(0)) + 'px,0)' }, { transform: 'translate(' + (X(x) - X(0)) + 'px,' + (Y(y) - Y(0)) + 'px)' }], { duration: 900 / ctx.speed, easing: 'ease-in-out', fill: 'forwards' });
                await ctx.wait(1200);
                lend.style.opacity = 1; lend.style.animation = 'tp-pop 450ms ease-out both'; popOf(lend);
            }
            await ctx.wait(800);
            return;
        }
        await ctx.wait(500 + (spec.points || []).length * 300 + 600);
    };

    // ======================= prism (a box of unit cubes) =======================
    S.prism = async (stage, spec, ctx) => {
        const svg = makeSvg(stage);
        const { l, w, h } = spec;
        const s = Math.min(34, 190 / (h + (l + w) * 0.5), 270 / ((l + w) * 0.866));
        const ax = s * 0.866, ay = s * 0.5;
        const ox = 320 - ((l - w) * ax) / 2, oy = 66 + h * s;
        const pt = (x, y, z) => [ox + (x - y) * ax, oy + (x + y) * ay - z * s];
        const poly = (pts, fill, g) => sv('polygon', { points: pts.map(p => p.join(',')).join(' '),
            style: 'fill:' + fill + ';stroke:rgba(10,10,28,0.55);stroke-width:1.5;stroke-linejoin:round' }, g);
        const layers = spec.layers === undefined ? h : spec.layers;
        const palette = [[COLORS.a, '#3b9bc7', '#2d7ea3'], [COLORS.c, '#5fa264', '#4a8350'], [COLORS.b, '#d99a3e', '#b87f2f'], [COLORS.d, '#c44d77', '#9f3b5f'], [GOLD, '#d1b43f', '#a99132']];
        for (let k = 0; k < Math.min(layers, h); k++) {
            const g = sv('g', {}, svg);
            const c = palette[k % palette.length];
            const cubes = [];
            for (let i = 0; i < l; i++) for (let j = 0; j < w; j++) cubes.push([i, j]);
            cubes.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]));
            cubes.forEach(([i, j]) => {
                poly([pt(i, j + 1, k), pt(i + 1, j + 1, k), pt(i + 1, j + 1, k + 1), pt(i, j + 1, k + 1)], c[2], g);
                poly([pt(i + 1, j, k), pt(i + 1, j + 1, k), pt(i + 1, j + 1, k + 1), pt(i + 1, j, k + 1)], c[1], g);
                poly([pt(i, j, k + 1), pt(i + 1, j, k + 1), pt(i + 1, j + 1, k + 1), pt(i, j + 1, k + 1)], c[0], g);
            });
            popOf(g); g.style.transformOrigin = '320px ' + (oy + (l + w) * ay) + 'px';
            anim(g, 'tp-rise', 450, k * 650, ctx);
        }
        // edge labels
        const lab = (p, text, color) => anim(svgText(svg, p[0], p[1], text, 24, color), 'tp-fade', 400, layers * 650 + 200, ctx);
        const a = pt(l / 2, w, 0), b = pt(l, w / 2, 0), c = pt(l, 0, h / 2);
        lab([a[0] - 26, a[1] + 26], 'length ' + l, COLORS.a);
        lab([b[0] + 56, b[1] + 22], 'width ' + w, COLORS.b);
        lab([c[0] + 54, c[1]], 'height ' + h, COLORS.c);
        eqText(svg, spec, ctx, 340);
        await ctx.wait(layers * 650 + 1100);
    };
})();
