// Worked example for pemdas.html: the expression is rewritten one step at a time, as on paper.
//   pemdas  {html:'(3 + 4) × 5', ans}      (html uses <sup>2</sup> for squares)
(() => {
    'use strict';

    const M = (s) => String(s).replace(/-/g, '−');
    const SUP = (s) => String(s).replace(/\^2/g, '²');

    const tokenize = (html) => String(html).replace(/<sup>2<\/sup>/g, '^2').match(/\d+|\^2|[+×−()]/g);

    // ---- show a token list, with some tokens coloured ----
    const show = (tk, marks) => {
        let out = '';
        tk.forEach((t, i) => {
            const m = marks && marks[i];
            const txt = /^\d/.test(t) || /^-/.test(t) ? M(t) : t;
            const piece = m ? '{' + m + ':' + txt + '}' : txt;
            if (t === '(') out += piece;
            else if (t === ')' || t === '^2') out = out.replace(/ $/, '') + piece;
            else if (t === '+' || t === '×' || t === '−') out += ' ' + piece + ' ';
            else out += piece;
        });
        return out.replace(/\s+/g, ' ').trim().replace(/\^2/g, '^2');
    };

    const num = (t) => Number(String(t).replace('−', '-'));

    // evaluate a flat list (no parentheses): squares, then ×, then + and − from the left
    const flat = (tk) => {
        let t = tk.slice();
        for (let i = 0; i < t.length; i++) if (t[i + 1] === '^2') { t.splice(i, 2, String(num(t[i]) * num(t[i]))); }
        for (let i = 0; i < t.length; i++) if (t[i] === '×') { t.splice(i - 1, 3, String(num(t[i - 1]) * num(t[i + 1]))); i--; }
        let v = num(t[0]);
        for (let i = 1; i < t.length; i += 2) v = t[i] === '+' ? v + num(t[i + 1]) : v - num(t[i + 1]);
        return v;
    };

    // one rewrite: returns {tokens, hit:[indices coloured before], res:[indices coloured after], say}
    const rewrite = (tk) => {
        const ci = tk.indexOf(')');
        if (ci >= 0) {
            let oi = ci;
            while (tk[oi] !== '(') oi--;
            const inner = tk.slice(oi + 1, ci);
            const v = flat(inner);
            const hit = []; for (let i = oi; i <= ci; i++) hit.push(i);
            return { tokens: tk.slice(0, oi).concat([String(v)], tk.slice(ci + 1)), hit, res: [oi],
                say: 'Parentheses come first. Inside them: ' + SUP(show(inner)).replace(/\{[a-z]:|\}/g, '') + ' = ' + M(v) + '.' };
        }
        const sq = [];
        tk.forEach((t, i) => { if (t === '^2') sq.push(i - 1); });
        if (sq.length) {
            const out = tk.slice(), hit = [], res = [], said = [];
            for (let k = sq.length - 1; k >= 0; k--) {
                const i = sq[k], n = num(out[i]);
                out.splice(i, 2, String(n * n));
                said.unshift(n + '² = ' + n + ' × ' + n + ' = ' + n * n);
            }
            tk.forEach((t, i) => { if (t === '^2') { hit.push(i - 1, i); } });
            let shift = 0;
            sq.forEach((i) => { res.push(i - shift); shift++; });
            return { tokens: out, hit, res, say: 'Exponents next. ' + said.join('; ') + '.' };
        }
        if (tk.includes('×')) {
            const out = tk.slice(), hit = [], said = [], pos = [];
            for (let i = 0; i < tk.length; i++) if (tk[i] === '×') { hit.push(i - 1, i, i + 1); said.push(tk[i - 1] + ' × ' + tk[i + 1] + ' = ' + num(tk[i - 1]) * num(tk[i + 1])); pos.push(i); }
            let shift = 0;
            const res = [];
            for (const i of pos) { out.splice(i - 1 - shift, 3, String(num(tk[i - 1]) * num(tk[i + 1]))); res.push(i - 1 - shift); shift += 2; }
            return { tokens: out, hit, res, say: 'Now multiply, because it comes before adding and subtracting. ' + said.join('; ') + '.' };
        }
        const i = tk.findIndex(t => t === '+' || t === '−');
        const a = num(tk[i - 1]), b = num(tk[i + 1]), v = tk[i] === '+' ? a + b : a - b;
        const out = tk.slice();
        out.splice(i - 1, 3, String(v));
        return { tokens: out, hit: [i - 1, i, i + 1], res: [i - 1],
            say: 'Last, add and subtract from left to right: ' + M(a) + (tk[i] === '+' ? ' + ' : ' − ') + M(b) + ' = ' + M(v) + '.' };
    };

    MPCoach.register('pemdas', (q) => {
        let tk = tokenize(q.html);
        const rows = [show(tk)];        // the lines of working
        const says = [];
        const scenes = [];
        let guard = 0;
        while (tk.length > 1 && guard++ < 20) {
            const r = rewrite(tk);
            const marks = {};
            r.hit.forEach(i => { marks[i] = 'b'; });
            rows[rows.length - 1] = show(tk, marks);          // colour what we are about to work out
            const resMarks = {};
            r.res.forEach(i => { resMarks[i] = 'c'; });
            tk = r.tokens;
            rows.push('= ' + show(tk, resMarks));
            says.push(r.say);
            scenes.push(rows.slice());
            rows[rows.length - 1] = '= ' + show(tk);
        }
        const size = rows.length > 4 ? { size: 'small' } : {};
        const steps = [{ say: 'Use PEMDAS to decide what to do first: Parentheses, Exponents, then Multiply and Divide, then Add and Subtract. We rewrite the sum after each step.',
            scene: Object.assign({ kind: 'lines', lines: [show(tokenize(q.html)), '{y:P E M D A S}'] }, size) }];
        says.forEach((say, k) => steps.push({ say, scene: Object.assign({ kind: 'lines', lines: scenes[k] }, size) }));
        steps.push({ say: 'So the answer is ' + M(q.ans) + '.', scene: Object.assign({ kind: 'lines', lines: [show(tokenize(q.html)) + ' = {c:' + M(q.ans) + '}'] }, size) });
        return { title: 'Order of operations', steps };
    });
})();
