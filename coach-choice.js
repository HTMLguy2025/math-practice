// Worked examples for choice.html.
//   choice-oddeven  {n}
//   choice-prime    {n}
//   choice-compare  {a, b}
//   choice-skip     {seq, inc, correct}
(() => {
    'use strict';

    const lines = (arr, extra) => Object.assign({ kind: 'lines', lines: arr }, extra || {});

    MPCoach.register('choice-oddeven', (q) => {
        const { n } = q;
        const last = n % 10, even = n % 2 === 0;
        const steps = [];
        if (n <= 12) steps.push({ say: 'Put ' + n + ' dots in pairs. ' + (even ? 'Every dot has a partner, so ' + n + ' is even.' : 'One dot is left without a partner, so ' + n + ' is odd.'), scene: { kind: 'pairs', n, phase: 'pairs' } });
        else steps.push({ say: 'For big numbers, only the last digit matters. Even numbers end in 0, 2, 4, 6 or 8. Odd numbers end in 1, 3, 5, 7 or 9. ' + n + ' ends in ' + last + '.',
            scene: lines(['{a:even}: ends in 0 2 4 6 8', '{b:odd}: ends in 1 3 5 7 9', '{y:' + n + ' ends in ' + last + '}']) });
        if (n > 12) steps.push({ say: last + ' is ' + (even ? 'even' : 'odd') + ', so ' + n + ' is ' + (even ? 'even' : 'odd') + '.', scene: lines(['{y:' + n + '}', '→ ends in ' + last, '{c:' + (even ? 'even' : 'odd') + '}']) });
        return { title: 'Odd or even: ' + n, steps };
    });

    MPCoach.register('choice-prime', (q) => {
        const { n } = q;
        const steps = [{ say: 'A prime number can only be made by 1 × itself. A composite number can be made in another way too. Let’s test ' + n + ' by trying small numbers: 2, 3, 5 and 7.',
            scene: lines(['{y:is ' + n + ' prime?}', 'try dividing by {b:2, 3, 5, 7}']) }];
        let found = 0;
        for (const d of [2, 3, 5, 7]) if (d < n && n % d === 0) { found = d; break; }
        if (found) steps.push({ say: found + ' goes into ' + n + ': ' + found + ' × ' + n / found + ' = ' + n + '. So ' + n + ' can be built another way besides 1 × ' + n + ', which makes it composite.',
            scene: lines(['{y:' + n + '}', found + ' × ' + n / found + ' = ' + n, '{c:composite}']) });
        else steps.push({ say: 'None of them go into ' + n + ' evenly (each leaves a remainder), so only 1 × ' + n + ' works. That makes ' + n + ' prime.',
            scene: lines(['{y:' + n + '}', '2, 3, 5, 7 do not go in', '{c:prime}']) });
        return { title: 'Prime or composite: ' + n, steps };
    });

    MPCoach.register('choice-compare', (q) => {
        const { a, b } = q;
        const A = String(a), B = String(b);
        const names = ['ones', 'tens', 'hundreds'];
        const sym = a > b ? '>' : a < b ? '<' : '=';
        if (a === b) return { title: a + ' and ' + b, steps: [{ say: 'Every digit is the same, so the numbers are exactly equal: use the equals sign.', scene: lines(['{y:' + a + '  and  ' + b + '}', '{c:' + a + ' = ' + b + '}']) }] };
        const rows = ['{y:' + a + '  and  ' + b + '}'];
        let said = '';
        for (let k = 0; k < A.length; k++) {
            const place = names[A.length - 1 - k];
            if (A[k] === B[k]) { rows.push(place + ': ' + A[k] + ' = ' + B[k] + '  (same)'); said += 'The ' + place + ' digits match (' + A[k] + '), so look at the next place. '; }
            else {
                rows.push(place + ': {a:' + A[k] + '}  vs  {b:' + B[k] + '}');
                said += 'The ' + place + ' are different: ' + A[k] + ' and ' + B[k] + '. ' + (a > b ? A[k] + ' is bigger' : B[k] + ' is bigger') + ', so ' + a + ' is ' + (a > b ? 'greater' : 'less') + ' than ' + b + '. ';
                break;
            }
        }
        rows.push('{c:' + a + ' ' + sym + ' ' + b + '}');
        return { title: 'Comparing ' + a + ' and ' + b, steps: [
            { say: 'Compare one digit at a time, starting from the left, where the places are biggest. ' + said + 'The open mouth of the symbol faces the bigger number: ' + a + ' ' + sym + ' ' + b + '.', scene: lines(rows) }] };
    });

    MPCoach.register('choice-skip', (q) => {
        const { seq, inc, correct } = q;
        const items = seq.concat(['?']);
        return { title: 'Counting by ' + inc, steps: [
            { say: 'Look at how much the numbers go up each time: ' + seq[1] + ' − ' + seq[0] + ' = ' + inc + '. We are counting by ' + inc + 's.', scene: { kind: 'sequence', items, step: inc } },
            { say: 'The last number is ' + seq[3] + '. Add ' + inc + ' to get the next one: ' + seq[3] + ' + ' + inc + ' = ' + correct + '.', scene: { kind: 'sequence', items, step: inc, reveal: correct } }] };
    });
})();
