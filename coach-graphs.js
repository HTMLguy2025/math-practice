// Worked examples for graphs.html.
//   graph  {type:'bar'|'picture'|'pie', cats (full names), vals, scale, qType:'howmany'|'mostleast'|'diff'|'total',
//           hl, i, j, most, title, unit, answer}
// Bars and pictures: vals are the real numbers (pictures are `scale` each). Pies: vals add up to 20, so each is 5%.
(() => {
    'use strict';

    const lines = (arr, extra) => Object.assign({ kind: 'lines', lines: arr }, extra || {});

    const scene = (q, highlight, eq, read) => {
        const hl = highlight === undefined ? undefined : highlight;
        if (q.type === 'bar') {
            const max = Math.max(...q.vals), top = Math.ceil(max / q.scale) * q.scale;
            return { kind: 'bargraph', title: q.title, cats: q.cats.map(c => c.slice(0, 5)), vals: q.vals, max: top, step: q.scale, highlight: hl, read, eq };
        }
        if (q.type === 'picture') {
            const unit = q.unit || 'each';
            return { kind: 'picturegraph', title: q.title, unit: q.scale === 1 ? unit.replace(/s$/, '') : unit, each: q.scale, highlight: hl, eq,
                rows: q.cats.map((c, k) => ({ name: c.slice(0, 5), n: q.vals[k] / q.scale })) };
        }
        return { kind: 'piegraph', slices: q.cats.map((c, k) => ({ name: c, pct: q.vals[k] * 5 })), highlight: hl, eq };
    };

    const unitWord = (q) => (q.type === 'bar' ? 'the number on the side' : q.type === 'picture' ? 'the pictures' : 'the percent');

    MPCoach.register('graph', (q) => {
        const { cats, vals, scale, qType, type } = q;
        const pie = type === 'pie';
        const val = (k) => (pie ? vals[k] * 5 : vals[k]);
        const unit = pie ? '%' : '';
        const steps = [];

        if (pie) steps.push({ say: 'The numbers in the pie add up to 20. The whole pie is 100%, and 100% ÷ 20 = 5%. So each number is worth 5%: multiply a slice’s number by 5 to get its percent.',
            scene: lines(['{y:the whole pie = 100%}', '100% ÷ 20 = {b:5%} for each', 'number × 5 = percent']) });

        if (qType === 'howmany') {
            const k = q.hl, n = vals[k] / (scale || 1);
            if (pie) steps.push({ say: 'Find the ' + cats[k] + ' slice. Its number is ' + vals[k] + ', and ' + vals[k] + ' × 5 = ' + val(k) + '%.', scene: scene(q, k, vals[k] + ' × 5 = ' + val(k) + '%') });
            else if (type === 'bar') steps.push({ say: 'Find the bar for ' + cats[k] + ' along the bottom. Look at the top of the bar, then straight across to the numbers on the side. It reaches ' + vals[k] + '.', scene: scene(q, k, undefined, k) });
            else steps.push({ say: 'Find the ' + cats[k] + ' row and count its pictures: ' + n + '.' + (scale > 1 ? ' Each picture is worth ' + scale + ', so ' + n + ' × ' + scale + ' = ' + vals[k] + '.' : ''), scene: scene(q, k, scale > 1 ? n + ' × ' + scale + ' = ' + vals[k] : undefined) });
        } else if (qType === 'mostleast') {
            const k = vals.indexOf(q.most ? Math.max(...vals) : Math.min(...vals));
            steps.push({ say: 'Compare all of them. The ' + (q.most ? 'most' : 'fewest') + ' is the ' + (type === 'bar' ? (q.most ? 'tallest bar' : 'shortest bar') : type === 'picture' ? (q.most ? 'row with the most pictures' : 'row with the fewest pictures') : (q.most ? 'biggest slice' : 'smallest slice')) + '. That is ' + cats[k] + ', with ' + val(k) + unit + '.',
                scene: scene(q, k) });
        } else {
            const i = q.i, j = q.j;
            const big = vals[i] >= vals[j] ? i : j, small = big === i ? j : i;
            if (qType === 'diff') {
                steps.push({ say: 'First read both. ' + cats[big] + ' is ' + val(big) + unit + ' and ' + cats[small] + ' is ' + val(small) + unit + '.', scene: scene(q, [big, small]) });
                steps.push({ say: '“How many more” means subtract the smaller from the bigger: ' + val(big) + ' − ' + val(small) + ' = ' + (val(big) - val(small)) + unit + '.',
                    scene: lines(['{y:how many more?}', '{a:' + val(big) + unit + '} − {b:' + val(small) + unit + '}', '= {c:' + (val(big) - val(small)) + unit + '}']) });
            } else {
                steps.push({ say: 'First read both. ' + cats[i] + ' is ' + val(i) + unit + ' and ' + cats[j] + ' is ' + val(j) + unit + '.', scene: scene(q, [i, j]) });
                steps.push({ say: '“Combined” means add them together: ' + val(i) + ' + ' + val(j) + ' = ' + (val(i) + val(j)) + unit + '.',
                    scene: lines(['{y:combined?}', '{a:' + val(i) + unit + '} + {b:' + val(j) + unit + '}', '= {c:' + (val(i) + val(j)) + unit + '}']) });
            }
        }
        return { title: 'Reading the graph', steps };
    });
})();
