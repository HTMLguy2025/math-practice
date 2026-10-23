// Worked examples for placevalue.html.
//   pv-digit  {num, place:'ones'|'tens'|'hundreds', digit}      which digit is in a place
//   pv-tens   {tens, ask:'count'|'number'}                      N tens, as a number
(() => {
    'use strict';

    const lines = (arr, extra) => Object.assign({ kind: 'lines', lines: arr }, extra || {});
    const POS = { ones: 0, tens: 1, hundreds: 2 };

    MPCoach.register('pv-digit', (q) => {
        const { num, place, digit } = q;
        const s = String(num);
        return { title: 'Which digit is in the ' + place + ' place?', steps: [
            { say: 'Every digit sits in a place. Start on the right: the last digit is the ones place, the next is the tens, and then the hundreds.',
              scene: { kind: 'placevalue', digits: s } },
            { say: 'We want the ' + place + ' place. Counting from the right, that is the ' + (POS[place] === 0 ? 'last' : POS[place] === 1 ? 'second' : 'third') + ' digit. It is ' + digit + '.',
              scene: { kind: 'placevalue', digits: s, highlight: POS[place] } }] };
    });

    MPCoach.register('pv-tens', (q) => {
        const { tens } = q;
        const num = tens * 10;
        return { title: tens + ' tens', steps: [
            { say: 'A ten is a group of 10. ' + tens + ' tens means ' + tens + ' groups of 10.', scene: { kind: 'placevalue', digits: String(num), highlight: 1 } },
            { say: tens + ' groups of 10 is ' + tens + ' × 10 = ' + num + '. In ' + num + ', the ' + tens + ' is in the tens place and the 0 holds the ones place.',
              scene: lines(['{y:' + tens + ' tens}', tens + ' × 10 = {c:' + num + '}']) }] };
    });
})();
