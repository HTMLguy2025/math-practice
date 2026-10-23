// Worked examples for rounding.html.
//   round  {num, precision: 10|100, answer}
(() => {
    'use strict';

    const lines = (arr, extra) => Object.assign({ kind: 'lines', lines: arr }, extra || {});

    MPCoach.register('round', (q) => {
        const { num, precision, answer } = q;
        const s = String(num);
        const place = precision === 10 ? 'ones' : 'tens';
        const deciding = precision === 10 ? Number(s.slice(-1)) : Number(s.slice(-2, -1));
        const shown = precision === 10 ? s.slice(-1) : s.slice(-2);
        const up = deciding >= 5;
        const lo = Math.floor(num / precision) * precision, hi = lo + precision, half = lo + precision / 2;
        const step = precision / 10;
        const nearest = precision === 10 ? 'ten' : 'hundred';
        return { title: 'Round ' + num + ' to the nearest ' + precision, steps: [
            { say: 'Rounding to the nearest ' + precision + ' means finding the ' + nearest + ' that ' + num + ' is closest to. Look at the ' + place + ' digit, the highlighted one: it is ' + deciding + (precision === 100 ? ' (the tens digit of ' + shown + ')' : '') + '.',
              scene: lines(['{y:' + num + '}', 'look at the ' + place + ' digit: {b:' + deciding + '}', '{a:0 1 2 3 4}  round down', '{b:5 6 7 8 9}  round up'], { size: 'small' }) },
            { say: num + ' sits between ' + lo + ' and ' + hi + '. The halfway point is ' + half + ', and ' + num + ' is ' + (num >= half ? 'past' : 'before') + ' it, so it is closer to ' + answer + '.',
              scene: { kind: 'numberline', min: lo, max: hi, tickEvery: step, labelEvery: 5, marks: [{ v: num, color: 'b' }],
                  annos: [{ v: lo, text: String(lo), color: 'a' }, { v: half, text: 'halfway', color: 'b' }, { v: hi, text: String(hi), color: 'a' }] } },
            { say: deciding + ' is ' + (up ? '5 or more, so round up' : '4 or less, so round down') + ' to ' + answer + '.', scene: lines(['{y:' + num + '}', deciding + ' → round ' + (up ? '{b:up}' : '{a:down}'), '{c:' + answer + '}']) }] };
    });
})();
