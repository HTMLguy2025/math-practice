// Worked examples for money.html.
//   money-count  {pieces:[cents...]}        add up the coins and bills on screen
//   money-arith  {op:'add'|'subtract', a, b}   amounts in cents
(() => {
    'use strict';

    const dollars = (c) => '$' + Math.floor(c / 100) + '.' + String(c % 100).padStart(2, '0');
    const label = (c) => (c < 100 ? c + '\u00a2' : '$' + c / 100);
    const NAME = { 1: 'penny', 5: 'nickel', 10: 'dime', 25: 'quarter', 100: '$1 bill', 500: '$5 bill', 1000: '$10 bill', 2000: '$20 bill' };
    const lines = (arr, extra) => Object.assign({ kind: 'lines', lines: arr }, extra || {});

    MPCoach.register('money-count', (q) => {
        const items = q.pieces.slice().sort((a, b) => b - a);
        const total = items.reduce((s, c) => s + c, 0);
        let run = 0;
        const running = items.map(c => { run += c; return label(c) + ' \u2192 ' + dollars(run); });
        const bills = items.filter(c => c >= 100), coins = items.filter(c => c < 100);
        const steps = [{ say: 'Put the biggest pieces first, and count them up as you go. Bills first, then quarters, dimes, nickels and pennies.',
            scene: { kind: 'coins', items, names: true, hideTotal: true } }];
        steps.push({ say: 'Add them one at a time: ' + items.map((c, i) => (i ? 'plus ' : '') + (NAME[c] || label(c)) + ' makes ' + dollars(items.slice(0, i + 1).reduce((s, x) => s + x, 0))).join(', ') + '.',
            scene: lines(running.length > 6 ? running : running, { size: running.length > 5 ? 'small' : undefined }) });
        steps.push({ say: 'The total is ' + dollars(total) + '. The dollars go before the point and the cents after it.' + (bills.length && coins.length ? ' Count the bills first, then the coins.' : ''),
            scene: { kind: 'coins', items, reveal: items.length } });
        return { title: 'Counting the money', steps };
    });

    MPCoach.register('money-arith', (q) => {
        const { op, a, b } = q;
        const add = op === '+';
        const ans = add ? a + b : a - b;
        const kit = MPCoach.arithKit;
        const steps = [{ say: 'Money works just like decimals. The dollars are on the left of the point and the cents are on the right, so we line up the points.',
            scene: lines(['{y:' + dollars(a) + ' ' + (add ? '+' : '\u2212') + ' ' + dollars(b) + '}', 'dollars . cents']) }];
        kit.columnSteps((a / 100).toFixed(2), (b / 100).toFixed(2), add, dollars(ans)).forEach(st => {
            steps.push(Object.assign({}, st, { say: st.say.replace(/Hundredths/g, 'Cents (hundredths)').replace(/Tenths/g, 'Dimes (tenths)').replace(/Ones/g, 'Dollars') }));
        });
        return { title: dollars(a) + ' ' + (add ? '+' : '\u2212') + ' ' + dollars(b), steps };
    });
})();
