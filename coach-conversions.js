// Worked examples for conversions.html.
//   conv  {dir:'frac-to-decimal'|'decimal-to-frac'|'frac-to-percent'|'percent-to-frac'|'decimal-to-percent'|'percent-to-decimal',
//          n, d (a reduced fraction), decimal, pct}
(() => {
    'use strict';

    const F = (n, d) => '[' + n + '/' + d + ']';
    const lines = (arr, extra) => Object.assign({ kind: 'lines', lines: arr }, extra || {});
    const kit = () => MPCoach.fracKit;
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

    MPCoach.register('conv', (q) => {
        const { dir, n, d, decimal, pct } = q;
        const K = kit();
        let steps;
        switch (dir) {
            case 'frac-to-decimal':
                steps = [{ say: 'A fraction bar means divide. So ' + n + '/' + d + ' is ' + n + ' ÷ ' + d + '.', scene: lines([F(n, d), 'means', n + ' ÷ ' + d]) }]
                    .concat(K.divideSteps(n, d, String(decimal), 3, ''));
                break;
            case 'decimal-to-frac': {
                const k = (String(decimal).split('.')[1] || '').length;
                const den = Math.pow(10, k), top = Math.round(decimal * den);
                steps = [{ say: 'Read the decimal as a fraction. ' + decimal + ' has ' + k + ' decimal place' + (k > 1 ? 's' : '') + ', so the bottom is ' + den + ' and the top is the digits: ' + top + '/' + den + '.',
                    scene: lines(['{y:' + decimal + '}', k + ' decimal place' + (k > 1 ? 's' : '') + ' → bottom {b:' + den + '}', '{a:' + top + '} over {b:' + den + '}', F(top, den)]) }]
                    .concat(K.finish(top, den, { n, d }));
                break;
            }
            case 'frac-to-percent': {
                const k = 100 / d;
                steps = [{ say: 'Percent means “out of 100”. Make the bottom of ' + n + '/' + d + ' into 100. ' + d + ' × ' + k + ' = 100, so multiply the top and the bottom by ' + k + '.',
                    scene: lines(['{y:' + F(n, d) + '}', '× {b:' + k + '} top and bottom', F(n * k, 100)]) },
                    { say: n + ' × ' + k + ' = ' + n * k + ', so it is ' + n * k + ' out of 100, which is ' + pct + '%.', scene: lines([F(n * k, 100) + ' = {c:' + pct + '%}']) }];
                break;
            }
            case 'percent-to-frac': {
                steps = [{ say: 'Percent means “out of 100”. So ' + pct + '% is ' + pct + '/100.', scene: lines(['{y:' + pct + '%}', 'out of 100', F(pct, 100)]) }]
                    .concat(K.finish(pct, 100, { n, d }));
                break;
            }
            case 'decimal-to-percent': {
                const txt = String(decimal);
                steps = [{ say: 'To change a decimal into a percent, move the decimal point two places to the right. That is the same as multiplying by 100.',
                    scene: lines(['{y:' + txt + '}', 'move the point {b:2 places right}', '{c:' + pct + '%}']) },
                    { say: txt + ' becomes ' + pct + '%.', scene: lines([txt + '  →  {c:' + pct + '%}']) }];
                break;
            }
            default: {
                const txt = String(decimal);
                steps = [{ say: 'To change a percent into a decimal, move the decimal point two places to the left. That is the same as dividing by 100.',
                    scene: lines(['{y:' + pct + '%}', 'move the point {b:2 places left}', '{c:' + txt + '}']) },
                    { say: pct + '% becomes ' + txt + '.', scene: lines([pct + '%  →  {c:' + txt + '}']) }];
            }
        }
        const title = { 'frac-to-decimal': n + '/' + d + ' as a decimal', 'decimal-to-frac': decimal + ' as a fraction', 'frac-to-percent': n + '/' + d + ' as a percent',
            'percent-to-frac': pct + '% as a fraction', 'decimal-to-percent': decimal + ' as a percent', 'percent-to-decimal': pct + '% as a decimal' }[dir];
        return { title, steps };
    });
})();
