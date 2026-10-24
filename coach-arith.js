// Worked examples for the four operations (practice.html), as the coach's steps.
// q = {kind:'arith', op:'add'|'subtract'|'multiply'|'divide', a, b, digits}
// Whole numbers and decimals are drawn with the paper scenes (columns, longmult, longdiv);
// a negative operand adds a short sign step around the same working.
(() => {
    'use strict';

    const M = (s) => String(s).replace(/-/g, '−');
    const num = (n) => String(Math.round(n * 1e6) / 1e6);
    const dp = (n) => (num(n).split('.')[1] || '').length;
    const wrap = (n) => (n < 0 ? '(' + M(num(n)) + ')' : num(n));
    const PLACE = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];
    const DEC = ['tenths', 'hundredths', 'thousandths', 'ten-thousandths'];
    const SYM = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
    const BIG = (n) => Math.abs(n) >= 1e9;

    // ---------------- + and − in columns ----------------
    const split = (s) => { const p = String(s).split('.'); return { i: p[0], d: p[1] || '' }; };
    const columns = (aStr, bStr, add) => {
        const A = split(aStr), B = split(bStr);
        const dec = Math.max(A.d.length, B.d.length), intLen = Math.max(A.i.length, B.i.length);
        const digs = (P) => (P.i.padStart(intLen, '0') + P.d.padEnd(dec, '0')).split('').map(Number);
        const a = digs(A), b = digs(B), n = a.length;
        const name = (c) => (c >= intLen ? DEC[c - intLen] : PLACE[intLen - 1 - c]);
        const out = [];
        let carry = 0;
        for (let c = n - 1; c >= 0; c--) {
            let say, d;
            if (add) {
                const sum = a[c] + b[c] + carry;
                d = sum % 10;
                say = cap(name(c)) + ': ' + a[c] + ' + ' + b[c] + (carry ? ' + ' + carry : '') + ' = ' + sum + '.'
                    + (sum >= 10 ? ' ' + sum + ' is 1 ten and ' + d + (d === 1 ? ' one' : ' ones') + '. ' + (c > 0 ? 'Write the ' + d + ' under the line, and carry the 1 from the ' + sum + ' up to the top of the next column.' : 'Write the ' + d + ', and the 1 from the ' + sum + ' goes in front.') : ' Write ' + d + '.');
                carry = sum >= 10 ? 1 : 0;
            } else {
                const eff = a[c] - carry;
                let v = eff - b[c], borrow = 0;
                if (v < 0) { v += 10; borrow = 1; }
                d = v;
                const was = carry ? 'The ' + a[c] + ' became ' + eff + ' after lending one. ' : '';
                if (eff < 0) {
                    say = cap(name(c)) + ': the ' + a[c] + ' lent one away, so we borrow again. That makes ' + (eff + 10) + ', and ' + (eff + 10) + ' − ' + b[c] + ' = ' + d + '.';
                } else if (borrow) {
                    say = cap(name(c)) + ': ' + was + eff + ' − ' + b[c] + ' is too small, so we borrow. Cross out the ' + (c > 0 ? a[c - 1] : 'next digit') + ', write one less above it, and make this ' + (eff + 10) + '. ' + (eff + 10) + ' − ' + b[c] + ' = ' + d + '.';
                } else {
                    say = cap(name(c)) + ': ' + was + eff + ' − ' + b[c] + ' = ' + d + '.';
                }
                carry = borrow;
            }
            out.push(say);
        }
        return { say: out, dec };
    };
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const columnSteps = (aStr, bStr, add, answerText) => {
        const { say, dec } = columns(aStr, bStr, add);
        const op = add ? '+' : '-';
        const steps = [{ say: 'Write ' + aStr + ' on top and ' + bStr + ' under it, with the ' + (add ? 'plus' : 'minus') + ' sign after.'
            + (dec ? ' Line up the decimal points (add zeros so both have the same number of decimal places).' : ' Ones go under ones, tens under tens.')
            + ' We start on the right.',
            scene: { kind: 'columns', op, a: aStr, b: bStr, upto: 0 } }];
        say.forEach((t, k) => steps.push({ say: t, scene: { kind: 'columns', op, a: aStr, b: bStr, upto: k + 1 } }));
        const total = say.length;
        steps.push({ say: 'So ' + aStr + ' ' + SYM[add ? 'add' : 'subtract'] + ' ' + bStr + ' = ' + answerText + '.' + (dec ? ' The decimal point comes straight down.' : ''),
            scene: { kind: 'columns', op, a: aStr, b: bStr, upto: total, done: true } });
        return steps;
    };

    // ---------------- × on paper ----------------
    const multSteps = (aStr, bStr, answerText) => {
        const A = aStr.split('').map(Number).reverse(), B = bStr.split('').map(Number).reverse();
        const n = A.length, m = B.length;
        const steps = [{ say: 'Write ' + aStr + ' on top and ' + bStr + ' under it, ones under ones, with the times sign after. We multiply one digit of the bottom number at a time, starting on the right.',
            scene: { kind: 'longmult', a: aStr, b: bStr, upto: 0 } }];
        for (let j = 0; j < m; j++) {
            let carry = 0;
            const parts = [];
            for (let i = 0; i < n; i++) {
                const p = A[i] * B[j] + carry;
                const last = i === n - 1;
                parts.push(B[j] + ' × ' + A[i] + (carry ? ' + ' + carry + ' (carried)' : '') + ' = ' + p
                    + (last ? ': write ' + p + '.' : (p >= 10 ? ': ' + p + ' is ' + Math.floor(p / 10) + (Math.floor(p / 10) === 1 ? ' ten' : ' tens') + ' and ' + (p % 10) + (p % 10 === 1 ? ' one' : ' ones') + '. Write the ' + (p % 10) + ' and carry the ' + Math.floor(p / 10) + ' from the ' + p + ' up above the next digit.' : ': write ' + p + '.')));
                carry = Math.floor(p / 10);
            }
            const lead = j > 0 ? 'Start this row with ' + (j === 1 ? 'a 0' : j + ' zeros') + ' to hold the place. ' : '';
            steps.push({ say: (m > 1 ? 'Multiply by the ' + PLACE[j] + ' digit, ' + B[j] + '. ' : 'Now multiply. ') + lead + parts.join(' '),
                scene: { kind: 'longmult', a: aStr, b: bStr, upto: (j + 1) * n } });
        }
        if (m > 1) steps.push({ say: 'Draw a line and add the rows. That gives ' + answerText + '.', scene: { kind: 'longmult', a: aStr, b: bStr, upto: m * n, sum: true, done: true } });
        else steps[steps.length - 1].scene.done = true;
        return steps;
    };

    // ---------------- ÷ with the bracket ----------------
    const divPlan = (a, b, extra) => {
        const ints = String(a).split('').map(Number), nI = ints.length;
        const digits = ints.concat(Array(extra).fill(0));
        const all = [];
        let r = 0, started = false;
        digits.forEach((d, k) => {
            const cur = r * 10 + d, q = Math.floor(cur / b);
            if (!started && q === 0 && k < (extra ? nI : nI - 1)) { r = cur; return; }
            started = true;
            all.push({ k, cur, q, prod: q * b, rem: cur - q * b });
            r = cur - q * b;
        });
        return { all, nI, digits };
    };
    const divSteps = (a, b, answerText) => {
        // fewest zeros that make it come out exactly (at most 3, then we round)
        let extra = 0;
        while (extra < 3 && (a * Math.pow(10, extra)) % b !== 0) extra++;
        const exact = (a * Math.pow(10, extra)) % b === 0;
        const { all, nI, digits } = divPlan(a, b, extra);
        const steps = [{ say: 'Put ' + a + ' inside the bracket and ' + b + ' outside on the left. We work from the left, one digit at a time.',
            scene: { kind: 'longdiv', divisor: b, dividend: a, extra, upto: 0 } }];
        all.forEach((st, s) => {
            let say = '';
            if (s === 0 && st.cur >= 10) say += b + ' does not fit into ' + String(a).slice(0, String(st.cur).length - 1) + ', so look at ' + st.cur + '. ';
            if (st.k === nI && extra) say += 'We are out of digits and there is something left over, so put a decimal point after ' + a + ' and after the answer so far, and bring down a 0. ';
            else if (st.k > nI) say += 'Bring down another 0. ';
            say += 'How many ' + b + 's fit into ' + st.cur + '? ' + (st.q === 0 ? 'None, so write 0.' : st.q + '. Write ' + st.q + ' on top.')
                + ' ' + st.q + ' × ' + b + ' = ' + st.prod + ', and ' + st.cur + ' − ' + st.prod + ' = ' + st.rem + '.'
                + (digits[st.k + 1] !== undefined ? ' Bring down the next digit.' : '');
            steps.push({ say, scene: { kind: 'longdiv', divisor: b, dividend: a, extra, upto: s + 1 } });
        });
        const last = steps.length - 1;
        steps[last].scene.done = true;
        if (!exact) steps.push({ say: 'It never comes out exactly, so we stop and round to 2 decimal places: ' + answerText + '.', scene: Object.assign({}, steps[last].scene) });
        else steps.push({ say: 'So the answer is ' + answerText + '.', scene: Object.assign({}, steps[last].scene) });
        return steps;
    };

    // ---------------- whole-number helpers on any non-negative operands ----------------
    const small = (op, a, b, ans) => {
        const list = (from, count, dir) => Array.from({ length: count }, (_, i) => from + dir * (i + 1)).join(', ');
        if (op === 'add') return [
            { say: 'Start at ' + a + ' and count on ' + b + ': ' + list(a, b, 1) + '. So ' + a + ' + ' + b + ' = ' + ans + '.',
              scene: { kind: 'numberline', min: Math.max(0, a - 1), max: a + b + 1, start: a, hops: b, dir: 1, counts: true } },
            { say: 'On paper: ' + a + ' on top, ' + b + ' under it, the plus sign after, and a line. ' + a + ' + ' + b + ' = ' + ans + '.',
              scene: { kind: 'columns', op: '+', a: String(a), b: String(b), upto: 1, done: true } }];
        if (op === 'subtract') return [
            { say: 'Start at ' + a + ' and count back ' + b + ': ' + list(a, b, -1) + '. So ' + a + ' − ' + b + ' = ' + M(ans) + '.',
              scene: { kind: 'numberline', min: Math.min(a - b, a) - 1, max: a + 1, start: a, hops: b, dir: -1, counts: true } }];
        if (op === 'multiply') {
            const step = Math.max(a, b), hops = Math.min(a, b);
            return [
                { say: a + ' × ' + b + ' means ' + hops + ' jumps of ' + step + ': ' + Array.from({ length: hops }, (_, i) => step * (i + 1)).join(', ') + '. So ' + a + ' × ' + b + ' = ' + ans + '.',
                  scene: { kind: 'numberline', min: 0, max: ans, tickEvery: step, start: 0, hops, dir: 1, stepSize: step, counts: true } }];
        }
        return [
            { say: 'How many ' + b + 's fit into ' + a + '? Count in jumps of ' + b + ': ' + Array.from({ length: ans }, (_, i) => b * (i + 1)).join(', ') + '. That is ' + ans + ' jumps, so ' + a + ' ÷ ' + b + ' = ' + ans + '.',
              scene: { kind: 'numberline', min: 0, max: a, tickEvery: b, start: 0, hops: ans, dir: 1, stepSize: b, counts: true } },
            { say: 'On paper we use the bracket: how many ' + b + 's fit into ' + a + '? ' + ans + '.',
              scene: { kind: 'longdiv', divisor: b, dividend: a, upto: divPlan(a, b, 0).all.length, done: true } }];
    };

    // unsigned, no decimals, a and b >= 0: the working for `op`
    const whole = (op, a, b, ans, digits) => {
        const sm = digits === 1 && a <= 10 && b <= 10 && Number.isInteger(ans);
        if (op === 'add') return sm ? small('add', a, b, ans) : columnSteps(String(a), String(b), true, num(ans));
        if (op === 'subtract') {
            if (a >= b) return sm ? small('subtract', a, b, ans) : columnSteps(String(a), String(b), false, num(ans));
            return [{ say: a + ' is smaller than ' + b + ', so the answer is below zero. Work out the difference the other way round, ' + b + ' − ' + a + ', then make it negative.', scene: { kind: 'lines', lines: [a + ' − ' + b, '{y:' + b + ' − ' + a + ' = ' + (b - a) + '}', '{c:' + M(-(b - a)) + '}'] } }]
                .concat(columnSteps(String(b), String(a), false, num(b - a)));
        }
        if (op === 'multiply') return sm ? small('multiply', a, b, ans).concat(multSteps(String(Math.max(a, b)), String(Math.min(a, b)), num(ans))) : multSteps(String(a), String(b), num(ans));
        return sm ? small('divide', a, b, ans) : divSteps(a, b, num(ans));
    };

    // ---------------- decimals ----------------
    const withDecimals = (op, a, b, ans) => {
        const da = dp(a), db = dp(b);
        if (op === 'add' || op === 'subtract') {
            if (op === 'subtract' && a < b) {
                return [{ say: num(a) + ' is smaller than ' + num(b) + ', so the answer is below zero. Subtract the other way round and make it negative.',
                    scene: { kind: 'lines', lines: [num(a) + ' − ' + num(b), '{y:' + num(b) + ' − ' + num(a) + ' = ' + num(b - a) + '}', '{c:' + M(num(a - b)) + '}'] } }]
                    .concat(columnSteps(num(b), num(a), false, num(b - a)));
            }
            return columnSteps(num(a), num(b), op === 'add', num(ans));
        }
        if (op === 'multiply') {
            const ia = String(Math.round(a * Math.pow(10, da))), ib = String(Math.round(b * Math.pow(10, db)));
            const places = da + db;
            return [{ say: 'Ignore the decimal points at first and multiply ' + ia + ' × ' + ib + ' as whole numbers.',
                scene: { kind: 'lines', lines: [num(a) + ' × ' + num(b), '{b:' + ia + ' × ' + ib + '}', 'no decimal points for now'] } }]
                .concat(multSteps(ia, ib, String(Math.round(a * b * Math.pow(10, places)))))
                .concat([{ say: 'Now count the decimal places: ' + num(a) + ' has ' + da + ' and ' + num(b) + ' has ' + db + '. That is ' + places + ' places in all, so the decimal point goes ' + places + ' places in from the right: ' + num(ans) + '.',
                    scene: { kind: 'lines', lines: [da + ' + ' + db + ' = {b:' + places + ' places}', Math.round(a * b * Math.pow(10, places)) + '  →  {c:' + num(ans) + '}'] } }]);
        }
        const s = Math.max(da, db);
        const ia = Math.round(a * Math.pow(10, s)), ib = Math.round(b * Math.pow(10, s));
        return [{ say: 'The number we divide by has a decimal point, so move the point in both numbers ' + s + ' place' + (s > 1 ? 's' : '') + ' to the right until it is a whole number: ' + num(a) + ' ÷ ' + num(b) + ' becomes ' + ia + ' ÷ ' + ib + '.',
            scene: { kind: 'lines', lines: [num(a) + ' ÷ ' + num(b), 'move both points {b:' + s + ' place' + (s > 1 ? 's' : '') + '}', '{c:' + ia + ' ÷ ' + ib + '}'] } }]
            .concat(divSteps(ia, ib, num(ans)));
    };

    // ---------------- negatives ----------------
    const signed = (op, a, b, ans, rest) => {
        const aa = Math.abs(a), bb = Math.abs(b);
        const mag = (o, x, y, r) => rest(o, x, y, r);
        const answerLine = (txt) => ({ say: txt, scene: { kind: 'lines', lines: [wrap(a) + ' ' + SYM[op] + ' ' + wrap(b), '{c:' + M(num(ans)) + '}'] } });
        if (op === 'subtract') {
            // taking away a number is the same as adding its opposite
            const opp = -b;
            return [{ say: 'Subtracting a number is the same as adding its opposite. So ' + num(a) + ' − ' + wrap(b) + ' becomes ' + num(a) + ' + ' + wrap(opp) + '.',
                scene: { kind: 'lines', lines: [M(num(a)) + ' − ' + wrap(b), '{y:change − into +, and flip the sign}', '{b:' + M(num(a)) + ' + ' + wrap(opp) + '}'] } }]
                .concat(signed('add', a, opp, ans, rest));
        }
        if (op === 'add') {
            if (a < 0 && b < 0) {
                return [{ say: 'Both numbers are negative, so we add their sizes and keep the minus sign. Ignore the signs for a moment: ' + num(aa) + ' + ' + num(bb) + '.',
                    scene: { kind: 'lines', lines: [wrap(a) + ' + ' + wrap(b), 'same signs: {b:add the sizes}', num(aa) + ' + ' + num(bb)] } }]
                    .concat(mag('add', aa, bb, aa + bb))
                    .concat([answerLine('Put the minus sign back: ' + M(num(ans)) + '.')]);
            }
            const big = Math.max(aa, bb), little = Math.min(aa, bb);
            const winner = aa > bb ? a : b;
            return [{ say: 'The signs are different, so subtract the smaller size from the bigger size. The answer takes the sign of the number that is bigger without its sign: ' + (winner < 0 ? 'negative' : 'positive') + '. Subtract ' + num(big) + ' − ' + num(little) + '.',
                scene: { kind: 'lines', lines: [wrap(a) + ' + ' + wrap(b), 'different signs: {b:subtract the sizes}', num(big) + ' − ' + num(little)] } }]
                .concat(big === little ? [] : mag('subtract', big, little, big - little))
                .concat([answerLine(big === little ? 'They cancel out, so the answer is 0.' : 'Give it the sign of ' + wrap(winner) + ', which is ' + (winner < 0 ? 'negative' : 'positive') + ': ' + M(num(ans)) + '.')]);
        }
        const same = (a < 0) === (b < 0);
        return [{ say: 'First the sign. ' + (same ? 'Both numbers have the same sign, so the answer is positive.' : 'The signs are different, so the answer is negative.') + ' Then work with the sizes: ' + num(aa) + ' ' + SYM[op] + ' ' + num(bb) + '.',
            scene: { kind: 'lines', lines: [wrap(a) + ' ' + SYM[op] + ' ' + wrap(b), '{b:' + (same ? 'same signs: positive' : 'different signs: negative') + '}', num(aa) + ' ' + SYM[op] + ' ' + num(bb)] } }]
            .concat(mag(op, aa, bb, Math.abs(ans)))
            .concat([answerLine((same ? 'Same signs, so positive: ' : 'Different signs, so negative: ') + M(num(ans)) + '.')]);
    };

    const arith = (q) => {
        const { op, a, b } = q;
        if (BIG(a) || BIG(b)) return null;
        const ans = op === 'add' ? a + b : op === 'subtract' ? a - b : op === 'multiply' ? a * b : a / b;
        const ansR = Math.round(ans * 100) / 100;
        const hasDec = dp(a) > 0 || dp(b) > 0;
        const nonNeg = (o, x, y, r) => (hasDec ? withDecimals(o, x, y, Math.round(r * 100) / 100) : whole(o, x, y, r, q.digits === 1 && Math.abs(a) <= 10 && Math.abs(b) <= 10 ? 1 : 2));
        let steps;
        if (a < 0 || b < 0) steps = signed(op, a, b, ansR, nonNeg);
        else steps = nonNeg(op, a, b, ansR);
        return { title: num(a) < 0 || num(b) < 0 ? M(num(a)) + ' ' + SYM[op] + ' ' + wrap(b) : num(a) + ' ' + SYM[op] + ' ' + num(b), steps };
    };

    MPCoach.arithKit = { columnSteps, multSteps, divSteps };    // the other explainers borrow these
    MPCoach.register('arith', arith);
    MPCoach.arith = arith;      // exposed for the checks in dev/
})();
