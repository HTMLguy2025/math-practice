// Worked examples for fractions.html.
//   frac-op        {op:'add'|'subtract'|'multiply'|'divide', terms:[{n,d}...], ans:{n,d}}   (2 or 3 terms, signed tops)
//   frac-simplify  {n, d, ans}
//   frac-convert   {dir:'improper'|'mixed', whole, n, d}
//   frac-decimal   {n, d, neg, exp}                      a fraction (or a power of it) as a decimal
//   frac-nested    {n, d, w, neg, exp}                   (n/d)/w as a decimal
//   frac-eq        {op, known:{n,d}, result:{n,d}, ans:{n,d}}   find the missing fraction
(() => {
    'use strict';

    const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
    const lcm = (a, b) => (a * b) / gcd(a, b);
    const M = (s) => String(s).replace(/-/g, '\u2212');
    const W = (n) => (n < 0 ? '(' + M(n) + ')' : String(n));
    const F = (n, d) => '[' + n + '/' + d + ']';
    const SYM = { add: '+', subtract: '\u2212', multiply: '\u00d7', divide: '\u00f7' };
    const WORD = { add: 'add', subtract: 'subtract' };
    const lines = (arr, extra) => Object.assign({ kind: 'lines', lines: arr }, extra || {});
    const norm = (n, d) => (d < 0 ? { n: -n, d: -d } : { n, d });

    // ---- the closing "simplify" step shared by most of them ----
    const finish = (n, d, ans) => {
        const g = gcd(Math.abs(n), Math.abs(d));
        if (g > 1) {
            const out = { say: 'Simplify: ' + g + ' goes into both ' + M(n) + ' and ' + d + ', so divide the top and the bottom by ' + g + '. The answer is ' + M(ans.n) + '/' + ans.d + '.',
                scene: lines([F(n, d), '\u00f7 {b:' + g + '} top and bottom', '{c:' + F(ans.n, ans.d) + '}']) };
            if (ans.d === 1) out.say = 'Simplify: divide the top and the bottom by ' + g + '. ' + M(n) + '/' + d + ' is the same as ' + M(ans.n) + ', which we can write as ' + M(ans.n) + '/1.';
            return [out];
        }
        return [{ say: 'Nothing but 1 goes into both ' + M(n) + ' and ' + d + ', so it is already as simple as it can be: ' + M(ans.n) + '/' + ans.d + '.',
            scene: lines(['{c:' + F(ans.n, ans.d) + '}', 'already simplest']) }];
    };

    // ---- + and \u2212 with any number of terms ----
    const addSub = (terms, op, ans) => {
        const ds = terms.map(t => t.d);
        const like = ds.every(d => d === ds[0]);
        const lcd = ds.reduce(lcm, 1);
        const exprOf = (a) => terms.map((t, i) => (i === 0 ? M(a(t, i)) : (op === 'add' ? ' + ' : ' \u2212 ') + W(a(t, i)))).join('');
        const steps = [];
        const header = terms.map((t, i) => (i ? ' ' + SYM[op] + ' ' : '') + F(t.n, t.d)).join('');
        let conv = terms;
        if (!like) {
            steps.push({ say: 'The bottoms are different (' + ds.join(', ') + '), so first find a bottom they all go into. The smallest is ' + lcd + '.',
                scene: lines(['{y:' + header + '}', ds.join(', ') + ' all go into {c:' + lcd + '}']) });
            conv = terms.map(t => ({ n: t.n * (lcd / t.d), d: lcd }));
            steps.push({ say: 'Rewrite each fraction with ' + lcd + ' on the bottom. Whatever we multiply the bottom by, we multiply the top by too.',
                scene: lines(terms.map(t => F(t.n, t.d) + ' = {b:' + F(t.n * (lcd / t.d), lcd) + '}  (\u00d7' + (lcd / t.d) + ')'), terms.length > 2 ? { size: 'small' } : {}) });
        } else {
            steps.push({ say: 'The bottoms are the same (' + ds[0] + '), so the pieces are the same size and we can ' + WORD[op] + ' the tops.',
                scene: lines(['{y:' + header + '}', 'same bottom: {c:' + ds[0] + '}']) });
        }
        const tops = conv.map(t => t.n);
        const total = tops.reduce((s, n, i) => (i === 0 ? n : s + (op === 'add' ? n : -n)), 0);
        const neg = terms.some(t => t.n < 0);
        steps.push({ say: (op === 'add' ? 'Add' : 'Subtract') + ' the tops: ' + M(tops.map((n, i) => (i === 0 ? n : (op === 'add' ? ' + ' : ' \u2212 ') + W(n))).join('')) + ' = ' + M(total) + '. Keep the bottom, ' + lcd + '.'
            + (neg ? ' (Adding a negative number moves us down, so think of it as taking away.)' : ''),
            scene: like && !neg && terms.length === 2 && lcd <= 10 && total >= 0 && total <= lcd
                ? { kind: 'fractionbar', eq: M(tops[0] + ' ' + SYM[op] + ' ' + tops[1] + ' = ' + total), items: [
                    { parts: lcd, fill: tops[0], label: [tops[0], lcd], color: 'a' }, { op: SYM[op] },
                    { parts: lcd, fill: tops[1], label: [tops[1], lcd], color: 'b' }, { op: '=' },
                    { parts: lcd, fill: total, label: [total, lcd], color: 'c', pop: true }] }
                : lines([M(tops.map((n, i) => (i === 0 ? n : (op === 'add' ? ' + ' : ' \u2212 ') + W(n))).join('')) + ' = {b:' + M(total) + '}', '{c:' + F(total, lcd) + '}']) });
        return steps.concat(finish(total, lcd, ans));
    };

    // ---- \u00d7 and \u00f7 ----
    const mulDiv = (terms, op, ans) => {
        const header = terms.map((t, i) => (i ? ' ' + SYM[op] + ' ' : '') + F(t.n, t.d)).join('');
        let use = terms, pre = [];
        if (op === 'divide') {
            const flipped = terms.map((t, i) => (i === 0 ? t : norm(t.d, t.n)));
            pre.push({ say: 'To divide by a fraction, flip it upside down and multiply instead. ' + (terms.length > 2 ? 'Flip both of the fractions we are dividing by.' : 'Flip the second fraction.'),
                scene: lines(['{y:' + header + '}', flipped.map((t, i) => (i ? ' \u00d7 ' : '') + F(t.n, t.d)).join('')]) });
            use = flipped;
        }
        const negs = use.filter(t => t.n < 0).length;
        const N = use.reduce((p, t) => p * t.n, 1), D = use.reduce((p, t) => p * t.d, 1);
        const topExpr = use.map((t, i) => (i ? ' \u00d7 ' : '') + W(t.n)).join('');
        const botExpr = use.map((t, i) => (i ? ' \u00d7 ' : '') + t.d).join('');
        const steps = pre.concat([{ say: 'Multiply the tops, and multiply the bottoms. Tops: ' + M(topExpr) + ' = ' + M(N) + '. Bottoms: ' + botExpr + ' = ' + D + '.'
            + (negs ? (negs % 2 ? ' One minus sign, so the answer is negative.' : ' Two minus signs make a plus, so the answer is positive.') : ''),
            scene: lines(['tops: {b:' + M(topExpr) + ' = ' + M(N) + '}', 'bottoms: {a:' + botExpr + ' = ' + D + '}', '{c:' + F(N, D) + '}'], terms.length > 2 ? { size: 'small' } : {}) }]);
        return steps.concat(finish(N, D, ans));
    };

    MPCoach.register('frac-op', (q) => {
        const { op, terms, ans } = q;
        const title = terms.map((t, i) => (i ? ' ' + SYM[op] + ' ' : '') + M(t.n) + '/' + t.d).join('');
        return { title, steps: op === 'add' || op === 'subtract' ? addSub(terms, op, ans) : mulDiv(terms, op, ans) };
    });

    // ---- simplify ----
    MPCoach.register('frac-simplify', (q) => {
        const { n, d, ans } = q;
        const g = gcd(n, d);
        return { title: 'Simplify ' + n + '/' + d, steps: [
            { say: 'To simplify, find the biggest number that goes into both the top and the bottom. For ' + n + ' and ' + d + ', that number is ' + g + '.',
              scene: lines(['{y:' + F(n, d) + '}', g + ' goes into {b:' + n + '}', g + ' goes into {a:' + d + '}']) },
            { say: 'Divide the top and the bottom by ' + g + '. ' + n + ' \u00f7 ' + g + ' = ' + ans.n + ' and ' + d + ' \u00f7 ' + g + ' = ' + ans.d + '.',
              scene: lines(['{b:' + n + '} \u00f7 ' + g + ' = ' + ans.n, '{a:' + d + '} \u00f7 ' + g + ' = ' + ans.d, '{c:' + F(n, d) + ' = ' + F(ans.n, ans.d) + '}']) },
            { say: 'Nothing but 1 goes into ' + ans.n + ' and ' + ans.d + ', so ' + ans.n + '/' + ans.d + ' is as simple as it gets.',
              scene: { kind: 'fractionbar', items: [{ parts: d, fill: n, label: [n, d], color: 'a' }, { op: '=' }, { parts: ans.d, fill: ans.n, label: [ans.n, ans.d], color: 'c', pop: true }] } }] };
    });

    // ---- mixed numbers and improper fractions ----
    MPCoach.register('frac-convert', (q) => {
        const { dir, whole, n, d } = q;
        const top = whole * d + n;
        if (dir === 'improper') return { title: whole + ' ' + n + '/' + d + ' as an improper fraction', steps: [
            { say: 'Each whole is made of ' + d + '/' + d + '. So ' + whole + ' wholes have ' + whole + ' \u00d7 ' + d + ' = ' + whole * d + ' pieces.',
              scene: lines(['{y:' + whole + ' ' + F(n, d) + '}', whole + ' \u00d7 ' + d + ' = {b:' + whole * d + '}']) },
            { say: 'Add the ' + n + ' pieces we already have: ' + whole * d + ' + ' + n + ' = ' + top + '. Keep the bottom, ' + d + '. The answer is ' + top + '/' + d + '.',
              scene: lines([whole + ' \u00d7 ' + d + ' + ' + n + ' = {b:' + top + '}', '{c:' + F(top, d) + '}']) }] };
        return { title: top + '/' + d + ' as a mixed number', steps: [
            { say: 'Divide the top by the bottom. ' + top + ' \u00f7 ' + d + ' = ' + whole + ', with ' + n + ' left over.',
              scene: lines(['{y:' + F(top, d) + '}', top + ' \u00f7 ' + d + ' = {b:' + whole + '}  remainder {a:' + n + '}']) },
            { say: 'The ' + whole + ' is the whole number, and the ' + n + ' left over goes on top of the same bottom. The answer is ' + whole + ' and ' + n + '/' + d + '.',
              scene: lines(['whole number {b:' + whole + '}', 'top {a:' + n + '}', '{c:' + whole + ' ' + F(n, d) + '}']) }] };
    });

    // ---- a fraction as a decimal: long division ----
    const dec = (num, den, extra) => ({ kind: 'longdiv', divisor: den, dividend: num, extra });
    const zerosNeeded = (num, den) => {
        let e = 0, v = num;
        while (v % den !== 0 && e < 12) { v *= 10; e++; }
        return e;
    };
    const divideSteps = (num, den, ans, keep, intro) => {
        // keep: how many decimal places to write when it never ends
        const e = zerosNeeded(num, den);
        const places = e < 12 ? e : keep;
        const steps = [];
        if (places <= 3) {
            const scene = dec(num, den, places);
            const whole = Math.floor(num / den);
            steps.push({ say: (intro || '') + 'Divide with long division: put ' + num + ' inside the bracket and ' + den + ' outside. ' + (num < den ? den + ' does not fit into ' + num + ', so write 0 and a decimal point after the ' + num + ' and add zeros. ' : '') + 'Keep dividing until nothing is left' + (e >= 12 ? ' (or until we have ' + keep + ' decimal places)' : '') + '.',
                scene: Object.assign({ upto: 0 }, scene) });
            steps.push({ say: 'Each step: how many ' + den + 's fit, subtract, and bring down a 0. We get ' + ans + '.' + (e >= 12 ? ' It never ends, so we stop at ' + keep + ' places and do not round.' : ''),
                scene: Object.assign({ upto: 9, done: true }, scene) });
        } else {
            // too many digits to draw as a bracket: list the remainders
            let r = num % den;
            const ln = ['{y:' + num + ' \u00f7 ' + den + '}', 'whole part: ' + Math.floor(num / den)];
            let digits = '';
            for (let i = 0; i < Math.min(places, 7); i++) {
                const cur = r * 10;
                const q2 = Math.floor(cur / den);
                ln.push(cur + ' \u00f7 ' + den + ' = {b:' + q2 + '}' + (cur - q2 * den ? '  (left ' + (cur - q2 * den) + ')' : ''));
                digits += q2;
                r = cur - q2 * den;
                if (!r) break;
            }
            steps.push({ say: (intro || '') + num + ' \u00f7 ' + den + ': ' + den + ' ' + (num < den ? 'does not fit into ' + num + ', so write 0 and a decimal point, ' : 'fits ' + Math.floor(num / den) + ' time' + (Math.floor(num / den) === 1 ? '' : 's') + ', ') + 'then keep adding a 0 and dividing: each remainder becomes ' + 'the next number to divide.',
                scene: lines(ln, { size: 'small' }) });
            steps.push({ say: 'The digits we found, in order, make ' + ans + '.', scene: lines(['{y:' + num + ' \u00f7 ' + den + '}', '{c:' + ans + '}']) });
        }
        return steps;
    };
    const decText = (x, places) => {
        const s = String(Math.round(x * 1e9) / 1e9);
        return s;
    };

    MPCoach.register('frac-decimal', (q) => {
        const { n, d, neg, exp } = q;
        const sign = neg ? '\u2212' : '';
        if (exp) {
            const rn = Math.pow(n, exp), rd = Math.pow(d, exp);
            const val = rn / rd;
            const e = zerosNeeded(rn, rd);
            const ansTxt = e < 12 ? decText(val) : (Math.trunc(val * 100) / 100).toFixed(2);
            return { title: '(' + n + '/' + d + ')' + (exp === 2 ? '\u00b2' : '\u00b3'), steps: [
                { say: 'A power means multiply by itself ' + exp + ' times. Raise the top and the bottom to the power: ' + n + '^' + exp + ' = ' + rn + ' and ' + d + '^' + exp + ' = ' + rd + '.',
                  scene: lines(['{y:([' + n + '/' + d + '])^' + exp + '}', '{b:' + n + '^' + exp + ' = ' + rn + '}', '{a:' + d + '^' + exp + ' = ' + rd + '}', '{c:' + F(rn, rd) + '}']) }]
                .concat(divideSteps(rn, rd, ansTxt, 2, 'Now write ' + rn + '/' + rd + ' as a decimal. ')) };
        }
        const ansTxt = sign + decText(n / d);
        const steps = [{ say: 'A fraction bar means divide. So ' + (neg ? 'minus ' : '') + n + '/' + d + ' is ' + sign + n + ' \u00f7 ' + d + '.',
            scene: lines([(neg ? '\u2212' : '') + F(n, d), 'means', sign + n + ' \u00f7 ' + d]) }]
            .concat(divideSteps(n, d, decText(n / d), 3, ''));
        if (neg) steps.push({ say: 'It was a negative fraction, so the decimal is negative too: ' + ansTxt + '.', scene: lines(['{y:\u2212' + F(n, d) + '}', '{c:' + ansTxt + '}']) });
        return { title: sign + n + '/' + d + ' as a decimal', steps };
    });

    // ---- a fraction divided by a whole number ----
    MPCoach.register('frac-nested', (q) => {
        const { n, d, w, neg, exp } = q;
        const sign = neg ? '\u2212' : '';
        const pn = exp ? Math.pow(n, exp) : n, pd = exp ? Math.pow(d, exp) : d;
        const steps = [];
        if (exp) steps.push({ say: 'Do the power first. ' + n + '^' + exp + ' = ' + pn + ' and ' + d + '^' + exp + ' = ' + pd + ', so the top fraction is ' + pn + '/' + pd + '.',
            scene: lines(['{y:([' + n + '/' + d + '])^' + exp + ' \u00f7 ' + w + '}', '{b:' + F(pn, pd) + ' \u00f7 ' + w + '}']) });
        steps.push({ say: 'The fraction bar means divide, so this is ' + sign + pn + '/' + pd + ' \u00f7 ' + w + '. A whole number is a fraction with 1 on the bottom: ' + w + ' = ' + w + '/1.',
            scene: lines([(neg ? '\u2212' : '') + F(pn, pd) + ' \u00f7 ' + w, w + ' = ' + F(w, 1)]) });
        steps.push({ say: 'Divide by flipping: dividing by ' + w + '/1 is the same as multiplying by 1/' + w + '. Multiply the tops (' + pn + ' \u00d7 1 = ' + pn + ') and the bottoms (' + pd + ' \u00d7 ' + w + ' = ' + pd * w + '). The result is ' + pn + '/' + pd * w + '.',
            scene: lines([F(pn, pd) + ' \u00d7 {b:' + F(1, w) + '}', 'tops: ' + pn + '    bottoms: {a:' + pd + ' \u00d7 ' + w + ' = ' + pd * w + '}', '{c:' + F(pn, pd * w) + '}']) });
        const g = gcd(pn, pd * w), rn = pn / g, rd = (pd * w) / g;
        if (g > 1) steps.push({ say: 'Simplify by dividing the top and the bottom by ' + g + ': ' + rn + '/' + rd + '.', scene: lines([F(pn, pd * w), '\u00f7 {b:' + g + '}', '{c:' + F(rn, rd) + '}']) });
        const val = rn / rd, e = zerosNeeded(rn, rd);
        const ansTxt = sign + (e < 12 ? decText(val) : (Math.trunc(val * 1000) / 1000).toFixed(3));
        steps.push.apply(steps, divideSteps(rn, rd, ansTxt.replace('\u2212', ''), 3, 'Now write ' + rn + '/' + rd + ' as a decimal. '));
        if (neg) steps.push({ say: 'It started negative, so the answer is negative: ' + ansTxt + '.', scene: lines(['{y:\u2212' + F(rn, rd) + '}', '{c:' + ansTxt + '}']) });
        return { title: 'A fraction divided by ' + w, steps };
    });

    // ---- find the missing fraction ----
    MPCoach.register('frac-eq', (q) => {
        const { op, known, result, ans } = q;
        const back = { add: 'subtract', subtract: 'add', multiply: 'divide', divide: 'multiply' }[op];
        const sym = SYM[op];
        const k = known, r = result;
        // ? op k = r  ->  ? = r back k   (for subtract and divide too: ? \u2212 k = r means ? = r + k)
        const inner = back === 'add' || back === 'subtract'
            ? addSub([r, k], back, ans)
            : mulDiv([r, k], back, ans);
        const intro = { say: 'The missing fraction is hiding in the equation. Use the opposite operation to find it: the opposite of ' + (op === 'add' ? 'adding' : op === 'subtract' ? 'subtracting' : op === 'multiply' ? 'multiplying' : 'dividing') + ' is ' + (back === 'add' ? 'adding' : back === 'subtract' ? 'subtracting' : back === 'multiply' ? 'multiplying' : 'dividing') + '.',
            scene: lines(['{y:? ' + sym + ' ' + F(k.n, k.d) + ' = ' + F(r.n, r.d) + '}', '{b:use the opposite}', '? = ' + F(r.n, r.d) + ' ' + SYM[back] + ' ' + F(k.n, k.d)]) };
        return { title: '? ' + sym + ' ' + k.n + '/' + k.d + ' = ' + r.n + '/' + r.d, steps: [intro].concat(inner) };
    });

    MPCoach.fracKit = { divideSteps, finish, zerosNeeded, decText };   // borrowed by the conversions explainers
})();
