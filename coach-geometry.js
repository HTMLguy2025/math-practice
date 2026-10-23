// Worked examples for geometry.html.
//   geo-area       {shape:'rectangle'|'square'|'triangle'|'right-triangle'|'circle', w,h | s | b,h | a,b | r,fromD}
//   geo-perimeter  {shape:'rectangle'|'square'|'triangle'|'circle', w,h | s | a,b,c | r}
//   geo-volume     {l, w, h}
//   geo-symmetry   {shape:'equilateral'|'isosceles'|'scalene'|'right'|'rectangle'|'square', count}
//   geo-classify   {shape, mode:'triangle'|'polygon', answer}
//   geo-angle      {deg}
//   geo-coord      {x, y}
// The multiplying inside a formula reuses the coach's paper working (coach-arith.js).
(() => {
    'use strict';

    const lines = (arr, extra) => Object.assign({ kind: 'lines', lines: arr }, extra || {});
    const M = (s) => String(s).replace(/-/g, '−');

    // the paper working for a × b, but only when it is more than a times-table fact
    const times = (a, b) => {
        if (a < 10 && b < 10) return [];
        const L = MPCoach.arith({ kind: 'arith', op: 'multiply', a, b, digits: 2 });
        return L ? L.steps : [];
    };
    const timesDec = (a, b) => {
        const L = MPCoach.arith({ kind: 'arith', op: 'multiply', a, b, digits: 3 });
        return L ? L.steps : [];
    };
    const round2 = (x) => Math.round(x * 100) / 100;

    // ---------------- area ----------------
    MPCoach.register('geo-area', (q) => {
        const { shape } = q;
        if (shape === 'rectangle' || shape === 'square') {
            const w = shape === 'square' ? q.s : q.w, h = shape === 'square' ? q.s : q.h;
            const ans = w * h;
            const steps = [{ say: 'Area is the space inside a shape. For a ' + shape + ', area = ' + (shape === 'square' ? 'side × side' : 'length × width') + '. This one is ' + w + ' by ' + h + '.',
                scene: { kind: 'rect', w, h, show: 'dims' } }];
            if (ans <= 30) steps.push({ say: 'Count the squares that fit inside: ' + h + ' rows with ' + w + ' squares in each row. ' + h + ' × ' + w + ' = ' + ans + '.',
                scene: { kind: 'rect', w, h, show: 'area' } });
            else steps.push({ say: 'Multiply: ' + w + ' × ' + h + ' = ' + ans + '.', scene: lines(['{y:area = ' + (shape === 'square' ? 'side × side' : 'length × width') + '}', w + ' × ' + h + ' = {c:' + ans + '}']) });
            const t = times(w, h);
            return { title: 'Area of a ' + shape + ': ' + w + ' × ' + h, steps: steps.concat(t.length ? t : [{ say: 'The area is ' + ans + ' square units.', scene: lines(['{c:' + ans + '} square units']) }]) };
        }
        if (shape === 'triangle' || shape === 'right-triangle') {
            const b = shape === 'triangle' ? q.b : q.a, h = shape === 'triangle' ? q.h : q.b;
            const prod = b * h, ans = prod / 2;
            const names = shape === 'triangle' ? ['base', 'height'] : ['one short side', 'the other short side'];
            const steps = [{ say: 'A triangle is exactly half of a rectangle with the same ' + (shape === 'triangle' ? 'base and height' : 'two short sides') + '. So its area is ' + (shape === 'triangle' ? 'base × height ÷ 2' : 'the two short sides multiplied, ÷ 2') + '.',
                scene: { kind: 'rect', w: b, h, show: 'half', topLabel: shape === 'triangle' ? 'base ' + b : String(b), sideLabel: String(h), eq: b + ' × ' + h + ' ÷ 2' } }];
            steps.push({ say: 'First multiply: ' + b + ' × ' + h + ' = ' + prod + '.', scene: lines(['{y:' + b + ' × ' + h + ' ÷ 2}', b + ' × ' + h + ' = {b:' + prod + '}']) });
            const t = times(b, h);
            return { title: 'Area of a triangle: ' + b + ' and ' + h, steps: steps.concat(t).concat([{ say: 'Then cut it in half: ' + prod + ' ÷ 2 = ' + ans + '. The area is ' + ans + '.', scene: lines([prod + ' ÷ 2 = {c:' + ans + '}']) }]) };
        }
        // circle
        const r = q.r;
        const steps = [];
        if (q.fromD) steps.push({ say: 'The line across the whole circle is the diameter: ' + q.fromD + '. The radius is half of that: ' + q.fromD + ' ÷ 2 = ' + r + '.',
            scene: lines(['{y:diameter = ' + q.fromD + '}', q.fromD + ' ÷ 2 = {b:radius ' + r + '}']) });
        else steps.push({ say: 'The radius goes from the center to the edge. Here the radius is ' + r + '.', scene: { kind: 'circle', show: 'parts' } });
        steps.push({ say: 'The area of a circle is π × r × r, and we use π = 3.14. First work out r × r: ' + r + ' × ' + r + ' = ' + r * r + '.',
            scene: lines(['{y:area = π × r × r}', 'π ≈ {b:3.14}', r + ' × ' + r + ' = {a:' + r * r + '}']) });
        const ans = round2(3.14 * r * r);
        const more = r * r === 1 ? [] : [{ say: 'Now multiply 3.14 × ' + r * r + '.', scene: lines(['3.14 × ' + r * r]) }].concat(timesDec(3.14, r * r));
        return { title: 'Area of a circle, radius ' + r, steps: steps.concat(more).concat([{ say: 'The area is ' + ans + '.', scene: lines(['{c:' + ans + '}']) }]) };
    });

    // ---------------- perimeter ----------------
    MPCoach.register('geo-perimeter', (q) => {
        const { shape } = q;
        if (shape === 'rectangle') {
            const { w, h } = q, ans = 2 * (w + h);
            return { title: 'Perimeter of a rectangle: ' + w + ' by ' + h, steps: [
                { say: 'Perimeter is the distance around the outside. Walk around the rectangle and add all four sides.', scene: { kind: 'rect', w, h, show: 'perimeter' } },
                { say: 'Opposite sides are equal, so: ' + w + ' + ' + h + ' + ' + w + ' + ' + h + ' = ' + ans + '. A shortcut: 2 × (' + w + ' + ' + h + ') = 2 × ' + (w + h) + ' = ' + ans + '.',
                  scene: lines(['{y:perimeter = 2 × (length + width)}', '2 × (' + w + ' + ' + h + ')', '= 2 × ' + (w + h) + ' = {c:' + ans + '}']) }] };
        }
        if (shape === 'square') {
            const s = q.s, ans = 4 * s;
            return { title: 'Perimeter of a square: side ' + s, steps: [
                { say: 'A square has 4 sides that are all the same. Perimeter means all the way around, so add them up.', scene: { kind: 'rect', w: s, h: s, show: 'perimeter' } },
                { say: s + ' + ' + s + ' + ' + s + ' + ' + s + ' = ' + ans + ', which is 4 × ' + s + '.', scene: lines(['4 × ' + s + ' = {c:' + ans + '}']) }] };
        }
        if (shape === 'triangle') {
            const { a, b, c } = q, ans = a + b + c;
            return { title: 'Perimeter of a triangle', steps: [
                { say: 'Perimeter is the distance around the outside. Add the three sides: ' + a + ', ' + b + ' and ' + c + '.', scene: lines(['{y:perimeter of a triangle}', '{a:' + a + '} + {b:' + b + '} + {c:' + c + '}']) },
                { say: a + ' + ' + b + ' = ' + (a + b) + ', and ' + (a + b) + ' + ' + c + ' = ' + ans + '.', scene: { kind: 'columns', op: '+', a: String(a + b), b: String(c), upto: 2, done: true } }] };
        }
        const r = q.r, raw = round2(2 * 3.14 * r), ans = Math.round(2 * 3.14 * r);
        return { title: 'Circumference with radius ' + r, steps: [
            { say: 'The distance around a circle is called the circumference. The formula is C = 2 × π × r, with π = 3.14. The radius is ' + r + '.',
              scene: lines(['{y:C = 2 × π × r}', 'r = {a:' + r + '}', '2 × 3.14 = {b:6.28}']) },
            { say: 'Multiply 6.28 × ' + r + '.', scene: lines(['6.28 × ' + r]) }]
            .concat(timesDec(6.28, r))
            .concat([{ say: 'That is ' + raw + '. The question asks us to round to the nearest whole number, so the answer is ' + ans + '.', scene: lines([raw + ' → {c:' + ans + '}']) }]) };
    });

    // ---------------- volume ----------------
    MPCoach.register('geo-volume', (q) => {
        const { l, w, h } = q, base = l * w, ans = base * h;
        return { title: 'Volume: ' + l + ' × ' + w + ' × ' + h, steps: [
            { say: 'Volume is how many little cubes fill the box. The bottom layer has ' + l + ' × ' + w + ' = ' + base + ' cubes.', scene: { kind: 'prism', l, w, h, layers: 1, eq: l + ' × ' + w + ' = ' + base + ' per layer' } },
            { say: 'The box is ' + h + ' layers tall, so there are ' + h + ' layers of ' + base + ' cubes. Multiply: ' + base + ' × ' + h + ' = ' + ans + '.', scene: lines(['{y:volume = length × width × height}', '{a:' + l + '} × {b:' + w + '} × {c:' + h + '}', base + ' × ' + h + ' = {c:' + ans + '}']) }]
            .concat(times(base, h)) };
    });

    // ---------------- symmetry ----------------
    MPCoach.register('geo-symmetry', (q) => {
        const { shape, count } = q;
        const intro = 'A line of symmetry is a line where you can fold the shape and both halves match exactly. ';
        const steps = [];
        if (shape === 'rectangle') steps.push({ say: intro + 'A rectangle can fold down the middle, and across the middle. That is 2 lines.', scene: { kind: 'symmetry', shape: 'rectangle', lines: ['v', 'h'], count: 2 } },
            { say: 'The corner-to-corner lines do not work. The two halves would not match.', scene: { kind: 'symmetry', shape: 'rectangle', wrong: 'd1' } });
        else if (shape === 'square') steps.push({ say: intro + 'A square folds down the middle and across the middle, and also along both corner-to-corner lines. That is 4 lines.', scene: { kind: 'symmetry', shape: 'square', lines: ['v', 'h', 'd1', 'd2'], count: 4 } });
        else if (shape === 'isosceles') steps.push({ say: intro + 'A triangle with two equal sides folds straight down the middle. That is just 1 line.', scene: { kind: 'symmetry', shape: 'triangle', fold: 'v' } },
            { say: 'No other fold makes the halves match, so there is 1 line of symmetry.', scene: { kind: 'symmetry', shape: 'triangle', lines: ['v'], count: 1 } });
        else if (shape === 'equilateral') steps.push({ say: 'All three sides of this triangle are equal. The little tick marks show it.', scene: { kind: 'polygon', sides: 3, ticks: [1, 1, 1], name: 'equilateral' } },
            { say: intro + 'You can fold from each corner to the middle of the opposite side. That is 3 different folds, so 3 lines of symmetry.', scene: lines(['{y:3 equal sides}', '1 fold from each corner', '{c:3 lines of symmetry}']) });
        else if (shape === 'scalene') steps.push({ say: 'All three sides are different lengths. The tick marks show it.', scene: { kind: 'polygon', points: 'scalene', ticks: [1, 2, 3], name: 'scalene' } },
            { say: intro + 'With no two sides equal, no fold makes the halves match. So there are 0 lines of symmetry.', scene: lines(['{y:no equal sides}', '{c:0 lines of symmetry}']) });
        else steps.push({ say: 'This right triangle has sides of different lengths, so it is lopsided.', scene: { kind: 'polygon', points: 'right', rightAngles: true, name: 'right triangle' } },
            { say: intro + 'Because its sides are all different, no fold makes the halves match. So there are 0 lines of symmetry.', scene: lines(['{y:sides all different}', '{c:0 lines of symmetry}']) });
        return { title: 'Lines of symmetry', steps };
    });

    // ---------------- classifying shapes ----------------
    const TRI = {
        equilateral: { scene: { kind: 'polygon', sides: 3, ticks: [1, 1, 1] }, say: 'All three sides have the same length, shown by the matching tick marks. A triangle with 3 equal sides is equilateral.' },
        isosceles: { scene: { kind: 'polygon', points: 'isosceles', ticks: [1, 0, 1] }, say: 'Two of the sides have the same length, shown by the matching tick marks. A triangle with exactly 2 equal sides is isosceles.' },
        scalene: { scene: { kind: 'polygon', points: 'scalene', ticks: [1, 2, 3] }, say: 'All three sides are different lengths. A triangle with no equal sides is scalene.' },
        right: { scene: { kind: 'polygon', points: 'right', rightAngles: true }, say: 'One corner is a perfect square corner, 90°, marked with a little square. A triangle with a square corner is a right triangle.' },
    };
    MPCoach.register('geo-classify', (q) => {
        if (q.mode === 'triangle') {
            const t = TRI[q.shape];
            return { title: 'Classifying a triangle', steps: [
                { say: 'We name triangles by their sides, or by a square corner. Look carefully at this one.', scene: Object.assign({}, t.scene) },
                { say: t.say, scene: Object.assign({ name: q.answer.toLowerCase() }, t.scene) }] };
        }
        const sides = { Triangle: 3, Quadrilateral: 4, Pentagon: 5, Hexagon: 6 }[q.answer];
        const scene = sides === 4 ? { kind: 'polygon', points: 'square', count: true, name: 'quadrilateral' } : { kind: 'polygon', sides, count: true, name: q.answer.toLowerCase() };
        return { title: 'What type of polygon', steps: [
            { say: 'Count the sides, one by one. This shape has ' + sides + ' sides.', scene },
            { say: 'A shape with ' + sides + ' sides is called a ' + q.answer.toLowerCase() + '. (3 sides: triangle, 4: quadrilateral, 5: pentagon, 6: hexagon.)', scene: lines(['3 sides: triangle', '4 sides: quadrilateral', '5 sides: pentagon', '6 sides: hexagon'], { size: 'small' }) }] };
    });

    // ---------------- angles ----------------
    MPCoach.register('geo-angle', (q) => {
        const { deg } = q;
        const kind = deg < 90 ? 'acute (smaller than a square corner)' : 'obtuse (wider than a square corner)';
        return { title: 'Measuring an angle', steps: [
            { say: 'First, a quick check. A square corner is 90°. This angle is ' + (deg < 90 ? 'narrower than a square corner, so it is less than 90°' : 'wider than a square corner, so it is more than 90°') + ': it is ' + kind + '.',
              scene: { kind: 'angle', deg, hideDeg: true } },
            { say: 'Now measure it. Put the middle of a protractor on the corner and line one ray up with 0°. Read the number where the other ray crosses the scale. It points at ' + deg + '°.',
              scene: { kind: 'angle', deg, protractor: true } }] };
    });

    // ---------------- coordinates ----------------
    MPCoach.register('geo-coord', (q) => {
        const { x, y } = q;
        const across = x === 0 ? 'we do not move across' : (x > 0 ? x + ' to the right' : Math.abs(x) + ' to the left');
        const upDown = y === 0 ? 'we do not move up or down' : (y > 0 ? 'up ' + y : 'down ' + Math.abs(y));
        return { title: 'Reading a point: (' + M(x) + ', ' + M(y) + ')', steps: [
            { say: 'A point is written (x, y). Start at the origin, where the two number lines cross. Go across first (that is x), then up or down (that is y).',
              scene: { kind: 'coordplane' } },
            { say: 'Across: ' + across + '. Then ' + upDown + '. The point is at (' + M(x) + ', ' + M(y) + '). Type the x first, then the y.',
              scene: { kind: 'coordplane', walk: { x, y } } }] };
    });
})();
