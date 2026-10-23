// Worked examples for numberline.html.
//   nl-read      {v, min, max, label}          read the number a dot sits on (only every `label`th mark is numbered)
//   nl-seq       {seq, missing}                the missing number in a counting sequence
//   nl-countfrom {start, steps, dir}           hop forward or back
//   nl-fraction  {denom, numr}                 the fraction a dot sits on
(() => {
    'use strict';

    const M = (s) => String(s).replace(/-/g, '−');
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const lines = (arr, extra) => Object.assign({ kind: 'lines', lines: arr }, extra || {});

    MPCoach.register('nl-read', (q) => {
        const { v, min, max, label } = q;
        const near = Math.round(v / label) * label;
        const k = v - near, dir = k >= 0 ? 1 : -1;
        const line = { kind: 'numberline', min, max, labelEvery: label };
        const steps = [{ say: 'Only some of the marks have numbers on them: every ' + label + 'th one. The little marks in between each count as 1. Find the numbered mark closest to the dot: ' + M(near) + '.',
            scene: Object.assign({ marks: [{ v: near, color: 'a', label: M(near) }] }, line) }];
        if (k === 0) steps.push({ say: 'The dot sits right on ' + M(near) + ', so the number is ' + M(near) + '.', scene: Object.assign({ marks: [{ v, color: 'c' }] }, line) });
        else steps.push({ say: 'The dot is ' + Math.abs(k) + ' little mark' + (Math.abs(k) === 1 ? '' : 's') + ' to the ' + (dir > 0 ? 'right' : 'left') + ' of ' + M(near) + '. Moving right adds 1 for each mark and moving left takes away 1. So ' + M(near) + (dir > 0 ? ' + ' : ' − ') + Math.abs(k) + ' = ' + M(v) + '.',
            scene: Object.assign({ start: near, hops: Math.abs(k), dir, counts: true }, line) });
        return { title: 'Reading the number line', steps };
    });

    MPCoach.register('nl-seq', (q) => {
        const { seq, missing } = q;
        const step = seq[1] - seq[0];
        const items = seq.map((x, i) => (i === missing ? '?' : x));
        const ans = seq[missing];
        const word = step > 0 ? 'counting up by 1' : 'counting down by 1';
        const steps = [{ say: 'Look at the numbers on either side of the gap. They are ' + word + ' each time.', scene: { kind: 'sequence', items, step } }];
        steps.push(missing === 0
            ? { say: 'The gap is at the start. The next number is ' + seq[1] + ', so the missing number is ' + seq[1] + (step > 0 ? ' − 1 = ' : ' + 1 = ') + ans + '.', scene: { kind: 'sequence', items, step, reveal: ans } }
            : { say: 'The number just before the gap is ' + seq[missing - 1] + '. ' + seq[missing - 1] + (step > 0 ? ' + 1 = ' : ' − 1 = ') + ans + '. The missing number is ' + ans + '.', scene: { kind: 'sequence', items, step, reveal: ans } });
        return { title: 'The missing number', steps };
    });

    MPCoach.register('nl-countfrom', (q) => {
        const { start, steps: n, dir } = q;
        const ans = start + n * dir;
        const lo = Math.min(start, ans) - 1, hi = Math.max(start, ans) + 1;
        const hops = Array.from({ length: n }, (_, i) => start + (i + 1) * dir).join(', ');
        return { title: 'Start at ' + start + ', count ' + (dir > 0 ? 'forward ' : 'backward ') + n, steps: [
            { say: 'Start at ' + start + '. Counting ' + (dir > 0 ? 'forward' : 'backward') + ' means we hop ' + (dir > 0 ? 'to the right' : 'to the left') + ', one number at a time, ' + n + ' times.',
              scene: { kind: 'numberline', min: lo, max: hi, marks: [{ v: start, color: 'a' }] } },
            { say: 'Hop ' + n + ' times: ' + hops + '. You land on ' + ans + '.', scene: { kind: 'numberline', min: lo, max: hi, start, hops: n, dir, counts: true } }] };
    });

    MPCoach.register('nl-fraction', (q) => {
        const { denom, numr } = q;
        const g = gcd(numr, denom), rn = numr / g, rd = denom / g;
        const steps = [{ say: 'The space from 0 to 1 is cut into ' + denom + ' equal parts, so each part is 1/' + denom + '. Count the hops from 0 to the dot: ' + numr + '. The dot is at ' + numr + '/' + denom + '.',
            scene: { kind: 'fracline', den: denom, mark: numr, hops: true } }];
        if (g > 1) steps.push({ say: numr + '/' + denom + ' can be simplified: ' + g + ' goes into both, so it is ' + rn + '/' + rd + '. That is the answer to pick.',
            scene: lines(['[' + numr + '/' + denom + ']', '÷ {b:' + g + '} top and bottom', '{c:[' + rn + '/' + rd + ']}']) });
        return { title: 'The fraction on the number line', steps };
    });
})();
